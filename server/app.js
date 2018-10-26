const express = require('express');
const fs = require('fs');
const app = express();

ignore = (req, res, next) => {
    if (req.originalUrl === '/favicon.ico') {
      res.status(204).json({nope: true});
    } else {next();}
}

logger = (req, res) => {    
    // write your logging code here
        let date = new Date().toISOString();
        res.status(200).send('ok');
        res.on('finish', () => {
            console.info(`User: ${req.get('User-Agent')}, ${date}, ${req.method}, ${req.originalUrl}, ${req.httpVersion}, ${res.statusCode}`); 
            }).end();
        }

app.use([ignore, logger]);

app.get('/', (req, res) => {
// write your code to respond "ok" here
    logger();

});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here

});

module.exports = app;
