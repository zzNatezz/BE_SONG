
import { songModel } from "../modell/songModel.js";
import { User } from "../modell/userModel.js";
import { cloudinary } from "../utils/uploader.js";

const songController = {
  getAllSong: async (req, res) => {
    const allSong = await songModel.find({});
    res.status(200).send({
      allSong,
    });
  },
  uploadSong: async (req, res) => {
    const listFile = req.files; //should be validate to only accept 1 img and 1 video
    const dataImage = [];
    const dataAudio = [];
    for (const file of listFile) {
      const dataUrl = `data:${file.mimetype};base64,${file.buffer?.toString(
        "base64"
      )}`;
      const fileName = file.originalname.split(".")[0];
      const uploaded = await cloudinary.uploader.upload(dataUrl, {
        public_id: fileName,
        resource_type: "auto",
      });
      uploaded.resource_type === "image"
        ? dataImage.push(uploaded)
        : dataAudio.push(uploaded);
    }
    await songModel.create({
      title: req.body.title,
      author: req.body.author,
      view : 0,
      image: { url: dataImage[0].secure_url, publicId: dataImage[0].public_id },
      song: { url: dataAudio[0].secure_url, publicId: dataAudio[0].public_id },
      isPublic: req.body.isPublic,
    });
    res.status(201).send(`Song has been created`);
  },
  update_song_tiltle_and_author: async (req, res) => {
    const { songId } = req.params;
    const getSong = await songModel.findById(songId);
    getSong.author = req.body.author;
    getSong.title = req.body.title;
    res.status(201).send("Song has been updated");
  },
  update_song_img: async (req, res) => {
    const file = req.file; console.log(file);
    const typeFile = file.mimetype.split("/")[0];
    if(typeFile !== 'image')throw new Error ("only image is accept")
    const { songId } = req.params;
    const dataUrl = `data:${file.mimetype};base64,${file.buffer?.toString(
      "base64"
    )}`;
    const fileName = file.originalname.split(".")[0];
    const getSong = await songModel.findById(songId);
    await cloudinary.uploader.destroy(getSong.image.publicId)
    const up_img = await cloudinary.uploader.upload(dataUrl,{public_id:fileName, resource_type: 'image'} );
    getSong.image.publicId = up_img.public_id;
    getSong.image.url = up_img.secure_url;
    getSong.save()
    res.status(201).send("image has been updated");
  },
  update_song_audio : async (req, res) => {
    const file = req.file; 
    const typefile = file.mimetype.split("/")[0];
    if(typefile !== 'audio') throw new Error("only mp3 type is accept")
    const { songId } = req.params;
    const dataUrl = `data:${file.mimetype};base64,${file.buffer?.toString(
      "base64"
    )}`;
    const fileName = file.originalname.split(".")[0];
    const getSong = await songModel.findById(songId);
    await cloudinary.uploader.destroy(getSong.song.publicId)
    const up_audio = await cloudinary.uploader.upload(dataUrl,{public_id:fileName, resource_type: 'auto'} );
    getSong.song.publicId = up_audio.public_id;
    getSong.song.url = up_audio.secure_url;
    getSong.save()
    res.status(201).send("audio has been updated");
  },
  deleteSong: async (req, res) => {
    const { songId } = req.params;
    const findSong = await songModel.findById(songId);
    if (!findSong) throw new Error("Unavailable song");
    const listPublicId = [findSong.image[0].url, findSong.song[0].url];
    for (const id in listPublicId) {
      await cloudinary.uploader.destroy(id);
    }
    await songModel.findByIdAndDelete(songId);
    res.status(201).send(`Successful`);
  },
  updateListenedList: async (req, res) => {
    const { userId, songId } = req.params;
    const listenedList = await User.findById(userId);
    const isExisting = listenedList.listenAgain.includes(songId);
    if (!isExisting) {
      listenedList.listenAgain.unshift(songId);
      if (listenedList.listenAgain.length > 10) {
        listenedList.listenAgain.pop();
        listenedList.save();
        return res.status(201).send(`ok!`);
      }
      listenedList.save();
      return res.status(201).send(`ok!`);
    } else return res.status(201).send(`Ok!`); // <-- bug because an existing song that is listening in listenedList do not go to index 0 after the song is finished
  },
  getListenedList: async (req, res) => {
    const { userId } = req.params;
    const getListened = await User.findById(userId).populate("listenAgain");
    res.status(200).send(getListened);
  },
  trendingList : async (req, res) => {
    const trending = await songModel.find().sort({view : -1});
    const fakeTrending = [...trending].splice(0,10);
    res.status(200).send(fakeTrending)
  },
  countView : async (req, res) =>{
    const {songId} = req.params;
    const findSong = await songModel.findById(songId);
    const updateView = findSong.view + 1;
    await songModel.findByIdAndUpdate(songId, {view : updateView});
    res.status(200).send('OK');
  },
  recommendList : async (req, res) => {
    const {userId} = req.params;
    const data = await User.findById(userId).populate('listenAgain');
    const fav_author = data.listenAgain.map(x => x.author)
    const recom_song = await songModel.find({author : {$in : fav_author}})
    res.status(200).send(recom_song.splice(0,10))
  }
};

export { songController };
