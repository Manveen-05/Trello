import React from 'react'

export function AuthBanner() {
  return (
    <div style={styles.bannerContainer}>
      {/* Ambient background glows */}
      <div style={styles.glowTop}></div>
      <div style={styles.glowBottom}></div>

      {/* Content wrapper */}
      <div style={styles.contentWrapper}>
        <div style={styles.logoContainer}>
          <svg style={styles.logoIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2.5" />
            <rect x="7" y="7" width="3" height="9" rx="1" fill="currentColor" />
            <rect x="14" y="7" width="3" height="5" rx="1" fill="currentColor" />
          </svg>
          <span className="logo-text" style={styles.logoText}>TrelloFlow</span>
        </div>

        <div style={styles.textGroup}>
          <h1 style={styles.title}>
            Visualize your workflow. <br />
            <span style={styles.gradientText}>Accelerate success.</span>
          </h1>
          <p style={styles.subtitle}>
            Manage projects, track milestones, and collaborate in real-time with our sleek workspace experience.
          </p>
        </div>

        {/* Animated Kanban Preview */}
        <div style={styles.boardPreview}>
          <div style={styles.boardHeader}>
            <div style={styles.dotGroup}>
              <span style={{ ...styles.dot, backgroundColor: '#ff5f56' }}></span>
              <span style={{ ...styles.dot, backgroundColor: '#ffbd2e' }}></span>
              <span style={{ ...styles.dot, backgroundColor: '#27c93f' }}></span>
            </div>
            <span style={styles.boardTitle}>Project Board - Q3 Launch</span>
          </div>

          <div style={styles.boardColumns}>
            {/* Column 1 */}
            <div className="kanban-column">
              <div style={styles.columnHeader}>
                <span style={styles.columnName}>To Do</span>
                <span style={styles.badge}>1</span>
              </div>
              
              <div className="kanban-card animate-float-1">
                <div style={styles.cardHeader}>
                  <span style={{ ...styles.tag, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>High</span>
                </div>
                <h4 style={styles.cardTitle}>API Integration</h4>
                <p style={styles.cardDesc}>Configure layout-level routing and backend endpoints.</p>
                <div style={styles.cardFooter}>
                  <div style={styles.avatarGroup}>
                    <div style={{ ...styles.avatar, backgroundColor: '#6366f1' }}>A</div>
                    <div style={{ ...styles.avatar, backgroundColor: '#a855f7' }}>M</div>
                  </div>
                  <span style={styles.cardDate}>Jul 12</span>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="kanban-column">
              <div style={styles.columnHeader}>
                <span style={styles.columnName}>Active</span>
                <span style={styles.badge}>1</span>
              </div>

              <div className="kanban-card animate-float-2" style={{ borderLeft: '2.5px solid #a855f7' }}>
                <div style={styles.cardHeader}>
                  <span style={{ ...styles.tag, backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>Design</span>
                </div>
                <h4 style={styles.cardTitle}>Auth UI Design</h4>
                <p style={styles.cardDesc}>Creating modern credentials forms with validation states.</p>
                <div style={styles.progressContainer}>
                  <div style={styles.progressBar}></div>
                </div>
                <div style={styles.cardFooter}>
                  <div style={styles.avatarGroup}>
                    <div style={{ ...styles.avatar, backgroundColor: '#10b981' }}>T</div>
                    <div style={{ ...styles.avatar, backgroundColor: '#6366f1' }}>A</div>
                  </div>
                  <span style={styles.cardDate}>Active</span>
                </div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="kanban-column">
              <div style={styles.columnHeader}>
                <span style={styles.columnName}>Done</span>
                <span style={styles.badge}>1</span>
              </div>

              <div className="kanban-card animate-float-3" style={{ borderLeft: '2.5px solid #10b981' }}>
                <div style={styles.cardHeader}>
                  <span style={{ ...styles.tag, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>Done</span>
                </div>
                <h4 style={styles.cardTitle}>DB Schema</h4>
                <p style={styles.cardDesc}>Setup schema migration files and user model relationships.</p>
                <div style={styles.cardFooter}>
                  <div style={styles.avatarGroup}>
                    <div style={{ ...styles.avatar, backgroundColor: '#f59e0b' }}>S</div>
                  </div>
                  <span style={{ ...styles.cardDate, color: '#34d399', fontWeight: 600 }}>Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  bannerContainer: {
    position: 'relative',
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 3rem',
    background: 'radial-gradient(ellipse at center, #11131c 0%, #090a0f 100%)',
    overflow: 'hidden',
    borderRight: '1px solid var(--border-color)',
  },
  glowTop: {
    position: 'absolute',
    top: '-10%',
    left: '-10%',
    width: '50%',
    height: '50%',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  glowBottom: {
    position: 'absolute',
    bottom: '-15%',
    right: '-10%',
    width: '60%',
    height: '60%',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.09) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: '540px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
    zIndex: 2,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  logoIcon: {
    width: '24px',
    height: '24px',
    color: '#818cf8',
  },
  logoText: {
    fontSize: '1.1rem',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    background: 'linear-gradient(to right, #ffffff, #94a3b8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  textGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  title: {
    fontSize: '2.1rem',
    fontWeight: 800,
    lineHeight: 1.25,
    letterSpacing: '-0.03em',
    color: '#ffffff',
  },
  gradientText: {
    background: 'linear-gradient(to right, #818cf8, #c084fc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '0.9rem',
    lineHeight: 1.5,
    color: 'var(--text-secondary)',
    fontWeight: 400,
  },
  boardPreview: {
    background: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '0.9rem',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  boardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '0.5rem',
  },
  dotGroup: {
    display: 'flex',
    gap: '0.3rem',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  boardTitle: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    letterSpacing: '0.02em',
  },
  boardColumns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '0.6rem',
  },
  columnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 0.1rem',
    marginBottom: '0.2rem',
  },
  columnName: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  badge: {
    fontSize: '0.62rem',
    fontWeight: 600,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: '0.1rem 0.35rem',
    borderRadius: '999px',
    color: 'var(--text-secondary)',
  },
  tag: {
    fontSize: '0.6rem',
    fontWeight: 700,
    padding: '0.15rem 0.4rem',
    borderRadius: '3px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  cardTitle: {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#ffffff',
  },
  cardDesc: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.35,
  },
  progressContainer: {
    width: '100%',
    height: '3px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '99px',
    overflow: 'hidden',
  },
  progressBar: {
    width: '65%',
    height: '100%',
    background: 'linear-gradient(90deg, #a855f7, #6366f1)',
    borderRadius: '99px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.15rem',
  },
  avatarGroup: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.55rem',
    fontWeight: 700,
    color: '#ffffff',
    border: '1px solid #161821',
    marginLeft: '-4px',
  },
  cardDate: {
    fontSize: '0.62rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
}