var express = require('express');
var adminRoutes = ['users'];
var auth = function(req, res, next) {
    console.log(req.originalUrl);

    if (req.method != 'GET' && !req.session.isAdmin ) {
        return res.sendStatus(401);
    }

    if (req.session && req.session.loggedin) {
        return next();
    }
        return res.sendStatus(401);

};

module.exports = {
    getAuth: function () {
        return auth;
    },

    pageResults: function (req, results) {
        var offset = (req.query.offset) ? parseInt(req.query.offset) : 0;
        var limit = (req.query.limit) ? parseInt(req.query.limit) : results.length;
        var response = {};
        response.offset=offset;
        response.limit=limit;
        response.total = results.length;
        response.results=results.splice(offset, limit);
        return response;
    },

    createOrderBy: function(req) {
        var sql = ' ORDER BY ' + ((req.query.orderBy) ? req.query.orderBy : 'id');
        sql += (req.query.asc) ? ((req.query.asc == 'true')? ' ASC' : ' DESC'): ' ASC';
        return sql;
    },

    createUpdateQuery: function(tablename, object, idField) {
        var sql='UPDATE ' + tablename  + ' SET ';
        var keys=[];
        var idKey;
        for (var key in object) {
            var safeKey = key;
            if (safeKey.toUpperCase() != idField.toUpperCase()) {
                sql += key + '= ?, ';
                var objectValue = object[key];
                 if(typeof objectValue === 'string') {
                     objectValue = decodeURI(objectValue);
                 }
                keys.push(objectValue);
            }
            else {
                idKey = key;
            }
        }
        sql = sql.substr(0, sql.length-2);
        sql +=' WHERE ' + idField + ' = ?';
        keys.push(object[idKey]);
        var queryObject = {};
        queryObject.sql = sql;
        queryObject.fields = keys;
        return queryObject;
    },

    createInsertQuery: function(tablename, object) {
        var sql='INSERT INTO ' + tablename  + '(';
        var keys=[];
        var idKey;
        for (var key in object) {
            sql += key + ", ";
            var objectValue = object[key];
            keys.push(objectValue);
        }
        sql = sql.substr(0, sql.length-2);
        sql += ') VALUES (';

        for (var key in keys){
            sql += '?, '
        }
        sql = sql.substr(0, sql.length-2);
        sql += ')';
        var queryObject = {};
        queryObject.sql = sql;
        queryObject.fields = keys;
        return queryObject;
    },

    createDeleteQuery: function(tablename, fieldName, id) {
        var sql = 'DELETE FROM ' + tablename  + ' WHERE ' + fieldName + ' = ?';
        var keys = [];
        keys.push(id);
        var queryObject = {};
        queryObject.sql = sql;
        queryObject.fields = keys;
        return queryObject;
    }
}