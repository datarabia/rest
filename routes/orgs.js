var express = require('express');
var router = express.Router();
var utilService = require('../services/utils-service');
var log = require('winston');

module.exports = function(pool) {

    var auth = utilService.getAuth();

    router.get('/', auth, function (req, res) {
        var name = req.query.name + '%';
        var city =(req.query.city) ? req.query.city : '%%';

        var sql = 'SELECT orgname, orgId from organization where orgname like ? and city like ?  ';
        sql += utilService.createOrderBy(req);

        pool.query(sql, [name, city], function (error, results, fields) {

                if (!error) {
                    res.status(200).send(utilService.pageResults(req, results));
                } else {
                    log.log('error', error);
                    res.status(500).send();
                }
            },
            function (err) {
                console.log(err);
                res.status(500).send();
            });
    });

    router.get('/:id', auth, function (req, res) {
        var id = req.params.id;
        pool.query('SELECT * from organization orgs where id= ?', [id], function (error, results, fields) {

                if (!error) {
                    res.status(200).send(results);
                } else {
                    log.log('error', error);
                    res.status(500).send();
                }
            },
            function (err) {
                console.log(err);
                res.status(500).send();
            });
    });

    router.post('/', auth, function (req, res) {
        var organization = req.body.organization;
        var queryObject = utilService.createInsertQuery('organization', organization, 'id');
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
        var organization = req.body.organization;
        var queryObject = utilService.createUpdateQuery('organization', organization, 'id');
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
        var queryObject = utilService.createDeleteQuery('organization', 'id', id);
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

    router.get('/:id/sectors', auth, function (req, res) {
        var id = parseInt(req.params.id);
        pool.query('SELECT * from sectors2orgs s2o inner join sectors on s2o.sectorId=sectors.sectorId where s2o.orgId = ? ORDER BY sectors.sectorname asc', [id], function (error, results, fields) {

                if (!error) {
                    res.status(200).send(results);
                } else {
                    log.log('error', error);
                    res.status(500).send();
                }
            },
            function (err) {
                console.log(err);
                res.status(500).send();
            });
    });

    router.get('/:id/sectors/:sectorId/subsectors', auth, function (req, res) {
        var id = parseInt(req.params.id);
        var sectorId = parseInt(req.params.sectorId);
        pool.query('SELECT * from sectors2orgs s2o inner join subsectors on s2o.subsectorId=subsectors.subsectorId where s2o.orgId = ? and s2o.sectorId = ? ORDER BY subsectors.subsector asc', [id, sectorId], function (error, results, fields) {

                if (!error) {
                    res.status(200).send(results);
                } else {
                    log.log('error', error);
                    res.status(500).send();
                }
            },
            function (err) {
                console.log(err);
                res.status(500).send();
            });
    });

    router.get('/:id/news', auth, function (req, res) {
        var id = parseInt(req.params.id);
        var sql = 'SELECT pubdate, title, id from news inner join innewsorg ino on ino.newsId=news.id where ino.orgId= ?';
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

    return router;

};