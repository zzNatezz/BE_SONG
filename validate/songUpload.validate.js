export const songUploadValid = async (req, res, next) =>{
    const {title, author, image, song} = req.body;
    if(!title) throw new Error('Title is required');
    if(!author) throw new Error('author is required');
    if(!image) throw new Error('image is required');
    if(!song) throw new Error('song is required');
    next()
}