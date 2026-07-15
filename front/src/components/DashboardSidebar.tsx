import React from 'react'

interface DashboardSidebarProps {
  activeWorkspace: 'personal' | 'public'
  setActiveWorkspace: (val: 'personal' | 'public') => void
  handleSignOut: () => void
}

export function DashboardSidebar({
  activeWorkspace,
  setActiveWorkspace,
  handleSignOut,
}: DashboardSidebarProps) {
  return (
    <aside className="dashboard-sidebar" style={{ borderRight: '1px solid var(--border-color)' }}>
      <div className="sidebar-section-title" style={{ marginTop: '0.5rem' }}>Workspace</div>
      <nav className="sidebar-menu" style={{ flex: 'none', gap: '0.2rem' }}>
        <button className="sidebar-item active">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
          Boards
        </button>
      </nav>

      <div className="sidebar-section-title">My Workspaces</div>
      <nav className="sidebar-menu" style={{ flex: 'none', gap: '0.2rem' }}>
        <button
          onClick={() => setActiveWorkspace('personal')}
          className={`sidebar-item ${activeWorkspace === 'personal' ? 'active' : ''}`}
          style={{ fontWeight: 600 }}
        >
          <span style={{ display: 'inline-flex', width: '18px', height: '18px', backgroundColor: 'var(--accent-indigo)', borderRadius: '3px', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#fff', marginRight: '0.5rem' }}>P</span>
          Personal
        </button>
        <button
          onClick={() => setActiveWorkspace('public')}
          className={`sidebar-item ${activeWorkspace === 'public' ? 'active' : ''}`}
          style={{ fontWeight: 600 }}
        >
          <span style={{ display: 'inline-flex', width: '18px', height: '18px', backgroundColor: 'var(--accent-purple)', borderRadius: '3px', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#fff', marginRight: '0.5rem' }}>PB</span>
          Public Workspace
        </button>
      </nav>

      {/* User profile details and Sign Out at the very bottom */}
      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 0.5rem' }}>
          <div className="sidebar-user-avatar" style={{ width: '26px', height: '26px', fontSize: '0.7rem' }}>MS</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff' }}>Manveen Singh</span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>manveen@example.com</span>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="sidebar-item"
          style={{ color: '#f87171' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
