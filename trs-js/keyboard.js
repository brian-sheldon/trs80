
function klog( s ) {
  $('#klog').append( s + '<br>' );
}

function scan() {
  let state = trsEmu.get();
  let mem = state.mem;
  let sp = '&nbsp;';
  let h = '';
  h += mem[0x3801] + sp;
  h += mem[0x3802] + sp;
  h += mem[0x3804] + sp;
  h += mem[0x3808] + sp;
  h += mem[0x3810] + sp;
  h += mem[0x3820] + sp;
  h += mem[0x3840] + sp;
  h += mem[0x3880] + sp;
  h += mem[0x38ff] + sp;
  $('#keyscan').html(h);
}

let keyboard = new function() {
  //
  /*
  let rows = [
    ['1','2','3','4','5','6','7','8','9','0',':','-','BREAK'],
    ['UP','Q','W','E','R','T','Y','U','I','O','P','@','LEFT','RIGHT'],
    ['DOWN','A','S','D','F','G','H','J','K','L',';','ENTER','CLEAR'],
    ['LSHIFT','Z','X','C','V','B','N','M',',','.','/','RSHIFT'],
    ['SPACE']
  ];
  //
  let rows_shifted = [
    ['!','"','#','$','%','&',"'",'(',')',' ','*','=','BREAK'],
    ['UP','q','w','e','r','t','y','u','i','o','p','@','LEFT','RIGHT'],
    ['DOWN','a','s','d','f','g','h','j','k','l','+','ENTER','CLEAR'],
    ['LSHIFT','z','x','c','v','b','n','m','<','>','?','RSHIFT'],
    ['SPACE']
  ];
  */
  let rows = [
    ['Run','Reset','Log','UP','Hold'],
    ['BREAK',',','.','/',';',"'",'LEFT','DOWN','RIGHT','CLEAR'],
    ['1','2','3','4','5','6','7','8','9','0'],
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['LSHIFT','Z','X','C','V','B','N','M','RSHIFT'],
    ['ABC',",",'SPACE','.','ENTER']
  ];
  //
  let rows_shifted = [
    ['Run','Reset','Log','UP','Hold'],
    ['BREAK','<','>','?',':','"','LEFT','DOWN','RIGHT','CLEAR'],
    ['!','@','#','$','%','^','&','*','(',')'],
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['LSHIFT','Z','X','C','V','B','N','M','RSHIFT'],
    ['ABC',",",'SPACE','.','ENTER']
  ];
  //
  this.display = function() {
    klog( 'klog started ...' );
    //log('keyboard');
    let layout = '';
    //this.layout = '<div class="keyboard">';
    for ( let r = 0; r < rows.length; r++ ) {
      let row = rows[r];
      let row_shifted = rows_shifted[r];
      layout += '<div class="row' + r + '">';
      for ( let k = 0; k < row.length; k++ ) {
        let key = row[k];
        let key_shifted = row_shifted[k];
        let clss = 'key regkey';
        let label = key;
        if ( key.length > 1 ) {
          clss += ' ' + key.toLowerCase();
        }
        if ( key.toLowerCase() != key_shifted.toLowerCase() && key_shifted != '' && key.length == 1 ) {
          label = key_shifted + '<br>' + key;
        }
        switch ( key ) {
          case 'Run':
            id = 'run';
            clss = 'nokey';
            break;
          case 'Reset':
            id = 'reset';
            clss = 'nokey';
            break;
          case 'Log':
            id = 'logkey';
            clss = 'nokey';
            break;
          case 'Hold':
            id = 'hold';
            clss = 'key';
            break;
          case '1':
            id = 'n1';
            break;
          case '2':
            id = 'n2';
            break;
          case '3':
            id = 'n3';
            break;
          case '4':
            id = 'n4';
            break;
          case '5':
            id = 'n5';
            break;
          case '6':
            id = 'n6';
            break;
          case '7':
            id = 'n7';
            break;
          case '8':
            id = 'n8';
            break;
          case '9':
            id = 'n9';
            break;
          case '0':
            id = 'n0';
            break;
          case ':':
            id = 'colon';
            break;
          case '-':
            id = 'minus';
            break;
          case 'BREAK':
            id = 'break';
            break;
          case 'UP':
            id = 'up';
            clss += ' arrow';
            label = '&uarr;';
            break;
          case 'DOWN':
            id = 'down';
            clss += ' arrow';
            label = '&darr;';
            break;
          case 'LEFT':
            id = 'left';
            clss += ' arrow';
            label = '&larr;';
            break;
          case 'RIGHT':
            id = 'right';
            clss += ' arrow';
            label = '&rarr;';
            break;
          case '@':
            id = 'at';
            break;
          case ';':
            id = 'semicolon';
            break;
          case 'ENTER':
            id = 'enter';
            break;
          case 'CLEAR':
            id = 'clear';
            break;
          case "'":
            id = 'SINGLEQUOTE';
            break;
          case ',':
            id = 'comma';
            break;
          case '.':
            id = 'dot';
            break;
          case '/':
            id = 'slash';
            break;
          case 'LSHIFT':
            id = 'lshift';
            clss = 'key';
            label = 'SHIFT';
            break;
          case 'RSHIFT':
            id = 'rshift';
            clss = 'key';
            label = 'SHIFT';
            break;
          case 'SPACE':
            id = 'space';
            break;
          default:
            id = key;
            break;
        }
        layout += '<div id="' + id + '" class="' + clss + '">' + label + '</div>';
      }
      layout += '<div class="cl"></div>';
      layout += '</div>';
    }
    //this.layout += '</div>'
    $('#keyboard').html( layout );
  }
  //
  //
  this.hold = false;
  this.shift = false;
  key = function( id, down = false ) {
    //log(id);
    switch ( id ) {
      case 'enter':
        k = '\r';
        break;
      case 'break':
        k = '\003';
        break;
      case 'up':
        k = '\013';
        break;
      case 'down':
        k = '\012';
        break;
      case 'left':
        k = '\010';
        break;
      case 'right':
        k = '\011';
        break;
      case 'space':
        k = '\040';
        break;
      case 'clear':
        k = '\001';
        break;
      case 'n1':
        k = this.shift ? '!' : '1';
        break;
      case 'n2':
        k = this.shift ? '"' : '2';
        break;
      case 'n3':
        k = this.shift ? '#' : '3';
        break;
      case 'n4':
        k = this.shift ? '$' : '4';
        break;
      case 'n5':
        k = this.shift ? '%' : '5';
        break;
      case 'n6':
        k = this.shift ? '&' : '6';
        break;
      case 'n7':
        k = this.shift ? "'" : '7';
        break;
      case 'n8':
        k = this.shift ? '(' : '8';
        break;
      case 'n9':
        k = this.shift ? ')' : '9';
        break;
      case 'n0':
        k = '0';
        break;
      case 'colon':
        k = this.shift ? '*' : ':';
        break;
      case 'minus':
        k = this.shift ? '=' : '-';
        break;
      case 'at':
        k = '@';
        break;
      case 'semicolon':
        k = this.shift ? ':' : ';';
        break;
      case 'SINGLEQUOTE':
        k = this.shift ? '"' : "'";
        break;
      case 'comma':
        k = this.shift ? '<' : ',';
        break;
      case 'dot':
        k = this.shift ? '>' : '.';
        break;
      case 'slash':
        k = this.shift ? '?' : '/';
        break;
      case 'hold':
        k = '';
        if ( down ) {
          if ( this.hold ) {
            this.hold = false;
            $('#hold').removeClass('holddown');
            $('.regkey').each( function () {
              let id = $(this).attr('id');
              $(this).removeClass('on');
            });
          } else {
            this.hold = true;
            $('#hold').addClass('holddown');
          }
        }
        break;
      case 'lshift':
      case 'rshift':
        k = '';
        if ( down ) {
          if ( this.shift ) {
            this.shift = false;
            $('#lshift').removeClass('shiftdown');
            $('#rshift').removeClass('shiftdown');
          } else {
            this.shift = true;
            $('#lshift').addClass('shiftdown');
            $('#rshift').addClass('shiftdown');
          }
        }
        break;
      default:
        k = id;
        break;
    }
    return k;
  }
  
  this.enablenew = function() {
    $('.key').on( 'mousedown', function( e ) {
      klog( 'mousedown ...' );
    });
  }

  this.enable = function() {
    
    //let id = '';
    /*
    $('.key').bind('touchstart mousedown', function (e) {
      start = true;
      startTime = window.performance.now();
      game();
      //log('key start ... '+t);
      tsx = e.originalEvent.touches[0].clientX;
      tsy = e.originalEvent.touches[0].clientY;
      //log(tsx);
      e.stopPropagation();
      e.preventDefault();
      let id = $(this).attr('id');
    });
    */
    $('.key').bind('touchstart mousedown', function (e) {
      let t = window.performance.now();
      
      e.stopPropagation();
      e.preventDefault();
      let id = $(this).attr('id');
      klog($(this).hasClass('on'));
      let k = key(id, true);
      klog('Down ... '+id);
      if ( k != '' && $('#hold').hasClass('holddown') ) {
        let ison = $(this).hasClass('on');
        if ( ison ) {
          $(this).removeClass('on');
          if ( k != '' ) {
            trsEmu.asciiup( k.toLowerCase() );
            scan();
          }
        } else {
          $(this).addClass('on');
          if ( k != '' ) {
            trsEmu.asciidown( k.toLowerCase() );
            scan();
          }
        }
      } else {
        if ( k != '' ) {
          trsEmu.asciidown( k.toLowerCase() );
          scan();
        }
      }
    });
    $('.key').bind('touchend mouseup', function (e) {
      let t = window.performance.now();
      //log('key end ... '+t);
      //let tex = e.touches[0].clientX;
      //let tey = e.touches[0].clientY;
      //log(tex);
      //game();
      e.stopPropagation();
      e.preventDefault();
      let id = $(this).attr('id');
      let k = key(id, false);
      klog('Up ... '+id);
      if ( ! $('#hold').hasClass('holddown') ) {
        if ( k != '' ) {
          trsEmu.asciiup( k.toLowerCase() );
          scan();
        }
      }
    });
  }
}
 




