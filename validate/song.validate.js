import { isObjectIdOrHexString } from "mongoose";

export const songUploadValid = async (req, res, next) =>{
    const listFile = req.files;
    const {title, author, image, song} = req.body;
    if(!title) throw new Error('Title is required');
    if(!author) throw new Error('author is required');
    if(!listFile) throw new Error ('Invalid files')
    if(listFile > 2)throw new Error('Only accept 2 files')
    next()
}

export const songUpdateValid = async(req, res, next) =>{
    if(!isObjectIdOrHexString(req.params.songId)) throw new Error('song is unavailable');
    if(!req.body.title) throw new Error('Title can not be empty');
    if(!req.body.author) throw new Error('Author can not be empty');
    next()
}