var express = require('express');
var router = express.Router();
var log = require('winston');
var utilService = require('../services/utils-service');

module.exports = function(pool) {

    var auth = utilService.getAuth();

    router.get('/', auth, function (req, res) {
        var sql = 'SELECT sectorname, sectorid from sectors';
        sql += utilService.createOrderBy(req);
        pool.query(sql, [], function (error, results, fields) {

                if (!error) {
                    res.status(200).send(utilService.pageResults(req, results));
                } else {
                    log.log('error', error);
                    res.status(500).send();
                }
            },
            function (err) {
                log.log('error', err);
                res.status(500).send();
            });
    });

    router.get('/:id', auth, function (req, res) {
        var id = req.params.id;
        pool.query('SELECT * from sector inner join orgs on sector.orgId=orgs.ID where sectorid = ?', [id], function (error, results, fields) {

                if (!error) {
                    res.status(200).send(results);
                } else {
                    log.log('error', error);
                    res.status(500).send();
                }
            },
            function (err) {
                log.log('error', err);
                res.status(500).send();
            });
    });

    router.post('/', auth, function (req, res) {
        var sector = req.body.sector;
        var queryObject = utilService.createInsertQuery('sectors', sector, 'sectorId');
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
        var sector = req.body.sector;
        var queryObject = utilService.createUpdateQuery('sectors', sector, 'sectorId');
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
        var sectorId = parseInt(req.params.sectorId);
        var queryObject = utilService.createDeleteQuery('sectors', 'sectorId', id);
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

    router.get('/:id/companies', auth, function (req, res) {
        var id = parseInt(req.params.id);
        var sql = 'SELECT orgs.orgname, orgs.id from organization orgs inner join sectors2orgs s2o.orgId=orgs.orgId where s2o.sectorId = ?';
        sql += utilService.createOrderBy(req);
        pool.query(sql, [id], function (error, results, fields) {

                if (!error) {
                    res.status(200).send(results);
                } else {
                    log.log('error', error);
                    res.status(500).send();
                }
            },
            function (err) {
                log.log('error', err);
                res.status(500).send();
            });
    });

    router.get('/:id/sectors/:sectorId/subsectors', auth, function (req, res) {
        var id = parseInt(req.params.id);
        var sectorId = parseInt(req.params.sectorId);
        var sql = 'SELECT subsector, subsectorId from sectors2orgs s2o inner join subsectors on s2o.subsectorId=subsectors.subsectorId where s2o.orgId = ? and s2o.sectorId = ? ';
        sql += utilService.createOrderBy(req);
        pool.query(sql, [id, sectorId], function (error, results, fields) {

                if (!error) {
                    res.status(200).send(results);
                } else {
                    log.log('error', error);
                    res.status(500).send();
                }
            },
            function (err) {
                log.log('error', err);
                res.status(500).send();
            });
    });

    return router;

};