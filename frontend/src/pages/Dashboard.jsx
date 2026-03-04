import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import API from '../api/axiosConfig'

export default function Dashboard() {
    const navigate = useNavigate()
    const username = localStorage.getItem('username') || 'Developer'
    const [stats, setStats] = useState({ total: 0, avgScore: 0, languages: {} })
    const [recent, setRecent] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        API.get('/review/history')
            .then(({ data }) => {
                setRecent(data.slice(0, 5))
                if (data.length > 0) {
                    const avg = Math.round(data.reduce((s, r) => s + r.score, 0) / data.length)
                    const langs = {}
                    data.forEach(r => { langs[r.language] = (langs[r.language] || 0) + 1 })
                    setStats({ total: data.length, avgScore: avg, languages: langs })
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const scoreColor = (s) => s >= 70 ? 'var(--success)' : s >= 40 ? 'var(--warning)' : 'var(--danger)'

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px', position: 'relative' }}>

                {/* Ambient Glows */}
                <div style={{ position: 'absolute', top: 0, left: 100, width: 400, height: 400, background: 'rgba(139,92,246,0.1)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: 100, right: 100, width: 400, height: 400, background: 'rgba(56,189,248,0.1)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Hero */}
                    <div className="fade-in" style={{ marginBottom: 48, textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 30, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: 20 }}>
                            <span style={{ fontSize: '0.9rem', color: '#c4b5fd' }}>✨ Welcome to the future of code review</span>
                        </div>
                        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 12, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                            Hello, <span style={{ background: 'linear-gradient(135deg,#60a5fa,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{username}</span> 👋
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto' }}>Overview of your recent AI-powered code analyses.</p>
                    </div>

                    {/* Stat Cards */}
                    <div className="fade-in-delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24, marginBottom: 48 }}>
                        {[
                            { label: 'Total Reviews', value: stats.total, icon: '📋', color: '#6366f1', glow: 'rgba(99,102,241,0.2)' },
                            { label: 'Average Score', value: stats.total > 0 ? `${stats.avgScore}/100` : '—', icon: '⭐', color: '#f59e0b', glow: 'rgba(245,158,11,0.2)' },
                            { label: 'Languages Analyzed', value: Object.keys(stats.languages).length, icon: '🌐', color: '#10b981', glow: 'rgba(16,185,129,0.2)' },
                        ].map(s => (
                            <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                                <div style={{
                                    width: 56, height: 56, borderRadius: 16,
                                    background: `linear-gradient(135deg, transparent, ${s.glow})`, border: `1px solid ${s.color}40`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                                }}>{s.icon}</div>
                                <div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{loading ? <span className="spinner" style={{ width: 20, height: 20, marginTop: 4 }} /> : s.value}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="fade-in-delay-2 card" style={{
                        marginBottom: 48, padding: '40px',
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.05))',
                        border: '1px solid rgba(99,102,241,0.3)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24,
                    }}>
                        <div>
                            <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: 8, letterSpacing: '-0.01em' }}>Ready to review code? 🚀</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 400 }}>Paste your code snippet and let our AI engine analyze it instantly for vulnerabilities and improvements.</p>
                        </div>
                        <button className="btn-primary" onClick={() => navigate('/editor')} style={{ padding: '16px 32px', fontSize: '1rem' }}>
                            ⌨ Start New Analysis
                        </button>
                    </div>

                    {/* Recent Reviews */}
                    <div className="fade-in-delay-2">
                        <h2 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: '1.4rem' }}>⏱</span> Recent Activity
                        </h2>
                        {loading ? (
                            <div style={{ flex: 1, padding: 60, display: 'flex', justifyContent: 'center' }}><span className="spinner" style={{ width: 40, height: 40 }} /></div>
                        ) : recent.length === 0 ? (
                            <div className="card" style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
                                <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.5 }}>📂</div>
                                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 8 }}>No reviews yet</h3>
                                <p>Submit your first code review to populate this dashboard.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {recent.map(r => (
                                    <div key={r.id} className="card" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, padding: '20px 24px' }}
                                        onClick={() => navigate(`/result/${r.id}`)}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                                                📄
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                                    <span className="badge badge-purple">{r.language}</span>
                                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Code Snippet</span>
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                    {new Date(r.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: 800, fontSize: '1.3rem', color: scoreColor(r.score), lineHeight: 1 }}>{r.score}/100</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>Quality Score</div>
                                            </div>
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all 0.2s' }} className="forward-btn">
                                                →
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
