import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axiosConfig'

export default function Register() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ username: '', email: '', password: '' })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)
        try {
            await API.post('/auth/register', form)
            setSuccess('Registration successful! Redirecting to login...')
            setForm({ username: '', email: '', password: '' }) // Clear form
            setTimeout(() => {
                navigate('/login')
            }, 1500)
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.')
            setLoading(false) // Only stop loading if error. If success, keep loading spinner.
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
                background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
                top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: -1, pointerEvents: 'none'
            }} />

            <div className="fade-in card" style={{ width: '100%', maxWidth: 460 }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: '20px',
                        background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.2))',
                        border: '1px solid rgba(139,92,246,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 32, margin: '0 auto 20px',
                        boxShadow: '0 0 30px rgba(139,92,246,0.2)'
                    }}>✨</div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8, letterSpacing: '-0.03em' }}>Create Account</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Start reviewing code with AI today</p>
                </div>

                {error && <div className="alert-error"><span>⚠️</span> {error}</div>}
                {success && <div className="alert-success"><span>✅</span> {success}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {[
                        { key: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
                        { key: 'username', label: 'Username (Display Name)', type: 'text', placeholder: 'Choose a beautiful username' },
                        { key: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters' },
                    ].map(field => (
                        <div key={field.key}>
                            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                {field.label}
                            </label>
                            <input
                                className="input"
                                type={field.type}
                                placeholder={field.placeholder}
                                value={form[field.key]}
                                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                required
                            />
                        </div>
                    ))}

                    <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 12, justifyContent: 'center', padding: '14px' }}>
                        {loading ? <span className="spinner" /> : '🚀'} {loading ? (success ? 'Redirecting...' : 'Creating account...') : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 32, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#c084fc', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
