const { Router } = require('express');
const { getAllMovies, createMovie,
    updateMovie, deleteMovie } = require('./movies.controller');
const { upload } = require('./utils/fileUpload');

const router = Router();

router.get('/api/movies', getAllMovies)
router.post('/api/movies', upload, createMovie)
router.put('/api/movies/:id', upload, updateMovie)
router.delete('/api/movies/:id', deleteMovie)

exports.router = router;