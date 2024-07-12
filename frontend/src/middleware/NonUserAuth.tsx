import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import IState from "../interfaces/stateInterface";

const NonUserAuth = () => {
  const role = useSelector((state: IState) => state.user.role);

  return (
    <>
      {role === null ? (
        <Outlet />
      ) : role === "Teacher" || role === "Student" ? (
        <Navigate to="/" />
      ) : role === "Admin" ? (
        <Navigate to="/admin" />
      ) : null}
    </>
  );
};

export default NonUserAuth;
