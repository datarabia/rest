var express = require('express');
var router = express.Router();
var utilService = require('../services/utils-service');
var log = require('winston');

module.exports = function (pool) {

    var auth = utilService.getAuth();

    router.get('/', auth, function (req, res) {
        var id = req.params.id;
        var sql = 'SELECT * from USER';
        sql += utilService.createOrderBy(req);
        pool.query(sql, function (error, results, fields) {
                if (!error) {
                    res.status(200).send(utils-service.pageResults(req, results));
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

    router.get('/:id', auth, function (req, res) {
        var id = req.params.id;
        pool.query('(SELECT * from USER where userid = ?', [id], function (error, results, fields) {

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
        var user = req.body.user;
        var queryObject = utilService.createInsertQuery('user', user, 'userid');
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
        var queryObject = utilService.createDeleteQuery('user', 'userid', id);
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
        var user = req.body.user;
        var queryObject = utilService.createUpdateQuery('user', user, 'userid');
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