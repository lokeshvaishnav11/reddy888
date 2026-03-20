import React from 'react'
import sportsService from '../../../services/sports.service'
import './sports.css'
import { AxiosResponse } from 'axios'
import ISport from '../../../models/ISport'
import { CustomLink } from '../../../pages/_layout/elements/custom-link'
import { useParams } from 'react-router-dom'
import mobileSubheader from '../_layout/elements/mobile-subheader'

const SportsPage = () => {
  const [sports, setSports] = React.useState<ISport[]>([])
  const [currentUrl, setCurrenUrl] = React.useState('matches')
  const { url } = useParams()

  React.useEffect(() => {
    if (url) setCurrenUrl(url!)
  }, [url])

  React.useEffect(() => {
    sportsService.getSports().then((res: AxiosResponse<{ data: ISport[] }>) => {
      setSports(res.data.data)
    })
  }, [])

  return (
    <>
      <div className='sports-settings-page'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='sports-header'>
                <h2>SPORT NAME</h2>
              </div>
              <div className='sports-list'>
                {sports?.filter((sport: any) => [4, 1, 2].includes(sport?.sportId))?.map((sport: ISport) => (
                  <div key={sport._id} className='sport-item'>
                    <CustomLink to={`/${currentUrl}/${sport.sportId}`} className='sport-link'>
                      {sport.name}
                    </CustomLink>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default SportsPage
