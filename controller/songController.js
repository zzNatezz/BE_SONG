import { songModel } from '../modell/songModel.js';

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
}

export {songController}