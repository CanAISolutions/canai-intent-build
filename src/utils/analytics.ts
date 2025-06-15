
/**
 * PostHog Analytics Integration
 * TODO: Replace with actual PostHog implementation
 */

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
} as const;

// Mock PostHog instance
class MockPostHog {
  capture(event: string, properties?: Record<string, any>, options?: any) {
    console.log('[PostHog] Event captured:', {
      event,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        page_url: window.location.href,
        correlation_id: this.generateCorrelationId(),
      },
      options,
    });
  }

  identify(userId: string, properties?: Record<string, any>) {
    console.log('[PostHog] User identified:', { userId, properties });
  }

  private generateCorrelationId(): string {
    return `ph-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }
}

// Global PostHog instance
export const posthog = new MockPostHog();

// Analytics helper functions
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  posthog.capture(eventName, properties);
};

export const trackFunnelStep = (step: string, details?: Record<string, any>) => {
  trackEvent(POSTHOG_EVENTS.FUNNEL_STEP, {
    funnel_step: step,
    ...details,
  });
};

export const trackPricingView = (source: string = 'unknown') => {
  trackEvent(POSTHOG_EVENTS.PRICING_MODAL_VIEWED, {
    source,
    viewed_at: new Date().toISOString(),
  });
};

export const trackProductClick = (productId: string, productName: string) => {
  trackEvent(POSTHOG_EVENTS.PRODUCT_CARD_CLICKED, {
    product_id: productId,
    product_name: productName,
  });
};

export const trackPreviewView = (previewType: string = 'spark') => {
  trackEvent(POSTHOG_EVENTS.PREVIEW_VIEWED, {
    preview_type: previewType,
  });
};

export const trackPasswordReset = () => {
  trackEvent(POSTHOG_EVENTS.RESET_PASSWORD_CLICKED, {
    source: 'discovery_hook',
  });
};

// Page tracking
export const trackPageView = (pageName: string) => {
  trackEvent(POSTHOG_EVENTS.PAGE_VIEWED, {
    page_name: pageName,
    referrer: document.referrer,
  });
};
