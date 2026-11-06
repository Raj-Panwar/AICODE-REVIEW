
import { useEffect, useMemo, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import API from '../api/axiosConfig'

const METADATA_PREFIX = '__AI_REVIEW_METADATA__:'

function parseStoredItem(item) {
    if (typeof item !== 'string') return item

    try {
        return JSON.parse(item)
    } catch {
        return item
    }
}
function formatConfidence(confidence) {
    if (confidence == null) return 'Not available'

    const value = Number(confidence)
    if (!Number.isFinite(value)) return confidence

    return `${Math.round(value <= 1 ? value * 100 : value)}%`
}
function parseReviewData(review) {
    const suggestions = (review?.suggestions || []).map(parseStoredItem)

    const metadataEntry = suggestions.find(
        item => typeof item === 'string' && item.startsWith(METADATA_PREFIX)
    )

    let metadata = {}

    if (metadataEntry) {
        try {
            metadata = JSON.parse(metadataEntry.slice(METADATA_PREFIX.length))
        } catch (error) {
            console.warn('Could not parse review metadata:', error)
        }
    }

    return {
        ...review,
        metadata,
        issues: (review?.issues || []).map(parseStoredItem),
        suggestions: suggestions.filter(
            item => !(typeof item === 'string' && item.startsWith(METADATA_PREFIX))
        )
    }
}

function ScoreMeter({ score = 0 }) {
    const safeScore = Math.max(0, Math.min(100, Number(score) || 0))
    const color = safeScore >= 70 ? '#10b981' : safeScore >= 40 ? '#f59e0b' : '#ef4444'
    const label = safeScore >= 70 ? 'Excellent 👍' : safeScore >= 40 ? 'Needs Work ⚠️' : 'Critical ❌'
    const circumference = 2 * Math.PI * 60
    const offset = circumference - (safeScore / 100) * circumference

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative', width: 160, height: 160 }}>
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 100, height: 100, background: color,
                    filter: 'blur(40px)', opacity: 0.2, borderRadius: '50%'
                }} />

                <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="80" cy="80" r="60" fill="none"
                        stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                    <circle cx="80" cy="80" r="60" fill="none"
                        stroke={color} strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ transition: 'stroke-dashoffset 1.5s ease' }}
                    />
                </svg>

                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color, lineHeight: 1 }}>
                        {safeScore}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        / 100
                    </span>
                </div>
            </div>

            <div style={{
                background: `${color}15`, border: `1px solid ${color}40`,
                padding: '6px 16px', borderRadius: 20,
                color, fontWeight: 700, fontSize: '0.95rem'
            }}>
                {label}
            </div>
        </div>
    )
}

function SectionCard({ title, icon, children, borderColor }) {
    return (
        <div className="card" style={{
            marginBottom: 24, padding: 32,
            borderColor: borderColor || 'var(--border)'
        }}>
            <h2 style={{
                fontWeight: 800, fontSize: '1.2rem',
                marginBottom: 24, display: 'flex',
                alignItems: 'center', gap: 12
            }}>
                <span style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: `${borderColor || '#6366f1'}20`,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 20
                }}>
                    {icon}
                </span>
                {title}
            </h2>
            {children}
        </div>
    )
}

function InfoCard({ label, value, color }) {
    return (
        <div style={{
            flex: 1, minWidth: 180, padding: 20,
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid var(--border)',
            borderRadius: 12
        }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 10 }}>
                {label}
            </p>
            <p style={{ fontSize: '1.15rem', fontWeight: 700, color: color || 'var(--text-primary)' }}>
                {value || 'Not available'}
            </p>
        </div>
    )
}

function ComplexitySection({ complexity }) {
    if (!complexity) return null

    const hasComplexity = [
        complexity.currentTime,
        complexity.suggestedTime,
        complexity.currentSpace,
        complexity.suggestedSpace
    ].some(Boolean)

    if (!hasComplexity && !complexity.optimizationExplanation) return null

    return (
        <SectionCard title="Complexity Analysis" icon="⏱️" borderColor="#6366f1">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                <InfoCard label="Current Time Complexity" value={complexity.currentTime} color="#f59e0b" />
                <InfoCard label="Suggested Time Complexity" value={complexity.suggestedTime} color="#10b981" />
                <InfoCard label="Current Space Complexity" value={complexity.currentSpace} color="#f59e0b" />
                <InfoCard label="Suggested Space Complexity" value={complexity.suggestedSpace} color="#10b981" />
            </div>

            {complexity.explanations && (
                <div style={{ marginTop: 24 }}>
                    {typeof complexity.explanations === 'string' ? (
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            {complexity.explanations}
                        </p>
                    ) : (
                        Object.entries(complexity.explanations).map(([key, value]) => (
                            <p key={key} style={{
                                color: 'var(--text-secondary)',
                                lineHeight: 1.7, marginBottom: 10
                            }}>
                                <strong style={{ color: 'var(--text-primary)' }}>
                                    {key.replace(/([A-Z])/g, ' $1')}:
                                </strong>{' '}
                                {String(value)}
                            </p>
                        ))
                    )}
                </div>
            )}

            {complexity.optimizationExplanation && (
                <div style={{
                    marginTop: 20, padding: 20,
                    borderRadius: 12,
                    background: 'rgba(16,185,129,0.06)',
                    borderLeft: '4px solid #10b981'
                }}>
                    <h3 style={{ color: '#10b981', marginBottom: 8 }}>
                        Optimization Analysis
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                        {complexity.optimizationExplanation}
                    </p>
                </div>
            )}
        </SectionCard>
    )
}

function IssueCard({ issue, index }) {
    const structured = typeof issue === 'object' && issue !== null
    const severity = structured ? issue.severity || 'Issue' : 'Issue'
    const severityColors = {
        critical: '#ef4444',
        high: '#f97316',
        medium: '#f59e0b',
        low: '#10b981'
    }
    const color = severityColors[String(severity).toLowerCase()] || '#ef4444'

    return (
        <div style={{
            padding: 20, background: 'rgba(239,68,68,0.035)',
            borderRadius: 12, borderLeft: `4px solid ${color}`
        }}>
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                gap: 12, flexWrap: 'wrap', marginBottom: 12
            }}>
                <strong style={{ color: 'var(--text-primary)' }}>
                    {index + 1}. {structured ? issue.title || 'Code issue' : issue}
                </strong>

                {structured && (
                    <span style={{
                        color, fontSize: '0.78rem', fontWeight: 800,
                        textTransform: 'uppercase'
                    }}>
                        {severity}
                    </span>
                )}
            </div>

            {structured && (
                <>
                    {issue.category && (
                        <p style={{ color: '#a78bfa', fontSize: '0.85rem', marginBottom: 8 }}>
                            Category: {issue.category}
                        </p>
                    )}

                    {issue.description && (
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            {issue.description}
                        </p>
                    )}

                    {(issue.lineStart || issue.lineEnd) && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 10 }}>
                            Lines: {issue.lineStart || '?'} – {issue.lineEnd || issue.lineStart || '?'}
                        </p>
                    )}

                    {issue.confidence != null && (
    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 6 }}>
        Confidence: {formatConfidence(issue.confidence)}
    </p>
)}

                    {issue.suggestion && (
                        <div style={{
                            marginTop: 14, padding: 14,
                            background: 'rgba(16,185,129,0.06)',
                            borderRadius: 8
                        }}>
                            <strong style={{ color: '#10b981' }}>Suggested fix</strong>
                            <p style={{ color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.6 }}>
                                {issue.suggestion}
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

function SuggestionCard({ suggestion, index }) {
    const structured = typeof suggestion === 'object' && suggestion !== null

    return (
        <div style={{
            padding: 20, background: 'rgba(245,158,11,0.035)',
            borderRadius: 12, borderLeft: '4px solid #f59e0b'
        }}>
            <strong style={{ color: 'var(--text-primary)' }}>
                {index + 1}. {structured ? suggestion.title || 'Improvement' : suggestion}
            </strong>

            {structured && (
                <>
                    {suggestion.description && (
                        <p style={{
                            color: 'var(--text-secondary)',
                            lineHeight: 1.7, marginTop: 10
                        }}>
                            {suggestion.description}
                        </p>
                    )}
                    {suggestion.benefit && (
                        <p style={{ color: '#10b981', marginTop: 10, fontSize: '0.9rem' }}>
                            Benefit: {suggestion.benefit}
                        </p>
                    )}
                </>
            )}
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
    }, [id, review, navigate])

    const parsedReview = useMemo(
        () => review ? parseReviewData(review) : null,
        [review]
    )

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh', background: 'var(--bg-primary)',
                display: 'flex', flexDirection: 'column'
            }}>
                <Navbar />
                <div style={{
                    flex: 1, display: 'flex',
                    justifyContent: 'center', alignItems: 'center'
                }}>
                    <span className="spinner" style={{
                        width: 48, height: 48, borderWidth: 4
                    }} />
                </div>
            </div>
        )
    }

    if (!parsedReview) return null

    const metadata = parsedReview.metadata || {}
    const complexity = metadata.complexity
    const summary = metadata.summary
    const rating = metadata.rating

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />

            <div style={{
                maxWidth: 1000, margin: '0 auto',
                padding: '40px 24px', position: 'relative'
            }}>
                <div style={{
                    position: 'absolute', top: 0, right: 0,
                    width: 300, height: 300,
                    background: 'rgba(99,102,241,0.1)',
                    filter: 'blur(100px)', pointerEvents: 'none'
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div className="fade-in" style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'flex-start', marginBottom: 40,
                        flexWrap: 'wrap', gap: 20
                    }}>
                        <div>
                            <div style={{
                                display: 'flex', gap: 12,
                                alignItems: 'center', marginBottom: 12
                            }}>
                                <span className="badge badge-purple">
                                    {parsedReview.language}
                                </span>
                                <span style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.9rem'
                                }}>
                                    {parsedReview.createdAt
                                        ? new Date(parsedReview.createdAt).toLocaleString(
                                            undefined,
                                            { dateStyle: 'long', timeStyle: 'short' }
                                        )
                                        : ''}
                                </span>
                            </div>

                            <h1 style={{
                                fontSize: '2.5rem', fontWeight: 800,
                                marginBottom: 8
                            }}>
                                Analysis Report
                            </h1>
                            <p style={{
                                color: 'var(--text-secondary)',
                                fontSize: '1.1rem'
                            }}>
                                AI evaluation of your code quality, architecture and security.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: 12 }}>
                            <button className="btn-secondary"
                                onClick={() => navigate('/history')}
                                style={{ padding: '12px 20px' }}>
                                ← View History
                            </button>
                            <button className="btn-primary"
                                onClick={() => navigate('/editor')}
                                style={{ padding: '12px 20px' }}>
                                ⌨ New Analysis
                            </button>
                        </div>
                    </div>

                    <div className="fade-in-delay-1 card" style={{
                        display: 'flex', gap: 48, alignItems: 'center',
                        marginBottom: 32, flexWrap: 'wrap', padding: 40,
                        background: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,41,59,0.4))'
                    }}>
                        <ScoreMeter score={parsedReview.score} />

                        <div style={{ flex: 1, minWidth: 280 }}>
                            <h2 style={{
                                fontWeight: 800, fontSize: '1.4rem',
                                marginBottom: 16
                            }}>
                                Health Summary
                            </h2>

                            <div style={{
                                display: 'flex', flexWrap: 'wrap',
                                gap: 12, marginBottom: 20
                            }}>
                                <div className="badge badge-red" style={{ padding: '6px 14px' }}>
                                    ⚠️ {parsedReview.issues.length} Issues
                                </div>
                                <div className="badge badge-yellow" style={{ padding: '6px 14px' }}>
                                    💡 {parsedReview.suggestions.length} Suggestions
                                </div>
                                <div className="badge badge-purple" style={{ padding: '6px 14px' }}>
                                    🌐 {parsedReview.language}
                                </div>
                            </div>

                            {rating && (
                                <p style={{
                                    color: '#a78bfa', fontWeight: 700,
                                    marginBottom: 10
                                }}>
                                    Rating: {rating}
                                </p>
                            )}

                            <p style={{
                                color: 'var(--text-secondary)',
                                fontSize: '1.05rem', lineHeight: 1.7
                            }}>
                                {summary || (
                                    parsedReview.score >= 70
                                        ? 'Code structure looks solid. Review the findings below for further improvements.'
                                        : parsedReview.score >= 40
                                            ? 'Your code has areas that need attention. Review the findings and suggestions below.'
                                            : 'Important code quality or logic issues were identified. Review them before using this code.'
                                )}
                            </p>
                        </div>
                    </div>

                    <ComplexitySection complexity={complexity} />

                    {parsedReview.issues.length > 0 && (
                        <SectionCard title="Code Issues & Findings"
    icon="⚠️" borderColor="#ef4444">
                            <div style={{
                                display: 'flex', flexDirection: 'column', gap: 16
                            }}>
                                {parsedReview.issues.map((issue, index) => (
                                    <IssueCard key={index} issue={issue} index={index} />
                                ))}
                            </div>
                        </SectionCard>
                    )}

                    {parsedReview.suggestions.length > 0 && (
                        <SectionCard title="Refactoring Suggestions"
                            icon="💡" borderColor="#f59e0b">
                            <div style={{
                                display: 'flex', flexDirection: 'column', gap: 16
                            }}>
                                {parsedReview.suggestions.map((suggestion, index) => (
                                    <SuggestionCard
                                        key={index}
                                        suggestion={suggestion}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </SectionCard>
                    )}

                    <div className="fade-in-delay-2 card" style={{
                        padding: 0, overflow: 'hidden'
                    }}>
                        <div style={{
                            background: 'rgba(15,23,42,0.6)',
                            padding: '16px 24px',
                            borderBottom: '1px solid var(--border)'
                        }}>
                            <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>
                                📄 Original Code Source
                            </h2>
                        </div>

                        <pre style={{
                            margin: 0, padding: 24,
                            background: 'transparent', overflow: 'auto',
                            fontSize: '0.9rem', lineHeight: 1.7,
                            color: '#e2e8f0',
                            fontFamily: "'JetBrains Mono', 'Courier New', monospace"
                        }}>
                            {parsedReview.codeSnippet}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    )
}
