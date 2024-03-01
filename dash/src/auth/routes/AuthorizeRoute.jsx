import { useLocation, Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { toast } from 'react-toastify';
import { selectCurrentRoles, selectMainRole } from "../../featuers/authSlice";

function AuthorizeRoute({ checkrole }) {
  // const roles = useSelector(selectCurrentRoles); 
  const roles = useSelector(selectCurrentRoles);
  const location = useLocation();
  // console.log(permissions.find(p => p.name ===checkpermission));
  return (
    (roles.find(r => r.name === checkrole)) ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />
  )
}

export default AuthorizeRoute