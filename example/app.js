// PLEASE USE YOUR CREDENTIALS IN THIS FILE
var credentials = require('../credentials.json');

var GamoogaClient = require('../');
gc = {};
var x = [];
for (var i = 0; i < 10; i++) {
  x[i] = true;
};

x.forEach(function(item,index){

  var i = index;
  gc["x"+i] = new GamoogaClient({"x":i});
  console.log("GamoogaCLient: " + gc["x"+i].options.x)

  gc["x"+i].connectToRoom(credentials.Gamlet_id, credentials.Gamlet_uuid);
  gc["x"+i].onconnecting(function(){
    console.log("connecting")
  })
  gc["x"+i].onconnect(function(){
    console.log("......" + this.x)
    console.log("connected.")
    setInterval(function(){
      gc["x"+i].send("chat","bla bla.... "+gc["x"+i].options.x)
    },2000)
  })
  gc["x"+i].onmessage("chat",function(msg){
    console.log(msg)
  })
  gc["x"+i].ondisconnect(function(){
    console.log("close")
    gc["x"+i].reconnect();
  })
  gc["x"+i].onerror(function(e){
    console.log("error: " + e)
  })

})

