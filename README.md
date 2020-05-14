# ISO 6346

Intermodal (shipping) containers markings ([ISO 6346](https://en.wikipedia.org/wiki/ISO_6346)) command line validator.
<br>
The command line utility validates a container marking, accepting codes in 11 characters (e.g. `RAIU 690011 4`) or in the extended 15 characters format (e.g. `RAIU 690011 4 25 U1`).


## Install

    npm install -g iso6346


## Usage 

Help:

    $ iso6346

      usage   : iso6346 <container marking code>
    
      examples: iso6346 CSQU3054383
                iso6346 CSQ U 305438 3 201G
                iso6346 RAIU 6900114 25U1

      db:
        equipements: 2903
        owners     : 3
        types      : 47

Correct code:

    $ iso6346  RAIU 6900114 25U1

    RAI U 690011 4  2 5 U1 ✔
      ↑ ↑      ↑ ↑  ↑ ↑ ↑
      │ │      │ │  │ │ │
      │ │      │ │  │ │ └─── type: Open Top - Idem + removable top members in end frames
      │ │      │ │  │ └─── height: 2895 mm
      │ │      │ │  │       width: 2436 mm
      │ │      │ │  └───── length: 6068 mm
      │ │      │ │
      │ │      │ └─── check digit: 4
      │ │      └─── serial number: 690011
      │ │
      │ └─────────────── category: freight container
      └──────────────────── owner: RAINBOW CONTAINERS GMBH
                                   APENSEN
                                   Germany

Code containing 2 errors: 

    $ iso6346  RAIU 6900115 25XX

    RAI U 690011 5  2 5 XX ✘
      ↑ ↑      ↑ ↑  ↑ ↑ ↑
      │ │      │ │  │ │ │
      │ │      │ │  │ │ └─── type: ✘ unknown type
      │ │      │ │  │ └─── height: 2895 mm
      │ │      │ │  │       width: 2436 mm
      │ │      │ │  └───── length: 6068 mm
      │ │      │ │
      │ │      │ └─── check digit: 5 ✘ CHECK DIGIT ERROR. Correct check digit is: 4
      │ │      └─── serial number: 690011
      │ │
      │ └─────────────── category: freight container
      └──────────────────── owner: RAINBOW CONTAINERS GMBH
                                   APENSEN
                                   Germany


## Credits

Inspired by beautiful project: https://github.com/meyermarcel/icm


## Licence

MIT

> Copyright (c) 2020 Giorgio Robino
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.

