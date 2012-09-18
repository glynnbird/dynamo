// express - the REST API framework
var express = require('express');
var app = express();
var fs = require('fs');
var dynamo = require("dynamo");
var client;
var advertobjects;


fs.readFile('config.js', function (err, data) {
  if (err) throw err;
  var config = JSON.parse(data.toString());
  client = dynamo.createClient( config );
  advertobjects= client.get("eu-west-1").get('advertobjects');
});

var restSend = function(res, status, msg) {
  res.send({ 'msg' : msg, 
             'success' : status });
}

// send a message to a individual or group of connected users
app.get('/advert/:key', function(req, res) {

  // log the request
  console.log(req.route.path);

  console.log("Fetching advert "+ req.params.key);
  advertobjects.query({advert_id: parseInt(req.params.key)}).fetch( function (err,data) { 
    if(err) {
      restSend(res,false,err);
    } else {
      restSend(res, true, data);      
    }
  } );

});

app.listen(5000);




