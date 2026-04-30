
// Copyright (C) 2026 Brian Sheldon
//
// MIT License

#include <iostream>
#include <string.h>
#include <string>

#include "io.h"

using namespace std;

void wr( string str = "" ) {
  printf( str.c_str() );
  cout.flush();
}

void wrline( string str = "" ) {
  wr( str + '\n' );
}

int delayTime = 0;
bool fast = true;
bool showState = false;
bool showHex = false;
bool rcvHex = false;

string padLeft( string str, int width, char ch = ' ' ) {
  while ( str.length() < width ) {
    str = ch + str;
  }
  return str;
}

string hex0( int v, int width = 0, char ch = '0' ) {
  string hx = "";
  while ( v > 0 ) {
    int n = v % 16;
    char ch = 0x30 + n;
    if ( n >= 0xa ) {
      ch = 0x61 - 0xa + n;
    }
    hx = ch + hx;
    v = int( v / 16 );
  }
  return padLeft( hx, width, ch );
}

string hex2( int v ) {
  return hex0( v, 2 );
}

string hex4( int v ) {
  return hex0( v, 4 );
}

bool strfind( string str, char ch ) {
  bool found = false;
  for ( char c : str ) {
    if ( c == ch ) {
      found = true;
      break;
    }
  }
  return found;
}

string ascLine( char *data, int pos, int cols ) {
  string line = "";
  for ( int i = 0; i < cols; i++ ) {
    char ch = data[pos+i];
    int cc = (int)ch;
    if ( cc >= 0x20 && cc <= 0x7e ) {
      line += ch;
    } else {
      line += '.';
    }
  }
  return line;
}

string hexLine( char* data, int pos, int cols ) {
  string line = "";
  for ( int i = 0; i < cols; i++ ) {
    line += hex2( data[pos+i] );
    if ( ( i % 2 ) == 1 ) line += " ";
  }
  return line;
}

string hexLines( int addr, char* data, int pos, int rows, int cols ) {
  string lf = "\r\n";
  string lines = "";
  for ( int row = 0; row < rows; row++ ) {
    if ( row != 0 ) lines += lf;
    lines += hex4( addr ) + "  " + hexLine( data, pos, cols ) + "  " + ascLine( data, pos, cols );
    addr += cols;
    pos += cols;
  }
  return lines;
}

//
// cmd line loop
//

void cmdLine( string cmd ) {
  
  if ( cmd == "d" ) {
    //wrline( hexLines( 0, memory, 0, 16, 16 ) );
  } else {
    wr( "[" );
    wr( cmd );
    wrline( "] not recognized ... " );
  }
}

//
// line editing loop
//
// This loop performs basic line editing functions such as backspace, left/right cursor movement and enter to
// submit the command.  Enter will send cmd buffer to the cmdLine loop function.
//

const int cmdBufferLen = 101;
char cmd[cmdBufferLen];
int cmdPos = 0;
int cmdEnd = 0;

void cursorLeft() {
  wr( "\x1b[D" );
}

void cursorRight() {
  wr( "\x1b[C" );
}

void cursorSave() {
  wr( "\x1b[s" );
}

void cursorUnsave() {
  wr( "\x1b[u" );
}

void delStrChar( char* str, int index ) {
  int len = strlen( cmd );
  if ( index >= 0 && index < len ) {
    for ( int i = index; i < len; i++ ) {
      str[i] = str[i+1];
    }
  }
  str[len-1] = '\0';
}

void insStrChar( char* str, int index, char ch ) {
  int len = strlen( cmd );
  if ( ( len + 2 ) < cmdBufferLen && index < ( cmdBufferLen - 2 ) ) {
    for ( int i = len; i >= index; i-- ) {
      str[i+1] = str[i];
    }
    str[index] = ch;
  }
}

void lineEdit( int len, char ch, int cc, string hexStr ) {
  if ( hexStr == "0d" || hexStr == "0a" ) {  // Enter
    wrline();
    wrline( to_string( strlen( cmd ) ) );
    cmdLine( cmd );
    cmdPos = 0;
    cmd[cmdPos] = '\0';
  } else if ( hexStr == "7f" ) {  // Backspace
    if ( cmdPos > 0 ) {
      string right = cmd;
      cmdPos--;
      delStrChar( cmd, cmdPos );
      cursorLeft();
      cursorSave();
      wr( cmd + cmdPos );
      wr( " " );
      cursorUnsave();
    }
  } else if ( hexStr == "1b5b44" ) {  // Left Arrow
    if ( cmdPos > 0 ) {
      cmdPos--;
      cursorLeft();
    }
  } else if ( hexStr == "1b5b43" ) {  // Right Arrow
    if ( cmdPos < ( strlen( cmd ) ) ) {
      cmdPos++;
      cursorRight();
    }
  } else {  // Printable character
    if ( len == 1 ) {
      if ( cc >= 0x20 && cc <= 0x7e ) {
        if ( cmdPos > ( cmdBufferLen - 3 ) ) {
          cmdPos = cmdBufferLen - 3;
          cursorLeft();
        }
        if ( strlen( cmd ) < ( cmdBufferLen - 2 ) ) {
          insStrChar( cmd, cmdPos++, ch );
          string s;
          wr( s + ch );
          //wr( to_string( ch ) );
          cursorSave();
          wr( cmd + cmdPos );
          cursorUnsave();
        }
      }
    }
  }
}


/*
//
// A loop to receive hex data
//
// to be implemented
//

unsigned long rcvHexBeg = 0;
unsigned long rcvHexTimeout = 10000000;

int rcvHexCount = 0;

bool rcvHex = false;

void rcvHexLoop( char ch ) {
  if ( micros() > ( rcvHexBeg + rcvHexTimeout ) ) {
    rcvHex = false;
    Serial.println();
    Serial.print( "Receive Hex data timeout ..." );
  } else if ( ch == '.' ) {
    rcvHex = false;
    Serial.println();
    Serial.print( "Hex Bytes received: " );
    Serial.println( rcvHexCount / 2 );
  } else {
    rcvHexBeg = micros();
    if ( ( rcvHexCount++ % 64 ) == 0 ) {
      Serial.println();
    }
    Serial.print( ch );
  }
}
*/

//
// io redirection and cpu control cmd loop
// This loop is used to perform basic io redirection, cpu control and toggle debugging functions on/off.
// All other characters are forwarded to the lineEdit loop.
//

bool io2cli = true;

void ctrlLoop( int len, char ch, int cc, string hexStr ) {
  if ( hexStr == "1b5b357e" ) {         // PageUp
    wrline( "io directed to cpu ..." );
    io2cli = false;
  } else if ( hexStr == "1b5b367e" ) {  // PageDown
    wrline( "io directed to cli ..." );
    io2cli = true;
  } else if ( hexStr == "1b5b34333231307e" ) {  // 4 3 2 1 0 switch to hex mode
    rcvHex = true;
    wrline( "Waiting for Hex data ..." );
    //rcvHexBeg = micros();
  } else if ( hexStr == "13" ) {
    showState = ! showState;
  } else if ( hexStr == "06" ) {
    fast = ! fast;
    //delayTime = 500;
    if ( fast ) {
      //delayTime = 0;
    }
  } else if ( hexStr == "18" ) {  // ctrl-z
    showHex = ! showHex;
  } else {
    if ( rcvHex ) {
      //rcvHexLoop( ch );
    } else if ( io2cli ) {
      lineEdit( len, ch, cc, hexStr );
    } else {
      //io2cpu queue
    }
  }
}


//
// ioLoop reads incoming characters from serial.  If it receives the ESC character, it tries to
// see if it is the start of an ansi key definition, such as 1b5b44, left arrow.  If ansi end
// character is received, it sends the entire ansi hex string to the ctrlLoop for further processing.
// Otherwise, it sends a single character, including a lone ESC character, to the crtlLoop for processing.
// I am not sure if this loop correctly captures all ansi keyboard characters, but it does capture the
// ones in use by the cli at this point.
//

void ioLoop() {
  string ansiEnd = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~";
  int len = 0;
  int num = 0;
  char buffer[20];
  char ch;
  int cc;
  string chs;
  string hx;
  string hexStr = "";
  bool ansi = false;
  unsigned long end = 0;
  unsigned long timeout = 10000;
  do {
    num = read( 0, &buffer, 1 );
    if ( num > 0 ) {
      cc = buffer[0];
      ch = static_cast<char>( cc );
      hx = hex2( cc );
      hexStr += hx;
      len++;
      if ( cc == 0x1b ) {
        ansi = true;
        //end = micros() + timeout;
      }
      if ( strfind( ansiEnd, ch ) ) {
        ansi = false;
      }
    }
    //if ( micros() > end ) {
      //ansi = false;
    //}
  } while ( ansi );
  if ( num > 0 ) {
    if ( showHex ) wrline( hexStr );
    ctrlLoop( len, ch, cc, hexStr );
  }
}

void loop() {
  while ( 1 ) {
    ioLoop();
  }
}

int main() {
  initTermios( 0 );
  loop();
  return 0;
}








