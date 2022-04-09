import {
   addDoc,
   collection,
   deleteDoc,
   doc,
   onSnapshot,
   query,
   serverTimestamp,
   updateDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import ButtonPrimary from "./ButtonPrimary";
import { useUserData } from "../features/User/userSlice";
import { auth, db } from "../index";
const Posts = ({ postId, caption, imgUrl, username }) => {
   const [comments, setComments] = useState([]);
   const [comment, setComment] = useState("");
   const [captionEdit, setCaptionEdit] = useState(caption);
   const [editCap, setEditCap] = useState(false);

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

   const addComment = (username) => {
      const comtCollection = collection(db, "posts", postId, "comments");

      addDoc(comtCollection, {
         comment: comment,
         username: username,
         timestamp: serverTimestamp(),
         replies: [],
      }).then(function () {
         console.log("Added comment");
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

   console.log(user);

   return (
      <div className="max-w-xl border border-gray-400 mx-auto mb-6">
         <div className="posts__heading">
            {user.user.photoURL ? (
               <img
                  className="h-10 w-10 rounded-full mr-2"
                  alt={username}
                  src={user.user.photoURL}
               ></img>
            ) : (
               ""
            )}

            <h4>{username}</h4>
         </div>
         <img className="w-full" src={imgUrl} />
         <div className="posts__caption flex justify-between">
            <div className="">
               <strong>{username} </strong>
               {!editCap ? (
                  <p>{caption}</p>
               ) : (
                  <input
                     className="appearance-none block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                     type="text"
                     value={captionEdit}
                     onChange={(e) => setCaptionEdit(e.target.value)}
                  />
               )}
            </div>
            <div className="m-4">
               {editCap ? (
                  <ButtonPrimary
                     size="small"
                     text="Save"
                     onClick={() => editPost()}
                  />
               ) : (
                  <ButtonPrimary
                     size="small"
                     text="Edit"
                     onClick={() => setEditCap((prev) => !prev)}
                  />
               )}
               <ButtonPrimary
                  size="small"
                  text="Delete"
                  onClick={() => deletePost()}
               />
            </div>
         </div>

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
               className="flex gap-4"
               onSubmit={() => addComment(user.user.displayName)}
            >
               <input
                  type="text"
                  className="appearance-none block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
               />
               <ButtonPrimary
                  size="small"
                  text="Add"
                  disabled={!comment}
                  type="submit"
               />
            </form>
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
            console.log("Added comment");
         });
      } else {
         updateDoc(comt, {
            replies: [{ username: username, comment: reply }],
         }).then(function () {
            setReply("");
            console.log("Added comment");
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
                           <ButtonPrimary
                              size="small"
                              text="Delete"
                              onClick={deleteCmnt}
                           />
                           {edit ? (
                              <ButtonPrimary
                                 size="small"
                                 text="Save"
                                 onClick={() => editCmnt()}
                              />
                           ) : (
                              <ButtonPrimary
                                 size="small"
                                 text="Edit"
                                 onClick={() => setEdit((prev) => !prev)}
                              />
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
                           onSubmit={replyComment}
                        >
                           <input
                              type="text"
                              className="appearance-none block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="Add a comment..."
                              value={reply}
                              onChange={(e) => setReply(e.target.value)}
                           />
                           <ButtonPrimary
                              size="small"
                              text="Add"
                              type="submit"
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
                              placeholder="Add a comment..."
                              value={reply}
                              onChange={(e) => setReply(e.target.value)}
                           />
                           <ButtonPrimary
                              size="small"
                              text="Add"
                              type="submit"
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
