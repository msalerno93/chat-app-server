import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password does not match" });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ error: "This username is taken!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfilePic = `https://avatar-placeholder.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar-placeholder.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

      if (newUser) {
      generateTokenAndCookie(newUser._id, res)
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid User Information" });
    }
  } catch (error) {
    console.log("Error in Signup Controller", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error - User Not Created!" });
  }
};

export const login = async (req, res) => {
  try {
      const { username, password } = req.body
      const existingUser = await User.findOne({ username })
      const isPasswordCorrect = await bcrypt.compare(password, existingUser?.password || "")

      if(!existingUser || !isPasswordCorrect){
        console.log(error)
        return res.status(400).json({error: "Invalid Username or Password"})        
      }
      generateTokenAndCookie(existingUser._id, res)

      res.status(200).json({
        _id: existingUser._id,
        fullName: existingUser.fullName,
        username: existingUser.username,
        profilePic: existingUser.profilePic
      })
  } catch (error) {
    console.log("Error in Login Controller", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error - User Not Logged In!" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {maxAge: 0})
    res.status(200).json({message: "Logged Out Successfully!"})
  } catch (error) {
    console.log("Error in Logout Controller", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error - User Not Logged Out!" });
  }
};
