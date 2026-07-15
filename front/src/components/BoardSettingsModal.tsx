import React, { useState, useEffect } from 'react'

interface BoardSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  initialName: string
  initialColor: string
  initialBg: string
  onSave: (name: string, color: string, bg: string) => void
  onDelete: () => void
}

export function BoardSettingsModal({
  isOpen,
  onClose,
  initialName,
  initialColor,
  initialBg,
  onSave,
  onDelete
}: BoardSettingsModalProps) {
  const [boardNameInput, setBoardNameInput] = useState(initialName)
  const [boardColorInput, setBoardColorInput] = useState(initialColor)
  const [boardBgInput, setBoardBgInput] = useState(initialBg)

  // Sync state with props when modal opens/changes
  useEffect(() => {
    if (isOpen) {
      setBoardNameInput(initialName)
      setBoardColorInput(initialColor)
      setBoardBgInput(initialBg)
    }
  }, [isOpen, initialName, initialColor, initialBg])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(boardNameInput, boardColorInput, boardBgInput)
  }

  return (
    <div onClick={onClose} className="modal-overlay-backdrop">
      <div onClick={(e) => e.stopPropagation()} className="modal-content-card" style={{ maxWidth: '400px' }}>
        <div className="modal-header-section">
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700 }}>
            Board Settings
          </span>
          <button onClick={onClose} className="modal-close-btn">
            <svg className="modal-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="input-group">
            <label className="input-label">Board Name</label>
            <div className="input-wrapper" style={{ height: '38px' }}>
              <input
                type="text"
                required
                value={boardNameInput}
                onChange={(e) => setBoardNameInput(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Board Accent Color</label>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b', '#ef4444'].map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setBoardColorInput(col)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: col,
                    border: boardColorInput === col ? '2px solid #ffffff' : '2px solid transparent',
                    cursor: 'pointer',
                    padding: 0,
                    outline: 'none',
                    transition: 'all 0.15s ease',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Board Background</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => setBoardBgInput('')}
                style={{
                  height: '40px',
                  borderRadius: '6px',
                  border: boardBgInput === '' ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: '#12131b',
                  color: '#fff',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  outline: 'none',
                }}
              >
                Dark
              </button>

              {[
                { name: 'Mountain', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop' },
                { name: 'Night', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop' },
                { name: 'Ocean', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=1000&auto=format&fit=crop' }
              ].map((bg) => (
                <button
                  key={bg.name}
                  type="button"
                  onClick={() => setBoardBgInput(bg.url)}
                  style={{
                    height: '40px',
                    borderRadius: '6px',
                    border: boardBgInput === bg.url ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                    backgroundImage: `url(${bg.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    outline: 'none',
                  }}
                >
                  {bg.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            <button type="submit" className="submit-btn" style={{ height: '38px', width: '120px' }}>
              Save Settings
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="social-btn"
              style={{ height: '38px', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', padding: '0 1rem', transform: 'none' }}
            >
              Delete Board
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
