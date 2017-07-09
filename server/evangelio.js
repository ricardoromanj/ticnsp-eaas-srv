import express from 'express';
import _ from 'lodash';

import api from '@/server/api';
import { getConnection } from '@/config/mongodb';
import logger from '@/config/logger';

const CONTOPTS = [
  'fr',
  'sr',
  'gsp',
  'ps'
];

var router = express.Router();

router.get('/liturgy', (req, res) => {
  var reqOpts = req.query;
  api.getLiturgy(reqOpts).then((result) => {
    logger.info(`${req.ip} - GET /liturgy - 200 OK`);
    res.status(200).json({
      status: "OK",
      data: result
    });
  }, (error) => {
    res.status(500).json({
      status: "ERROR",
      data: error
    });
  });
});

router.get('/liturgictitle', (req, res) => {
  var reqOpts = req.query;
  api.getLiturgy(reqOpts).then((result) => {
    res.status(200).json({
      status: "OK",
      data: result.content.liturgicTitle
    });
  }, (error) => {
    res.status(500).json({
      status: "ERROR",
      data: error
    });
  });
});

router.get('/saint', (req, res) => {
  var reqOpts = req.query;
  api.getLiturgy(reqOpts).then((result) => {
    res.status(200).json({
      status: "OK",
      data: result.content.saint
    });
  }, (error) => {
    res.status(500).json({
      status: "ERROR",
      data: error
    });
  });
});

router.get('/feast', (req, res) => {
  var reqOpts = req.query;
  api.getLiturgy(reqOpts).then((result) => {
    res.status(200).json({
      status: "OK",
      data: result.content.feast
    });
  }, (error) => {
    res.status(500).json({
      status: "ERROR",
      data: error
    });
  });
});

router.get('/reading/:content', (req, res) => {
  if (!_.includes(CONTOPTS, req.params.content))
  {
    res.status(500).json({
      status: 'ERROR',
      data: "Only options allowed: " + _.toString(CONTOPTS)
    });
  }
  else
  {
    var reqOpts = req.query;
    api.getLiturgy(reqOpts).then((result) => {
      res.status(200).json({
        status: "OK",
        data: result.content[req.params.content]
      });
    }, (error) => {
      res.status(500).json({
        status: "ERROR",
        data: error
      });
    });
  }
});

router.get('/readingst/:content', (req, res) => {
  if (!_.includes(CONTOPTS, req.params.content))
  {
    res.status(500).json({
      status: 'ERROR',
      data: 'Only options allowed: ' + _.toString(CONTOPTS)
    });
  }
  else
  {
    var reqOpts = req.query;
    api.getLiturgy(reqOpts).then((result) => {
      res.status(200).json({
        status: "OK",
        data: result.content[req.params.content].st
      });
    }, (error) => {
      res.status(500).json({
        status: "ERROR",
        data: error
      });
    });
  }
});

router.get('/readinglt/:content', (req, res) => {
  if (!_.includes(CONTOPTS, req.params.content))
  {
    res.status(500).json({
      status: 'ERROR',
      data: 'Only options allowed: ' + _.toString(CONTOPTS)
    });
  }
  else
  {
    var reqOpts = req.query;
    api.getLiturgy(reqOpts).then((result) => {
      res.status(200).json({
        status: "OK",
        data: result.content[req.params.content].lt
      });
    }, (error) => {
      res.status(500).json({
        status: "ERROR",
        data: error
      });
    });
  }
});

module.exports = router;
