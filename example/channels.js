// PLEASE USE YOUR CREDENTIALS IN THIS FILE
var credentials = require('../credentials.json');

//this code will save 'test' channel
//if you run this code for a second time, you gonna use the channel created

// NOTE: you have to be a subscriber to use key-values

var GamoogaClient = require('../');
var gc_room;
var gc_sess;
var channel = "test";

function connect_session(sess){
  console.log(sess)
  var has_sess = (sess.code >= 0);
  gc_sess = new GamoogaClient();
  gc_sess.onconnect(function() {
    console.log("session connected: " + gc_sess.getSessId())
    if (!has_sess) gc_room.send("add_channel",{"channel":channel,"session_id":gc_sess.getSessId()});
  });
  gc_sess.onerror(function(e) {
    if (e == 201 || e == 202 || e == 203) {
      connect_session({code:-1,_id:""}); //change session
    };
  });
  if (has_sess) {
    console.log("connecting using recorded channel")
    gc_sess.connectToSession(sess._id,credentials.Gamlet_uuid);
  } else {
    console.log("creating a new channel")
    gc_sess.createConnectToSession(credentials.Gamlet_id,credentials.Gamlet_uuid);
  };
}

gc_room = new GamoogaClient();

gc_room.onconnect(function() {
  console.log("room connected")
  gc_room.send('get_session',channel);
});
gc_room.onmessage('add_channel',function(data) {
  console.log(data)
  console.log("channel saved")
})

gc_room.onmessage('get_session',function(data) {
  connect_session(data)
});
gc_room.onerror(function(e){
  console.log(e)
})
gc_room.connectToRoom(credentials.Gamlet_id,credentials.Gamlet_uuid);

// GamoogaClient.ENABLE_WEBSOCKET = true;
// GamoogaClient.init("./sock_bridge.swf",on_gamooga_init);