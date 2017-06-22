var express = require('express');
var router = express.Router();
var https = require('https');
//var request = require('request');

var fbOptions = {
    host: 'graph.facebook.com', 
    path: '/oauth/access_token?client_id=112448062688233&client_secret=4474c256b73af3356493872507452195&grant_type=client_credentials',
    method: 'GET'
};

var mongoose = require('mongoose');
//Use of native Node primises
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/wartech-app');

var db1 = mongoose.connection;
db1.on('error', console.error.bind(console, 'connection error:'));
db1.once('open', function callback () {
 "connected!2"
});

var Schema = mongoose.Schema;

var WarTechSchema = new Schema({
    _id: String,
    facebook: String,
    instagram: String,
    twtter: String,
    instagramid: Number,
    url: String,
},{ collection: 'bloggers'});

var blogger= mongoose.model("Blogger", WarTechSchema);
blogger.create();

/*
var test = new blogger({ _id: 'test2',
    facebook: 'ttt',
    instagram: 'ss',
    twtter: 'fff',
    instagramid: 34234,
    url: 'Zildjian' });

test.save();

*/

//https.get(fbOptions, function(res) {
//  console.log("Got response: " + res.statusCode);
//
//  res.on("data", function(chunk) {
//    console.log("BODY: " + chunk);
//  });
//}).on('error', function(e) {
//  console.log("Got error: " + e.message);
//});




router.get('/', function(req,res){
    console.log("run method");
    blogger.find({}).exec(function(err,blog){
        if(err) return res.send('cannot find in the database');
        res.json(blog);     
    });
});

router.get('/bloggers', function(req,res){
    console.log("run method");
    blogger.find({}).exec(function(err,blog){
        if(err) return res.send('cannot find in the database');
        res.json(blog);     
    });
});

router.get('/fb', function(req,res,next){
    https.get(fbOptions, function(ress) {
  ress.on("data", function(chunk) {
      var gg = JSON.parse(chunk);
      res.json(gg);
  });
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});
});

//GET /wartech/id
router.get('/:id', function(req,res,next){
    blogger.findById(req.params.id, function(err,post){
        if (err) return next(err);
        res.json(post);
    });
});


//POST for /wartech
router.post('/', function(req, res, next){
    Blogger.create(req.body, function (err,post){
        if (err) return next(err);
        res.json(post);
    });
});

//GET /wartech/id
router.get('/:blogger', function(req,res,next){
    blogger.findById(req.params.blogger, function(err,post){
        if (err) return next(err);
        res.json(post);
    });
});


//PUT request to update an id /wartech:id
router.put('/:id', function (req,res,next){
    blogger.findByIdAndUpdate(req.params.id, req.body, function (err,post){
        if(err) return next(err);
        res.json(post);
    });
});

//DELETE /wartech/:id
router.delete('/:id', function(req,res,next){
    blogger.findByIdAndRemove(req.params.id, req.body, function(err,post){
        if(err) return next(err);
        res.json(post);
    });
});

//TEst to geta single blogger

module.exports = router;