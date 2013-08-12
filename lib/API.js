var _c = require( "cosy-client" ).cosy,
    external = require( "./external" ),
    cache = {},
    kernel = require( "./kernel" ),
    PageBuilder = require( "./page/builder" ),
    StaticServer = require( "./static" ),
    TemplateStorage = require( "./template/storage" ),
    Cosy = require( "./cosy" );

module.exports = {
    start: function( conf, callback ) {
        conf = conf || {};

        kernel.setup( _c, function( err, kernel ) {
            external.setup( conf, function( err, external ) {

                var cosy = new Cosy( kernel, conf.grid, external );

                var templateStorage = TemplateStorage( cosy._c.templates );

                cosy._c.setTemplateStorage( templateStorage );

                callback( null, cosy );
            } );
        } );
    },
    Page: PageBuilder,
    Static: StaticServer
};