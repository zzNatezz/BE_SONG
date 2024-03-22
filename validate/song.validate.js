import { isObjectIdOrHexString } from "mongoose";
import { songModel } from "../models/songModel.js";

export const songArrayUploadValid = async (req, res, next) => {
  const listFile = req.files;
  const mimetype = listFile.map((file) => file.mimetype.split("/")[0]);
  const checkImage = mimetype.includes("image");
  const checkAudio = mimetype.includes("audio");
  if (!listFile) throw new Error("Invalid files");
  if (listFile.length !== 2) throw new Error("Only accept 2 files");
  if (mimetype[0] === mimetype[1])
    throw new Error(
      `Please check the files uploaded, only accept 1 image and 1 audio files`
    );
  if (!checkImage) throw new Error(`file type isn't required`);
  if (!checkAudio) throw new Error(`file type isn't required`);
  next();
};

export const songTitleValid= async (req, res, next) => {
  const { title } = req.body;
  if (!title) throw new Error("Title is required");
  next();
};
export const songAuthorValid= async (req, res, next) => {
  const { author } = req.body;
  if (!author) throw new Error("Author is required");
  next();
};

export const songSingleUploadValid = async (req, res, next) => {
  const file = req.file;
  if (!file) throw new Error("invalid file");
  if (file.length > 1) throw new Error("only pick one file");
  if (file.length == 0) throw new Error("please select file");
  next();
};

export const songUpdateValid = async (req, res, next) => {
  if (!isObjectIdOrHexString(req.params.songId))
    throw new Error("song is unavailable");
  if (!req.body.title) throw new Error("Title can not be empty");
  if (!req.body.author) throw new Error("Author can not be empty");
  next();
};

export const postListenedListValid = async (req, res, next) => {
  if (!isObjectIdOrHexString(req.params.songId))
    throw new Error("song is unavailable");
  const findSong = await songModel.findById(req.params.songId);
  if (!findSong) throw new Error("invalid song");
  next();
};
