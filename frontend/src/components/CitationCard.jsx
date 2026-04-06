import React from 'react';
import { Quote, Maximize2, Hash } from 'lucide-react';

const CitationCard = ({ source }) => {
  return (
    <div className="intelligence-chip glass-card">
      <div className="chip-header">
        <div className="chip-identifier">
           <Hash size={10} className="text-brand-primary" />
           <span>PAGE {source.page + 1}</span>
        </div>
        <Maximize2 size={12} className="text-faint hover:text-white transition-colors cursor-pointer" />
      </div>
      
      <div className="chip-body">
        <Quote size={12} className="quote-icon" />
        <p className="chip-content">"{source.content}"</p>
      </div>
    </div>
  );
};

export default CitationCard;
