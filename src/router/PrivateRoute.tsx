import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute() {
  const { token } = useAuth()

  if (!token) return <Navigate to="/admin/login" replace />

  return <Outlet />
}
