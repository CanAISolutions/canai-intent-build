
import { generateCorrelationId } from './tracing';

export interface ValidationRequest {
  value: string;
  context: Record<string, any>;
}

export interface ValidationResponse {
  valid: boolean;
  feedback: string;
  trustScore: number;
}

export interface InitialPromptRequest {
  businessType: string;
  challenge: string;
  tone: string;
  outcome: string;
  trustScore: number;
  timestamp: string;
}

export interface InitialPromptResponse {
  success: boolean;
  promptId?: string;
  error?: string;
}

// Validate user input and provide trust score feedback
export const validateInput = async (request: ValidationRequest): Promise<ValidationResponse> => {
  try {
    console.log('[Discovery Funnel API] Validating input:', request);
    
    // Enhanced validation logic
    const isValid = request.value.length > 3;
    const trustScore = isValid ? Math.min(75 + request.value.length, 100) : 25;
    
    return {
      valid: isValid,
      feedback: isValid ? 'Great input!' : 'Please provide more detail',
      trustScore
    };
  } catch (error) {
    console.error('[Discovery Funnel API] Validation failed:', error);
    return {
      valid: false,
      feedback: 'Validation failed',
      trustScore: 0
    };
  }
};

// Enhanced submission function that properly stores data
export const submitInitialPrompt = async (request: InitialPromptRequest): Promise<InitialPromptResponse> => {
  try {
    console.log('[Discovery Funnel API] Submitting initial prompt:', request);
    
    // Store data in localStorage for next step
    const submissionData = {
      ...request,
      submittedAt: new Date().toISOString(),
      promptId: `prompt_${generateCorrelationId()}`
    };
    
    // Store in localStorage for the Spark Layer to access
    localStorage.setItem('discoveryFunnelData', JSON.stringify(submissionData));
    localStorage.setItem('userTrustScore', request.trustScore.toString());
    
    console.log('[Discovery Funnel API] Data stored successfully:', submissionData);
    
    return {
      success: true,
      promptId: submissionData.promptId
    };
  } catch (error) {
    console.error('[Discovery Funnel API] Submission failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
