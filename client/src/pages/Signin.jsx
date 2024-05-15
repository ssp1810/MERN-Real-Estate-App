import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
     signInStart,
     signInSuccess,
     signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
     const [formData, setFormData] = useState({});
     const { loading, error } = useSelector((state) => state.user);
     const dispatch = useDispatch();

     const navigate = useNavigate();
     const handleChange = (e) => {
          setFormData({
               ...formData, //keeps the old data
               [e.target.id]: e.target.value, //adds the new data
          });
     };
     const handleSubmit = async (e) => {
          e.preventDefault();
          try {
               dispatch(signInStart);
               console.log('object')
               const res = await fetch("https://mern-real-estate-app-ten.vercel.app/api/auth/signin", {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
               });
               const data = await res.json();
               if (data.success === false) {
                    dispatch(signInFailure(data.message));
                    return;
               }
               dispatch(signInSuccess(data));
               navigate("/");
          } catch (error) {
               console.log(error)
               dispatch(signInFailure(error.message));
          }
          setFormData("");
     };

     return (
          <div className="p-3 max-w-lg mx-auto">
               <h1 className="text-3xl text-center font-semibold my-7">
                    Sign In
               </h1>
               <form
                    onSubmit={handleSubmit}
                    action=""
                    className="flex flex-col gap-4"
               >
                    <input
                         type="email"
                         placeholder="Email"
                         className="border p-3 rounded-lg"
                         id="email"
                         onChange={handleChange}
                    />
                    <input
                         type="password"
                         placeholder="Password"
                         className="border p-3 rounded-lg"
                         id="password"
                         onChange={handleChange}
                    />
                    <button
                         disabled={loading}
                         className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                    >
                         {loading ? "Loading..." : "Sign In"}
                    </button>
                    <OAuth />
               </form>
               <div className="flex gap-2 mt-5">
                    <p>Don't have an account?</p>
                    <Link to="/sign-up">
                         <span className="text-blue-700">Sign up</span>
                    </Link>
               </div>
               {error && <p className="text-red-500 mt-5">{error}</p>}
          </div>
     );
}
