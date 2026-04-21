
function log( s, lf = '<br>' ) {
  let c = $('#log').html();
  $('#log').html( s + lf + c );
}

function start() {

  log( 'starting ...' );

  log( 'TRS-80 Emulator Loading ...' );

  trsEmu.screen('scrn').button('btn').perf('graph').focus();
  
  $('#scrn').on( 'click', function() {
    trsEmu.focus();
  });

  $('#console').on( 'click', function() {
    trsEmu.blur();
  });

  log( 'xterm loading ...' );

  //let term = new Terminal();
  //term.open( document.getElementById( 'console' ) );
  
  ioStart( 'console' );

  log( 'end of start ...' );

}

