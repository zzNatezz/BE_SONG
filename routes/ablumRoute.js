

import express from "express";
import {
  createAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum
} from "../controller/albumController";

const router = express.Router();

// Routes cho CRUD của album
router.post("/albums", createAlbum);
router.get("/albums", getAllAlbums);
router.get("/albums/:id", getAlbumById);
router.put("/albums/:id", updateAlbum);
router.delete("/albums/:id", deleteAlbum);

export default router;
