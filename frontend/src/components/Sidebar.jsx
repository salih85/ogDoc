import React from "react";
import {
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CNavItem,
  CNavTitle,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import {
  cilHome,
  cilPencil,
  cilBold,
  cilAccountLogout,
} from "@coreui/icons";

import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/axios"; // import axios instance

export const Sidebar = () => {
  const navigate = useNavigate();

  // DEFINE LOGOUT HANDLER HERE
  const handleLogout = async (e) => {
    e.preventDefault(); // stop NavLink default behavior

    try {
      await api.post("/api/auth/logout"); // clears cookie
      navigate("/login", { replace: true }); // redirect
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <CSidebar className="border-end h-screen bg-slate-400" unfoldable>
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand>
          <img src="/images/Logo.png" alt="Blogify" />
        </CSidebarBrand>
      </CSidebarHeader>

      <CSidebarNav>
        <CNavTitle>BLOGIFY</CNavTitle>

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

        <CNavItem>
          <NavLink to="/viewPost" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilBold} /> View Blog
          </NavLink>
        </CNavItem>

        {/* 🔴 LOGOUT BUTTON */}
        <CNavItem className="mt-auto">
          <NavLink
            to="#"
            onClick={handleLogout}
            className="nav-link text-danger"
          >
            <CIcon
              customClassName="nav-icon text-danger"
              icon={cilAccountLogout}
            />{" "}
            Logout
          </NavLink>
        </CNavItem>
      </CSidebarNav>
    </CSidebar>
  );
};

export default Sidebar;
