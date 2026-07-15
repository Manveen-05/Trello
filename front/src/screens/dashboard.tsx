import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { CreateBoardModal } from '../components/CreateBoardModal'
import { WorkspaceMembersModal } from '../components/WorkspaceMembersModal'
import { DashboardHeader } from '../components/DashboardHeader'
import { DashboardSidebar } from '../components/DashboardSidebar'

interface Board {
    id: string
    title: string
    color: string // Top border theme color
    date: string
    listsCount: number
    cardsCount: number
    workspaceId?: string
}

const ACCENT_COLORS = [
    '#6366f1', // Indigo
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#ef4444', // Red
    '#f59e0b', // Amber
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#8b5cf6', // Violet
]

interface Activity {
    id: string
    user: string
    avatar: string
    action: string
    time: string
}

interface Member {
    id: string
    name: string
    email: string
    avatar: string
    role: 'admin' | 'collaborator'
    accessibleBoardIds?: string[]
}

export function Dashboard() {
    const navigate = useNavigate()
    const [activeWorkspace, setActiveWorkspace] = useState<'personal' | 'public'>('personal')
    const [activeDropdown, setActiveDropdown] = useState<'workspace' | 'recent' | 'starred' | null>(null)

    const handleDropdownToggle = (type: 'workspace' | 'recent' | 'starred') => {
        setActiveDropdown(activeDropdown === type ? null : type)
    }

    useEffect(() => {
        const handleOutsideClick = () => {
            setActiveDropdown(null)
        }
        window.addEventListener('click', handleOutsideClick)
        return () => window.removeEventListener('click', handleOutsideClick)
    }, [])

    const [boards, setBoards] = useState<Board[]>(() => {
        const saved = localStorage.getItem('trelloflow_v4_boards')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                if (Array.isArray(parsed)) {
                    return parsed.map((b) => ({
                        ...b,
                        workspaceId: b.workspaceId || (b.id === '2' ? 'public' : 'personal')
                    }))
                }
            } catch (e) { }
        }
        return [
            { id: '1', title: 'Design System', color: ACCENT_COLORS[0], date: 'Jul 2', listsCount: 3, cardsCount: 4, workspaceId: 'personal' },
            { id: '2', title: 'Marketing Campaign', color: ACCENT_COLORS[5], date: 'Jul 4', listsCount: 2, cardsCount: 7, workspaceId: 'public' },
            { id: '3', title: 'Product Launch', color: ACCENT_COLORS[2], date: 'Jul 5', listsCount: 3, cardsCount: 0, workspaceId: 'personal' },
            { id: '4', title: 'SaaS Platform App', color: ACCENT_COLORS[5], date: 'Jul 6', listsCount: 3, cardsCount: 0, workspaceId: 'personal' },
        ]
    })
    const [starredBoards, setStarredBoards] = useState<string[]>(() => {
        const saved = localStorage.getItem('trelloflow_v4_starred_boards')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                if (Array.isArray(parsed)) {
                    return parsed
                }
            } catch (e) { }
        }
        return ['1']
    })
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newBoardTitle, setNewBoardTitle] = useState('')
    const [selectedColor, setSelectedColor] = useState(ACCENT_COLORS[0])

    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false)
    const [newMemberName, setNewMemberName] = useState('')
    const [newMemberEmail, setNewMemberEmail] = useState('')
    const [publicMembers, setPublicMembers] = useState<Member[]>(() => {
        const saved = localStorage.getItem('trelloflow_v4_public_members')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                if (Array.isArray(parsed)) return parsed
            } catch (e) { }
        }
        return [
            { id: 'm1', name: 'Manveen Singh', email: 'manveen@example.com', avatar: 'MS', role: 'admin', accessibleBoardIds: ['1', '2', '3', '4'] },
            { id: 'm2', name: 'Karan Kumar', email: 'karan@example.com', avatar: 'KK', role: 'collaborator', accessibleBoardIds: ['2'] },
            { id: 'm3', name: 'Amit Sharma', email: 'amit@example.com', avatar: 'AS', role: 'collaborator', accessibleBoardIds: ['2'] },
            { id: 'm4', name: 'Tanya Gupta', email: 'tanya@example.com', avatar: 'TG', role: 'collaborator', accessibleBoardIds: ['2'] },
        ]
    })

    const savePublicMembers = (newMembers: Member[]) => {
        setPublicMembers(newMembers)
        localStorage.setItem('trelloflow_v4_public_members', JSON.stringify(newMembers))
    }

    const handleGrantBoardAccess = (memberId: string, boardId: string) => {
        const updated = publicMembers.map(m => {
            if (m.id === memberId) {
                const currentAccess = m.accessibleBoardIds || []
                if (!currentAccess.includes(boardId)) {
                    return { ...m, accessibleBoardIds: [...currentAccess, boardId] }
                }
            }
            return m
        })
        savePublicMembers(updated)
    }

    const handleRemoveBoardAccess = (memberId: string, boardId: string) => {
        const updated = publicMembers.map(m => {
            if (m.id === memberId) {
                return {
                    ...m,
                    accessibleBoardIds: (m.accessibleBoardIds || []).filter(id => id !== boardId)
                }
            }
            return m
        })
        savePublicMembers(updated)
    }

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMemberName.trim() || !newMemberEmail.trim()) return
        const initials = newMemberName.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        const publicBoardIds = boards
            .filter(b => (b.workspaceId || 'personal') === activeWorkspace)
            .map(b => b.id)

        const newMember: Member = {
            id: Math.random().toString(),
            name: newMemberName.trim(),
            email: newMemberEmail.trim(),
            avatar: initials || 'M',
            role: 'collaborator',
            accessibleBoardIds: publicBoardIds
        }
        const updated = [...publicMembers, newMember]
        savePublicMembers(updated)
        setNewMemberName('')
        setNewMemberEmail('')
    }

    const handleRemoveMember = (memberId: string) => {
        const updated = publicMembers.filter(m => m.id !== memberId)
        savePublicMembers(updated)
    }

    const getBoardListCount = (boardId: string, defaultCount: number) => {
        const savedCols = localStorage.getItem('trelloflow_v4_boards_columns')
        if (savedCols) {
            try {
                const parsed = JSON.parse(savedCols)
                if (parsed && typeof parsed === 'object') {
                    const lists = parsed[boardId]
                    if (Array.isArray(lists)) {
                        return lists.length
                    }
                }
            } catch (e) { }
        }
        const initialFallback: Record<string, number> = { '1': 3, '2': 2, '3': 3, '4': 3 }
        return initialFallback[boardId] ?? defaultCount
    }

    const getBoardCardCount = (boardId: string, defaultCount: number) => {
        const savedCols = localStorage.getItem('trelloflow_v4_boards_columns')
        if (savedCols) {
            try {
                const parsed = JSON.parse(savedCols)
                if (parsed && typeof parsed === 'object') {
                    const lists = parsed[boardId]
                    if (Array.isArray(lists)) {
                        return lists.reduce((sum: number, list: any) => sum + (list.cards?.length || 0), 0)
                    }
                }
            } catch (e) { }
        }
        const initialFallback: Record<string, number> = { '1': 4, '2': 7, '3': 0, '4': 0 }
        return initialFallback[boardId] ?? defaultCount
    }

    const toggleStar = (e: React.MouseEvent, id: string) => {
        e.preventDefault()
        e.stopPropagation()
        let updated: string[] = []
        if (starredBoards.includes(id)) {
            updated = starredBoards.filter((bId) => bId !== id)
        } else {
            updated = [...starredBoards, id]
        }
        setStarredBoards(updated)
        localStorage.setItem('trelloflow_v4_starred_boards', JSON.stringify(updated))
    }

    const handleCreateBoard = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newBoardTitle.trim()) return

        const newId = Date.now().toString()
        const newBoard: Board = {
            id: newId,
            title: newBoardTitle,
            color: selectedColor,
            date: 'Today',
            listsCount: 3,
            cardsCount: 0,
            workspaceId: activeWorkspace,
        }

        const updatedBoards = [...boards, newBoard]
        setBoards(updatedBoards)
        localStorage.setItem('trelloflow_v4_boards', JSON.stringify(updatedBoards))

        const savedCols = localStorage.getItem('trelloflow_v4_boards_columns')
        let colsObj: Record<string, any> = {}
        if (savedCols) {
            try {
                const parsed = JSON.parse(savedCols)
                if (parsed && typeof parsed === 'object') {
                    colsObj = parsed
                }
            } catch (e) { }
        }
        colsObj[newId] = [
            { id: 'list-todo', title: 'To Do', cards: [] },
            { id: 'list-progress', title: 'In Progress', cards: [] },
            { id: 'list-done', title: 'Done', cards: [] }
        ]
        localStorage.setItem('trelloflow_v4_boards_columns', JSON.stringify(colsObj))

        setNewBoardTitle('')
        setIsModalOpen(false)
    }

    // Filter boards based on search query and active workspace
    const filteredBoards = boards.filter((board) =>
        board && board.title && board.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (board.workspaceId || 'personal') === activeWorkspace
    )

    const starredList = filteredBoards.filter((board) => board && board.id && starredBoards.includes(board.id))

    const handleSignOut = () => {
        navigate('/signin')
    }

    return (
        <div className="dashboard-container">
            <DashboardHeader
                activeDropdown={activeDropdown}
                activeWorkspace={activeWorkspace}
                handleDropdownToggle={handleDropdownToggle}
                setActiveWorkspace={setActiveWorkspace}
                setActiveDropdown={setActiveDropdown}
                boards={boards}
                starredBoards={starredBoards}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setIsModalOpen={setIsModalOpen}
            />

            {/* Main Body (contains Sidebar + Workspace + Activity Feed) */}
            <div className="dashboard-body">
                <DashboardSidebar
                    activeWorkspace={activeWorkspace}
                    setActiveWorkspace={setActiveWorkspace}
                    handleSignOut={handleSignOut}
                />

                {/* Main Workspace content */}
                <main className="dashboard-main">
                    {/* Workspace Banner */}
                    <div style={styles.workspaceHeader}>
                        <div style={styles.workspaceInfo}>
                            <div style={styles.workspaceAvatar}>
                                {activeWorkspace === 'personal' ? 'P' : 'PB'}
                            </div>
                            <div>
                                <h1 style={styles.workspaceName}>
                                    {activeWorkspace === 'personal' ? 'Personal Workspace' : 'Public Workspace'}
                                </h1>
                                <span style={styles.workspacePrivacy}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="2" y1="12" x2="22" y2="12" />
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                    </svg>
                                    Public Workspace
                                </span>
                            </div>
                        </div>

                        {activeWorkspace === 'public' && (
                            <div style={styles.workspaceActions}>
                                <div
                                    style={{ ...styles.avatarGroup, cursor: 'pointer' }}
                                    onClick={() => setIsMembersModalOpen(true)}
                                >
                                    {publicMembers.slice(0, 4).map((member, idx) => (
                                        <div
                                            key={member.id}
                                            style={{
                                                ...styles.avatar,
                                                backgroundColor: idx === 0 ? '#6366f1' : idx === 1 ? '#a855f7' : idx === 2 ? '#10b981' : '#f59e0b',
                                                marginLeft: idx === 0 ? 0 : '-6px'
                                            }}
                                        >
                                            {member.avatar}
                                        </div>
                                    ))}
                                    {publicMembers.length > 4 && (
                                        <div style={{ ...styles.avatar, backgroundColor: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-secondary)', borderStyle: 'dashed' }}>
                                            +{publicMembers.length - 4}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setIsMembersModalOpen(true)}
                                    className="board-header-btn"
                                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', height: '28px' }}
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="8.5" cy="7" r="4" />
                                        <line x1="20" y1="8" x2="20" y2="14" />
                                        <line x1="23" y1="11" x2="17" y2="11" />
                                    </svg>
                                    Invite
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Starred Boards Section (Only renders if starred items exist) */}
                        {starredList.length > 0 && (
                            <section className="boards-section">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                    <h2 style={styles.sectionHeaderTitle}>Starred Boards</h2>
                                </div>

                                <div className="boards-grid">
                                    {starredList.map((board) => (
                                        <Link
                                            key={`starred-${board.id}`}
                                            to={`/board/${board.id}`}
                                            className="board-card-item"
                                            style={{ borderTop: `3px solid ${board.color}` }}
                                        >
                                            <span className="board-card-title">{board.title}</span>

                                            {/* Embedded Kanban list watermark */}
                                            <div style={styles.boardCardWatermark}>
                                                <div style={styles.watermarkColumn}>
                                                    <div style={styles.watermarkCard}></div>
                                                    <div style={styles.watermarkCard}></div>
                                                </div>
                                                <div style={styles.watermarkColumn}>
                                                    <div style={styles.watermarkCard}></div>
                                                </div>
                                                <div style={styles.watermarkColumn}>
                                                    <div style={styles.watermarkCard}></div>
                                                    <div style={styles.watermarkCard}></div>
                                                </div>
                                            </div>

                                            <div className="board-card-footer">
                                                <button
                                                    onClick={(e) => toggleStar(e, board.id)}
                                                    className="board-card-star starred"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                    </svg>
                                                </button>
                                                <span style={styles.boardCardDesc}>{getBoardListCount(board.id, board.listsCount)} lists · {getBoardCardCount(board.id, board.cardsCount)} cards</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* All Boards Section */}
                        <section className="boards-section">
                            <h2 style={styles.sectionHeaderTitle}>All Boards</h2>

                            <div className="boards-grid">
                                {/* List Filtered Boards */}
                                {filteredBoards.map((board) => (
                                    <Link
                                        key={board.id}
                                        to={`/board/${board.id}`}
                                        className="board-card-item"
                                        style={{ borderTop: `3px solid ${board.color}` }}
                                    >
                                        <span className="board-card-title">{board.title}</span>

                                        {/* Embedded Kanban list watermark */}
                                        <div style={styles.boardCardWatermark}>
                                            <div style={styles.watermarkColumn}>
                                                <div style={styles.watermarkCard}></div>
                                                <div style={styles.watermarkCard}></div>
                                            </div>
                                            <div style={styles.watermarkColumn}>
                                                <div style={styles.watermarkCard}></div>
                                            </div>
                                            <div style={styles.watermarkColumn}>
                                                <div style={styles.watermarkCard}></div>
                                                <div style={styles.watermarkCard}></div>
                                            </div>
                                        </div>

                                        <div className="board-card-footer">
                                            <button
                                                onClick={(e) => toggleStar(e, board.id)}
                                                className={`board-card-star ${starredBoards.includes(board.id) ? 'starred' : ''}`}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill={starredBoards.includes(board.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                </svg>
                                            </button>
                                            <span style={styles.boardCardDesc}>{getBoardListCount(board.id, board.listsCount)} lists · {getBoardCardCount(board.id, board.cardsCount)} cards</span>
                                        </div>
                                    </Link>
                                ))}

                                {/* Create Board Card CTA */}
                                <div onClick={() => setIsModalOpen(true)} className="create-board-card-item">
                                    <svg className="create-board-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    <span className="create-board-text">Create Board</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>

            {/* Board Creation Modal */}
            <CreateBoardModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                newBoardTitle={newBoardTitle}
                setNewBoardTitle={setNewBoardTitle}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                onCreate={handleCreateBoard}
                accentColors={ACCENT_COLORS}
            />

            {/* Members Management Modal */}
            <WorkspaceMembersModal
                isOpen={isMembersModalOpen}
                onClose={() => setIsMembersModalOpen(false)}
                newMemberName={newMemberName}
                setNewMemberName={setNewMemberName}
                newMemberEmail={newMemberEmail}
                setNewMemberEmail={setNewMemberEmail}
                publicMembers={publicMembers}
                boards={boards}
                activeWorkspace={activeWorkspace}
                onAddMember={handleAddMember}
                onRemoveMember={handleRemoveMember}
                onGrantAccess={handleGrantBoardAccess}
                onRemoveAccess={handleRemoveBoardAccess}
            />
        </div>
    )
}

const styles: Record<string, React.CSSProperties> = {
    workspaceHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        marginBottom: '1rem',
    },
    workspaceInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    workspaceAvatar: {
        width: '46px',
        height: '46px',
        borderRadius: '8px',
        backgroundColor: 'var(--accent-indigo)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: '1.25rem',
        fontFamily: 'var(--font-heading)',
        boxShadow: '0 4px 10px rgba(99, 102, 241, 0.25)',
    },
    workspaceName: {
        fontSize: '1.5rem',
        fontWeight: 800,
        color: '#ffffff',
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
        fontFamily: 'var(--font-heading)',
    },
    workspacePrivacy: {
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        marginTop: '0.15rem',
    },
    workspaceActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
    },
    avatarGroup: {
        display: 'flex',
        alignItems: 'center',
    },
    avatar: {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.65rem',
        fontWeight: 700,
        color: '#ffffff',
        border: '2px solid #090a0f',
        marginLeft: '-6px',
    },
    sectionHeaderTitle: {
        fontSize: '0.9rem',
        fontWeight: 700,
        letterSpacing: '0.03em',
        color: 'var(--text-primary)',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-heading)',
    },
    boardCardDesc: {
        fontSize: '0.68rem',
        color: 'var(--text-secondary)',
        fontWeight: 500,
    },
    // Embedded Kanban list watermark styling inside board card backgrounds
    boardCardWatermark: {
        position: 'absolute',
        right: '8px',
        bottom: '22px',
        width: '76px',
        height: '52px',
        display: 'flex',
        gap: '4px',
        opacity: 0.1,
        pointerEvents: 'none',
        zIndex: 1,
    },
    watermarkColumn: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: '3px',
        padding: '3px',
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
    },
    watermarkCard: {
        height: '6px',
        backgroundColor: 'rgba(255, 255, 255, 0.45)',
        borderRadius: '1.5px',
    },
    membersList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.9rem',
        maxWidth: '450px',
    },
    memberRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.6rem 0.8rem',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
    },
    memberDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.15rem',
    },
    memberName: {
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#ffffff',
    },
    memberRole: {
        fontSize: '0.75rem',
        color: 'var(--text-secondary)',
    },
}