const express = require('express');
const fs = require('fs');
const app = express();
const csv = require('csvtojson');
ignore = (req, res, next) => {
    if (req.originalUrl === '/favicon.ico') {
      res.status(204).json({nope: true});
    } else {next();
    }
}

app.use(ignore);

app.get('/', (req, res, next) => {
// write your code to respond "ok" here
    let userAgent = req.get('User-Agent');
    let date = new Date().toISOString();
    let method = req.method;
    let resource = req.originalUrl;
    let version = `HTTP/${req.httpVersion}`;
    let status = res.statusCode;
    let csvLine = `${userAgent},${date},${method},${resource},${version},${status}`;
    let newLine = '\n';
    let csvEntry = newLine + csvLine;
    res.status(200).send('ok');        
    console.log(csvLine);
    fs.stat('log.csv', (err) => {
        if (err == null) {
            fs.appendFile('log.csv', csvEntry, (err) => {
                if (err) throw err;
            });
        }
        else {
            console.log(err);
        }
    });
});

app.get('/logs',  (req, res) => {
    var log = [];
    fs.readFile('log.csv','utf-8', (err, sessions) => {
        let row = sessions.split('\n');                                    
        row.forEach((row) => {
            let keyValues = row.split(',');
            let session = {               
                'Agent': keyValues[0],
                'Time': keyValues[1],
                'Method': keyValues[2],
                'Resource': keyValues[3],
                'Version': keyValues[4],
                'Status': keyValues[5]
            };
            log.push(session);
        });
        res.json(log.slice(1));
    });
});


module.exports = app;