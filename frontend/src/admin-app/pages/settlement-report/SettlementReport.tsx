import React from 'react'
import moment from 'moment'
import MarqueeAnnouncement from '../_layout/elements/marqueeAnnouncement'
import '../reports.css'

const SettlementReport = () => {
  const [filter, setFilter] = React.useState<any>({
    startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    type: 'All',
  })

  const [items, setItems] = React.useState<any[]>([])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFilter({ ...filter, [name]: value })
  }

  const handleSearch = (e: any) => {
    e.preventDefault()
    // TODO: hook to actual backend
    setItems([])
  }

  const handleExport = (e: any) => {
    e.preventDefault()
    // TODO: implement export (CSV/XLS)
    alert('Export not implemented yet')
  }

  return (
    <>
      <MarqueeAnnouncement />
      <div style={{ paddingTop: '20px' }}>
        <div className='container-fluid report-page'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='report-filters'>
                <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ flex: 1, display: 'flex', gap: 16 }}>
                    <div className='report-filter-group'>
                      <label>Start Date</label>
                      <input name='startDate' type='date' value={filter.startDate} onChange={handleChange} />
                    </div>
                    <div className='report-filter-group'>
                      <label>End Date</label>
                      <input name='endDate' type='date' value={filter.endDate} onChange={handleChange} />
                    </div>
                    <div className='report-filter-group'>
                      <label>Type</label>
                      <select name='type' value={filter.type} onChange={handleChange}>
                        <option>All</option>
                        <option>Credit</option>
                        <option>Debit</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className='report-search-btn' onClick={handleExport}>EXPORT</button>
                    <button className='report-search-btn' type='submit'>SEARCH</button>
                  </div>
                </form>
              </div>

              <div className='report-table-wrapper'>
                <table className='report-table settlement-table'>
                  <thead>
                    <tr>
                      <th>NO</th>
                      <th>DESC</th>
                      <th>TYPE</th>
                      <th>AMOUNT</th>
                      <th>TOTAL</th>
                      <th>D/C</th>
                      <th>NOTE</th>
                      <th>TIME/DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={8} className='report-empty' style={{ padding: 20 }}>No Result Found</td>
                      </tr>
                    ) : (
                      items.map((it, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{it.desc}</td>
                          <td>{it.type}</td>
                          <td style={{ textAlign: 'right' }}>{it.amount}</td>
                          <td style={{ textAlign: 'right' }}>{it.total}</td>
                          <td>{it.dc}</td>
                          <td>{it.note}</td>
                          <td>{it.time}</td>
                        </tr>
                      ))
                    )}
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

export default SettlementReport
