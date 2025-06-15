
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StandardBackground from "@/components/StandardBackground";
import StandardCard from "@/components/StandardCard";
import { PageTitle, BodyText } from "@/components/StandardTypography";
import PageHeader from "@/components/PageHeader";
import { generateSparks, regenerateSparks, logSparkSelection } from "@/utils/sparkLayerApi";
import { trackSparkSelected, trackSparksRegenerated, trackSparkInteraction } from "@/utils/analytics";

interface SparkData {
  title: string;
  tagline: string;
}

const SparkLayer = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [selectedSpark, setSelectedSpark] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sparks, setSparks] = useState<SparkData[]>([]);
  const [regenerateCount, setRegenerateCount] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showEdgeToggle, setShowEdgeToggle] = useState(false);
  
  // Get params from URL
  const urlParams = new URLSearchParams(window.location.search);
  const promptId = urlParams.get('prompt_id') || 'demo-prompt-id';
  const businessType = urlParams.get('business_type') || 'general';
  const tone = urlParams.get('tone') || 'professional';
  const outcome = urlParams.get('outcome') || 'growth';

  const MAX_REGENERATIONS = 3;
  const canRegenerate = regenerateCount < MAX_REGENERATIONS;

  useEffect(() => {
    const loadSparks = async () => {
      setIsLoading(true);
      try {
        trackSparkInteraction('sparks_loading', { 
          business_type: businessType,
          tone,
          outcome 
        });

        const response = await generateSparks({
          businessType,
          tone,
          outcome
        });

        if (response.sparks) {
          setSparks(response.sparks);
          trackSparkInteraction('sparks_loaded', { 
            spark_count: response.sparks.length 
          });
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load sparks:", error);
        setLoadError("Failed to load spark options. Please try again.");
        toast({
          title: "Loading failed",
          description: "Unable to load your spark options. Please try again.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    loadSparks();
  }, [toast, businessType, tone, outcome]);

  const handleSparkSelect = async (sparkIndex: number) => {
    setSelectedSpark(sparkIndex);
    setIsSubmitting(true);
    
    try {
      const selectedSparkData = sparks[sparkIndex];
      
      // Track spark selection
      trackSparkSelected({
        spark_id: selectedSparkData.title.toLowerCase().replace(/\s+/g, '_'),
        product: 'business_builder',
        spark_index: sparkIndex,
        attempt_count: regenerateCount,
      });
      
      // Log to Supabase
      await logSparkSelection({
        initial_prompt_id: promptId,
        selected_spark: selectedSparkData,
        product_track: 'business_builder',
        feedback: feedback || undefined,
      });
      
      console.log('[Spark Layer] Spark selected:', { 
        promptId, 
        sparkIndex, 
        sparkData: selectedSparkData,
        regenerateCount,
      });
      
      toast({
        title: "Perfect choice!",
        description: `"${selectedSparkData.title}" selected. Moving to purchase...`,
      });
      
      // Navigate to Purchase Flow
      setTimeout(() => {
        window.location.href = `/purchase?prompt_id=${promptId}&spark_index=${sparkIndex}&product_track=business_builder`;
      }, 1500);
      
    } catch (error) {
      console.error('Spark selection failed:', error);
      toast({
        title: "Selection failed",
        description: "Please try selecting your spark again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  const handleRegenerate = async () => {
    if (!canRegenerate) return;
    
    setIsRegenerating(true);
    const newCount = regenerateCount + 1;
    
    try {
      trackSparksRegenerated({
        attempt_count: newCount,
        business_type: businessType,
      });

      const response = await regenerateSparks({
        businessType,
        tone,
        outcome,
        attempt_count: newCount,
      });

      if (response.sparks) {
        setSparks(response.sparks);
        setRegenerateCount(newCount);
        setSelectedSpark(null);
        
        toast({
          title: "New sparks generated!",
          description: `Here are ${response.sparks.length} fresh options for you.`,
        });
      }
    } catch (error) {
      console.error('Regeneration failed:', error);
      toast({
        title: "Regeneration failed",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  if (isLoading) {
    return (
      <StandardBackground className="items-center justify-center">
        <PageHeader />
        <div className="text-center animate-fade-in">
          <div className="animate-spin w-12 h-12 border-4 border-[#36d1fe] border-t-transparent rounded-full mx-auto mb-4"></div>
          <PageTitle className="text-2xl mb-2">Analyzing Your Business</PageTitle>
          <BodyText className="opacity-75">Finding the perfect spark for your business...</BodyText>
        </div>
      </StandardBackground>
    );
  }

  if (loadError) {
    return (
      <StandardBackground className="items-center justify-center">
        <PageHeader />
        <div className="error-fallback text-center animate-fade-in">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <PageTitle className="text-2xl mb-2">Loading Failed</PageTitle>
          <BodyText className="opacity-75 mb-6">{loadError}</BodyText>
          <Button variant="canai" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </StandardBackground>
    );
  }

  return (
    <StandardBackground className="items-center justify-center">
      <PageHeader />
      
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <PageTitle className="mb-4">Choose Your Business Spark</PageTitle>
          <BodyText className="text-lg opacity-90">
            Select the option that best fits your goals. Each spark is designed to ignite your business potential.
          </BodyText>
          
          {/* Spark Prompt Display */}
          <div id="spark-prompt" className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <BodyText className="text-sm opacity-75">
              Based on: {businessType} • {tone} tone • Focus: {outcome}
            </BodyText>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {sparks.map((spark, index) => (
            <div
              key={`${spark.title}-${regenerateCount}`}
              id={`spark-card-${index}`}
              onClick={() => handleSparkSelect(index)}
              className={`group cursor-pointer transition-all duration-300 hover:scale-105 ${selectedSpark === index ? 'transform scale-105' : ''}`}
            >
              <StandardCard
                variant="product"
                className={`h-full flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 ${selectedSpark === index ? 'border-4 border-[#36d1fe] shadow-[0_0_20px_rgba(54,209,254,0.5)]' : 'border border-white/10'}`}
              >
                {selectedSpark === index && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="text-green-500 w-6 h-6 animate-pulse" />
                  </div>
                )}
                <Sparkles className="text-[#36d1fe] w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-white mb-2">{spark.title}</h3>
                <BodyText className="text-center opacity-80">{spark.tagline}</BodyText>
              </StandardCard>
            </div>
          ))}
        </div>

        {/* Regeneration Controls */}
        <div className="text-center mt-8 space-y-4 animate-fade-in">
          {canRegenerate && (
            <Button
              id="regenerate-btn"
              variant="ghost"
              onClick={handleRegenerate}
              disabled={isRegenerating || isSubmitting}
              className="text-[#36d1fe] hover:text-[#00f0ff] hover:bg-[#36d1fe]/10 transition-colors duration-200 text-lg px-6 py-3"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? 'Generating...' : `Regenerate Options (${MAX_REGENERATIONS - regenerateCount} left)`}
            </Button>
          )}

          {/* Feedback Input */}
          <div id="spark-regen-feedback" className="max-w-md mx-auto">
            <textarea
              id="spark-feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Any specific preferences for your spark? (optional)"
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 resize-none"
              rows={2}
              maxLength={200}
            />
          </div>

          {/* Edge Toggle */}
          <div id="edge-toggle" className="flex items-center justify-center space-x-2">
            <input
              type="checkbox"
              id="show-comparison"
              checked={showEdgeToggle}
              onChange={(e) => setShowEdgeToggle(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="show-comparison" className="text-sm text-white/70">
              Show generic AI comparison
            </label>
          </div>

          {/* Navigation */}
          <Button
            variant="ghost"
            onClick={() => window.location.href = `/discovery-funnel?prompt_id=${promptId}`}
            className="text-[#36d1fe] hover:text-[#00f0ff] hover:bg-[#36d1fe]/10 transition-colors duration-200 text-lg px-6 py-3"
            disabled={isSubmitting || isRegenerating}
          >
            {isSubmitting || isRegenerating ? 'Loading...' : '← Back to Edit Details'}
          </Button>
        </div>
      </div>
    </StandardBackground>
  );
};

export default SparkLayer;
