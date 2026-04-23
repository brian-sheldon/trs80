



class Altair {
  constructor( div ) {
    log( 'Altair constructor begins ...' );
    this.createCanvas( div );
    this.ctx = this.canvas.getContext( '2d' );
    this.clear( '#000000' );
    this.panelWidth = 19.5;
    this.config();
    this.initPanel();
    this.test();
    log( 'Altair constructor ends ...' );
  }
  test() {
    let self = this;
    setInterval( function() {
      for ( let i = 0; i < 10; i++ ) {
        let rnd = Math.floor( Math.random() * self.ledsIndex.length );
        let label = self.ledsIndex[rnd];
        self.toggle( label );
      }
    }, 200 );
  }
  toggle( label ) {
    let on = ! this.leds[label].on;
    //log( on );
    this.leds[label].on = on;
    this.led( label, on );
  }
  createCanvas( divid, width = 800, height = 370 ) {
    log( 'createCanvas ...' );
    let div = document.getElementById( divid );
    this.canvas = document.createElement( 'canvas' );
    this.canvas.id = div + '-canvas';
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
    div.appendChild( this.canvas );
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
        'off,on',
        1,1,1,1,
        'stop,run',
        1,
        'single step',
        1,
        'examine,examine next',
        1,
        'deposit,deposit next',
        1,
        'reset,clr',
        1,
        'protect,unprotect',
        1,
        'aux',
        1,
        'aux'
      ]
    ];
    let x = 0;
    let y = 0;
    this.leds = {};
    this.ledsIndex = [];
    for ( let r = 0; r < this.ledRows.length; r++ ) {
      let row = this.ledRows[r];
      for ( let c = 0; c < row.length; c++ ) {
        //log( x );
        let label = row[c];
        if ( typeof( label ) == 'string' ) {
          if ( r < 2 ) {
            this.ledsIndex.push( label );
          }
          this.leds[label] = {};
          this.leds[label].row = r;
          this.leds[label].col = c;
          this.leds[label].x = x;
          this.leds[label].y = y;
          this.leds[label].xabs = this.leftMargin + x * this.hgap;
          this.leds[label].yabs = this.topMargin + y * this.vgap;
          this.leds[label].on = false;
          if ( r < 2 ) {
            this.ledInit( label, this.ledRadius, '#800000' );
          } else {
            this.ledInit( label, this.switchRadius, '#888888' );
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
    this.left = 2;
    this.hcenter = 22.5;
    this.right = 3;
    this.hgap =  this.width / ( this.left + this.hcenter + this.right );
    log( 'hgap: ' + this.hgap );
    this.leftMargin =  this.left * this.hgap;
    this.ratio = this.hgap / 28.07017543859649;
    // special horizontal
    this.xoffset = 11 * this.ratio;
    this.yoffset = 12 * this.ratio;
    this.yoffset2 = 16 * this.ratio;
    // vertical
    this.top = 1;
    this.vcenter = 0;
    this.bottom = 0;
    this.vgap = 60 * this.ratio;
    this.topMargin = this.top * this.vgap;
    // background
    this.backgroundColor = '#000000';
    // led
    this.ledRadius = 8 * this.ratio;
    this.ledColorOn = '#ff0000';
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
  led( label, on = false ) {
    this.leds[label].on = on;
    let led = this.leds[label];
    let x = led.xabs;
    let y = led.yabs;
    let r = this.ledRadius;
    let color = this.ledColorOff;
    if ( on ) {
      color = this.ledColorOn;
    }
    this.circle( x, y, r, color );
  }
  ledInit( label, r, color ) {
    let led = this.leds[label];
    let x = led.x * this.hgap + this.leftMargin;
    let y = led.y * this.vgap + this.topMargin;
    this.label( label, x, y - 11 );
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
  underline( label0, label1, line = 0, leftext = 0, rightext = 0 ) {
    let xoffset = this.xoffset;
    let yoffset = this.yoffset;
    if ( line == 1 ) {
      yoffset = this.yoffset2;
    }
    let x0, x1, x2, x3, y0, y1, x, y;
    let led0 = this.leds[label0];
    let led1 = this.leds[label1];
    x0 = led0.xabs - xoffset - leftext * this.ratio;
    x1 = led1.xabs + xoffset + rightext * this.ratio;
    y = led0.yabs + yoffset;
    this.line( x0, y, x1, y, 1, 'white' );
  }
  hlines() {
    let xoffset = 11 * this.ratio;
    let yoffset = 12 * this.ratio;
    let yoffset2 = 16 * this.ratio;
    let x0, x1, x2, x3, y0, y1, x, y;
    // line under memr - int and label status
    this.underline( 'memr', 'int' );
    x = this.leds['out'].xabs + this.hgap / 2 * this.ratio;
    y = this.leds['memr'].yabs + yoffset + 12 * this.ratio;
    this.text( 'status', x, y, this.textColor );
    //
    let roffset = this.hgap * 0.5 - this.xoffset;
    log( roffset );
    this.underline( '15', '8', 0, 0, roffset ); // need to figure what to use for rightext
    this.underline( '7', '6' );
    this.underline( '5', '3' );
    this.underline( '2', '0', 0 );
    this.underline( '15', '15', 1 );
    this.underline( '14', '12', 1 );
    this.underline( '11', '9', 1 );
    this.underline( '8', '6', 1 );
    this.underline( '5', '3', 1 );
    this.underline( '2', '0', 1, 0, 2 );
    // label, diagonal line and horizontal end left of switch 15
    x0 = this.leds['15'].xabs - xoffset;
    x1 = this.leds['15'].xabs - 17 * this.ratio;
    x2 = this.leds['15'].xabs - 23 * this.ratio;
    x3 = this.leds['15'].xabs - 45 * this.ratio;
    y0 = this.leds['15'].yabs + yoffset;
    y1 = this.leds['15'].yabs + yoffset - 21 * this.ratio;
    this.line( x0, y0, x1, y1, 1, 'white' );
    this.line( x1, y1, x2, y1, 1, 'white' );
    this.text( 'sense sw.', x3, y1, this.textColor );
    // extrended line under switch 15 - 8, requires x0 above
    y0 = this.leds['15'].yabs + yoffset;
    y1 = y0 - 10 * this.ratio;
    x = this.leds[14].xabs + this.hgap * 0.5;
    this.line( x, y0, x, y1, 1, 'white' );
    x = this.leds[11].xabs + this.hgap * 0.5;
    this.line( x, y0, x, y1, 1, 'white' );
    x = this.leds[8].xabs + this.hgap * 0.5;
    this.line( x, y0, x, y1, 1, 'white' );
    // top diagonal line, horizontal line right of switch 0
    x1 = this.leds['0'].xabs + xoffset;
    x0 = this.leds['0'].xabs + 13 * this.ratio;
    y = y0;
    y0 = this.leds['0'].yabs + yoffset - 3 * this.ratio;
    y1 = y;
    this.line( x0, y0, x1, y1, 1, 'white' );
    x1 = this.leds['0'].xabs + 52 * this.ratio;
    y1 = y0;
    this.line( x0, y0, x1, y1, 1, 'white' );
    // bottom diagonal line and horizontal line right of switch 0
    x1 = this.leds['0'].xabs + xoffset + 2 * this.ratio;
    x0 = this.leds['0'].xabs + 15 * this.ratio;
    y0 = this.leds['0'].yabs + yoffset2 - 3 * this.ratio;
    y1 = this.leds['0'].yabs + yoffset2;
    this.line( x0, y0, x1, y1, 1, 'white' );
    x1 = this.leds['0'].xabs + 52 * this.ratio;
    y1 = y0;
    this.line( x0, y0, x1, y1, 1, 'white' );
    // labels right of switch 0
    x = this.leds['0'].xabs + 20 * this.ratio;
    y = this.leds['0'].yabs + yoffset - 8 * this.ratio;
    this.text( 'Data', x, y, this.textColor, 'left' );
    y = this.leds['0'].yabs + yoffset + 12 * this.ratio;
    this.text( 'Address', x, y, this.textColor, 'left' );
  }
  clear( color ) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect( 0, 0, this.width, this.height );
  }
  label( txt, x, y ) {
    let t = '', b = '';
    let t1 = '', t2 = '', b1 = '', b2 = '';
    if ( txt.includes( ',' ) ) {
      [ t, b ] = txt.split( ',' );
    } else {
      t = txt;
    }
    if ( t.includes( ' ' ) ) {
      [ t1, t2 ] = t.split( ' ' );
    } else {
      t2 = t;
    }
    if ( b.includes( ' ' ) ) {
      [ b1, b2 ] = b.split( ' ' );
    } else {
      b1 = b;
    }
    if ( t1 != '' ) this.text( t1, x, y - 10 * this.ratio );
    if ( t2 != '' ) this.text( t2, x, y );
    if ( b1 != '' ) this.text( b1, x, y + 28 * this.ratio );
    if ( b2 != '' ) this.text( b2, x, y + 38 * this.ratio );
  }
  text( txt, x, y, color = this.textColor, align = 'center' ) {
    this.ctx.font = this.font;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = align;
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





