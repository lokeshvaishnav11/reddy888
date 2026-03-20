import React from 'react'
import moment from 'moment'
import MarqueeAnnouncement from '../_layout/elements/marqueeAnnouncement'
import '../reports.css'
import accountService from '../../../services/account.service'

const WeeklyReport = () => {
  // ---------- helpers ----------
  const getLast7Dates = () => {
    const dates: string[] = []
    for (let i = 6; i >= 0; i--) {
      dates.push(moment().subtract(i, 'days').format('D-M-YYYY'))
    }
    return dates
  }

  const prepareWeeklyReport = (bets: any[]) => {
    const dates = getLast7Dates()

    const cricketMap: Record<string, number> = {}
    const casinoMap: Record<string, number> = {}

    dates.forEach(d => {
      cricketMap[d] = 0
      casinoMap[d] = 0
    })

    bets.forEach(bet => {
      const dateKey = moment(bet.updatedAt).format('D-M-YYYY')
      const pl = bet.profitLoss || 0

      if (!dates.includes(dateKey)) return

      if (bet.bet_on === 'FANCY' || bet.bet_on === 'Match_Odds') {
        cricketMap[dateKey] += pl
      }

      if (bet.bet_on === 'Casino') {
        casinoMap[dateKey] += pl
      }
    })

    return {
      dates,
      cricketRows: [
        {
          label: 'Total',
          values: dates.map(d => cricketMap[d]),
        },
      ],
      casinoRows: [
        {
          label: 'Total',
          values: dates.map(d => casinoMap[d]),
        },
      ],
    }
  }

  // ---------- state ----------
  const [dates, setDates] = React.useState<string[]>([])
  const [rows, setRows] = React.useState<any[]>([])
  const [casinoRows, setCasinoRows] = React.useState<any[]>([])

  // ---------- api ----------
  React.useEffect(() => {
    accountService.allbetsdata().then((res: any) => {
      const bets = res?.data?.data?.bets || []

      const report = prepareWeeklyReport(bets)

      setDates(report.dates)
      setRows(report.cricketRows)
      setCasinoRows(report.casinoRows)
    })
  }, [])

  // ---------- render ----------
  const renderTable = (title: string, data: any[]) => {
    const totalPerRow = (values: number[]) =>
      values.reduce((a, b) => a + b, 0)

    return (
      <>
        <h4 style={{ margin: '10px 0' }}>
          {title} ({dates[0]} - {dates[dates.length - 1]})
        </h4>

        <div className='report-table-wrapper'>
          <table
            className='report-table'
            style={{ minWidth: Math.max(600, 120 * (dates.length + 1)), minHeight:"20px" }}
          >
            <thead>
              <tr>
                <th></th>
                {dates.map((d, i) => (
                  <th key={i}>{d}</th>
                ))}
                <th>TOTAL</th>
              </tr>
            </thead>

            <tbody>
              {data.map((r: any, idx: number) => (
                <tr key={idx}>
                  <td style={{ textAlign: 'left', paddingLeft: 20 }}>
                    {r.label}
                  </td>

                  {r.values.map((v: number, j: number) => (
                    <td
                      key={j}
                      style={{
                        textAlign: 'center',
                        fontWeight: 700,
                        color: v >= 0 ? '#16a34a' : '#dc2626',
                      }}
                    >
                      {v}
                    </td>
                  ))}

                  <td
                    style={{
                      textAlign: 'center',
                      fontWeight: 700,
                      color:
                        totalPerRow(r.values) >= 0
                          ? '#16a34a'
                          : '#dc2626',
                    }}
                  >
                    {totalPerRow(r.values)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )
  }

  return (
    <>
      <MarqueeAnnouncement />
      <div style={{ paddingTop: '20px' }}>
        <div className='container-fluid report-page'>
          <div className='row'>
            <div className='col-md-12'>
              {renderTable('Weekly Report (Cricket)', rows)}
              <div style={{ height: 18 }} />
              {renderTable('Casino Details', casinoRows)}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default WeeklyReport
