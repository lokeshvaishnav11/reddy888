import React, { ChangeEvent, MouseEvent, useRef } from 'react'
import User from '../../../models/User'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { logout, selectUserData } from '../../../redux/actions/login/loginSlice'
import NavMenu from './nav-menu'
import {
  hideBalExp,
  HideBalExp,
  selectBalance,
  selectHideBalExp,
  setExposer,
  setSingleBal,
} from '../../../redux/actions/balance/balanceSlice'
import { CustomLink, useNavigateCustom } from './custom-link'
import { isMobile } from 'react-device-detect'
import Marqueemessge from '../../../admin-app/pages/_layout/elements/welcome'
import NavMobileMenu from './nav-mobile-menu'
import axios, { AxiosResponse } from 'axios'
import { CONSTANTS } from '../../../utils/constants'
import userService from '../../../services/user.service'
import ReactModal from 'react-modal'
import { useWebsocketUser } from '../../../context/webSocketUser'
import Rules from '../../Rules/rules'
import { selectRules } from '../../../redux/actions/common/commonSlice'
import AutocompleteComponent from '../../../components/AutocompleteComponent'
import matchService from '../../../services/match.service'
import IMatch from '../../../models/IMatch'
import casinoSlugs from '../../../utils/casino-slugs.json'
import UserService from "../../../services/user.service";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { title } from 'process'




const Header = () => {
// const isMobile = true

  const ref = useRef<any>(null)
  const ref2 = useRef<any>(null)

  const userState = useAppSelector<{ user: User }>(selectUserData)
  const balance = useAppSelector(selectBalance)
  const selectHideBal = useAppSelector<HideBalExp>(selectHideBalExp)
  const rules = useAppSelector(selectRules)
  const dispatch = useAppDispatch()

  const navigate = useNavigateCustom()

  const { socketUser } = useWebsocketUser()

  const [showMenu, setShowMenu] = React.useState<boolean>(false)
  const [showSideB, setShowSideB] = React.useState<boolean>(false)

  const [showAuto, setShowAuto] = React.useState<boolean>(false)

  const [userMessage, setUserMessage] = React.useState<string>('')

  const [hideExpBal, setHideExpBal] = React.useState<HideBalExp>({} as HideBalExp)

  const [isOpen, setIsOpen] = React.useState<any>(false)
  const [isOpenRule, setIsOpenRule] = React.useState<any>(false)
  const [getExposerEvent, setGetExposerEvent] = React.useState<any>([])

  // React.useEffect(() => {
  //   axios.get(`userMessage.json?v=${Date.now()}`).then((res: AxiosResponse) => {
  //     setUserMessage(res.data.message)
  //   })
  // }, [])

  React.useEffect(() => {
    setIsOpenRule(rules.open)
  }, [rules])

  React.useEffect(() => {
    const handlerExposer = ({ exposer, balance }: any) => {
      if (balance !== undefined) dispatch(setSingleBal(balance))
      if (exposer !== undefined) dispatch(setExposer(exposer))
    }
    socketUser.on('updateExposer', handlerExposer)

    return () => {
      socketUser.removeListener('updateExposer', handlerExposer)
    }
  }, [balance])

  React.useEffect(() => {
    setHideExpBal(selectHideBal)
  }, [selectHideBal])

  const logoutUser = (e: any) => {
    e.preventDefault()
    dispatch(logout())
    navigate.go('/login')
  }

  const onChangeBalExp = (e: ChangeEvent<HTMLInputElement>) => {
    const expBal = { ...hideExpBal, [e.target.name]: e.target.checked }
    dispatch(hideBalExp(expBal))
    localStorage.setItem(CONSTANTS.HIDE_BAL_EXP, JSON.stringify(expBal))
    setHideExpBal(expBal)
  }

  const getExposer = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setIsOpen(true)
    userService.getExposerEvent().then((res: AxiosResponse) => {
      setGetExposerEvent(res.data.data)
    })
  }

  React.useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside = (event: any) => {
      if (showMenu && ref.current && !ref.current.contains(event.target)) {
        closeMenu()
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, showMenu])

   React.useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside2 = (event: any) => {
      if (showSideB && ref2.current && !ref2.current.contains(event.target)) {
        closeSideB()
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside2)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside2)
    }
  }, [ref2, showSideB])

  const closeMenu = () => {
    setShowMenu(false)
  }
  const closeSideB = () => {
    setShowSideB(false)
  }
  const suggestion = ({ value }: any) => {
    return matchService.getMatchListSuggestion({ name: value })
  }

  const onMatchClick = (match: IMatch | null) => {
    if (match) {
      window.location.href = `/odds/${match.matchId}`
    }
  }

  const [userParentAlldata, setUserParentAlldata] = React.useState<{ [key: string]: any }>(
    {}
  );

  // React.useEffect(() => {
  //     if (userState?.user?.username) {
  //       UserService.getUserDetail(userState?.user?.username).then(
  //         (res: AxiosResponse<any>) => {
  //           console.log(res, "ressss for all values");
  //           const detail = res?.data.data;
  //           setUserAlldata(detail);
  //         }
  //       );
  //     }
  //   }, [userState?.user?.username]);

    React.useEffect(() => {
      // const userState = useAppSelector<{ user: User }>(selectUserData);
      const username:any = userState?.user?.username;
  
      console.log(username, "testagentmaster");
      UserService.getParentUserDetail(username).then(
        (res: AxiosResponse<any>) => {
          console.log(res, "check balance for parent");
          const detail = res?.data.data[0];
          setUserParentAlldata(detail);
  
        }
      );
    }, [userState]);

    const items = [
      {title:"HOME" , linkto:"/match/4/in-play"},
   {title: "MULTI MARKETS", linkto:"/match/4/in-play"},
    {title: "CRICKET", linkto:"/"},
    {title: "SPORTSBOOK", linkto:"/match/4/in-play"},
    {title: "CASINO", linkto:"/casino-games"},
    {title: "TENNIS", linkto:"/match/3/in-play"},
    {title: "COCK FIGHT", linkto:"#"},
    {title: "FOOTBALL", linkto:"/match/1/in-play"},
    {title: "HORSE RACING", linkto:"/match/7/in-play"},
    {title: "GREYHOUND", linkto:"/match/4339/in-play"},
    {title: "BASKETBALL", linkto:"/match/11/in-play"},
    {title: "BASEBALL", linkto:"/match/9/in-play"},
    {title: "POLITICS", linkto:"/match/46/in-play"},
    {title: "BINARY", linkto:"/match/4/in-play"},
    {title: "KABADDI", linkto:"/match/13/in-play"}
  ];

  return (
  <> 
  <header className='header d-none' style={{ backgroundColor: '#1a1a1a', padding: '0', margin: '0' }}>
      <div className='container-fluid' style={{ padding: '0' }}>
        <div className='row' style={{ margin: '0' }}>
          <div className='header-top col-md-12' style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            // padding: '8px 20px',
            height: 'auto',
            margin: '0',
            backgroundColor: '#1a1a1a'
          }}>
            {/* Left side - Logo */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* {isMobile ? (
                <CustomLink to='/match/4/in-play'>
                  <i className='fas fa-home' />
                </CustomLink>
              ) : null} */}
              <CustomLink
                to='/match/4/in-play'
                className={isMobile ? "" : 'logo'}
                style={{ display: 'flex', alignItems: 'center'  }}
              >
                <img 
                  src='/imgs/image.png' 
                  className='logo-icon' 
                  style={{ height: '35px', width: 'auto' , marginLeft: isMobile ? "30px" : "80px"}}
                />
              </CustomLink>
            </div>

            {/* Right side - Actions and Profile */}
            <ul className='profile-right-side' style={{ 
              display: 'flex', 
              alignItems: 'center', 
              margin: '0',
              padding: '0',
              listStyle: 'none',
              gap: '12px'
            }}>
              {/* Deposit/Withdraw Buttons */}
             {!isMobile ? 
             
             <div className="w-100 px-2">
  <div
    className="d-flex gap-2"
    style={{ width: '100%' , gap: "5px", }}
  >
    <CustomLink
      to="/deposit"
      className="btn btn-deposit flex-fill d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(180deg, #007b15, #138e00)",
        color: '#fff',
        border: "1px solid #fff",
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: '900',
        textTransform: 'uppercase',
        textDecoration: 'none',
        height: '42px'
      }}
    >
      <img
        src="/depositimg.webp"
        alt=""
        style={{ width: 18, height: 18, marginRight: 6 }}
      />
      Deposit
    </CustomLink>

    <CustomLink
      to="/withdraw"
      className="btn btn-withdraw flex-fill d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(180deg, #7b0000, #d10000)",
        color: '#fff',
        border: "1px solid #fff",
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: '900',
        textTransform: 'uppercase',
        textDecoration: 'none',
        height: '42px'
      }}
    >
      <img
        src="/withdrawimg.webp"
        alt=""
        style={{ width: 18, height: 18, marginRight: 6 }}
      />
      Withdraw
    </CustomLink>
  </div>
</div> :   
              
              ""}

              {/* Search Icon */}
              {!isMobile ? (
                <>
                  <li style={{ listStyle: 'none', display: 'flex', alignItems: 'center', position: 'relative' }}>
                    <AutocompleteComponent<IMatch>
                      className={`search-input-show ${showAuto ? 'show' : ''}`}
                      label={'Search'}
                      optionKey={'name'}
                      api={suggestion}
                      onClick={onMatchClick}
                    />
                    <a
                      href='#'
                      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault()
                        setShowAuto(!showAuto)
                      }}
                      style={{ 
                        color: '#fff', 
                        fontSize: '20px', 
                        marginLeft: '8px',
                        textDecoration: 'none'
                      }}
                    >
                      <i className='fas fa-search' />
                    </a>
                  </li>

                  {/* Rules Link */}
                  <li style={{ listStyle: 'none' }}>
                    <a
                      href='#'
                      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault()
                        setIsOpenRule(true)
                      }}
                      style={{
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600',
                        textDecoration: 'none',
                        textTransform: 'uppercase'
                      }}
                    >
                      Rules
                    </a>
                  </li>
                </>
              ) : null}


              {/* Balance and Exposure */}
              <li style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                {!isMobile && !selectHideBal.balance ? (
                  <div style={{ fontSize: '13px', color: '#fff', marginBottom: '2px' }}>
                    <span>Balance: </span>
                    <b style={{ color: '#fff' }}>{balance.balance?.toFixed(2)}</b>
                  </div>
                ) : null}
                {!selectHideBal.exposer ? (
                  <div style={{ fontSize: '13px', color: '#fff' }}>
                    <a 
                      href='#' 
                      onClick={getExposer}
                      style={{ color: '#fff', textDecoration: 'none' }}
                    >
                      <span>Exp: </span>
                      <b>{balance.exposer > 0 ? balance.exposer?.toFixed(2) : 0}</b>
                    </a>
                  </div>
                ) : null}
              </li>

              {/* User Account Dropdown */}
              <li className='account' style={{ 
                listStyle: 'none', 
                position: 'relative',
                marginLeft: '8px'
              }}>
                {isMobile && !selectHideBal.balance ? (
                  <div style={{ color: '#fff', fontSize: '13px' }}>
                    <i className='fa fa-university' aria-hidden='true' style={{ marginRight: '4px' }}></i>
                    <span>{balance.balance?.toFixed(2)}</span>
                  </div>
                ) : null}
                <span
                  style={{
                    cursor: 'pointer',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onClick={() => setShowMenu(!showMenu)}
                >
                  {userState?.user?.username}
                  <i className='fas fa-chevron-down' style={{ fontSize: '12px' }} />
                </span>
                {/* Dropdown Menu */}
                <ul ref={ref} style={{ 
                  display: showMenu ? 'block' : 'none',
                  position: 'absolute',
                  top: '40px',
                  right: '0',
                  zIndex: 1000,
                  minWidth: '200px',
                  padding: '5px 0',
                  margin: '5px 0',
                  fontSize: '14px',
                  textAlign: 'left',
                  backgroundColor: '#fff',
                  border: '1px solid rgba(0, 0, 0, 0.15)',
                  borderRadius: '4px',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.175)',
                  listStyle: 'none'
                }}>
                  <li style={{ padding: '6px 12px' }}>
                    <CustomLink onClick={() => closeMenu()} to='/match/in-play' style={{ color: '#212529', textDecoration: 'none', display: 'block' }}>
                      Home
                    </CustomLink>
                  </li>
                  <li style={{ padding: '6px 12px' }}>
                    <CustomLink onClick={() => closeMenu()} to='/accountstatement' style={{ color: '#212529', textDecoration: 'none', display: 'block' }}>
                      Account Statement
                    </CustomLink>
                  </li>
                  <li style={{ padding: '6px 12px' }}>
                    <CustomLink onClick={() => closeMenu()} to='/depositstatement' style={{ color: '#212529', textDecoration: 'none', display: 'block' }}>
                      Deposit Statement
                    </CustomLink>
                  </li>
                  <li style={{ padding: '6px 12px' }}>
                    <CustomLink onClick={() => closeMenu()} to='/withdrawstatement' style={{ color: '#212529', textDecoration: 'none', display: 'block' }}>
                      Withdraw Statement
                    </CustomLink>
                  </li>
                  <li style={{ padding: '6px 12px' }}>
                    <CustomLink onClick={() => closeMenu()} to='/profitloss' style={{ color: '#212529', textDecoration: 'none', display: 'block' }}>
                      Profit Loss Report
                    </CustomLink>
                  </li>
                  <li style={{ padding: '6px 12px' }}>
                    <CustomLink onClick={() => closeMenu()} to='/bethistory' style={{ color: '#212529', textDecoration: 'none', display: 'block' }}>
                      Bet History
                    </CustomLink>
                  </li>
                  <li style={{ padding: '6px 12px' }}>
                    <CustomLink onClick={() => closeMenu()} to='/unsettledbet' style={{ color: '#212529', textDecoration: 'none', display: 'block' }}>
                      Unsettled Bet
                    </CustomLink>
                  </li>
                  <li style={{ padding: '6px 12px' }}>
                    <CustomLink onClick={() => closeMenu()} to='/casino/result' style={{ color: '#212529', textDecoration: 'none', display: 'block' }}>
                      Casino Report History
                    </CustomLink>
                  </li>
                  <li style={{ padding: '6px 12px' }}>
                    <CustomLink onClick={() => closeMenu()} to='/button-values' style={{ color: '#212529', textDecoration: 'none', display: 'block' }}>
                      Set Button Values
                    </CustomLink>
                  </li>
                  <li style={{ padding: '6px 12px' }}>
                    <CustomLink onClick={() => closeMenu()} to='/settings/security-auth' style={{ color: '#212529', textDecoration: 'none', display: 'block' }}>
                      Security Auth Verification
                    </CustomLink>
                  </li>
                  <li style={{ padding: '6px 12px' }}>
                    <CustomLink onClick={() => closeMenu()} to='/changepassword' style={{ color: '#212529', textDecoration: 'none', display: 'block' }}>
                      Change Password
                    </CustomLink>
                  </li>
                  <li style={{ padding: '6px 12px' }}>
                    <label style={{ margin: '0', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type={'checkbox'}
                        name={'balance'}
                        checked={hideExpBal.balance || false}
                        onChange={onChangeBalExp}
                        style={{ marginRight: '8px' }}
                      />
                      Balance
                    </label>
                  </li>
                  <li style={{ padding: '6px 12px' }}>
                    <label style={{ margin: '0', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type={'checkbox'}
                        name={'exposer'}
                        checked={hideExpBal.exposer || false}
                        onChange={onChangeBalExp}
                        style={{ marginRight: '8px' }}
                      />
                      Exposer
                    </label>
                  </li>
                  <li style={{ padding: '6px 12px' }}>
                    <CustomLink onClick={() => closeMenu()} to='/rules' style={{ color: '#212529', textDecoration: 'none', display: 'block' }}>
                      Rules
                    </CustomLink>
                  </li>
                  <li style={{ borderTop: '1px solid #ccc', padding: '6px 12px' }}>
                    <a
                      onClick={logoutUser}
                      href={'#'}
                      style={{ fontWeight: 'bold', color: 'red', textTransform: 'uppercase', textDecoration: 'none', display: 'block' }}
                    >
                      Signout
                    </a>
                  </li>
                </ul>
              </li>
            </ul>

            {/* WhatsApp Support Button - Fixed Position */}
            <button
              style={{
                position: "fixed",
                zIndex: 999,
                bottom: "50px",
                right: "20px",
                background: "none",
                border: "none",
                cursor: "pointer"
              }}
              className="btns btn-successx"
              onClick={() => {
                if (userParentAlldata?.parent?.phone) {
                  const phoneNumber = userParentAlldata?.parent?.phone?.replace(/[^0-9]/g, "");
                  window.open(`https://wa.me/${phoneNumber}`, "_blank");
                }
              }}
            >
            <img
  src="/wp_support.webp"
  alt="WhatsApp Support"
  style={{
    width: '65px',
    animation: 'simple-scale 1s linear 1s infinite alternate',
  }}
/>

            </button>
          </div>

       { isMobile ?   <div className="w-100 px-2">
  <div
    className="d-flex gap-2"
    style={{ width: '100%' , gap: "5px", }}
  >
    <CustomLink
      to="/deposit"
      className="btn btn-deposit flex-fill d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(180deg, #007b15, #138e00)",
        color: '#fff',
        border: "1px solid #fff",
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: '900',
        textTransform: 'uppercase',
        textDecoration: 'none',
        height: '42px'
      }}
    >
      <img
        src="/depositimg.webp"
        alt=""
        style={{ width: 18, height: 18, marginRight: 6 }}
      />
      Deposit
    </CustomLink>

    <CustomLink
      to="/withdraw"
      className="btn btn-withdraw flex-fill d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(180deg, #7b0000, #d10000)",
        color: '#fff',
        border: "1px solid #fff",
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: '900',
        textTransform: 'uppercase',
        textDecoration: 'none',
        height: '42px'
      }}
    >
      <img
        src="/withdrawimg.webp"
        alt=""
        style={{ width: 18, height: 18, marginRight: 6 }}
      />
      Withdraw
    </CustomLink>
  </div>
</div> : ""}


          


          
          {isMobile ? <Marqueemessge message={userMessage} /> : ""}
          {!isMobile ? <NavMenu /> : <NavMobileMenu />}
        </div>
      </div>
      <div />
      <div className='modal-market' />
    
      <ReactModal
        isOpen={isOpen}
        onRequestClose={(e: any) => {
          setIsOpen(false)
        }}
        contentLabel='Set Max Bet Limit'
        className={'modal-dialog'}
        ariaHideApp={false}
      >
        <div className='modal-content'>
          <div className='modal-header'>
            My Market
            <button onClick={() => setIsOpen(false)} className='close float-right'>
              <i className='fas fa-times-circle'></i>
            </button>
          </div>
          <div className='modal-body'>
            <table className='reponsive table col-12'>
              <tr>
                <th>Event Name</th>
                <th>Total Bets</th>
              </tr>

              {getExposerEvent.map((exposer: any) => {
                let casinoSlug = ''
                if (exposer.sportId == 5000) {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                   // @ts-ignore
                  casinoSlug = casinoSlugs?.[exposer?.matchId]
                }
                return (
                  <tr key={exposer.matchName}>
                    <td>
                      <CustomLink
                        onClick={() => {
                          window.location.href =
                            exposer.sportId &&
                              Number.isInteger(+exposer.sportId) &&
                              exposer.sportId != 5000
                              ? `/odds/${exposer._id}`
                              : `/casino/${casinoSlug}/${exposer._id}`
                          setIsOpen(false)
                        }}
                        to={
                          exposer.sportId &&
                            Number.isInteger(+exposer.sportId) &&
                            exposer.sportId != 5000
                            ? `/odds/${exposer._id}`
                            : `/casino/${casinoSlug}/${exposer._id}`
                        }
                      >
                        {exposer.matchName}
                      </CustomLink>
                    </td>
                    <td>{exposer.myCount}</td>
                  </tr>
                )
              })}
            </table>
          </div>
        </div>
      </ReactModal>
      

      <ReactModal
        isOpen={isOpenRule}
        onRequestClose={(e: any) => {
          setIsOpenRule(false)
        }}
        contentLabel='Set Max Bet Limit'
        className={'modal-dialog w-90P'}
        ariaHideApp={false}
      >
        <div className='modal-content' style={{ height: '90vh', marginTop: "1%" }}>
          <div className='modal-header'>
            Rules
            <button onClick={() => setIsOpenRule(false)} className='close float-right'>
              <i className='fas fa-times-circle'></i>
            </button>
          </div>
          <div className='modal-body'>
            <Rules classData={'col-md-12'} />
          </div>
        </div>
      </ReactModal>
    </header>

    <div>

    <header style={{background:"#132225"}} className=" text-white py-2 px-1">
  <div className="container-fluid d-flex align-items-center justify-content-between">

    {/* LEFT: Logo */}
    <div className="d-flex align-items-center">
      <div style={{fontSize:"30px"}} onClick={() => setShowSideB(!showSideB)}>
        ☰
      </div>
      <CustomLink to="/match/4/in-play" className="navbar-brand ml-1">
        <img src="/imgs/image.png" alt="logo" style={{ height: 20 }} />
      </CustomLink>
    </div>

      <ul ref={ref2} style={{ 
                  display: showSideB ? 'block' : 'none',
                  position: 'absolute',
                  top: '0px',
                  height: "100%",
                  left: '0',
                  zIndex: 1000,
                  minWidth: '256px',
                  // padding: '5px 0',
                  // margin: '5px 0',
                  fontSize: '16px',
                  fontWeight: "500",
                  textAlign: 'left',
                  backgroundColor: '#fff',
                  border: '1px solid rgba(0, 0, 0, 0.15)',
                 
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.175)',
                  listStyle: 'none',
                  color: '#000000'
                }}>
                 
                   <div className="bg-light" style={{ overflow: "hidden",  }}>
  
  {/* Header */}
  <div className="d-flex justify-content-between align-items-center px-2 py-2 border-bottom bg-theme">
    <div className="d-flex align-items-center " style={{gap:"8px"}}>
      <img src="/imgs/image.png" alt="logo" style={{ height: 25 }} />
    </div>
    <div  onClick={() => setShowSideB(!showSideB)} style={{ cursor: "pointer", color:"white" }}>✕</div>
  </div>

 
</div>


<div className="sidebar-menu">

  <CustomLink to="/"  className="menu-item text-dark">
    <div style={{gap:"12px"}} className="d-flex align-items-center  px-3 py-3">
      <img src="https://www.reddy888.com/assets/cricket-sidebar-icon-C5omyrdc.svg" className="menu-icon" />
      <span>Cricket</span>
    </div>
  </CustomLink>

  <CustomLink to="match/1/in-play"  className="menu-item text-dark">
    <div style={{gap:"12px"}} className="d-flex align-items-center gap-3 px-3 py-3">
      <img src="https://www.reddy888.com/assets/football-sidebar-icon-C_dnYWzd.svg" className="menu-icon" />
      <span>Football</span>
    </div>
  </CustomLink>

  <CustomLink to="match/3/in-play"  className="menu-item text-dark">
    <div style={{gap:"12px"}} className="d-flex align-items-center gap-3 px-3 py-3">
      <img src="/imgs/tenis.svg" className="menu-icon" />
      <span>Tennis</span>
    </div>
  </CustomLink>

  <CustomLink to="match/12/in-play"  className="menu-item text-dark">
    <div style={{gap:"12px"}} className="d-flex align-items-center gap-3 px-3 py-3">
      <img src="/assets/basketball.svg" className="menu-icon" />
      <span>Basketball</span>
    </div>
  </CustomLink>

  <CustomLink to="match/5/in-play"  className="menu-item text-dark">
    <div style={{gap:"12px"}} className="d-flex align-items-center gap-3 px-3 py-3">
      <img src="/assets/baseball.svg" className="menu-icon" />
      <span>Baseball</span>
    </div>
  </CustomLink>

  <CustomLink to="match/6/in-play"  className="menu-item text-dark">
    <div style={{gap:"12px"}} className="d-flex align-items-center gap-3 px-3 py-3">
      <img src="/assets/ice.svg" className="menu-icon" />
      <span>Ice Hockey</span>
    </div>
  </CustomLink>

  <CustomLink to="match/7/in-play"  className="menu-item text-dark">
    <div style={{gap:"12px"}} className="d-flex align-items-center gap-3 px-3 py-3">
      <img src="/assets/volleyball.svg" className="menu-icon" />
      <span>Volleyball</span>
    </div>
  </CustomLink>

  <CustomLink to="match/8/in-play"  className="menu-item text-dark">
    <div style={{gap:"12px"}} className="d-flex align-items-center gap-3 px-3 py-3">
      <img src="/assets/kabaddi.svg" className="menu-icon" />
      <span>Kabaddi</span>
    </div>
  </CustomLink>

  <div className="menu-item">
    <div style={{gap:"12px"}} className="d-flex align-items-center gap-3 px-3 py-3">
      <img src="/assets/promotion.svg" className="menu-icon" />
      <span>Promotions</span>
    </div>
  </div>

  <div className="menu-item">
    <div style={{gap:"12px"}} className="d-flex align-items-center gap-3 px-3 py-3">
      <img src="/assets/game.svg" className="menu-icon" />
      <span>Game Rules</span>
    </div>
  </div>

  <div className="menu-header px-3 py-2">Change Language</div>

  <div className="px-3 py-3">
    <select className="form-select">
      <option>English (EN)</option>
      <option>Hindi (IN)</option>
    </select>
  </div>

</div>




                </ul>



    {/* CENTER: Search + Date */}
    <div style={{gap:"12px"}} className="d-none d-md-flex align-items-center flex-grow-1 justify-content-center">
      <div style={{ width: "300px" }}>
        <input
          className="form-control rounded-pill"
          placeholder="Search Events"
          style={{borderRadius:"50px"}}
          // optionKey="name"
          // api={suggestion}
          // onClick={onMatchClick}
        />
      </div>

      <div className="text-left small">
        <div>Login as {userState?.user?.username} User</div>
        <div>Mar 24th, 2026</div>
        <div>{new Date().toLocaleTimeString()}</div>
      </div>
    </div>

    {/* RIGHT: Balance + Buttons + User */}
    <div style={{gap:"8px"}} className="d-flex align-items-center gap-2">

      {/* Balance */}
     {!isMobile && 
        <div className="text-end me-2">
          <div className="small">
            Available Balance: ₹ {balance.balance?.toFixed(2)}
          </div>
          <div className="small">
            Exposure: ₹ {balance.exposer?.toFixed(2)}
        </div>
      </div>}

      {/* Bonus */}
      {!isMobile && (
        <button className="btn btn-warning btn-sm fw-bold">
          Check Bonuses
        </button>
      )}

      {/* Deposit */}
     {!isMobile && <CustomLink to="/deposit" className="btn btn-success btn-sm fw-bold d-flex flex-column align-items-center">
      <img src='/imgs/depo.svg' />  Deposit
      </CustomLink>
}
      {/* Withdraw */}
     {!isMobile && <CustomLink to="/withdraw" className="btn btn-danger btn-sm fw-bold d-flex flex-column align-items-center">
       <img src='/imgs/with.svg' />  Withdraw
      </CustomLink>}

      {/* Notification */}
      <button style={{background:"transparent"}} className="btn  btn-sm position-relative">
        <i className="fas fa-bell text-white" />
        <span className="position-absolute top-0 start-100 translate-middle badge bg-light text-dark rounded-circle" style={{ fontSize: "10px", padding: "2px 5px" }}>
          1
        </span>
      </button>

        <CustomLink to={"/deposit"}
  className="d-flex align-items-center justify-content-center fw-bold"
  style={{
    gap: "4px",
    padding: "0 8px",
    borderRadius: "50px",
    minHeight: "28px",
    background: "#ffffff", // bg-accordionHeader ka approx color
    border: "none",
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontSize: "11px",
    color: "#000000",
  }}
  onMouseDown={(e) => (e.currentTarget.style.opacity = "0.7")}
  onMouseUp={(e) => (e.currentTarget.style.opacity = "1")}
>
  Deposit
</CustomLink>

      <button
  className="d-flex align-items-center justify-content-center text-white fw-bold"
  style={{
    gap: "4px",
    padding: "0 8px",
    borderRadius: "50px",
    minHeight: "28px",
    background: "#2c4f58", // bg-accordionHeader ka approx color
    border: "none",
    cursor: "pointer",
    whiteSpace: "nowrap",
  }}
  onMouseDown={(e) => (e.currentTarget.style.opacity = "0.7")}
  onMouseUp={(e) => (e.currentTarget.style.opacity = "1")}
 onClick={() => setShowMenu(!showMenu)}
>
  <span style={{ fontSize: "11px" }}>₹ 0.00</span>

  <i className="fas fa-user" style={{ fontSize: "12px" }}></i>
</button>

    <ul ref={ref} style={{ 
                  display: showMenu ? 'block' : 'none',
                  position: 'absolute',
                  top: '0px',
                  height: "100%",
                  right: '0',
                  zIndex: 1000,
                  minWidth: '256px',
                  padding: '5px 0',
                  margin: '5px 0',
                  fontSize: '16px',
                  fontWeight: "500",
                  textAlign: 'left',
                  backgroundColor: '#fff',
                  border: '1px solid rgba(0, 0, 0, 0.15)',
                  borderRadius: '4px',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.175)',
                  listStyle: 'none',
                  color: '#000000'
                }}>
                 <div className="bg-light" style={{ borderRadius: "6px", overflow: "hidden",  }}>
  
  {/* Header */}
  <div className="d-flex justify-content-between align-items-center px-2 py-2 border-bottom">
    <div className="d-flex align-items-center " style={{gap:"8px"}}>
      <i className="fas fa-user"></i>
      <span className="fw-bold">{userState?.user?.username || "Demo User"}</span>
    </div>
    <div  onClick={() => setShowMenu(!showMenu)} style={{ cursor: "pointer" }}>✕</div>
  </div>

  {/* Balance Info Title */}
  <div className="d-flex align-items-center justify-content-between px-2 py-2 border-bottom">
    <div className="fw-semibold d-flex align-items-center" style={{gap:"8px"}}>
      <i className="fas fa-university"></i>
      Balance Information
    </div>
    <i className="fas fa-info-circle"></i>
  </div>

  {/* Balance Box */}
  <div className="p-2">
    <div className="bg-white rounded p-2 mb-2 border">
      <div style={{ fontSize: "10px", color: "#555" }}>BALANCE</div>
      <div className="fw-bold text-success fs-5">₹ {balance.balance?.toFixed(2) || 0}</div>
    </div>

    <div className="d-flex gap-2" style={{gap:"8px"}}>
      <div className="bg-white rounded p-2 border w-50">
        <div style={{ fontSize: "10px", color: "#555" }}>BONUS</div>
        <div className="fw-bold">₹ {balance.balance?.toFixed(2) || 0}</div>
      </div>

      <div className="bg-white rounded p-2 border w-50">
        <div style={{ fontSize: "10px", color: "#555" }}>NET EXPOSURE</div>
        <div className="fw-bold text-danger">₹
          {balance.exposer > 0 ? balance.exposer?.toFixed(2) : 0}
        </div>
      </div>
    </div>
  </div>

  {/* Buttons */}
  <div className="d-flex px-2 pb-2 gap-2" style={{gap:"8px"}}>
    <CustomLink
      to="/deposit"
      className="btn w-50 text-white fw-semibold d-flex flex-column align-items-center py-0"
      style={{ background: "#1f9d55", borderRadius: "6px" , fontSize:"12px" }}
    >
       <img src='/imgs/depo.svg' /> 
      Deposit
    </CustomLink>

    <CustomLink
      to="/withdraw"

      className="btn w-50 text-white fw-semibold d-flex flex-column align-items-center py-0"
      style={{ background: "#e3342f", borderRadius: "6px" , fontSize:"12px" }}
    >
      <img src='/imgs/with.svg' />   Withdraw
    </CustomLink>
  </div>

  {/* Claim Bonus */}
  <div className="px-2 pb-2">
    <button
      className="btn w-100 fw-bold text-white"
      style={{ background: "#d4a017", borderRadius: "6px" }}
    >
      Claim Bonuses
    </button>
  </div>
</div>
                  <li style={{ padding: '8px 12px' }}>
                    <CustomLink  onClick={() => closeMenu()} to='/match/in-play' style={{ color: '#212529', textDecoration: 'none', display: 'flex' , gap:"10px", alignItems:"center" }}>
                     <i className="fas fa-home"></i> Home
                    </CustomLink>
                  </li>
                  <div className="w-100 border" style={{ minHeight: "1px" }}></div>
                  <li style={{ padding: '8px 12px' }}>
                    <CustomLink onClick={() => closeMenu()} to='/accountstatement' style={{ color: '#212529', textDecoration: 'none', display: 'flex' , gap:"10px", alignItems:"center" }}>
                      <i className="fas fa-file-invoice"></i> Account Statement
                    </CustomLink>
                  </li>
                  <div className="w-100 border" style={{ minHeight: "1px" }}></div>
                  <li style={{ padding: '8px 12px' }}>
                    <CustomLink onClick={() => closeMenu()} to='/depositstatement' style={{ color: '#212529', textDecoration: 'none', display: 'flex' , gap:"10px", alignItems:"center" }}>
                      <i className="fas fa-money-bill-wave"></i> Deposit Statement
                    </CustomLink>
                  </li>
                  <div className="w-100 border" style={{ minHeight: "1px" }}></div>
                  <li style={{ padding: '8px 12px' }}>
                    <CustomLink onClick={() => closeMenu()} to='/withdrawstatement' style={{ color: '#212529', textDecoration: 'none', display: 'flex' , gap:"10px", alignItems:"center" }}>
                      <i className="fas fa-money-bill-wave"></i> Withdraw Statement
                    </CustomLink>
                  </li>
                  <div className="w-100 border" style={{ minHeight: "1px" }}></div>
                  <li style={{ padding: '8px 12px' }}>
                    <CustomLink onClick={() => closeMenu()} to='/profitloss' style={{ color: '#212529', textDecoration: 'none', display: 'flex' , gap:"10px", alignItems:"center" }}>
                      <i className="fas fa-chart-line"></i> Profit Loss Report
                    </CustomLink>
                  </li>
                  <div className="w-100 border" style={{ minHeight: "1px" }}></div>
                  <li style={{ padding: '8px 12px' }}>
                    <CustomLink onClick={() => closeMenu()} to='/bethistory' style={{ color: '#212529', textDecoration: 'none', display: 'flex' , gap:"10px", alignItems:"center" }}>
                      <i className="fas fa-history"></i> Bet History
                    </CustomLink>
                  </li>
                  <div className="w-100 border" style={{ minHeight: "1px" }}></div>
                  <li style={{ padding: '8px 12px' }}>
                    <CustomLink onClick={() => closeMenu()} to='/unsettledbet' style={{ color: '#212529', textDecoration: 'none', display: 'flex' , gap:"10px", alignItems:"center" }}>
                      <i className="fas fa-clock"></i> Unsettled Bet
                    </CustomLink>
                  </li>
                  <div className="w-100 border" style={{ minHeight: "1px" }}></div>
                  <li style={{ padding: '8px 12px' }}>
                    <CustomLink onClick={() => closeMenu()} to='/casino/result' style={{ color: '#212529', textDecoration: 'none', display: 'flex' , gap:"10px", alignItems:"center"  }}>
                      <i className="fas fa-dice"></i> Casino Report History
                    </CustomLink>
                  </li>
                  <div className="w-100 border" style={{ minHeight: "1px" }}></div>

                  <li style={{ padding: '8px 12px' }}>
                    <CustomLink onClick={() => closeMenu()} to='/button-values' style={{ color: '#212529', textDecoration: 'none', display: 'flex' , gap:"10px", alignItems:"center" }}>
                      <i className="fas fa-cog"></i> Set Button Values
                    </CustomLink>
                  </li>
                  <div className="w-100 border" style={{ minHeight: "1px" }}></div>
                  <li style={{ padding: '8px 12px' }}>
                    <CustomLink onClick={() => closeMenu()} to='/settings/security-auth' style={{ color: '#212529', textDecoration: 'none', display: 'flex' , gap:"10px", alignItems:"center" }}>
                      <i className="fas fa-shield-alt"></i> Security Auth Verification
                    </CustomLink>
                  </li>
                  <div className="w-100 border" style={{ minHeight: "1px" }}></div>
                  <li style={{ padding: '8px 12px' }}>
                    <CustomLink onClick={() => closeMenu()} to='/changepassword' style={{ color: '#212529', textDecoration: 'none', display: 'flex' , gap:"10px", alignItems:"center" }}>
                      <i className="fas fa-key"></i> Change Password
                    </CustomLink>
                  </li>
                  <div className="w-100 border" style={{ minHeight: "1px" }}></div>
                  <li style={{ padding: '8px 12px' }}>
                    <label style={{ margin: '0', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type={'checkbox'}
                        name={'balance'}
                        checked={hideExpBal.balance || false}
                        onChange={onChangeBalExp}
                        style={{ marginRight: '8px' }}
                      />
                      Balance
                    </label>
                  </li>
                  <li style={{ padding: '8px 12px' }}>
                    <label style={{ margin: '0', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type={'checkbox'}
                        name={'exposer'}
                        checked={hideExpBal.exposer || false}
                        onChange={onChangeBalExp}
                        style={{ marginRight: '8px' }}
                      />
                      Exposer
                    </label>
                  </li>
                  <li style={{ padding: '8px 12px' }}>
                    <CustomLink onClick={() => closeMenu()} to='/rules' style={{ color: '#212529', textDecoration: 'none', display: 'block' }}>
                      Rules
                    </CustomLink>
                  </li>
                  <li style={{ borderTop: '1px solid #ccc', padding: '8px 12px' }}>
                    <a
                      onClick={logoutUser}
                      href={'#'}
                      style={{ fontWeight: 'bold', color: 'red', textTransform: 'uppercase', textDecoration: 'none', display: 'block' }}
                    >
                      Signout
                    </a>
                  </li>
                </ul>

      {/* User Dropdown */}
     {!isMobile && <div className="dropdown">
        <button
          className="btn btn-outline-light btn-sm dropdown-toggle"
          onClick={() => setShowMenu(!showMenu)}
        >
          {userState?.user?.username}
        </button>

        <ul className={`dropdown-menu dropdown-menu-end ${showMenu ? "show" : ""}`}>
          <li><CustomLink className="dropdown-item" to="/match/in-play">Home</CustomLink></li>
          <li><CustomLink className="dropdown-item" to="/accountstatement">Account Statement</CustomLink></li>
          <li><CustomLink className="dropdown-item" to="/depositstatement">Deposit Statement</CustomLink></li>
          <li><CustomLink className="dropdown-item" to="/withdrawstatement">Withdraw Statement</CustomLink></li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <a className="dropdown-item text-danger" href="#" onClick={logoutUser}>
              Logout
            </a>
          </li>
        </ul>
      </div>}

    </div>
  </div>
</header>

<div><div className="bg-light py-2">
      <div style={{gap:"2px" ,overflowX:"auto" ,  }} className="d-flex hide-scrollbar flex-nowrap gap-2  px-2">
        {items.map((item:any, index:number) => (
          <CustomLink 
           to={item?.linkto}
            key={index}
            style={{borderRadius:"9999px", fontSize:"12px"}}
            className={`btn rounded-pill px-4 py-1 fw-semibold ${
              item.name === "HOME"
                ? "btn-danger text-white"
                : item.name === "CRICKET"
                ? "btn-outline-dark"
                : "btn-light border"
            }`}
          >
            {item.title}
          </CustomLink>
        ))}
      </div>
    </div></div>

</div>
    
    
    </> 

  )
}
export default Header
