var path = require( "path" );

module.exports = {
    parse: function( crawl, cb ) {
        var result = {};

        result[ path.basename( crawl, ".js" ) ] = require( crawl );
        result[ path.basename( crawl, ".js" ) ].dir = crawl;

        cb( null, result );
    }
};