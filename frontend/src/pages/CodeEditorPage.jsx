import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import Navbar from '../components/Navbar'
import API from '../api/axiosConfig'

const LANGUAGES = ['java', 'python', 'javascript', 'typescript', 'cpp', 'c', 'go', 'rust', 'kotlin', 'php']

const SAMPLE_CODE = {
    java: `public class Example {\n    public static void main(String[] args) {\n        String s = null;\n        System.out.println(s.length()); // NullPointerException!\n    }\n}`,
    python: `def divide(a, b):\n    return a / b  # No zero-division check!\n\nresult = divide(10, 0)\nprint(result)`,
    javascript: `var password = "admin123"  // hardcoded credentials\nfunction fetchData(url) {\n  eval(url)  // dangerous eval usage\n}`,
}

export default function CodeEditorPage() {
    const navigate = useNavigate()
    const [language, setLanguage] = useState('java')
    const [code, setCode] = useState(SAMPLE_CODE.java)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLanguageChange = (lang) => {
        setLanguage(lang)
        setCode(SAMPLE_CODE[lang] || '')
    }

    const handleSubmit = async () => {
        if (!code.trim()) { setError('Please enter some code to review.'); return }
        setError('')
        setLoading(true)
        try {
            const { data } = await API.post('/review/code', { language, code })
            navigate(`/result/${data.id}`, { state: { review: data } })
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit code. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ flex: 1, maxWidth: 1200, width: '100%', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column' }}>

                {/* Header */}
                <div className="fade-in" style={{ marginBottom: 32, textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(139,92,246,0.3)', fontSize: 28, marginBottom: 16 }}>⌨</div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 10, letterSpacing: '-0.02em' }}>AI Code Analyzer</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 600, margin: '0 auto' }}>Paste your snippet below. Our AI identifies bugs, flags security vulnerabilities, and suggests refactoring optimizations.</p>
                </div>

                {/* Toolbar */}
                <div className="fade-in-delay-1 card" style={{ marginBottom: 24, padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                        <span style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 600 }}>Select Language:</span>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {LANGUAGES.map(lang => (
                                <button key={lang} onClick={() => handleLanguageChange(lang)}
                                    style={{
                                        padding: '8px 16px', borderRadius: 10, border: '1px solid',
                                        borderColor: language === lang ? 'var(--accent)' : 'var(--border)',
                                        background: language === lang ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)',
                                        color: language === lang ? '#c4b5fd' : 'var(--text-secondary)',
                                        fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s',
                                    }}>{lang}</button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Editor Container */}
                <div className="fade-in-delay-2 card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 480, marginBottom: 24, position: 'relative' }}>
                    {/* Mac-style header */}
                    <div style={{
                        background: 'rgba(15,23,42,0.8)', padding: '12px 20px',
                        borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em' }}>
                            {language}_snippet.{language === 'python' ? 'py' : language === 'javascript' || language === 'typescript' ? 'js' : language}
                        </span>
                        <div style={{ width: 44 }}></div> {/* spacer */}
                    </div>

                    <div style={{ flex: 1, position: 'relative' }}>
                        <Editor
                            height="100%"
                            language={language}
                            value={code}
                            onChange={val => setCode(val || '')}
                            theme="vs-dark"
                            options={{
                                fontSize: 15,
                                minimap: { enabled: false },
                                lineNumbers: 'on',
                                scrollBeyondLastLine: false,
                                wordWrap: 'on',
                                padding: { top: 20, bottom: 20 },
                                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                                fontLigatures: true,
                                cursorBlinking: "smooth",
                                cursorSmoothCaretAnimation: "on",
                                formatOnPaste: true,
                            }}
                        />
                    </div>

                    {/* Analyzing Overlay inside editor */}
                    {loading && (
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(3,7,18,0.7)', backdropFilter: 'blur(8px)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10,
                        }}>
                            <div className="spinner" style={{ width: 48, height: 48, borderWidth: 4, borderColor: 'rgba(139,92,246,0.3)', borderTopColor: '#8b5cf6', marginBottom: 20 }} />
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8 }}>Analyzing Code...</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Identifying bugs and calculating quality score</p>
                        </div>
                    )}
                </div>

                {error && <div className="alert-error fade-in"><span>⚠️</span> {error}</div>}

                {/* Actions */}
                <div className="fade-in-delay-2" style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', alignItems: 'center' }}>
                    <button onClick={() => setCode('')} className="btn-secondary" disabled={loading} style={{ padding: '14px 24px' }}>Clear Output</button>
                    <button onClick={handleSubmit} className="btn-primary" disabled={loading} style={{ padding: '14px 32px', fontSize: '1rem' }}>
                        {loading ? <span className="spinner" /> : '🚀'}
                        {loading ? ' Analyzing...' : ' Analyze with AI'}
                    </button>
                </div>

            </div>
        </div>
    )
}
