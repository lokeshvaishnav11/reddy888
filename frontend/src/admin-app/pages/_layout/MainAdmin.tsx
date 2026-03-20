import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import User, { RoleType } from '../../../models/User'
import { useNavigateCustom } from '../../../pages/_layout/elements/custom-link'
import { selectUserData } from '../../../redux/actions/login/loginSlice'
import { useAppSelector } from '../../../redux/hooks'
import authService from '../../../services/auth.service'
import Footer from './elements/footer'
import Sidebar from './elements/sidebar'
import TopHeader from './elements/topHeader'
import PageTitle from './elements/pageTitle'
import MarqueeAnnouncement from './elements/marqueeAnnouncement'
import './admin-layout.css'

const MainAdmin = () => {
  const userState = useAppSelector<{ user: User }>(selectUserData)
  const navigate = useNavigateCustom()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    const auth = authService.isLoggedIn()
    if (!auth || userState.user.role === RoleType.user) {
      return navigate.go('/admin/login')
    }
  }, [userState.user])
  
  const location = useLocation();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }
  
  return (
    <div className='admin-layout'>
      <TopHeader onMenuToggle={toggleMobileMenu} />
      <PageTitle />
      <MarqueeAnnouncement />
      <div className='admin-main-content'>
        <ToastContainer />
        <div className='admin-content-area'>
            {(location.pathname.includes('odds/') || location.pathname.includes('casino/')) &&
              <div className='container-fluid'>
                <div className='row'>
                  <div className='col-md-12 mt-1'>
                    <Outlet></Outlet>
                  </div>
                </div>
              </div>
            }
            {(!location.pathname.includes('odds/') && !location.pathname.includes('casino/')) &&
              <Outlet></Outlet>
            }
        </div>
        <Footer />
      </div>
    </div>
  )
}
export default MainAdmin
