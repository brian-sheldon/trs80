
const fs = require( 'fs' );

//
// output utils
//

function dec0( v, width, ch = ' ' ) {
  return v.toString().padStart( width, ch );
}

function hex0( v, width, ch = '0' ) {
  return v.toString( 16 ).padStart( width, ch );
}

function hex2( v ) {
  return hex0( v, 2 );
}

function hex4( v ) {
  return hex0( v, 4 );
}

function hex6( v ) {
  return hex0( v, 6 );
}

function hex8( v ) {
  return hex0( v, 8 );
}

function asc( v ) {
  let ch = '.';
  if ( v >= 0x20 && v <= 0x7e ) {
    ch = String.fromCharCode( v );
  }
  return ch;
}

function ascline( data, addr, cols ) {
  let line = '';
  for ( let i = 0; i < cols; i++ ) {
    line += asc( data[ addr + i ] );
  }
  return line;
}

function hexline( data, addr, cols ) {
  let line = '';
  for ( let i = 0; i < cols; i++ ) {
    line += hex2( data[ addr + i ] );
    if ( ( i % 2 ) == 1 ) line += ' ';
  }
  return line;
}

function hexlines( data, addr, rows, cols ) {
  let lf = '\n';
  let lines = '';
  for ( let r = 0; r < rows; r++ ) {
    if ( r != 0 ) lines += lf;
    lines += hex4( addr );
    lines += '  ';
    lines += hexline( data, addr, cols );
    lines += '  ';
    lines += ascline( data, addr, cols );
    addr += cols;
  }
  return lines;
}

//
// Process args
//
//
//

const args = process.argv.slice(2);

let path = args[0];
let log = true;
if ( args[1] != "log" ) log = false;
let trk = parseInt( args[2] );
let sec = parseInt( args[3] );

//
// Crc from https://trsjs.48k.ca/
//

let crc;
function update_crc( crc, data ) {
  for ( let b = 0; b < 8; b++ ) {
    if ( ( crc ^ ( data << ( 8 + b ) ) ) & 0x8000 ) {
      crc = ( ( crc << 1 ) ^ 0x1021 ) & 0xffff;
    } else {
      crc = ( crc << 1 ) & 0xffff;
    }
  }
  return crc;
}

//
// Load the disk img
//

let data = fs.readFileSync( path );

let low, high;
let trks, trksize;

let pos = 0;

function get() {
  let byt = data[ pos ];
  return byt;
}

function next() {
  let byt = data[ pos++ ];
  crc = update_crc( crc, byt );
  return byt;
}

function skip( v, max = 100 ) {
  // max needs to be set to 1 in cases where the data following the
  // skip value may have the same value in the beginning, such as
  // 0xf8 preceeding the sector data.  if the first byte of the
  // sector is also a 0xf8, the data will be out of sync.
  let c = 0;
  let cv;
  while ( c < max && ( cv = get() ) == v ) {
    crc = update_crc( crc, cv );
    c++;
    pos++;
  }
  return c;
}

function readcrc() {
  high = next();
  low = next();
  let crc = high << 8 | low;
  return crc;
}

function trkhead() {
  skip( 0x4e );
  skip( 0x00 );
  skip( 0xc2 );
  skip( 0xfc );
}

//
// process entire sector block including sync bytes, info byte,
// crc bytes and data bytes
//

function sector() {
  skip( 0xff );
  skip( 0x4e );
  skip( 0x00 );
  crc = 0xffff;
  skip( 0xa1 );
  skip( 0xfe );
  let trk_rd = next();
  let side_rd = next();
  let sec_rd = next();
  let secsize_rd = next() << 7;
  let crc_info = crc;
  let crc_info_read = readcrc();
  skip( 0x4e );
  skip( 0x00 );
  // reset crc
  crc = 0xffff;
  skip( 0xa1 );
  skip( 0xf8, 1 );
  skip( 0xfb, 1 );
  let sec_addr = pos;
  for ( let i = 0; i < 256; i++ ) {
    next();
  }
  let crc_sec = crc;
  let crc_sec_read = readcrc();
  let ok = false;
  let crcs_ok = "... not ok";
  if ( crc_info == crc_info_read && crc_sec == crc_sec_read ) {
    ok = true;
    crcs_ok = "... ok";
  }
  if ( log ) console.log( "trk: " + dec0( trk_rd, 2 ) + " side: " + side_rd + " sec: " + dec0( sec_rd, 2 ) + " secsize: " + dec0( secsize_rd, 3 ) + " crcs: " + hex4( crc_info ) + ":" + hex4( crc_info_read ) + " " + hex4( crc_sec ) + ":" + hex4( crc_sec_read ) + " " + crcs_ok );
  if ( trk == trk_rd && sec == sec_rd ) {
    console.log( "trk: " + dec0( trk_rd, 2 ) + " side: " + side_rd + " sec: " + dec0( sec_rd, 2 ) + " secsize: " + dec0( secsize_rd, 3 ) + " crcs: " + hex4( crc_info ) + ":" + hex4( crc_info_read ) + " " + hex4( crc_sec ) + ":" + hex4( crc_sec_read ) + " " + crcs_ok );
    console.log( hexlines( data, sec_addr, 16, 16 ) );
  }
  return ok;
}

function disk_head() {
  pos++;
  trks = data[ pos++ ];
  low = data[ pos++ ];
  high = data[ pos++ ];
  trksize = high << 8 | low;
  let u01 = data[ pos++ ];
  
  console.log( "trks: " + trks );
  console.log( "trksize: " + trksize );
}

function disk_scan() {
  let bad_sectors = 0;
  for ( let t = 0; t < trks; t++ ) {
    pos = 16 + t * trksize;
    if ( log ) console.log( "======================  trk: " + dec0( t, 2 ) + " pos: " + hex8( pos ) + "  ======================" );
    pos += 128;
    trkhead();
    for ( let s = 0; s < 18; s++ ) {
      let ok = sector();
      if ( ! ok ) {
        bad_sectors++;
      }
    }
  }
  console.log( "Bad sectors: " + bad_sectors );
}

disk_head();
disk_scan();



