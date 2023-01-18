const pool = require('./database/db');
const fs = require('fs-extra');
const { uploadImage, deleteImage } = require('./utils/cloudinary');

const getAllMovies = async (req, res) => {
    try {
        const allMovies = await pool.query('SELECT * FROM movies ORDER BY release_date desc');
        res.json(allMovies.rows)
    } catch (error) {
        res.json({ msg: error.message });
    }
};

const createMovie = async (req, res) => {
    try {
        const { title, language, rating, duration, release_date,
            trailer, sinopsis, director, casting } = req.body
        const image = req.files?.poster && await uploadImage(req.files.poster.tempFilePath)
        await fs.unlink(req.files.poster.tempFilePath)
        const poster_url = image.secure_url || ""
        const poster_id = image.public_id || ""
        const result = await pool.query(
            `INSERT INTO movies (title, language, rating, duration, release_date, 
                trailer, sinopsis, director, casting, poster_url, poster_id) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [
                title, language, rating, duration, release_date, trailer, sinopsis,
                director, casting, poster_url, poster_id
            ]);
        res.json({ msg: "Movie created successfully!", savedMovie: result.rows[0] })
    } catch (error) {
        res.json({ msg: error.message });
    }
};

const updateMovie = async (req, res) => {
    try {
        const { id } = req.params
        const { title, language, rating, duration, release_date,
            trailer, sinopsis, director, casting, imgUrl, imgId } = req.body
        const image = req.files?.poster && await uploadImage(req.files.poster.tempFilePath)
        if (req.files?.poster) {
            await fs.unlink(req.files.poster.tempFilePath)
            await deleteImage(imgId);
        }
        const poster_url = req.files?.poster ? image.secure_url : imgUrl
        const poster_id = req.files?.poster ? image.public_id : imgId
        const result = await pool.query(
            `UPDATE movies SET title = $1, language = $2, rating = $3, duration = $4, release_date = $5,
            trailer = $6, sinopsis = $7, director = $8, casting = $9, poster_url = $10, poster_id = $11
             WHERE id = $12 RETURNING *`,
            [
                title, language, rating, duration, release_date,
                trailer, sinopsis, director, casting, poster_url, poster_id, id
            ]
        )
        if (result.rowCount === 0)
            return res.status(404).json({
                message: "Movie not found!"
            })
        res.json({ msg: "Movie updated successfully!", updatedMovie: result.rows[0] })
    } catch (error) {
        res.json({ msg: error.message });
    }
}

const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params
        const imgId = await pool.query('SELECT poster_id FROM movies WHERE id = $1', [id])
        const result = await pool.query('DELETE FROM movies WHERE id = $1', [id])
        if (result.rowCount === 0)
            return res.status(404).json({ estado: "error", msg: "Movie not found!" })
        await deleteImage(imgId.rows[0].poster_id)
        res.json({ estado: "ok", msg: "Movie deleted successfully!" })
    } catch (error) {
        res.json({ estado: "error", msg: error.message });
    }
}

const getMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
        res.json(movie.rows[0])
    } catch (error) {
        res.json({ msg: error.message });
    }
};

const getMoviesByTitle = async (req, res) => {
    try {
        const { title } = req.params;
        const foundMovies = await pool.query('SELECT * FROM movies WHERE UPPER(title) LIKE UPPER($1) ORDER BY release_date desc', [`%${title}%`]);
        res.json(foundMovies.rows);
    } catch (error) {
        res.json({ msg: error.message });
    }
};


module.exports = {
    getAllMovies,
    createMovie,
    updateMovie,
    deleteMovie,
    getMovie,
    getMoviesByTitle
}