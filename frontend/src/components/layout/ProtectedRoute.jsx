import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  if (!isLoggedIn) return <Navigate to="/admin/login" replace />
  return children
}

export default ProtectedRoute