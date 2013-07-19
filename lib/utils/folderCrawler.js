var fs = require( "fs" ),
    path = require( "path" );

var readFolder = function( folder, cb ) {
    var files = [ ];

    fs.readdir( folder, function( err, fileList ) {
        _.each( fileList, function( file ) {
            files.push( folder + file );
        } );
        cb( files );
    } );
},
    registerStructures = function( all, visit, cb ) {
        async.map( all, visit, function( err, result ) {
            cb( null, result );
        } );
    },
    build = function( folders, visit, cb ) {
        async.map( folders, function( folder, partialCb ) {
            readFolder( folder, function( instanceStructures ) {
                registerStructures( instanceStructures, visit, function( structures ) {
                    partialCb( null, structures );
                } );
            } );
        }, cb );
    };

module.exports = {
    crawlSync: function( folder ) {
        var result = [ ];

        fs.readdirSync( folder ).forEach( function( file ) {
            var p = path.resolve( folder + "/" + file ),
                stat = fs.lstatSync( p );
            if ( stat.isDirectory( ) ) {
                result.push( p );
            }
        } );

        return result;
    },
    build: build
};