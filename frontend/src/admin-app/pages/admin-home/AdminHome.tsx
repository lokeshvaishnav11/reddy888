import { AxiosResponse } from 'axios'
import React, { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import LMatch from '../../../models/LMatch'
import sportsServices from '../../../services/sports.service'
import ISport from '../../../models/ISport'
import { useAppSelector } from '../../../redux/hooks'
import { selectSportList, setCurrentMatch } from '../../../redux/actions/sports/sportSlice'
import IMatch from '../../../models/IMatch'
import { useDispatch } from 'react-redux'
import { useNavigateCustom } from '../../../pages/_layout/elements/custom-link'
import { useWebsocket } from '../../../context/webSocket'
import './admin-home.css'

const AdminHome = () => {
  const [matchList, setMatchList] = React.useState<LMatch[]>([])
  const sportListState = useAppSelector<{ sports: ISport[] }>(selectSportList)
  const navigate = useNavigateCustom()
  const dispatch = useDispatch()
  const { socket } = useWebsocket()
  const [odds, setOdds] = React.useState<Record<string, Array<any>>>({})
  const [selectedSport, setSelectedSport] = React.useState<string>('4') // Default to Cricket

  const { sportId, status } = useParams()

  // Filter sports to show only Cricket (4), Tennis (2), and Soccer (1)
  const filteredSports = React.useMemo(() => {
    return sportListState.sports.filter((sport: ISport) => 
      sport.sportId && [1, 2, 4].includes(sport.sportId)
    ).sort((a, b) => {
      const order: any = { 4: 1, 2: 2, 1: 3 } // Cricket, Tennis, Soccer
      return order[a.sportId || 0] - order[b.sportId || 0]
    })
  }, [sportListState.sports])

  React.useEffect(() => {
    const currentSportId = sportId || selectedSport
    sportsServices.getMatchList(currentSportId, status).then((res: AxiosResponse<any>) => {
      const oddsData = { ...odds }
      marketIdsEvent(res.data.data, oddsData, 'joinMarketRoom')
      setOdds(oddsData)
      setMatchList(res.data.data)
    })
    return () => {
      const oddsData = { ...odds }
      marketIdsEvent(matchList, oddsData, 'leaveMarketRoom')
    }
  }, [sportId, status, selectedSport])

  React.useEffect(() => {
    socket.on('getMarketData', (marketData) => {
      let firstIndexFirst = '-'
      let firstIndexTwo = '-'
      let secIndexFirst = '-'
      let secfirstIndexTwo = '-'
      let thirdIndexFirst = '-'
      let thirdfirstIndexTwo = '-'

      if (marketData.runners) {
        if (marketData.runners[0] && marketData.runners[0].ex.availableToBack[0]) {
          firstIndexFirst = marketData.runners[0].ex.availableToBack[0].price
          firstIndexTwo = marketData.runners[0].ex.availableToLay[0].price
        }

        if (marketData.runners[1] && marketData.runners[1].ex.availableToBack[0]) {
          secIndexFirst = marketData.runners[1].ex.availableToBack[0].price
          secfirstIndexTwo = marketData.runners[1].ex.availableToLay[0].price
        }

        if (marketData.runners[2] && marketData.runners[2].ex.availableToBack[0]) {
          thirdIndexFirst = marketData.runners[2].ex.availableToBack[0].price
          thirdfirstIndexTwo = marketData.runners[2].ex.availableToLay[0].price
        }
      }

      setOdds((prevOdds) => ({
        ...prevOdds,
        [marketData.marketId]: [
          firstIndexFirst,
          firstIndexTwo,
          thirdIndexFirst,
          thirdfirstIndexTwo,
          secIndexFirst,
          secfirstIndexTwo,
        ],
      }))
    })

    return () => {
      socket.off('getMarketData')
    }
  }, [odds])

  const memoOdds = useCallback(
    (marketId: any) => {
      if (!marketId) {
        return (
          <>
            <td><button className="back"><span className="odd">-</span></button></td>
            <td><button className="lay"><span className="odd">-</span></button></td>
            <td><button className="back"><span className="odd">-</span></button></td>
            <td><button className="lay"><span className="odd">-</span></button></td>
            <td><button className="back"><span className="odd">-</span></button></td>
            <td><button className="lay"><span className="odd">-</span></button></td>
          </>
        )
      }
      const marketData = odds[marketId]
      return (
        <>
          <td>
            <button className='back'>
              <span className='odd'>{marketData && marketData[0] || '-'}</span>
            </button>
          </td>
          <td>
            <button className='lay'>
              <span className='odd'>{marketData && marketData[1] || '-'}</span>
            </button>
          </td>
          <td>
            <button className='back'>
              <span className='odd'>{marketData && marketData[2] || '-'}</span>
            </button>
          </td>
          <td>
            <button className='lay'>
              <span className='odd'>{marketData && marketData[3] || '-'}</span>
            </button>
          </td>
          <td>
            <button className='back'>
              <span className='odd'>{marketData && marketData[4] || '-'}</span>
            </button>
          </td>
          <td>
            <button className='lay'>
              <span className='odd'>{marketData && marketData[5] || '-'}</span>
            </button>
          </td>
        </>
      )
    },
    [odds],
  )

  const marketIdsEvent = (data: any, oddsData: any, event: string) => {
    data.map((match: IMatch) => {
      match.markets?.map((market) => {
        if (market.marketName == 'Match Odds' && !odds[market.marketId]) {
          // Initialize odds
        }
        setTimeout(() => {
          socket.emit(event, market.marketId)
        }, 200)
      })
    })
  }

  const currentMatch = (match: IMatch) => {
    dispatch(setCurrentMatch(match))
    navigate.go(`/odds/${match.matchId}`)
  }

  const handleSportChange = (sportIdParam: number | undefined) => {
    if (sportIdParam) {
      const sportIdStr = sportIdParam.toString()
      setSelectedSport(sportIdStr)
      navigate.go(`/home/match/${sportIdStr}`)
    }
  }

  console.log(filteredSports,"sportsss")

  return (
    <div className='admin-home-page'>
      <div className='admin-home-container'>
        {/* Left Sidebar - Sports List */}
        <div className='sports-sidebar'>
          {filteredSports.map((sport: ISport) => (
            <div
              key={sport.sportId}
              className={`sport-item ${(sportId || selectedSport) === sport.sportId?.toString() ? 'active' : ''}`}
              onClick={() => handleSportChange(sport.sportId)}
            >
              <div className='sport-icon'>
                {sport.sportId === 4 && '🏏'}
                {sport.sportId === 2 && '🎾'}
                {sport.sportId === 1 && '⚽'}
              </div>
              <div className='sport-name'>{sport?.name}</div>
              {/* <div className='sport-count'>{sport?.marketCount?.toString() || '0'}</div> */}
            </div>
          ))}
        </div>

        {/* Right Content - Match List */}
        <div className='matches-content'>
          <div className='content-header'>
            <h2>{filteredSports.find(s => s.sportId?.toString() === (sportId || selectedSport))?.name?.toUpperCase() || 'CRICKET'}</h2>
          </div>

          <div className='admin-match-list'>
            {matchList.length > 0 ? (
              <table className='matches-table'>
                <thead>
                  <tr>
                    <th className='match-info-header'>Match</th>
                    <th colSpan={2}>1</th>
                    <th colSpan={2}>X</th>
                    <th colSpan={2}>2</th>
                  </tr>
                </thead>
                <tbody>
                  {matchList.map((match: IMatch) => {
                    const market = match.markets?.find((m) => m.marketName === 'Match Odds')
                    return (
                      <tr key={match.matchId} onClick={() => currentMatch(match)} className='match-row'>
                        <td className='match-info'>
                          <div className='match-name'>{match?.name}</div>
                          <div className='match-date'>{new Date(match?.matchDateTime).toLocaleString()}</div>
                        </td>
                        {memoOdds(market?.marketId)}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <div className='no-matches'>No matches available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHome
