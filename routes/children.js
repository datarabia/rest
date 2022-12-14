var express = require('express');
var router = express.Router();
var utilService = require('../services/utils-service');
var log = require('winston');

module.exports = function (pool) {

    var auth = utilService.getAuth();

    router.get('/:id', auth, function (req, res) {
        var id = req.params.id;
        pool.query('SELECT * from family where child.id = ? ', [id], function (error, results, fields) {

                if (!error) {
                    res.status(200).send(results);
                } else {
                    log.log('error', error);
                    res.status(500).send();
                }
            },
            function (err) {
                log.log('error, err');
                res.status(500).send();
            });
    });

    router.post('/', auth, function (req, res) {
        var family = req.body.family;
        var queryObject = utilService.createInsertQuery('family', family, 'none');
        pool.query(queryObject.sql, queryObject.fields, function (error, results, fields) {

                if (!error) {
                    res.status(200).send(results);
                } else {
                    log.log('error', error);
                    res.status(500).send();
                }
            },
            function (err) {
                log.log('error, err');
                res.status(500).send();
            });
    });

    router.delete('/:id', auth, function (req, res) {
        var id = parseInt(req.params.id);
        var queryObject = utilService.createDeleteQuery('family', 'childId', id);
        pool.query(queryObject.sql, queryObject.fields, function (error, results, fields) {

                if (!error) {
                    res.status(200).send(results);
                } else {
                    log.log('error', error);
                    res.status(500).send();
                }
            },
            function (err) {
                log.log('error, err');
                res.status(500).send();
            });
    });

    router.put('/:id', auth, function (req, res) {
        var id = req.params.id;
        var family = req.body.family;
        var queryObject = utilService.createUpdateQuery('family', family, 'childId');
        console.log(queryObject.sql);
        pool.query(queryObject.sql, queryObject.fields, function (error, results, fields) {

                if (!error) {
                    res.status(200).send(results);
                } else {
                    log.log('error', error);
                    res.status(500).send();
                }
            },
            function (err) {
                log.log('error, err');
                res.status(500).send();
            });
    });

    return router;

};