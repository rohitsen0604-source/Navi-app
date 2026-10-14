import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className = '',
}) => {
  const [openIds, setOpenIds] = useState<string[]>([items[0]?.id || '']);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds(prev =>
        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds(prev => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map(item => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            className="border border-slate-200/90 rounded-2xl bg-white overflow-hidden transition-colors"
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full px-4 sm:px-6 py-3.5 sm:py-4.5 min-h-[48px] text-left flex items-center justify-between gap-3 sm:gap-4 font-semibold text-slate-900 hover:text-[#EB4D37] transition-colors focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="text-sm sm:text-lg">{item.title}</span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-[#EB4D37]' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-1 text-slate-600 text-xs sm:text-base leading-relaxed border-t border-slate-100 animate-fadeIn">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
