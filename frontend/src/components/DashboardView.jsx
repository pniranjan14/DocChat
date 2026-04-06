import React from 'react';
import { 
  Upload, 
  FileText, 
  Activity, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Loader2
} from 'lucide-react';

const DashboardView = ({ onFileUpload, isUploading, recentDocs }) => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="greeting">Intelligence Hub</h1>
        <p className="text-dim">Welcome back, P Niranjan. Your intelligence suite is fully synchronized.</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon-box">
             <FileText className="text-brand-primary" size={24} />
          </div>
          <div className="stat-info">
             <span className="stat-label">Total Analyzed</span>
             <h3 className="stat-value">{recentDocs.length} Documents</h3>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon-box" style={{ background: 'rgba(74, 222, 128, 0.1)' }}>
             <Activity style={{ color: '#4ade80' }} size={24} />
          </div>
          <div className="stat-info">
             <span className="stat-label">System Status</span>
             <h3 className="stat-value">Operational</h3>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon-box" style={{ background: 'rgba(255, 145, 0, 0.1)' }}>
             <Zap size={24} style={{ color: '#ff9100' }} />
          </div>
          <div className="stat-info">
             <span className="stat-label">AI Processing</span>
             <h3 className="stat-value">Ready</h3>
          </div>
        </div>
      </div>

      <div className="drop-zone-container">
        <div 
          className="drop-zone"
          onClick={() => document.getElementById('dash-upload').click()}
        >
          {isUploading ? (
            <div className="upload-loading-state">
               <Loader2 className="animate-spin text-brand-primary" size={48} />
               <p>Ingesting Intelligence Data...</p>
            </div>
          ) : (
            <>
              <div className="upload-icon-wrapper">
                <Upload size={32} className="text-brand-primary" />
              </div>
              <h3>Drag & Drop Intelligence Packs</h3>
              <p className="text-dim">Supports .PDF formats for high-fidelity scanning</p>
              <button className="upload-cta">Select Local Files</button>
            </>
          )}
          <input 
            type="file" 
            id="dash-upload" 
            hidden 
            onChange={onFileUpload} 
            accept=".pdf"
            disabled={isUploading}
          />
        </div>
      </div>

      <div className="recent-activity-section">
        <div className="section-header">
           <h3 className="section-title">Investigative History</h3>
           <button className="view-all-btn">View Full Library <ChevronRight size={14} /></button>
        </div>

        <div className="activity-list">
          {recentDocs.length > 0 ? (
            recentDocs.map((doc, idx) => (
              <div key={idx} className="activity-item glass-card">
                 <div className="doc-preview-box">
                    <FileText size={20} className="text-dim" />
                 </div>
                 <div className="activity-details">
                    <h4 className="activity-doc-title">{doc.title}</h4>
                    <div className="activity-meta">
                       <span className="meta-tag">PDF</span>
                       <span className="meta-sep">•</span>
                       <span className="meta-date">Recently Analyzed</span>
                    </div>
                 </div>
                 <div className="activity-action">
                    <BarChart3 size={18} className="text-dim hover:text-brand-primary transition-colors cursor-pointer" />
                 </div>
              </div>
            ))
          ) : (
            <div className="empty-history glass-card">
               <ShieldCheck size={32} className="text-faint" />
               <p>No investigations logged yet. Start by uploading a document.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
