'use client'
import { useState, useRef, useEffect } from 'react'

export default function ChatAssistant({ stockContext }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "👋 Hi! I'm FinSight AI Assistant. Ask me anything about stocks, markets, or investing!",
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const quickQuestions = [
    '📊 Is this a good stock for beginners?',
    '📈 What does PE ratio mean?',
    '💰 What is market cap?',
    '🎓 How do I start investing?',
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const question = text || input.trim()
    if (!question || loading) return
    setInput('')
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { role: 'user', text: question, time }])
    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          context: stockContext || 'No specific stock selected'
        })
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'ai',
        text: data.answer || 'Sorry, could not process that!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: '⚠️ Connection error. Make sure backend is running!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    }
    setLoading(false)
  }

  return (
    <>
      {/* FAB */}
      <button onClick={() => setOpen(!open)} style={{
        position: 'fixed', right: '24px', bottom: '56px',
        width: '56px', height: '56px', borderRadius: '18px',
        background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
        border: 'none', cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(0,229,160,0.35)',
        zIndex: 200, fontSize: '24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.2s'
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat Panel */}
      <div style={{
        position: 'fixed', right: '24px', bottom: '124px',
        width: '360px', background: 'var(--surface)',
        border: '1px solid rgba(0,229,160,0.2)',
        borderRadius: '20px', display: 'flex',
        flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        zIndex: 199, maxHeight: '520px',
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        transform: open ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
      }}>

        {/* Header */}
        <div style={{
          padding: '14px 16px',
          background: 'linear-gradient(135deg, rgba(0,229,160,0.1), rgba(0,170,255,0.08))',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🤖</div>
          <div>
            <div style={{ fontFamily: 'Syne', fontSize: '14px', fontWeight: 700 }}>FinSight AI</div>
            <div style={{ fontSize: '11px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }}></span>
              Online · Always here to help
            </div>
          </div>
          <button onClick={() => setOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        </div>

        {/* Messages */}
        <div style={{
          padding: '14px', flex: 1, overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '12px',
          maxHeight: '280px'
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '85%', padding: '10px 14px', fontSize: '13px', lineHeight: 1.5,
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'user' ? 'linear-gradient(135deg, rgba(0,229,160,0.2), rgba(0,170,255,0.15))' : 'var(--surface2)',
                border: msg.role === 'user' ? '1px solid rgba(0,229,160,0.25)' : '1px solid rgba(255,255,255,0.06)',
                color: 'var(--text)'
              }}>{msg.text}</div>
              <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '3px', padding: '0 4px' }}>{msg.time}</div>
            </div>
          ))}

          {/* Loading dots */}
          {loading && (
            <div style={{ alignSelf: 'flex-start' }}>
              <div style={{ background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px 16px 16px 4px', padding: '12px 16px', display: 'flex', gap: '4px' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', animation: `bounce 1s infinite ${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions — show only at start */}
        {messages.length <= 1 && (
          <div style={{ padding: '0 14px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px' }}>Quick questions</div>
            {quickQuestions.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)} style={{
                background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px', padding: '8px 12px', color: 'var(--text)',
                fontSize: '12px', cursor: 'pointer', textAlign: 'left',
                fontFamily: 'DM Sans', transition: 'border-color 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,229,160,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
              >{q}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask anything about stocks..."
            disabled={loading}
            style={{
              flex: 1, background: 'var(--surface2)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px', padding: '10px 14px',
              color: 'var(--text)', fontSize: '13px',
              fontFamily: 'DM Sans', outline: 'none'
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(0,229,160,0.3)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.06)'}
          />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{
            width: '40px', height: '40px', flexShrink: 0,
            background: input.trim() ? 'linear-gradient(135deg, var(--accent), var(--accent2))' : 'var(--surface2)',
            border: 'none', borderRadius: '12px',
            cursor: input.trim() ? 'pointer' : 'default', fontSize: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>➤</button>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
      `}</style>
    </>
  )
}