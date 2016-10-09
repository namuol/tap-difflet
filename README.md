# tap-difflet

TAP output formatter using difflet for inequality errors.

## Installation

~~~ text
npm install -g tap-difflet
npm install tap-difflet --save-dev
~~~

## Usage

~~~ text
tape test/*.js | tap-difflet [options]

Options:
  -p --pessimistic  Only output failed tests.
  -v --version      Print the version of tap-difflet.
  -h --help         Show this.
~~~

It also can be used inside node code

~~~ text
var tapDifflet = require('tap-difflet');

var formatter = tapDifflet({
  pessimistic: true // Only output failed tests. `false` by default.
});
~~~

## Output

![tap-difflet](http://i.imgur.com/8uFAvXU.png)

## License

The MIT License (MIT)

Copyright (c) 2014 Ellen Gummesson

Copyright (c) 2014 Louis Acresti

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
