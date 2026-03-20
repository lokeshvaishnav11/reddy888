import React from 'react'
import { isMobile } from 'react-device-detect'
import CasinoListItem from './CasinoListItem'

import providersData from './providers.json'; 
import { CustomLink } from '../_layout/elements/custom-link';

const CasinoList = () => {
  const casinoWidth = isMobile ? 'col-3' : 'col-2'
  return (
    <>
      <div className='game-heading'>
        <span className='card-header-title'>Casino Games</span>
      </div>


      <div style={{overflowX:"scroll"}} className="rows d-flex mx-0 mt-0">
  {providersData?.map((item) => (
    <div
      key={item.id}
      className="col-4 col-md-3 px-1"
    >
      <div className="csn_thumb mb-2 mt-2">
        <CustomLink className='nav-link' style={{background:"#8000FF" , color:"white"}} to={`/casino-list-int/${item.id}`}>
          <span>
           {item.title}
            </span>
        </CustomLink>
      </div>
    </div>
  ))}
</div>

      

      

      <div className='col-12'>
        <div className='card-content home-page casino-list pt30 pb30'>
          <CasinoListItem />
        </div>
      </div>
    </>
  )
}
export default React.memo(CasinoList)
