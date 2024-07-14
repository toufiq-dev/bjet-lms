import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import IState from "../interfaces/stateInterface";

const TeacherAuth = () => {
  const role = useSelector((state: IState) => state.user.role);

  return (
    <>
      {role === "Teacher" ? (
        <Outlet />
      ) : role === "Student" ? (
        <Navigate to="/" />
      ) : role === "Admin" ? (
        <Navigate to="/admin" />
      ) : role === null ? (
        <Navigate to="/sign-in" />
      ) : null}
    </>
  );
};

export default TeacherAuth;
