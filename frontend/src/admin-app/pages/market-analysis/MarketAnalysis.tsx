import React from 'react'
import betService from '../../../services/bet.service'
import { AxiosResponse } from 'axios'
import './market-analysis.css'

const MarketAnalysis = () => {
  const [marketdata, setmarketData] = React.useState([])
  const [startDate, setStartDate] = React.useState('')
  const [endDate, setEndDate] = React.useState('')

  React.useEffect(() => {
    // Set default dates - start date as today, end date as 7 days from now
    const today = new Date()
    const weekFromNow = new Date(today)
    weekFromNow.setDate(weekFromNow.getDate() + 7)
    
    setStartDate(formatDate(today))
    setEndDate(formatDate(weekFromNow))
    
    fetchMarketData()
  }, [])

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const fetchMarketData = () => {
    betService.getMarketAnalysis().then((res: AxiosResponse) => {
      setmarketData(res.data.data)
    })
  }

  const handleSearch = () => {
    // Implement search logic with date filters
    fetchMarketData()
  }

  return (
    <div className="market-analysis-page">
      <div className="market-analysis-container">
        {/* Date Filter Section */}
        <div className="date-filter-section">
          <div className="filter-row">
            <div className="filter-group">
              <label className="filter-label">START DATE</label>
              <input
                type="text"
                className="date-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="DD/MM/YYYY"
              />
            </div>
            <div className="filter-group">
              <label className="filter-label">END DATE</label>
              <input
                type="text"
                className="date-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="DD/MM/YYYY"
              />
            </div>
            <button className="search-button" onClick={handleSearch}>
              SEARCH
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="market-table-section">
          <table className="market-table">
            <thead>
              <tr className="table-header">
                <th className="col-no">NO</th>
                <th className="col-event">EVENT NAME</th>
                <th className="col-team">TEAM</th>
              </tr>
            </thead>
            <tbody>
              {marketdata && marketdata.length > 0 ? (
                marketdata.map((item: any, index: number) => (
                  <tr key={index} className="table-row">
                    <td className="col-no">{index + 1}</td>
                    <td className="col-event">
                      <a href={`/admin/odds/${item.matchId}`} className="event-link">
                        {item.matchName} ({item.betCount})
                      </a>
                    </td>
                    <td className="col-team">
                      {/* Team details can be added here if available in data */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="no-data">
                    No market data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MarketAnalysis
