var fileCrawler = require( "../../lib/utils/folderCrawler" ),
    path = require( "path" ),
    testPath = path.resolve( __dirname + "/../../data/components/" ),
    should = require( "should" );

describe( "Given a folderCrawler", function( ) {
    it( "should be defined", function( ) {
        fileCrawler.should.exists;
    } );
    it( "should be able to crawl the test folder", function( ) {
        var result = fileCrawler.crawlSync( testPath );
        result.length.should.equal( 1 );
    } );
} );