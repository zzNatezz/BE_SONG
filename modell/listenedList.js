import mongoose from "mongoose";
import { songModel } from "./songModel.js";
import {User} from './userModel.js'

const {Schema} = mongoose ;

const listenedList = new Schema ({ 
    userId : {
        type : mongoose.Types.ObjectId,
        ref : User
    },
    songs : [
        { type : mongoose.Types.ObjectId,
        ref : songModel},

    ]
})

const listenedListModel = mongoose.model('listenedList', listenedList);

export {listenedListModel};