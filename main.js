const express = require("express"),
app = express(),
path = require("path"),
morgan = require('morgan'),
mongoose = require('mongoose'),
GoogleImages = require('google-images'),
fs = require('fs'),
request = require('request'),
_ = require('underscore'); 
const COUNT = 10;

const client = new GoogleImages('017466138095549846994:wyf_7yvswjq', 'AIzaSyBy9FVOvF0aNrexZX1cjjV2YUtJOTXPudw');

mongoose.connect('mongodb://localhost/gimage');
var Keyword = require('./models/keyword');

app.use(morgan('dev'));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public/stylesheets'));
app.use(express.static(__dirname + '/public/images'));
app.use(express.static(__dirname + '/public/scripts'));

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/search',function(req,res){

var query = req.query.q; 
var imageList= [];
let imageUrls = [];
var newKeyword = Keyword({
    name: query
});

client.search(query,1)
    .then(images => {
      _.each(images,function(obj,index){
        download(obj, query + index +'.jpeg', function(){
          imageList.push(query + index +'.jpeg');
          imageUrls.push(obj.url);
          console.log("download complete for : "+ query + index +'.jpeg');
          if(imageList.length == COUNT){
              newKeyword.images = imageList;
              newKeyword.save(function(err) {
                  if (err) throw err;
                  console.log('Keyword created!');
              });
              res.status(200).send({data:imageUrls});
          }
        });
      });
    });
});

app.get('/keywordList',function(req,res){
  var keywords=[];
   Keyword.find({}, function(err, result){
    if ( err ) throw err;
      _.each(result,function(obj,index){
        keywords.push(obj.name);
      });
    res.status(200).send({data:keywords});
  });
});

app.get('/getImages',function(req,res){
  var imageList=[];
   Keyword.findOne({name:req.query.keyword}, function(err, result){
    if ( err ) throw err;
     res.status(200).send({data:result.images});
      });
});

app.get('/getImage/:file',function(req,res){
 var img = fs.readFileSync(req.params.file);
     res.writeHead(200, {'Content-Type': 'image/jpeg' });
     res.end(img, 'binary');
});


var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

app.listen(3000);

console.log("Running at Port 3000");


  