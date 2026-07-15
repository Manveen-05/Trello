import React from 'react'

interface Board {
  id: string
  title: string
  color: string
  workspaceId?: string
}

interface Member {
  id: string
  name: string
  email: string
  avatar: string
  role: 'admin' | 'collaborator'
  accessibleBoardIds?: string[]
}

interface WorkspaceMembersModalProps {
  isOpen: boolean
  onClose: () => void
  newMemberName: string
  setNewMemberName: (val: string) => void
  newMemberEmail: string
  setNewMemberEmail: (val: string) => void
  publicMembers: Member[]
  boards: Board[]
  activeWorkspace: string
  onAddMember: (e: React.FormEvent) => void
  onRemoveMember: (id: string) => void
  onGrantAccess: (memberId: string, boardId: string) => void
  onRemoveAccess: (memberId: string, boardId: string) => void
}

export function WorkspaceMembersModal({
  isOpen,
  onClose,
  newMemberName,
  setNewMemberName,
  newMemberEmail,
  setNewMemberEmail,
  publicMembers,
  boards,
  activeWorkspace,
  onAddMember,
  onRemoveMember,
  onGrantAccess,
  onRemoveAccess
}: WorkspaceMembersModalProps) {
  if (!isOpen) return null

  return (
    <div onClick={onClose} className="modal-overlay-backdrop">
      <div onClick={(e) => e.stopPropagation()} className="modal-content-card" style={{ maxWidth: '480px' }}>
        <div className="modal-header-section">
          <h3 className="modal-title-text">Workspace Members</h3>
          <button onClick={onClose} className="modal-close-btn">
            <svg className="modal-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Manage access permissions for the Public Workspace.
        </p>

        {/* Add Member Form */}
        <form onSubmit={onAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label" style={{ fontSize: '0.7rem' }}>Name</label>
              <input
                type="text"
                placeholder="John Doe"
                required
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="input-field"
                style={{ height: '36px', fontSize: '0.8rem' }}
              />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label" style={{ fontSize: '0.7rem' }}>Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                required
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="input-field"
                style={{ height: '36px', fontSize: '0.8rem' }}
              />
            </div>
          </div>
          <button type="submit" className="submit-btn" style={{ height: '36px', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            Add Workspace Member
          </button>
        </form>

        {/* Members List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
          {publicMembers.map((member) => (
            <div key={member.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--accent-indigo)', fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>
                  {member.avatar}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{member.name}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{member.email}</span>
                  
                  {/* Access Board List */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>Access:</span>
                    {member.role === 'admin' ? (
                      <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 600 }}>All Boards</span>
                    ) : (
                      <>
                        {(member.accessibleBoardIds || []).map(boardId => {
                          const board = boards.find(b => b.id === boardId)
                          if (!board) return null
                          return (
                            <span 
                              key={boardId}
                              style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '0.2rem', 
                                fontSize: '0.65rem', 
                                padding: '0.1rem 0.3rem', 
                                backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                                color: '#fff', 
                                borderRadius: '4px',
                                border: `1px solid ${board.color || 'var(--border-color)'}`
                              }}
                            >
                              {board.title}
                              <span 
                                onClick={() => onRemoveAccess(member.id, boardId)}
                                style={{ cursor: 'pointer', color: '#f87171', marginLeft: '2px', fontWeight: 800, fontSize: '0.7rem' }}
                                title="Revoke access"
                              >
                                ×
                              </span>
                            </span>
                          )
                        })}
                        
                        {/* Selector to add access */}
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              onGrantAccess(member.id, e.target.value)
                              e.target.value = ''
                            }
                          }}
                          style={{ 
                            fontSize: '0.65rem', 
                            padding: '0.05rem 0.2rem', 
                            backgroundColor: 'transparent', 
                            border: '1px dashed var(--border-color)', 
                            borderRadius: '4px', 
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          <option value="">+ Add Board</option>
                          {boards
                            .filter(b => (b.workspaceId || 'personal') === activeWorkspace && !(member.accessibleBoardIds || []).includes(b.id))
                            .map(b => (
                              <option key={b.id} value={b.id} style={{ backgroundColor: '#161822', color: '#fff' }}>
                                {b.title}
                              </option>
                            ))}
                        </select>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', backgroundColor: member.role === 'admin' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.06)', color: member.role === 'admin' ? '#818cf8' : 'var(--text-secondary)', borderRadius: '4px', textTransform: 'capitalize' }}>
                  {member.role}
                </span>
                {member.role !== 'admin' && (
                  <button
                    type="button"
                    onClick={() => onRemoveMember(member.id)}
                    style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
