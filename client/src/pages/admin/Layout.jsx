import React from 'react'
import AdminNavbar from '../../components/admin/AdminNavbar'
import Adminsidebar from '../../components/admin/Adminsidebar'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <>
      <AdminNavbar />
      <div className='flex'>
        <Adminsidebar/>
        <div className='flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto'>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Layout