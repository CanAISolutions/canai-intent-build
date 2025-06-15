
/**
 * Discovery Funnel API Integration
 */

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

// Validate user input
export const validateInput = async (request: ValidationRequest): Promise<ValidationResponse> => {
  try {
    console.log('[Discovery Funnel API] Validating input:', request);
    
    // Mock validation logic
    const isValid = request.value.length > 0;
    const trustIncrease = isValid ? 15 : 0;
    
    return {
      valid: isValid,
      feedback: isValid ? 'Input looks good!' : 'Please provide more details',
      trustScore: trustIncrease
    };
  } catch (error) {
    console.error('[Discovery Funnel API] Validation failed:', error);
    return {
      valid: false,
      feedback: 'Validation error occurred',
      trustScore: 0
    };
  }
};

// Submit initial prompt data
export const submitInitialPrompt = async (request: InitialPromptRequest): Promise<InitialPromptResponse> => {
  try {
    console.log('[Discovery Funnel API] Submitting initial prompt:', request);
    
    // Store in localStorage for development
    localStorage.setItem('canai_initial_prompt', JSON.stringify({
      ...request,
      id: generateCorrelationId(),
      timestamp: new Date().toISOString()
    }));
    
    // TODO: Replace with actual API call
    return {
      success: true,
      promptId: generateCorrelationId()
    };
  } catch (error) {
    console.error('[Discovery Funnel API] Submission failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
