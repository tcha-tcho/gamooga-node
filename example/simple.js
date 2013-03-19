// PLEASE USE YOUR CREDENTIALS IN THIS FILE
var credentials = require('../credentials.json');

var GamoogaClient = require('../');


gc = new GamoogaClient();

gc.connectToRoom(credentials.Gamlet_id, credentials.Gamlet_uuid);
gc.enableLogMsg();
gc.onconnect(function(){
  console.log("connected.")
  //Take a moment to warm the connection
  setTimeout(function(){
    gc.send("chat",{"até":"Testing signs åaéáãô"})
  },1000)
})
gc.onmessage("chat",function(msg){
  console.log(msg)
})
