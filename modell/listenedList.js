import mongoose from "mongoose";
import { songModel } from "./songModel.js";

const {Schema} = mongoose ;

const listenedList = new Schema ({ 
    songs : [{
        type : mongoose.Types.ObjectId,
        ref : songModel
    }]
})

const listenedListModel = mongoose.model('listenedList', listenedList);

export {listenedListModel};