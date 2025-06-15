
import { generateCorrelationId, retryWithBackoff } from './tracing';
import { insertSessionLog, insertErrorLog } from './supabase';

// Discovery Funnel API Types
export interface ValidateInputRequest {
  businessType: string;
  otherType?: string;
  primaryChallenge: string;
  preferredTone: string;
  customTone?: string;
  desiredOutcome: string;
}

export interface ValidateInputResponse {
  valid: boolean;
  feedback: string;
  trustScore: number;
}

export interface GenerateTooltipRequest {
  field: string;
}

export interface GenerateTooltipResponse {
  tooltip: string;
  error: null | string;
}

export interface DetectContradictionRequest {
  preferredTone: string;
  desiredOutcome: string;
}

export interface DetectContradictionResponse {
  contradiction: boolean;
  message?: string;
  error: null | string;
}

// Base API configuration
const API_BASE = process.env.VITE_API_BASE || '/v1';
const DEFAULT_TIMEOUT = 5000;

// Generic fetch wrapper with retry logic and correlation ID
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

// Discovery Funnel API Functions
export const validateInput = async (data: ValidateInputRequest): Promise<ValidateInputResponse> => {
  console.log('[API] POST /v1/validate-input called with:', data);
  
  try {
    // TODO: Replace with actual backend endpoint
    const response = await apiCall<ValidateInputResponse>('/validate-input', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    console.log('[API] Input validation response:', response);
    return response;
    
  } catch (error) {
    console.warn('[API] validateInput failed, using fallback:', error);
    
    // Fallback: Generate trust score based on input quality
    const trustScore = calculateFallbackTrustScore(data);
    
    // Log error
    await logError({
      error_message: error instanceof Error ? error.message : 'Unknown error',
      action: 'validate_input',
      error_type: 'timeout'
    });
    
    return {
      valid: trustScore >= 50,
      feedback: trustScore >= 50 ? 'Input looks good!' : 'Please provide more specific details',
      trustScore
    };
  }
};

export const generateTooltip = async (data: GenerateTooltipRequest): Promise<GenerateTooltipResponse> => {
  console.log('[API] POST /v1/generate-tooltip called with:', data);
  
  try {
    // TODO: Replace with actual GPT-4o integration
    const response = await apiCall<GenerateTooltipResponse>('/generate-tooltip', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    console.log('[API] Tooltip generated:', response);
    return response;
    
  } catch (error) {
    console.warn('[API] generateTooltip failed, using fallback:', error);
    
    // Fallback: Static tooltips based on field
    const fallbackTooltips: Record<string, string> = {
      businessType: "E.g., artisanal bakery, tech startup, consulting firm",
      primaryChallenge: "Your biggest obstacle (e.g., need $75k funding)",
      preferredTone: "How your plan should sound (e.g., warm = heartfelt)",
      desiredOutcome: "Your main goal (e.g., secure Series A funding)"
    };
    
    return {
      tooltip: fallbackTooltips[data.field] || "Helpful information for this field",
      error: null
    };
  }
};

export const detectContradiction = async (data: DetectContradictionRequest): Promise<DetectContradictionResponse> => {
  console.log('[API] POST /v1/detect-contradiction called with:', data);
  
  try {
    // TODO: Replace with actual backend endpoint
    const response = await apiCall<DetectContradictionResponse>('/detect-contradiction', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    console.log('[API] Contradiction detection response:', response);
    return response;
    
  } catch (error) {
    console.warn('[API] detectContradiction failed, using fallback:', error);
    
    // Fallback: Simple contradiction detection
    const contradiction = detectFallbackContradiction(data);
    
    return {
      contradiction: contradiction.hasContradiction,
      message: contradiction.message,
      error: null
    };
  }
};

// Fallback trust score calculation
const calculateFallbackTrustScore = (data: ValidateInputRequest): number => {
  let score = 0;
  
  // Business type selected: +20
  if (data.businessType && data.businessType !== '') score += 20;
  
  // Challenge length and specificity: +30
  if (data.primaryChallenge) {
    if (data.primaryChallenge.length >= 10) score += 15;
    if (data.primaryChallenge.length >= 20) score += 15;
    if (/\d/.test(data.primaryChallenge)) score += 10; // Contains numbers
  }
  
  // Tone selection: +20
  if (data.preferredTone && data.preferredTone !== '') score += 20;
  
  // Custom tone specificity: +10
  if (data.preferredTone === 'custom' && data.customTone && data.customTone.length > 5) {
    score += 10;
  }
  
  // Outcome selection: +20
  if (data.desiredOutcome && data.desiredOutcome !== '') score += 20;
  
  return Math.min(score, 100);
};

// Fallback contradiction detection
const detectFallbackContradiction = (data: DetectContradictionRequest): { hasContradiction: boolean; message?: string } => {
  const tone = data.preferredTone.toLowerCase();
  const outcome = data.desiredOutcome.toLowerCase();
  
  // Check for tone-outcome mismatches
  if (tone === 'playful' && outcome.includes('funding')) {
    return {
      hasContradiction: true,
      message: "A playful tone might not be ideal for securing funding. Consider 'professional' or 'optimistic' instead."
    };
  }
  
  if (tone === 'bold' && outcome.includes('improve operations')) {
    return {
      hasContradiction: true,
      message: "For operational improvements, consider a 'professional' or 'warm' tone instead of bold."
    };
  }
  
  return { hasContradiction: false };
};

// Error logging
const logError = async (errorData: {
  error_message: string;
  action: string;
  error_type: 'timeout' | 'invalid_input' | 'stripe_failure' | 'low_confidence' | 'contradiction' | 'nsfw' | 'token_limit';
}) => {
  try {
    await insertErrorLog({
      ...errorData,
      user_id: undefined // Will be set by auth context if available
    });
  } catch (error) {
    console.error('[API] Failed to log error:', error);
  }
};
