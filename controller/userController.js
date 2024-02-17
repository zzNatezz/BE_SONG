import { User } from "../modell/userModel.js";

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json(error);
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
