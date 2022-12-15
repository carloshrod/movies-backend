const pool = require('./database/db');
const fs = require('fs-extra');
const { uploadImage, deleteImage } = require('./utils/cloudinary');

const getAllMovies = async (req, res) => {
    try {
        const allMovies = await pool.query('SELECT * FROM movies ORDER BY release_date');
        res.json({ estado: "ok", movies: allMovies.rows })
    } catch (error) {
        res.json({ estado: "error", msg: error.message });
    }
};

const createMovie = async (req, res) => {
    const { nombre, idioma, clasificacion, duracion, fecha_estreno,
        trailer, sinopsis, director, reparto } = req.body
    try {
        const image = req.files?.poster && await uploadImage(req.files.poster.tempFilePath)
        await fs.unlink(req.files.poster.tempFilePath)
        const poster_url = image.secure_url || ""
        const poster_id = image.public_id || ""
        const result = await pool.query(
            `INSERT INTO movies (name, language, rating, duration, release_date, 
                trailer, sinopsis, director, casting, poster_url, poster_id) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [
                nombre, idioma, clasificacion, duracion, fecha_estreno, trailer, sinopsis,
                director, reparto, poster_url, poster_id
            ]);
        res.json({ estado: "ok", msg: "Película creada con éxito!!!", movie: result.rows[0] })
    } catch (error) {
        res.json({ estado: "error", msg: error.message });
    }
};

const updateMovie = async (req, res) => {
    try {
        const { id } = req.params
        const { nombre, idioma, clasificacion, duracion, fecha_estreno,
            trailer, sinopsis, director, reparto, imgUrl, imgId } = req.body
        const image = req.files?.poster && await uploadImage(req.files.poster.tempFilePath)
        if (req.files?.poster) {
            await fs.unlink(req.files.poster.tempFilePath)
            await deleteImage(imgId);
        }
        const poster_url = req.files?.poster ? image.secure_url : imgUrl
        const poster_id = req.files?.poster ? image.public_id : imgId
        const result = await pool.query(
            `UPDATE movies SET name = $1, language = $2, rating = $3, duration = $4, release_date = $5,
            trailer = $6, sinopsis = $7, director = $8, casting = $9, poster_url = $10, poster_id = $11
             WHERE id = $12 RETURNING *`,
            [
                nombre, idioma, clasificacion, duracion, fecha_estreno,
                trailer, sinopsis, director, reparto, poster_url, poster_id, id
            ]
        )
        if (result.rowCount === 0)
            return res.status(404).json({
                message: "Película no encontrada!!!"
            })
        res.json({ estado: "ok", msg: "Película editada con éxito!!!", movie: result.rows[0] })
    } catch (error) {
        res.json({ estado: "error", msg: error.message });
    }
}

const deleteMovie = async (req, res) => {
    const { id } = req.params
    try {
        const imgId = await pool.query('SELECT poster_id FROM movies WHERE id = $1', [id])
        const result = await pool.query('DELETE FROM movies WHERE id = $1', [id])
        if (result.rowCount === 0)
            return res.status(404).json({ estado: "error", msg: "Película no encontrada!!!" })
        await deleteImage(imgId.rows[0].poster_id)
        res.json({ estado: "ok", msg: "Película eliminada con éxito!!!" })
    } catch (error) {
        res.json({ estado: "error", msg: error.message });
    }
}

module.exports = {
    getAllMovies,
    createMovie,
    updateMovie,
    deleteMovie
}