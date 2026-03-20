import React from 'react'
import moment from 'moment'
import MarqueeAnnouncement from '../_layout/elements/marqueeAnnouncement'
import '../reports.css'
import { AxiosResponse } from 'axios'
import accountService from '../../../services/account.service'

const TopClients = () => {
  const [filter, setFilter] = React.useState({
    startDate: moment().subtract(3, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  })


  const prepareTopClients = (bets: any[], startDate: string, endDate: string) => {
    const start = moment(startDate).startOf('day')
    const end = moment(endDate).endOf('day')
  
    const filteredBets = bets.filter(bet =>
      moment(bet.updatedAt).isBetween(start, end, null, '[]')
    )
  
    const userMap: any = {}
  
    filteredBets.forEach(bet => {
      const username = bet.userName
      const pl = bet.profitLoss || 0
  
      if (!userMap[username]) {
        userMap[username] = {
          username,
          total: 0,
        }
      }
  
      userMap[username].total += pl
    })
  
    return Object.values(userMap).sort(
      (a: any, b: any) => b.total - a.total
    )
  }
  
  

  const [items, setItems] = React.useState<any[]>([])


  const [allBets, setAllBets] = React.useState<any[]>([])

React.useEffect(() => {
  accountService.allbetsdata().then((res: AxiosResponse) => {
    console.log('All Bets Data:', res.data);
    const bets = res?.data?.data?.bets || []
    setAllBets(bets)

    const topClients = prepareTopClients(
      bets,
      filter.startDate,
      filter.endDate
    )
    setItems(topClients)
  })
}, [])


  const handleChange = (e: any) => {
    setFilter({ ...filter, [e.target.name]: e.target.value })
  }

  const handleSearch = (e: any) => {
    e.preventDefault()
  
    const topClients = prepareTopClients(
      allBets,
      filter.startDate,
      filter.endDate
    )
  
    setItems(topClients)
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

              <h4 style={{ margin: '10px 0' }}>Top Clients Details({moment(filter.startDate).format('DD/MM/YYYY')} - {moment(filter.endDate).format('DD/MM/YYYY')})</h4>

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

export default TopClients
