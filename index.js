var WebSocket   = require('ws');
var http        = require('http');
var url_parser  = require("url");
var querystring = require('querystring');


String.prototype.leftPad = function (a, c) {
  return a - this.length + 1 <= 0 ? this : Array(a - this.length + 1).join(c || "0") + this
};

function GamoogaClient(_opts) {

  var key, value, _ref, opts;
  this.options = {};
  _ref = exports.defaults["0.1"];
  for (key in _ref) {
    if (!__hasProp.call(_ref, key)) continue;
    value = _ref[key];
    this.options[key] = value;
  }
  if (typeof _opts == "string") {
    this.options.isDev = true;
    this.options.SERVER = _opts;
  }else{
    for (key in _opts) {
      if (!__hasProp.call(_opts, key)) continue;
      value = _opts[key];
      this.options[key] = value;
    }
  };
  opts = this.options;


  //PRIVATE METHODS
  function isEmpty(thing) {
    return typeof thing === "object" && (thing != null) && Object.keys(thing).length === 0;
  };

  function post(path,data,callback) {
    data = querystring.stringify(data);
    var gamooga_url   = url_parser.parse(opts.url);
    var response_ready;
    var options = {
      host: gamooga_url.host
      ,port: 80
      ,path: path
      ,method: 'POST'
      ,headers: {'Content-Type': 'text/plain','Content-Length':data.length}
    };
    var request = http.request(options, function(response) {
      response.setEncoding('utf8');
      response.on('data', function(d) {
        response_ready = d;
      });
      function done(){callback(response_ready) }
      response.on('end', done);
    }).on('error', function(e) {
      _log("Error on accquiring key: " + e)
      opts._onerror(e);
    });
    request.write(data);
    request.end();
  }


  function _getServer(data){
    var server;
    if (opts.isDev) {
      data = opts.SERVER;
    } else {
      server = data.gsh;
      if (server == "127.0.0.1" || server == "localhost") server = "www.gamooga.com"
    }
    return server
  }
  function _getWSServer(data) {
    return opts.isDev ? opts.SERVER : data.wsh
  };

  function process_msg(a) {
    var state = 1;
    var buffer = "";
    var recv_len;
    for (; a.length > 0;) {
      if (state == 1) {
        if (a.length <= 8 - buffer.length) {
          buffer = buffer + a;
          a = ""
        } else {
          var buf_len_now = 8 - buffer.length;
          buffer = buffer + a.substr(0, buf_len_now);
          a = a.substr(buf_len_now)
        }
        if (buffer.length == 8) {
          recv_len = buffer - 0;
          buffer = "";
          state = 2
        }
      }
      if (state == 2) {
        var str_len = a.length;
        if (recv_len <= str_len) {
          buffer = buffer + a.substr(0, recv_len);
          a = a.substr(recv_len);
          recv_len = 0
        } else {
          buffer = buffer + a;
          recv_len = recv_len - a.length;
          a = ""
        }
        if (recv_len == 0) {
          var c = JSON.parse(buffer),
          b = false;
          if (c.type == opts.CLIENT_MESSAGE) {
            //Non UTF problem
            var d = JSON.parse(decodeURI(c.data));
            _log("received message [type,msg] - " + c.data);
            if (opts._onmessage[d[0]]) try {
              opts._onmessage[d[0]](d[1])
            } catch (f) {
              b = f
            }
          } else if (c.type == opts.CLIENT_DISCONNECT) opts.about_to_disconnect = true;
          else if (c.type == opts.CLIENT_SERVER_BUSY || c.type == opts.CLIENT_SERVER_ERROR || c.type == opts.CLIENT_IN_DATA_EXCEED || c.type == opts.CLIENT_OUT_DATA_EXCEED) try {
            this._reportError(c.type)
          } catch (j) {
            b = j
          }
          state = 1;
          buffer = "";
          if (b) throw b;
        }
      }
    }
    return d;
  };

  function _send(a) {
    var str = JSON.stringify(a);
    var len = new String(str.length.toString(16));
    var len = len.leftPad(8);
    if(opts.ready)opts.ws.send(len + str)
  };

  function _log(a) {
    if (opts.seelogs) console.log(a);
  }

  function connectRoomSess(_server,_gsp,_ws_server,_wsp) {
    var ws_url = ("ws://" + _ws_server + ":" + _wsp)

    function handshake() {
      var a;
      opts.isRoomSess == 1 ? a = 1 : opts.isRoomSess == 2 && (a = 501);
      var handshake = {
        type: a,
        id: opts.authKey,
        data: ""
      };
      return handshake;
    }
    opts.ws = new WebSocket(ws_url, {origin:"http://gamooga.com",protocol: "gmg-text"} );

    opts.ws.on('error', function(e) {
      opts._onerror(e);
    })
    opts.ws.on('open', function() {
      if (!opts.ready) opts._onconnecting();
      var test_ready = setInterval(function(){
        opts.ready = (opts.ws.readyState == 1);
        if (opts.ready) {
          _send(handshake());
          opts._onconnect();
          clearInterval(test_ready)
        };
      },300)
    });
    opts.ws.on('close',function(){
      opts._ondisconnect()
    })
    opts.ws.on('message', function(data, flags) {
      process_msg(data);
    });

  }

  function startListen() {
    var isRoom = (opts.keys.type == opts.AUTH_CONNECT_ROOM);
    var isCreate = (opts.keys.type == opts.AUTH_CREATE_CONNECT_SESSION);
    post(opts.keys.type, opts.keys, function(data){
      data = JSON.parse(data)
           if (data.s == -1) opts._onerror(opts.WRONG_APP_UUID);
      else if (data.s == -2) opts._onerror(opts.APP_ID_AND_UUID_NOT_PROVIDED);
      else if (data.s == -3) opts._onerror(opts.WRONG_APP_ID);
      else if (data.s == -4) opts._onerror(opts.LIMITS_REACHED);
      else if (data.s == -5) opts._onerror(opts.GAMLET_UNDEPLOYED);
      else {
        opts.authKey = data.ak;
        opts.isRoomSess = isRoom?1:2;
        opts.sessId = isRoom?0:(isCreate?data.sess:opts.keys["sess_id"]);
        connectRoomSess(_getServer(data), data.gsp, _getWSServer(data), data.wsp)
      }
    })
  }











  //PUBLIC METHODS
  this.connectToRoom = function(id,uuid) {
    opts.keys = {type:opts.AUTH_CONNECT_ROOM, game_id:id, game_uuid:uuid};
    startListen();
  };
  this.createConnectToSession = function(id,uuid) {
    opts.keys = {type:opts.AUTH_CREATE_CONNECT_SESSION, game_id:id, game_uuid:uuid};
    startListen();
  };
  this.connectToSession = function(id,uuid) {
    opts.keys = {type:opts.AUTH_CONNECT_SESSION, sess_id:id, game_uuid:uuid};
    startListen();
  };
  this.reconnect = function() {
    startListen();
  };
  this.onconnect = function(func) {
    opts._onconnect = func;
  }
  this.onconnecting = function(func) {
    opts._onconnecting = func;
  }
  this.onmessage = function(type, func) {
    opts._onmessage[type] = func;
  }
  this.ondisconnect = function(func) {
    opts._ondisconnect = func;
  }
  this.onerror = function(func) {
    opts._onerror = func;
  }

  this.send = function(a,c,callback) {
    //Non UTF problem
    var b = encodeURI(JSON.stringify([a, c]));
        b = b.replace(/\%20/ig," ")
             .replace(/\%22/ig,'"')
             .replace(/\%7B/ig,'{')
             .replace(/\%7D/ig,'}')
             .replace(/\%3C/ig,"<")
             .replace(/\%3E/ig,">")
             .replace(/\%5B/ig,"[")
             .replace(/\%5D/ig,"]")

    _log("sending message [type, msg] - " + b);
    var d = {};
    d.type = opts.isRoomSess == 1 ? 2 : 502;
    d.data = b;
    _send(d)
  }
  this.disconnect = function() {
    _log("disconnecting ...");
    opts.ready = false;
    opts.ws.close();
  }
  this.getSessId = function() {
    return opts.sessId;
  }
  this.disableLogMsg = function() {
    opts.seelogs = false;
  }
  this.enableLogMsg = function() {
    opts.seelogs = true;
  }
}


module.exports = GamoogaClient;

var __hasProp = {}.hasOwnProperty;
  // var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
  // var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

exports.defaults = {
  "0.1": {
     url                         : "http://www.gamooga.com"
    ,SERVER                      : "http://www.gamooga.com"
    ,AUTH_CONNECT_ROOM           : "/auth/connect_room/"
    ,AUTH_CREATE_CONNECT_SESSION : "/auth/create_connect_session/"
    ,AUTH_CONNECT_SESSION        : "/auth/connect_session/"
    ,sock                        : null
    ,sessId                      : 0
    ,_onconnect                  : function(){}
    ,_onconnecting               : function(){} 
    ,_onmessage                  : {}
    ,_onerror                    : function(){}
    ,_ondisconnect               : function(){}
    ,CLIENT_MESSAGE              : 2
    ,CLIENT_SERVER_BUSY          : 3
    ,CLIENT_SERVER_ERROR         : 4
    ,CLIENT_DISCONNECT           : 5
    ,CLIENT_IN_DATA_EXCEED       : 6
    ,CLIENT_OUT_DATA_EXCEED      : 7
    ,IO_ERROR                    : 101
    ,SECURITY_ERROR              : 102
    ,WEBSOCKET_ERROR             : 103
    ,WRONG_APP_ID                : 201
    ,WRONG_APP_UUID              : 202
    ,APP_ID_AND_UUID_NOT_PROVIDED: 203
    ,LIMITS_REACHED              : 204
    ,GAMLET_UNDEPLOYED           : 205
    ,API_ERROR                   : 301
    ,about_to_disconnect         : false
    ,seelogs                     : false
    ,isDev                       : false
 }
};
