
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

// Enhanced trust score calculation based on input quality
const calculateTrustScore = (value: string, field: string, allData: Record<string, any>): number => {
  let score = 0;
  
  // Base score for having content
  if (value.length < 5) return 5;
  
  // Length scoring (more thoughtful = higher score)
  if (value.length >= 5 && value.length < 15) score += 10;
  else if (value.length >= 15 && value.length < 30) score += 20;
  else if (value.length >= 30 && value.length < 50) score += 25;
  else if (value.length >= 50) score += 30;
  
  // Word count scoring
  const words = value.trim().split(/\s+/).length;
  if (words >= 3 && words < 6) score += 10;
  else if (words >= 6 && words < 10) score += 15;
  else if (words >= 10) score += 20;
  
  // Specificity bonus - check for detailed, specific content
  const specificityIndicators = [
    /\b(startup|business|company|enterprise|firm|organization)\b/i,
    /\b(customers|clients|users|audience|market|community)\b/i,
    /\b(revenue|profit|growth|scale|expand|increase)\b/i,
    /\b(brand|marketing|sales|advertising|promotion)\b/i,
    /\b(technology|innovation|digital|online|platform)\b/i,
    /\b(professional|corporate|friendly|warm|bold|innovative)\b/i
  ];
  
  const matches = specificityIndicators.filter(pattern => pattern.test(value)).length;
  score += matches * 5;
  
  // Completeness bonus - if all fields have substantial content
  const allFieldsFilled = Object.values(allData).every(val => 
    typeof val === 'string' && val.length >= 10
  );
  if (allFieldsFilled && Object.keys(allData).length >= 4) {
    score += 15;
  }
  
  return Math.min(score, 30); // Cap individual field contribution at 30
};

// Validate user input and provide trust score feedback
export const validateInput = async (request: ValidationRequest): Promise<ValidationResponse> => {
  try {
    console.log('[Discovery Funnel API] Validating input:', request);
    
    const isValid = request.value.length >= 5;
    const fieldScore = calculateTrustScore(request.value, 'current', request.context);
    
    return {
      valid: isValid,
      feedback: isValid 
        ? (request.value.length > 20 ? 'Excellent detail!' : 'Good, but more detail would help') 
        : 'Please provide more detail (at least 5 characters)',
      trustScore: fieldScore
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

// Calculate overall trust score from all form data
export const calculateOverallTrustScore = (formData: Record<string, string>): number => {
  const fields = ['businessType', 'challenge', 'tone', 'outcome'];
  let totalScore = 0;
  
  fields.forEach(field => {
    if (formData[field]) {
      totalScore += calculateTrustScore(formData[field], field, formData);
    }
  });
  
  // Apply multiplier based on completeness
  const completedFields = fields.filter(field => formData[field]?.length >= 5).length;
  const completionMultiplier = completedFields / fields.length;
  
  return Math.min(Math.round(totalScore * completionMultiplier), 100);
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
