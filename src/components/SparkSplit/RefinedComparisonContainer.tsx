
import React from 'react';

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
        <div className="bg-gradient-to-br from-[#1E314F] to-[#2A4A6B] rounded-2xl border-2 border-[#00CFFF] shadow-2xl flex-1 flex flex-col min-h-[500px] overflow-hidden">
          <div className="px-8 py-6 border-b border-[#36d1fe33] bg-gradient-to-r from-[#00CFFF]/10 to-transparent">
            <h3 className="text-xl font-bold text-[#00CFFF] flex items-center gap-3 mb-2">
              <div className="w-4 h-4 bg-[#00CFFF] rounded-full shadow-lg shadow-[#00CFFF]/50"></div>
              CanAI Output
            </h3>
            <p className="text-sm text-[#E6F6FF] opacity-90">Personalized for your vision</p>
          </div>
          <div className="p-8 flex-1 overflow-hidden">
            <div 
              className="text-base leading-relaxed text-[#E6F6FF] h-full overflow-y-auto prose prose-invert max-w-none"
              style={{ 
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                lineHeight: '1.7'
              }}
            >
              {canaiOutput}
            </div>
          </div>
        </div>
      </div>

      {/* Generic Output */}
      <div className="flex flex-col h-full">
        <div className="bg-gradient-to-br from-[#2C3E50] to-[#34495E] rounded-2xl border-2 border-[#95A5A6] shadow-xl flex-1 flex flex-col min-h-[500px] overflow-hidden">
          <div className="px-8 py-6 border-b border-[#95A5A6]/30 bg-gradient-to-r from-[#95A5A6]/10 to-transparent">
            <h3 className="text-xl font-bold text-[#BDC3C7] flex items-center gap-3 mb-2">
              <div className="w-4 h-4 bg-[#95A5A6] rounded-full"></div>
              Generic Output
            </h3>
            <p className="text-sm text-[#95A5A6] opacity-90">Standard AI response</p>
          </div>
          <div className="p-8 flex-1 overflow-hidden">
            <div 
              className="text-base leading-relaxed text-[#ECF0F1] h-full overflow-y-auto prose prose-invert max-w-none"
              style={{ 
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                lineHeight: '1.7'
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
