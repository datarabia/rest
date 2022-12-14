var express = require('express');
var router = express.Router();
var utilService = require('../services/utils-service');
var log = require('winston');

module.exports = function (pool) {

    var auth = utilService.getAuth();

    router.get('/:id', auth, function (req, res) {
        var id = req.params.id;

        pool.query('SELECT * from position po inner join organization orgs on po.orgId=orgs.id where po.id= ?', [id], function (error, results, fields) {

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

        var position = req.body.position;
        var queryObject = utilService.createInsertQuery('positions', position, 'positionId');
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
        var queryObject = utilService.createDeleteQuery('position', 'positionId', id);
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
        var position = req.body.position;
        var queryObject = utilService.createUpdateQuery('position', position, 'positionId');
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