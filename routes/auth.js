var express = require('express');
var router = express.Router();

module.exports = function(pool) {

    router.post('/login', function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        if (username && password) {
            pool.query('SELECT user.*, JSON_ARRAYAGG(userrights.rights) as rights FROM user inner join userrights on user.userid= userrights.userid WHERE username = ? AND password = ? group by user.userid', [username, password], function (error, results, fields) {
                    if (results && results.length > 0) {
                        req.session.loggedin = true;
                        req.session.username = username;
                        req.session.admin = results[0].admin;
                        let rights = results[0].rights;
                        if(rights.indexOf('4')==-1){
                            res.status(401).send('No permissions for this service');
                        } else {
                        res.sendStatus(200);
                        }
                    } else {
                        res.status(401).send('Incorrect Username and/or Password!');
                    }
                },
                function (err) {
                    console.log(error);
                });
        } else {
            response.status(401).send('Incorrect Username and/or Password!');
        }
    });

    router.post('/logout', function (req, res) {
        req.session.destroy(function (err) {
            if (err) {
                msg = 'Error destroying session';
                res.status(500).send(msg);
            } else {
                res.sendStatus(200);
            }
        });
    });
    return router;

}