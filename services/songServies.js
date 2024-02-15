import { songModel } from "../modell/songModel.js";

export const addSong = async (req, res, next) => {
    const body = req.body;
    const song = await songModel.create(body);
    res.status(200).send({
        data : song,
        status : 'sucessfull',
        msg : " song has been created !"
    })
}