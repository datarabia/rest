var mysql = require('mysql');

var pool  = mysql.createPool({
    connectionLimit : 10,
    host     : 'datarabia.com',
    user     : 'rsmith59_rsmith',
    password : 'barkVWade1Zacnora3!!',
    database : 'rsmith59_datarabia'
});
module.exports = {
    getPool: function (roles) {
            return pool;
    },
    getFamily: (id, male) => {
      return new Promise((resolve, reject) => {
        let spouseId1 = 'motherid';
        let spouseId2 = 'fatherid';
        let role = "wife";
        if (male!=1) {
            spouseId1 = 'fatherid';
            spouseId2 = 'motherid';
            role = "husband";
        }
        let sql = 'select person.FULLNAME as spouse, person.id, '+
        ' p1.id as childid,  trim(p1.FULLNAME) as childname, p1.male as childmale from family inner join person on person.id=family.' + spouseId1 + ' INNER JOIN person AS p1 ON family.childid=p1.id '+
        ' inner join person as p2 on p2.id=family.' + spouseId2 + ' where p2.id =?  order by ' + spouseId1 + ', corder asc;'
         console.log(sql)
         pool.query(sql, [id], (error, results) => {
          if(error){
            return reject(error);
        }
        let spouses = [];
        let spouseId = 0;
        let spouse = {};
        spouse.children=[];
        Object.keys(results).forEach(function(key) {
          var result = results[key];   
          if(result.id!=spouseId && spouseId!=0){
            spouses.push(spouse);
            spouse = {};
            spouse.children=[];
          }
            if(!spouse.id){
              spouseId=result.id;
              spouse.id=result.id;
              spouse.name=result.spouse
            }

            let child = {};
            child.name= result.childname,
            child.id=result.childid,
            child.male=result.childmale;
            spouse.children.push(child);
          })
          if(spouses.length==0 && spouse.id){
            spouses.push(spouse);
          }
          return resolve(spouses);
        })
      })
  },
    

      getPerson: (id, ptype) =>{
        return new Promise((resolve, reject)=>{
          pool.query('select p.id, p.fullname, p.male, p.born, p.died, p.branch, p.email, p.notes FROM person p inner join ptype pt on p.id=pt.id where pt.ptype=? and p.id=?', [ptype, id], (error, results) => {
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
      },

      getParents: (id) =>{
        return new Promise((resolve, reject)=>{
          pool.query('select p.id as fatherid, p.fullname as fathername, p2.id as motherid, p2.fullname as mothername FROM person p inner join family f on p.id=f.fatherid inner join person p2 on p2.id=f.motherid where f.childid =?', [id], (error, results) => {
                if(error){
                    return reject(error);
                }
                let parents = {};
                parents.father={};
                parents.mother={};
                parents.father.id=results[0].fatherid, 
                parents.father.name=results[0].fathername;
                parents.mother.id=results[0].motherid;
                parents.mother.name=results[0].mothername;
                return resolve(parents);
            });
        });
      },
      getPositions: (id) =>{
        return new Promise((resolve, reject)=>{
          pool.query('SELECT po.post, po.start, po.finish, orgs.orgname from position po inner join organization orgs on po.orgId=orgs.id where po.id= ? order by positionid desc', [id], (error, results) => {
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
      },
      getEducation: (id) =>{
        return new Promise((resolve, reject)=>{
          pool.query('SELECT ed.degree, ed.grad_date, ed.major, skol.schoolname, skol.schoolId from education ed inner join school skol on ed.schoolId = skol.schoolId where ed.ID=? order by educationID desc', [id], (error, results) => {
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
      },
      getAssets: (id) =>{
        return new Promise((resolve, reject)=>{
          pool.query('SELECT assetid, assetname, stake, invested, acquired from asset where personid =?', [id], (error, results) => {
                if(error){
                    return reject(error);
                }
                return resolve(results);
            });
        });
      }
   }
    

      
     


