//CHANGE THIS
var Gamlet_id = 350;
var Gamlet_sess = 336738;
var Gamlet_uuid = "4193d2b8-73d4-11e2-b099-f23c91df4bc1";
// var Gamlet_id = "<YOUR ID>"
// var Gamlet_id = "<YOUR SESSION>"
// var Gamlet_uuid = "<YOUR UUID>"

var GamoogaClient = require('../');


var gc_room    = new GamoogaClient({seelogs:true});
var gc_session = new GamoogaClient({seelogs:true});
var gc_create  = new GamoogaClient({seelogs:true});
var gc_dev     = new GamoogaClient("127.0.0.1");
var sessionCreated;


describe('ConnectToRoom',function(){
  it('It should connect to a given Room',function(done){
    gc_room.onconnect(function(){
      this.ready.should.equal(true)
      this.sessId.should.equal(0)
      done();
    })
  })
  it('It should receive the chat list',function(done){
    gc_room.onmessage("userlist",function(msg){
      msg.ol.length.should.equal(0)
      gc_room.disconnect();
      done();
    })
  })
})

describe('ConnectToSession',function(){
  it('It should connect to a given Session',function(done){
    gc_session.onconnect(function(){
      this.ready.should.equal(true)
      this.keys.sess_id.should.equal(Gamlet_sess)
      done();
    })
  })
  // it('It should receive the session chat list',function(done){
  //   gc_session.onmessage("userlist",function(msg){
  //     msg.ol.length.should.equal(0)
  //     done();
  //   })
  // })
})
gc_room.connectToRoom(Gamlet_id, Gamlet_uuid);
// gc_create.createConnectToSession(Gamlet_id, Gamlet_uuid);
gc_session.connectToSession(Gamlet_sess, Gamlet_uuid);
gc_session.onerror(function(e){
  console.log(e)
})
