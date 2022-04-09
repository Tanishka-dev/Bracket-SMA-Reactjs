import React from "react";
import { Navigate } from "react-router-dom";
import { useUserData } from "../features/User/userSlice";

const PrivateRoute = ({ Component }) => {
   const user = useUserData();
   return <>{user.isLoggedIn ? Component : <Navigate to={"/login"} />}</>;
};

export default PrivateRoute;
