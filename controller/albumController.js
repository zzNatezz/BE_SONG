import Album from "../modell/ablum";

const createAlbum = async (req, res) => {
  try {
    const { title, artist, year, songs } = req.body;
    const album = new Album({ title, artist, year, songs });
    const newAlbum = await album.save();
    res.status(201).json(newAlbum);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.find();
    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (album == null) {
      return res.status(404).json({ message: "Album not found" });
    }
    res.json(album);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAlbum = async (req, res) => {
  try {
    const { title, artist, year, songs } = req.body;
    const album = await Album.findById(req.params.id);
    if (album == null) {
      return res.status(404).json({ message: "Album not found" });
    }
    if (title != null) {
      album.title = title;
    }
    if (artist != null) {
      album.artist = artist;
    }
    if (year != null) {
      album.year = year;
    }
    if (songs != null) {
      album.songs = songs;
    }
    const updatedAlbum = await album.save();
    res.json(updatedAlbum);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (album == null) {
      return res.status(404).json({ message: "Album not found" });
    }
    await album.remove();
    res.json({ message: "Album deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createAlbum, getAllAlbums, getAlbumById, updateAlbum, deleteAlbum };
