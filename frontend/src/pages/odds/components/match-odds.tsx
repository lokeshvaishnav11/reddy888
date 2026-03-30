/* eslint-disable */
import IMarket, { OddsType } from '../../../models/IMarket'
import React, { MouseEvent } from 'react'
import IRunner from '../../../models/IRunner'
import { SocketContext } from '../../../context/webSocket'
import { AvailableToBackLay } from './available-to-back-lay'
import { betPopup } from '../../../redux/actions/bet/betSlice'
import { connect } from 'react-redux'
import PnlCalculate from './pnl-calculate'
// import { checkoddslength } from '../../../utils/helper'
import { isMobile } from 'react-device-detect'
import BookPopup from './fancy/book-popup'
import IMatch from '../../../models/IMatch'
import { setRules } from '../../../redux/actions/common/commonSlice'
import UserBookPopup from './user-book-popup'

interface Props {
  data: IMarket[]
  getMarketBook?: any
  bet?: any
  fancySelectionId?: any
  currentMatch?: IMatch
  setRules: (data: { open: boolean; type: string }) => void
  marketUserBookId?: any
}

class MatchOdds extends React.PureComponent<
  Props,
  {
    runnersData: any
    runnersDataPrev: any
    profitLoss: any
    getMarketBook: any
    remarkMarket: any
    runnersName: Record<string, string>
  }
> {
  static contextType = SocketContext
  context!: React.ContextType<typeof SocketContext>
  constructor(props: Props) {
    super(props)
    const selections: any = {}
    const profitLoss: any = {}
    const remarkMarket: any = {}
    let runnersName: any = {}
    props.data.forEach(async (market: IMarket) => {
      market.runners.forEach((runner: IRunner) => {
        runnersName = {
          ...runnersName,
          [market.marketId]: {
            ...runnersName[market.marketId],
            [runner.selectionId]: runner.runnerName,
          },
        }
        selections[market.marketId] = market
        profitLoss[runner.selectionId] = 0
      })
      remarkMarket[market.marketId] = ''
    })
    this.state = {
      runnersData: selections,
      runnersDataPrev: JSON.parse(JSON.stringify(selections)),
      profitLoss,
      getMarketBook: props.getMarketBook,
      remarkMarket: remarkMarket,
      runnersName: runnersName,
    }
  }

  componentDidMount(): void {
    this.socketEvents()
  }

  componentWillUnmount(): void {
    this.context.socket.off('getMarketData')
    this.leaveMarketRoom()
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps.data !== this.props.data) {
      this.socketEvents()
    }
  }

  socketEvents = () => {
    this.leaveMarketRoom()
    this.joinMarketRoom()
    this.getSocketEvents()
    this.context.socket.on('connect', () => {
      this.joinMarketRoom()
    })
    this.context.socket.on('reconnect', () => {
      this.joinMarketRoom()
    })
  }

  joinMarketRoom = () => {
    if (this.props.currentMatch) {
      this.context.socket.emit('joinRoom', this.props.currentMatch.matchId)
    }
    this.props.data.forEach(async (market: IMarket) => {
      this.context.socket.emit('joinMarketRoom', market.marketId)
    })
  }

  leaveMarketRoom = () => {
    this.props.data.forEach(async (market: IMarket) => {
      this.context.socket.emit('leaveRoom', market.marketId)
      this.context.socket.emit('leaveRoom', market.matchId)
    })
  }

  getSocketEvents = () => {
    const handler = (market: IMarket) => {
      this.setState((prev) => ({
        runnersData: { ...prev.runnersData, [market.marketId]: market },
      }))
    }
    this.context.socket.on('getMarketData', handler)
  }

  offplaylimit = (market: any) => {
    const inplayl =
      market.oddsType == OddsType.BM
        ? this.props.currentMatch?.inPlayBookMaxLimit
        : this.props.currentMatch?.inPlayMaxLimit
    const offplayl =
      market.oddsType == OddsType.BM
        ? this.props.currentMatch?.offPlayBookMaxLimit
        : this.props.currentMatch?.offPlayMaxLimit
    return this.props.currentMatch?.inPlay ? inplayl : offplayl
  }

  render(): React.ReactNode {
    const { data, getMarketBook } = this.props
    console.log(data ,"markkettjkdsatatat")
    const { runnersData } = this.state
    return (
      <div>
        {data &&
          data.map((market: IMarket) => {
            const selectionsPrev: any = {}
            const oddsData = runnersData ? runnersData[market.marketId] : null
            let setVisibleMarketStatus = true
            if (oddsData) {
              setVisibleMarketStatus = !!oddsData?.['runners']?.[0]?.ex
            }
            const classforheadingfirst =
              isMobile && market.oddsType != OddsType.BM ? 'box-6' : 'box-4'
            const classforheading = isMobile && market.oddsType != OddsType.BM ? 'box-2' : 'box-1'
            if (!setVisibleMarketStatus) return null
            return (
              <div key={market._id}>
                <div className='market-title mt-1' style={{background:"transparent" , color:"black"}} >
                 <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" className=" cursor-pointer" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><title>Add To Multi Markets</title><path d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"></path></svg> {market.marketName} <span style={{fontSize:"8px"}}>(Min:100 Max:10K)</span>
                 
                   
                  <a
                    href='#Bookmaker-market'
                    onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault()
                      this.props.setRules({
                        open: true,
                        type: market.oddsType === OddsType.BM ? 'Bookmaker' : market.oddsType,
                      })
                    }}
                    className='m-r-5 game-rules-icon'
                  >
                    <span>
                      <i className='fa fa-info-circle float-right' />
                    </span>
                  </a>
                  <span className='float-right m-r-10'>
                    {/* Maximum Bet <span>{this.offplaylimit(market)}</span> */}
                  </span>
                </div>
                <div className='table-header'>
                  <div className={`float-left country-name ${classforheadingfirst} min-max`} style={{fontWeight:"bolder"}}>
                    <b />Market
                  </div>
                  {(!isMobile && market.oddsType != OddsType.BM) ||
                    market.oddsType == OddsType.BM ? (
                    <>
                      <div className='box-1 float-left' style={{border:"none"}} />
                      <div className='box-1 float-left' style={{border:"none"}} />
                    </>
                  ) : (
                    ''
                  )}

                  <div className={`backd ${classforheading} float-left text-center`} style={{border:"none"}}>
                    <b style={{fontWeight:"bolder"}}>BACK</b>
                  </div>
                  <div className={`layd ${classforheading} float-left text-center`} style={{border:"none"}}>
                    <b style={{fontWeight:"bolder"}}>LAY</b>
                  </div>
                  {!isMobile ? (
                    <>
                      <div  className='box-1 float-left' />
                      <div className='box-1 float-left' />
                    </>
                  ) : (
                    ''
                  )}
                </div>
                {oddsData &&
                  oddsData?.runners
                    ?.sort((a: any, b: any) => a?.sortPriority - b?.sortPriority)
                    .map((runner: IRunner) => {
                      runner = {
                        ...runner,
                        runnerName: this.state.runnersName?.[market.marketId]?.[runner.selectionId],
                      }
                      return (
                        <div key={runner.selectionId}>
                          <div
                            data-title={runner.status}
                            className={`table-row ${runner.status === 'SUSPENDED' ? 'suspended' : ''
                              }`}
                          >
                            <div className={` country-name ${classforheadingfirst}`}>
                              <span className='team-name'>
                                <b>{runner.runnerName}</b>
                              </span>
                              <p>
                                {getMarketBook[`${market.marketId}_${runner.selectionId}`] ? (
                                  <span
                                    className={
                                      getMarketBook[`${market.marketId}_${runner.selectionId}`] > 0
                                        ? 'green'
                                        : 'blue'
                                    }
                                  >
                                    {getMarketBook[
                                      `${market.marketId}_${runner.selectionId}`
                                    ].toLocaleString()}
                                  </span>
                                ) : (
                                  <span className='' style={{ color: 'black' }}>
                                    {'0'}
                                  </span>
                                )}

                                <PnlCalculate
                                  marketId={market.marketId}
                                  selectionId={runner.selectionId}
                                />
                              </p>
                            </div>
                            <AvailableToBackLay
                              selections={runner.ex}
                              selectionsPrev={selectionsPrev}
                              market={market}
                              runner={runner}
                            />
                          </div>
                        </div>
                      )
                    })}
                {this.state.remarkMarket[market.marketId] ? (
                  <div className='table-remark text-right remark'>
                    {this.state.remarkMarket[market.marketId]}
                  </div>
                ) : (
                  ''
                )}
              </div>
            )
          })}
        {this.props.fancySelectionId && <BookPopup />}
        {this.props.marketUserBookId && <UserBookPopup />}
      </div>
    )
  }
}
const mapStateToProps = (state: any) => ({
  bet: state.betReducer.bet,
  getMarketBook: state.betReducer.userBookMarketList,
  fancySelectionId: state.betReducer.fancyMatchAndSelectionId,
  currentMatch: state.sportReducer.currentMatch,
  marketUserBookId: state.betReducer.marketBookAndSelectionId,
})

const actionCreators = {
  betPopup,
  setRules,
}
export default connect(mapStateToProps, actionCreators)(MatchOdds)
