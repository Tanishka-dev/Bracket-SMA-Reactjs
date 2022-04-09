import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogout } from "../features/User/userSlice";
import ButtonPrimary from "./ButtonPrimary";

const Header = () => {
   const navigate = useNavigate();
   const user = useSelector((state) => state.user);
   const dispatch = useDispatch();

   return (
      <header className="flex shadow-md sticky top-0 bg-white mb-6 items-center justify-between px-10 py-2 border-b border-gray-300">
         <img className="h-12 w-12" src="/social-media.png" alt="" />

         <ButtonPrimary
            size="medium"
            text="Log out"
            onClick={() => {
               dispatch(setLogout());
               navigate("/");
            }}
         />
      </header>
   );
};

export default Header;
