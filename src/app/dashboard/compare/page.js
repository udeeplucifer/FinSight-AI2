'use client'
import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import ChatAssistant from '@/components/ChatAssistant'

export default function ComparePage() {
  const [ticker1, setTicker1] = useState('')
  const [ticker2, setTicker2] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCompare = async () => {
    if (!ticker1.trim() || !ticker2.trim()) {
      setError('Please enter both stock tickers!')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/compare/${ticker1.toUpperCase()}/${ticker2.toUpperCase()}`)
      const result = await res.json()
      if (result.error) {
        setError('Could not fetch data. Check ticker symbols!')
      } else {
        setData(result)
      }
    } catch {
      setError('Backend connection failed!')
    }
    setLoading(false)
  }

  // Merge chart data for comparison
  const mergedChart = data ? data.chart1.map((item, i) => ({
    time: item.time,
    [data.stock1.ticker]: item.value,
    [data.stock2.ticker]: data.chart2[i]?.value || null,
  })) : []

  const metrics = data ? [
    { label: 'Price', k: 'price', format: v => `$${v}` },
    { label: 'Market Cap', k: 'market_cap', format: v => v },
    { label: 'Sector', k: 'sector', format: v => v },
    { label: 'P/E Ratio', k: 'pe_ratio', format: v => v },
    { label: '52W High', k: 'week_high', format: v => v ? `$${v}` : 'N/A' },
    { label: '52W Low', k: 'week_low', format: v => v ? `$${v}` : 'N/A' },
    { label: 'Beta', k: 'beta', format: v => v },
    { label: 'Dividend Yield', k: 'dividend_yield', format: v => v !== 'N/A' ? `${v}%` : 'N/A' },
  ] : []

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '28px', paddingBottom: '60px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <a href="/dashboard" style={{ fontSize: '13px', color: 'var(--muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          ← Back to Dashboard
        </a>
        <div style={{ fontFamily: 'Syne', fontSize: '28px', fontWeight: 800 }}>⚖️ Stock Comparison</div>
        <div style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>Compare two stocks side by side with AI analysis</div>
      </div>

      {/* Input Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: 'var(--accent)', fontSize: '20px' }}>📈</span>
          <input
            value={ticker1}
            onChange={e => setTicker1(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleCompare()}
            placeholder="Stock 1 (e.g. AAPL)"
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: '16px', fontFamily: 'Syne', fontWeight: 700, width: '100%' }}
          />
        </div>

        <div style={{ fontFamily: 'Syne', fontSize: '20px', fontWeight: 800, color: 'var(--muted)', textAlign: 'center' }}>VS</div>

        <div style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: 'var(--accent2)', fontSize: '20px' }}>📊</span>
          <input
            value={ticker2}
            onChange={e => setTicker2(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleCompare()}
            placeholder="Stock 2 (e.g. MSFT)"
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: '16px', fontFamily: 'Syne', fontWeight: 700, width: '100%' }}
          />
        </div>

        <button onClick={handleCompare} disabled={loading} style={{
          background: 'linear-gradient(135deg, var(--accent), #00c97a)',
          border: 'none', borderRadius: '12px', padding: '14px 24px',
          color: '#080c14', fontFamily: 'Syne', fontSize: '14px',
          fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap'
        }}>
          {loading ? '⏳ Loading...' : '⚖️ Compare'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.2)', borderRadius: '10px', padding: '12px 16px', color: 'var(--red)', marginBottom: '20px', fontSize: '14px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', border: '3px solid rgba(0,229,160,0.2)', borderTop: '3px solid var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <div style={{ color: 'var(--muted)' }}>Comparing {ticker1} vs {ticker2}...</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Results */}
      {data && !loading && (
        <div>
          {/* Stock name headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            {[data.stock1, data.stock2].map((s, i) => (
              <div key={i} style={{
                background: 'var(--surface)',
                border: `1px solid ${i === 0 ? 'rgba(0,229,160,0.25)' : 'rgba(0,170,255,0.25)'}`,
                borderRadius: '14px', padding: '20px',
                borderTop: `3px solid ${i === 0 ? 'var(--accent)' : 'var(--accent2)'}`
              }}>
                <div style={{ fontFamily: 'Syne', fontSize: '24px', fontWeight: 800, color: i === 0 ? 'var(--accent)' : 'var(--accent2)' }}>{s.ticker}</div>
                <div style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>{s.name}</div>
                <div style={{ fontFamily: 'Syne', fontSize: '28px', fontWeight: 800, marginTop: '8px' }}>${s.price}</div>
              </div>
            ))}
          </div>

          {/* Comparison Chart */}
          <div style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ fontFamily: 'Syne', fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>📈 1Y Growth Comparison (Normalized to 100)</div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mergedChart} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e5a0" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00e5a0" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00aaff" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00aaff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="time" tick={{ fill: '#6b7a99', fontSize: 11 }} tickLine={false} interval={40} />
                <YAxis tick={{ fill: '#6b7a99', fontSize: 11 }} tickLine={false} tickFormatter={v => `${v}`} width={45} />
                <Tooltip
                  contentStyle={{ background: '#111b2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                  labelStyle={{ color: '#6b7a99', fontSize: '12px' }}
                  itemStyle={{ fontSize: '13px' }}
                />
                <Legend wrapperStyle={{ fontSize: '13px', color: 'var(--muted)' }} />
                <Area type="monotone" dataKey={data.stock1.ticker} stroke="#00e5a0" strokeWidth={2} fill="url(#grad1)" dot={false} />
                <Area type="monotone" dataKey={data.stock2.ticker} stroke="#00aaff" strokeWidth={2} fill="url(#grad2)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Metrics Comparison Table */}
          <div style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', overflow: 'hidden', marginBottom: '20px' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontFamily: 'Syne', fontSize: '16px', fontWeight: 700 }}>📊 Head-to-Head Metrics</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '12px 20px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>Metric</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase' }}>{data.stock1.ticker}</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent2)', textTransform: 'uppercase' }}>{data.stock2.ticker}</div>
            </div>
            {metrics.map((m, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '14px 20px', borderBottom: i < metrics.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{m.label}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)' }}>{m.format(data.stock1[m.k])}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent2)' }}>{m.format(data.stock2[m.k])}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ChatAssistant stockContext={data ? `Comparing ${data.stock1.name} vs ${data.stock2.name}` : ''} />
    </div>
  )
}