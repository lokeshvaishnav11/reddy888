import React from 'react'
import moment from 'moment'
import MarqueeAnnouncement from '../_layout/elements/marqueeAnnouncement'
import '../reports.css'

const TopClientsNew = () => {
  const [filter, setFilter] = React.useState<any>({
    startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  })
  const [activeTab, setActiveTab] = React.useState<'top-client' | 'by-market'>('top-client')

  const [items, setItems] = React.useState<any[]>([])

  const handleChange = (e: any) => {
    setFilter({ ...filter, [e.target.name]: e.target.value })
  }

  const handleSearch = (e: any) => {
    e.preventDefault()
    // TODO: hook to API
    setItems([])
  }

  const totalSum = items.reduce((acc: number, it: any) => acc + (it.total || 0), 0)

  return (
    <>
      <MarqueeAnnouncement />
      <div style={{ paddingTop: '20px' }}>
        <div className='container-fluid report-page'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='report-filters'>
                <form onSubmit={handleSearch}>
                  <div className='report-filters-row'>
                    <div className='report-filter-group'>
                      <label>Start Date</label>
                      <input name='startDate' type='date' value={filter.startDate} onChange={handleChange} />
                    </div>
                    <div className='report-filter-group'>
                      <label>End Date</label>
                      <input name='endDate' type='date' value={filter.endDate} onChange={handleChange} />
                    </div>
                    <button className='report-search-btn' type='submit'>SEARCH</button>
                  </div>
                </form>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '10px 0' }}>
                <div style={{ flex: 1 }}>
                  <div className='report-tabs'>
                    <button className={"report-tab " + (activeTab === 'top-client' ? 'active' : '')} onClick={() => setActiveTab('top-client')}>TOP CLIENT</button>
                    <button className={"report-tab " + (activeTab === 'by-market' ? 'active' : '')} onClick={() => setActiveTab('by-market')}>TOP CLIENT BY MARKET</button>
                  </div>
                  <h4 style={{ margin: '8px 0' }}>Top Clients Details({moment(filter.endDate).format('YYYY-MM-DD')})</h4>
                </div>
                <div style={{ marginLeft: '16px' }}>
                  <button className='prev-btn'>PREVIOUS</button>
                </div>
              </div>

              <div className='report-table-wrapper'>
                <table className='report-table'>
                  <thead>
                    <tr>
                      <th>USERNAME</th>
                      <th>TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={2} className='report-empty'>No Result Found</td>
                      </tr>
                    ) : (
                      items.map((it, idx) => (
                        <tr key={idx}>
                          <td className='wnwrap'>{it.username}</td>
                          <td className={it.total >= 0 ? 'positive' : 'negative'}>{it.total.toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                    <tr>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>TOTAL:</td>
                      <td style={{ fontWeight: 700 }}>{totalSum.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TopClientsNew
