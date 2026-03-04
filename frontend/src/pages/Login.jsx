import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axiosConfig'

export default function Login() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ username: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const { data } = await API.post('/auth/login', form)
            localStorage.setItem('token', data.token)
            localStorage.setItem('username', data.username)
            navigate('/dashboard')  // User asked for login -> Actual page (Dashboard)
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Check your credentials.')
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
        }}>
            {/* Ambient Background Glow */}
            <div style={{
                position: 'fixed', width: '60vw', height: '60vw', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)',
                top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: -1, pointerEvents: 'none'
            }} />

            <div className="fade-in card" style={{ width: '100%', maxWidth: 460 }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: '20px',
                        background: 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(99,102,241,0.2))',
                        border: '1px solid rgba(56,189,248,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 32, margin: '0 auto 20px',
                        boxShadow: '0 0 30px rgba(56,189,248,0.2)'
                    }}>🤖</div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8, letterSpacing: '-0.03em' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Sign in to continue to your dashboard</p>
                </div>

                {error && <div className="alert-error"><span>⚠️</span> {error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            Email Address
                        </label>
                        <input
                            className="input"
                            type="email"
                            placeholder="Enter your email"
                            value={form.username}
                            onChange={e => setForm({ ...form, username: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            Password
                        </label>
                        <input
                            className="input"
                            type="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 12, justifyContent: 'center', padding: '14px' }}>
                        {loading ? <span className="spinner" /> : '🔐'} {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 32, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: '#c084fc', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}>
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}
