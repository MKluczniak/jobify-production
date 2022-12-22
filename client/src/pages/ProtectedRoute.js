import { useAppContext } from "../context/appContext"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext()

  if (!user) {
    return <Navigate to="/landing" />
  }

  //   return <h1>there is no user</h1>
  return children
}

export default ProtectedRoute
