import React from 'react'
import { AxiosResponse } from 'axios'
import User, { RoleType } from '../../../../models/User'
import { CustomLink, useNavigateCustom } from '../../../../pages/_layout/elements/custom-link'
import { logout, selectUserData, userUpdate } from '../../../../redux/actions/login/loginSlice'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
// Removed search autocomplete and userService as search is no longer in header
// import CustomAutoComplete from '../../../components/CustomAutoComplete'
// import userService from '../../../../services/user.service'
import casinoService from '../../../../services/casino.service'

import UserService from "../../../../services/user.service";
import userService from '../../../../services/user.service'
interface TopHeaderProps {
  onMenuToggle?: () => void
}

const TopHeader = ({ onMenuToggle }: TopHeaderProps) => {
  const userState = useAppSelector<{ user: User }>(selectUserData)
  const dispatch = useAppDispatch()
  const navigate = useNavigateCustom()
  
  const [showMenu, setShowMenu] = React.useState<boolean>(false)
  const [showMarketDropdown, setShowMarketDropdown] = React.useState<boolean>(false)
  const [showTxnDropdown, setShowTxnDropdown] = React.useState<boolean>(false)


  const [showClientListDropdown, setShowClientListDropdown] = React.useState<boolean>(false)
  const [showCreateDropdown, setShowCreateDropdown] = React.useState<boolean>(false)

  const [showReportsInProfile, setShowReportsInProfile] = React.useState<boolean>(false)
  const [showTransactionsInProfile, setShowTransactionsInProfile] = React.useState<boolean>(false)
  const [showCasinoInProfile, setShowCasinoInProfile] = React.useState<boolean>(false)
  const [showSettingsInProfile, setShowSettingsInProfile] = React.useState<boolean>(false)
  const [gameList, setGameList] = React.useState([])

  React.useEffect(() => {
    casinoService.getCasinoList().then((res: AxiosResponse<any>) => {
      setGameList(res.data.data)
    })
  }, [])

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.dropdown') && !target.closest('.user-menu')) {
        setShowMarketDropdown(false)
        setShowClientListDropdown(false)
        setShowMenu(false)
        setShowReportsInProfile(false)
        setShowTransactionsInProfile(false)
        setShowCasinoInProfile(false)
        setShowSettingsInProfile(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const logoutUser = (e: any) => {
    e.preventDefault()
    dispatch(userUpdate({} as User))
    setTimeout(() => {
      dispatch(logout())
      navigate.go('/login')
    }, 1)
  }



  const getRoleOptions = (): { key: RoleType; label: string }[] => {
    const userRole = userState?.user?.role as RoleType;

    const allRoles = {
      admin: "Super Admin",
      sadmin: "Admin",
      suadmin: "Sub Admin",
      smdl: "Master",
      mdl: "Super",
      dl: "Agent",
      user: "Client",
    };

    const roleMap: Record<RoleType, RoleType[]> = {
      [RoleType.admin]: [
        RoleType.sadmin,
        RoleType.smdl,
        RoleType.mdl,
        RoleType.dl,
        RoleType.user,
      ],
      [RoleType.sadmin]: [RoleType.smdl, RoleType.mdl,  RoleType.dl, RoleType.user,],

      [RoleType.smdl]: [RoleType.mdl, RoleType.dl, RoleType.user],
      [RoleType.mdl]: [RoleType.dl, RoleType.user],
      [RoleType.dl]: [RoleType.user],
      [RoleType.user]: [],
    };

    const allowedRoles = roleMap[userRole] || [];

    return allowedRoles.map((key) => ({
      key,
      label: allRoles[key],
    }));
  };

  // Search removed from header

  const [newbalance, setNewbalance] = React.useState<any>();

  const [shared, setShared] = React.useState();
  const [detail, setDetail] = React.useState<any>({});


  React.useEffect(() => {
    // const userState = useAppSelector<{ user: User }>(selectUserData);
    const username: any = userState?.user?.username;

    console.log(username, "testagentmaster");
    UserService.getParentUserDetail(username).then(
      (res: AxiosResponse<any>) => {
        console.log(res, "check balance for parent");
        const thatb = res?.data?.data[0];
        setDetail(thatb);
        setNewbalance(thatb?.balance?.balance);
        setShared(thatb?.share);
      }
    );
  }, [userState]);

  const [userbook , setUserBook] = React.useState<any>()
    const [userBookData, setUserBookData] = React.useState<any>(null)
  

  const setuserresponse = () => {
    
        userService.getUserBook().then((res: AxiosResponse<any>) => {
          setUserBookData(res.data.data)
        })
      
    }

    React.useEffect(()=>{
      setuserresponse()
    },[userState])

  return (
    <div className='admin-top-header'>
      <div className='top-header-content'>
        <div className='header-left'>
          <CustomLink to={'/'} className='header-logo'>
            <img style={{marginLeft:"28px"}}  src='/imgs/logo.png' alt='Logo' />
          </CustomLink>
        </div>

        <div className='header-right'>
          {/* Balance and Upline Info Box */}
          <div className='balance-upline-box'>
            <div className='balance-info'>
              <span className='label'>Bal :</span>
              <span className='value'>{newbalance?.toFixed()}</span>
            </div>
            <div className='upline-info'>
              <span className='label'>Upline :</span>
              <span className='value'>{userBookData?.mypl?.toFixed(2)}</span>
            </div>
          </div>

          <nav className='header-nav'>
            <ul className='nav-menu'>
              {/* Market Dropdown */}
              <li className='dropdown'>
                <button onClick={(e) => {
                  e.stopPropagation()
                  setShowMarketDropdown(!showMarketDropdown)
                  setShowClientListDropdown(false)
                  setShowCreateDropdown(false)
                  setShowMenu(false)
                  setShowTxnDropdown(false)
                }}>
                  Market <i className='fas fa-caret-down'></i>
                </button>
                {showMarketDropdown && (
                <ul className='dropdown-menu profile-menu'>
                  <li>
                    <CustomLink to='/market-analysis'>Market Analysis</CustomLink>
                  </li>
                  {/* <li>
                    <CustomLink to='/multi-market'>Multi Market</CustomLink>
                  </li> */}
                  <li>
                    <CustomLink to='/unsettledbet'>Unsettled Bets</CustomLink>
                  </li>
                  {/* <li>
                    <CustomLink to='/casino-history'>Int Casino History</CustomLink>
                  </li> */}
                </ul>
                )}
              </li>



              {/* Client List Dropdown */}
              <li className='dropdown'>
                <button onClick={(e) => {
                  e.stopPropagation()
                  setShowClientListDropdown(!showClientListDropdown)
                  setShowMarketDropdown(false)
                  setShowCreateDropdown(false)
                  setShowMenu(false)
                  setShowTxnDropdown(false)
                }}>
                  Client List <i className='fas fa-caret-down'></i>
                </button>
                {showClientListDropdown && (
                <ul className='dropdown-menu profile-menu'>
                  {/* <li>
                    <CustomLink to={`/list-clients/${userState?.user?.username}`}>List of Clients</CustomLink>
                  </li> */}

                  {getRoleOptions().map((role) => (
                        <li key={role.key}>
                          <CustomLink
                            to={`/list-clients/${userState?.user?.username}/${role.key}`}
                            // onClick={() => setDropdownOpen(!dropdownOpen)}
                            //  onClick={toggleDrawer}
                            // onClick={() => { toggleDrawer(); setDropdownOpen(!dropdownOpen) ; setActiveMenu("User");}}
                            // className="dropdown-item hover:bg-gray-400"
                          >
                            {/* <b className=" mobile-style ml-20 text-lg text-white  md:flex md:flex-row flex flex-col text-left gap-1"> */}
                              {/* <ListIcon className="text-yellow-600" /> */}
                            <span style={{background:"#CC9647" ,color:"white" , padding:"4px 10px"}}>{role.label.charAt(0)}</span>  {role.label}
                              {/* ({userList?.items?.filter((i: any) => i.role === `${role.key}`)?.length}) */}
                            {/* </b> */}
                          </CustomLink>
                        </li>
                      ))}


                  {/* <li>
                    <CustomLink to='/blocked-clients'>Blocked Clients</CustomLink>
                  </li> */}
                </ul>
                )}
              </li>


              {/* Create Client  */}
              <li className='dropdown'>
                <button onClick={(e) => {
                  e.stopPropagation()
                  setShowCreateDropdown(!showCreateDropdown)
                  setShowClientListDropdown(false)
                  setShowMarketDropdown(false)
                  setShowTxnDropdown(false)

                  setShowMenu(false)
                }}>
                  Create User <i className='fas fa-caret-down'></i>
                </button>
                {showCreateDropdown && (
                <ul className='dropdown-menu profile-menu'>
                   {/* <li>
                <CustomLink to={`/add-user/${userState?.user?.username}`}>Create User</CustomLink>
              </li> */}


              {getRoleOptions().map((role) => (
                        <li key={role.key}>
                          <CustomLink
                            to={`/add-user/${userState?.user?.username}/${role.key}`}
                            // onClick={() => setDropdownOpen(!dropdownOpen)}
                            //  onClick={toggleDrawer}
                            // onClick={() => { toggleDrawer(); setDropdownOpen(!dropdownOpen) ; setActiveMenu("User");}}
                            // className="dropdown-item hover:bg-gray-400"
                          >
                            {/* <b className=" mobile-style ml-20 text-lg text-white  md:flex md:flex-row flex flex-col text-left gap-1"> */}
                              {/* <ListIcon className="text-yellow-600" /> */}
                              <span style={{background:"#CC9647" ,color:"white" , padding:"4px 10px"}}>{role.label.charAt(0)}</span>  {role.label}
                              {/* ({userList?.items?.filter((i: any) => i.role === `${role.key}`)?.length}) */}
                            {/* </b> */}
                          </CustomLink>
                        </li>
                      ))}


                </ul>
                )}
              </li>


              <li className='dropdown'>
                <button onClick={(e) => {
                  e.stopPropagation()
                  setShowTxnDropdown(!showTxnDropdown)
                  setShowClientListDropdown(false)
                  setShowCreateDropdown(false)
                  setShowMarketDropdown(false)
                  setShowMenu(false)
                }}>
                  Transactions <i className='fas fa-caret-down'></i>
                </button>
                {showTxnDropdown && (
                <ul className='dropdown-menu profile-menu'>
                  <li>
                    <CustomLink to='/depositstatement'>Deposit</CustomLink>
                  </li>
               
                  <li>
                    <CustomLink to='/withdrawstatement'>Withdraw</CustomLink>
                  </li>

                  <li>
                    <CustomLink to='/payment-method'>{'Payment Method'}</CustomLink>
                  </li>

                   <li>
                                          <CustomLink to='/update-whatsapp'>
                                            <b>{'Update Whatsapp'}</b>
                                          </CustomLink>
                                        </li>

                  
                  
                </ul>
                )}
              </li>

              

              {/* Create Client Button */}
              {/* <li>
                <CustomLink to={`/add-user/${userState?.user?.username}`}>Create Client</CustomLink>
              </li> */}

              {/* Profile dropdown with Home, Dashboard, Reports, Transactions, Settings, and Live Casino moved inside */}
              <li className='dropdown profile-dropdown'>
                <button onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(!showMenu)
                  setShowMarketDropdown(false)
                  setShowClientListDropdown(false)
                  setShowCreateDropdown(false)
                  setShowTxnDropdown(false)
                  if (!showMenu) {
                    setShowReportsInProfile(false)
                    setShowTransactionsInProfile(false)
                    setShowCasinoInProfile(false)
                    setShowSettingsInProfile(false)
      
                  }
                }}>
                  {userState?.user?.username} <i className='fas fa-caret-down'></i>
                </button>
                {showMenu && (
                  <ul className='dropdown-menu dropdown-menu-right profile-menu'>
                    {/* Requested items only (others commented out for now) */}
                    <li><CustomLink to='/profitloss'>Profit Loss</CustomLink></li>
                    <li><CustomLink to='/accountstatement'>A/C Statement</CustomLink></li>
                    <li><CustomLink to='/accountstatement-old'>Old A/C Statement</CustomLink></li>
                    <li><CustomLink to='/top-clients'>Top Clients</CustomLink></li>
                    {/* <li><CustomLink to='/top-clients-new'>Top Clients New</CustomLink></li> */}
                    <li><CustomLink to='/sport-report'>Sport Report</CustomLink></li>
                    {/* <li><CustomLink to='/sport-report-new'>Sport Report New</CustomLink></li> */}
                    <li><CustomLink to='/weekly-report'>Weekly Report</CustomLink></li>
                    {/* <li><CustomLink to='/settlement-report'>Settlement Report</CustomLink></li> */}
                    
                    {/* <li><CustomLink to='/settlement'>Settlement</CustomLink></li> */}

                    <li><CustomLink to='/chip-summary'>Chip Smry</CustomLink></li>
                    <li><CustomLink to='/balance-sheet'>Balance Sheet</CustomLink></li>
                    {/* <li><CustomLink to='/export'>Export</CustomLink></li> */}
                    <li><CustomLink to='/profile'>Profile</CustomLink></li>
                    <li><CustomLink to='/change-password'>Change Password</CustomLink></li>
                   {userState?.user?.role == "admin" ?  <li><CustomLink  to="/notice" >Notice</CustomLink></li> : ""}
                   {userState?.user?.role == "admin" ?  <li><CustomLink   to={"/sports-list"} >Add Match List</CustomLink></li> : ""}

                   {userState?.user?.role == "admin" ?  <li><CustomLink  to='/casino-list' > Casino List</CustomLink></li> : ""}
                   {userState?.user?.role == "admin" ?  <li><CustomLink  to="/sports-list-block" >{"Block Markets"}</CustomLink></li> : ""}
                   {userState?.user?.role == "admin" ?  <li><CustomLink  to="/unsettledbet" > Deleted Bets</CustomLink></li> : ""}




                    {/*
                    The following items are commented out for now per request:
                    <li className='dropdown-divider'></li>
                    <li><CustomLink to='/unsettledbet'>Current Bets</CustomLink></li>
                    {userState?.user?.role === RoleType.admin && (
                      <li><CustomLink to='/unsettledbet/deleted'>Deleted Bets</CustomLink></li>
                    )}
                    <li><CustomLink to='/game-reports'>Game Reports</CustomLink></li>
                    {(userState?.user?.role === RoleType.admin) && (
                      <>
                        <li><CustomLink to='/sports-list/active-matches'>Block Markets</CustomLink></li>
                        <li><CustomLink to='/messages'>Messages</CustomLink></li>
                        <li><CustomLink to='/sports-list/matches'>Add Match List</CustomLink></li>
                        <li><CustomLink to='/casino-list'>Casino List</CustomLink></li>
                      </>
                    )}
                    <li><CustomLink to='/payment-method'>Payment Method</CustomLink></li>
                    <li><CustomLink to='/update-whatsapp'>Update Whatsapp</CustomLink></li>
                    <li><CustomLink to='/depositstatement'>Deposit</CustomLink></li>
                    <li><CustomLink to='/withdrawstatement'>Withdraw</CustomLink></li>
                    */}

                    {/* Visible logout button (restored as requested) */}
                    <li className='logout-item'>
                      <a onClick={logoutUser} href='#'>LOGOUT</a>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default TopHeader
