import React from 'react'
import MarqueeAnnouncement from '../_layout/elements/marqueeAnnouncement'
import '../reports.css'
import '../balance-sheet/balance-sheet.css'

const Export = () => {
  const [filter, setFilter] = React.useState<any>({
    type: 'Profit Loss',
    sport: 'All',
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFilter({ ...filter, [name]: value })
  }

  const handleExport = (e: any) => {
    e.preventDefault()
    // Placeholder: call backend to generate Excel
    alert(`Exporting ${filter.type} for ${filter.sport} from ${filter.startDate} to ${filter.endDate}`)
  }

  return (
    <>
      <MarqueeAnnouncement />
      <div style={{ paddingTop: 20 }}>
        <div className='container'>
          <div className='export-card'>
            <div className='export-card-inner'>
              <h3 className='export-title'>BTVIP1'S EXPORT OPTIONS</h3>
              <div className='export-notes'>
                <div style={{ color: '#dc2626' }}>* All time will be in IST(UTC +05:30)</div>
                <div style={{ color: '#dc2626' }}>* Max 15 Days Export Allowed</div>
              </div>

              <form onSubmit={handleExport} className='export-form'>
                <div className='export-row'>
                  <label>Select Type</label>
                  <select name='type' value={filter.type} onChange={handleChange}>
                    <option>Profit Loss</option>
                    <option>Account Statement</option>
                    <option>Top Clients</option>
                  </select>
                </div>

                <div className='export-row'>
                  <label>Select Sport</label>
                  <select name='sport' value={filter.sport} onChange={handleChange}>
                    <option>All</option>
                    <option>Cricket</option>
                    <option>Soccer</option>
                  </select>
                </div>

                <div className='export-row'>
                  <label>Start Date</label>
                  <input type='date' name='startDate' value={filter.startDate} onChange={handleChange} />
                </div>

                <div className='export-row'>
                  <label>End Date</label>
                  <input type='date' name='endDate' value={filter.endDate} onChange={handleChange} />
                </div>

                <div className='export-action'>
                  <button className='excel-btn' type='submit'>
                    <span style={{ marginRight: 8 }}>⬇️</span> EXCEL
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Export
