import React from "react";
import "./Home.css";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setLogin, setLogout, useUserData } from "../features/User/userSlice";
import Posts from "../components/Posts";
import ImageUpload from "../components/ImageUpload";
import Header from "../components/Header";
import { db } from "../index";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
const Home = () => {
   const dispatch = useDispatch();

   const [posts, setPosts] = useState([]);

   useEffect(() => {
      const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
      const unsub = onSnapshot(q, (doc) => {
         setPosts(doc.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
      });

      return () => unsub;
   }, []);

   const user = useUserData();

   return (
      <div className="home">
         <Header />
         {posts.map(({ id, post }) => (
            <Posts
               key={id}
               photoURL={post.profileImg}
               postId={id}
               caption={post.caption}
               imgUrl={post.imgUrl}
               username={post.username}
            />
         ))}
         s{user.isLoggedIn && <ImageUpload username={user.user.displayName} />}
      </div>
   );
};

export default Home;
