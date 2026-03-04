import { Link, useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
    { label: 'Overview', path: '/dashboard', icon: '⬡' },
    { label: 'Analyzer', path: '/editor', icon: '⌨' },
    { label: 'History', path: '/history', icon: '⏱' },
]

export default function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const username = localStorage.getItem('username') || 'User'

    const logout = () => {
        localStorage.clear()
        navigate('/login')
    }

    return (
        <nav style={{
            background: 'rgba(3, 7, 18, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '0 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '70px',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
                    border: '1px solid rgba(139,92,246,0.3)',
                    boxShadow: '0 0 20px rgba(139,92,246,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20,
                }}>🤖</div>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', background: 'linear-gradient(to right, #f8fafc, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    AI Review
                </span>
            </div>

            {/* Nav Links */}
            <div style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.05)' }}>
                {NAV_ITEMS.map(item => {
                    const active = location.pathname === item.path
                    return (
                        <Link key={item.path} to={item.path} style={{
                            padding: '8px 20px', borderRadius: 10,
                            color: active ? '#fff' : 'var(--text-secondary)',
                            background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                            textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
                            display: 'flex', alignItems: 'center', gap: 8,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: active ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                        }}>
                            <span style={{ opacity: active ? 1 : 0.7 }}>{item.icon}</span> {item.label}
                        </Link>
                    )
                })}
            </div>

            {/* User */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.2 }}>{username}</span>
                        <span style={{ color: 'var(--accent-hover)', fontSize: '0.75rem', fontWeight: 500 }}>Pro Member</span>
                    </div>
                    <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #c084fc)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '1.1rem', color: '#fff',
                        boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                    }}>
                        {username[0].toUpperCase()}
                    </div>
                </div>
                <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
                <button onClick={logout} className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.9rem', background: 'transparent', border: 'none' }}>
                    Log out
                </button>
            </div>
        </nav>
    )
}
