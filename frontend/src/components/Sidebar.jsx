import { useEffect, useState } from 'react'
import {
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CNavItem,
  CNavTitle,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilHome, cilPencil, cilAccountLogout, cilNotes } from '@coreui/icons'
import { NavLink, useNavigate } from 'react-router-dom' 
import api from '../api/axios'




export const Sidebar = () => {
  const [theme,setTheme] = useState(localStorage.getItem('theme'))
    const navigate = useNavigate();
    const handleLogout = async () => {

    try {
      await api.post("/api/auth/logout");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
    }
  }


  useEffect(()=>{
    setTheme(localStorage.getItem('theme'))
  },[localStorage.getItem('theme')])

  return (
    <CSidebar className="border-end h-screen dark:bg-black dark:text-gray-400" unfoldable colorScheme={theme === 'dark' ? 'dark' : 'light'} size='sm'>
      <CSidebarHeader className="border-bottom d-flex justify-content-center align-items-center dark:bg-black dark:border-gray-700">
        <CSidebarBrand className="sidebar-brand d-flex align-items-center gap-2 dark:text-white">
  <CIcon icon={cilNotes} height={28} />
  <span className="brand-text">ogDoc</span>
</CSidebarBrand>


      </CSidebarHeader>
      <CSidebarNav className="dark:bg-black">
        <CNavTitle className="dark:text-gray-400">MENU</CNavTitle>

        <CNavItem>
          <NavLink to="/home" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilHome} /> Home
          </NavLink>
        </CNavItem>

        <CNavItem>
          <NavLink to="/create" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilPencil} /> Compose
          </NavLink>
        </CNavItem>
        <CNavItem className="mt-auto">
          <NavLink onClick={handleLogout} className="nav-link text-danger">
            <CIcon customClassName="nav-icon text-danger" icon={cilAccountLogout} /> Logout
          </NavLink>
        </CNavItem>

      </CSidebarNav>
    </CSidebar>
  )
}

