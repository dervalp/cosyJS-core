var Cosy = require( "../lib/cosy" ),
    should = require( "should" );

describe( "Given a Cosy Object", function( ) {
    it( "should be defined", function( ) {
        Cosy.should.exists;
    } );
    it( "should be able to instantiate the object", function( done ) {

        var instance = new Cosy( );

        instance.getConfig.should.exist;
        instance.getStructure.should.exist;
        instance.getLayout.should.exist;
        instance.getScript.should.exist;
        instance.getControllers.should.exist;
        instance.getMiddlewares.should.exist;
        instance.renderGrid.should.exist;

        done( );
    } );
} );