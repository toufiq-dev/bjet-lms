import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import IState from "../interfaces/stateInterface";

const UserAuth = () => {
  const role = useSelector((state: IState) => state.user.role);

  return (
    <>
      {role === "Teacher" || role === "Student" ? (
        <Outlet />
      ) : role === "Admin" ? (
        <Navigate to="/admin" />
      ) : role === null ? (
        <Navigate to="/sign-in" />
      ) : null}
    </>
  );
};

export default UserAuth;
