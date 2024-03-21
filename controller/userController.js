import jwt from "jsonwebtoken";
import { User } from "../modell/userModel.js";
import { cloudinary } from "../utils/uploader.js";

const userController = {
  getUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getUser: async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "Người dùng không tồn tại" });
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  updateUser: async (req, res) => {
    const userId = req.params.id;
    const { username, email, password } = req.body;
    const file = req.file;
    const avatar = [];

    if (file) {
      const dataUrl = `data:${file.mimetype};base64,${file.buffer?.toString(
        "base64"
      )}`;
      console.log(dataUrl);
      const fileName = file.originalname.split(".")[0];
      const uploaded = await cloudinary.uploader.upload(dataUrl, {
        public_id: fileName,
        resource_type: "auto",
      });
      uploaded.resource_type === "image" && avatar.push(uploaded);
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "Người dùng không tồn tại" });
      }
      if (avatar.length > 0) {
        const avatarUrl = avatar[0].secure_url;
        user.avatar = avatarUrl;
      }
      if (username) {
        user.username = username;
      }
      if (email) {
        user.email = email;
      }
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
      }
      await user.save();
      const payload = {
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      };

      const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
        expiresIn: "3d",
      });

      return res.status(200).send(accessToken);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("delete successfully!");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

export { userController };
