
#include "string"
#include "z80.dis.data.h"

struct Disassem {
  int op;
  int byt;
  uint8_t opc[4];
  uint8_t bytes[6];
  std::string ins;
};

Disassem dis( uint8_t data[], int addr ) {
  std::string ixy[] = { "ix", "iy" };
  Disassem res;
  res.op = 0;
  res.byt = 0;
  uint8_t disp;
  std::string ins;
  res.opc[ res.op ] = data[ addr++ ];
  res.bytes[ res.byt++ ] = res.opc[ res.op ];
  ins = major[ res.opc[ res.op++ ] ];
  while ( ins.length() == 1 ) {
    int ind = std::stoi( ins );
    if ( ind == 3 ) {
      disp = data[ addr++ ];
      res.bytes[ res.byt++ ] = disp;
    }
    res.opc[ res.op ] = data[ addr++ ];
    res.bytes[ res.byt++ ]  = res.opc[ res.op ];
    ins = minor[ ind ][ res.opc[ res.op++ ] ];
  }
  /*
  if ( ins.length() == 1 ) {
    int ind = std::stoi( ins );
    res.opc[ res.op ] = data[ addr++ ];
    res.bytes[ res.byt++ ] = res.opc[ res.op ];
    ins = minor[ind][ res.opc[ res.op++ ] ];
    if ( ins.length() == 1 ) {
      ind = std::stoi( ins );
      res.opc[ res.op ] = data[ addr++ ];
      res.bytes[ res.byt++ ] = res.opc[ res.op ];
      ins = minor[ind][ res.opc[ res.op++ ] ];
      //
    } else {
      //if ( ind == 1 ) {
        //disp = data[ addr++ ];
        //bytes[ byt++ ] = disp;
      //}}
    }
  }
  */
  int pos;
  uint8_t low;
  uint8_t high;
  int v;
  std::string s;
  if ( ( pos = ins.find( "%B" ) ) != std::string::npos ) {
    low = data[addr++];
    res.bytes[ res.byt++ ] = low;
    s = std::to_string( low );
    ins.replace( pos, 2, s );
  }
  if ( ( pos = ins.find( "%W" ) ) != std::string::npos ) {
    low = data[addr++];
    high = data[addr++];
    res.bytes[ res.byt++ ] = low;
    res.bytes[ res.byt++ ] = high;
    v = high * 16 + low;
    s = std::to_string( v );
    ins.replace( pos, 2, s );
  }
  if ( ( pos = ins.find( "%A" ) ) != std::string::npos ) {
    low = data[addr++];
    high = data[addr++];
    res.bytes[ res.byt++ ] = low;
    res.bytes[ res.byt++ ] = high;
    v = high * 16 + low;
    s = std::to_string( v );
    ins.replace( pos, 2, s );
  }
  if ( res.opc[0] == 0xfd ) {
    if ( ( pos = ins.find( "IX" ) ) != std::string::npos ) {
      ins.replace( pos, 2, "IY" );
    }
  }
  res.ins = ins;
  return res;
}



