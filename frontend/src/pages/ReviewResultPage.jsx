import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import API from '../api/axiosConfig'

function ScoreMeter({ score }) {
    const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'
    const label = score >= 70 ? 'Excellent 👍' : score >= 40 ? 'Needs Work ⚠️' : 'Critical ❌'
    const circumference = 2 * Math.PI * 60
    const offset = circumference - (score / 100) * circumference

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative', width: 160, height: 160 }}>
                {/* Background glow */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 100, height: 100, background: color, filter: 'blur(40px)', opacity: 0.2, borderRadius: '50%' }} />

                <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                    {/* Track */}
                    <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                    {/* Progress */}
                    <circle cx="80" cy="80" r="60" fill="none" stroke={color} strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />
                </svg>
                {/* Text centered inside SVG space */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/ 100</span>
                </div>
            </div>

            <div style={{
                background: `${color}15`, border: `1px solid ${color}40`, padding: '6px 16px', borderRadius: 20,
                color, fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.02em', textTransform: 'uppercase'
            }}>
                {label}
            </div>
        </div>
    )
}

export default function ReviewResultPage() {
    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const [review, setReview] = useState(location.state?.review || null)
    const [loading, setLoading] = useState(!review)

    useEffect(() => {
        if (!review) {
            API.get(`/review/${id}`)
                .then(({ data }) => setReview(data))
                .catch(() => navigate('/history'))
                .finally(() => setLoading(false))
        }
    }, [id])

    if (loading) return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <span className="spinner" style={{ width: 48, height: 48, borderWidth: 4 }} />
            </div>
        </div>
    )

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px', position: 'relative' }}>

                {/* Background glow behind header */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: 300, height: 300, background: 'rgba(99,102,241,0.1)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Header */}
                    <div className="fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
                        <div>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                                <span className="badge badge-purple">{review.language}</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                                    {new Date(review.createdAt).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}
                                </span>
                            </div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>Analysis Report</h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>AI evaluation of your code architecture and security.</p>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button className="btn-secondary" onClick={() => navigate('/history')} style={{ padding: '12px 20px' }}>← View History</button>
                            <button className="btn-primary" onClick={() => navigate('/editor')} style={{ padding: '12px 20px' }}>⌨ New Analysis</button>
                        </div>
                    </div>

                    {/* Score + Summary */}
                    <div className="fade-in-delay-1 card" style={{
                        display: 'flex', gap: 48, alignItems: 'center', marginBottom: 32, flexWrap: 'wrap',
                        padding: '40px', background: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,41,59,0.4))'
                    }}>
                        <ScoreMeter score={review.score} />
                        <div style={{ flex: 1, minWidth: 300 }}>
                            <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 16 }}>Health Summary</h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                                <div className="badge badge-red" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>🐛 {review.issues?.length || 0} Vulnerabilities</div>
                                <div className="badge badge-yellow" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>💡 {review.suggestions?.length || 0} Optimizations</div>
                                <div className="badge badge-purple" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>🌐 {review.language} Engine</div>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
                                {review.score >= 70
                                    ? 'Code structure looks solid with high maintainability. Minor refactoring optimizations have been noted below.'
                                    : review.score >= 40
                                        ? 'Functional but requires immediate attention to architecture or minor security flaws before entering production.'
                                        : 'Critical security or logic flaws identified. Do not deploy without reviewing the detailed issues below.'}
                            </p>
                        </div>
                    </div>

                    {/* Issues */}
                    {review.issues?.length > 0 && (
                        <div className="fade-in-delay-2 card" style={{ marginBottom: 24, padding: '32px', borderColor: 'rgba(239,68,68,0.2)' }}>
                            <h2 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(239,68,68,0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                                    ⚠️
                                </span>
                                Security & Functionality Issues
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {review.issues.map((issue, i) => (
                                    <div key={i} style={{
                                        display: 'flex', gap: 16, padding: '16px 20px',
                                        background: 'rgba(239,68,68,0.03)', borderRadius: 12, borderLeft: '4px solid #ef4444',
                                    }}>
                                        <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '1.1rem', minWidth: 24 }}>{i + 1}.</span>
                                        <span style={{ color: 'var(--text-primary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{issue}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Suggestions */}
                    {review.suggestions?.length > 0 && (
                        <div className="fade-in-delay-2 card" style={{ marginBottom: 24, padding: '32px', borderColor: 'rgba(245,158,11,0.2)' }}>
                            <h2 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                                    💡
                                </span>
                                Refactoring Suggestions
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {review.suggestions.map((s, i) => (
                                    <div key={i} style={{
                                        display: 'flex', gap: 16, padding: '16px 20px',
                                        background: 'rgba(245,158,11,0.03)', borderRadius: 12, borderLeft: '4px solid #f59e0b',
                                    }}>
                                        <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '1.1rem', minWidth: 24 }}>{i + 1}.</span>
                                        <span style={{ color: 'var(--text-primary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Code Snippet */}
                    <div className="fade-in-delay-2 card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ background: 'rgba(15,23,42,0.6)', padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
                            <h2 style={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ color: 'var(--text-secondary)' }}>📄</span> Original Code Source
                            </h2>
                        </div>
                        <pre style={{
                            margin: 0, padding: '24px', background: 'transparent',
                            overflow: 'auto', fontSize: '0.9rem', lineHeight: 1.7,
                            color: '#e2e8f0', fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                        }}>{review.codeSnippet}</pre>
                    </div>
                </div>
            </div>
        </div>
    )
}
