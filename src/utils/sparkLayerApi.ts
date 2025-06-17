
/**
 * Spark Layer API Integration
 */

import { generateCorrelationId } from './tracing';

export interface GenerateSparksRequest {
  businessType: string;
  tone: string;
  outcome: string;
  attemptCount?: number;
}

export interface RegenerateSparksRequest {
  businessType: string;
  tone: string;
  outcome: string;
  attemptCount: number;
  feedback?: string;
}

export interface SparkData {
  title: string;
  tagline: string;
}

export interface GenerateSparksResponse {
  sparks?: SparkData[];
  error?: string;
}

export interface RegenerateSparksResponse {
  sparks?: SparkData[];
  error?: string;
}

// Get stored Discovery Funnel data
export const getDiscoveryFunnelData = () => {
  try {
    const storedData = localStorage.getItem('discoveryFunnelData');
    const trustScore = localStorage.getItem('userTrustScore');
    
    if (storedData) {
      const data = JSON.parse(storedData);
      return {
        ...data,
        trustScore: trustScore ? parseFloat(trustScore) : 0
      };
    }
    
    return null;
  } catch (error) {
    console.error('[Spark Layer API] Failed to retrieve discovery data:', error);
    return null;
  }
};

// Generate initial sparks
export const generateSparks = async (request: GenerateSparksRequest): Promise<GenerateSparksResponse> => {
  try {
    console.log('[Spark Layer API] Generating sparks:', request);
    
    // Enhanced mock response based on user input
    const businessType = request.businessType.toLowerCase();
    const tone = request.tone.toLowerCase();
    
    let sparks: SparkData[] = [];
    
    if (businessType.includes('bakery') || businessType.includes('food')) {
      sparks = [
        {
          title: 'BUSINESS_BUILDER: The Community Hearth',
          tagline: `Create a ${tone} gathering place that brings neighbors together`
        },
        {
          title: 'BUSINESS_BUILDER: The Heritage Kitchen',
          tagline: `Celebrate traditions through authentic recipes and ${tone} service`
        },
        {
          title: 'BUSINESS_BUILDER: The Neighborhood Haven',
          tagline: `Become the ${tone} heartbeat of your local community`
        }
      ];
    } else if (businessType.includes('tech') || businessType.includes('startup')) {
      sparks = [
        {
          title: 'BUSINESS_BUILDER: The Innovation Hub',
          tagline: `Build ${tone} technology solutions that transform industries`
        },
        {
          title: 'BUSINESS_BUILDER: The Digital Pioneer',
          tagline: `Create ${tone} experiences that users can't live without`
        },
        {
          title: 'BUSINESS_BUILDER: The Future Catalyst',
          tagline: `Drive ${tone} change through cutting-edge innovation`
        }
      ];
    } else {
      sparks = [
        {
          title: 'BUSINESS_BUILDER: The Market Leader',
          tagline: `Establish your ${tone} presence in the industry`
        },
        {
          title: 'BUSINESS_BUILDER: The Customer Champion',
          tagline: `Build ${tone} relationships that drive loyalty`
        },
        {
          title: 'BUSINESS_BUILDER: The Growth Engine',
          tagline: `Create ${tone} strategies that scale your impact`
        }
      ];
    }
    
    return { sparks };
  } catch (error) {
    console.error('[Spark Layer API] Generation failed:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Regenerate sparks with feedback
export const regenerateSparks = async (request: RegenerateSparksRequest): Promise<RegenerateSparksResponse> => {
  try {
    console.log('[Spark Layer API] Regenerating sparks:', request);
    
    // Enhanced regeneration with variety
    const sparks: SparkData[] = [
      {
        title: 'BUSINESS_BUILDER: The Artisan Corner',
        tagline: `Craft exceptional ${request.tone} experiences through handmade excellence`
      },
      {
        title: 'BUSINESS_BUILDER: The Connection Point',
        tagline: `Where ${request.tone} traditions meet modern community needs`
      },
      {
        title: 'BUSINESS_BUILDER: The Local Legend',
        tagline: `Your neighborhood's ${request.tone} destination for excellence`
      }
    ];
    
    return { sparks };
  } catch (error) {
    console.error('[Spark Layer API] Regeneration failed:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
