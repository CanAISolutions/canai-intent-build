
import React from 'react';
import { diffHighlight } from './utils';

type RefinedComparisonContainerProps = {
  canaiOutput: string;
  genericOutput: string;
};

const RefinedComparisonContainer: React.FC<RefinedComparisonContainerProps> = ({
  canaiOutput,
  genericOutput
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="comparison-container">
      {/* CanAI Output */}
      <div className="flex flex-col h-full">
        <div className="bg-gradient-to-br from-[#1E314F] to-[#2A4A6B] rounded-xl border-2 border-[#00CFFF] shadow-xl flex-1 flex flex-col min-h-[400px]">
          <div className="px-6 py-4 border-b border-[#36d1fe66]">
            <h3 className="text-lg font-bold text-[#00CFFF] flex items-center gap-2">
              <span className="w-3 h-3 bg-[#00CFFF] rounded-full"></span>
              CanAI Output
            </h3>
            <p className="text-xs text-canai-light mt-1">Personalized for your vision</p>
          </div>
          <div className="p-6 flex-1 overflow-hidden">
            <div 
              className="text-sm leading-relaxed text-canai-light h-full overflow-y-auto break-words"
              style={{ 
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto'
              }}
            >
              {diffHighlight(canaiOutput, genericOutput)}
            </div>
          </div>
        </div>
      </div>

      {/* Generic Output */}
      <div className="flex flex-col h-full">
        <div className="bg-gradient-to-br from-[#22335C] to-[#334567] rounded-xl border-2 border-[#666] shadow-xl flex-1 flex flex-col min-h-[400px]">
          <div className="px-6 py-4 border-b border-[#666]">
            <h3 className="text-lg font-bold text-gray-300 flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
              Generic Output
            </h3>
            <p className="text-xs text-gray-400 mt-1">Standard AI response</p>
          </div>
          <div className="p-6 flex-1 overflow-hidden">
            <div 
              className="text-sm leading-relaxed text-gray-300 h-full overflow-y-auto break-words"
              style={{ 
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto'
              }}
            >
              {diffHighlight(genericOutput, canaiOutput)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefinedComparisonContainer;
