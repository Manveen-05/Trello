import React from 'react'

interface CreateBoardModalProps {
  isOpen: boolean
  onClose: () => void
  newBoardTitle: string
  setNewBoardTitle: (val: string) => void
  selectedColor: string
  setSelectedColor: (val: string) => void
  onCreate: (e: React.FormEvent) => void
  accentColors: string[]
}

export function CreateBoardModal({
  isOpen,
  onClose,
  newBoardTitle,
  setNewBoardTitle,
  selectedColor,
  setSelectedColor,
  onCreate,
  accentColors
}: CreateBoardModalProps) {
  if (!isOpen) return null

  return (
    <div onClick={onClose} className="modal-overlay-backdrop">
      <div onClick={(e) => e.stopPropagation()} className="modal-content-card">
        <div className="modal-header-section">
          <h3 className="modal-title-text">Create Board</h3>
          <button onClick={onClose} className="modal-close-btn">
            <svg className="modal-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={onCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="input-group">
            <label className="input-label">Board Title</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="15" y1="3" x2="15" y2="21" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
              </svg>
              <input
                type="text"
                required
                placeholder="e.g. Sprint Planning"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                className="input-field"
                autoFocus
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Select Color Theme</label>
            <div className="swatch-selectors-grid">
              {accentColors.map((color, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedColor(color)}
                  className={`gradient-color-swatch ${selectedColor === color ? 'active-selected' : ''}`}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <svg className="selected-swatch-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn" style={{ height: '40px', marginTop: '0.75rem' }}>
            Create Board
          </button>
        </form>
      </div>
    </div>
  )
}
