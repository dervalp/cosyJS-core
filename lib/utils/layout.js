var path = require( "path" ),
    fs = require( "fs" ),
    jade = require( "jade" ),
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

        cb( null, {
            name: index + ext,
            path: pathToLayout,
            rawContent: html,
            template: content
        } );
    } );
};

module.exports = {
    parse: buildCacheAndCompileJade
};