import { songModel } from "../modell/songModel.js";
import { User } from "../modell/userModel.js";

const likeController = {
  listLike: async (req, res) => {
    const { userId } = req.params;
    const listLike = await User.findById(userId).populate("like");
    res.status(200).send(listLike);
  },
  liked: async (req, res) => {
    const { userId, songId } = req.params;
    try {
      const user = await User.findById(userId);
      const song = await songModel.findById(songId);
      if (!user || !song) {
        return;
      }
      if (user.likes.includes(songId)) {
        return;
      }
      await User.findByIdAndUpdate(userId, {
        $set: {
          like: true,
        },
      });
      user.likes.push(songId);
      await user.save();
    } catch (error) {
      console.log(error);
    }
  },
  unlike: async (req, res) => {
    const { userId, songId } = req.params;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return;
      }
      await User.findByIdAndUpdate(userId, {
        $set: {
          like: false,
        },
      });
      user.likes = user.likes.filter((id) => id.toString() !== songId);
      await user.save();
    } catch (error) {
      console.log(error);
    }
  },
};

export default likeController;
