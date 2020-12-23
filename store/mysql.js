const mysql = require('mysql');

const config = require('../config');

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
};




let connection;

const handleCon = ()=>{
    connection = mysql.createConnection(dbconfig);

    connection.connect((err) => {
        if(err){
            console.log('[db err]', err);
            setTimeout(handleCon, 2000);
        }else{
            console.log('DB connected');
        }
        
    });

    connection.on('error', err => {
        console.log('[db err]', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleCon();
        }
        else{
            throw err;
        }
    });
}
handleCon();


const list = (table)=>{
    return new Promise( (resolve, reject) => {
        connection.query(`SELECT * FROM ${table} `, (err, data) => {
            if(err) return reject(err);

            resolve(data);
        })
    });
}

const get = (table, id)=>{
    return new Promise( (resolve, reject) => {
        connection.query(`SELECT * FROM ${table} WHERE id = '${id}' `, (err, data) => {
            if(err) return reject(err);

            resolve(data);
        })
    })
}


function insert(table,data){
    return new Promise((resolver,reject)=>{
        connection.query(`INSERT INTO  ${table} SET ?`, data,(error,result)=>{
            if(error) return reject(error);
            resolver(result);
        });
    });
}
const update = (table, data)=>{
    return new Promise( (resolve, reject) => {
        connection.query(`UPDATE ${table} SET ? WHERE id= ?`, [data, data.id],  (err, result) => {
            if(err) return reject(err);

            resolve(result);
        })
    });
}

const upsert = (table, data) =>{
    console.log({table, data});
    if(data && data.id){
        return update(table, data);
    }else{
        return insert(table, data);
    }
}

const query = (table, query)=>{
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} WHERE ?`, query, (err, res) => {
            if(err) return reject(err);
            resolve(res[0] || null);
        })
    })
}

module.exports = {
    list,
    get,
    upsert,
    query
}