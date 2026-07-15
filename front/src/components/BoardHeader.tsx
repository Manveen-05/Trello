import React from 'react'
import { Link } from 'react-router'

interface BoardHeaderProps {
  boardTitle: string
  boardColor: string
  boardBackground?: string
  copied: boolean
  handleShare: () => void
  openBoardSettings: () => void
}

export function BoardHeader({
  boardTitle,
  boardColor,
  boardBackground,
  copied,
  handleShare,
  openBoardSettings,
}: BoardHeaderProps) {
  return (
    <>
      {/* Top Navbar Header */}
      <header className="app-header">
        <div className="nav-left">
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', color: 'var(--text-secondary)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>Dashboard</span>
          </Link>

          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-heading)' }}>
            {boardTitle}
          </span>
        </div>

        <div className="nav-right">
          <div className="sidebar-user-avatar" style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>MS</div>
        </div>
      </header>

      {/* Sub-header Bar */}
      <div className="board-header-bar">
        <h1 className="board-title-text" style={{ textShadow: boardBackground ? '0 2px 4px rgba(0,0,0,0.5)' : undefined }}>
          {boardTitle}
        </h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="board-header-btn" onClick={handleShare}>
            {copied ? 'Copied!' : 'Share'}
          </button>
          <button className="board-header-btn" onClick={openBoardSettings}>
            Settings
          </button>
        </div>
      </div>
    </>
  )
}
