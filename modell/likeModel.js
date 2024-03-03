import mongoose from "mongoose";
import { User } from "./userModel.js";
import { songModel } from "./songModel.js";

const Schema =mongoose.Schema;

const likeShema = new mongoose.Schema(
   {
    user : {
        type : mongoose.Types.ObjectId,
        ref : User
    },
    songs : [
    {
        type : mongoose.Types.ObjectId,
        ref : songModel
    }
    ]
   }
)

export const likeModel = mongoose.model('likeSong', likeShema)