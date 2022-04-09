import { store } from "./app/store";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

const firebaseApp = {
   apiKey: "AIzaSyAB_h55Yp6URwkXQN2H_6iKDq-r7KzZkNQ",
   authDomain: "instagram-clone-b5e74.firebaseapp.com",
   projectId: "instagram-clone-b5e74",
   storageBucket: "instagram-clone-b5e74.appspot.com",
   messagingSenderId: "526667561957",
   appId: "1:526667561957:web:bc44e238d47b8b2fff0d0c",
};

export const app = initializeApp(firebaseApp);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore();
export const auth = getAuth();

ReactDOM.render(
   <React.StrictMode>
      <Provider store={store}>
         <BrowserRouter>
            <App />
         </BrowserRouter>
      </Provider>
   </React.StrictMode>,
   document.getElementById("root")
);
