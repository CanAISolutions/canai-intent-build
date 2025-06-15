
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StandardBackground from '@/components/StandardBackground';
import { PageTitle, SectionTitle, BodyText } from '@/components/StandardTypography';
import { StandardButton } from '@/components/ui/standard-button';
import RefinedComparisonContainer from '@/components/SparkSplit/RefinedComparisonContainer';
import TrustDeltaDisplay from '@/components/SparkSplit/TrustDeltaDisplay';
import RefinedFeedbackForm from '@/components/SparkSplit/RefinedFeedbackForm';
import ProjectContextSummary from '@/components/SparkSplit/ProjectContextSummary';
import { Download, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// API and analytics imports
import { generateSparkSplit, submitFeedback } from '@/utils/sparkSplitApi';
import { trackPageView, trackFunnelStep, trackSparkSplitView, trackFeedbackSubmission } from '@/utils/analytics';
import { logInteraction } from '@/utils/api';

const SparkSplit = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [canaiOutput, setCanaiOutput] = useState('');
  const [genericOutput, setGenericOutput] = useState('');
  const [trustDelta, setTrustDelta] = useState(0);
  const [emotionalResonance, setEmotionalResonance] = useState({ canaiScore: 0, genericScore: 0, delta: 0 });
  const [loadTime, setLoadTime] = useState<number>(0);

  useEffect(() => {
    const startTime = performance.now();
    
    const initializeSparkSplit = async () => {
      try {
        // Track page view
        trackPageView('spark_split');
        trackFunnelStep('spark_split_viewed');
        trackSparkSplitView();

        // Generate comparison outputs
        const response = await generateSparkSplit({
          businessName: 'Family Bakery',
          tone: 'warm',
          outcome: 'community_connection'
        });

        if (response.error) {
          throw new Error(response.error);
        }

        setCanaiOutput(response.canaiOutput);
        setGenericOutput(response.genericOutput);
        setTrustDelta(response.trustDelta);
        setEmotionalResonance(response.emotionalResonance);

        // Calculate load time
        const endTime = performance.now();
        const loadDuration = endTime - startTime;
        setLoadTime(loadDuration);
        
        console.log(`[Performance] SparkSplit loaded in ${loadDuration.toFixed(2)}ms`);

        // Log interaction
        await logInteraction({
          user_id: 'demo-user-id',
          interaction_type: 'spark_split_view',
          interaction_details: {
            trust_delta: response.trustDelta,
            emotional_resonance: response.emotionalResonance,
            load_time: loadDuration
          }
        });

      } catch (error) {
        console.error('[SparkSplit] Initialization failed:', error);
        
        // Fallback content
        setCanaiOutput(`# BUSINESS_BUILDER: The Community Spark

Transform your family bakery vision into Denver's most beloved neighborhood gathering place.

## Executive Summary
Your warm, family-centered bakery isn't just about bread and pastries—it's about creating the heart of your community. This plan leverages your personal story and values to build sustainable connections that turn first-time customers into lifelong advocates.

## Market Opportunity
Denver's growing families crave authentic, local experiences. Your bakery fills the gap between impersonal chains and the intimate, multi-generational gathering space that builds lasting memories.

## Revenue Strategy
- **Morning Rush**: Premium coffee + fresh pastries for working parents
- **Afternoon Comfort**: After-school treats + homework-friendly environment  
- **Weekend Celebrations**: Custom cakes + family event hosting
- **Community Events**: Baking classes + local artist showcases

## Implementation Timeline
**Month 1-2**: Secure location in family-dense neighborhood, design welcoming interior
**Month 3-4**: Hire community-minded staff, establish supplier relationships
**Month 5-6**: Grand opening with neighborhood celebration, loyalty program launch

Your bakery becomes more than a business—it becomes the place where Denver families create their most cherished moments.`);

        setGenericOutput(`# Business Plan: Bakery

## Overview
This document outlines a business plan for starting a bakery.

## Market Analysis
The bakery industry serves customers who want baked goods. There is demand for bread, cakes, and pastries in most markets.

## Products and Services
- Bread
- Pastries  
- Cakes
- Coffee
- Catering services

## Target Market
- Local residents
- Office workers
- Event planners
- Restaurants

## Marketing Strategy
- Social media advertising
- Local partnerships
- Print advertisements
- Grand opening promotion

## Financial Projections
Revenue projections should be based on local market data and competition analysis. Initial investment will be required for equipment, lease, and inventory.

## Operations Plan
Daily operations will include baking, customer service, inventory management, and cleaning. Staff will need training in food safety and customer service.

## Conclusion
A bakery can be a profitable business with proper planning and execution.`);

        setTrustDelta(4.2);
        setEmotionalResonance({ canaiScore: 8.7, genericScore: 3.2, delta: 5.5 });
      } finally {
        setIsLoading(false);
      }
    };

    initializeSparkSplit();
  }, []);

  const handleFeedbackSubmit = async (rating: number, comment: string) => {
    try {
      trackFeedbackSubmission('spark_split', rating);
      
      await submitFeedback({
        rating,
        comment,
        trust_delta: trustDelta,
        emotional_resonance: emotionalResonance
      });

      console.log('[SparkSplit] Feedback submitted:', { rating, comment });
      
      // Navigate to feedback page after submission
      setTimeout(() => {
        navigate('/feedback');
      }, 1500);

    } catch (error) {
      console.error('[SparkSplit] Feedback submission failed:', error);
    }
  };

  const handleDownloadPDF = () => {
    trackFunnelStep('pdf_download', { source: 'spark_split' });
    
    // Create downloadable content
    const content = `CanAI Personalized Output\n\n${canaiOutput}\n\n---\n\nGeneric AI Output\n\n${genericOutput}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'canai-comparison.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleContinueJourney = () => {
    trackFunnelStep('continue_journey', { source: 'spark_split' });
    navigate('/feedback');
  };

  if (isLoading) {
    return (
      <StandardBackground className="items-center justify-center">
        <div className="text-center space-y-4">
          <Sparkles className="w-12 h-12 text-[#36d1fe] animate-spin mx-auto" />
          <BodyText className="text-white">Generating your personalized comparison...</BodyText>
        </div>
      </StandardBackground>
    );
  }

  return (
    <StandardBackground>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <PageTitle className="text-white mb-4">See The Difference</PageTitle>
          <BodyText className="text-xl text-white opacity-90 max-w-3xl mx-auto">
            Experience how CanAI's emotional intelligence creates outputs that truly resonate with your vision, 
            compared to generic AI responses.
          </BodyText>
        </div>

        {/* Project Context Summary */}
        <div className="mb-8">
          <ProjectContextSummary />
        </div>

        {/* Trust Delta Display */}
        <div className="mb-8">
          <TrustDeltaDisplay delta={trustDelta} />
        </div>

        {/* Comparison Container */}
        <div className="mb-12">
          <RefinedComparisonContainer 
            canaiOutput={canaiOutput}
            genericOutput={genericOutput}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <StandardButton
            variant="secondary"
            size="lg"
            onClick={handleDownloadPDF}
            icon={<Download size={20} />}
            iconPosition="left"
            className="text-white"
          >
            Download Comparison
          </StandardButton>
          
          <StandardButton
            variant="primary"
            size="lg"
            onClick={handleContinueJourney}
            icon={<ArrowRight size={20} />}
            iconPosition="right"
            className="text-white"
          >
            Continue Journey
          </StandardButton>
        </div>

        {/* Feedback Form */}
        <Card className="max-w-4xl mx-auto bg-[rgba(25,60,101,0.7)] border-2 border-[#36d1fe]/40 backdrop-blur-md">
          <CardContent className="p-8">
            <SectionTitle className="text-white text-center mb-6">Share Your Experience</SectionTitle>
            <RefinedFeedbackForm onSubmit={handleFeedbackSubmit} />
          </CardContent>
        </Card>

        {/* Performance Debug Info (development only) */}
        {process.env.NODE_ENV === 'development' && loadTime > 0 && (
          <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs">
            Load Time: {loadTime.toFixed(2)}ms
            {loadTime > 500 && <span className="text-red-400"> (⚠️ &gt;500ms)</span>}
          </div>
        )}
      </div>
    </StandardBackground>
  );
};

export default SparkSplit;
