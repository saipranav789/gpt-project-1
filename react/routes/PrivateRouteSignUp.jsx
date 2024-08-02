import { Navigate, Outlet } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const PrivateRouteSignUp = () => {
  const { user } = useContext(AuthContext);
  return user ? <Navigate to="/home" />: <Outlet />  ;
};

export default PrivateRouteSignUp;