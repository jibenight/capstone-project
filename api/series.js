const express = require('express');
const seriesRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || './database.sqlite'
);

seriesRouter.param('seriesId', (req, res, next, seriesId) => {
  const sql = 'SELECT * FROM Series WHERE Series.id = $seriesId';
  const values = { $serieId: serieId };
  db.get(sql, values, (error, series) => {
    if (error) {
      next(error);
    } else if (series) {
      req.series = series;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

seriesRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Series', (err, Series) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({ Series });
    }
  });
});

seriesRouter.get('/:serieId', (req, res, next) => {
  res.status(200).json({ series: req.series });
});

seriesRouter.post('/', (req, res, next) => {
  const name = req.body.series.name;
  const description = req.body.series.description;
  if (!name || !description) {
    return res.sendStatus(400);
  }
  const sql =
    'INSERT INTO Series (name, description) VALUES ($name, $description)';
  const values = {
    $name: name,
    $description: description,
  };
  db.run(sql, values, function (error) {
    if (error) {
      next(error);
    } else {
      db.get(
        `SELECT * FROM Series WHERE Series.id = ${this.lastID}`,
        (error, series) => {
          res.status(201).json({ series: series });
        }
      );
    }
  });
});

seriesRouter.put('/:serieId', (req, res, next) => {
  const name = req.body.series.name;
  const description = req.body.series.description;
  if (!name || !description) {
    return res.sendStatus(400);
  }
  const sql =
    'UPDATE Series SET name = $name, description = $description WHERE Series.id = $serieId';
  const values = {
    $name: name,
    $description: description,
    $serieId: req.params.serieId,
  };
  db.run(sql, values, (error) => {
    if (error) {
      next(error);
    } else {
      db.get(
        `SELECT * FROM Series WHERE Series.id = ${req.params.serieId}`,
        (error, series) => {
          res.status(200).json({ series: series });
        }
      );
    }
  });
});

module.exports = seriesRouter;
