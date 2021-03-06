var _ = require( "underscore" ),
    path = require( "path" ),
    fs = require( "fs" ),
    jade = require( "jade" ),
    fileCrawler = require( "../../utils/fileCrawler" ),
    layoutCache = {};

var buildCacheAndCompileJade = function( pathToLayout, cb ) {

    fs.readFile( pathToLayout, "utf-8", function( err, html ) {
        if ( err ) {
            throw err;
        }

        var ext = path.extname( pathToLayout ),
            index = path.basename( pathToLayout, ext ),
            content = html;

        if ( ext === ".jade" ) {
            content = jade.compile( html, {
                filename: pathToLayout,
                pretty: false
            } )( );
        }

        layoutCache[ index ] = {
            rawContent: html,
            template: content
        };

        cb( null, layoutCache );
    } );
};

module.exports = {
    build: function( instanceFolder, cb ) {
        layoutCrawler.build( instanceFolder, buildCacheAndCompileJade, function( ) {
            cb( layoutCache );
        } );
    }
};