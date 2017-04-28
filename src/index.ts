import * as express from "express";
import * as bodyParser from "body-parser"
import * as Application from "./applications/Application"

var app = express();
var mongoose = require('mongoose');
mongoose.connect("mongodb://192.168.99.100/mydb");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/* Create */
app.post('/api/applications', function (req, res) {
    var newApplication = new Application(req.body);
    newApplication.save((err)=>{
        if (err){
            res.json({info: 'error during Application create', error: err});
        }
        res.json({info: 'Application saved successfully', data: newApplication}); 
    });
});

/* Read all */
app.get('/api/applications', function (req, res) {
    Application.find((err, Applications) => {
        if (err) {
            res.json({info: 'error during find Applications', error: err});
        }
        res.json({info: 'Applications found successfully', data: Applications});
    });
});

/* Find one */
app.get('/api/applications/:name', function (req, res) {
    var query = { name: req.params.name};
    Application.findOne(query, function(err, Application) {
        if (err) {
            res.json({info: 'error during find Application', error: err});
        }
        if (Application) {
            res.json({info: 'Application found successfully', data: Application});
        } else {
            res.json({info: 'Application not found with name:'+ req.params.name});
        }
    });
});

var server = app.listen(3000, function () {
    console.log('Server listening on port 3000');
});