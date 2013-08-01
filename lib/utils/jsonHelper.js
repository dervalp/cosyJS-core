var fs = require( "fs" );

var parseJson = function( path, cb ) {
    fs.readFile( path, "utf-8", function( err, content ) {
        if ( !content ) {
            throw "no content for " + path;
        }

        if ( path.indexOf( ".partial.json" ) > -1 ) {
            return cb( null, null );
        }

        return cb( null, JSON.parse( content ) );
    } );
};

module.exports = {
    parse: parseJson
};