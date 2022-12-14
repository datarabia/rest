var express = require('express');
var router = express.Router();
var log = require('winston');
var utilService = require('../services/utils-service');


module.exports = function(pool) {

    var auth = utilService.getAuth();

    router.get('/', auth, function (req, res) {

        var ntype = (req.query.ntype) ? parseInt(req.query.ntype) : 1;
        var ptype = (req.query.ptype) ? parseInt(req.query.ptype) : 1;

        var sql = 'SELECT published, title, id, ntype from news where ptype =? and ntype=?';
        sql += utilService.createOrderBy(req);
        pool.query(sql, [ptype, ntype], function (error, results, fields) {

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
        pool.query('SELECT * from news where id= ?', [id], function (error, results, fields) {

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
        var news = req.body.news;
        var queryObject = utilService.createInsertQuery('news', news, 'id');
        pool.query(queryObject.sql, queryObject.fields, function (error, results, fields) {

                if (!error) {
                    res.status(200).send(results);
                } else {
                    log.log('error', error)
                    res.status(500).send();
                }
            },
            function (err) {
                log.log('error, err')
                res.status(500).send();
            });
    });

    router.put('/:id', auth, function (req, res) {
        var id = req.params.id;
        var news = req.body.news;
        var queryObject = utilService.createUpdateQuery('news', news, 'id');
        pool.query(queryObject.sql, queryObject.fields, function (error, results, fields) {

                if (!error) {
                    res.status(200).send(results);
                } else {
                    log.log('error', error)
                    res.status(500).send();
                }
            },
            function (err) {
                log.log('error, err')
                res.status(500).send();
            });
    });

    router.delete('/:id', auth, function (req, res) {
        var id = parseInt(req.params.id);
        var queryObject = utilService.createDeleteQuery('news', 'id', id);
        pool.query(queryObject.sql, queryObject.fields, function (error, results, fields) {

                if (!error) {
                    res.status(200).send(results);
                } else {
                    log.log('error', error)
                    res.status(500).send();
                }
            },
            function (err) {
                log.log('error, err')
                res.status(500).send();
            });
    });

    router.get('/:id/pages', auth, function (req, res) {
        var id = parseInt(req.params.id);
        var sql = 'SELECT pageNum, subtitle FROM NEWSPAGES where newsId = ? ORDER BY pageNUM asc';

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

    router.get('/:id/pages/:pageNum', auth, function (req, res) {
        var id = parseInt(req.params.id);
        var pageNum = parseInt(req.params.pageNum);
        var sql = 'SELECT * FROM NEWSPAGES where newsId = ? and pageNum = ?';

        pool.query(sql, [id, pageNum], function (error, results, fields) {

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

    router.put('/:id/pages/:pageId', auth, function (req, res) {
        var id = req.params.id;
        var news = req.body.news;
        var queryObject = utilService.createUpdateQuery('news', news, 'id');
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

    router.post('/:newsId/pages/', auth, function (req, res) {
        var newsId = req.params.newsId;
        var page = req.body.page;
        var queryObject = utilService.createInsertQuery('NEWSPAGES', page);
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

    router.delete('/:id/persons/:personId', auth, function (req, res) {
        var newsId = req.params.newsId;
        var personId = req.params.personId;
        pool.query('DELETE FROM INNEWSPERSON WHERE personId = ? and newsId = ?',[personId, newsId], function (error, results, fields) {

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

    router.get('/:id/persons', auth, function (req, res) {
        var id = parseInt(req.params.id);
        var sql = 'SELECT fullname, id from person inner join innewsperson inp on inp.personId=person.id where inp.newsId= ?';
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

    router.post('/:newsId/persons/:personId', auth, function (req, res) {
        var newsId = req.params.newsId;
        var personId = req.params.personId;
        pool.query('INSERT INTO INNEWSPERSON (personId, newsId) values (?, ?)',[personId, newsId], function (error, results, fields) {

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

    router.delete('/:id/persons/:personId', auth, function (req, res) {
        var newsId = req.params.newsId;
        var personId = req.params.personId;
        pool.query('DELETE FROM INNEWSPERSON WHERE personId = ? and newsId = ?',[personId, newsId], function (error, results, fields) {

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

    router.get('/:id/orgs', auth, function (req, res) {
        var id = parseInt(req.params.id);
        var sql = 'SELECT orgname, id from organization orgs inner join innewsorg ino on ino.orgId=orgs.id where ino.newsId= ?';
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

    router.post('/:newsId/orgs/:orgId', auth, function (req, res) {
        var newsId = req.params.newsId;
        var orgId = req.params.orgId;
        pool.query('INSERT INTO INNEWSORG (orgId, newsId) values (?, ?)',[orgId, newsId], function (error, results, fields) {

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

    router.delete('/:id/orgs/:orgId', auth, function (req, res) {
        var newsId = req.params.id;
        var orgId = req.params.orgId;
        pool.query('DELETE FROM INNEWSORG WHERE orgId = ? and newsId = ?',[orgId, newsId], function (error, results, fields) {

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