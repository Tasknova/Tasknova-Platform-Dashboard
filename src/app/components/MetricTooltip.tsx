import { HelpCircle } from "lucide-react";
import { useState } from "react";

interface MetricTooltipProps {
  title: string;
  definition: string;
  calculation?: string;
  goodRange?: string;
  triggers?: string[];
}

export function MetricTooltip({
  title,
  definition,
  calculation,
  goodRange,
  triggers,
}: MetricTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label={`Help: ${title}`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-gray-900 text-white text-xs rounded-lg shadow-xl p-3 z-50 pointer-events-none">
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="border-4 border-transparent border-t-gray-900" />
          </div>

          {/* Title */}
          <div className="font-semibold mb-2 text-white">{title}</div>

          {/* Definition */}
          <div className="text-gray-200 mb-2 leading-relaxed">{definition}</div>

          {/* Calculation */}
          {calculation && (
            <div className="mb-2">
              <div className="text-gray-400 text-xs mb-1">Calculation:</div>
              <div className="text-gray-200 font-mono text-xs bg-gray-800 rounded px-2 py-1">
                {calculation}
              </div>
            </div>
          )}

          {/* Good Range */}
          {goodRange && (
            <div className="mb-2">
              <div className="text-gray-400 text-xs mb-1">Target Range:</div>
              <div className="text-green-400 font-medium">{goodRange}</div>
            </div>
          )}

          {/* Triggers */}
          {triggers && triggers.length > 0 && (
            <div>
              <div className="text-gray-400 text-xs mb-1">Triggered by:</div>
              <ul className="text-gray-200 space-y-1">
                {triggers.map((trigger, index) => (
                  <li key={index} className="flex items-start gap-1.5">
                    <span className="text-gray-500 mt-0.5">•</span>
                    <span className="flex-1">{trigger}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
