var express = require('express');
var router = express.Router();
var utilService = require('../services/utils-service');
var log = require('winston');

module.exports = function(pool) {

    var auth = utilService.getAuth();

    router.get('/', auth, function (req, res) {
        var name = (req.query.name)?  req.query.name+ '%': '%%';
        var sql = 'SELECT schoolname, schoolid from school';
        sql += utilService.createOrderBy(req);

        pool.query(sql, [name], function (error, results, fields) {

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
        pool.query('SELECT * from school where schoolid= ?', [id], function (error, results, fields) {

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
       var filing = req.body;
       console.log(filing.confirmation_number + ': ' + JSON.stringify(filing));
       res.status(200).send(filing.confirmation_number + ' added.');
      /* var school = req.body.school;
       var queryObject = utilService.createInsertQuery('school', school, 'schoolid');
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
           });*/
    });

    router.put('/:id', auth, function (req, res) {
        var id = req.params.id;
        var school = req.body.school;
        var queryObject = utilService.createUpdateQuery('school', school, 'schoolid');
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
        var queryObject = utilService.createDeleteQuery('school', 'schoolid', id);
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

    router.get('/:id/students', auth, function (req, res) {
        var id = req.params.id;
        var sql = 'SELECT distinct p.fullname, p.id from education edu inner join person p on edu.id=p.id where edu.schoolId = ?';
        sql += utilService.createOrderBy(req);

        pool.query(sql, [id], function (error, results, fields) {

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


    return router;
};