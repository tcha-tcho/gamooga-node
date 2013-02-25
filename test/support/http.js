
/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter
  , methods = require('methods')
  , http = require('http')
  , querystring = require('querystring');

module.exports = request;

function request(app) {
  return new Request(app);
}

function Request(app) {
  var self = this;
  this.data = [];
  this.header = {};
  this.app = app;
  if (!this.server) {
    this.server = http.Server(app);
    this.server.listen(0, function(){
      self.addr = self.server.address();
      self.listening = true;
    });
  }
}

/**
 * Inherit from `EventEmitter.prototype`.
 */

Request.prototype.__proto__ = EventEmitter.prototype;

methods.forEach(function(method){
  Request.prototype[method] = function(path){
    return this.request(method, path);
  };
});

Request.prototype.set = function(field, val){
  this.header[field] = val;
  return this;
};

Request.prototype.write = function(data){
  this.data.push(data);
  return this;
};

Request.prototype.request = function(method, path){
  this.method = method;
  this.path = path;
  return this;
};

Request.prototype.expect = function(body, fn){
  this.end(function(res){
    if ('number' == typeof body) {
      res.statusCode.should.equal(body);
    } else {
      res.body.should.equal(body);
    }
    fn();
  });
};

Request.prototype.end = function(fn){
  var self = this;

  if (this.listening) {
    var req = http.request({
        method: this.method
      , port: this.addr.port
      , host: this.addr.address
      , path: this.path
      , headers: this.header
    });

    this.data.forEach(function(chunk){
      req.write(chunk);
    });

    req.on('response', function(res){
      var buf = '';
      res.setEncoding('utf8');
      res.on('data', function(chunk){ buf += chunk });
      res.on('end', function(){
        res.body = buf;
        fn(res);
      });
    });

    req.end();
  } else {
    this.server.on('listening', function(){
      self.end(fn);
    });
  }

  return this;
};

Request.prototype.post = function(path,data,callback){

  data = querystring.stringify(data);
  var callback = callback;
  var response_ready;
  var server_address = this.server.address()

  var options = {
      method: "POST"
    , port: server_address.port
    , host: server_address.address
    , path: path
    , headers: {'Content-Type': 'application/x-www-form-urlencoded','Content-Length':data.length}
  };

  var request = http.request(options, function(response) {
    response.setEncoding('utf8');
    response.on('data', function(d) {
      response_ready = d;
    });
    function done(){
      callback(response_ready)
    }
    response.on('end', done);
  }).on('error', function(e) {
    console.error(e);
  });
  request.write(data);
  request.end();

};

