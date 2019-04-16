var toCopy  = document.getElementById( 'to-copy' ),
    btnCopy = document.getElementById( 'copy' );

btnCopy.addEventListener( 'click', function(){
  toCopy.select();

  if ( document.execCommand( 'copy' ) ) {
      btnCopy.classList.add( 'copied' );

      var temp = setInterval( function(){
        btnCopy.classList.remove( 'copied' );
        clearInterval(temp);
      }, 600 );

  } else {
    console.info( 'document.execCommand went wrong…' )
  }

  return false;
} );
