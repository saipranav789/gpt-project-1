import React from "react";
import { Route, Routes as AppRoutes } from "react-router-dom";
import "./App.css";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import { AuthContextProvider } from "../context/AuthContext";
import PrivateRoute from "../routes/PrivateRoute";
import PrivateRouteSignUp from "../routes/PrivateRouteSignUp";
import NavBar from "../components/Navigation/NavBar";
import Error404Page from "../pages/Error404Page";
import LandingPage from "../pages/Landing";

function App() {
  
  return (
    <>
       <AuthContextProvider>
          <div className="App">
            <header >
              <NavBar />
            </header>
            <AppRoutes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<PrivateRoute />}>
                <Route path="/home" element={<HomePage />} />
              </Route>
              <Route path="/login"  element={<PrivateRouteSignUp />}>
                <Route path="/login" element={<Login />} />
              </Route>
              <Route path="/signup"  element={<PrivateRouteSignUp />}>
                <Route path="/signup" element={<SignUp />} />
              </Route>
              {/* <Route path="/signout" element={<SignOutButton />} /> */}
              <Route path="/*" element={<Error404Page />}></Route>
            </AppRoutes>
          </div>
      </AuthContextProvider>
    </>
  )
}

export default App

 {/* <Route path="/account" element={<PrivateRoute />}>
                <Route path="/account" element={<Account />} />
              </Route>
              <Route path="/profile" element={<PrivateRouteProfile />}>
                <Route path="/profile" element={<Profile />} />
              </Route> */}
               {/* <Route path="/profile-details/:id" element={<ProfileFullView/>}/> */}