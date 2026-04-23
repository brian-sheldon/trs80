



class Altair {
  constructor( div ) {
    log( 'Altair constructor begins ...' );
    this.div = div;
    this.canvas = document.getElementById( div ).children[0];
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ctx = this.canvas.getContext( '2d' );
    this.clear( '#000000' );
    this.panelWidth = 19.5;
    this.config();
    this.initPanel();
    log( 'Altair constructor ends ...' );
  }
  initPanel() {
    this.address = [
      'a15','a14','a13','a12',
      'a11','a10','a9','a8',
      'a7','a6','a5','a4',
      'a3','a2','a1','a0'
    ];
    this.data = [
      'd7','d6','d5','d4',
      'd3','d2','d1','d0'
    ];
    this.ledRows = [
      [
        1,1,
        'inte','prot','memr','inp','m1','out','hlta','stack','wo','int',
        1,0.5,1,
        'd7','d6',
        0.5,
        'd5','d4','d3',
        0.5,
        'd2','d1','d0'
      ],
      [
        1,1,
        'wait','hlda',
        1,
        'a15',
        0.5,
        'a14','a13','a12',
        0.5,
        'a11','a10','a9',
        0.5,
        'a8','a7','a6',
        0.5,
        'a5','a4','a3',
        0.5,
        'a2','a1','a0'
      ],
      [
        1,1,1,1,1,
        '15',
        0.5,
        '14','13','12',
        0.5,
        '11','10','9',
        0.5,
        '8','7','6',
        0.5,
        '5','4','3',
        0.5,
        '2','1','0'
      ],
      [
        'off',
        1,1,1,1,
        'stop',
        1,
        'step',
        1,
        'examine',
        1,
        'deposit',
        1,
        'reset',
        1,
        'protect',
        1,
        'aux',
        1,
        'aux'
      ]
    ];
    let x = 0;
    let y = 0;
    this.leds = {};
    for ( let r = 0; r < this.ledRows.length; r++ ) {
      let row = this.ledRows[r];
      for ( let c = 0; c < row.length; c++ ) {
        //log( x );
        let label = row[c];
        if ( typeof( label ) == 'string' ) {
          this.leds[label] = {};
          this.leds[label].row = r;
          this.leds[label].col = c;
          this.leds[label].x = x;
          this.leds[label].y = y;
          this.leds[label].xabs = this.leftMargin + x * this.hgap;
          this.leds[label].yabs = this.topMargin + y * this.vgap;
          this.leds[label].on = false;
          if ( r < 2 ) {
            this.led( label, this.ledRadius, '#800000' );
          } else {
            this.led( label, this.switchRadius, '#888888' );
          }
          x = x + 1;
        } else {
          x = x + label;
        }
      }
      //log( x );
      x = 0;
      y = y + 1;
    }
    this.hlines();
  }
  config() {
    // horizontal
    this.left = 3;
    this.hcenter = 22.5;
    this.right = 3;
    this.hgap =  this.width / ( this.left + this.hcenter + this.right );
    this.leftMargin =  this.left * this.hgap;
    this.ratio = this.hgap / 28.07017543859649;
    // vertical
    this.top = 50;
    this.vcenter = 0;
    this.bottom = 0;
    this.vgap = 60;
    this.topMargin = 60;
    // background
    this.backgroundColor = '#000000';
    // led
    this.ledRadius = 8 * this.ratio;
    this.ledColorOn = '#880000';
    this.ledColorOff = '#800000';
    // switch
    this.switchRadius = 9 * this.ratio;
    this.switchColorUp = '#aaaaaa';
    this.switchcolorCenter = '#888888';
    this.switchColorDown = '#444444';
    // text
    this.textSize = 10 * this.ratio;
    this.font = this.textSize + 'px Arial';
    this.textColor = '#ffffff';
    // vlines
    this.vlineWidth = 1;
    this.vlineColor = 'white';
    this.vlineBeg = 11 * this.ratio;
    this.vlineInc = 10 * this.ratio;
    this.vlineLen = 5 * this.ratio;
  }
  led( label, r, color, on = false ) {
    let led = this.leds[label];
    led.on = on;
    let x = led.x * this.hgap + this.leftMargin;
    let y = led.y * 60 + 50;
    this.text( label, x, y - 11, this.textColor );
    this.circle( x, y, r, color );
    if ( this.address.includes( label ) || this.data.includes( label ) ) {
      this.vlines( x, y );
    }
  }
  vlines( x, y ) {
    let beg = this.vlineBeg;
    let inc = this.vlineInc;
    let len = this.vlineLen;
    let width = this.vlineWidth;
    let color = this.vlineColor;
    this.line( x, y + beg,           x, y + beg + len,           width, color );
    this.line( x, y + beg + inc,     x, y + beg + inc + len,     width, color );
    this.line( x, y + beg + inc * 2, x, y + beg + inc * 2 + len, width, color );
  }
  hlines() {
    let xoffset = 12 * this.ratio;
    let yoffset = 3 * this.ratio;
    let yoffset2 = 6 * this.ratio;
    let x0, x1, y;
    x0 = this.leds['memr'].xabs - xoffset;
    x1 = this.leds['int'].xabs + xoffset;
    y = this.leds['memr'].yabs + yoffset;
    this.line( x0, y, x1, y, 1, 'white' );
    //
    x0 = this.leds['15'].xabs - xoffset;
    x1 = this.leds['8'].xabs + xoffset;
    y = this.leds['15'].yabs + yoffset;
    this.line( x0, y, x1, y, 1, 'white' );
    x0 = this.leds['7'].xabs - xoffset;
    x1 = this.leds['6'].xabs + xoffset;
    this.line( x0, y, x1, y, 1, 'white' );
    x0 = this.leds['5'].xabs - xoffset;
    x1 = this.leds['3'].xabs + xoffset;
    this.line( x0, y, x1, y, 1, 'white' );
    x0 = this.leds['2'].xabs - xoffset;
    x1 = this.leds['0'].xabs + xoffset;
    this.line( x0, y, x1, y, 1, 'white' );
    //
    x0 = this.leds['15'].xabs - xoffset;
    x1 = this.leds['15'].xabs + xoffset;
    y = this.leds['15'].yabs + yoffset2;
    this.line( x0, y, x1, y, 1, 'white' );
    x0 = this.leds['14'].xabs - xoffset;
    x1 = this.leds['12'].xabs + xoffset;
    this.line( x0, y, x1, y, 1, 'white' );
    x0 = this.leds['11'].xabs - xoffset;
    x1 = this.leds['9'].xabs + xoffset;
    this.line( x0, y, x1, y, 1, 'white' );
    x0 = this.leds['8'].xabs - xoffset;
    x1 = this.leds['6'].xabs + xoffset;
    this.line( x0, y, x1, y, 1, 'white' );
    x0 = this.leds['5'].xabs - xoffset;
    x1 = this.leds['3'].xabs + xoffset;
    this.line( x0, y, x1, y, 1, 'white' );
    x0 = this.leds['2'].xabs - xoffset;
    x1 = this.leds['0'].xabs + xoffset;
    this.line( x0, y, x1, y, 1, 'white' );
  }
  clear( color ) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect( 0, 0, this.width, this.height );
  }
  text( txt, x, y, color ) {
    this.ctx.font = this.font;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = 'center';
    this.ctx.fillText( txt, x, y );
  }
  line( x0, y0, x1, y1, width, color ) {
    this.ctx.beginPath();
    this.ctx.lineWidth = width;
    this.ctx.strokeStyle = color;
    this.ctx.moveTo( x0, y0 );
    this.ctx.lineTo( x1, y1 );
    this.ctx.stroke();
  }
  circle( x, y, r, color ) {
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.arc( x, y, r, 0, 2 * Math.PI );
    this.ctx.fill();
  }
}





