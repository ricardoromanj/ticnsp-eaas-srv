import express from 'express';
import evangelizo from 'evangelizo';

var router = express.Router();

router.get('/liturgictitle', (req, res) => {
    var reqOpts = req.query;
    evangelizo.getLiturgicTitle(reqOpts).then((str) => {
        res.status(200).json({
            status: "OK",
            data: {
                text: str
            }
        });
    }, (evangelizoError) => {
        res.status(500).json({
            status: "ERROR",
            data: {
                message: evangelizoError
            }
        });
    });
});

router.get('/feast', (req, res) => {
    var reqOpts = req.query;
    evangelizo.getFeast(reqOpts).then((str) => {
        res.status(200).json({
            status: "OK",
            data: {
                text: str
            }
        });
    }, (evangelizoError) => {
        res.status(500).json({
            status: "ERROR",
            data: {
                message: evangelizoError
            }
        });
    });
});

router.get('/saint', (req, res) => {
    var reqOpts = req.query;
    evangelizo.getSaint(reqOpts).then((str) => {
        res.status(200).json({
            status: "OK",
            data: {
                text: str
            }
        });
    }, (evangelizoError) => {
        res.status(500).json({
            status: "ERROR",
            data: {
                message: evangelizoError
            }
        });
    });
});

router.get('/reading/:content',(req, res) => {
    if (req.query.lang || req.query.date)
    {
        var reqOpts = req.query;
        evangelizo.getReading(req.params.content, reqOpts).then((str) => {
            res.status(200).json({
                status: "OK",
                data: {
                    text: str
                }
            });
        }, (evangelizoError) => {
            res.status(500).json({
                status: "ERROR",
                data: {
                    message: evangelizoError
                }
            });
        });
    }
    else
    {
        evangelizo.getReading(req.params.content).then((str) => {
            res.status(200).json({
                data: {
                    text: str
                }
            });
        }, (evangelizoError) => {
            res.status(500).json({
                status: "ERROR",
                data: {
                    message: evangelizoError
                }
            });
        });
    }
});

module.exports = router;
