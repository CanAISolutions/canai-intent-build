
import { generateCorrelationId, retryWithBackoff } from './tracing';

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
const API_BASE = '/v1';
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
  // TODO: Implement GET /v1/messages endpoint
  console.log('[API] GET /v1/messages called');
  
  // Mock response for now
  return {
    messages: [
      { text: "Welcome to CanAI Emotional Sovereignty Platform" },
      { text: "Transform your vision into reality with AI-crafted solutions" }
    ],
    error: null
  };
};

export const logInteraction = async (data: LogInteractionRequest): Promise<ApiResponse> => {
  // TODO: Implement POST /v1/log-interaction endpoint
  console.log('[API] POST /v1/log-interaction called with:', data);
  
  try {
    // Mock API call - replace with actual implementation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Log to Supabase session_logs table
    console.log('[Supabase] Logging to session_logs:', {
      user_id: data.user_id || 'anonymous',
      interaction_type: data.interaction_type,
      interaction_details: data.interaction_details,
      created_at: new Date().toISOString()
    });
    
    return { error: null };
  } catch (error) {
    console.error('[API] logInteraction failed:', error);
    return { error: 'Failed to log interaction' };
  }
};

export const generatePreviewSpark = async (data: PreviewSparkRequest): Promise<PreviewSparkResponse> => {
  // TODO: Implement POST /v1/generate-preview-spark endpoint
  console.log('[API] POST /v1/generate-preview-spark called with:', data);
  
  try {
    // Mock response - replace with actual GPT-4o integration
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      spark: {
        title: "AI-Powered Growth Strategy",
        tagline: "Unlock your business potential with intelligent insights"
      },
      error: null
    };
  } catch (error) {
    console.error('[API] generatePreviewSpark failed:', error);
    return {
      spark: { title: "", tagline: "" },
      error: 'Failed to generate preview spark'
    };
  }
};

// Error logging to Supabase
export const logError = async (errorData: {
  user_id?: string;
  error_message: string;
  action: string;
  error_type: 'timeout' | 'invalid_input' | 'stripe_failure' | 'low_confidence' | 'contradiction' | 'nsfw' | 'token_limit';
}): Promise<void> => {
  console.log('[Supabase] Logging error to error_logs:', errorData);
  // TODO: Implement actual Supabase error logging
};
