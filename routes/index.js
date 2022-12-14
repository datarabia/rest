var express = require('express');
var router = express.Router();

module.exports = function(){

    router.get('/', function(req, res){
        res.send(200);
    });

   return router;
}