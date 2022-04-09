import { React } from "react";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import {
   setLogin,
   setLogout,
   useUserData,
} from "../src/features/User/userSlice";
function App() {
   return (
      <div className="App">
         <Routes>
            <Route path="/" element={<PrivateRoute Component={<Home />} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
         </Routes>
      </div>
   );
}

export default App;
