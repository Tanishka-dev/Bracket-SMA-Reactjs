import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
   getAuth,
   createUserWithEmailAndPassword,
   updateProfile,
} from "firebase/auth";

export default function RegisterPage() {
   const [email, setEmail] = useState("");
   const [name, setName] = useState("");
   const [password, setPass] = useState("");
   const [conPass, setConPass] = useState("");
   const navigation = useNavigate();

   const [error, setError] = useState("");

   const register = async (e) => {
      e.preventDefault();
      if (password !== conPass) {
         setError("Passwords didn't match!");
         return;
      }
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
         .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            if (!auth.currentUser) return;

            updateProfile(auth.currentUser, {
               displayName: name,
            })
               .then(() => {
                  // Profile updated!
                  // ...
               })
               .catch((error) => {
                  // An error occurred
                  // ...
               });
            navigation("/login");
         })
         .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setError(errorMessage.split(": ")[1]);
         });
   };

   return (
      <>
         <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
               <Link to="/">
                  <img src="/social-media.png" className="mx-auto w-32"></img>
               </Link>
               <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Sign up to your account
               </h2>
               <div className="mt-2 text-center text-sm text-gray-600">
                  Or{" "}
                  <Link to="/login">
                     <p className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign up
                     </p>
                  </Link>
               </div>
            </div>

            <form
               className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
               onSubmit={register}
            >
               <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                  <div className="flex flex-col gap-6">
                     <div>
                        <label
                           htmlFor="name"
                           className="block text-sm font-medium text-gray-700"
                        >
                           Name
                        </label>
                        <div className="mt-1">
                           <input
                              id="name"
                              name="name"
                              type="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              autoComplete="name"
                              required
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                           />
                        </div>
                     </div>
                     <div>
                        <label
                           htmlFor="email"
                           className="block text-sm font-medium text-gray-700"
                        >
                           Email address
                        </label>
                        <div className="mt-1">
                           <input
                              id="email"
                              name="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              autoComplete="email"
                              required
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                           />
                        </div>
                     </div>
                     <div>
                        <label
                           htmlFor="password"
                           className="block text-sm font-medium text-gray-700"
                        >
                           Password
                        </label>
                        <div className="mt-1">
                           <input
                              id="password"
                              name="password"
                              type="password"
                              value={password}
                              onChange={(e) => setPass(e.target.value)}
                              autoComplete="current-password"
                              required
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                           />
                        </div>
                     </div>
                     <div>
                        <label
                           htmlFor="password"
                           className="block text-sm font-medium text-gray-700"
                        >
                           Confirm Password
                        </label>
                        <div className="mt-1">
                           <input
                              id="conPassword"
                              name="conPass"
                              type="password"
                              value={conPass}
                              onChange={(e) => setConPass(e.target.value)}
                              autoComplete="confirm-password"
                              required
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                           />
                        </div>
                     </div>

                     {error && (
                        <p className="text-rose-600 text-sm">*{error}</p>
                     )}

                     <div className="flex items-center justify-between">
                        <div className="flex items-center">
                           <input
                              id="remember-me"
                              name="remember-me"
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                           />
                           <label
                              htmlFor="remember-me"
                              className="ml-2 block text-sm text-gray-900"
                           >
                              Remember me
                           </label>
                        </div>

                        <div className="text-sm">
                           <a
                              href="#"
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                           >
                              Forgot your password?
                           </a>
                        </div>
                     </div>
                     <div>
                        <button
                           type="submit"
                           className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                           Sign up
                        </button>
                     </div>
                  </div>
               </div>
            </form>
         </div>
      </>
   );
}
