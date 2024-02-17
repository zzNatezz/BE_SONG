import bcrypt from "bcrypt";
import { User } from "../modell/userModel.js";

const authController = {
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });

      const user = await newUser.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        res.status(404).json("Wrong username!");
      }
      const password = await bcrypt.compare(req.body.password, user.password);
      if (!password) {
        res.status(404).json("Wrong password!");
      }

      if (user && password) {
        res.status(200).json(user);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

export { authController };
