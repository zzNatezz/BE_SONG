import { isObjectIdOrHexString } from "mongoose";
import { songModel } from "../modell/songModel.js";

export const songArrayUploadValid = async (req, res, next) =>{
    const listFile = req.files;
    if(!listFile) throw new Error ('Invalid files')
    if(listFile > 2)throw new Error('Only accept 2 files')
    next()
}

export const songPutvalid = async(req, res, next) =>{
    const {title, author} = req.body;
    if(!title) throw new Error('Title is required');
    if(!author) throw new Error('Author is required');
    next()
}

export const songSingleUploadValid = async(req, res, next) =>{
    const file = req.file;
    if(!file) throw new Error ("invalid file");
    if(file.length >1) throw new Error('only pick one file')
    next();
}

export const songUpdateValid = async(req, res, next) =>{
    if(!isObjectIdOrHexString(req.params.songId)) throw new Error('song is unavailable');
    if(!req.body.title) throw new Error('Title can not be empty');
    if(!req.body.author) throw new Error('Author can not be empty');
    next()
}

export const postListenedListValid = async(req, res, next) => {
    if(!isObjectIdOrHexString(req.params.songId)) throw new Error('song is unavailable');
    const findSong = await songModel.findById(req.params.songId);
    if(!findSong) throw new Error('invalid song');
    next()
}
