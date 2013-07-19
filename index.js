var _c = require( "cosy-boot" ),
    external = require( "./lib/external" ),
    cache = {},
    kernel = require( "./lib/kernel" ),
    PageBuilder = require( "./lib/page/builder" ),
    Cosy = require( "./lib/cosy" );

module.exports = {
    start: function( conf, callback ) {
        kernel.setup( _c, function( err, res ) {
            external.setup( conf, function( err, external ) {
                var cosy = new Cosy( _c, res, external );
                callback( cosy );
            } );
        } );
    },
    Page: PageBuilder
};