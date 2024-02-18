import { songModel } from '../modell/songModel.js';
import axios from 'axios';

const songController = {
    testCreatSong : async (req, res) => {
        const {title, author,image,song} = req.body;
        const storeSong = await songModel.create({
            title,
            author,
            image,
            song,
            public : true,
        })
        res.status(201).send({
            data : storeSong,
            mes : 'successful'
        })
    },
    getAllSong : async (req, res) => {
        const allSong = await songModel.find({})
        res.status(200).send({
            data : allSong,
            mes : "Completed"
        })
    }
}

export {songController}