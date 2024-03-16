import { songModel } from "../modell/songModel.js";
import { User } from "../modell/userModel.js";
import { Playlist } from "../modell/playlistModel.js";
import shuffleIndex from "../utils/shuffleIndex.js";
import { cloudinary } from "../utils/uploader.js";
import ytdl from "ytdl-core";

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
      status: `pending`,
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
        linkytb: req.body.linkytb,
        user: userId,
        status: "pending",
      });
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
  updateAgainList: async (req, res) => {
    try {
      const { userId, songId } = req.params;
      const playlist = await Playlist.findOne({ "listenAgain.user": userId });
      if (!playlist) {
        const newPlaylist = new Playlist({
          listenAgain: [{ user: userId, songs: [songId] }],
        });
        await newPlaylist.save();
      } else {
        const listenAgainIndex = playlist.listenAgain.findIndex((item) =>
          item.user.equals(userId)
        );
        if (listenAgainIndex !== -1) {
          const songIndex =
            playlist.listenAgain[listenAgainIndex].songs.indexOf(songId);
          if (songIndex !== -1) {
            playlist.listenAgain[listenAgainIndex].songs.splice(songIndex, 1);
          }
        }
        playlist.listenAgain[listenAgainIndex].songs.unshift(songId);
        if (playlist.listenAgain[listenAgainIndex].songs.length > 10) {
          playlist.listenAgain[listenAgainIndex].songs.pop();
        }
        await playlist.save();
      }

      res.status(201).send("ok!");
    } catch (error) {
      console.error("Error updating listened list:", error);
      res.status(500).send({ error: "Server error" });
    }
  },
  againList: async (req, res) => {
    const { userId } = req.params;
    try {
      const playlist = await Playlist.findOne({
        "listenAgain.user": userId,
      }).populate("listenAgain.songs");
      if (!playlist) {
        return;
      }
      const listenedSongs = playlist.listenAgain.find((item) =>
        item.user.equals(userId)
      ).songs;
      res.status(200).send(listenedSongs);
    } catch (error) {
      console.error("Error getting listened list:", error);
      res.status(500).send({ error: "Server error" });
    }
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
    const findUser = await Playlist.findOne({ "listenAgain.user": userId });
    if (!findUser) {
      return;
    }
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
    res.status(200).send(shuffle_recom_song.splice(0, 10));
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
  newUrlYtb: async (songId) => {
    try {
      const song = await songModel.findById(songId);
      if (song.linkytb) {
        const videoUrl = song.linkytb;
        let info = await ytdl.getInfo(videoUrl);
        let format = ytdl.filterFormats(info.formats, "audioonly");
        format = ytdl.chooseFormat(info.formats, { quality: "18" });
        await songModel.findByIdAndUpdate(songId, {
          $set: {
            "song.url": format.url,
            "image.url":
              info.videoDetails.thumbnails[
                info.videoDetails.thumbnails.length - 1
              ].url,
          },
        });
        console.log(`Updated YouTube URL for song with ID ${songId}`);
      }
    } catch (error) {
      console.error(
        `Error updating YouTube URL for song with ID ${songId}: ${error}`
      );
    }
  },

  updateUrlYtb: async (req, res) => {
    try {
      const allSongs = await songModel.find({});
      await Promise.all(
        allSongs.map(async (song) => {
          await songController.newUrlYtb(song._id);
        })
      );
      res.status(200).send("update success url");
    } catch (error) {
      console.error("Error in update url:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  getPendingSong: async (req, res) => {
    const findPendSong = await songModel.find({ status: "pending" });
    res.status(200).send(findPendSong);
  },

  approvedSong: async (req, res) => {
    const { songId } = req.params;
    await songModel.findByIdAndUpdate(songId, { status: "approved" });
    res.status(201).send(`successfull`);
  },

  rejectedSong: async (req, res) => {
    const { songId } = req.params;
    await songModel.findByIdAndUpdate(songId, { status: "rejected" });
    res.status(201).send(`successfull`);
  },

  listLike: async (req, res) => {
    const { userId } = req.params;
    try {
      const playlist = await Playlist.findOne({
        "like.user": userId,
      }).populate("like.songs");
      if (!playlist) {
        return;
      }
      const likedSongs = playlist.like.find((item) =>
        item.user.equals(userId)
      ).songs;
      res.status(200).send(likedSongs);
    } catch (error) {
      console.error("Error getting liked list:", error);
      res.status(500).send({ error: "Server error" });
    }
  },
  liked: async (req, res) => {
    try {
      const { userId, songId } = req.params;
      const playlist = await Playlist.findOne({ "like.user": userId });

      if (!playlist) {
        const newPlaylist = new Playlist({
          like: [{ user: userId, songs: [{ _id: songId, liked: true }] }],
        });
        await newPlaylist.save();
        res.status(201).send("ok!");
      } else {
        const songIndex = playlist.like[0].songs.findIndex(
          (song) => song._id.toString() === songId
        );
        if (songIndex !== -1) {
          await Playlist.findOneAndUpdate(
            { "like.user": userId, "like.songs._id": songId },
            {
              $pull: { "like.$.songs": { _id: songId } },
              $set: { [`like.0.songs.${songIndex}.liked`]: false },
            },
            { new: true }
          );
          res.status(200).send("unliked!");
        } else {
          await Playlist.findOneAndUpdate(
            { "like.user": userId },
            { $addToSet: { "like.$.songs": { _id: songId, liked: true } } },
            { new: true }
          );
          res.status(201).send("ok!");
        }
      }
    } catch (error) {
      console.error("Error updating liked list:", error);
      res.status(500).send({ error: "Server error" });
    }
  },

  // Cái này lưu lại để dùng từ từ :D nào xong xóa
  // fileterSong: async (req, res) => {
  //   try {
  //     const findSongs = await songModel.find();
  //     const filteredSongs = findSongs.filter(
  //       (item) => item.liked === undefined
  //     );

  //     for (let i = 0; i < findSongs.length; i++) {}
  //     console.log(findSongs);
  //     await Promise.all(findSongs.map((song) => song.save()));
  //     res.send(findSongs);
  //   } catch (error) {
  //     console.error("Error updating songs:", error);
  //     res.status(500).send("Internal Server Error");
  //   }
  // },
  // router ở userRoute
};

export { songController };
