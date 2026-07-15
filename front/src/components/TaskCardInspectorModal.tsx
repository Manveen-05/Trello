import React from 'react'

interface Card {
  id: string
  title: string
  description: string
  label?: 'low' | 'medium' | 'high'
}

interface TaskCardInspectorModalProps {
  editingCard: Card
  modalTitle: string
  setModalTitle: (val: string) => void
  modalDesc: string
  setModalDesc: (val: string) => void
  modalLabel?: 'low' | 'medium' | 'high'
  setModalLabel: (val: 'low' | 'medium' | 'high' | undefined) => void
  handleSaveModal: (e: React.FormEvent) => void
  handleDeleteCard: () => void
  closeModal: () => void
}

const LABEL_STYLES = {
  low: { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  medium: { backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  high: { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
}

export function TaskCardInspectorModal({
  editingCard,
  modalTitle,
  setModalTitle,
  modalDesc,
  setModalDesc,
  modalLabel,
  setModalLabel,
  handleSaveModal,
  handleDeleteCard,
  closeModal,
}: TaskCardInspectorModalProps) {
  return (
    <div onClick={closeModal} className="modal-overlay-backdrop">
      <div onClick={(e) => e.stopPropagation()} className="modal-content-card" style={{ maxWidth: '440px' }}>
        <div className="modal-header-section">
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700 }}>
            Task Inspector
          </span>
          <button onClick={closeModal} className="modal-close-btn">
            <svg className="modal-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSaveModal} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="input-group">
            <label className="input-label">Task Name</label>
            <div className="input-wrapper" style={{ height: '38px' }}>
              <input
                type="text"
                required
                value={modalTitle}
                onChange={(e) => setModalTitle(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Priority Tag</label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {(['low', 'medium', 'high'] as const).map((lbl) => (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => setModalLabel(modalLabel === lbl ? undefined : lbl)}
                  style={{
                    flex: 1,
                    padding: '0.4rem 0',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: modalLabel === lbl ? '2px solid #ffffff' : '2px solid transparent',
                    ...LABEL_STYLES[lbl],
                  }}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Description</label>
            <div className="input-wrapper" style={{ height: '80px', padding: '0.5rem 0.75rem' }}>
              <textarea
                placeholder="Enter details for this task..."
                value={modalDesc}
                onChange={(e) => setModalDesc(e.target.value)}
                className="input-field"
                style={{ height: '100%', resize: 'none', padding: 0 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            <button type="submit" className="submit-btn" style={{ height: '38px', width: '120px' }}>
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleDeleteCard}
              className="social-btn"
              style={{ height: '38px', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', padding: '0 1rem', transform: 'none' }}
            >
              Delete Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
