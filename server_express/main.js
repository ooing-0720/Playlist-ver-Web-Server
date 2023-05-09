const express = require('express');
const app = express();
const fs = require('fs');
const ejs = require('ejs');
const mysql = require('mysql');
const open = require('open');
const { isBuffer } = require('util');

// 파이썬 연결
const spawn = require('child_process').spawn;
const result = spawn('python', ['face_recog.py']);

var num = 0;

result.stdout.on('data', function(data) {
   // console.log(data.toString());
    if(num == 0){
        open("http://localhost:3400/" + data.toString());
    }
    num++;
});

/*
result.stderr.on('data', function(data) {
    console.log(data.toString());
})
*/

// mysql 연결
const client = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'playlist'
});
const mainPage = fs.readFileSync('./sub.ejs', 'utf8');

var myCss = {
    style: fs.readFileSync('./style.ejs', 'utf8')
};

app.get('/sojeong', (req, res) => {
    client.query('SELECT * FROM sojeong', function(err, result, fields){
        if(err) throw err;
        else{
            var page = ejs.render(mainPage, {
                title: "소정",
                data: result,
                myCss: myCss
            });
            res.send(page);
        }
    });
});

app.get('/heeran', (req, res) => {
    client.query('SELECT * FROM heeran', function(err, result, fields){
        if(err) throw err;
        else{
            var page = ejs.render(mainPage, {
                title: "희란",
                data: result,
                myCss: myCss
            });
            res.send(page);
        }
    });
});

/*
result.stdout.on('data', function(data) {
    var url = "http://localhost:3400/" + data.toString();
    open(url);
});
*/

app.listen(3400, () => {
    console.log('Server Running on Port 3400');
});

