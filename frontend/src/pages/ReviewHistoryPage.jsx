import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import API from '../api/axiosConfig'

export default function ReviewHistoryPage() {
    const navigate = useNavigate()
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')

    useEffect(() => {
        API.get('/review/history')
            .then(({ data }) => setReviews(data))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const scoreColor = s => s >= 70 ? '#10b981' : s >= 40 ? '#f59e0b' : '#ef4444'
    const scoreLabel = s => s >= 70 ? '✅ Good' : s >= 40 ? '⚠️ Fair' : '❌ Poor'

    const languages = ['all', ...new Set(reviews.map(r => r.language))]

    const filtered = reviews.filter(r => {
        const matchLang = filter === 'all' || r.language === filter
        const matchSearch = r.language.toLowerCase().includes(search.toLowerCase()) ||
            r.codeSnippet.toLowerCase().includes(search.toLowerCase())
        return matchLang && matchSearch
    })

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
                {/* Header */}
                <div className="fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: 4 }}>⏱ Review History</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>{reviews.length} total reviews</p>
                    </div>
                    <button className="btn-primary" onClick={() => navigate('/editor')}>⌨ New Review</button>
                </div>

                {/* Filters */}
                <div className="fade-in" style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                    <input
                        className="input"
                        style={{ maxWidth: 240 }}
                        placeholder="🔍 Search reviews..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: 6 }}>
                        {languages.map(lang => (
                            <button key={lang} onClick={() => setFilter(lang)}
                                style={{
                                    padding: '7px 14px', borderRadius: 8, border: '1px solid',
                                    borderColor: filter === lang ? 'var(--accent)' : 'var(--border)',
                                    background: filter === lang ? 'rgba(99,102,241,0.2)' : 'transparent',
                                    color: filter === lang ? 'var(--accent-hover)' : 'var(--text-secondary)',
                                    fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s',
                                }}>{lang}</button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 60 }}><span className="spinner" style={{ width: 40, height: 40 }} /></div>
                ) : filtered.length === 0 ? (
                    <div className="card fade-in" style={{ textAlign: 'center', padding: 56, color: 'var(--text-secondary)' }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>📂</div>
                        <p style={{ fontSize: '1rem' }}>No reviews found.</p>
                        <button className="btn-primary" onClick={() => navigate('/editor')} style={{ marginTop: 20 }}>
                            Submit First Review
                        </button>
                    </div>
                ) : (
                    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {filtered.map((r, i) => (
                            <div key={r.id} className="card"
                                style={{ cursor: 'pointer', display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center' }}
                                onClick={() => navigate(`/result/${r.id}`, { state: { review: r } })}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                                        background: `${scoreColor(r.score)}20`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.1rem', fontWeight: 800, color: scoreColor(r.score),
                                    }}>{r.score}</div>
                                    <div>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
                                            <span className="badge badge-purple">{r.language}</span>
                                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                                {new Date(r.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            {r.codeSnippet.substring(0, 80).replace(/\n/g, ' ')}...
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                                    <span style={{ color: scoreColor(r.score), fontWeight: 700, fontSize: '0.9rem' }}>
                                        {scoreLabel(r.score)}
                                    </span>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <span className="badge badge-red" style={{ fontSize: '0.75rem' }}>🐛 {r.issues?.length || 0}</span>
                                        <span className="badge badge-yellow" style={{ fontSize: '0.75rem' }}>💡 {r.suggestions?.length || 0}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
