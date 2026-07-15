import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import { BoardSettingsModal } from '../components/BoardSettingsModal'
import { BoardHeader } from '../components/BoardHeader'
import { BoardColumn } from '../components/BoardColumn'
import { TaskCardInspectorModal } from '../components/TaskCardInspectorModal'

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

const BOARD_THEMES: Record<string, { title: string; color: string }> = {
    '1': { title: 'Design System', color: '#6366f1' },
    '2': { title: 'Marketing Campaign', color: '#ef4444' },
    '3': { title: 'Product Roadmap', color: '#10b981' },
    '4': { title: 'SaaS Platform App', color: '#ec4899' },
}

export function Board() {
    const { id } = useParams()
    const navigate = useNavigate()
    const boardId = id || '1'

    // Boards list state
    const [boardsList, setBoardsList] = useState<{ id: string; title: string; color: string; background?: string; workspaceId?: string }[]>(() => {
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
            { id: '1', title: 'Design System', color: '#6366f1', workspaceId: 'personal' },
            { id: '2', title: 'Marketing Campaign', color: '#ec4899', workspaceId: 'public' },
            { id: '3', title: 'Product Launch', color: '#10b981', workspaceId: 'personal' }
        ]
    })

    // Dynamic lookup for title and theme color using local storage or fallback themes
    const boardInfo = useMemo(() => {
        const found = boardsList.find((b) => b.id === boardId)
        return found || { title: 'Workspace Board', color: '#6366f1' }
    }, [boardsList, boardId])

    // Master board columns list state with localStorage sync (v4)
    const [allBoardsColumns, setAllBoardsColumns] = useState<Record<string, List[]>>(() => {
        const saved = localStorage.getItem('trelloflow_v4_boards_columns')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                if (parsed && typeof parsed === 'object') {
                    const values = Object.values(parsed)
                    // Defensive check: If it has the legacy structure, ignore it
                    if (values.length > 0 && !Array.isArray(values[0])) {
                        localStorage.removeItem('trelloflow_v4_boards_columns')
                    } else {
                        return parsed
                    }
                }
            } catch (e) { }
        }

        // Initial standard fallback content
        return {
            '1': [
                {
                    id: 'list-todo',
                    title: 'To Do',
                    cards: [
                        { id: 'c1-1', title: 'Design onboarding flow wireframes', description: 'Wireframe basic screen progression from signup to team creation.', label: 'high' },
                        { id: 'c1-2', title: 'Setup Stripe billing webhooks', description: 'Integrate verification endpoints and write event handlers.', label: 'medium' },
                    ]
                },
                {
                    id: 'list-progress',
                    title: 'In Progress',
                    cards: [
                        { id: 'c1-3', title: 'Responsive grid dashboard layout', description: 'Validate CSS Flex layout wraps cleanly across mobile breakpoints.', label: 'low' },
                    ]
                },
                {
                    id: 'list-done',
                    title: 'Done',
                    cards: [
                        { id: 'c1-4', title: 'Finalize display typeface pairing', description: 'Import Outfit and Inter fonts. Bind CSS font custom tokens.', label: 'low' },
                    ]
                }
            ],
            '2': [
                {
                    id: 'list-all',
                    title: 'ALL',
                    cards: [
                        { id: 'c2-1', title: 'Web 3', description: 'Explore smart contract design.' },
                        { id: 'c2-2', title: 'Aiml', description: 'Setup localized agent systems.' },
                        { id: 'c2-3', title: 'Dsa', description: 'Review binary search trees.' },
                        { id: 'c2-4', title: 'Internship', description: 'Coordinate placement interviews.' },
                        { id: 'c2-5', title: 'Edit portfolio', description: 'Update layout and upload assets.' },
                        { id: 'c2-6', title: 'Webdev', description: 'Refactor client route wrappers.' },
                    ]
                },
                {
                    id: 'list-health',
                    title: 'HEALTH',
                    cards: [
                        { id: 'c2-7', title: '10k Steps', description: 'Maintain baseline cardiovascular activity.' }
                    ]
                }
            ],
            '3': [
                { id: 'list-todo-3', title: 'To Do', cards: [] },
                { id: 'list-progress-3', title: 'In Progress', cards: [] },
                { id: 'list-done-3', title: 'Done', cards: [] }
            ],
            '4': [
                { id: 'list-todo-4', title: 'To Do', cards: [] },
                { id: 'list-progress-4', title: 'In Progress', cards: [] },
                { id: 'list-done-4', title: 'Done', cards: [] }
            ]
        }
    })

    // Read current board lists
    const boardLists = allBoardsColumns[boardId] || []

    // Sync state and save helper
    const updateAllBoardsColumns = (newVal: Record<string, List[]>) => {
        setAllBoardsColumns(newVal)
        localStorage.setItem('trelloflow_v4_boards_columns', JSON.stringify(newVal))
    }

    // Drag and drop states
    const [draggingId, setDraggingId] = useState<string | null>(null)
    const [dragSourceCol, setDragSourceCol] = useState<string | null>(null)
    const [dragOverCol, setDragOverCol] = useState<string | null>(null)
    const dragTimeoutRef = React.useRef<number | null>(null)

    // Card Composer states
    const [activeComposerCol, setActiveComposerCol] = useState<string | null>(null)
    const [newCardTitle, setNewCardTitle] = useState('')

    // List Composer states
    const [isAddingList, setIsAddingList] = useState(false)
    const [newListTitle, setNewListTitle] = useState('')

    // Card Modal Edit states
    const [editingCard, setEditingCard] = useState<Card | null>(null)
    const [editingCardCol, setEditingCardCol] = useState<string | null>(null)
    const [modalTitle, setModalTitle] = useState('')
    const [modalDesc, setModalDesc] = useState('')
    const [modalLabel, setModalLabel] = useState<'low' | 'medium' | 'high' | undefined>(undefined)

    // Share & Board Settings Handlers
    const [copied, setCopied] = useState(false)
    const [isBoardSettingsOpen, setIsBoardSettingsOpen] = useState(false)

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const openBoardSettings = () => {
        setIsBoardSettingsOpen(true)
    }

    const handleDeleteBoard = () => {
        if (confirm(`Are you sure you want to delete the board "${boardInfo.title}"?`)) {
            const updated = boardsList.filter((b) => b.id !== boardId)
            setBoardsList(updated)
            localStorage.setItem('trelloflow_v4_boards', JSON.stringify(updated))

            // Also clean up board columns data for this board
            const columnsSaved = localStorage.getItem('trelloflow_v4_boards_columns')
            if (columnsSaved) {
                try {
                    const parsed = JSON.parse(columnsSaved)
                    if (parsed && typeof parsed === 'object') {
                        delete parsed[boardId]
                        localStorage.setItem('trelloflow_v4_boards_columns', JSON.stringify(parsed))
                    }
                } catch (e) { }
            }

            setIsBoardSettingsOpen(false)
            navigate('/dashboard')
        }
    }

    // Drag Handlers
    const handleDragStart = (e: React.DragEvent, cardId: string, sourceColId: string) => {
        e.dataTransfer.setData('text/plain', cardId)
        e.dataTransfer.effectAllowed = 'move'

        if (dragTimeoutRef.current) {
            clearTimeout(dragTimeoutRef.current)
        }

        // Asynchronous state trigger keeps the browser drag image solid and beautiful!
        dragTimeoutRef.current = window.setTimeout(() => {
            setDraggingId(cardId)
            setDragSourceCol(sourceColId)
        }, 0)
    }

    const handleDragEnd = () => {
        if (dragTimeoutRef.current) {
            clearTimeout(dragTimeoutRef.current)
            dragTimeoutRef.current = null
        }
        setDraggingId(null)
        setDragSourceCol(null)
        setDragOverCol(null)
    }

    const handleDragOver = (e: React.DragEvent, listId: string) => {
        e.preventDefault()
        if (dragOverCol !== listId) {
            setDragOverCol(listId)
        }
    }

    const handleDrop = (e: React.DragEvent, destColId: string) => {
        e.preventDefault()

        if (dragTimeoutRef.current) {
            clearTimeout(dragTimeoutRef.current)
            dragTimeoutRef.current = null
        }

        const cardId = e.dataTransfer.getData('text/plain') || draggingId

        // Always reset dragging state on drop to prevent stuck elements
        setDraggingId(null)
        setDragSourceCol(null)
        setDragOverCol(null)

        if (!cardId || !dragSourceCol || dragSourceCol === destColId) {
            return
        }

        const updatedLists = boardLists.map((list) => {
            if (list.id === dragSourceCol) {
                return {
                    ...list,
                    cards: list.cards.filter((c) => c.id !== cardId)
                }
            }
            if (list.id === destColId) {
                const sourceList = boardLists.find((l) => l.id === dragSourceCol)
                const cardToMove = sourceList?.cards.find((c) => c.id === cardId)
                if (cardToMove) {
                    return {
                        ...list,
                        cards: [...list.cards, cardToMove]
                    }
                }
            }
            return list
        })

        updateAllBoardsColumns({
            ...allBoardsColumns,
            [boardId]: updatedLists
        })
    }

    // Create Card Handler
    const handleAddCard = (listId: string) => {
        if (!newCardTitle.trim()) return

        const newCard: Card = {
            id: Date.now().toString(),
            title: newCardTitle,
            description: '',
        }

        const updatedLists = boardLists.map((list) => {
            if (list.id === listId) {
                return {
                    ...list,
                    cards: [...list.cards, newCard]
                }
            }
            return list
        })

        updateAllBoardsColumns({
            ...allBoardsColumns,
            [boardId]: updatedLists
        })

        setNewCardTitle('')
        setActiveComposerCol(null)
    }

    // List Management Handlers
    const handleAddList = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newListTitle.trim()) return

        const newList: List = {
            id: `list-${Date.now()}`,
            title: newListTitle,
            cards: []
        }

        const updatedLists = [...boardLists, newList]
        updateAllBoardsColumns({
            ...allBoardsColumns,
            [boardId]: updatedLists
        })

        setNewListTitle('')
        setIsAddingList(false)
    }

    const handleDeleteList = (listId: string) => {
        const updatedLists = boardLists.filter((l) => l.id !== listId)
        updateAllBoardsColumns({
            ...allBoardsColumns,
            [boardId]: updatedLists
        })
    }

    // Edit Modal triggers
    const openEditModal = (card: Card, colKey: string) => {
        setEditingCard(card)
        setEditingCardCol(colKey)
        setModalTitle(card.title)
        setModalDesc(card.description)
        setModalLabel(card.label)
    }

    const handleSaveModal = (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingCard || !editingCardCol) return

        const updatedLists = boardLists.map((list) => {
            if (list.id === editingCardCol) {
                return {
                    ...list,
                    cards: list.cards.map((c) => {
                        if (c.id === editingCard.id) {
                            return {
                                ...c,
                                title: modalTitle,
                                description: modalDesc,
                                label: modalLabel,
                            }
                        }
                        return c
                    })
                }
            }
            return list
        })

        updateAllBoardsColumns({
            ...allBoardsColumns,
            [boardId]: updatedLists
        })

        closeModal()
    }

    const handleDeleteCard = () => {
        if (!editingCard || !editingCardCol) return

        const updatedLists = boardLists.map((list) => {
            if (list.id === editingCardCol) {
                return {
                    ...list,
                    cards: list.cards.filter((c) => c.id !== editingCard.id)
                }
            }
            return list
        })

        updateAllBoardsColumns({
            ...allBoardsColumns,
            [boardId]: updatedLists
        })

        closeModal()
    }

    const closeModal = () => {
        setEditingCard(null)
        setEditingCardCol(null)
    }

    return (
        <div className="dashboard-container" style={{ minHeight: '100vh', height: '100vh', overflow: 'hidden' }}>
            <BoardHeader
                boardTitle={boardInfo.title}
                boardColor={boardInfo.color}
                boardBackground={boardInfo.background}
                copied={copied}
                handleShare={handleShare}
                openBoardSettings={openBoardSettings}
            />

            {/* Main Board View body */}
            <div
                className="board-canvas-container"
                style={{
                    borderTop: `3px solid ${boardInfo.color}`,
                    backgroundImage: boardInfo.background
                        ? `linear-gradient(rgba(11, 12, 17, 0.4), rgba(11, 12, 17, 0.75)), url(${boardInfo.background})`
                        : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* Dynamic Horizontal Columns Viewport */}
                <div className="board-columns-viewport">
                    {boardLists.map((list) => (
                        <BoardColumn
                            key={list.id}
                            list={list}
                            dragOverCol={dragOverCol}
                            activeComposerCol={activeComposerCol}
                            newCardTitle={newCardTitle}
                            setNewCardTitle={setNewCardTitle}
                            setActiveComposerCol={setActiveComposerCol}
                            handleDragOver={handleDragOver}
                            handleDrop={handleDrop}
                            handleDragStart={handleDragStart}
                            handleDragEnd={handleDragEnd}
                            openEditModal={openEditModal}
                            handleAddCard={handleAddCard}
                            handleDeleteList={handleDeleteList}
                            draggingId={draggingId}
                        />
                    ))}

                    {/* List Composer / "+ Add another list" Trigger at the end */}
                    {isAddingList ? (
                        <form onSubmit={handleAddList} className="add-list-composer">
                            <input
                                type="text"
                                required
                                placeholder="Enter list title..."
                                value={newListTitle}
                                onChange={(e) => setNewListTitle(e.target.value)}
                                className="add-list-input"
                                autoFocus
                            />
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                                <button type="submit" className="submit-btn" style={{ height: '30px', padding: '0 0.8rem', fontSize: '0.78rem', width: 'auto', marginTop: 0 }}>
                                    Add List
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddingList(false)
                                        setNewListTitle('')
                                    }}
                                    className="social-btn"
                                    style={{ height: '30px', padding: '0 0.6rem', transform: 'none' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div onClick={() => setIsAddingList(true)} className="add-list-placeholder-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            <span>Add another list</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Task Card Detail View / Edit Modal */}
            {editingCard && (
                <TaskCardInspectorModal
                    editingCard={editingCard}
                    modalTitle={modalTitle}
                    setModalTitle={setModalTitle}
                    modalDesc={modalDesc}
                    setModalDesc={setModalDesc}
                    modalLabel={modalLabel}
                    setModalLabel={setModalLabel}
                    handleSaveModal={handleSaveModal}
                    handleDeleteCard={handleDeleteCard}
                    closeModal={closeModal}
                />
            )}

            {/* Board Settings Modal */}
            <BoardSettingsModal
                isOpen={isBoardSettingsOpen}
                onClose={() => setIsBoardSettingsOpen(false)}
                initialName={boardInfo.title}
                initialColor={boardInfo.color}
                initialBg={boardInfo.background || ''}
                onSave={(name, color, bg) => {
                    const updated = boardsList.map((b) => {
                        if (b.id === boardId) {
                            return { ...b, title: name, color, background: bg }
                        }
                        return b
                    })
                    setBoardsList(updated)
                    localStorage.setItem('trelloflow_v4_boards', JSON.stringify(updated))
                    setIsBoardSettingsOpen(false)
                }}
                onDelete={handleDeleteBoard}
            />

            {/* Floating Bottom Navigation Bar */}
            <div className="floating-bottom-nav">
                <button className="nav-pill-btn active">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="9" rx="1" />
                        <rect x="14" y="3" width="7" height="5" rx="1" />
                        <rect x="14" y="12" width="7" height="9" rx="1" />
                        <rect x="3" y="16" width="7" height="5" rx="1" />
                    </svg>
                    <span>Board</span>
                    <div className="active-indicator-line" />
                </button>

                <button className="nav-pill-btn" onClick={() => navigate('/dashboard')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="4" width="12" height="16" rx="2" />
                        <path d="M18 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-2" />
                    </svg>
                    <span>Switch boards</span>
                </button>
            </div>
        </div>
    )
}