const express = require('express');
const artistsRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || './database.sqlite'
);

artistsRouter.param('artistId', (req, res, next, artistId) => {
  const sql = 'SELECT * FROM Artist WHERE Artist.id = $artistId';
  const values = { $artistId: artistId };
  db.get(sql, values, (error, artist) => {
    if (error) {
      next(error);
    } else if (artist) {
      req.artist = artist;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

artistsRouter.get('/', (req, res, next) => {
  db.all(
    'SELECT * FROM Artist WHERE Artist.is_currently_employed = 1',
    (err, artists) => {
      if (err) {
        next(err);
      } else {
        res.status(200).json({ artists });
      }
    }
  );
});

artistsRouter.get('/:artistId', (req, res, next) => {
  res.status(200).json({ artist: req.artist });
});

artistsRouter.post('/', (req, res, next) => {
  const name = req.body.artist.name;
  const dateOfBirth = req.body.artist.dateOfBirth;
  const biography = req.body.artist.biography;

  if (!name || !dateOfBirth || !biography) {
    return res.sendStatus(400);
  }
});

module.exports = artistsRouter;
