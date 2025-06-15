
import { generateCorrelationId, retryWithBackoff } from './tracing';
import { insertInitialPromptLog, insertErrorLog } from './supabase';
import { triggerMakecomWorkflow } from './makecom';

// Discovery Funnel API Types
export interface ValidationRequest {
  businessType: string;
  otherType?: string;
  primaryChallenge: string;
  preferredTone: string;
  customTone?: string;
  desiredOutcome: string;
}

export interface ValidationResponse {
  valid: boolean;
  feedback: string;
  trustScore: number;
}

export interface TooltipRequest {
  field: string;
}

export interface TooltipResponse {
  tooltip: string;
  error: null | string;
}

export interface ContradictionRequest {
  preferredTone: string;
  desiredOutcome: string;
}

export interface ContradictionResponse {
  contradiction: boolean;
  message: string;
  error: null | string;
}

// Base API configuration
const API_BASE = import.meta.env.VITE_API_BASE || '/v1';
const DEFAULT_TIMEOUT = 2000;

// Generic fetch wrapper with retry logic
const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE}${endpoint}`;
  
  return retryWithBackoff(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
          'X-Correlation-ID': generateCorrelationId(),
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  });
};

// Validate user input
export const validateInput = async (data: ValidationRequest): Promise<ValidationResponse> => {
  console.log('[Discovery API] POST /v1/validate-input called with:', data);
  
  try {
    // TODO: Replace with actual backend endpoint
    const response = await apiCall<ValidationResponse>('/validate-input', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    console.log('[Discovery API] Validation response:', response);
    
    // Log to Make.com workflow
    await triggerMakecomWorkflow('USER_INTERACTION', {
      action: 'validate_input',
      request_data: data,
      response_data: response,
    });
    
    return response;
    
  } catch (error) {
    console.warn('[Discovery API] validateInput failed, using fallback:', error);
    
    // Fallback: Generate trust score based on input completeness
    const fallbackResponse = generateFallbackValidation(data);
    
    // Log error
    await logDiscoveryError({
      error_message: error instanceof Error ? error.message : 'Unknown error',
      action: 'validate_input',
      error_type: 'timeout'
    });
    
    return fallbackResponse;
  }
};

// Generate tooltip for field
export const generateTooltip = async (data: TooltipRequest): Promise<TooltipResponse> => {
  console.log('[Discovery API] POST /v1/generate-tooltip called with:', data);
  
  try {
    // TODO: Replace with actual backend endpoint
    const response = await apiCall<TooltipResponse>('/generate-tooltip', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    console.log('[Discovery API] Tooltip response:', response);
    return response;
    
  } catch (error) {
    console.warn('[Discovery API] generateTooltip failed, using fallback:', error);
    
    // Fallback: Static tooltips
    const fallbackTooltip = getFallbackTooltip(data.field);
    
    return {
      tooltip: fallbackTooltip,
      error: null
    };
  }
};

// Detect contradiction between tone and outcome
export const detectContradiction = async (data: ContradictionRequest): Promise<ContradictionResponse> => {
  console.log('[Discovery API] POST /v1/detect-contradiction called with:', data);
  
  try {
    // TODO: Replace with actual backend endpoint
    const response = await apiCall<ContradictionResponse>('/detect-contradiction', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    console.log('[Discovery API] Contradiction response:', response);
    return response;
    
  } catch (error) {
    console.warn('[Discovery API] detectContradiction failed, using fallback:', error);
    
    // Fallback: Simple contradiction detection
    const contradiction = checkSimpleContradiction(data.preferredTone, data.desiredOutcome);
    
    return {
      contradiction: contradiction.hasContradiction,
      message: contradiction.message,
      error: null
    };
  }
};

// Log user input to Supabase
export const logUserInput = async (inputData: {
  user_id?: string;
  payload: ValidationRequest;
  trust_score?: number;
  custom_tone?: string;
  other_type?: string;
}): Promise<void> => {
  try {
    await insertInitialPromptLog({
      user_id: inputData.user_id,
      payload: inputData.payload,
      trust_score: inputData.trust_score,
      custom_tone: inputData.custom_tone,
      other_type: inputData.other_type,
    });
    console.log('[Discovery API] User input logged successfully');
  } catch (error) {
    console.error('[Discovery API] Failed to log user input:', error);
    
    // F2-E1: Fallback to localStorage
    try {
      const fallbackData = {
        ...inputData,
        timestamp: new Date().toISOString(),
        fallback_reason: 'supabase_error'
      };
      
      const existingData = JSON.parse(localStorage.getItem('canai_discovery_fallback') || '[]');
      existingData.push(fallbackData);
      localStorage.setItem('canai_discovery_fallback', JSON.stringify(existingData));
      
      console.log('[F2-E1] User input saved to localStorage fallback');
    } catch (storageError) {
      console.error('[F2-E1] localStorage fallback failed:', storageError);
    }
  }
};

// Fallback validation logic
const generateFallbackValidation = (data: ValidationRequest): ValidationResponse => {
  let trustScore = 0;
  let feedback = '';
  
  // Score based on completeness
  if (data.businessType && data.businessType !== '') trustScore += 20;
  if (data.primaryChallenge && data.primaryChallenge.length > 10) trustScore += 30;
  if (data.preferredTone && data.preferredTone !== '') trustScore += 20;
  if (data.desiredOutcome && data.desiredOutcome !== '') trustScore += 30;
  
  // Adjust for quality
  if (data.primaryChallenge && data.primaryChallenge.length > 50) trustScore += 10;
  if (data.customTone && data.customTone.length > 5) trustScore += 10;
  
  // Generate feedback
  if (trustScore >= 80) {
    feedback = 'Excellent! Your input shows great clarity about your business goals.';
  } else if (trustScore >= 60) {
    feedback = 'Good input! Consider adding more detail to strengthen your plan.';
  } else if (trustScore >= 40) {
    feedback = 'Moderate input. More specificity will help create a better plan.';
  } else {
    feedback = 'Please provide more detailed information for the best results.';
  }
  
  return {
    valid: trustScore >= 40,
    feedback,
    trustScore: Math.min(trustScore, 100)
  };
};

// Fallback tooltip generation
const getFallbackTooltip = (field: string): string => {
  const tooltips: Record<string, string> = {
    businessType: 'Select the category that best describes your business model and industry focus.',
    primaryChallenge: 'Describe the main obstacle preventing your business from reaching its next level of growth.',
    preferredTone: 'Choose the communication style that resonates with your brand and target audience.',
    desiredOutcome: 'Define the specific result you want to achieve with your business strategy.',
    customTone: 'Describe your unique brand voice if none of the preset options fit your style.',
  };
  
  return tooltips[field] || 'Additional guidance to help you provide the most relevant information.';
};

// Simple contradiction detection
const checkSimpleContradiction = (tone: string, outcome: string): { hasContradiction: boolean; message: string } => {
  const contradictions = [
    {
      condition: (t: string, o: string) => t.includes('professional') && o.includes('disrupt'),
      message: 'A professional tone might conflict with disruptive outcomes. Consider "innovative" instead.'
    },
    {
      condition: (t: string, o: string) => t.includes('casual') && o.includes('enterprise'),
      message: 'A casual tone may not align with enterprise-level outcomes. Consider a more professional approach.'
    },
    {
      condition: (t: string, o: string) => t.includes('aggressive') && o.includes('sustainable'),
      message: 'Aggressive tactics might conflict with sustainable growth. Consider balancing intensity with longevity.'
    }
  ];
  
  for (const contradiction of contradictions) {
    if (contradiction.condition(tone.toLowerCase(), outcome.toLowerCase())) {
      return {
        hasContradiction: true,
        message: contradiction.message
      };
    }
  }
  
  return {
    hasContradiction: false,
    message: 'Your tone and outcome are well-aligned.'
  };
};

// Error logging specific to discovery funnel operations
const logDiscoveryError = async (errorData: {
  error_message: string;
  action: string;
  error_type: 'timeout' | 'invalid_input' | 'contradiction';
}): Promise<void> => {
  try {
    await insertErrorLog({
      ...errorData,
      support_request: false,
    });
  } catch (error) {
    console.error('[Discovery API] Failed to log discovery error:', error);
  }
};
