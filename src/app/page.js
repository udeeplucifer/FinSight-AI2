'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

export default function LandingPage() {
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    })
    if (error) { console.error(error); setLoading(false) }
  }

  if (!mounted) return null

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* NAVBAR */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image src="/logo.jpg" alt="FinSight AI" width={36} height={36} style={{ borderRadius: '10px', objectFit: 'cover' }} />
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '20px', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            FinSight AI
          </span>
        </div>
        <button onClick={handleGoogleLogin} style={{ padding: '8px 20px', borderRadius: '10px', background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.3)', color: 'var(--accent)', fontFamily: 'Syne', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
          Sign In
        </button>
      </nav>

      {/* HERO */}
      <section style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', maxWidth: '1100px', width: '100%', alignItems: 'center' }}>

          {/* LEFT — Text */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.2)', marginBottom: '24px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
              <span style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 500 }}>AI-Powered Stock Intelligence</span>
            </div>

            <h1 style={{ fontFamily: 'Syne', fontSize: '52px', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-2px', marginBottom: '20px' }}>
              Understand the{' '}
              <span style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Stock Market
              </span>
              {' '}like never before
            </h1>

            <p style={{ fontSize: '16px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '32px', maxWidth: '460px' }}>
              Whether you're a complete beginner or a seasoned pro — FinSight AI gives you real-time analysis, AI verdicts, and plain-English explanations for any stock.
            </p>

            <button onClick={handleGoogleLogin} disabled={loading} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 28px', borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--accent), #00c97a)',
              border: 'none', cursor: 'pointer', fontSize: '15px',
              fontFamily: 'Syne', fontWeight: 700, color: '#080c14',
              boxShadow: '0 8px 32px rgba(0,229,160,0.3)',
              transition: 'transform 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {loading ? '⏳ Signing in...' : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#080c14" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#080c14" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#080c14" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#080c14" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '16px' }}>
              Free to use · No credit card required · Instant access
            </p>
          </div>

          {/* RIGHT — Preview card */}
          <div style={{ position: 'relative' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px', boxShadow: '0 40px 80px rgba(0,0,0,0.4)' }}>
              {/* Mock dashboard preview */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Image src="/logo.jpg" alt="Logo" width={28} height={28} style={{ borderRadius: '8px', objectFit: 'cover' }} />
                <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '14px', color: 'var(--accent)' }}>FinSight AI</span>
                <span style={{ marginLeft: 'auto', fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: 'rgba(0,229,160,0.1)', color: 'var(--accent)', border: '1px solid rgba(0,229,160,0.2)' }}>● Live</span>
              </div>

              {/* Mock metric cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                {[
                  { label: 'AAPL', value: '$189.50', color: 'var(--accent2)' },
                  { label: 'Market Cap', value: '$2.9T', color: 'var(--text)' },
                  { label: 'AI Verdict', value: 'BUY', color: 'var(--accent)' },
                ].map((m, i) => (
                  <div key={i} style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>{m.label}</div>
                    <div style={{ fontFamily: 'Syne', fontSize: '14px', fontWeight: 700, color: m.color }}>{m.value}</div>
                  </div>
                ))}
              </div>

              {/* Mock chart */}
              <div style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '10px' }}>📈 Price Chart</div>
                <svg width="100%" height="60" viewBox="0 0 300 60">
                  <polyline points="0,50 40,40 80,45 120,25 160,30 200,15 240,20 300,5" fill="none" stroke="var(--accent)" strokeWidth="2"/>
                  <polyline points="0,50 40,40 80,45 120,25 160,30 200,15 240,20 300,5 300,60 0,60" fill="rgba(0,229,160,0.08)" strokeWidth="0"/>
                </svg>
              </div>

              {/* Mock news */}
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>📰 Latest News</div>
              {['Apple beats Q4 earnings expectations', 'iPhone 16 demand surges globally'].map((n, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', padding: '8px 0', borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: '4px' }}></div>
                  <div style={{ fontSize: '11px', color: 'var(--text)' }}>{n}</div>
                </div>
              ))}
            </div>

            {/* Glow effect */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(0,229,160,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: -1 }} />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '40px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', maxWidth: '1100px', margin: '0 auto' }}>
          {[
            { icon: '📈', title: 'Real-time Analysis', desc: 'Live stock prices, charts & technical indicators' },
            { icon: '🧠', title: 'AI Verdicts', desc: 'Buy, Sell or Hold with clear reasoning' },
            { icon: '🎓', title: 'Beginner Friendly', desc: 'Every metric explained in plain English' },
            { icon: '🌐', title: 'Indian & Global', desc: 'NSE, BSE, NASDAQ, NYSE & Crypto' },
          ].map((f, i) => (
            <div key={i} style={{ padding: '20px', borderRadius: '16px', background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>{f.icon}</div>
              <div style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>{f.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ textAlign: 'center', padding: '20px', fontSize: '13px', color: 'var(--muted)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        Built by Udeep Tekpally · FinSight AI © 2026
      </footer>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </main>
  )
}