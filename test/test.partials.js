//CHANGE THIS
var Gamlet_id = "<YOUR ID>"
var Gamlet_uuid = "<YOUR UUID>"

var GamoogaClient = require('../');


var gc_room      = new GamoogaClient();
var gc_session   = new GamoogaClient();
var gc_create    = new GamoogaClient();
var gc_dev       = new GamoogaClient("127.0.0.1");
var reconnecting = false;
var session_id   = 0;


describe('ConnectToRoom',function(){
  this.timeout(20000);
  before(function(done){
    gc_room.connectToRoom(Gamlet_id, Gamlet_uuid);
    done();
  })
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
      gc_room.send("chat",["the message ",{has:"to be formatted"},1234])
      done();
    })
  })
  it('It should receive chat messages',function(done){
    gc_room.onmessage("chat",function(msg){
      msg.c.length.should.equal(3)
      msg.c[0].should.equal("the message ")
      msg.c[1].has.should.equal("to be formatted")
      msg.c[2].should.equal(1234)
      gc_room.disconnect()
      done();
    })
  })
  it('It should gracefully disconnect',function(done){
    gc_room.ondisconnect(function(){
      true.should.equal(true);
      done();
    })
  })
})



describe('createConnectToSession',function(){
  this.timeout(20000);
  before(function(done){
    gc_create.createConnectToSession(Gamlet_id, Gamlet_uuid);
    done();
  })
  it('It should connect to a given Session',function(done){
    gc_create.onconnect(function(){
      this.ready.should.equal(true)
      this.isRoomSess.should.equal(2)
      session_id = gc_create.getSessId()
      this.sessId.should.equal(session_id)
      done();
    })
  })
  it('It should receive the session chat list',function(done){
    gc_create.onmessage("userlist",function(msg){
      msg.ol.length.should.equal(0)
      done();
    })
  })
})



describe('ConnectToSession',function(){
  this.timeout(20000);
  before(function(done){
    gc_session.connectToSession(session_id, Gamlet_uuid);
    done();
  })
  it('It should connect to the same session created before',function(done){
    gc_session.onconnect(function(){
      this.ready.should.equal(true)
      this.keys.sess_id.should.equal(session_id)
      if (!reconnecting) done();
    })
  })
  it('It should receive the session chat list',function(done){
    gc_session.onmessage("userlist",function(msg){
      msg.ol.length.should.equal(0)
      gc_session.send("chat",["the message ",{has:"to be formatted"},1234])
      done();
    })
  })
  it('Session should receive chat messages',function(done){
    gc_session.onmessage("chat",function(msg){
      msg.c.length.should.equal(3)
      msg.c[0].should.equal("the message ")
      msg.c[1].has.should.equal("to be formatted")
      msg.c[2].should.equal(1234)
      if(!reconnecting) {
        gc_session.disconnect()
        done();
      }
    })
  })
  it('It should gracefully disconnect and reconnect',function(){
    gc_session.ondisconnect(function(){
      true.should.equal(true);
      reconnecting = true
      gc_session.reconnect();
      gc_session.send("chat",["the message ",{has:"to be formatted"},1234])
    })
  })
})



describe('ConnectToRoom as a Dev',function(){
  this.timeout(20000);
  before(function(done){
    gc_dev.connectToRoom("","");
    done();
  })
  it('It should connect to any Room',function(done){
    //Assuming that you are not running the SDK.
    //There are problems due to that kind of connection. 
    //It need to be implemented.
    gc_dev.onerror(function(e){
      //testing errors
      e.should.equal(203)
      done();
    })
  })
})



