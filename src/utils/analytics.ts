
/**
 * Analytics Integration with PostHog
 */

import { generateCorrelationId } from './tracing';

// PostHog Event Constants
export const POSTHOG_EVENTS = {
  FUNNEL_STEP: 'funnel_step',
  TRUST_SCORE_UPDATE: 'trust_score_update',
  SPARK_SELECTED: 'spark_selected',
  SPARKS_REGENERATED: 'sparks_regenerated',
  SPARK_SPLIT_VIEW: 'spark_split_view',
  FEEDBACK_SUBMISSION: 'feedback_submission',
  FORM_STEP: 'form_step'
} as const;

// Mock PostHog implementation for development
const mockPostHog = {
  capture: (event: string, properties?: Record<string, any>) => {
    console.log(`[PostHog] ${event}:`, properties);
  },
  identify: (userId: string, properties?: Record<string, any>) => {
    console.log(`[PostHog] Identify ${userId}:`, properties);
  }
};

// Page view tracking
export const trackPageView = (page: string, properties?: Record<string, any>) => {
  try {
    trackEvent(POSTHOG_EVENTS.FUNNEL_STEP, {
      stepName: 'page_view',
      page,
      timestamp: new Date().toISOString(),
      correlation_id: generateCorrelationId(),
      ...properties
    });
  } catch (error) {
    console.error('[Analytics] Page view tracking failed:', error);
  }
};

// Generic event tracking
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  try {
    mockPostHog.capture(eventName, {
      timestamp: new Date().toISOString(),
      correlation_id: generateCorrelationId(),
      ...properties
    });
  } catch (error) {
    console.error('[Analytics] Event tracking failed:', error);
  }
};

// Funnel step tracking
export const trackFunnelStep = (stepName: string, properties?: Record<string, any>) => {
  trackEvent(POSTHOG_EVENTS.FUNNEL_STEP, {
    stepName,
    completed: true,
    ...properties
  });
};

// Trust score updates
export const trackTrustScoreUpdate = (score: number, context?: Record<string, any>) => {
  trackEvent(POSTHOG_EVENTS.TRUST_SCORE_UPDATE, {
    score,
    meets_target: score >= 65,
    ...context
  });
};

// Spark selection tracking
export const trackSparkSelected = (sparkId: string, properties?: Record<string, any>) => {
  trackEvent(POSTHOG_EVENTS.SPARK_SELECTED, {
    spark_id: sparkId,
    selection_time: Date.now(),
    ...properties
  });
};

// Spark regeneration tracking
export const trackSparksRegenerated = (attemptCount: number, properties?: Record<string, any>) => {
  trackEvent(POSTHOG_EVENTS.SPARKS_REGENERATED, {
    attempt_count: attemptCount,
    max_attempts_reached: attemptCount >= 3,
    ...properties
  });
};

// SparkSplit view tracking
export const trackSparkSplitView = (properties?: Record<string, any>) => {
  trackEvent(POSTHOG_EVENTS.SPARK_SPLIT_VIEW, {
    view_type: 'comparison_displayed',
    ...properties
  });
};

// Feedback submission tracking
export const trackFeedbackSubmission = (source: string, rating: number, properties?: Record<string, any>) => {
  trackEvent(POSTHOG_EVENTS.FEEDBACK_SUBMISSION, {
    source,
    rating,
    positive_feedback: rating >= 4,
    ...properties
  });
};

// Form step tracking
export const trackFormStep = (stepName: string, properties?: Record<string, any>) => {
  trackEvent(POSTHOG_EVENTS.FORM_STEP, {
    stepName,
    completed: true,
    ...properties
  });
};

// Performance tracking
export const trackPerformance = (action: string, duration: number, properties?: Record<string, any>) => {
  trackEvent('performance_metric', {
    action,
    duration_ms: duration,
    meets_target: duration < 2000, // 2s target
    ...properties
  });
};

// Error tracking
export const trackError = (error: Error, context?: Record<string, any>) => {
  trackEvent('error_occurred', {
    error_message: error.message,
    error_stack: error.stack,
    ...context
  });
};
