import { useLocation, Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectCurrentUser, selectMainRole, selectCurrentToken, selectCurrentRoles } from "../../featuers/authSlice";

const RequireAuth = () => {
    let acctoken = useSelector(selectCurrentToken);
    let mainrole = useSelector(selectMainRole);
    const location = useLocation();
    let user = useSelector(selectCurrentUser);
    let roles = useSelector(selectCurrentRoles);
    let currentstate = useSelector((state) => state);


    return (
        acctoken
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    )
}
export default RequireAuth