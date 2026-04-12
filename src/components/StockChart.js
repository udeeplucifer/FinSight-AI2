'use client'
import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function StockChart({ ticker }) {
  const [activeRange, setActiveRange] = useState('1Y')
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const ranges = ['1M', '3M', '6M', '1Y', '3Y', '5Y']

  useEffect(() => {
    if (!ticker) return
    fetchData(activeRange)
  }, [ticker, activeRange])

  const fetchData = async (range) => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stock/${ticker}/history?range=${range}`)
      const data = await res.json()
      if (data.prices) {
        const formatted = data.prices.map(p => ({
          date: p.time,
          price: p.value
        }))
        setChartData(formatted)
      }
    } catch (err) {
      console.error('Chart fetch error:', err)
    }
    setLoading(false)
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#111b2e', border: '1px solid rgba(0,229,160,0.2)', borderRadius: '8px', padding: '10px 14px' }}>
          <div style={{ fontSize: '12px', color: '#6b7a99', marginBottom: '4px' }}>{label}</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#00e5a0' }}>${payload[0].value.toFixed(2)}</div>
        </div>
      )
    }
    return null
  }

  const minPrice = chartData.length ? Math.min(...chartData.map(d => d.price)) * 0.98 : 0
  const maxPrice = chartData.length ? Math.max(...chartData.map(d => d.price)) * 1.02 : 0

  // Show only some date labels to avoid crowding
  const tickInterval = Math.floor(chartData.length / 6)

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ fontFamily: 'Syne', fontSize: '16px', fontWeight: 700 }}>📈 Price Chart — {ticker}</div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {ranges.map(r => (
            <button key={r} onClick={() => setActiveRange(r)} style={{
              padding: '5px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', border: '1px solid', fontFamily: 'DM Sans',
              background: activeRange === r ? 'rgba(0,229,160,0.12)' : 'transparent',
              borderColor: activeRange === r ? 'rgba(0,229,160,0.3)' : 'rgba(255,255,255,0.06)',
              color: activeRange === r ? 'var(--accent)' : 'var(--muted)',
            }}>{r}</button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', color: 'var(--muted)' }}>
          <div style={{ width: '32px', height: '32px', border: '2px solid rgba(0,229,160,0.2)', borderTop: '2px solid var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Loading chart...
        </div>
      ) : chartData.length === 0 ? (
        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
          No chart data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00e5a0" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#00e5a0" stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#6b7a99', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              interval={tickInterval}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tick={{ fill: '#6b7a99', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              tickFormatter={v => `$${v.toFixed(0)}`}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#00e5a0"
              strokeWidth={2}
              fill="url(#priceGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#00e5a0', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {/* Stats row */}
      {chartData.length > 0 && (
        <div style={{ display: 'flex', gap: '24px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '2px' }}>Period High</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent)' }}>${maxPrice.toFixed(2)}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '2px' }}>Period Low</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--red)' }}>${minPrice.toFixed(2)}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '2px' }}>Data Points</div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>{chartData.length}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '2px' }}>Range</div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>{activeRange}</div>
          </div>
        </div>
      )}
    </div>
  )
}