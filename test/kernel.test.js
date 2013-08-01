var kernel = require( "../lib/kernel" ),
    _c = require( "cosy-client" ),
    should = require( "should" );

describe( "Given cosy Kernel", function( ) {
    it( "should be defined", function( ) {
        kernel.should.exists;
    } );
    it( "should have a setup method", function( ) {
        kernel.setup.should.exists;
    } );
    it( "setup should work for empty instance", function( done ) {
        kernel.setup( _c, function( err, res ) {

            res.cosy.should.exists;
            res.cosy.components.should.exists;
            Object.keys( res.cosy.components ).length.should.equal( 5 );

            done( );
        } );
    } );
} );