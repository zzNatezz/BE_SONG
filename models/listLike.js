import mongoose from "mongoose";
import { User } from "./userModel.js";
import { songModel } from "./songModel.js";

const listLikeSchema = new mongoose.Schema({
    owner : {
        type : mongoose.Types.ObjectId,
        ref : User
    },
    listLike :[
        {
            type : mongoose.Types.ObjectId,
            ref : songModel
        }
    ],
    isLike : {type : Boolean, default: true}
})

const listLikeModel = mongoose.model('listLike', listLikeSchema);

export default listLikeModel