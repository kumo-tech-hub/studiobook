import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '@/components/layout/ProtectedRoute'

import LandingPage from '@/pages/public/LandingPage'
import SelectPackage from '@/pages/public/SelectPackage'
import SelectSchedule from '@/pages/public/SelectSchedule'
import CustomerForm from '@/pages/public/CustomerForm'
import Confirmation from '@/pages/public/Confirmation'
import BookingSuccess from '@/pages/public/BookingSuccess'

import Login from '@/pages/admin/Login'
import Dashboard from '@/pages/admin/Dashboard'
import BookingList from '@/pages/admin/BookingList'
import BookingDetail from '@/pages/admin/BookingDetail'
import ManageSlots from '@/pages/admin/ManageSlots'
import ManagePackages from '@/pages/admin/ManagePackages'
import Reports from '@/pages/admin/Reports'
import Settings from '@/pages/admin/Settings'
import AdminLayout from '@/components/layout/AdminLayout'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/booking/paket" element={<SelectPackage />} />
        <Route path="/booking/jadwal" element={<SelectSchedule />} />
        <Route path="/booking/data-diri" element={<CustomerForm />} />
        <Route path="/booking/konfirmasi" element={<Confirmation />} />
        <Route path="/booking/sukses" element={<BookingSuccess />} />

        {/* Admin */}
        <Route path="/admin/login" element={<Login />} />
        
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bookings" element={<BookingList />} />
          <Route path="bookings/:id" element={<BookingDetail />} />
          <Route path="slots" element={<ManageSlots />} />
          <Route path="packages" element={<ManagePackages />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App