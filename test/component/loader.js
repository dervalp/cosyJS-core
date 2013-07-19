var compLoader = require( "../../lib/component/loader" ),
    path = require( "path" ),
    testPath = path.resolve( __dirname + "/../data/components/" ),
    should = require( "should" );

describe( "Given a folderCrawler", function( ) {
    it( "should be defined", function( ) {
        compLoader.should.exists;
    } );
    it( "should be able to load at least one component", function( done ) {
        compLoader.load( testPath, function( result ) {

            result.length.should.equal( 1 );
            done( );
        } );
    } );
} );