module.exports = function( crawl, cb ) {
    var result = {};

    result[ path.basename( crawl, ".js" ) ] = require( crawl );

    cb( null, result );
};