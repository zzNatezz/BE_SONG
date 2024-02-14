import mongoose from "mongoose";

const {Schema} = mongoose ;

const albumSchema = new Schema ({ 
    title : {type: String, require : true},
    createAt : {type: Date, default : Date.now},
    updateAt : Date,
    Public : Boolean,
})

const albumModel = mongoose.model('album', albumSchema);

export {albumModel};