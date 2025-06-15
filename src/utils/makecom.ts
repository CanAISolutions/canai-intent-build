/**
 * Make.com workflow integration for CanAI Platform
 * Handles Webflow → Make.com → Supabase data flow
 */

import { generateCorrelationId } from './tracing';

export interface MakecomWebhookPayload {
  correlation_id: string;
  timestamp: string;
  source: string;
  event_type: string;
  data: Record<string, any>;
}

// Make.com webhook URLs
const MAKECOM_WEBHOOKS = {
  SESSION_LOG: import.meta.env.VITE_MAKECOM_SESSION_WEBHOOK || 'https://hook.integromat.com/your-session-webhook',
  USER_INTERACTION: import.meta.env.VITE_MAKECOM_INTERACTION_WEBHOOK || 'https://hook.integromat.com/your-interaction-webhook',
  ERROR_LOG: import.meta.env.VITE_MAKECOM_ERROR_WEBHOOK || 'https://hook.integromat.com/your-error-webhook',
  SPARK_GENERATION: import.meta.env.VITE_MAKECOM_SPARK_WEBHOOK || 'https://hook.integromat.com/your-spark-webhook',
  SPARK_REGENERATION: import.meta.env.VITE_MAKECOM_SPARK_REGEN_WEBHOOK || 'https://hook.integromat.com/your-spark-regen-webhook',
  PROJECT_CREATION: import.meta.env.VITE_MAKECOM_PROJECT_WEBHOOK || 'https://hook.integromat.com/your-project-webhook',
};

// Send data to Make.com workflow
export const triggerMakecomWorkflow = async (
  webhookType: keyof typeof MAKECOM_WEBHOOKS,
  data: Record<string, any>
): Promise<void> => {
  const webhookUrl = MAKECOM_WEBHOOKS[webhookType];
  
  if (!webhookUrl || webhookUrl.includes('your-')) {
    console.warn(`[Make.com] ${webhookType} webhook not configured, skipping...`);
    return;
  }

  const payload: MakecomWebhookPayload = {
    correlation_id: generateCorrelationId(),
    timestamp: new Date().toISOString(),
    source: 'canai_discovery_hook',
    event_type: webhookType.toLowerCase(),
    data
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': payload.correlation_id,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Make.com webhook failed: ${response.status} ${response.statusText}`);
    }

    console.log(`[Make.com] ${webhookType} workflow triggered successfully`);
  } catch (error) {
    console.error(`[Make.com] Failed to trigger ${webhookType} workflow:`, error);
    
    // Fallback: Log to Supabase directly if Make.com fails
    if (webhookType === 'SESSION_LOG') {
      try {
        const { insertSessionLog } = await import('./supabase');
        await insertSessionLog({
          user_id: data.user_id,
          interaction_type: 'makecom_fallback',
          interaction_details: {
            original_event: webhookType,
            fallback_reason: 'makecom_webhook_failed',
            original_data: data,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        });
      } catch (supabaseError) {
        console.error('[Make.com] Supabase fallback also failed:', supabaseError);
      }
    }
  }
};

// Specific workflow triggers
export const logSessionToMakecom = (sessionData: {
  user_id?: string;
  interaction_type: string;
  interaction_details: Record<string, any>;
}) => {
  return triggerMakecomWorkflow('SESSION_LOG', sessionData);
};

export const logInteractionToMakecom = (interactionData: {
  user_id?: string;
  action: string;
  details: Record<string, any>;
}) => {
  return triggerMakecomWorkflow('USER_INTERACTION', interactionData);
};

export const logErrorToMakecom = (errorData: {
  user_id?: string;
  error_message: string;
  action: string;
  error_type: string;
}) => {
  return triggerMakecomWorkflow('ERROR_LOG', errorData);
};

// Spark-specific workflow triggers
export const triggerSparkGeneration = (sparkData: {
  business_type: string;
  tone: string;
  outcome: string;
  prompt_id: string;
}) => {
  return triggerMakecomWorkflow('SPARK_GENERATION', {
    action: 'generate_sparks',
    spark_request: sparkData,
    gpt4o_integration: true,
  });
};

export const triggerSparkRegeneration = (sparkData: {
  business_type: string;
  tone: string;
  outcome: string;
  attempt_count: number;
  prompt_id: string;
}) => {
  return triggerMakecomWorkflow('SPARK_REGENERATION', {
    action: 'regenerate_sparks',
    spark_request: sparkData,
    gpt4o_integration: true,
  });
};

// Purchase Flow specific workflow triggers
export const triggerProjectCreation = (projectData: {
  stripe_session_id: string;
  product: string;
  user_id?: string;
  spark_title?: string;
}) => {
  return triggerMakecomWorkflow('PROJECT_CREATION', {
    action: 'create_project',
    project_request: projectData,
    webflow_integration: true,
    memberstack_sync: true,
  });
};

// TODO: Configure Make.com scenarios
/*
Scenario 1: add_project.json
- Webhook trigger → Filter → Supabase insert to session_logs
- Include error handling and retry logic

Scenario 2: admin_add_project.json  
- Admin webhook → Validation → Admin-specific logging

Scenario 3: SAAP Update Project Blueprint.json
- Project update webhook → Status update → Notification

Scenario 4: add_client.json
- New client webhook → Memberstack sync → Supabase user creation

Scenario 5: spark_generation.json (NEW)
- Spark webhook → GPT-4o API call → Response formatting → Supabase spark_logs insert
- Include error handling for GPT-4o timeout/failures
- Performance target: <1.5s end-to-end

Scenario 6: spark_regeneration.json (NEW)
- Regeneration webhook → GPT-4o API call with attempt_count → Response formatting → Supabase update
- Include logic for max attempts (3 + 1 extra if trust_score < 50%)

Scenario 7: add_project.json (PURCHASE FLOW)
- Purchase webhook → Stripe session validation → Webflow project creation → Memberstack sync
- Include Supabase session_logs update with stripe_payment_id
- Performance target: <2s project creation
- Error handling for Stripe failures, Webflow timeouts, Memberstack sync issues
*/
