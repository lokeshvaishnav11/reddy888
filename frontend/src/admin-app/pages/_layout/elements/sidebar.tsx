import React from 'react'
import { useLocation } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import { CustomLink } from '../../../../pages/_layout/elements/custom-link'
import User, { RoleType } from '../../../../models/User'
import { useAppSelector } from '../../../../redux/hooks'
import { selectUserData } from '../../../../redux/actions/login/loginSlice'
import casinoService from '../../../../services/casino.service'

interface SidebarProps {
  mobileOpen?: boolean
  onClose?: () => void
}

const Sidebar = ({ mobileOpen, onClose }: SidebarProps) => {
  const userState = useAppSelector<{ user: User }>(selectUserData)
  const location = useLocation()
  const [gameList, setGameList] = React.useState([])
  const [openMenus, setOpenMenus] = React.useState<string[]>([])

  React.useEffect(() => {
    casinoService.getCasinoList().then((res: AxiosResponse<any>) => {
      setGameList(res.data.data)
    })
    
    // Auto-open active menu on load
    if (isActive('accountstatement') || isActive('unsettledbet') || isActive('profitloss') || isActive('game-reports')) {
      setOpenMenus(prev => [...prev, 'reports'])
    }
    if (isActive('depositstatement') || isActive('withdrawstatement')) {
      setOpenMenus(prev => [...prev, 'transactions'])
    }
    if (isActive('casino')) {
      setOpenMenus(prev => [...prev, 'casino'])
    }
    if (isActive('sports-list') || isActive('messages') || isActive('casino-list') || isActive('payment-method') || isActive('update-whatsapp')) {
      setOpenMenus(prev => [...prev, 'settings'])
    }
  }, [location.pathname])

  const isActive = (path: string) => {
    return location.pathname.includes(path)
  }

  const toggleSubmenu = (menuName: string) => {
    setOpenMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(item => item !== menuName)
        : [...prev, menuName]
    )
  }

  const isMenuOpen = (menuName: string) => {
    return openMenus.includes(menuName)
  }

  return (
    <>
      {mobileOpen && <div className='sidebar-overlay' onClick={onClose}></div>}
      <div className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <button className='sidebar-close-mobile' onClick={onClose}>
          <i className='fas fa-times'></i>
        </button>
      
        <nav className='sidebar-nav'>
        <ul className='sidebar-menu'>
          <li className={isActive('combined-dashboard') || location.pathname === '/admin' ? 'active' : ''}>
            <CustomLink to={`/combined-dashboard`} onClick={onClose}>
              <i className='fas fa-tachometer-alt'></i>
              <span>Dashboard</span>
            </CustomLink>
          </li>

          <li className={isActive('list-clients') ? 'active' : ''}>
            <CustomLink to={`/list-clients/${userState?.user?.username}`} onClick={onClose}>
              <i className='fas fa-users'></i>
              <span>List of Clients</span>
            </CustomLink>
          </li>

          <li className={isActive('market-analysis') ? 'active' : ''}>
            <CustomLink to={'/market-analysis'} onClick={onClose}>
              <i className='fas fa-chart-line'></i>
              <span>Market Analysis</span>
            </CustomLink>
          </li>

          <li className={`${isActive('accountstatement') || isActive('unsettledbet') || isActive('profitloss') || isActive('game-reports') ? 'active' : ''} ${isMenuOpen('reports') ? 'menu-open' : ''}`}>
            <a className='has-submenu' onClick={() => toggleSubmenu('reports')}>
              <i className='fas fa-file-alt'></i>
              <span>Reports</span>
              <i className='fas fa-chevron-down submenu-icon'></i>
            </a>
            <ul className={`submenu ${isMenuOpen('reports') ? 'open' : ''}`}>
              <li>
                <CustomLink to='/accountstatement'>
                  Account Statement
                </CustomLink>
              </li>
              <li>
                <CustomLink to='/unsettledbet'>
                  Current Bets
                </CustomLink>
              </li>
              {userState?.user?.role === RoleType.admin && (
                <li>
                  <CustomLink to='/unsettledbet/deleted'>
                    Deleted Bets
                  </CustomLink>
                </li>
              )}
              <li>
                <CustomLink to='/game-reports'>
                  Game Reports
                </CustomLink>
              </li>
              <li>
                <CustomLink to='/profitloss'>
                  Profit And Loss
                </CustomLink>
              </li>
            </ul>
          </li>

          <li className={`${isActive('depositstatement') || isActive('withdrawstatement') ? 'active' : ''} ${isMenuOpen('transactions') ? 'menu-open' : ''}`}>
            <a className='has-submenu' onClick={() => toggleSubmenu('transactions')}>
              <i className='fas fa-exchange-alt'></i>
              <span>Transactions</span>
              <i className='fas fa-chevron-down submenu-icon'></i>
            </a>
            <ul className={`submenu ${isMenuOpen('transactions') ? 'open' : ''}`}>
              <li>
                <CustomLink to='/depositstatement'>
                  Deposit
                </CustomLink>
              </li>
              <li>
                <CustomLink to='/withdrawstatement'>
                  Withdraw
                </CustomLink>
              </li>
            </ul>
          </li>

          <li className={`${isActive('casino') ? 'active' : ''} ${isMenuOpen('casino') ? 'menu-open' : ''}`}>
            <a className='has-submenu' onClick={() => toggleSubmenu('casino')}>
              <i className='fas fa-dice'></i>
              <span>Live Casino</span>
              <i className='fas fa-chevron-down submenu-icon'></i>
            </a>
            <ul className={`submenu casino-submenu ${isMenuOpen('casino') ? 'open' : ''}`}>
              {gameList?.length > 0 &&
                gameList.map((Item: any, key: number) => {
                  return (
                    <li key={key}>
                      <CustomLink to={`/casino/${Item.slug}`}>
                        {Item.title}
                      </CustomLink>
                    </li>
                  )
                })}
            </ul>
          </li>

          <li className={`${isActive('sports-list') || isActive('messages') || isActive('casino-list') || isActive('payment-method') || isActive('update-whatsapp') ? 'active' : ''} ${isMenuOpen('settings') ? 'menu-open' : ''}`}>
            <a className='has-submenu' onClick={() => toggleSubmenu('settings')}>
              <i className='fas fa-cog'></i>
              <span>Settings</span>
              <i className='fas fa-chevron-down submenu-icon'></i>
            </a>
            <ul className={`submenu ${isMenuOpen('settings') ? 'open' : ''}`}>
              {(userState?.user?.role === RoleType.admin) && (
                <>
                  <li>
                    <CustomLink to='/sports-list/active-matches'>
                      Block Markets
                    </CustomLink>
                  </li>
                  <li>
                    <CustomLink to='/messages'>
                      Messages
                    </CustomLink>
                  </li>
                  <li>
                    <CustomLink to={'/sports-list/matches'}>
                      Add Match List
                    </CustomLink>
                  </li>
                  <li>
                    <CustomLink to='/casino-list'>
                      Casino List
                    </CustomLink>
                  </li>
                </>
              )}
              <li>
                <CustomLink to='/payment-method'>
                  Payment Method
                </CustomLink>
              </li>
              <li>
                <CustomLink to='/update-whatsapp'>
                  Update Whatsapp
                </CustomLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      </div>
    </>
  )
}

export default Sidebar
