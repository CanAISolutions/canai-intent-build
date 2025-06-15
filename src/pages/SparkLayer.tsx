import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StandardBackground from "@/components/StandardBackground";
import StandardCard from "@/components/StandardCard";
import { PageTitle, BodyText } from "@/components/StandardTypography";
import PageHeader from "@/components/PageHeader";

interface SparkData {
  title: string;
  description: string;
}

const mockSparks: SparkData[] = [
  {
    title: "Investor-Ready Business Plan",
    description: "A comprehensive plan to attract investors and secure funding."
  },
  {
    title: "Growth-Focused Marketing Strategy",
    description: "A detailed strategy to expand your customer base and increase sales."
  },
  {
    title: "Streamlined Operations Blueprint",
    description: "A clear blueprint to optimize your business operations and improve efficiency."
  }
];

const SparkLayer = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSpark, setSelectedSpark] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Get prompt_id from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const promptId = urlParams.get('prompt_id') || 'demo-prompt-id';

  useEffect(() => {
    const loadSparks = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load sparks:", error);
        setLoadError("Failed to load options. Please try again.");
        toast({
          title: "Loading failed",
          description: "Unable to load your spark options. Please try again.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    loadSparks();
  }, [toast]);

  const handleSparkSelect = async (sparkIndex: number) => {
    setSelectedSpark(sparkIndex);
    setIsSubmitting(true);
    
    try {
      const selectedSparkData = mockSparks[sparkIndex];
      
      // Log the spark selection
      console.log('Spark selected:', { 
        promptId, 
        sparkIndex, 
        sparkData: selectedSparkData 
      });
      
      // Show success feedback
      toast({
        title: "Perfect choice!",
        description: `"${selectedSparkData.title}" selected. Moving to purchase...`,
      });
      
      // Navigate to Purchase Flow
      setTimeout(() => {
        window.location.href = `/purchase?prompt_id=${promptId}&spark_index=${sparkIndex}`;
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {mockSparks.map((spark, index) => (
            <div
              key={index}
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
                <BodyText className="text-center opacity-80">{spark.description}</BodyText>
              </StandardCard>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => window.location.href = `/discovery-funnel?prompt_id=${promptId}`}
            className="text-[#36d1fe] hover:text-[#00f0ff] hover:bg-[#36d1fe]/10 transition-colors duration-200 text-lg px-6 py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Loading...' : '← Back to Edit Details'}
          </Button>
        </div>
      </div>
    </StandardBackground>
  );
};

export default SparkLayer;
