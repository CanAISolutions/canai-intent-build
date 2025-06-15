
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, RefreshCw, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";

// Types for spark data
interface Spark {
  id: string;
  title: string;
  tagline: string;
  productTrack: 'business_builder' | 'social_email' | 'site_audit';
}

interface SparkLayerProps {
  // Will be populated from previous steps
  businessType?: string;
  tone?: string;
  outcome?: string;
  trustScore?: number;
}

const SparkLayer: React.FC<SparkLayerProps> = ({
  businessType = "bakery",
  tone = "warm",
  outcome = "community_connection",
  trustScore = 75
}) => {
  const navigate = useNavigate();
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSpark, setSelectedSpark] = useState<string | null>(null);
  const [regenerateCount, setRegenerateCount] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showEdgeToggle, setShowEdgeToggle] = useState(false);
  const [showGenericComparison, setShowGenericComparison] = useState(false);

  const maxRegenerations = trustScore < 50 ? 4 : 3;

  // Mock spark data for demo
  const mockSparks: Spark[] = [
    {
      id: "community_spark",
      title: "BUSINESS_BUILDER: The Community Spark",
      tagline: "Unite Denver families with a cozy bakery experience",
      productTrack: "business_builder"
    },
    {
      id: "tradition_spark", 
      title: "BUSINESS_BUILDER: The Tradition Spark",
      tagline: "Blend heritage recipes with modern neighborhood charm",
      productTrack: "business_builder"
    },
    {
      id: "wellness_spark",
      title: "BUSINESS_BUILDER: The Wellness Spark", 
      tagline: "Nourish your community with wholesome, artisan breads",
      productTrack: "business_builder"
    }
  ];

  // Initialize sparks on component mount
  useEffect(() => {
    generateSparks();
    
    // TODO: PostHog event for page view
    // posthog.capture('funnel_step', { step: 'spark_layer_viewed' });
  }, []);

  const generateSparks = async (isRegeneration = false) => {
    setIsLoading(true);
    
    try {
      // TODO: API call to generate sparks
      // const response = await fetch('/v1/generate-sparks', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     businessType,
      //     tone,
      //     outcome,
      //     ...(isRegeneration && { attempt_count: regenerateCount + 1 })
      //   })
      // });
      
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // TODO: Replace with actual API response
      // const data = await response.json();
      // setSparks(data.sparks);
      
      // Mock response for demo
      setSparks(mockSparks);
      
      if (isRegeneration) {
        setRegenerateCount(prev => prev + 1);
        
        // TODO: PostHog event for regeneration
        // posthog.capture('sparks_regenerated', { 
        //   attempt_count: regenerateCount + 1,
        //   trust_score: trustScore 
        // });
        
        if (trustScore < 50 && regenerateCount === 2) {
          // TODO: PostHog event for extra regeneration
          // posthog.capture('sparks_regenerated_extra', {
          //   attempt_count: regenerateCount + 1,
          //   trust_score: trustScore
          // });
          
          // TODO: Supabase logging for low trust regeneration
          // await logToSupabase('spark_logs', {
          //   feedback: 'low_trust_regen',
          //   attempt_count: regenerateCount + 1,
          //   trust_score: trustScore
          // });
        }
      }
      
    } catch (error) {
      console.error('Failed to generate sparks:', error);
      
      // Fallback to localStorage or mock data
      const cachedSparks = localStorage.getItem('cached_sparks');
      if (cachedSparks) {
        setSparks(JSON.parse(cachedSparks));
      } else {
        setSparks(mockSparks);
      }
      
      toast.error("Using cached sparks due to connection issue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSparkSelection = async (spark: Spark) => {
    setSelectedSpark(spark.id);
    
    try {
      // TODO: Supabase logging
      // await logToSupabase('spark_logs', {
      //   selected_spark: spark,
      //   product_track: spark.productTrack,
      //   feedback: feedback || null,
      //   initial_prompt_id: 'uuid-from-previous-step'
      // });
      
      // TODO: PostHog event
      // posthog.capture('spark_selected', {
      //   spark_id: spark.id,
      //   product: spark.productTrack,
      //   selection_time: Date.now() - pageLoadTime
      // });
      
      // Navigate to purchase flow
      setTimeout(() => {
        navigate('/purchase', { 
          state: { 
            selectedProduct: spark.productTrack,
            sparkId: spark.id,
            sparkTitle: spark.title 
          }
        });
      }, 500);
      
    } catch (error) {
      console.error('Failed to log spark selection:', error);
      toast.error("Selection saved locally");
      
      // Fallback to localStorage
      localStorage.setItem('selected_spark', JSON.stringify(spark));
      navigate('/purchase');
    }
  };

  const handleRegenerate = () => {
    if (regenerateCount >= maxRegenerations) {
      toast.error("Maximum regenerations reached");
      return;
    }
    
    generateSparks(true);
    setFeedback("");
  };

  const getProductPrice = (productTrack: string) => {
    const prices = {
      business_builder: '$99',
      social_email: '$49', 
      site_audit: '$79'
    };
    return prices[productTrack as keyof typeof prices] || '$99';
  };

  return (
    <main 
      className="min-h-screen w-full flex flex-col items-center justify-center px-4"
      style={{
        background: `radial-gradient(ellipse at 55% 24%, #152647 0%, #091023 65%, #052947 100%)`,
        backgroundColor: "#0A1535",
      }}
    >
      {/* Header */}
      <div className="text-center mb-12 max-w-4xl">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Sparkles className="w-8 h-8 text-canai-cyan animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold text-canai-light animate-text-glow">
            Your AI Sparks
          </h1>
          <Sparkles className="w-8 h-8 text-canai-cyan animate-pulse" />
        </div>
        
        <p className="text-xl text-canai-light-blue mb-4">
          Which spark feels most like you?
        </p>
        
        <div 
          id="spark-prompt" 
          className="text-sm text-canai-light-blue/80 bg-canai-blue-card/30 rounded-lg px-4 py-2 inline-block"
        >
          💡 Take 30 seconds to feel which direction resonates with your vision
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center gap-3 mb-8">
          <Loader2 className="w-6 h-6 text-canai-cyan animate-spin" />
          <span className="text-canai-light text-lg">Generating your sparks...</span>
        </div>
      )}

      {/* Spark Cards */}
      {!isLoading && sparks.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 max-w-7xl w-full">
          {sparks.map((spark, index) => (
            <Card
              key={spark.id}
              id="spark-card"
              className={`canai-product-card hover:scale-102 transition-all duration-300 cursor-pointer ${
                selectedSpark === spark.id ? 'ring-4 ring-canai-primary' : ''
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-canai-card-title text-xl mb-3">
                  {spark.title}
                </CardTitle>
                <p className="text-canai-light-blue text-lg leading-relaxed">
                  {spark.tagline}
                </p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="text-center mb-6">
                  <span className="text-2xl font-bold text-canai-primary">
                    {getProductPrice(spark.productTrack)}
                  </span>
                </div>
                
                <Button
                  id="purchase-btn"
                  variant="canai"
                  size="lg"
                  className="w-full"
                  onClick={() => handleSparkSelection(spark)}
                  disabled={isLoading}
                >
                  <span>Select and Purchase</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Regenerate Section */}
      {!isLoading && (
        <div className="bg-canai-blue-card/50 border border-canai-primary/30 rounded-xl p-6 mb-8 max-w-2xl w-full">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-canai-light mb-2">
              Not feeling the spark?
            </h3>
            <p className="text-canai-light-blue text-sm">
              {regenerateCount >= maxRegenerations 
                ? "Maximum regenerations reached"
                : `${maxRegenerations - regenerateCount} regenerations remaining`
              }
            </p>
          </div>
          
          {regenerateCount < maxRegenerations && (
            <>
              <Textarea
                id="spark-regen-feedback"
                placeholder="Tell us what's off about these sparks (e.g., 'I'd prefer a bolder tone')"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="mb-4 bg-canai-primary-blue-dark/50 border-canai-primary/30 text-canai-light"
                rows={3}
              />
              
              <Button
                id="regenerate-btn"
                variant="outline"
                size="lg"
                className="w-full border-canai-cyan text-canai-cyan hover:bg-canai-cyan hover:text-canai-primary-blue"
                onClick={handleRegenerate}
                disabled={isLoading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate Sparks
              </Button>
            </>
          )}
        </div>
      )}

      {/* Edge Toggle */}
      {!isLoading && (
        <div className="text-center">
          <Button
            id="edge-toggle"
            variant="ghost"
            size="sm"
            className="text-canai-light-blue hover:text-canai-cyan"
            onClick={() => setShowGenericComparison(!showGenericComparison)}
          >
            {showGenericComparison ? "Hide" : "See"} CanAI's Edge
          </Button>
          
          {showGenericComparison && (
            <div className="mt-4 p-4 bg-canai-primary-blue-dark/30 rounded-lg max-w-lg mx-auto">
              <p className="text-canai-light-blue text-sm">
                🤖 <strong>Generic AI:</strong> "Start a bakery business"<br/>
                ✨ <strong>CanAI:</strong> "Unite Denver families with a cozy bakery experience"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Feedback Input */}
      <div className="fixed bottom-4 right-4">
        <Textarea
          id="spark-feedback"
          placeholder="Quick feedback..."
          className="w-64 bg-canai-blue-card/80 border-canai-primary/30 text-canai-light text-sm"
          rows={2}
        />
      </div>
    </main>
  );
};

export default SparkLayer;
