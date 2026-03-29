// useAuth — login, logout, register helpers
import { useAuthContext } from '../context/AuthContext'
export const useAuth = () => {
  const { user, setUser } = useAuthContext()
  const logout = () => { setUser(null); localStorage.removeItem('token') }
  return { user, logout }
}
