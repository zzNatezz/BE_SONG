import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../modell/userModel.js";
import _ from "lodash";

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
      });
      const user = await newUser.save();

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  loginUser: async (req, res) => {
    const { username, email } = req.body;
    try {
      const user = await User.findOne({
        $or: [{ username: username }, { email: email }],
      });
      if (!user) {
        res.status(404).json("username hoặc email không hợp lệ!");
        return;
      }
      const password = await bcrypt.compare(req.body.password, user.password);
      if (!password) {
        res.status(404).json("password không hợp lệ!");
      }

      const payload = {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      };

      const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
        expiresIn: "3d",
      });

      return res.status(200).send(accessToken);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  refreshToken: async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json("Refresh token không hợp lệ!");
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_ACCESS_KEY);

    const newPayload = _.omit(payload, ["exp", "iat"]);

    const newRefreshToken = jwt.sign(newPayload, process.env.JWT_ACCESS_KEY, {
      expiresIn: "7d",
    });
    return res.status(200).send(newRefreshToken);
  },

  logoutUser: async (req, res) => {
    res.status(200).json("Đăng xuất!");
  },
};

export { authController };
