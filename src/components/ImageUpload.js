import React from "react";
import { useState } from "react";
import { db, storage } from "../index";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import ButtonPrimary from "./ButtonPrimary";
import { useUserData } from "../features/User/userSlice";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import TextField from "@mui/material/TextField";
const Transition = React.forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

const ImageUpload = () => {
   const [image, setImage] = useState(null);
   const [progress, setProgress] = useState(0);
   const [caption, setCaption] = useState("");
   const [open, setOpen] = useState(false);
   const user = useUserData();
   console.log(user.user.displayName);
   const handleChange = (e) => {
      if (e.target.files[0]) {
         setImage(e.target.files[0]);
      }
   };

   const handleUpload = (username) => {
      const metadata = {
         contentType: "image/jpeg",
      };
      const storageRef = ref(storage, "images/" + image.name);
      const uploadTask = uploadBytesResumable(storageRef, image, metadata);

      uploadTask.on(
         "state_changed",
         (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
               (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
         },
         (error) => {
            console.log(error);
            alert(error.message);
         },
         () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
               addDoc(collection(db, "posts"), {
                  timestamp: serverTimestamp(),
                  caption: caption,
                  imgUrl: downloadURL,
                  username: username,
               })
                  .then((data) => console.log(data))
                  .catch((err) => console.log(err));
               setProgress(0);
               setCaption("");
               setImage(null);
            });
         }
      );
   };

   return (
      <div>
         <div
            className="shadow-md rounded-full h-36 w-36 top-72 ml-4 absolute flex justify center  "
            onClick={(e) => setOpen((prev) => !prev)}
         >
            <svg
               xmlns="http://www.w3.org/2000/svg"
               className="lg:h-20 w-20 ml-7 mt-6  "
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
               stroke-width="1"
            >
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
               />
            </svg>
         </div>

         {open && (
            <Dialog
               open={open}
               TransitionComponent={Transition}
               keepMounted
               aria-describedby="alert-dialog-slide-description"
            >
               <DialogTitle className="flex justify-center text-zinc-700">
                  {"Select picture to upload!"}
               </DialogTitle>
               <DialogContent className="flex flex-col gap-5">
                  <Button type="button" className="  shadow-md  ">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                     >
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                     </svg>
                     <input
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        className=" font-normal text-sm border-blue-400"
                     />
                  </Button>
                  <TextField
                     onChange={(e) => setCaption(e.target.value)}
                     value={caption}
                     className="w-full"
                     placeholder="Caption"
                  />
                  <Button
                     onClick={() => {
                        handleUpload(user.user.displayName);
                        setOpen((prev) => !prev);
                     }}
                     type="button"
                     className=" w-full font-medium text-xl leading-tight uppercase rounded shadow-md"
                  >
                     Upload
                  </Button>
                  <Button
                     onClick={() => {
                        setOpen((prev) => !prev);
                     }}
                     type="button"
                     className=" w-full font-medium text-xl leading-tight uppercase rounded shadow-md"
                  >
                     ClOSE
                  </Button>
               </DialogContent>
            </Dialog>
         )}
      </div>
   );
};

export default ImageUpload;
/*   <Button type="button" className="shadow-md ">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
               >
                  <path
                     stroke-linecap="round"
                     stroke-linejoin="round"
                     d="M12 4v16m8-8H4"
                  />
               </svg>
            </Button> */
