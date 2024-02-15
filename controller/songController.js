import express from 'express';
import {asyncCatch} from '../utils/asyncCatch.js'
import { addSong } from '../services/songServies.js';

const songController = express.Router();

songController.post('/', asyncCatch(addSong));

export {songController}