var express = require('express');
var router = express.Router();
var utilService = require('../services/utils-service');
var log = require('winston');

module.exports = function (pool) {

    var auth = utilService.getAuth();

    router.get('/:id', auth, function (req, res) {
        var id = req.params.id;
        var sql = 'SELECT img, mime_type from photo where id = ? ';

        pool.query(sql, [id], function (error, results, fields) {
                if (!error) {
                    if (results.size == 0) {
                        res.send(400);
                    }
                    var mimeType = 'image/' + results[0].mime_type;
                    res.setHeader('Content-Type',  mimeType );
                    res.status(200).send(results[0].img); // Send the image to the browser.
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
        var metadata = req.body;
        var def = (metadata.default == true)? 1 : 0;

        if (Object.keys(req.files).length == 0) {
            return res.status(400).send('No files were uploaded.');
        }

        var sampleFile = req.files.sampleFile;
        var sql = "INSERT INTO PHOTO SET ?";
        var values = {
            default: def,
            personId: metadata.personId,
            mime_type: sampleFile.name.substr(sampleFile.name.indexOf(".")+1),
            img: sampleFile.data
        };
        pool.query(sql, values, function (error, results, fields) {
                if (!error) {
                    res.status(200).send();
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
        var queryObject = utilService.createDeleteQuery('photos', 'id', id);
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
/*
    router.get('/:id/loadAll', auth, function(req, res){

        var fs = require('fs');
        var path = require('path');
// In newer Node.js versions where process is already global this isn't necessary.
        var process = require("process");
        var moveFrom = "C:\\dev\\bootstraparabia\\WebContent\\images\\photos";


// Loop through all the files in the temp directory
        fs.readdir(moveFrom, function (err, files) {
            if (err) {
                console.error("Could not list the directory.", err);
                process.exit(1);
            }

            files.forEach(function (file, index) {
                // Make one pass and make the file complete
                var fromPath = path.join(moveFrom, file);
                fs.readFile(fromPath, null, function(err,data) {
                    if (!err) {
                        console.log('received data: ' + data);
                        var id = parseInt(file.substr(0, file.indexOf(".") - 1));
                        var sql = "INSERT INTO PHOTO SET ?";
                        var values = {
                            default: 1,
                            personId: id,
                            mime_type: 'jpg',
                            img: data
                        };
                        pool.query(sql, values, function (error, results, fields) {
                                if (!error) {
                                    res.status(200).send();
                                } else {
                                    log.log('error', error);
                                    res.status(500).send();
                                }
                            },
                            function (err) {
                                log.log('error, err');
                                res.status(500).send();
                            });

                    } else {
                        console.log(err);
                    }

                });

            });
        });

        res.status(200).send("Done");

    });
*/
    return router;

};