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

const Posts = ({ postId, caption, imgUrl, username }) => {
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
      <div className="max-w-xl mx-auto mb-6 border-gray-300 border rounded-3xl shadow-2xl ">
         <div className="posts__heading flex flex-row justify-items-end ">
            {user.user.photoURL && user.user.displayName == username ? (
               <img
                  className="h-12 w-12 rounded-xl mr-2"
                  alt={username}
                  src={user.user.photoURL}
               ></img>
            ) : (
               ""
            )}

            <h4>{username}</h4>
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
                     ? "fill-rose-600 h-6 w-6"
                     : "fill-stone-300 h-6 w-6"
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
               className="h-6 w-6 hover:transition-all"
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
                  <div className="flex-row">
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
                  </div>
                  <div className="posts__caption  gap-6">
                     {comment.data?.replies?.length >= 0 && (
                        <>
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="fill-red-600 h-4 w-4"
                              onClick={() => deleteCmnt()}
                           >
                              <path
                                 fill-rule="evenodd"
                                 d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                 clip-rule="evenodd"
                              />
                           </svg>

                           {edit ? (
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 onClick={() => editCmnt()}
                                 viewBox="0 0 20 20"
                                 fill="currentColor"
                                 className="fill-lime-500 h-4 w-4"
                              >
                                 <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                              </svg>
                           ) : (
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 20 20"
                                 fill="currentColor"
                                 onClick={() => setEdit((prev) => !prev)}
                                 className="fill-lime-500 h-4 w-4"
                              >
                                 <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                           )}
                        </>
                     )}
                  </div>
               </div>
            </div>
            <div className="flex gap-3">
               {replies && replies.length - 1 === index && (
                  <>
                     {auth.currentUser ? (
                        <form
                           className="flex w-full justify-between gap-6 mb-2"
                           onSubmit={(e) => replyComment(e)}
                        >
                           <input
                              type="text"
                              className="appearance-none block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="Reply"
                              value={reply}
                              onChange={(e) => setReply(e.target.value)}
                           />
                        </form>
                     ) : (
                        ""
                     )}
                  </>
               )}
               {comment.data?.replies?.length === 0 && (
                  <>
                     {auth.currentUser ? (
                        <form
                           className="flex w-full justify-between gap-6 mb-2"
                           onSubmit={replyComment}
                        >
                           <input
                              type="text"
                              className="appearance-none block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="Reply"
                              value={reply}
                              onChange={(e) => setReply(e.target.value)}
                           />
                        </form>
                     ) : (
                        ""
                     )}
                  </>
               )}
            </div>
         </div>
      </div>
   );
};
export default Posts;
