import AdminNavbar from '../../components/admin/AdminNavbar'
import Adminsidebar from '../../components/admin/Adminsidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { useEffect } from 'react'
import Loading from '../../components/Loading'
function Layout() {

  const {isAdmin, fetchIsAdmin}= useAppContext();

  useEffect(() => {
    fetchIsAdmin();
  },[])

  return isAdmin ?(
    <>
      <AdminNavbar />
      <div className='flex'>
        <Adminsidebar/>
        <div className='flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto'>
          <Outlet />
        </div>
      </div>
    </>
  ) : <Loading/>
}

export default Layout