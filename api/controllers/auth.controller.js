import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
     const { username, email, password } = req.body;
     const hashedPassword = bcryptjs.hashSync(password, 10);
     const newUser = new User({ username, email, password: hashedPassword });
     try {
          await newUser.save();
          res.status(201).json("User created successfully");
     } catch (error) {
          next(error);
     }
};

export const signin = async (req, res, next) => {
     const { email, password } = req.body;
     try {
          const validUser = await User.findOne({ email: email });
          if (!validUser) {
               return next(errorHandler(404, "User not found!"));
          } else {
               const validPassword = await bcryptjs.compareSync(
                    password,
                    validUser.password
               );
               if (!validPassword) {
                    return next(errorHandler(401, "Wrong Credentials"));
               }
               const token = jwt.sign(
                    { id: validUser._id },
                    process.env.JWT_SECRET
               );
               const { password: pass, ...rest } = validUser._doc; //no need to show password, show data except password
               console.log("Successful login");
               res.cookie("access_token", token, { httpOnly: true })
                    .status(200)
                    .json(rest);
          }
     } catch (error) {
          next(error);
     }
};

export const google = async (req, res, next) => {
     try {
          const user = await User.findOne({ email: req.body.email });
          if (user) {
               const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
               const { password: pass, ...rest } = user._doc;
               res.cookie("access_token", token, { httpOnly: true })
                    .status(200)
                    .json(rest);
          } else {
               //if user not registered, then it will create a new a/c and save it in the database
               const generatedPassword =
                    Math.random().toString(36).slice(-8) +
                    Math.random().toString(36).slice(-8);
               const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
               const generatedUsername =
                    req.body.name.split(" ").join("").toLowerCase() +
                    Math.random().toString(36).slice(-4);
               const newUser = new User({
                    username: generatedUsername,
                    email: req.body.email,
                    password: hashedPassword,
                    avatar: req.body.photo,
               });
               const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
               const { password: pass, ...rest } = newUser._doc;
               res.cookie("access_token", token, { httpOnly: true })
                    .status(200)
                    .json(rest);
               await newUser.save();
          }
     } catch (error) {
          next(error);
     }
};

export const signOut = async (req, res, next) => {
     try{
          res.clearCookie('access_token');
          await res.status(200).json('User has been logged out');
     }
     catch(error){
          next(error);
     }
}