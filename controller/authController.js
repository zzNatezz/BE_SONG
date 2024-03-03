import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../modell/userModel.js";
import { likeModel } from "../modell/likeModel.js";

let refreshTokens = [];

const authController = {
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
        avatar: req.body.avatar || null,
        listenAgain: req.body.listenAgain || [],
      });
      const user = await newUser.save();

      await likeModel.create({
        user : newUser._id.toString(),
        songs : []
      })

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "60s" }
    );
  },
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "3d" }
    );
  },

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({
        $or: [{ username: req.body.username }, { email: req.body.email }],
      });
      if (!user) {
        res.status(404).json("Wrong username or email!");
        return;
      }
      const password = await bcrypt.compare(req.body.password, user.password);
      if (!password) {
        res.status(404).json("Wrong password!");
      }

      if (user && password) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);
        refreshTokens.push(refreshToken);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "Strict",
        });

        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("You're not authenticated");
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid");
    }
    jwt.verify(refreshToken, process.env.JWT_ACCESS_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "Strict",
      });
      res.status(200).json({ accessToken: newAccessToken });
    });
  },

  logoutUser: async (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    res.status(200).json("Logged out!");
  },
};

export { authController };
