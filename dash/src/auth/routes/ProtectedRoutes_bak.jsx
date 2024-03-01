import { useLocation, Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectCurrentUser,selectCurrentToken,selectCurrentRoles } from "../../featuers/authSlice";

const RequireAuth = (checkrole) => {
    const token = useSelector(selectCurrentToken);
    const location = useLocation();
    const user = useSelector(selectCurrentUser);
    const roles = useSelector(selectCurrentRoles);  
    return (
        token
            ? (roles.find(c => c.name ===checkrole))? <Outlet /> : <Navigate to="/unauthorized" state={{ from: location }} replace />
            : <Navigate to="/login" state={{ from: location }} replace />
    )
}
export default RequireAuth