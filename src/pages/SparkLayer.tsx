import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, RefreshCw, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import StandardCard from "@/components/StandardCard";
import StandardBackground from "@/components/StandardBackground";
import PageHeader from "@/components/PageHeader";
import { PageTitle, SectionTitle, BodyText, CaptionText } from "@/components/StandardTypography";

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
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock response for demo
      setSparks(mockSparks);
      
      if (isRegeneration) {
        setRegenerateCount(prev => prev + 1);
        
        // TODO: PostHog event for regeneration
        if (trustScore < 50 && regenerateCount === 2) {
          // TODO: PostHog event for extra regeneration
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
    <StandardBackground>
      <PageHeader showBackButton={true} logoSize="sm" showTagline={false} />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-[#36d1fe] animate-pulse" />
            <PageTitle className="mb-0">Your AI Sparks</PageTitle>
            <Sparkles className="w-8 h-8 text-[#36d1fe] animate-pulse" />
          </div>
          
          <BodyText className="text-xl mb-6 max-w-2xl mx-auto">
            Which spark feels most like you?
          </BodyText>
          
          <StandardCard variant="glass" padding="md" className="inline-block">
            <CaptionText className="text-[#36d1fe] font-semibold mb-0">
              💡 Take 30 seconds to feel which direction resonates with your vision
            </CaptionText>
          </StandardCard>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center gap-3 mb-12 animate-fade-in">
            <Loader2 className="w-6 h-6 text-[#36d1fe] animate-spin" />
            <BodyText className="text-lg mb-0">Generating your sparks...</BodyText>
          </div>
        )}

        {/* Spark Cards */}
        {!isLoading && sparks.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {sparks.map((spark, index) => (
              <div 
                key={spark.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <StandardCard
                  variant="product"
                  className={`hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full ${
                    selectedSpark === spark.id ? 'ring-4 ring-[#36d1fe]/50' : ''
                  }`}
                >
                  <div className="text-center h-full flex flex-col justify-between min-h-[400px]">
                    <div className="flex-1">
                      <SectionTitle className="text-[#36d1fe] text-lg mb-4 font-manrope leading-tight break-words">
                        {spark.title}
                      </SectionTitle>
                      <BodyText className="text-base leading-relaxed mb-6 break-words hyphens-auto">
                        {spark.tagline}
                      </BodyText>
                      
                      <div className="mb-6">
                        <span className="text-2xl font-bold text-[#36d1fe] font-manrope">
                          {getProductPrice(spark.productTrack)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <Button
                        variant="default"
                        size="lg"
                        className="w-full py-3 text-base font-semibold bg-[#36d1fe] hover:bg-[#00f0ff] text-white border-0"
                        onClick={() => handleSparkSelection(spark)}
                        disabled={isLoading}
                      >
                        <span>Select and Purchase</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </StandardCard>
              </div>
            ))}
          </div>
        )}

        {/* Regenerate Section */}
        {!isLoading && (
          <StandardCard variant="form" className="mb-12 animate-fade-in">
            <div className="text-center mb-6">
              <SectionTitle className="text-lg mb-2 text-white">
                Not feeling the spark?
              </SectionTitle>
              <CaptionText className="text-[#cce7fa] mb-0">
                {regenerateCount >= maxRegenerations 
                  ? "Maximum regenerations reached"
                  : `${maxRegenerations - regenerateCount} regenerations remaining`
                }
              </CaptionText>
            </div>
            
            {regenerateCount < maxRegenerations && (
              <>
                <Textarea
                  placeholder="Tell us what's off about these sparks (e.g., 'I'd prefer a bolder tone')"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="mb-6 bg-[rgba(25,60,101,0.4)] border-[#36d1fe]/30 text-[#E6F6FF] placeholder:text-[#cce7fa]/70 backdrop-blur-sm"
                  rows={3}
                />
                
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-2 border-[#36d1fe] text-[#36d1fe] bg-[rgba(25,60,101,0.4)] hover:bg-[#36d1fe]/20 hover:border-[#00f0ff] hover:text-[#00f0ff] backdrop-blur-sm"
                  onClick={handleRegenerate}
                  disabled={isLoading}
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Regenerate Sparks
                </Button>
              </>
            )}
          </StandardCard>
        )}

        {/* Edge Toggle */}
        {!isLoading && (
          <div className="text-center animate-fade-in">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#cce7fa] hover:text-[#36d1fe] mb-4"
              onClick={() => setShowGenericComparison(!showGenericComparison)}
            >
              {showGenericComparison ? "Hide" : "See"} CanAI's Edge
            </Button>
            
            {showGenericComparison && (
              <StandardCard variant="glass" padding="md" className="max-w-2xl mx-auto">
                <CaptionText className="mb-0">
                  🤖 <strong>Generic AI:</strong> "Start a bakery business"<br/>
                  ✨ <strong>CanAI:</strong> "Unite Denver families with a cozy bakery experience"
                </CaptionText>
              </StandardCard>
            )}
          </div>
        )}
      </div>
    </StandardBackground>
  );
};

export default SparkLayer;
