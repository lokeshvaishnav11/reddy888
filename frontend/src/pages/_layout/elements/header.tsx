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




const Header = () => {
// const isMobile = true

  const ref = useRef<any>(null)
  const userState = useAppSelector<{ user: User }>(selectUserData)
  const balance = useAppSelector(selectBalance)
  const selectHideBal = useAppSelector<HideBalExp>(selectHideBalExp)
  const rules = useAppSelector(selectRules)
  const dispatch = useAppDispatch()

  const navigate = useNavigateCustom()

  const { socketUser } = useWebsocketUser()

  const [showMenu, setShowMenu] = React.useState<boolean>(false)
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

  const closeMenu = () => {
    setShowMenu(false)
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

  return (
    <header className='header' style={{ backgroundColor: '#1a1a1a', padding: '0', margin: '0' }}>
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
                  src='/imgs/logo.png' 
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
  )
}
export default Header
