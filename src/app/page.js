'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LandingPage() {
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    if (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 12 L5 7 L8 9 L11 4 L14 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="14" cy="6" r="1.5" fill="white"/>
            </svg>
          </div>
          <span className="text-xl font-bold" style={{ fontFamily: 'Syne', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            FinSight AI
          </span>
        </div>
        <button
          onClick={handleGoogleLogin}
          className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{ background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.3)', color: 'var(--accent)' }}
        >
          Sign In
        </button>
      </nav>

      {/* HERO */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8" style={{ background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.2)', color: 'var(--accent)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent)' }}></span>
          AI-Powered Stock Intelligence
        </div>

        <h1 className="text-6xl font-black mb-6 leading-tight" style={{ fontFamily: 'Syne', letterSpacing: '-2px' }}>
          Understand the{' '}
          <span style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Stock Market
          </span>
          <br />like never before
        </h1>

        <p className="text-xl mb-12 max-w-2xl leading-relaxed" style={{ color: 'var(--muted)' }}>
          Whether you're a complete beginner or a seasoned pro — FinSight AI gives you 
          real-time analysis, AI verdicts, and plain-English explanations for any stock.
        </p>

        <div className="flex items-center gap-4 mb-16">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center gap-3 px-8 py-4 rounded-xl text-base font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--accent), #00c97a)', color: '#080c14', boxShadow: '0 8px 32px rgba(0,229,160,0.3)' }}
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
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
        </div>

        {/* FEATURE CARDS */}
        <div className="grid grid-cols-4 gap-4 max-w-4xl w-full">
          {[
            { icon: '📈', title: 'Real-time Analysis', desc: 'Live stock prices, charts & technical indicators' },
            { icon: '🧠', title: 'AI Verdicts', desc: 'Buy, Sell or Hold — with clear reasoning' },
            { icon: '🎓', title: 'Beginner Friendly', desc: 'Every metric explained in plain English' },
            { icon: '🌐', title: 'Indian & Global', desc: 'NSE, BSE, NASDAQ, NYSE & Crypto' },
          ].map((f, i) => (
            <div key={i} className="p-5 rounded-2xl text-left transition-all hover:-translate-y-1" style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-2xl mb-3">{f.icon}</div>
              <div className="font-semibold text-sm mb-1" style={{ fontFamily: 'Syne' }}>{f.title}</div>
              <div className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 text-sm" style={{ color: 'var(--muted)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        Built by Udeep Tekpally · FinSight AI © 2026
      </footer>

    </main>
  )
}