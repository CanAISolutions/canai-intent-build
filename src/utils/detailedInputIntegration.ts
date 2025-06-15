
/**
 * Detailed Input Collection - Make.com & GPT-4o Integration
 * Handles the data flow: Webflow → Make.com → Supabase → GPT-4o
 */

import { triggerMakecomWorkflow } from './makecom';
import { insertPromptLog } from './supabase';
import { generateCorrelationId } from './tracing';
import { trackEvent, POSTHOG_EVENTS } from './analytics';

export interface DetailedInputPayload {
  prompt_id: string;
  step: number;
  form_data: Record<string, any>;
  user_context?: {
    business_type?: string;
    completion_percentage: number;
  };
}

// Trigger complete detailed input workflow
export const triggerDetailedInputWorkflow = async (payload: DetailedInputPayload) => {
  const correlationId = generateCorrelationId();
  
  try {
    console.log('[DetailedInput] Starting workflow:', payload);
    
    // Step 1: Save to Supabase prompt_logs
    await insertPromptLog({
      user_id: undefined, // Anonymous user
      payload: payload.form_data,
      location: window.location.href,
      unique_value: payload.prompt_id
    });
    
    // Step 2: Trigger Make.com scenario for detailed input processing
    await triggerMakecomWorkflow('SESSION_LOG', {
      action: 'process_detailed_input',
      correlation_id: correlationId,
      detailed_input_data: {
        prompt_id: payload.prompt_id,
        step: payload.step,
        form_data: payload.form_data,
        completion_percentage: payload.user_context?.completion_percentage || 0,
        business_type: payload.user_context?.business_type || 'general'
      },
      // Configuration for Make.com scenario
      integrations: {
        gpt4o_enabled: true,
        supabase_sync: true,
        analytics_tracking: true
      }
    });
    
    // Step 3: Track successful workflow completion
    trackEvent(POSTHOG_EVENTS.FUNNEL_STEP, {
      stepName: 'detailed_input_workflow_completed',
      completed: true,
      correlation_id: correlationId,
      prompt_id: payload.prompt_id,
      step: payload.step,
      workflow_success: true
    });
    
    console.log('[DetailedInput] Workflow completed successfully');
    return { success: true, correlation_id: correlationId };
    
  } catch (error) {
    console.error('[DetailedInput] Workflow failed:', error);
    
    // Track workflow failure
    trackEvent(POSTHOG_EVENTS.FUNNEL_STEP, {
      stepName: 'detailed_input_workflow_failed',
      completed: false,
      correlation_id: correlationId,
      error_message: error instanceof Error ? error.message : 'Unknown error',
      dropoffReason: 'workflow_integration_failure'
    });
    
    throw error;
  }
};

// GPT-4o enhanced tooltip generation
export const generateEnhancedTooltip = async (data: {
  field: string;
  business_context: Record<string, any>;
  user_input?: string;
}) => {
  try {
    // Trigger Make.com scenario for GPT-4o tooltip generation
    await triggerMakecomWorkflow('USER_INTERACTION', {
      action: 'generate_tooltip',
      gpt4o_request: {
        field: data.field,
        business_context: data.business_context,
        user_input: data.user_input || '',
        prompt_template: 'detailed_input_tooltip',
        max_tokens: 150,
        temperature: 0.3
      },
      performance_target: '100ms',
      fallback_enabled: true
    });
    
    // Note: In production, this would return the GPT-4o generated content
    // For now, using contextual fallback
    return {
      success: true,
      content: generateContextualTooltip(data.field, data.business_context),
      source: 'fallback'
    };
    
  } catch (error) {
    console.error('[DetailedInput] Tooltip generation failed:', error);
    
    return {
      success: false,
      content: generateContextualTooltip(data.field, data.business_context),
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Contextual tooltip fallback
const generateContextualTooltip = (field: string, context: Record<string, any>): string => {
  const businessName = context.businessName?.toLowerCase() || '';
  
  const tooltipMap: Record<string, string> = {
    businessDescription: businessName.includes('bakery') 
      ? "Describe your bakery's specialty, location, and unique atmosphere. Example: 'Artisanal sourdough bakery in downtown Denver, featuring organic ingredients and cozy reading nooks for the community.'"
      : "Summarize what your business does, who it serves, and what makes it special in 10-50 words.",
    
    revenueModel: businessName.includes('bakery')
      ? "List your income sources: daily sales, custom orders, catering, coffee, events. Example: 'Fresh bread & pastries, custom wedding cakes, corporate catering, weekend farmers market booth.'"
      : "How will you make money? List your main revenue streams and pricing model.",
    
    resourceConstraints: "What limitations do you face? Include budget, team size, timeline, equipment, or location constraints that will impact your business plan."
  };
  
  return tooltipMap[field] || "Provide additional context to help create a more personalized business plan for your specific situation.";
};

// TODO: Configure Make.com scenarios
/*
Scenario: detailed_input_processor.json
Trigger: Webhook from detailed input form
Actions:
1. Receive form data payload
2. Validate and format data
3. Save to Supabase prompt_logs with encryption
4. Generate business insights via GPT-4o
5. Prepare data for intent mirror stage
6. Send analytics events to PostHog
7. Handle error states and retries

Scenario: tooltip_generator.json  
Trigger: Webhook from tooltip request
Actions:
1. Receive field and context data
2. Generate personalized tooltip via GPT-4o
3. Return formatted tooltip content
4. Track usage analytics
5. Implement 100ms performance target
6. Fallback to contextual tooltips

Performance Targets:
- Detailed input processing: <500ms end-to-end
- Tooltip generation: <100ms response time
- Auto-save: <200ms Supabase write
- Error rate: <1% for all workflows
*/
