'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import StockChart from '@/components/StockChart'
import ChatAssistant from '@/components/ChatAssistant'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [ticker, setTicker] = useState('')
  const [loading, setLoading] = useState(false)
  const [stockData, setStockData] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setUser({ email: 'test@test.com', user_metadata: { name: 'Udeep' } })
      } else {
        setUser(user)
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleAnalysis = async () => {
    if (!ticker.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stock/${ticker.toUpperCase()}`)
      const data = await res.json()
      setStockData(data)
    } catch (err) {
      alert('Error fetching stock data. Make sure backend is running!')
    }
    setLoading(false)
  }

  const tickerItems = [
    { name: 'NIFTY 50', val: '22,500', chg: '+0.8%', up: true },
    { name: 'SENSEX', val: '74,200', chg: '+0.6%', up: true },
    { name: 'S&P 500', val: '5,120', chg: '-0.2%', up: false },
    { name: 'NASDAQ', val: '16,300', chg: '+1.2%', up: true },
    { name: 'BTC/USD', val: '$71,400', chg: '+2.1%', up: true },
    { name: 'GOLD', val: '$2,340', chg: '+0.3%', up: true },
  ]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* SIDEBAR */}
      <div style={{
        position: 'fixed', left: 0, top: 0, bottom: '40px',
        width: '240px', background: 'var(--surface)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        padding: '20px 14px', gap: '6px', zIndex: 100, overflowY: 'auto'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 12 L5 7 L8 9 L11 4 L14 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="14" cy="6" r="1.5" fill="white"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '18px', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            FinSight AI
          </span>
        </div>

        {/* User pill */}
        <div style={{ background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.2)', borderRadius: '10px', padding: '10px 12px', marginBottom: '8px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)' }}>
            👋 {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>Pro Account</div>
        </div>

        {/* Search */}
        <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1.2px', padding: '8px 4px 4px' }}>Analysis</div>
        <div style={{ background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--muted)', fontSize: '14px' }}>🔍</span>
          <input
            value={ticker}
            onChange={e => setTicker(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAnalysis()}
            placeholder="Enter ticker (e.g. AMZN)"
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: '13px', fontFamily: 'DM Sans', width: '100%' }}
          />
        </div>
        <button
          onClick={handleAnalysis}
          disabled={loading}
          style={{ background: 'linear-gradient(135deg, var(--accent), #00c97a)', border: 'none', borderRadius: '10px', padding: '11px', color: '#080c14', fontFamily: 'Syne', fontSize: '13px', fontWeight: 700, cursor: 'pointer', width: '100%', marginTop: '6px' }}
        >
          {loading ? '⏳ Loading...' : '🚀 Run Analysis'}
        </button>

        {/* Nav */}
        <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1.2px', padding: '12px 4px 4px' }}>Navigate</div>
        {[
          { icon: '📊', label: 'Dashboard' },
          { icon: '⚖️', label: 'Compare Stocks', href: '/dashboard/compare' },
          { icon: '🌐', label: 'Market Overview' },
          { icon: '📰', label: 'News Feed' },
          { icon: '🤖', label: 'AI Assistant' },
        ].map((item, i) => (
          <div key={i}
            onClick={() => item.href && router.push(item.href)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 500, color: 'var(--muted)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' }}
          >
            <span>{item.icon}</span> {item.label}
          </div>
        ))}

        {/* Watchlist */}
        <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1.2px', padding: '12px 4px 4px' }}>Watchlist</div>
        {[
          { ticker: 'TSLA', chg: '+2.3%', up: true },
          { ticker: 'NVDA', chg: '+1.8%', up: true },
          { ticker: 'INFY', chg: '-0.5%', up: false },
        ].map((w, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: '8px', background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '12px', cursor: 'pointer' }}>
            <span style={{ fontFamily: 'Syne', fontWeight: 700 }}>{w.ticker}</span>
            <span style={{ color: w.up ? 'var(--accent)' : 'var(--red)' }}>{w.up ? '▲' : '▼'} {w.chg}</span>
          </div>
        ))}

        {/* Logout */}
        <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
          <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', color: 'var(--red)', background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.15)' }}>
            🚪 Logout
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ marginLeft: '240px', marginBottom: '40px', padding: '28px', minHeight: 'calc(100vh - 40px)' }}>

        {/* HOME STATE */}
        {!stockData && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '16px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Syne', fontSize: '48px', fontWeight: 800, background: 'linear-gradient(135deg, var(--accent), var(--accent2), var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-2px' }}>
              FinSight AI
            </div>
            <div style={{ color: 'var(--muted)', fontSize: '16px' }}>Enter a stock ticker on the left to begin your analysis</div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { icon: '📈', label: 'Real-time data' },
                { icon: '🧠', label: 'AI verdicts' },
                { icon: '📰', label: 'Live news' },
                { icon: '📊', label: 'Pro charts' },
              ].map((f, i) => (
                <div key={i} style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '20px', textAlign: 'center', width: '130px' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{f.icon}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{f.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', border: '3px solid rgba(0,229,160,0.2)', borderTop: '3px solid var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <div style={{ color: 'var(--muted)', fontSize: '16px' }}>Analyzing {ticker.toUpperCase()}...</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* STOCK DATA */}
        {stockData && !loading && (
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Report for</div>
                <div style={{ fontFamily: 'Syne', fontSize: '24px', fontWeight: 800 }}>{stockData.ticker} · {stockData.name}</div>
              </div>
              <button onClick={() => setStockData(null)} style={{ padding: '8px 16px', borderRadius: '10px', background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--muted)', cursor: 'pointer', fontSize: '13px' }}>
                ← New Search
              </button>
            </div>

            {/* Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'Ticker', value: stockData.ticker, color: 'var(--accent2)' },
                { label: 'Sector', value: stockData.sector || 'N/A', small: true },
                { label: 'Price', value: `$${stockData.price}` },
                { label: 'Market Cap', value: stockData.market_cap },
                { label: 'AI Verdict', value: stockData.verdict || 'HOLD', color: 'var(--accent)', glow: true },
              ].map((card, i) => (
                <div key={i} style={{
                  background: card.glow ? 'linear-gradient(135deg,rgba(0,229,160,0.07),rgba(0,229,160,0.03))' : 'var(--surface)',
                  border: card.glow ? '1px solid rgba(0,229,160,0.25)' : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px', padding: '16px'
                }}>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>{card.label}</div>
                  <div style={{ fontFamily: 'Syne', fontSize: card.small ? '14px' : '20px', fontWeight: 700, color: card.color || 'var(--text)', textShadow: card.glow ? '0 0 20px rgba(0,229,160,0.4)' : 'none' }}>{card.value}</div>
                </div>
              ))}
            </div>

            {/* Extra Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'P/E Ratio', value: stockData.pe_ratio || 'N/A' },
                { label: '52W High', value: stockData.week_high ? `$${stockData.week_high}` : 'N/A', color: 'var(--accent)' },
                { label: '52W Low', value: stockData.week_low ? `$${stockData.week_low}` : 'N/A', color: 'var(--red)' },
                { label: 'Beta', value: stockData.beta || 'N/A' },
              ].map((card, i) => (
                <div key={i} style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '16px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>{card.label}</div>
                  <div style={{ fontFamily: 'Syne', fontSize: '20px', fontWeight: 700, color: card.color || 'var(--text)' }}>{card.value}</div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <StockChart ticker={stockData.ticker} />

            {/* AI Summary */}
            {stockData.summary && (
              <div style={{ background: 'var(--surface)', border: '1px solid rgba(0,229,160,0.15)', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent)', marginBottom: '8px' }}>🧠 AI Analysis</div>
                <div style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.7 }}>{stockData.summary}</div>
              </div>
            )}

            {/* News */}
            {stockData.news && stockData.news.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontFamily: 'Syne', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>📰 Latest News</div>
                <div style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '4px 16px' }}>
                  {stockData.news.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', padding: '14px 0', borderBottom: i < stockData.news.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: '5px' }}></div>
                      <div>
                        <a href={item.url} target="_blank" rel="noreferrer" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', textDecoration: 'none' }}>{item.title}</a>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px' }}>{item.source}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* TICKER */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '40px', background: '#0a1525', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', overflow: 'hidden', zIndex: 300 }}>
        <div style={{ display: 'flex', gap: '40px', animation: 'ticker 30s linear infinite', whiteSpace: 'nowrap' }}>
          {[...tickerItems, ...tickerItems].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', flexShrink: 0 }}>
              <span style={{ color: 'var(--muted)' }}>{t.name}</span>
              <span style={{ fontFamily: 'Syne' }}>{t.val}</span>
              <span style={{ color: t.up ? 'var(--accent)' : 'var(--red)' }}>{t.chg}</span>
            </div>
          ))}
        </div>
        <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </div>

      {/* AI CHAT ASSISTANT */}
      <ChatAssistant
        stockContext={stockData
          ? `${stockData.name} (${stockData.ticker}) - Price: $${stockData.price}, Sector: ${stockData.sector}, Verdict: ${stockData.verdict}`
          : ''}
      />

    </div>
  )
}