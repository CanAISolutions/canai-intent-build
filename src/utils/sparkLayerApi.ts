import { generateCorrelationId, retryWithBackoff } from './tracing';
import { insertSparkLog, insertErrorLog } from './supabase';
import { triggerMakecomWorkflow } from './makecom';

// API Response Types
export interface SparkData {
  title: string;
  tagline: string;
}

export interface GenerateSparksRequest {
  businessType: string;
  tone: string;
  outcome: string;
}

export interface RegenerateSparksRequest extends GenerateSparksRequest {
  attempt_count: number;
}

export interface SparkResponse {
  sparks: SparkData[];
  error: null | string;
}

// Base API configuration
const API_BASE = import.meta.env.VITE_API_BASE || '/v1';
const DEFAULT_TIMEOUT = 5000;

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

// Generate initial sparks
export const generateSparks = async (data: GenerateSparksRequest): Promise<SparkResponse> => {
  console.log('[Spark API] POST /v1/generate-sparks called with:', data);
  
  try {
    // TODO: Replace with actual backend endpoint
    const response = await apiCall<SparkResponse>('/generate-sparks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    console.log('[Spark API] Sparks generated:', response);
    
    // Log to Make.com workflow
    await triggerMakecomWorkflow('SPARK_GENERATION', {
      action: 'generate_sparks',
      request_data: data,
      response_data: response,
    });
    
    return response;
    
  } catch (error) {
    console.warn('[Spark API] generateSparks failed, using fallback:', error);
    
    // Fallback: Generate contextual sparks
    const fallbackSparks = generateFallbackSparks(data);
    
    // Log error
    await logSparkError({
      error_message: error instanceof Error ? error.message : 'Unknown error',
      action: 'generate_sparks',
      error_type: 'timeout'
    });
    
    return {
      sparks: fallbackSparks,
      error: null
    };
  }
};

// Regenerate sparks with attempt tracking
export const regenerateSparks = async (data: RegenerateSparksRequest): Promise<SparkResponse> => {
  console.log('[Spark API] POST /v1/regenerate-sparks called with:', data);
  
  try {
    // TODO: Replace with actual backend endpoint
    const response = await apiCall<SparkResponse>('/regenerate-sparks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    console.log('[Spark API] Sparks regenerated:', response);
    
    // Log to Make.com workflow
    await triggerMakecomWorkflow('SPARK_REGENERATION', {
      action: 'regenerate_sparks',
      attempt_count: data.attempt_count,
      request_data: data,
      response_data: response,
    });
    
    return response;
    
  } catch (error) {
    console.warn('[Spark API] regenerateSparks failed, using fallback:', error);
    
    // Fallback: Generate contextual sparks with variation
    const fallbackSparks = generateFallbackSparks(data, data.attempt_count);
    
    // Log error
    await logSparkError({
      error_message: error instanceof Error ? error.message : 'Unknown error',
      action: 'regenerate_sparks',
      error_type: 'timeout'
    });
    
    return {
      sparks: fallbackSparks,
      error: null
    };
  }
};

// Log spark selection
export const logSparkSelection = async (sparkData: {
  initial_prompt_id: string;
  selected_spark: SparkData;
  product_track: 'business_builder' | 'social_email' | 'site_audit';
  feedback?: string;
}): Promise<void> => {
  try {
    await insertSparkLog(sparkData);
    console.log('[Spark API] Spark selection logged successfully');
  } catch (error) {
    console.error('[Spark API] Failed to log spark selection:', error);
    
    // F3-E1: Fallback to localStorage
    try {
      const fallbackData = {
        ...sparkData,
        timestamp: new Date().toISOString(),
        fallback_reason: 'supabase_error'
      };
      
      const existingData = JSON.parse(localStorage.getItem('canai_spark_fallback') || '[]');
      existingData.push(fallbackData);
      localStorage.setItem('canai_spark_fallback', JSON.stringify(existingData));
      
      console.log('[F3-E1] Spark data saved to localStorage fallback');
    } catch (storageError) {
      console.error('[F3-E1] localStorage fallback failed:', storageError);
    }
  }
};

// Generate fallback sparks based on business context
const generateFallbackSparks = (data: GenerateSparksRequest, attempt: number = 0): SparkData[] => {
  const { businessType, tone, outcome } = data;
  
  const variations = [
    // Attempt 0: Default sparks
    [
      { title: "Growth Accelerator Plan", tagline: "Scale your business with proven strategies" },
      { title: "Market Domination Strategy", tagline: "Outpace competitors with smart positioning" },
      { title: "Revenue Optimization Blueprint", tagline: "Maximize profits through strategic planning" }
    ],
    // Attempt 1: Focus-based sparks
    [
      { title: "Customer Acquisition Engine", tagline: "Build a pipeline of loyal customers" },
      { title: "Operational Excellence Framework", tagline: "Streamline processes for maximum efficiency" },
      { title: "Innovation Leadership Plan", tagline: "Lead your industry through breakthrough thinking" }
    ],
    // Attempt 2: Outcome-focused sparks
    [
      { title: "Sustainable Growth Model", tagline: "Build lasting success without burnout" },
      { title: "Competitive Advantage Strategy", tagline: "Create unbreakable market positioning" },
      { title: "Profit Multiplication System", tagline: "Exponentially grow your bottom line" }
    ]
  ];
  
  const sparkSet = variations[attempt % variations.length];
  
  // Customize based on business type and tone
  if (businessType?.toLowerCase().includes('tech')) {
    sparkSet[0].title = "AI-Powered Tech Strategy";
    sparkSet[0].tagline = "Leverage technology for exponential growth";
  }
  
  if (tone?.toLowerCase().includes('bold')) {
    sparkSet.forEach(spark => {
      spark.tagline = spark.tagline.replace('strategic', 'bold').replace('smart', 'aggressive');
    });
  }
  
  return sparkSet;
};

// Error logging specific to spark operations
const logSparkError = async (errorData: {
  error_message: string;
  action: string;
  error_type: 'timeout' | 'invalid_input' | 'low_confidence';
}): Promise<void> => {
  try {
    await insertErrorLog({
      ...errorData,
      support_request: false,
    });
  } catch (error) {
    console.error('[Spark API] Failed to log spark error:', error);
  }
};
