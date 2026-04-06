import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileSearch, 
  Library, 
  Settings, 
  User, 
  Sparkles,
  LogOut,
  Plus
} from 'lucide-react';

const Sidebar = ({ activeView, onViewChange }) => {
  return (
    <aside className="sidebar-container glass-panel">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <Sparkles className="text-brand-primary" size={24} fill="currentColor" />
          <h2 className="logo-text">DOCCHAT</h2>
        </div>

        <button className="new-analysis-btn">
          <div className="plus-icon-wrapper">
            <Plus size={14} />
          </div>
          <span>New Analysis</span>
        </button>

        <nav className="nav-section">
          <button 
            className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => onViewChange('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
            {activeView === 'dashboard' && <div className="active-indicator" />}
          </button>

          <button 
            className={`nav-item ${activeView === 'history' ? 'active' : ''}`}
            onClick={() => onViewChange('history')}
          >
            <MessageSquare size={18} />
            <span>AI Chat</span>
          </button>

          <button 
            className={`nav-item ${activeView === 'source' ? 'active' : ''}`}
            onClick={() => onViewChange('source')}
          >
            <FileSearch size={18} />
            <span>Explorer</span>
          </button>

          <button 
            className={`nav-item ${activeView === 'library' ? 'active' : ''}`}
            onClick={() => onViewChange('library')}
          >
            <Library size={18} />
            <span>Library</span>
          </button>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="secondary-nav">
          <button className="nav-item">
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>

        <div className="user-profile">
          <div className="user-avatar">
            <User size={16} />
          </div>
          <div className="user-details">
            <span className="user-name">P Niranjan</span>
            <span className="user-role">Intelligence Lead</span>
          </div>
          <LogOut size={16} className="text-dim" style={{ marginLeft: 'auto' }} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
