var express = require('express');
var router = express.Router();
var utilService = require('../services/utils-service');
var log = require('winston');
const { getFamily, getPerson, getParents, getPositions, getEducation, getAssets } = require('../services/db');

module.exports = function(pool) {

    var auth = utilService.getAuth();

    router.get('/', auth, function (req, res) {
        var name = (req.query.name)?  req.query.name+ '%': '%%';
        var male = (!req.query.male) ? '': ' and male = '  + req.query.male;
        var ptype = (req.query.ptype) ? parseInt(req.query.ptype) : 1;

        var sql = 'SELECT  p.id, p.fullname, p.male, p.born, p.died, p.branch, p.email FROM person p inner join ptype pt on p.id=pt.id WHERE p.fullname like ? ' + male + ' and pt.ptype=?';
        
        pool.query(sql, [name, ptype], function (error, results, fields) {

                if (!error) {
                    res.status(200).send(utilService.pageResults(req, results));
                } else {
                     console.log('error', error)
                    res.status(500).send();
                }
            },
            function (err) {
                console.log('error, err')
                res.status(500).send();
            });
    });

    router.get('/:id', auth,  async (req, res) => {
        var id = req.params.id;
        var ptype = (req.query.ptype) ? parseInt(req.query.ptype) : 1;
        try {
                let result = await getPerson(id, ptype);
                let person = result[0];
                person.positions = await getPositions(person.id);
                person.education = await getEducation(person.id);
                person.assets = await getAssets(person.id);
                let family = {}
                family.spouses = await getFamily(person.id, person.male);
                family.parents = await getParents(person.id);
                person.family=family;
                res.status(200).send(person);
    } catch (err) {
        res.status(500).send();
      }
    });

    router.post('/', auth, function (req, res) {
        var person = req.body.person;
        var queryObject = utilService.createInsertQuery('person', person, 'id');

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
        var queryObject = utilService.createDeleteQuery('person', 'id', id);
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
        var person = req.body.person;
        var queryObject = utilService.createUpdateQuery('person', person, 'id');
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

    router.get('/:id/photos', auth, function (req, res) {
        var id = req.params.id;
        pool.query('SELECT id, date from PHOTO WHERE personId= ? ORDER BY date DESC', [id], function (error, results, fields) {

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

    router.get('/:id/positions', auth, function (req, res) {
        var id = req.params.id;
        pool.query('SELECT po.post, po.id as positionId, org.name, org.id as orgId from position po inner join organization orgs on po.orgId=orgs.id where po.id= ? ORDER BY po.start DESC', [id], function (error, results, fields) {

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

    router.get('/:id/spouses', auth, function (req, res) {
        var id = req.params.id;
        pool.query('(SELECT pe.fullname, pe.id, sp.relationId from person pe inner join spouse sp on pe.id=sp.wifeId where sp.husbandId  =? ) ' +
            'UNION (SELECT pe.fullname, pe.id, sp.relationId from person pe inner join spouse sp on pe.id=sp.husbandId where sp.wifeId = ?) order by id asc ', [id, id], function (error, results, fields) {

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

    router.get('/:id/spouses/:spouseId/children', auth, function (req, res) {
        var id = req.params.id;
        var spouseId = req.params.spouseId;
        pool.query('(SELECT fullname, id, born, childOrder, male from person where fatherId = ?) ' +
            'UNION (SELECT fullname, id, born, childOrder, male from person where motherId = ?) ' +
            'UNION (SELECT fullname, id, born, childOrder, male from person where fatherId = ?) ' +
            'UNION (SELECT fullname, id, born, childOrder, male from person where motherId = ?) order by childOrder asc', [id, spouseId, spouseId, id], function (error, results, fields) {

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

    router.get('/:id/studies', auth, function (req, res) {
        var id = req.params.id;
        pool.query('SELECT ed.eductionId, ed.degree, ed.grad_date, ed.major, skol.schoolname, skol.schoolId from education ed inner join school skol on ed.schoolId = skol.schoolId where ed.id=? order by ed.grad_date desc', [id], function (error, results, fields) {

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

    router.get('/:id/news', auth, function (req, res) {
        var id = parseInt(req.params.id);
        var sql =  'SELECT pubdate, title, id, summary from news inner join innewsperson inp on inp.newsid=news.id where inp.personId =? order by pubdate desc ';
        pool.query(sql, [id], function (error, results, fields) {

                if (!error) {
                    res.status(200).send(utilService.pageResults(req, results));
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