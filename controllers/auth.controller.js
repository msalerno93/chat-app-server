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

export const login = (req, res) => {
  console.log("Login User");
  res.send("Login");
};

export const logout = (req, res) => {
  console.log("Logout User");
  res.send("Logout");
};
