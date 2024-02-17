import express from 'express';
import {asyncCatch} from '../utils/asyncCatch.js';
import { uploadSong } from '../services/songServies.js';

const songController = express.Router();

songController.post('/upload', asyncCatch(uploadSong));

export {songController}