/**
 * PostHog Analytics Integration for CanAI Platform
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

// PostHog configuration
const POSTHOG_PROJECT_KEY = process.env.VITE_POSTHOG_PROJECT_KEY || 'phc_demo_key';
const POSTHOG_HOST = process.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

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

// Analytics helper functions
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  posthog.capture(eventName, properties);
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
