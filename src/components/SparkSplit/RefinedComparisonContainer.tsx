import React from 'react';
import SparkleIcon from './SparkleIcon';

type RefinedComparisonContainerProps = {
  canaiOutput: string;
  genericOutput: string;
};

const RefinedComparisonContainer: React.FC<RefinedComparisonContainerProps> = ({
  canaiOutput,
  genericOutput
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="comparison-container">
      {/* CanAI Output */}
      <div className="flex flex-col h-full">
        <div
          className="
            bg-gradient-to-br from-[#193c65cc] to-[#1E314Fcc] 
            rounded-2xl border-2 border-[#00CFFF] shadow-2xl flex-1 flex flex-col min-h-[500px] overflow-hidden 
            ring-canai-primary transition-all duration-300
            hover:shadow-[0_0_32px_#00CFFF88] hover:border-cyan-400 focus-within:border-cyan-400
            backdrop-blur-xl">
          <div className="px-8 py-7 border-b border-[#36d1fe33] bg-gradient-to-r from-[#00CFFF]/15 to-transparent">
            <h3 className="flex items-center gap-2 font-playfair text-2xl md:text-3xl font-bold text-transparent bg-gradient-to-r from-[#00CFFF] to-[#00B2E3] bg-clip-text drop-shadow animate-glow-pop mb-1 select-none focus:ring-2 focus:ring-canai-primary">
              <SparkleIcon /> Personalized for Your Vision
            </h3>
            <p className="text-base font-medium text-[#E6F6FF] opacity-90 font-manrope">Made uniquely for you</p>
          </div>
          <div className="p-8 flex-1 overflow-hidden">
            <div 
              className="font-manrope text-lg md:text-xl text-[#E6F6FF] h-full overflow-y-auto prose prose-invert max-w-none"
              style={{ 
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                lineHeight: '1.72',
                textShadow: '0 1px 12px #193c653c'
              }}
            >
              {canaiOutput}
            </div>
          </div>
        </div>
      </div>

      {/* Generic Output */}
      <div className="flex flex-col h-full">
        <div className="bg-gradient-to-br from-[#22335Cdd] to-[#34495Ea5] rounded-2xl border-2 border-[#95A5A6] shadow-2xl flex-1 flex flex-col min-h-[500px] overflow-hidden ring-2 ring-[#95A5A6]/30 focus-within:ring-cyan-300 transition-all duration-300 backdrop-blur-xl hover:border-cyan-200">
          <div className="px-8 py-7 border-b border-[#95A5A6]/20 bg-gradient-to-r from-[#95A5A6]/10 to-transparent">
            <h3 className="flex items-center gap-2 font-playfair text-2xl md:text-3xl font-bold text-[#BDC3C7] mb-1 select-none">
              <span role="img" aria-label="Robot" className="animate-glow-pop scale-95 mr-1">🤖</span>
              Standard AI Response
            </h3>
            <p className="text-base font-medium text-[#ECF0F1] opacity-80 font-manrope">What a generic AI might suggest</p>
          </div>
          <div className="p-8 flex-1 overflow-hidden">
            <div 
              className="font-manrope text-lg md:text-xl text-[#ECF0F1] h-full overflow-y-auto prose prose-invert max-w-none"
              style={{ 
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                lineHeight: '1.72',
                textShadow: '0 1px 10px #22335c28'
              }}
            >
              {genericOutput}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefinedComparisonContainer;
