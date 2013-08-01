var loader = require( "./loader/component" ),
    fs = require( "fs" ),
    path = require( "path" ),
    COSY_FOLDER = path.normalize( process.cwd( ) + "/cosy_modules/" ),
    registerUI = require( "./component/ui" );

try {
    var stats = fs.lstatSync( COSY_FOLDER );
} catch ( e ) {
    throw "You should have a directory /cosy_modules/ in the root of your application";
}

var buildConf = function( comps ) {
    var conf = {
        ui: [ ], //should be in _c
        middleware: [ ],
        grid: [ ],
        adapter: [ ] //should be in _c
    };
    if ( !comps ) {
        return {};
    };

    comps.forEach( function( comp ) {
        if ( !comp.config.category ) {
            conf.ui.push( comp );
        }
        conf[ comp.config.category ].push( comp );
    } );

    return conf;
}

module.exports = {
    setup: function( _c, callback ) {
        loader.load( COSY_FOLDER, function( err, comp ) {

            var conf = buildConf( comp ),
                cosyComps = conf.ui ? conf.ui.concat( conf.adapter ) : [ ];

            registerUI.configure( _c, cosyComps, function( error, cosy ) {
                return callback( null, {
                    cosy: cosy,
                    middlewares: conf.middleware,
                    grid: conf.grid
                } );
            } );
        } );
    }
};