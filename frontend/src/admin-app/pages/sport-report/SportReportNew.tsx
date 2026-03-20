import React from 'react'
import moment from 'moment'
import MarqueeAnnouncement from '../_layout/elements/marqueeAnnouncement'
import '../reports.css'

const SportReportNew = () => {
  const [filter, setFilter] = React.useState<any>({
    startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  })

  // Example available data range shown in screenshot
  const availableFrom = '2025-06-12'
  const availableTo = moment().format('YYYY-MM-DD')

  const [total, setTotal] = React.useState<number>(0)

  const handleChange = (e: any) => {
    setFilter({ ...filter, [e.target.name]: e.target.value })
  }

  const handleSearch = (e: any) => {
    e.preventDefault()
    // TODO: call API to fetch totals for the date range
    // Placeholder: show 0 like screenshot
    setTotal(0)
  }

  const handleLifetime = (e: any) => {
    e.preventDefault()
    // TODO: lifetime search behavior
    setTotal(0)
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
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className='report-search-btn' type='submit'>SEARCH</button>
                    <button className='report-search-btn' onClick={handleLifetime}>LIFETIME SEARCH</button>
                  </div>
                </form>
              </div>

              <h4 style={{ margin: '10px 0' }}>Sports Details({moment(filter.startDate).format('DD/MM/YYYY')} - {moment(filter.endDate).format('DD/MM/YYYY')})</h4>

              <div style={{ color: '#dc2626', marginBottom: 8, fontWeight: 700 }}>
                This report has data from {availableFrom} to {availableTo}
              </div>

              <div className='report-table-wrapper'>
                <table className='report-table' style={{ minWidth: '400px' }}>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: 'left', paddingLeft: 20 }}>Total</td>
                      <td style={{ textAlign: 'center', color: '#dc2626', fontWeight: 700 }}>{total}</td>
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

export default SportReportNew
