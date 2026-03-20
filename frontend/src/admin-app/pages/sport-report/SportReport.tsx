import React from 'react'
import moment from 'moment'
import MarqueeAnnouncement from '../_layout/elements/marqueeAnnouncement'
import '../reports.css'
import accountService from '../../../services/account.service'

const SportReport = () => {
  const [filter, setFilter] = React.useState<any>({
    startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  })


  const prepareSportReport = (
    bets: any[],
    startDate?: string,
    endDate?: string,
    isLifetime: boolean = false
  ) => {
    let filteredBets = bets
  
    if (!isLifetime && startDate && endDate) {
      const start = moment(startDate).startOf('day')
      const end = moment(endDate).endOf('day')
  
      filteredBets = bets.filter(bet =>
        moment(bet.updatedAt).isBetween(start, end, null, '[]')
      )
    }
  
    let cricketTotal = 0
    let casinoTotal = 0
  
    filteredBets.forEach(bet => {
      const pl = bet.profitLoss || 0
  
      if (bet.bet_on == 'MATCH_ODDS' || bet.bet_on == 'FANCY') {
        cricketTotal += pl
      }
  
      if (bet.bet_on == 'CASINO') {
        casinoTotal += pl
      }
    })
  
    return [
      { name: 'Cricket', total: cricketTotal },
      { name: 'Casino', total: casinoTotal },
    ]
  }
  

  const [allBets, setAllBets] = React.useState<any[]>([])

  

  const [items, setItems] = React.useState<any[]>([
    
  ])


  React.useEffect(() => {
    accountService.allbetsdata().then((res: any) => {
      const bets = res?.data?.data?.bets || []
      setAllBets(bets)
  
      const report = prepareSportReport(
        bets,
        filter.startDate,
        filter.endDate,
        false
      )
  
      setItems(report)
    })
  }, [])
  
  

  const handleChange = (e: any) => {
    setFilter({ ...filter, [e.target.name]: e.target.value })
  }

  const handleSearch = (e: any) => {
    e.preventDefault()
  
    const report = prepareSportReport(
      allBets,
      filter.startDate,
      filter.endDate,
      false
    )
  
    setItems(report)
  }
  

  const handleLifetime = (e: any) => {
    e.preventDefault()
  
    const report = prepareSportReport(allBets, undefined, undefined, true)
    setItems(report)
  }
  

  const totalSum = items.reduce(
    (acc: number, it: any) => acc + (it.total || 0),
    0
  )
  
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
                    <button
  type="button"
  className='report-search-btn'
  onClick={handleLifetime}
>
  LIFETIME SEARCH
</button>

                  </div>
                </form>
              </div>

              <h4 style={{ margin: '10px 0' }}>Sports Details({moment(filter.startDate).format('DD/MM/YYYY')} - {moment(filter.endDate).format('DD/MM/YYYY')})</h4>

              <div className='report-table-wrapper'>
                <table className='report-table' style={{ minWidth: '400px'  }}>
                  <tbody>
                    {items.map((it, idx) => (
                      <tr key={idx}>
                        <td style={{ textAlign: 'left', paddingLeft: 20 }}>{it.name}</td>
                        <td
  style={{
    textAlign: 'center',
    fontWeight: 700,
    color: it.total >= 0 ? '#16a34a' : '#dc2626'
  }}
>
  {it.total.toFixed(2)}
</td>
                      </tr>
                    ))}
                    <tr>
                      <td style={{ textAlign: 'left', paddingLeft: 20, fontWeight: 700 }}>Total</td>
                      <td style={{ textAlign: 'center', color: '#dc2626', fontWeight: 700 }}>{totalSum}</td>
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

export default SportReport
