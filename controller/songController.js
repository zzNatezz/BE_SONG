import express from 'express';
import {asyncCatch} from '../utils/asyncCatch.js';
import { uploadFile } from '../services/songServies.js';
import { uploader } from '../utils/uploader.js';

const songController = express.Router();

songController.post('/', uploader.single('image'), asyncCatch(uploadFile));

export {songController}