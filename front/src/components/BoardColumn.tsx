import React from 'react'

interface Card {
  id: string
  title: string
  description: string
  label?: 'low' | 'medium' | 'high'
}

interface List {
  id: string
  title: string
  cards: Card[]
}

interface BoardColumnProps {
  list: List
  dragOverCol: string | null
  activeComposerCol: string | null
  newCardTitle: string
  setNewCardTitle: (val: string) => void
  setActiveComposerCol: (val: string | null) => void
  handleDragOver: (e: React.DragEvent, id: string) => void
  handleDrop: (e: React.DragEvent, id: string) => void
  handleDragStart: (e: React.DragEvent, cardId: string, listId: string) => void
  handleDragEnd: () => void
  openEditModal: (card: Card, listId: string) => void
  handleAddCard: (listId: string) => void
  handleDeleteList: (listId: string) => void
  draggingId: string | null
}

const LABEL_STYLES = {
  low: { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  medium: { backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  high: { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
}

export function BoardColumn({
  list,
  dragOverCol,
  activeComposerCol,
  newCardTitle,
  setNewCardTitle,
  setActiveComposerCol,
  handleDragOver,
  handleDrop,
  handleDragStart,
  handleDragEnd,
  openEditModal,
  handleAddCard,
  handleDeleteList,
  draggingId,
}: BoardColumnProps) {
  const listCards = list.cards || []

  return (
    <div
      onDragOver={(e) => handleDragOver(e, list.id)}
      onDrop={(e) => handleDrop(e, list.id)}
      className="board-column-box"
    >
      {/* Column header title & stats badge */}
      <div className="board-column-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className="board-column-name">{list.title}</span>
          <span className="board-column-badge">{listCards.length}</span>
        </div>

        {/* Delete options button */}
        <button
          onClick={() => {
            if (confirm(`Delete list "${list.title}" and all its cards?`)) {
              handleDeleteList(list.id)
            }
          }}
          className="list-header-options-btn"
          title="Delete list"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Dropzone items area */}
      <div className={`board-cards-dropzone ${dragOverCol === list.id ? 'active-dragover' : ''}`}>
        {listCards.map((card) => (
          <div
            key={card.id}
            draggable
            onDragStart={(e) => handleDragStart(e, card.id, list.id)}
            onDragEnd={handleDragEnd}
            onClick={() => openEditModal(card, list.id)}
            className={`board-card-container ${draggingId === card.id ? 'dragging' : ''}`}
          >
            {card.label && (
              <span
                className="board-card-label-tag"
                style={LABEL_STYLES[card.label]}
              >
                {card.label}
              </span>
            )}

            <div className="board-card-title-text">{card.title}</div>

            {card.description && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: '1.4', wordBreak: 'break-word' }}>
                {card.description}
              </div>
            )}
          </div>
        ))}

        {/* Dynamic Composer creation form */}
        {activeComposerCol === list.id ? (
          <div className="inline-card-editor">
            <textarea
              required
              placeholder="Type task details..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              className="inline-card-textarea"
              autoFocus
            />
            <div className="inline-card-actions">
              <button
                onClick={() => handleAddCard(list.id)}
                className="submit-btn"
                style={{ height: '28px', padding: '0 0.6rem', fontSize: '0.75rem', width: 'auto', marginTop: 0 }}
              >
                Add Card
              </button>
              <button
                onClick={() => {
                  setActiveComposerCol(null)
                  setNewCardTitle('')
                }}
                className="social-btn"
                style={{ height: '28px', padding: '0 0.5rem', transform: 'none' }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => {
              setActiveComposerCol(list.id)
              setNewCardTitle('')
            }}
            className="add-card-placeholder"
          >
            <svg className="create-board-icon" style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add Card</span>
          </div>
        )}
      </div>
    </div>
  )
}
