import { songModel } from "../modell/songModel.js";
import { User } from "../modell/userModel.js";
import shuffleIndex from "../utils/shuffleIndex.js";
import { cloudinary } from "../utils/uploader.js";
import ytdl from "ytdl-core";
import cron from "node-cron";

const songController = {
  getAllSong: async (req, res) => {
    const allSong = await songModel.find({});
    res.status(200).send({
      allSong,
    });
  },
  uploadSong: async (req, res) => {
    const { userId } = req.params;
    const listFile = req.files;
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
      view: 0,
      image: { url: dataImage[0].secure_url, publicId: dataImage[0].public_id },
      song: { url: dataAudio[0].secure_url, publicId: dataAudio[0].public_id },
      isPublic: req.body.isPublic,
      like: false,
      user: userId,
      status : false,
    });
    res.status(201).send(`Song has been created`);
  },
  uploadSongYtb: async (req, res) => {
    const { userId } = req.params;
    try {
      const newSong = await new songModel({
        title: req.body.title,
        author: req.body.author,
        view: 0,
        image: { url: req.body.cover.url, publicId: "" },
        song: { url: req.body.url.url, publicId: "" },
        isPublic: req.body.isPublic,
        like: false,
        ytb: true,
        linkytb: req.body.linkytb,
        user: userId,
      });
      console.log(newSong);
      const song = await newSong.save();
      res.status(200).json(song);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  update_song_tiltle_and_author: async (req, res) => {
    const { songId } = req.params;
    const getSong = await songModel.findById(songId);
    getSong.author = req.body.author;
    getSong.title = req.body.title;
    res.status(201).send("Song has been updated");
  },
  update_song_img: async (req, res) => {
    const file = req.file;
    console.log(file);
    const typeFile = file.mimetype.split("/")[0];
    if (typeFile !== "image") throw new Error("only image is accept");
    const { songId } = req.params;
    const dataUrl = `data:${file.mimetype};base64,${file.buffer?.toString(
      "base64"
    )}`;
    const fileName = file.originalname.split(".")[0];
    const getSong = await songModel.findById(songId);
    await cloudinary.uploader.destroy(getSong.image.publicId);
    const up_img = await cloudinary.uploader.upload(dataUrl, {
      public_id: fileName,
      resource_type: "image",
    });
    getSong.image.publicId = up_img.public_id;
    getSong.image.url = up_img.secure_url;
    getSong.save();
    res.status(201).send("image has been updated");
  },
  update_song_audio: async (req, res) => {
    const file = req.file;
    const typefile = file.mimetype.split("/")[0];
    if (typefile !== "audio") throw new Error("only mp3 type is accept");
    const { songId } = req.params;
    const dataUrl = `data:${file.mimetype};base64,${file.buffer?.toString(
      "base64"
    )}`;
    const fileName = file.originalname.split(".")[0];
    const getSong = await songModel.findById(songId);
    await cloudinary.uploader.destroy(getSong.song.publicId);
    const up_audio = await cloudinary.uploader.upload(dataUrl, {
      public_id: fileName,
      resource_type: "auto",
    });
    getSong.song.publicId = up_audio.public_id;
    getSong.song.url = up_audio.secure_url;
    getSong.save();
    res.status(201).send("audio has been updated");
  },
  deleteSong: async (req, res) => {
    const { songId } = req.params;
    const findSong = await songModel.findById(songId);
    if (!findSong) throw new Error("Unavailable song");
    const listPublicId = [findSong.image.url, findSong.song.url];
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
        await listenedList.save();
        return res.status(201).send(`ok!`);
      }
      listenedList.save();
      return res.status(201).send(`ok!`);
    } else {
      const getSong = await songModel.findById(songId);
      const getIndex = listenedList.listenAgain.indexOf(songId);
      listenedList.listenAgain.splice(getIndex, 1);
      listenedList.listenAgain.unshift(getSong);
      await listenedList.save();
      return res.status(201).send(`ok!`);
    }
  },
  getListenedList: async (req, res) => {
    const { userId } = req.params;
    const getListened = await User.findById(userId).populate("listenAgain");
    res.status(200).send(getListened);
  },
  trendingList: async (req, res) => {
    const trending = await songModel.find().sort({ view: -1 });
    const fakeTrending = [...trending].splice(0, 10);
    res.status(200).send(fakeTrending);
  },
  countView: async (req, res) => {
    const { songId } = req.params;
    const findSong = await songModel.findById(songId);
    const updateView = findSong.view + 1;
    await songModel.findByIdAndUpdate(songId, { view: updateView });
    res.status(200).send("OK");
  },
  recommendList: async (req, res) => {
    const { userId } = req.params;
    const findUser = await User.findById(userId).populate("listenAgain");
    const listenAgainList = findUser.listenAgain;
    const getIdListenedList = listenAgainList.map((song) => song._id);

    const findTrendingList = await songModel.find().sort({ view: -1 });
    const fromIndex10 = findTrendingList.splice(10, findTrendingList.length);
    const recomm_song = [];
    const non_recom_song = [];

    for (let i = 0; i < fromIndex10.length; i++) {
      const checkI = getIdListenedList.find((x) => (x = fromIndex10[i]._id));
      checkI.length === 1
        ? non_recom_song.push(fromIndex10[i])
        : recomm_song.push(fromIndex10[i]);
    }

    const shuffle_recom_song = shuffleIndex(recomm_song);
    res.status(200).send(shuffle_recom_song.splice(0, 6));
  },
  urlYtb: async (req, res) => {
    try {
      const videoUrl = req.query.url;
      if (!videoUrl) {
        return res.status(400).json({ error: "Missing video URL parameter" });
      }
      let info = await ytdl.getInfo(videoUrl);
      let format = ytdl.filterFormats(info.formats, "audioonly");
      format = ytdl.chooseFormat(info.formats, { quality: "18" });
      res.json({
        title: info.videoDetails.title,
        author: info.videoDetails.author.name,
        cover:
          info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]
            .url,
        quality: format.qualityLabel,
        mimeType: format.mimeType,
        url: format.url,
        link: videoUrl,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  updateUrlYtb: async (songId) => {
    try {
      const song = await songModel.findById(songId);
      if (song.ytb) {
        const videoUrl = song.linkytb;
        let info = await ytdl.getInfo(videoUrl);
        let format = ytdl.filterFormats(info.formats, "audioonly");
        format = ytdl.chooseFormat(info.formats, { quality: "18" });
        song.title = info.videoDetails.title;
        song.author = info.videoDetails.author.name;
        song.cover =
          info.videoDetails.thumbnails[
            info.videoDetails.thumbnails.length - 1
          ].url;
        song.quality = format.qualityLabel;
        song.mimeType = format.mimeType;
        song.song.url = format.url;

        await song.save();
        console.log(`Updated YouTube URL for song with ID ${songId}`);
      }
    } catch (error) {
      console.error(
        `Error updating YouTube URL for song with ID ${songId}: ${error}`
      );
    }
  }
};

cron.schedule("0 11 * * *", async () => {
  try {
    const allSongs = await songModel.find({});
    for (const song of allSongs) {
      await songController.updateUrlYtb(song._id);
    }
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

export { songController };
