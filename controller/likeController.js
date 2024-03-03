import { likeModel } from "../modell/likeModel.js";
import { songModel } from "../modell/songModel.js";
import { User } from "../modell/userModel.js";

const likeController = {
    updateLikeList : async (req, res) =>{
        const {userId, songId} = req.params;
        const isUser = await likeModel.findOne({user : userId})
        res.send('testing')
    }
}

export default likeController