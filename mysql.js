var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'graduation'
})
connection.connect();



var query = function (sql) {
    return new Promise((resolve, rejcet) => {

        connection.query(sql,function (error, results, fields) {
            if (error){
                rejcet(error);
               
            }
            resolve(results);
        
        });
       
    })
}
module.exports=query;

// var Schema = mysql.connection

// var userSchema = new Schema({
//     id:{
//         type: Int32Array,
//         required: true
//     },
//     name:{
//         type: String,
//         required: true
//     },
//     passworld:{
//         type: Int32Array,
//         required: true
//     },
// })


// module.exports = mysql.module('User',userSchema)

// connection.query('SELECT * FROM `users` ',function(error , results, fields){
//     if(error) throw error;
//     console.log('The solution is:',results);
// });
// connection.end();
