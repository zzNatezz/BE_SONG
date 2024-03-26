import listLikeModel from "../models/listLike.js"


const listLikeController = {
    updateListLike : async(req, res) => {
        const {userId, songId} = req.params
        const ownerList = await listLikeModel.findOne({owner: userId});
        const isInclude = ownerList.listLike.includes(songId);
        isInclude === false 
        ? await listLikeModel.findOneAndUpdate({owner: userId},{$push :{listLike: songId}})
        : await listLikeModel.findOneAndUpdate({owner: userId},{$pull :{listLike: songId}});
        
        res.status(200).send('Danh sách yêu thích của bạn đã được cập nhật');
    },
    getListLike : async(req, res) =>{
        const {userId} = req.params;
        const listlike = await listLikeModel.find({owner: userId}).populate('listLike');
        res.status(200).send(listlike)
    }
}

export {listLikeController}