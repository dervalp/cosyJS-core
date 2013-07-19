var fs = require( "fs" );

var parseJson = function( path, cb ) {
    fs.readFile( path, "utf-8", function( err, content ) {
        if ( !content ) {
            throw "no content for " + path;
        }

        if ( path.indexOf( ".partial.json" ) === -1 ) {
            cb( null, JSON.parse( content ) );
        }

        cb( null, null );
    } );
};

module.export = {
    parseFiletoJSON: parseJson
};