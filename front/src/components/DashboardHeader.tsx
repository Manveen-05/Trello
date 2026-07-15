import React from 'react'
import { useNavigate } from 'react-router'

interface Board {
  id: string
  title: string
  color: string
  date: string
  listsCount: number
  cardsCount: number
  workspaceId?: string
}

interface DashboardHeaderProps {
  activeDropdown: 'workspace' | 'recent' | 'starred' | null
  activeWorkspace: 'personal' | 'public'
  handleDropdownToggle: (type: 'workspace' | 'recent' | 'starred') => void
  setActiveWorkspace: (val: 'personal' | 'public') => void
  setActiveDropdown: (val: 'workspace' | 'recent' | 'starred' | null) => void
  boards: Board[]
  starredBoards: string[]
  searchQuery: string
  setSearchQuery: (val: string) => void
  setIsModalOpen: (val: boolean) => void
}

const styles: Record<string, React.CSSProperties> = {
  dropdownMenu: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    left: 0,
    backgroundColor: '#12131b',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '0.4rem 0',
    minWidth: '220px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.1rem',
  },
  dropdownHeader: {
    fontSize: '0.68rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    padding: '0.4rem 0.8rem 0.2rem 0.8rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
    marginBottom: '0.2rem',
  },
  searchInput: {
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#ffffff',
    fontSize: '0.8rem',
    width: '100%',
    fontFamily: 'inherit',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    marginLeft: '1.25rem',
  },
  navLink: {
    background: 'none',
    border: 'none',
    fontSize: '0.82rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '0.35rem 0.6rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.4rem',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
  },
}

export function DashboardHeader({
  activeDropdown,
  activeWorkspace,
  handleDropdownToggle,
  setActiveWorkspace,
  setActiveDropdown,
  boards,
  starredBoards,
  searchQuery,
  setSearchQuery,
  setIsModalOpen,
}: DashboardHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="app-header">
      <div className="nav-left">
        <div className="sidebar-logo" style={{ marginBottom: 0 }}>
          <svg className="sidebar-logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2.5" />
            <rect x="7" y="7" width="3" height="9" rx="1" fill="currentColor" />
            <rect x="14" y="7" width="3" height="5" rx="1" fill="currentColor" />
          </svg>
          <span className="sidebar-logo-text">TrelloFlow</span>
        </div>

        <nav style={styles.navLinks}>
          {/* Workspaces Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDropdownToggle('workspace')
              }}
              style={{
                ...styles.navLink,
                backgroundColor: activeDropdown === 'workspace' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: activeDropdown === 'workspace' ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              Workspaces
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: activeDropdown === 'workspace' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', marginLeft: '2px' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {activeDropdown === 'workspace' && (
              <div onClick={(e) => e.stopPropagation()} style={styles.dropdownMenu}>
                <div style={styles.dropdownHeader}>Current Workspace</div>
                <div
                  onClick={() => {
                    setActiveWorkspace('personal')
                    setActiveDropdown(null)
                  }}
                  className="navbar-dropdown-item"
                  style={{
                    backgroundColor: activeWorkspace === 'personal' ? 'rgba(255, 255, 255, 0.04)' : 'transparent'
                  }}
                >
                  <span style={{ display: 'inline-flex', width: '16px', height: '16px', backgroundColor: 'var(--accent-indigo)', borderRadius: '3px', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#fff', marginRight: '0.5rem' }}>P</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>Personal</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Private Workspace</span>
                  </div>
                </div>
                <div
                  onClick={() => {
                    setActiveWorkspace('public')
                    setActiveDropdown(null)
                  }}
                  className="navbar-dropdown-item"
                  style={{
                    backgroundColor: activeWorkspace === 'public' ? 'rgba(255, 255, 255, 0.04)' : 'transparent'
                  }}
                >
                  <span style={{ display: 'inline-flex', width: '16px', height: '16px', backgroundColor: 'var(--accent-purple)', borderRadius: '3px', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#fff', marginRight: '0.5rem' }}>PB</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>Public Workspace</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Shared Workspace</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDropdownToggle('recent')
              }}
              style={{
                ...styles.navLink,
                backgroundColor: activeDropdown === 'recent' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: activeDropdown === 'recent' ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              Recent
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: activeDropdown === 'recent' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', marginLeft: '2px' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {activeDropdown === 'recent' && (
              <div onClick={(e) => e.stopPropagation()} style={styles.dropdownMenu}>
                <div style={styles.dropdownHeader}>Recent Boards</div>
                {boards.slice(0, 3).map((board) => (
                  <div
                    key={`recent-${board.id}`}
                    onClick={() => {
                      navigate(`/board/${board.id}`)
                      setActiveDropdown(null)
                    }}
                    className="navbar-dropdown-item"
                  >
                    <div style={{ width: '12px', height: '12px', backgroundColor: board.color || '#6366f1', borderRadius: '2px', marginRight: '0.5rem' }}></div>
                    <span style={{ fontSize: '0.8rem', color: '#fff' }}>{board.title}</span>
                  </div>
                ))}
                {boards.length === 0 && (
                  <div style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>No recent boards</div>
                )}
              </div>
            )}
          </div>

          {/* Starred Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDropdownToggle('starred')
              }}
              style={{
                ...styles.navLink,
                backgroundColor: activeDropdown === 'starred' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: activeDropdown === 'starred' ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              Starred
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: activeDropdown === 'starred' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', marginLeft: '2px' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {activeDropdown === 'starred' && (
              <div onClick={(e) => e.stopPropagation()} style={styles.dropdownMenu}>
                <div style={styles.dropdownHeader}>Starred Boards</div>
                {boards.filter(b => starredBoards.includes(b.id)).map((board) => (
                  <div
                    key={`starred-drop-${board.id}`}
                    onClick={() => {
                      navigate(`/board/${board.id}`)
                      setActiveDropdown(null)
                    }}
                    className="navbar-dropdown-item"
                  >
                    <div style={{ width: '12px', height: '12px', backgroundColor: board.color || '#6366f1', borderRadius: '2px', marginRight: '0.5rem' }}></div>
                    <span style={{ fontSize: '0.8rem', color: '#fff' }}>{board.title}</span>
                  </div>
                ))}
                {boards.filter(b => starredBoards.includes(b.id)).length === 0 && (
                  <div style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>No starred boards</div>
                )}
              </div>
            )}
          </div>

          <button onClick={() => setIsModalOpen(true)} className="nav-btn-create">
            Create
          </button>
        </nav>
      </div>

      <div className="nav-right">
        {/* Search bar inside header */}
        <div className="input-wrapper" style={{ width: '180px', height: '30px', padding: '0 0.5rem' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.4rem', color: 'var(--text-muted)' }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ ...styles.searchInput, fontSize: '0.75rem' }}
          />
        </div>

        <button style={styles.iconBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        <div className="sidebar-user-avatar" style={{ width: '28px', height: '28px', fontSize: '0.75rem', marginLeft: '0.5rem' }}>MS</div>
      </div>
    </header>
  )
}
