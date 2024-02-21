import { songModel } from "../modell/songModel.js";
import { cloudinary } from "../utils/uploader.js";

const songController = {
  getAllSong: async (req, res) => {
    const allSong = await songModel.find({});
    res.status(200).send({
      allSong,
    });
  },
  uploadSong : async (req, res)=>{
    const dataImage = [];
    const dataAudio = [];
    for( const file of listFile){
        const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const fileName = file.originalname.split('.')[0];
        const uploaded = await cloudinary.uploader.upload(dataUrl,{
            public_id:fileName,
            resource_type : 'auto'
        })
        uploaded.resource_type === "image" ? dataImage.push(uploaded) : dataAudio.push(uploaded)
    }
    const song = await songModel.create({
        title : req.body.title,
        author : req.body.author,
        image : dataImage[0].secure_url, 
        song : dataAudio[0].secure_url,
        isPublic : req.body.isPublic
    })
    res.status(201).send(`Song has been created.`)
  },
  updateSong : async (req, res) =>{
    const {songId} = req.params;
    const getSong = await songModel.findById(songId);
    getSong.author = req.body.author,
    getSong.title = req.body.title,
    res.status(201).send('Song has been updated')
  }
};

export { songController };
