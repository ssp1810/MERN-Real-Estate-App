import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
     getDownloadURL,
     getStorage,
     ref,
     uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import {
     updateUserStart,
     updateUserFailure,
     updateUserSuccess,
     deleteUserFailure,
     deleteUserStart,
     deleteUserSuccess,
} from "../redux/user/userSlice.js";

export default function Profile() {
     const fileRef = useRef(null);
     const dispatch = useDispatch();
     const { currentUser, loading, error } = useSelector((state) => state.user);
     const [file, setFile] = useState(undefined);
     const [filePer, setFilePer] = useState(0);
     const [fileUploadError, setFileUploadError] = useState(false);
     const [updateSuccess, setUpdateSuccess] = useState(false);
     const [formData, setFormData] = useState({});

     // console.log(formData);
     // console.log(filePer);
     // console.log(fileUploadError);

     useEffect(() => {
          if (file) {
               handleFileUpload(file);
          }
     }, [file]);

     const handleSubmit = async (e) => {
          e.preventDefault();
          try {
               dispatch(updateUserStart());
               const res = await fetch(`/api/user/update/${currentUser._id}`, {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
               });
               const data = await res.json();
               if (data.success === false) {
                    dispatch(updateUserFailure(data.message));
                    return;
               }
               dispatch(updateUserSuccess(data));
               setUpdateSuccess(true);
          } catch (error) {
               dispatch(updateUserFailure(error.message));
          }
     };
     const handleFileUpload = (file) => {
          const storage = getStorage(app);
          const fileName = new Date().getTime() + file.name; //to have a unique file name
          const storageRef = ref(storage, fileName);
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on(
               "state_changed",
               (snapshot) => {
                    const progress =
                         (snapshot.bytesTransferred / snapshot.totalBytes) *
                         100;
                    setFilePer(Math.round(progress));
               },
               (error) => {
                    setFileUploadError(true);
               },
               () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                         (downloadURL) => {
                              setFormData({ ...formData, avatar: downloadURL });
                         }
                    );
               }
          );
     };

     const handleChange = (e) => {
          setFormData({ ...formData, [e.target.id]: e.target.value });
     };

     const handleDeleteUser = async (e) => {
          try {
               dispatch(deleteUserStart());
               const res = await fetch(`api/user/delete/${currentUser._id}`, {
                    method: 'DELETE',
               });
               const data = await res.json();
               if (data.success === false) {
                    dispatch(deleteUserFailure(data.message));
                    return;
               }
               dispatch(deleteUserSuccess(data));
          } catch (error) {
               dispatch(deleteUserFailure(error.message));
          }
     };
     return (
          <div className="p-3 max-w-lg mx-auto">
               <h1 className="text-3xl font-semibold text-center my-7">
                    Profile
               </h1>
               <form className="flex flex-col gap-4">
                    <input
                         onChange={(e) => setFile(e.target.files[0])}
                         type="file"
                         ref={fileRef}
                         hidden
                         accept="image/*"
                    />
                    <img
                         onClick={() => fileRef.current.click()}
                         src={formData?.avatar || currentUser.avatar}
                         alt="profile"
                         className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
                    />
                    {/* progress statement */}
                    <p className="text-sm self-center">
                         {fileUploadError ? (
                              <span className="text-red-700">
                                   Error Image Upload (Image must be less than
                                   2MB)
                              </span>
                         ) : filePer > 0 && filePer < 100 ? (
                              <span className="text-green-700">
                                   {`Uploading ${filePer}%`}
                              </span>
                         ) : filePer === 100 ? (
                              <span className="text-green-700">
                                   Image Successfully Uploaded!
                              </span>
                         ) : (
                              ""
                         )}
                    </p>
                    <input
                         id="username"
                         type="text"
                         placeholder="Username"
                         defaultValue={currentUser.username}
                         onChange={handleChange}
                         className="border p-3 rounded-lg"
                    />
                    <input
                         id="email"
                         type="text"
                         placeholder="Email"
                         defaultValue={currentUser.email}
                         onChange={handleChange}
                         className="border p-3 rounded-lg"
                    />
                    <input
                         id="password"
                         type="password"
                         placeholder="Password"
                         defaultValue={currentUser.password}
                         className="border p-3 rounded-lg"
                    />
                    <button
                         onClick={handleSubmit}
                         className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-80"
                    >
                         {loading ? "Loading..." : "Update Profile"}
                    </button>
               </form>
               <div className="flex justify-between mt-5">
                    <span
                         onClick={handleDeleteUser}
                         className="text-red-700 cursor-pointer"
                    >
                         Delete account
                    </span>
                    <span className="text-red-700 cursor-pointer">
                         Sign out
                    </span>
               </div>
               <p className="text-red-700 mt-5">{error ? error : ""}</p>
               <p className="text-green-700 mt-5">
                    {updateSuccess ? "Profile updated successfully!" : ""}
               </p>
          </div>
     );
}
