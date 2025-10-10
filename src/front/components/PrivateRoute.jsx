import useGlobalReducer from "../hooks/useGlobalReducer";
import { Navigate } from "react-router-dom"

const PrivateRoute = ({ children, allweddRoles }) => {
    const NotAuthorized = () => <h1>Not authorized</h1>
    const { store: { user } } = useGlobalReducer()

    if (!user){
        return <Navigate to='/' replace />
    }

    if(!allowedRoles.includes(user.role)){
        return <NotAuthorized />
    }

    return children
}

export default PrivateRoute