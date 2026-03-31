/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { Fragment } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import MyBetComponent from './my-bet.component'
import moment from 'moment'
import MatchOdds from './match-odds'
import PlaceBetBox from './place-bet-box'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { selectBetCount } from '../../../redux/actions/bet/betSlice'
import Fancy from './fancy'
import { useWebsocketUser } from '../../../context/webSocketUser'

const MatchDetailWrapper = (props: any) => {
  const dispatch = useAppDispatch()
  const betCount = useAppSelector(selectBetCount)
  const [tavstatus, settvstatus] = React.useState<boolean>(false)
  const { socketUser } = useWebsocketUser()

  // React.useEffect(() => {
  //   return () => {
  //     dispatch(setBetCount(0))
  //   }
  // }, [])

  return (
    <>
      <div className='prelative'>
        <div>
          <div >
            <div className='game-heading clsforellipse' style={{display:"flex", alignItems:"center", textAlign:"left", padding:"4px"}}>
              <span className='card-header-title giveMeEllipsi' style={{display:"flex",  flexDirection:"column", textAlign:"left", width:""

              }}>{props.currentMatch?.name}
              <span className='float-left card-header-date' >
                {moment(props.currentMatch?.matchDateTime).format('MM/DD/YYYY  h:mm a')}
              </span></span>
            </div>
            {props.scoreBoard()}
            {tavstatus && props.otherTv()}
            {props.t10Tv(250)}

            <div className='markets'>
              {/* Score Component Here */}
              <div className='main-market'>
                {props.markets && <MatchOdds data={props.markets} />}
              </div>
            </div>
            <br />
            {props.fancies && props.currentMatch && props.currentMatch.sportId == '4' && !String(props?.currentMatch?.matchId).startsWith('1313') && (
              <Fragment>
                {/* @ts-expect-error */}
                {<Fancy socketUser={socketUser} fancies={props.fancies} matchId={props.matchId!} />}
              </Fragment>
            )}
            {props.marketDataList.stake && <PlaceBetBox stake={props.marketDataList.stake} />}
             <div className='card-bodjy'>
                <MyBetComponent />
              </div>
          </div>
           {/* <Tab eventKey='profile' title={`Open Bets`}>
            <div className='card m-b-10 my-bet'>
              <div className='card-header'>
                <h6 className='card-title d-inline-block'>My Bet</h6>
              </div>
             
            </div>
          </Tab> */}
        </div>
        <div className='csmobileround' style={{ top: '16px' }}>
          <span onClick={() => settvstatus(tavstatus ? false : true)}>
            <i className='fa fa-tv'></i>{' '}
          </span>
        </div>
      </div>
    </>
  )
}

export default React.memo(MatchDetailWrapper)
