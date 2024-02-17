
export const uploadFile = async (req, res, next) => {
     const fileData = req.file;
    console.log(fileData);
    // const body = req.body;
    // const createFile = await songModel.create(body)
    // res.status(201).send({
    //     data : createFile,
    //     mes: "OK!"
    // })
    res.status(200).send('OK!')
}