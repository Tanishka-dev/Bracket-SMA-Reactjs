import {
   addDoc,
   collection,
   deleteDoc,
   doc,
   onSnapshot,
   serverTimestamp,
   updateDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import ButtonPrimary from "./ButtonPrimary";
import { useUserData } from "../features/User/userSlice";
import { auth, db } from "../index";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

const Posts = ({ postId, caption, imgUrl, username, photoURL }) => {
   const [comments, setComments] = useState([]);
   const [comment, setComment] = useState("");
   const [captionEdit, setCaptionEdit] = useState(caption);
   const [editCap, setEditCap] = useState(false);
   const [showCmnt, setShowCmnt] = useState(false);
   const [toggle, settoggle] = useState(false);
   const [colorChange, setcolorChange] = useState(false);
   const user = useUserData();

   useEffect(() => {
      const unsub = onSnapshot(
         collection(db, "posts", postId, "comments"),
         (doc) => {
            setComments(
               doc.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
            );
         }
      );

      return () => {
         unsub();
      };
   }, [postId]);

   const addComment = (username, e) => {
      e.preventDefault();

      const comtCollection = collection(db, "posts", postId, "comments");

      addDoc(comtCollection, {
         comment: comment,
         username: username,
         timestamp: serverTimestamp(),
         replies: [],
      }).then(function () {
         console.log("");
      });

      setComment("");
   };

   const editPost = () => {
      updateDoc(doc(db, "posts", postId), {
         caption: captionEdit,
      });
      setEditCap(false);
   };

   const deletePost = () => {
      deleteDoc(doc(db, "posts", postId))
         .then((res) => console.log(res))
         .catch((err) => console.log(err));
   };

   return (
      <div
         className="  max-w-xl mx-auto mb-8 p-6 border-gray-300 border rounded-3xl shadow-2xl transition duration-500 ease-in-out 
      hover:bg-slate-100 transform 
      hover:-translate-y-1 hover:scale-105  
      "
      >
         <div className=" flex flex-row ">
            {photoURL ? (
               <img
                  className="h-12 w-12 rounded-lg m-3"
                  alt={username}
                  src={photoURL}
               ></img>
            ) : (
               <p
                  style={{
                     backgroundColor: `#${Math.floor(
                        Math.random() * 16777215
                     ).toString(16)}`,
                  }}
                  className="text-white m-3 rounded-lg h-12 w-12  items-center text-xl font-bold flex justify-center"
               >
                  {username.slice(0, 1)}
               </p>
            )}

            <h4 className="flex mt-5">{username}</h4>
            {user.user.displayName == username && (
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 ml-96"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  onClick={() => settoggle((prev) => !prev)}
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
               </svg>
            )}
         </div>

         <Dialog
            open={toggle}
            TransitionComponent={Transition}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
         >
            <DialogContent className="flex flex-col gap-3 cursor-pointer">
               <DialogContentText
                  id="alert-dialog-slide-description"
                  onClick={() => {
                     setEditCap((prev) => !prev);
                     settoggle(false);
                  }}
               >
                  Edit Caption
               </DialogContentText>
               <DialogContentText
                  id="alert-dialog-slide-description"
                  onClick={() => deletePost()}
               >
                  Delete Post
               </DialogContentText>
            </DialogContent>
            <Button onClick={() => settoggle(false)}>Close</Button>
         </Dialog>

         <img className="rounded-3xl shadow-sm w-full" src={imgUrl} />
         <div className="posts__caption flex justify-between ">
            <div className=" flex flex-row gap-3">
               <strong>{username} </strong>
               {!editCap ? (
                  <p>{caption}</p>
               ) : (
                  <input
                     className="appearance-none w-fit h-6 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                     type="text"
                     value={captionEdit}
                     onChange={(e) => setCaptionEdit(e.target.value)}
                  />
               )}
            </div>
         </div>
         <div className="flex flex-row gap-3 posts__caption  ">
            <svg
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 20 20"
               fill="currentColor"
               onClick={() => setcolorChange((prev) => !prev)}
               className={
                  colorChange
                     ? "fill-rose-600 h-8 w-8 cursor-pointer"
                     : "fill-stone-500 h-8 w-8 cursor-pointer hover:animate-bounce "
               }
            >
               <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
               />
            </svg>

            <svg
               xmlns="http://www.w3.org/2000/svg"
               className=" h-8 w-8 text-stone-500 cursor-pointer hover:animate-bounce hover:text-blue-600"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
               strokeWidth="2"
               onClick={() => setShowCmnt((prev) => !prev)}
            >
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
               />
            </svg>
            {editCap ? (
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => editPost()}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="fill-black h-7 w-7"
               >
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
               </svg>
            ) : (
               ""
            )}
         </div>
         {showCmnt ? (
            <div>
               <div className="posts__comment">
                  {comments.map((comment) => (
                     <div key={comment.id}>
                        <Comment
                           postId={postId}
                           id={comment.id}
                           username={user.user.displayName}
                           comment={comment}
                        />
                        {comment.data.replies?.map((reply, index) => {
                           let _comment = {};
                           _comment.data = reply;
                           return (
                              <div key={index} className="pl-4">
                                 <Comment
                                    comment={_comment}
                                    replies={comment.data?.replies}
                                    postId={postId}
                                    index={index}
                                    id={comment.id}
                                    username={user.user.displayName}
                                 />
                              </div>
                           );
                        })}
                     </div>
                  ))}
               </div>

               {auth.currentUser ? (
                  <form
                     className="flex gap-2 m-3"
                     onSubmit={(e) => addComment(user.user.displayName, e)}
                  >
                     <input
                        type="text"
                        className="appearance-none block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                     />
                     <Button
                        disabled={!comment}
                        type="submit"
                        className=" w-fit font-medium text-xl leading-tight uppercase  shadow-sm"
                     >
                        ADD
                     </Button>
                  </form>
               ) : (
                  ""
               )}
            </div>
         ) : (
            ""
         )}
      </div>
   );
};

const Comment = ({ comment, id, replies, postId, index, username }) => {
   const [reply, setReply] = useState("");
   const [edit, setEdit] = useState(false);
   const [commentEdit, setCommentEdit] = useState(comment.data.comment);
   const [isReply, setIsReply] = useState(false);
   const deleteCmnt = (e) => {
      deleteDoc(doc(db, "posts", postId, "comments", id))
         .then((res) => console.log(res))
         .catch((err) => console.log(err));
   };

   const editCmnt = (e) => {
      updateDoc(doc(db, "posts", postId, "comments", id), {
         comment: commentEdit,
      });
      setEdit(false);
   };

   const replyComment = (e) => {
      e.preventDefault();

      const comt = doc(db, "posts", postId, "comments", id);

      if (replies) {
         updateDoc(comt, {
            replies: [...replies, { username: username, comment: reply }],
         }).then(function () {
            setReply("");
            console.log("");
         });
      } else {
         updateDoc(comt, {
            replies: [{ username: username, comment: reply }],
         }).then(function () {
            setReply("");
            console.log("");
         });
      }
   };

   return (
      <div key={comment.id} className="">
         <div className="flex flex-col gap-1">
            <div className="flex justify-between">
               <div className="flex justify-between w-full gap-1">
                  <div className="flex-col">
                     <strong>{comment.data.username}</strong>

                     {!edit ? (
                        <p>{comment.data.comment}</p>
                     ) : (
                        <input
                           className="appearance-none block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                           type="text"
                           value={commentEdit}
                           onChange={(e) => setCommentEdit(e.target.value)}
                        />
                     )}
                     <div className="mt-2 flex flex-row gap-5 text-blue-500 text-xs cursor-pointer ">
                        {comment.data?.replies?.length >= 0 && (
                           <>
                              <h6
                                 onClick={() => deleteCmnt()}
                                 className="hover:text-stone-500"
                              >
                                 Delete
                              </h6>
                              {edit ? (
                                 <h6
                                    onClick={() => editCmnt()}
                                    className="hover:text-stone-500"
                                 >
                                    Save
                                 </h6>
                              ) : (
                                 <h6
                                    onClick={() => setEdit((prev) => !prev)}
                                    className="hover:text-stone-500"
                                 >
                                    Edit
                                 </h6>
                              )}
                           </>
                        )}
                        {replies && replies.length - 1 === index && (
                           <>
                              {auth.currentUser && isReply ? (
                                 <form
                                    className="flex w-full justify-between gap-6 mb-2"
                                    onSubmit={(e) => replyComment(e)}
                                 >
                                    <input
                                       type="text"
                                       className="appearance-none block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                       placeholder="Reply"
                                       value={reply}
                                       onChange={(e) =>
                                          setReply(e.target.value)
                                       }
                                    />
                                 </form>
                              ) : (
                                 <p
                                    onClick={() => setIsReply((s) => !s)}
                                    className="hover:text-stone-500"
                                 >
                                    Reply
                                 </p>
                              )}
                           </>
                        )}
                        {comment.data?.replies?.length === 0 && (
                           <>
                              {auth.currentUser && isReply ? (
                                 <form
                                    className="flex w-full justify-between gap-6 mb-2"
                                    onSubmit={replyComment}
                                 >
                                    <input
                                       type="text"
                                       className="appearance-none block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                       placeholder="Reply"
                                       value={reply}
                                       onChange={(e) =>
                                          setReply(e.target.value)
                                       }
                                    />
                                 </form>
                              ) : (
                                 <p
                                    onClick={() => setIsReply((s) => !s)}
                                    className="hover:text-stone-500"
                                 >
                                    Reply
                                 </p>
                              )}
                           </>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};
export default Posts;
