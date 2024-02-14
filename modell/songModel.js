import mongoose from "mongoose";

const {Schema} = mongoose ;

const songSchema = new Schema ({ 
    title : {type: String, require : true},
    author : {type: String, require : true},
    view : Number,
    img : String,
    createAt : {type: Date, default : Date.now},
    link: {type: String, require : true},
    Public : Boolean,
})

const songModel = mongoose.model('song', songSchema);

export {songModel};