# gamooga-node

Node.js module for [Gamooga](http://gamooga.com) services.

## Why??

Pricing at *(18/02/2013)*

| Service       | Simultaneos Connections | Cool           |
| ------------- |:-----------------------:| --------------:|
| Pusher        | 5.000                   | $0.0000199     |
| **Gamooga**   | **UNLIMITED**           | **$0.0000190** |
| PubNub        | 10.000/day              | $0.0000010     |

When you expect *A LOT* of people on your app better use Gamooga. It's cheaper than all others services available.

___


## Installation

    $ npm install gamooga-node --save

(`--save` automatically writes to your `package.json` file, tell your friends)


## Usage

**Change the keys** and run `node examples/app.js`.

Or:

```javascript

  gc = new GamoogaClient();

  gc.connectToRoom("<YOUR ID>", "<YOUR UUID>");
  gc.onconnect(function(){
    console.log("connected.")
    setInterval(function(){
      gc.send("chat","Hi from your SERVER!")
    },2500)
  })
  gc.onmessage(function(msg){
    console.log(msg)
  })

```

Your HTML speaks too:

```HTML
<!DOCTYPE html>
<html>
<head>
  <script type="text/javascript" src="http://www.gamooga.com/static/demos/app-chat-lobby/gamooga.js"></script>
  <script type="text/javascript">
    var gc;
    function oninit() {
      gc = new GamoogaClient();

      //CHANGE HERE:
      gc.connectToRoom("<Your APPID>","<Your APPUUID>");

      gc.onconnect(function() {
        console.log("Connected.")
        var rnd = parseInt(Math.random() * 100000);
        gc.send('mynick',{channel:"test1",nick:"user_"+rnd});
        setInterval(function(){
          gc.send('chat','Hi from your HTML');
        },2500)
      });

      gc.onmessage('chat',function(data) {
        console.log(data)
      });

    }
    GamoogaClient.init("./sock_bridge.swf",oninit);
  </script>
</head>
<body>

</body>
</html>
```

Using this default *Chat* Gamlet:
*./example/gamlet.zip*

## sendtosession technique

On every broadcast you made you have to POST your credentials to gamooga server, get your authentication code, to open a websocket and wait until YOU close it.

This is not a good strategy to scale your server. When you get thousands of simultaneous connections you gonna start to face some difficulties.

Happily Gamooga did solve this problem for us. You could use the sendtosession technique:

On your **room.lua** gamlet:
```lua
  gamooga.onmessage("send_to_session_MAKEAHASHKEYHERE", function(conn_id, data)
    gamooga.sendtosession(tonumber(data["sess_id"]),"server_broadcasting", data["data"])
  end)
```

On your **session.lua** gamlet:
```lua
  gamooga.onroommsg("server_broadcasting", function(data)
    gamooga.broadcast("server_broadcast",data);
  end)
```

At your **server.js**:
```javascript

  gc = new GamoogaClient();
  gc.connectToRoom("<YOUR ID>", "<YOUR UUID>");
  gc.ondisconnect(function() {
    gc.reconnect();
  });
  function broadcast_to(session,data) {
    gc.send('send_to_session_MAKEAHASHKEYHERE',{"sess_id":session,"data":data})
  }

```
Now you can hold one of your connections opened to broadcast for any of your sessions. Using:

```javascript
  broadcast_to(1234,{my:"data"})
```

At your client you can now listen to:
```javascript
  gc.onmessage('server_broadcast',function(data) {
    //server is broadcasting...
    console.log(data)
  });
```

___

## Docs

# [Most of this API is working](http://www.gamooga.com/dev/docs/clientjavascript.html#gamoogaclient-constructor)

## Features

### `Fast, Easy and Reliable`

State-of-art realtime backend for your apps/games that guarantees under 1ms response time. None of our competitiors can beat us here! Go.

### `99.9% Uptime`

The most important target for Gamooga's engineering. We strive day in and out to achieve that 99.9% consistently month on month. So you don't have to.

### `Highly Scalable`

Gamooga's horizontally scalable platform is a perfect partner that can augment your marketing efforts to sustain that huge user spike or the gradual user growth.

### `Cross Platform`

Developing for multiple platforms to target maximum user base? Great, that's our goal too. We currently support HTML/JS, Flash, iOS, Android, Unity3D and Marmalade.

### `Fully Customizable`

Gamooga is not just a message broadcaster, its a message processor too. You can upload your own message processing scripts onto our cluster and fully customize our realtime backend as per your needs.

### `Instant deployment`

Ever experienced those deployment nightmares? We have. So we made it super easy. Your server side scripts are deployed with just one click into an infrastructure thats highly optimized for realtime message processing.


## TODO

 - Implement connect using SDK!
 - More Tests!
 - Better, safer syntax.


## Running Tests

To run the test suite first invoke the following command within the repo, installing the development dependencies:

    $ npm install -d

Change the keys on `test/test.partials.js`

then run the tests:

    $ npm test



## Credits

This library is a fork from Gamooga.js, and the partial function remains relatively untouched from there. Gamooga is still updating his library and We will try to maintain this one up-to-date.

The port syntax comes from [Tcha-Tcho](https://github.com/tcha-tcho)


## License

(The MIT License)

Copyright (c) 2013 Gamooga &lt;https://github.com/gamooga&gt;

Copyright (c) 2013 Tcha-Tcho &lt;tchatcho66@hotmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.