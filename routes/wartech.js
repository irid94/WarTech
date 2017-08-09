var express = require('express');
var router = express.Router();
var https = require('https');
const instagramPosts = require('instagram-posts');
//var request = require('request');

//URL HOLDING CLIENT ID AND SECRET FOR FB
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

/////////////////////Retrieve Twitter data/////////////////////////////
var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: 'BkfqRxtOmDaMw3b5kKeOIAmbj',
  consumer_secret: 'RkJBYrtKGzShbNltIgLesy42iYmltvJkJt6nKDtqFVL5cYhBen',
  access_token_key: '870643322431447040-FMw7k6whJwgF1SqXNTzKKAvV85g04dJ',
  access_token_secret: 'Mx6p71HCSOYNfSbklVoxOeVHG7MiFCFx6553ucWY6njIu'
});

//client.get('search/tweets', {q:'from:HeyTammyBruce #maga'}, function(error, tweets, response) {
//  if(error) throw error;
//  console.log(tweets);  // The favorites.
//});



//client.get('statuses/user_timeline', {screen_name:'HeyTammyBruce',trim_user:1,exclude_replies:1,include_rts:false,count:4}, function(error, tweets, response) {
//  //if(error) throw error;
//  console.log(tweets);  // The favorites.
//});


///////////////Retrieve data from instagram user////////////////////

//instagramPosts('jessnotjazz',{
//    filter: data => data.likes > 20,
//count:40}).then(posts => {
//    console.log(posts);});

router.get('/ig/blogger=:bloggerId&tag=:tagId&startDate=:startDateId',function(req,res,next){
    var strTag = req.params.tagId;
    var arrayOfTags = strTag.split("+");
    if (arrayOfTags.length < 2) {arrayOfTags = req.params.tagId;}
    var strDate = req.params.startDateId;
    var arrayOfDate = strDate.split("+"); //months(in letters)/date/year
    var date= new Date(arrayOfDate[0] + " "+arrayOfDate[1]+" "+arrayOfDate[2]+" "+"2014 01:00:00");
    
    var unixTime = require('unix-time');
    var convertedTime = unixTime(date); // 1374016861 
    console.log(convertedTime);
    
    instagramPosts(req.params.bloggerId,{
    filter: data => data.likes > 20,
count:40, hashtags:arrayOfTags}).then(posts => {
    console.log(posts);
    res.json(posts);
    });
});
 //startDate=:startDateId&endDate=:endDateId
/////////////////////////Routes/////////////////////////////


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

//GET FB ACCESS TOKEN
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