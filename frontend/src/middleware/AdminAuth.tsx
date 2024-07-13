import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import IState from "../interfaces/stateInterface";

const AdminAuth = () => {
  const role = useSelector((state: IState) => state.user.role);

  return (
    <>
      {role === "Admin" ? (
        <Outlet />
      ) : role === "Teacher" || role === "Student" ? (
        <Navigate to="/" />
      ) : role === null ? (
        <Navigate to="/sign-in" />
      ) : null}
    </>
  );
};

export default AdminAuth;
