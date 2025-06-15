/**
 * PostHog Analytics Integration for CanAI Platform
 */

import { generateCorrelationId } from './tracing';

export interface PostHogEvent {
  event: string;
  properties?: Record<string, any>;
  user_id?: string;
}

// PostHog Event Types from PRD
export const POSTHOG_EVENTS = {
  FUNNEL_STEP: 'funnel_step',
  PRICING_MODAL_VIEWED: 'pricing_modal_viewed',
  PRODUCT_CARD_CLICKED: 'product_card_clicked',
  PREVIEW_VIEWED: 'preview_viewed',
  RESET_PASSWORD_CLICKED: 'reset_password_clicked',
  PAGE_VIEWED: 'page_viewed',
  CTA_CLICKED: 'cta_clicked',
  CUSTOM_TONE_ENTERED: 'custom_tone_entered',
  QUIZ_USED: 'quiz_used',
  CONTRADICTION_FLAGGED: 'contradiction_flagged',
  // Spark Layer Events
  SPARK_SELECTED: 'spark_selected',
  SPARKS_REGENERATED: 'sparks_regenerated',
  SPARKS_REGENERATED_EXTRA: 'sparks_regenerated_extra',
  // Intent Mirror Events
  INTENT_MIRROR_LOADED: 'intent_mirror_loaded',
  INTENT_MIRROR_CONFIRMED: 'intent_mirror_confirmed',
  INTENT_MIRROR_EDITED: 'intent_mirror_edited',
  SUPPORT_REQUESTED: 'support_requested',
  FIELD_EDITED: 'field_edited',
} as const;

// PostHog configuration
const POSTHOG_PROJECT_KEY = import.meta.env.VITE_POSTHOG_PROJECT_KEY || 'phc_demo_key';
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

class PostHogClient {
  private initialized = false;
  private fallbackMode = true;

  constructor() {
    this.initializePostHog();
  }

  private async initializePostHog() {
    try {
      // TODO: Replace with actual PostHog initialization
      if (typeof window !== 'undefined' && POSTHOG_PROJECT_KEY !== 'phc_demo_key') {
        // Dynamic import for PostHog (when actually implemented)
        // const posthog = await import('posthog-js');
        // posthog.init(POSTHOG_PROJECT_KEY, { api_host: POSTHOG_HOST });
        // this.fallbackMode = false;
        // this.initialized = true;
        console.log('[PostHog] Initialization skipped - using fallback mode');
      }
    } catch (error) {
      console.warn('[PostHog] Initialization failed, using fallback mode:', error);
      this.fallbackMode = true;
    }
  }

  capture(event: string, properties?: Record<string, any>, options?: any) {
    const eventData = {
      event,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        page_url: window.location.href,
        correlation_id: this.generateCorrelationId(),
        platform: 'canai_discovery_hook',
        version: '1.0.0',
      },
      options,
    };

    if (this.fallbackMode) {
      // Fallback: Log to console and localStorage
      console.log('[PostHog] Event captured (fallback):', eventData);
      this.storeFallbackEvent(eventData);
    } else {
      // TODO: Use actual PostHog capture
      // window.posthog?.capture(event, eventData.properties);
      console.log('[PostHog] Event captured:', eventData);
    }

    // Also send to Make.com for analytics processing
    this.sendToMakecom(eventData);
  }

  identify(userId: string, properties?: Record<string, any>) {
    const identityData = { userId, properties };
    
    if (this.fallbackMode) {
      console.log('[PostHog] User identified (fallback):', identityData);
      localStorage.setItem('canai_user_identity', JSON.stringify(identityData));
    } else {
      // TODO: Use actual PostHog identify
      // window.posthog?.identify(userId, properties);
      console.log('[PostHog] User identified:', identityData);
    }
  }

  private generateCorrelationId(): string {
    return `ph-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }

  private storeFallbackEvent(event: any) {
    try {
      const events = JSON.parse(localStorage.getItem('canai_analytics_fallback') || '[]');
      events.push(event);
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('canai_analytics_fallback', JSON.stringify(events));
    } catch (error) {
      console.error('[PostHog] Failed to store fallback event:', error);
    }
  }

  private async sendToMakecom(eventData: any) {
    try {
      const { triggerMakecomWorkflow } = await import('./makecom');
      await triggerMakecomWorkflow('USER_INTERACTION', {
        action: 'posthog_event',
        details: eventData
      });
    } catch (error) {
      console.warn('[PostHog] Failed to send to Make.com:', error);
    }
  }
}

// Global PostHog instance
export const posthog = new PostHogClient();

// Helper functions
const isPostHogEnabled = (): boolean => {
  return typeof window !== 'undefined' && window.posthog && POSTHOG_PROJECT_KEY !== 'phc_demo_key';
};

const logToFallback = (eventName: string, properties: Record<string, any>) => {
  console.log(`[PostHog Fallback] ${eventName}:`, properties);
  
  // Store in localStorage as fallback
  try {
    const events = JSON.parse(localStorage.getItem('canai_analytics_fallback') || '[]');
    events.push({ event: eventName, properties, timestamp: new Date().toISOString() });
    
    // Keep only last 100 events
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('canai_analytics_fallback', JSON.stringify(events));
  } catch (error) {
    console.error('[PostHog] Failed to store fallback event:', error);
  }
};

// Analytics helper functions
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  const enhancedProperties = {
    ...properties,
    timestamp: new Date().toISOString(),
    page_url: window.location.href,
    correlation_id: generateCorrelationId(),
    platform: 'canai_discovery_hook',
    version: '1.0.0',
  };

  // Production PostHog tracking
  if (isPostHogEnabled() && window.posthog) {
    try {
      window.posthog.capture(eventName, enhancedProperties);
      console.log(`[PostHog] Event captured: ${eventName}`, enhancedProperties);
    } catch (error) {
      console.error('[PostHog] Event capture failed:', error);
      // Fallback to console + Make.com
      logToFallback(eventName, enhancedProperties);
    }
  } else {
    // Fallback logging
    logToFallback(eventName, enhancedProperties);
  }
};

export const trackFunnelStep = (step: string, details?: Record<string, any>) => {
  trackEvent(POSTHOG_EVENTS.FUNNEL_STEP, {
    funnel_step: step,
    completed: true,
    step_timestamp: new Date().toISOString(),
    ...details,
  });
};

export const trackPricingView = (source: string = 'unknown') => {
  trackEvent(POSTHOG_EVENTS.PRICING_MODAL_VIEWED, {
    source,
    viewed_at: new Date().toISOString(),
    modal_type: 'pricing',
  });
};

export const trackProductClick = (productId: string, productName: string) => {
  trackEvent(POSTHOG_EVENTS.PRODUCT_CARD_CLICKED, {
    product_id: productId,
    product_name: productName,
    click_timestamp: new Date().toISOString(),
  });
};

export const trackPreviewView = (previewType: string = 'spark') => {
  trackEvent(POSTHOG_EVENTS.PREVIEW_VIEWED, {
    preview_type: previewType,
    viewed_at: new Date().toISOString(),
  });
};

export const trackPasswordReset = () => {
  trackEvent(POSTHOG_EVENTS.RESET_PASSWORD_CLICKED, {
    source: 'discovery_hook',
    timestamp: new Date().toISOString(),
  });
};

// Page tracking
export const trackPageView = (pageName: string) => {
  trackEvent(POSTHOG_EVENTS.PAGE_VIEWED, {
    page_name: pageName,
    referrer: document.referrer,
    user_agent: navigator.userAgent,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
  });
};

// Discovery Funnel specific events
export const logInteraction = async (data: {
  user_id?: string;
  interaction_type: string;
  interaction_details: Record<string, any>;
}) => {
  console.log('[Analytics] logInteraction called:', data);
  
  // Track as PostHog event
  trackEvent(POSTHOG_EVENTS.FUNNEL_STEP, {
    interaction_type: data.interaction_type,
    user_id: data.user_id,
    ...data.interaction_details,
  });
  
  // Also log to Supabase via API
  try {
    const { logInteraction: apiLogInteraction } = await import('./api');
    await apiLogInteraction(data);
  } catch (error) {
    console.warn('[Analytics] Failed to log to API:', error);
  }
};

// Spark Layer specific events
export const trackSparkSelected = (sparkData: {
  spark_id: string;
  product: 'business_builder' | 'social_email' | 'site_audit';
  spark_index: number;
  attempt_count?: number;
}) => {
  trackEvent(POSTHOG_EVENTS.SPARK_SELECTED, {
    spark_id: sparkData.spark_id,
    product: sparkData.product,
    spark_index: sparkData.spark_index,
    attempt_count: sparkData.attempt_count || 0,
    selection_timestamp: new Date().toISOString(),
  });
};

export const trackSparksRegenerated = (regenerationData: {
  attempt_count: number;
  business_type?: string;
  trust_score?: number;
}) => {
  const eventType = regenerationData.attempt_count > 3 
    ? POSTHOG_EVENTS.SPARKS_REGENERATED_EXTRA 
    : POSTHOG_EVENTS.SPARKS_REGENERATED;
    
  trackEvent(eventType, {
    attempt_count: regenerationData.attempt_count,
    business_type: regenerationData.business_type,
    trust_score: regenerationData.trust_score,
    regeneration_timestamp: new Date().toISOString(),
  });
};

export const trackSparkInteraction = (interactionType: string, details?: Record<string, any>) => {
  trackEvent(POSTHOG_EVENTS.FUNNEL_STEP, {
    funnel_step: `spark_layer_${interactionType}`,
    interaction_type: interactionType,
    completed: true,
    step_timestamp: new Date().toISOString(),
    ...details,
  });
};

// Enhanced event tracking for SparkSplit
export const trackSparkSplitComparison = (data: {
  trustDelta: number;
  selected?: string;
  emotionalResonance: { delta: number };
  completion_time_ms?: number;
  prompt_id: string;
}) => {
  trackEvent('plan_compared', data);
};

export const trackTrustDeltaView = (data: {
  score: number;
  prompt_id: string;
}) => {
  trackEvent('trustdelta_viewed', data);
};

export const trackGenericPreference = (data: {
  feedback: string;
  prompt_id: string;
}) => {
  trackEvent('generic_preferred', data);
};

export const trackSparkSplitFeedback = (data: {
  selection: string;
  feedback: string;
  trust_delta?: number;
  prompt_id: string;
}) => {
  trackEvent('sparksplit_feedback', data);
};

// Intent Mirror specific analytics functions
export const trackIntentMirrorLoaded = (data: {
  confidence_score: number;
  response_time: number;
  clarifying_questions_count: number;
}) => {
  trackEvent(POSTHOG_EVENTS.INTENT_MIRROR_LOADED, {
    confidence_score: data.confidence_score,
    response_time: data.response_time,
    clarifying_questions_count: data.clarifying_questions_count,
    step_timestamp: new Date().toISOString(),
  });
};

export const trackIntentMirrorConfirmed = (data: {
  confidence_score: number;
  editing_attempts?: number;
  time_to_confirm?: number;
}) => {
  trackEvent(POSTHOG_EVENTS.INTENT_MIRROR_CONFIRMED, {
    confidence_score: data.confidence_score,
    editing_attempts: data.editing_attempts || 0,
    time_to_confirm: data.time_to_confirm,
    step_timestamp: new Date().toISOString(),
  });
};

export const trackIntentMirrorEdited = (data: {
  field: string;
  edit_type: 'field_specific' | 'general' | 'clarification';
  confidence_score?: number;
}) => {
  trackEvent(POSTHOG_EVENTS.INTENT_MIRROR_EDITED, {
    field: data.field,
    edit_type: data.edit_type,
    confidence_score: data.confidence_score,
    step_timestamp: new Date().toISOString(),
  });
};

export const trackSupportRequested = (data: {
  reason: 'low_confidence' | 'user_initiated' | 'error';
  confidence_score?: number;
  attempt_count?: number;
}) => {
  trackEvent(POSTHOG_EVENTS.SUPPORT_REQUESTED, {
    reason: data.reason,
    confidence_score: data.confidence_score,
    attempt_count: data.attempt_count || 1,
    step_timestamp: new Date().toISOString(),
  });
};

export const trackFieldEdited = (data: {
  field: string;
  value_length: number;
  edit_source: 'modal' | 'inline' | 'bulk_edit';
}) => {
  trackEvent(POSTHOG_EVENTS.FIELD_EDITED, {
    field: data.field,
    value_length: data.value_length,
    edit_source: data.edit_source,
    step_timestamp: new Date().toISOString(),
  });
};

// Enhanced funnel tracking for intent mirror
export const trackIntentMirrorFunnelStep = (step: string, details?: Record<string, any>) => {
  trackEvent(POSTHOG_EVENTS.FUNNEL_STEP, {
    funnel_step: `intent_mirror_${step}`,
    completed: true,
    step_timestamp: new Date().toISOString(),
    ...details,
  });
};

// Enhanced deliverable generation analytics functions
export const trackDeliverableGenerated = (data: {
  product_type: string;
  prompt_id: string;
  completion_time_ms: number;
  emotional_resonance_score?: number;
  trust_delta?: number;
}) => {
  trackEvent('deliverable_generated', {
    product_type: data.product_type.toLowerCase(),
    prompt_id: data.prompt_id,
    completion_time_ms: data.completion_time_ms,
    emotional_resonance_score: data.emotional_resonance_score,
    trust_delta: data.trust_delta,
    generation_timestamp: new Date().toISOString(),
    performance_target_met: data.completion_time_ms < 2000
  });
};

export const trackRevisionRequested = (data: {
  prompt_id: string;
  reason: string;
  revision_count: number;
  response_time?: number;
}) => {
  trackEvent('revision_requested', {
    prompt_id: data.prompt_id,
    reason: data.reason.substring(0, 100), // Limit reason length
    revision_count: data.revision_count,
    response_time: data.response_time,
    revision_timestamp: new Date().toISOString(),
    performance_target_met: data.response_time ? data.response_time < 2000 : undefined
  });
};

export const trackDeliverableRegenerated = (data: {
  prompt_id: string;
  attempt_count: number;
  response_time?: number;
}) => {
  trackEvent('deliverable_regenerated', {
    prompt_id: data.prompt_id,
    attempt_count: data.attempt_count,
    response_time: data.response_time,
    regeneration_timestamp: new Date().toISOString(),
    performance_target_met: data.response_time ? data.response_time < 2000 : undefined
  });
};

export const trackPDFDownload = (data: {
  prompt_id: string;
  product_type: string;
  download_time?: number;
}) => {
  trackEvent('pdf_downloaded', {
    prompt_id: data.prompt_id,
    product_type: data.product_type.toLowerCase(),
    download_time: data.download_time,
    download_timestamp: new Date().toISOString(),
    performance_target_met: data.download_time ? data.download_time < 1000 : undefined
  });
};

export const trackEmotionalResonance = (data: {
  prompt_id: string;
  arousal: number;
  valence: number;
  canai_score: number;
  generic_score: number;
  delta: number;
  validation_passed: boolean;
}) => {
  trackEvent('emotional_resonance_validated', {
    prompt_id: data.prompt_id,
    arousal: data.arousal,
    valence: data.valence,
    canai_score: data.canai_score,
    generic_score: data.generic_score,
    delta: data.delta,
    validation_passed: data.validation_passed,
    hume_criteria_met: data.arousal > 0.5 && data.valence > 0.6,
    validation_timestamp: new Date().toISOString()
  });
};

// TODO: Install actual PostHog
/*
1. Add PostHog script to index.html or install via npm:
   npm install posthog-js

2. Initialize PostHog in main.tsx:
   import posthog from 'posthog-js'
   posthog.init('your-project-key', { api_host: 'https://app.posthog.com' })

3. Replace fallback implementations with actual PostHog calls

4. Configure PostHog dashboard:
   - Set up funnels for Discovery Hook → Purchase flow
   - Create insights for conversion tracking
   - Set up alerts for drop-off points

5. Environment variables:
   VITE_POSTHOG_PROJECT_KEY=your_project_key
   VITE_POSTHOG_HOST=https://app.posthog.com
*/
