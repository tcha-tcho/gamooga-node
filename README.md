# gamooga-node

Node.js module for [Gamooga](http://gamooga.com) services.

## Why??

Pricing at *(18/02/2013)*

| Service       | Connections Simultaneos | Cool           |
| ------------- |:-----------------------:| --------------:|
| Pusher        | 5.000                   | $0.0000199     |
| **Gamooga**   | **UNLIMITED**           | **$0.0000190** |
| PubNub        | 10.000/day              | $0.0000010     |

When you expect *A LOT* of people on your app better use Gamooga. It's cheaper than all others services available.

## Installation

    $ npm install gamooga-noe --save

(`--save` automatically writes to your `package.json` file, tell your friends)


## Usage

**Change the keys** and run `node examples/app.js`.

or

```javascript
```

And a layout, `test.html`:

```HTML
<!DOCTYPE html>
<html>
<head>
  <script type="text/javascript" src="http://app.eventsourcehq.com/es.js"></script>
  <script type="text/javascript">
  </script>
</head>
<body>

</body>
</html>
```


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

 - More Tests!
 - Better, safer syntax.


## Running Tests

To run the test suite first invoke the following command within the repo, installing the development dependencies:

    $ npm install -d

Change the keys on `test/test.partials.js`

then run the tests:

    $ npm test


## Docs

[Most of this API is working](http://www.gamooga.com/dev/docs/clientjavascript.html#gamoogaclient-constructor)

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