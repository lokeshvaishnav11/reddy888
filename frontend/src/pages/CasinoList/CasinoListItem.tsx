import React, { MouseEvent } from 'react'
import { isMobile } from 'react-device-detect'
import { selectCasinoMatchList } from '../../redux/actions/casino/casinoSlice'
import { useAppSelector } from '../../redux/hooks'
import ICasinoMatch from '../../models/ICasinoMatch'
import { useNavigateCustom } from '../_layout/elements/custom-link'
import { toast } from 'react-toastify'
import casinoService from '../../services/casino.service'
import authService from '../../services/auth.service'
import { AxiosResponse } from 'axios'

const CasinoListItem = (props: any) => {
  const gamesList = useAppSelector<any>(selectCasinoMatchList)
  const navigate = useNavigateCustom()
  const casinoWidth = isMobile ? 'col-3' : 'col11'
  const [gameUrl, setGameUrl] = React.useState<string>('')
  const [loadingGame, setLoadingGame] = React.useState(false);


  const onCasinoClick = (e: MouseEvent<HTMLAnchorElement>, Item: ICasinoMatch) => {
    e.preventDefault()
    if (!Item.isDisable && Item.match_id != -1) navigate.go(`/casino/${Item.slug}/${Item.match_id}`)
    else toast.warn('This game is suspended by admin, please try again later')
  }

  // const onIntcasinoClick = (e: MouseEvent<HTMLAnchorElement>, Item: any) => {
  //   e.preventDefault()
  //   // if (!Item.isDisable && Item.match_id!=-1 ) navigate.go(`/casino/${Item.slug}/${Item.match_id}`)
  //   //   else toast.warn('This game is suspended by admin, please try again later')
  //   const payload: any = {
  //     // gameCode: gamePlay.identifier,
  //     lobby_url: Item,
  //     ipAddress: authService.getIpAddress(),
  //     isMobile: isMobile,
  //   }
  //   casinoService.getplaycasinotwo(payload).then((res: AxiosResponse<any>) => {
  //     setGameUrl(res.data.data.url)
  //   })

  // }
  const onIntcasinoClick = (e: MouseEvent<HTMLAnchorElement>, Item: any) => {
  e.preventDefault();

  setLoadingGame(true);   // <<-- LOADING START

  const payload: any = {
    lobby_url: Item,
    ipAddress: authService.getIpAddress(),
    isMobile: isMobile,
  }

  casinoService.getplaycasinotwo(payload)
    .then((res: AxiosResponse<any>) => {
      setGameUrl(res.data.data.url);
    })
    .finally(() => {
      setLoadingGame(false);   // <<-- LOADING STOP
    });
}

// React.useEffect(() => {
//   if (gameUrl) {
//     window.open(gameUrl, "_blank");
//   }
// }, [gameUrl]);



  const MacJson = [
  //    {
  //   "name": "Aviator",
  //   "gameId": 860001,
  //   "provider": "SPRIBE",
  //   "game_group": "Others",
  //   "image": "https://cdn.dreamcasino.live/sbe_aviator.webp",
  //   "game_free_spin": 0,
  //   "game_slot_status": false,
  //   "game_status": "active",
  //   "game_category": "Others"
  // },
    {
      "gameId": 150001,
      "name": "Dragon Tiger",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/dt_mac88.webp",
      "code": "MAC88-YDT102"
    },
    {
      "gameId": 150002,
      "name": "Bacarrat",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/baccarat_mac88.webp",
      "code": "MAC88-XBAC101"
    },
    {
      "gameId": 150003,
      "name": "Sic Bo",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/sicbo_mac88.webp",
      "code": "MAC88-XSB101"
    },
    {
      "gameId": 150004,
      "name": "Roulette",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/roulette_mac88.webp",
      "code": "MAC88-XRT101"
    },
    {
      "gameId": 150005,
      "name": "Poker 20-20",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/20_20_poker.webp",
      "code": "MAC88-XPOK101"
    },
    {
      "gameId": 150006,
      "name": "Lucky7",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/lucky_7.webp",
      "code": "MAC88-YLK7101"
    },
    {
      "gameId": 150007,
      "name": "Andar Bahar",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/andar_bahar.webp",
      "code": "MAC88-XAB101"
    },
    {
      "gameId": 150009,
      "name": "Teenpatti One Day",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/tp1d.webp",
      "code": "MAC88-X1TP101"
    },
    {
      "gameId": 150010,
      "name": "32 Cards",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/32_cards.webp",
      "code": "MAC88-Y32CA102"
    },
    {
      "gameId": 150013,
      "name": "DTL",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/dtl_20_20.webp",
      "code": "MAC88-YDTL101"
    },
    {
      "gameId": 150014,
      "name": "Amar Akbar Anthony",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/amar_akbar_anthony.webp",
      "code": "MAC88-YA3101"
    },
    {
      "gameId": 150015,
      "name": "3 Cards Judgement",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/3cj.webp",
      "code": "MAC88-X3CJ101"
    },
    {
      "gameId": 150016,
      "name": "Queen Race",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/queen.webp",
      "code": "MAC88-YQR102"
    },
    {
      "gameId": 150017,
      "name": "Race 20",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/race_20.webp",
      "code": "MAC88-YRTT102"
    },
    {
      "gameId": 150018,
      "name": "Casino War",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/casino_war.webp",
      "code": "MAC88-XCAW101"
    },
    {
      "gameId": 150019,
      "name": "Worli Matka",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/worli_matka.webp",
      "code": "MAC88-YWM102"
    },
    {
      "gameId": 150020,
      "name": "Lottery",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/lottery.webp",
      "code": "MAC88-XLOT101"
    },
    {
      "gameId": 150023,
      "name": "Test Teenpatti",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/teenpatti_test.webp",
      "code": ""
    },
    {
      "gameId": 150025,
      "name": "Trio",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/trio.webp",
      "code": ""
    },
    {
      "gameId": 150026,
      "name": "29 Baccarat",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/29b.webp",
      "code": ""
    },
    {
      "gameId": 150028,
      "name": "Two Card Teenpatti",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/2_cards_teenpatti.webp",
      "code": ""
    },
    {
      "gameId": 150030,
      "name": "Muflis Teenpatti",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/muflis_teenpati.webp",
      "code": ""
    },
    {
      "gameId": 150031,
      "name": "Bollywood Casino B",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/bollywood_casino.webp",
      "code": ""
    },
    {
      "gameId": 150032,
      "name": "Poker 1-Day",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/poker_1_day.webp",
      "code": ""
    },
    {
      "gameId": 150033,
      "name": "20-20 Teenpatti",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/20_20_teenpatti.webp",
      "code": ""
    },
    {
      "gameId": 150034,
      "name": "Super Over",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/super_over.webp",
      "code": ""
    },
    {
      "gameId": 150035,
      "name": "5 Five Cricket",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/5_five_cricket.webp",
      "code": ""
    },
    {
      "gameId": 150036,
      "name": "1 Day Dragon Tiger",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/dt_1day.webp",
      "code": ""
    },
    {
      "gameId": 150037,
      "name": "Dus Ka Dum",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/10kadum.webp",
      "code": ""
    },
    {
      "gameId": 150038,
      "name": "One Card 20 20",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/1_card_20_20.webp",
      "code": ""
    },
    {
      "gameId": 150039,
      "name": "One Card Meter",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/1_card_meter.webp",
      "code": ""
    },
    {
      "gameId": 150040,
      "name": "One Card One Day",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/1c1d.webp",
      "code": ""
    },
    {
      "gameId": 150041,
      "name": "6 Player Poker",
      "type": "Poker",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/6pp.webp",
      "code": ""
    },
    {
      "gameId": 150042,
      "name": "Instant 2 Cards Teenpatti",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/2_card_tp.webp",
      "code": ""
    },
    {
      "gameId": 150043,
      "name": "Race to 17",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/race_17.webp",
      "code": ""
    },
    {
      "gameId": 150045,
      "name": "Note Number",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/notenumber.webp",
      "code": ""
    },
    {
      "gameId": 150046,
      "name": "Cricket Match 20-20",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/cricket2020.webp",
      "code": ""
    }, {
      "gameId": 150048,
      "name": "Race to 2nd",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/race_2.webp",
      "code": "MAC88-X1RTS101"
    },
    {
      "gameId": 150049,
      "name": "Open Teen patti",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/open_teen_patti.webp",
      "code": "MAC88-YOTP101"
    },
    {
      "gameId": 150051,
      "name": "High Low",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/high_low.webp",
      "code": "MAC88-YHL101"
    },
    {
      "gameId": 150052,
      "name": "Baccarat One Day",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/baccarat_one_day.webp",
      "code": "MAC88-Y1BAC101"
    },
    {
      "gameId": 150053,
      "name": "10 - 10 cricket",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/10_10_cricket.webp",
      "code": "MAC88-YXC101"
    },
    {
      "gameId": 150054,
      "name": "Muflis Teenpatti",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/mtp.webp",
      "code": "MAC88-ZMTP101"
    },
    {
      "gameId": 150055,
      "name": "Instant worli",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/iw.webp",
      "code": "MAC88-ZIW101"
    },
    {
      "gameId": 150056,
      "name": "Instant Teen Patti",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/itp.webp",
      "code": "MAC88-ZITP101"
    },
    {
      "gameId": 150057,
      "name": "Andar Bahar 50",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/ab50.webp",
      "code": "MAC88-ZABL101"
    },
    {
      "gameId": 150058,
      "name": "Super Over",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/so.webp",
      "code": "MAC88-ZSP101"
    },
    {
      "gameId": 150059,
      "name": "Center card",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/cc.webp",
      "code": "MAC88-ZCC101"
    },
    {
      "gameId": 150062,
      "name": "Football Studio",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/fs.webp",
      "code": "MAC88-ZFBS101"
    },
    {
      "gameId": 150063,
      "name": "Dream Wheel",
      "type": "Live Game Shows",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/dw.webp",
      "code": "MAC88-ZDC101"
    },
    {
      "gameId": 150066,
      "name": "20 20 Teenpatti 2",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/2020tp2.webp",
      "code": "MAC88-TPTT2101"
    },
    {
      "gameId": 150067,
      "name": "Dragon Tiger 2",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/dt2.webp",
      "code": "MAC88-DT2101"
    },
    {
      "gameId": 150068,
      "name": "Lucky 5",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/lucky5.webp",
      "code": "MAC88-XLK5101"
    },
    {
      "gameId": 150070,
      "name": "AK47 Teenpatti",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/ak47tp.webp",
      "code": "MAC88-XAK47101"
    },
    {
      "gameId": 150071,
      "name": "Teenpatti Joker 20-20",
      "type": "Live",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.mac88.com/mac88/TPJ2020.webp",
      "code": "MAC88-XJTP101"
    },
    {
      "gameId": 150073,
      "name": "Turbo Auto Roulette",
      "type": "Live Roulette",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/turbo_roulette.webp",
      "code": "MAC88-XTRT101"
    },
    {
      "gameId": 150074,
      "name": "Speed Auto Roulette",
      "type": "Live Roulette",
      "provider": "MAC88",
      "company": "Mac88 Gaming",
      "image": "https://cdn.dreamdelhi.com/mac88/auto_roulette.webp",
      "code": "MAC88-XSART101"
    },
    {
      "gameId": 150599,
      "name": "MAC Excite Lobby",
      "type": "Lobby",
      "provider": "MAC88",
      "company": "MAC Excite",
      "image": "https://cdn.dreamdelhi.com/macexcite/lobby_macexcite.webp",
      "code": "MI-LOBBY"
    },
    {
      "gameId": 150600,
      "name": "Dragon Tiger",
      "type": "Live",
      "provider": "MAC88",
      "company": "MAC Excite",
      "image": "https://cdn.dreamdelhi.com/macexcite/dt.webp",
      "code": "ME-BDT101"
    },
    {
      "gameId": 150601,
      "name": "Baccarat",
      "type": "Live",
      "provider": "MAC88",
      "company": "MAC Excite",
      "image": "https://cdn.dreamdelhi.com/macexcite/baccarat.webp",
      "code": "ME-BBAC101"
    },
    {
      "gameId": 150602,
      "name": "Sic Bo",
      "type": "Live",
      "provider": "MAC88",
      "company": "MAC Excite",
      "image": "https://cdn.dreamdelhi.com/macexcite/sb.webp",
      "code": "ME-BSB101"
    },
    {
      "gameId": 150603,
      "name": "Roulette",
      "type": "Live",
      "provider": "MAC88",
      "company": "MAC Excite",
      "image": "https://cdn.dreamdelhi.com/macexcite/roulette.webp",
      "code": "ME-BRT101"
    },
    {
      "gameId": 150604,
      "name": "Poker 20-20",
      "type": "Live",
      "provider": "MAC88",
      "company": "MAC Excite",
      "image": "https://cdn.dreamdelhi.com/macexcite/2020poker.webp",
      "code": "ME-BPOK101"
    },
    {
      "gameId": 150605,
      "name": "Lucky 7",
      "type": "Live",
      "provider": "MAC88",
      "company": "MAC Excite",
      "image": "https://cdn.dreamdelhi.com/macexcite/l7.webp",
      "code": "ME-BLK7101"
    },
    {
      "gameId": 150606,
      "name": "Andar Bahar",
      "type": "Live",
      "provider": "MAC88",
      "company": "MAC Excite",
      "image": "https://cdn.dreamdelhi.com/macexcite/ab.webp",
      "code": "ME-BAB101"
    },
    {
      "gameId": 150607,
      "name": "Teenpatti One Day",
      "type": "Live",
      "provider": "MAC88",
      "company": "MAC Excite",
      "image": "https://cdn.dreamdelhi.com/macexcite/tp1d.webp",
      "code": "ME-B1TP101"
    },
    {
      "gameId": 150608,
      "name": "32 Cards",
      "type": "Live",
      "provider": "MAC88",
      "company": "MAC Excite",
      "image": "https://cdn.dreamdelhi.com/macexcite/32c.webp",
      "code": "ME-B32CA102"
    }
  ]

  const jiliJson = [
  {
    "gameId": 600001,
    "name": "Royal Fishing",
    "type": "Fish Shooting",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Royal_Fishing.webp",
    "code": "JiLi-600001"
  },
  {
    "gameId": 600002,
    "name": "Bombing Fishing",
    "type": "Fish Shooting",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Bombing_Fishing.webp",
    "code": "JiLi-600002"
  },
  {
    "gameId": 600003,
    "name": "Dinosaur Tycoon",
    "type": "Fish Shooting",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Dinosaur_Tycoon.webp",
    "code": "JiLi-600003"
  },
  {
    "gameId": 600004,
    "name": "Jackpot Fishing",
    "type": "Fish Shooting",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Jackpot_Fishing.webp",
    "code": "JiLi-600004"
  },
  {
    "gameId": 600005,
    "name": "Dragon Fortune",
    "type": "Fish Shooting",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Dragon_Fortune.webp",
    "code": "JiLi-600005"
  },
  {
    "gameId": 600006,
    "name": "Mega Fishing",
    "type": "Fish Shooting",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://hx-app-assets.s3.eu-west-2.amazonaws.com/gap_casino/jili/Jili_Mega_Fishing.jpg",
    "code": "JiLi-600006"
  },
  {
    "gameId": 600007,
    "name": "Boom Legend",
    "type": "Fish Shooting",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Boom_Legend.webp",
    "code": "JiLi-600007"
  },
  {
    "gameId": 600008,
    "name": "Happy Fishing",
    "type": "Fish Shooting",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Happy_Fishing.webp",
    "code": "JiLi-600008"
  },
  {
    "gameId": 600011,
    "name": "TeenPatti",
    "type": "Live Popular",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Teen_Patti.webp",
    "code": "JiLi-600011"
  },
  {
    "gameId": 600012,
    "name": "AK47",
    "type": "Live Popular",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_AK47.webp",
    "code": "JiLi-600012"
  },
  {
    "gameId": 600013,
    "name": "Andar Bahar",
    "type": "Live Popular",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Andar_Bahar.webp",
    "code": "JiLi-600013"
  },
  {
    "gameId": 600014,
    "name": "Rummy",
    "type": "Live Popular",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Rummy.webp",
    "code": "JiLi-600014"
  },
  {
    "gameId": 600015,
    "name": "Number King",
    "type": "Live Popular",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Number_King.webp",
    "code": "JiLi-600015"
  },
  {
    "gameId": 600016,
    "name": "Poker King",
    "type": "Live Popular",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Poker_King.webp",
    "code": "JiLi-600016"
  },
  {
    "gameId": 600018,
    "name": "Gem Party",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Gem_Party.webp",
    "code": "JiLi-600018"
  },
  {
    "gameId": 600019,
    "name": "Hot Chilli",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Hot_Chilli.webp",
    "code": "JiLi-600019"
  },
  {
    "gameId": 600020,
    "name": "Chin Shi Huang",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Chin_Shj_Huang.webp",
    "code": "JiLi-600020"
  },
  {
    "gameId": 600021,
    "name": "War Of Dragons",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_War_of_Drangons.webp",
    "code": "JiLi-600021"
  },
  {
    "gameId": 600022,
    "name": "Fortune Tree",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Fortune_Tree.webp",
    "code": "JiLi-600022"
  },
  {
    "gameId": 600023,
    "name": "Lucky Ball",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Lucky_Ball.webp",
    "code": "JiLi-600023"
  },
  {
    "gameId": 600024,
    "name": "Hyper Burst",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Hyper_Burst.webp",
    "code": "JiLi-600024"
  },
  {
    "gameId": 600025,
    "name": "Shanghai Beauty",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Shanghai_Beauty.webp",
    "code": "JiLi-600025"
  },
  {
    "gameId": 600026,
    "name": "Fa Fa Fa",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_FaFaFa.webp",
    "code": "JiLi-600026"
  },
  {
    "gameId": 600027,
    "name": "God Of Martial",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_God_of_Martial.webp",
    "code": "JiLi-600027"
  },
  {
    "gameId": 600028,
    "name": "SevenSevenSeven",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_777.webp",
    "code": "JiLi-600028"
  },
  {
    "gameId": 600029,
    "name": "Crazy777",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Crazy_777.webp",
    "code": "JiLi-600029"
  },
  {
    "gameId": 600030,
    "name": "Bubble Beauty",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Bubble_Beauty.webp",
    "code": "JiLi-600030"
  },
  {
    "gameId": 600031,
    "name": "Bao boon chin",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Bao_Boon_Chin.webp",
    "code": "JiLi-600031"
  },
  {
    "gameId": 600032,
    "name": "Crazy FaFaFa",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Crazy_fafafa.webp",
    "code": "JiLi-600032"
  },
  {
    "gameId": 600033,
    "name": "XiYangYang",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Xiyangyang.webp",
    "code": "JiLi-600033"
  },
  {
    "gameId": 600034,
    "name": "FortunePig",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Fortune_Pig.webp",
    "code": "JiLi-600034"
  },
  {
    "gameId": 600035,
    "name": "Candy Baby",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Candy_Baby.webp",
    "code": "JiLi-600035"
  },
  {
    "gameId": 600036,
    "name": "Fengshen",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://hx-app-assets.s3.eu-west-2.amazonaws.com/gap_casino/jili/Jili_Feng_Shen.jpg",
    "code": "JiLi-600036"
  },
  {
    "gameId": 600037,
    "name": "Crazy Golden Bank",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Crazy_Golden_Bank.webp",
    "code": "JiLi-600037"
  },
  {
    "gameId": 600038,
    "name": "Lucky Goldbricks",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Lucky_Goldbricks.webp",
    "code": "JiLi-600038"
  },
  {
    "gameId": 600039,
    "name": "Dragon Treasure",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Dragon_Treasure.webp",
    "code": "JiLi-600039"
  },
  {
    "gameId": 600040,
    "name": "Charge Buffalo",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Charge_Buffalo.webp",
    "code": "JiLi-600040"
  },
  {
    "gameId": 600041,
    "name": "Super Ace",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Super_Ace.webp",
    "code": "JiLi-600041"
  },
  {
    "gameId": 600042,
    "name": "Golden Queen",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Golden_Queen.webp",
    "code": "JiLi-600042"
  },
  {
    "gameId": 600043,
    "name": "Monkey Party",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://hx-app-assets.s3.eu-west-2.amazonaws.com/gap_casino/jili/Jili_Monkey_Party.jpg",
    "code": "JiLi-600043"
  },
  {
    "gameId": 600044,
    "name": "Money Coming",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Money_Coming.webp",
    "code": "JiLi-600044"
  },
  {
    "gameId": 600045,
    "name": "Jungle King",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Jungle_King.webp",
    "code": "JiLi-600045"
  },
  {
    "gameId": 600046,
    "name": "Boxing King",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Boxing_King.webp",
    "code": "JiLi-600046"
  },
  {
    "gameId": 600047,
    "name": "Secret Treasure",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Secret_Treasure.webp",
    "code": "JiLi-600047"
  },
  {
    "gameId": 600048,
    "name": "Pharaoh Treasure",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Pharaoh_Treasure.webp",
    "code": "JiLi-600048"
  },
  {
    "gameId": 600049,
    "name": "Lucky Coming",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Lucky_Coming.webp",
    "code": "JiLi-600049"
  },
  {
    "gameId": 600050,
    "name": "Super Rich",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Super_Rich.webp",
    "code": "JiLi-600050"
  },
  {
    "gameId": 600051,
    "name": "RomaX",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://hx-app-assets.s3.eu-west-2.amazonaws.com/gap_casino/jili/Jili_Roma_X.jpg",
    "code": "JiLi-600051"
  },
  {
    "gameId": 600052,
    "name": "Golden Empire",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Golden_Empire.webp",
    "code": "JiLi-600052"
  },
  {
    "gameId": 600053,
    "name": "Fortune Gems",
    "type": "Video Slots",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_Fortune_Gems.webp",
    "code": "JiLi-600053"
  },
  {
    "gameId": 600056,
    "name": "All-star Fishing",
    "type": "Fish Shooting",
    "provider": "JiLi",
    "company": "JiLi Gaming",
    "image": "https://cdn.dreamcasino.live/jili/Jili_All_Star_Fishing.webp",
    "code": "JiLi-600056"
  }
]


  return (
    <>

   

    {loadingGame && <div className="fullscreen-loader">
    <div className="loader-card">
      <div className="spinner"></div>
      <div className="loader-text">Loading Casino…</div>
    </div>
  </div>}



    {gameUrl&&(<div className="slot-iframe show">
   
          <iframe scrolling="no" allow="fullscreen;" src={gameUrl} style={{width:"100%",border:"0px",height:"100%"}}></iframe>
      </div>)}

      


      {/* {gamesList &&
            gamesList
            .filter((item: any) => !item.isDisable && item.match_id !== -1)
            .map((Item: any, key: number) => {
              return (
                <div className={"casino-list-item"} key={key}>
                  <a href='#' onClick={(e) => onCasinoClick(e, Item)} className=''>
                      <div className="casino-list-item-banner" 
                        style={{ backgroundImage: `url(${Item.image})`}}>
                      </div>
                      <div className='casino-list-name'>{Item.title}</div>
               
                  </a>
                </div>
              )
            })} */}


        

            
      {MacJson &&
        MacJson
          .filter((item) => item.code !== "") // agar blank code wale nahi dikhane
          .map((Item, key) => {
            return (
              <div className="casino-list-item">
                <a
                  href="#"
                  onClick={(e) => onIntcasinoClick(e, Item.gameId)}
                >
                  <div
                    className="casino-list-item-banner"
                    style={{ backgroundImage: `url(${Item.image})` }}
                  ></div>

                  <div className="casino-list-name">{Item.name}</div>
                </a>
              </div>
            );
          })}


          

    </>
  )
}
export default React.memo(CasinoListItem)
