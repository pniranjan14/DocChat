import React from 'react';
import { 
  Send, 
  Sparkles, 
  Loader2, 
  FileText, 
  ExternalLink,
  Info
} from 'lucide-react';
import CitationCard from './CitationCard';

const ChatView = ({ 
  messages, 
  query, 
  setQuery, 
  onSend, 
  isSending, 
  currentDocName,
  messagesEndRef 
}) => {
  // Extract all sources from messages for the sidebar
  const allSources = messages
    .filter(m => m.role === 'ai' && m.sources)
    .flatMap(m => m.sources);

  return (
    <div className="chat-view-container">
      <div className="chat-main-column">
        <header className="chat-header glass-card">
          <div className="header-info">
             <div className="doc-indicator">
                <FileText size={14} className="text-brand-primary" />
             </div>
             <div>
                <h3 className="header-title">Analyzing "{currentDocName || 'Knowledge Base'}"</h3>
                <p className="header-subtitle">Ask anything about the document's structure, financial summaries, or key takeaways.</p>
             </div>
          </div>
          <div className="header-actions">
             <div className="status-badge">
                <div className="status-dot pulse" />
                <span>AI Live</span>
             </div>
          </div>
        </header>

        <div className="messages-scroll-area">
          {messages.length === 0 ? (
            <div className="chat-empty-state">
              <Sparkles size={40} className="text-brand-primary opacity-20" />
              <h3>Start your investigation</h3>
              <p>Type a query below to retrieve intelligence from your uploaded documents.</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`message-wrapper ${msg.role}`}>
                <div className="message-bubble">
                  {msg.role === 'ai' && (
                    <div className="ai-brand-tag">
                      <Sparkles size={12} />
                      DOCCHAT INTELLIGENCE
                    </div>
                  )}
                  <p className="message-text">{msg.content}</p>
                  
                  {msg.role === 'ai' && msg.sources && msg.sources.length > 0 && (
                    <div className="inline-citations">
                      <p className="citation-label">Verified Sources:</p>
                      <div className="citations-grid">
                        {msg.sources.map((src, sIdx) => (
                          <CitationCard key={sIdx} source={src} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          
          {isSending && (
            <div className="message-wrapper ai loading">
              <div className="message-bubble">
                 <div className="loading-state">
                    <Loader2 className="animate-spin text-brand-primary" size={20} />
                    <span>Synthesizing response...</span>
                 </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-area" onSubmit={onSend}>
          <div className="input-glass-wrapper">
             <input 
               type="text" 
               className="neon-input" 
               placeholder="Enter follow-up or a specific question..."
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               disabled={isSending}
             />
             <button type="submit" className="neon-send-btn" disabled={!query.trim() || isSending}>
               {isSending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
             </button>
          </div>
          <p className="input-disclaimer">Powered by The Intelligent Layer. DocChat can make mistakes. Verify important info.</p>
        </form>
      </div>

      <aside className="chat-sources-sidebar glass-panel">
        <div className="sidebar-section-header">
           <Info size={16} className="text-brand-primary" />
           <h3>Active Sources</h3>
        </div>
        
        <div className="sources-scroll">
           {allSources.length > 0 ? (
             allSources.map((src, idx) => (
               <div key={idx} className="source-mini-card glass-card">
                  <div className="mini-card-header">
                     <span className="page-tag">PAGE {src.page + 1}</span>
                     <ExternalLink size={12} className="text-dim" />
                  </div>
                  <p className="mini-card-content">{src.content}</p>
                  <div className="relevance-bar">
                     <div className="relevance-fill" style={{ width: '85%' }} />
                  </div>
               </div>
             ))
           ) : (
             <div className="empty-sources">
                <FileText size={32} className="text-faint" />
                <p>No active sources retrieved yet.</p>
             </div>
           )}
        </div>
      </aside>
    </div>
  );
};

export default ChatView;
