
function num0( radix, v, width = 0, ch = '0', pad = 'left' ) {
  if ( pad == 'left' ) {
    return v.toString( radix ).padStart( width, ch );
  } else {
    return v.toString( radix ).padEnd( width, ' ' );
  }
}

function hex0( v, width = 0, ch = '0' ) {
  return num0( 16, v, width, ch );
}

function hex2( v ) {
  return hex0( v, 2 );
}

function hex4( v ) {
  return hex0( v, 4 );
}

function ioStart( console ) {
  let ctrlLoop = new CtrlLoop();
  let ioLoop = new IoLoop( console, ctrlLoop.key );
  ioLoop.writeline( 'line one ...' );
  window.write = function( s ) {
    ioLoop.write( s );
  }
  window.writeline = function( s ) {
    ioLoop.writeline( s );
  }
  writeline( 'line two ...' );
}

class CtrlLoop {
  constructor() {
    this.echo = false;
    this.showHex = false;
    this.io2cli = true;
  }
  key( len, ch, cc, hexStr ) {
    switch ( hexStr ) {
      case '05': // ctrl-e
        this.echo = ! this.echo;
        break;
      case '1a': // ctrl-z
        this.showHex = ! this.showHex;
        break;
      case '1b5b357e':
        writeline( 'io directed to emulator ...' );
        this.io2cli = false;
        break;
      case '1b5b367e':
        writeline( 'io direced to monitor ...' );
        this.io2cli = true;
        break;
      default:
        if ( this.echo ) {
          if ( len == 1 ) {
            write( ch );
            if ( cc == 0x7f ) {
              write( '\x1b[D\x1b[s \x1b[u' );
            }
            if ( ch == '\r' ) {
              write( '\n' );
            }
          }
        } else {
          if ( this.showHex ) {
            write( hexStr );
          } else {
            if ( this.io2cli ) {
              // to the cli
            } else {
            }
          }
        }
        break;
    }
  }
}

class IoLoop {
  constructor( console, key ) {
    // not needed for xterm as it already parses input into chucks
    this.ansiEndChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~";
    this.key = key;
    this.initTerm( console );
    this.listen();
  }
  initTerm( console ) {
    this.console = console;
    this.div = document.getElementById( console );
    this.term = new Terminal();
    this.term.open( this.div );
    this.writeline( 'Started ...' );
  }
  write( s ) {
    this.term.write( s );
  }
  writeline( s ) {
    let lf = '\r\n';
    this.write( s + lf );
  }
  listen() {
    let self = this;
    this.term.onData( data => {
      let len = data.length;
      let hexStr = "";
      let ch, cc, hx;
      for ( let i = 0; i < len; i++ ) {
        ch = data[i];
        cc = data.charCodeAt(i);
        hx = hex2( cc );
        hexStr += hx;
      }
      log( 'onData ... ' + hexStr );
      self.key( len, ch, cc, hexStr );
    });
  }
}


