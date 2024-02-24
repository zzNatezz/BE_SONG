import { listenedListModel } from "../modell/listenedList.js";
import { songModel } from "../modell/songModel.js";
import { cloudinary } from "../utils/uploader.js";

const songController = {
  getAllSong: async (req, res) => {
    const allSong = await songModel.find({});
    res.status(200).send({
      allSong,
    });
  },
  uploadSong: async (req, res) => {
    const listFile = req.files;
    const dataImage = [];
    const dataAudio = [];
    for (const file of listFile) {
      const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
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
    const song = await songModel.create({
      title: req.body.title,
      author: req.body.author,
      image: [
        { url: dataImage[0].secure_url },
        { publicId : dataImage[0].public_id}
      ],
      song: [
        { url : dataAudio[0].secure_url},
        {publicId : dataAudio[0].public_id}
    ],
      isPublic: req.body.isPublic,
    });
    res.status(201).send({ img: dataImage, dataAudio: dataAudio });
  },
  // updateSong: async (req, res) => {
  //   const { songId } = req.params;
  //   const getSong = await songModel.findById(songId);
  //   (getSong.author = req.body.author),
  //     (getSong.title = req.body.title),
  //     res.status(201).send("Song has been updated");
  // },
  deleteSong : async(req, res) => {
    const {songId} = req.params;
    const findSong = await songModel.findById(songId);
    if(!findSong) throw new Error("Unavailable song");
    const listPublicId = [findSong.image[0].url, findSong.song[0].url]
    for( const id in listPublicId){
      await cloudinary.uploader.destroy(id)
    }
    await songModel.findByIdAndDelete(songId)
    res.status(201).send(`Successful`)
  },
  // ListenedList nay chua validate, phai check songId va phai check co nay trong all albums hay k.
  listnedList : async (req, res) =>{
    const {songId} = req.params;
    const listened = await listenedListModel.create({
      songs : songId
    });
    res.status(201).send(listened);
  },
   // Đợi có user mới tiếp tục làm tiếp -> cần chỉnh sửa lại litenedList Schenma
  updateListenedList : async(req, res) => {
    const {songId} = req.params;
    const findList = await listenedListModel.findByIdAndUpdate('65d979d76681723e308b2790',{$push: {songs : songId}})
    res.status(201).send("successfull.")
  },
  getListenedList : async (req, res) =>{
    const getListened = await listenedListModel.find().populate('songs');
    res.status(200).send(getListened);
  }
};

export { songController };
