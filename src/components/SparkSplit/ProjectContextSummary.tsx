
import React from "react";

const demoContext = [
  ["Business", "Sprinkle Haven Bakery"],
  ["Target Audience", "Denver families"],
  ["Goal", "Funding"],
  ["Competitive", "Blue Moon Bakery"],
  ["Voice", "Warm"],
  ["Constraints", "$50k, 3 people, 6 months"],
  ["Location", "Denver, CO"],
  ["Value", "Organic, community-focused pastries"],
];

const ProjectContextSummary: React.FC = () => (
  <div className="max-w-[330px] w-full bg-[#193c65c9] rounded-2xl px-6 py-8 flex flex-col gap-2 border-l-4 border-[#36d1fe] shadow-strong min-h-full mb-4">
    <div className="font-bold text-lg mb-2 text-canai-cyan">Your Project</div>
    <ul className="text-canai-light-blue text-sm space-y-2">
      {demoContext.map(([label, value]) => (
        <li key={label}>
          <span className="font-semibold">{label}:</span> <span>{value}</span>
        </li>
      ))}
    </ul>
    <div className="text-xs text-canai-light-softer italic mt-4">
      “How your brief shaped both plans”
    </div>
  </div>
);

export default ProjectContextSummary;
