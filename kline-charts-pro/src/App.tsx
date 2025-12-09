import { useEffect, useRef, useState } from 'react'
import { init, dispose, CandleType } from 'klinecharts'
import type { KLineData } from 'klinecharts'
import { generateMockData } from './mockData.ts'
import './App.css'

function App() {
  const chartRef = useRef<HTMLDivElement>(null)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    if (!chartRef.current) return

    const baseStyles = {
      grid: { show: true },
      candle: { type: CandleType.CandleSolid },
      indicator: { bars: [{ upColor: '#26A69A', downColor: '#EF5350' }] }
    }

    const chart = init(chartRef.current, {
      timezone: 'Asia/Shanghai',
      styles: theme
    })
    chart?.setStyles(baseStyles)

    // 加载初始数据
    const data: KLineData[] = generateMockData(200)
    chart?.applyNewData(data)

    // 模拟实时推送（每2秒一根K线）
    const interval = setInterval(() => {
      const last = data[data.length - 1]
      const newCandle: KLineData = {
        open: last.close,
        close: last.close + (Math.random() - 0.5) * 20,
        high: Math.max(last.close, last.close + Math.random() * 30),
        low: Math.min(last.close, last.close - Math.random() * 30),
        volume: Math.random() * 1000000,
        timestamp: Date.now(),
      }
      newCandle.high = Math.max(newCandle.open, newCandle.close, newCandle.high)
      newCandle.low = Math.min(newCandle.open, newCandle.close, newCandle.low)
      chart?.updateData(newCandle)
    }, 2000)

    return () => {
      clearInterval(interval)
      if (chart) {
        dispose(chart)
      }
    }
  }, [theme])

  return (
    <div className={`app ${theme}`}>
      <div className="header">
        <h1>BTC/USDT 永续合约</h1>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? '☀️ 浅色' : '🌙 深色'}
        </button>
      </div>
      <div className="funding-rate">当前资金费率：+0.0124%（8H）</div>
      <div ref={chartRef} style={{ width: '100%', height: '600px' }} />
      <div className="footer">
        <span>MA7</span> <span>MA30</span> <span>BOLL</span> · 实时推送中...
      </div>
    </div>
  )
}

export default App
