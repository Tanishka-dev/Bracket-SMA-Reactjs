import React from "react";
import { useState } from "react";
import { db, storage } from "../index";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import ButtonPrimary from "./ButtonPrimary";
import { useUserData } from "../features/User/userSlice";
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
      console.log(username);
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
         <div className="imageUpload__button">
            <ButtonPrimary
               size="medium"
               text="Upload"
               type="button"
               className="py-3"
               onClick={(e) => setOpen((prev) => !prev)}
               variant="outlined"
            />
         </div>

         {open ? (
            <div className="imageUpload">
               <div className="imageUpload__uploadProgress">
                  <input type="file" onChange={handleChange} />
                  <progress value={progress} max="100" />
               </div>
               <div className="imageUpload__captionButton gap-5">
                  <input
                     className="appearance-none block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                     type="text"
                     placeholder="Enter a caption"
                     onChange={(e) => setCaption(e.target.value)}
                     value={caption}
                  />
                  <ButtonPrimary
                     size="medium"
                     text="Upload"
                     type="button"
                     variant="outlined"
                     onClick={() => handleUpload(user.user.displayName)}
                  />
               </div>
            </div>
         ) : (
            ""
         )}
      </div>
   );
};

export default ImageUpload;
