import React from 'react';
import { 
  FileText, 
  Search, 
  Activity, 
  Download,
  Share2
} from 'lucide-react';

const SourceExplorer = ({ activeDoc }) => {
  return (
    <div className="explorer-container">
      <div className="explorer-main">
        <header className="explorer-header glass-card">
          <div className="doc-meta-info">
             <div className="doc-icon-box">
                <FileText size={18} className="text-brand-primary" />
             </div>
             <div>
                <h3 className="doc-title">{activeDoc?.title || "Global_QS_Strategic_Review_2024.pdf"}</h3>
                <p className="doc-subtitle">Source Analytics Mode • Last indexed: Today, 10:42 AM</p>
             </div>
          </div>
          <div className="explorer-actions">
             <button className="action-btn-circle"><Search size={18} /></button>
             <button className="action-btn-circle"><Download size={18} /></button>
             <button className="action-btn-circle"><Share2 size={18} /></button>
             <div className="action-divider" />
             <button className="action-btn-primary">Export Insights</button>
          </div>
        </header>

        <div className="document-viewport glass-card">
          <div className="document-overlay">
             <div className="intelligence-highlight">
                <div className="highlight-tag">Section 4.1: Synthetic Market Intelligence</div>
                <p className="highlight-text">
                   "The convergence of predictive analytics and decentralized compute has shifted the baseline for competitive intelligence. In the APAC region, we've observed a 42% increase in latency-dependent trading strategies..."
                </p>
                <div className="highlight-footer">
                   <span>Confidence: 0.942</span>
                   <span>Model: Llama v3.3</span>
                </div>
             </div>
          </div>
          <div className="pdf-placeholder">
             <div className="skeleton-page" />
             <div className="skeleton-page" />
          </div>
        </div>
      </div>

      <aside className="explorer-sidebar glass-panel">
        <div className="explorer-sidebar-top">
           <div className="sidebar-tab-group">
              <button className="sidebar-tab active">Overview</button>
              <button className="sidebar-tab">Stats</button>
              <button className="sidebar-tab">History</button>
           </div>
           
           <div className="intelligence-score-card glass-card">
              <div className="score-header">
                 <span>Intelligence Vector</span>
                 <Activity size={14} className="text-brand-primary" />
              </div>
              <div className="score-value-row">
                 <span className="score-number">0.942</span>
                 <div className="score-trend positive">+4.2%</div>
              </div>
              <p className="score-label">Semantic Relevance Score</p>
           </div>

           <div className="insights-panel">
              <h4 className="panel-title">AI Contextual Insight</h4>
              <p className="panel-text">
                 This document contains heavy mentions of APAC-market intelligence. The AI has identified 3 key recurring themes related to your previous market research query.
              </p>
              <button className="panel-btn">View Full Summary</button>
           </div>
        </div>

        <div className="explorer-sidebar-bottom">
           <div className="file-info-group">
              <div className="info-row">
                 <span className="info-label">File Type</span>
                 <span className="info-val">Portable Document Format</span>
              </div>
              <div className="info-row">
                 <span className="info-label">Encryption</span>
                 <span className="info-val">None (Unlocked)</span>
              </div>
              <div className="info-row">
                 <span className="info-label">Pages</span>
                 <span className="info-val">32 Total</span>
              </div>
           </div>
        </div>
      </aside>
    </div>
  );
};

export default SourceExplorer;
