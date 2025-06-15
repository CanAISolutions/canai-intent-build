import { generateCorrelationId, retryWithBackoff } from './tracing';
import { insertSessionLog, insertErrorLog } from './supabase';
import { logSessionToMakecom } from './makecom';

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

export interface MessageResponse {
  messages: { text: string }[];
  error: null | string;
}

export interface LogInteractionRequest {
  user_id?: string;
  interaction_type: string;
  interaction_details: Record<string, any>;
}

export interface PreviewSparkRequest {
  business_type?: string;
  challenge?: string;
  target_audience?: string;
}

export interface PreviewSparkResponse {
  spark: {
    title: string;
    tagline: string;
  };
  error: null | string;
}

// Base API configuration
const API_BASE = import.meta.env.VITE_API_BASE || '/v1';
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

// API Functions
export const getMessages = async (): Promise<MessageResponse> => {
  try {
    // TODO: Replace with actual backend endpoint
    const response = await apiCall<MessageResponse>('/messages');
    console.log('[API] GET /v1/messages response:', response);
    return response;
  } catch (error) {
    console.warn('[API] GET /v1/messages failed, using fallback:', error);
    
    // Fallback: Return static trust indicator messages
    return {
      messages: [
        { text: "CanAI launched my bakery with a $50K plan!" },
        { text: "Generated 847 high-quality business plans" },
        { text: "500+ founders trust CanAI for growth" },
        { text: "Average funding increase: 73%" }
      ],
      error: null
    };
  }
};

export const logInteraction = async (data: LogInteractionRequest): Promise<ApiResponse> => {
  console.log('[API] POST /v1/log-interaction called with:', data);
  
  try {
    // Primary: Log to Supabase directly
    await insertSessionLog({
      user_id: data.user_id,
      interaction_type: data.interaction_type,
      interaction_details: data.interaction_details,
    });

    // Secondary: Trigger Make.com workflow
    await logSessionToMakecom(data);

    console.log('[API] Interaction logged successfully');
    return { error: null };
    
  } catch (error) {
    console.error('[API] logInteraction failed:', error);
    
    // Error logging
    await logError({
      user_id: data.user_id,
      error_message: error instanceof Error ? error.message : 'Unknown error',
      action: 'log_interaction',
      error_type: 'timeout'
    });
    
    return { error: 'Failed to log interaction' };
  }
};

export const generatePreviewSpark = async (data: PreviewSparkRequest): Promise<PreviewSparkResponse> => {
  console.log('[API] POST /v1/generate-preview-spark called with:', data);
  
  try {
    // TODO: Replace with actual GPT-4o integration
    const response = await apiCall<PreviewSparkResponse>('/generate-preview-spark', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    console.log('[API] Preview spark generated:', response);
    return response;
    
  } catch (error) {
    console.warn('[API] generatePreviewSpark failed, using fallback:', error);
    
    // Fallback: Generate contextual spark based on input
    const contextualSpark = generateContextualSpark(data);
    
    return {
      spark: contextualSpark,
      error: null
    };
  }
};

// Fallback spark generation based on business type
const generateContextualSpark = (data: PreviewSparkRequest): { title: string; tagline: string } => {
  const businessType = data.business_type?.toLowerCase() || '';
  
  if (businessType.includes('tech') || businessType.includes('software')) {
    return {
      title: "AI-Powered Tech Strategy",
      tagline: "Scale your innovation with intelligent growth frameworks"
    };
  } else if (businessType.includes('retail') || businessType.includes('ecommerce')) {
    return {
      title: "Omnichannel Growth Engine",
      tagline: "Transform customer experiences across every touchpoint"
    };
  } else if (businessType.includes('service') || businessType.includes('consulting')) {
    return {
      title: "Premium Service Blueprint",
      tagline: "Elevate your expertise into premium offerings"
    };
  } else {
    return {
      title: "Visionary Business Strategy",
      tagline: "Unlock your potential with data-driven insights"
    };
  }
};

// Error logging to Supabase and Make.com
export const logError = async (errorData: {
  user_id?: string;
  error_message: string;
  action: string;
  error_type: 'timeout' | 'invalid_input' | 'stripe_failure' | 'low_confidence' | 'contradiction' | 'nsfw' | 'token_limit';
}): Promise<void> => {
  try {
    // Log to Supabase
    await insertErrorLog(errorData);
    
    // Log to Make.com workflow
    const { logErrorToMakecom } = await import('./makecom');
    await logErrorToMakecom(errorData);
    
    console.log('[API] Error logged successfully:', errorData);
  } catch (error) {
    console.error('[API] Failed to log error:', error);
  }
};
