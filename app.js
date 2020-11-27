const express = require('express');
const bodyParse = require('body-parser');
const request = require('request');

const https = require('https');
const app = express();

app.use(express.static("public"));
app.use(bodyParse.urlencoded({extended:true}));

const port = 3000;

app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){
  var firstName = req.body.fname;
  var lastName = req.body.lname;
  var email = req.body.email;
  var FNAME, LNAME;
  var data = {
    members:[
      {
        email_address: email,
        status :  "subscribed",
        merge_fields: {
          FNAME : firstName,
          LNAME : lastName
        }
      }
    ]
  }

  app.post("/failure", function(req,res){
    res.redirect("/");
  })

  var jsonData = JSON.stringify(data);
  // collecting emails to mail chimp
  const url = "https://us7.api.mailchimp.com/3.0/lists/0e0b5b8888"
  const options = {
    method : "POST",
    auth : "kim:2bc7e5156cfe2a7ca47c39dd64ac46d2-us7"
  }

  const request = https.request(url, options, function(response){
    if (response.statusCode === 200 ){
      res.sendFile(__dirname + "/success.html");
    }
    else {
      res.sendFile(__dirname + "/failure.html");
    }


    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

});

// deploy with heroku and local host to test
app.listen(port, function() {
  console.log(`Server runs on http://localhost:${port}`);
});

// deploy with heroku and local host to test
// app.listen(process.env.PORT || port, function() {
//   console.log(`Server runs on http://localhost:${port}`);
// });

//api key: 2bc7e5156cfe2a7ca47c39dd64ac46d2-us7
//list audience id: 0e0b5b8888
