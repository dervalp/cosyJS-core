var loader = require( "./component/loader" ),
    path = require( "path" ),
    COSY_FOLDER = path.normalize( process.cwd( ) + "/cosy_modules/" ),
    registerToCosy = require( "./component/ui" );

var buildConf = function( comps ) {
    var conf = {
        ui: [ ], //should be in _c
        middleware: [ ],
        grid: [ ],
        adapter: [ ] //should be in _c
    };

    comps.forEach( function( comp ) {
        if ( !comp.category ) {
            conf[ ui ].push( comp );
        }
        conf[ comp.category ].push( comp );
    } );

    return conf;
}

module.exports = {
    setup: function( _c, done ) {
        loader.load( COSY_FOLDER, function( err, comp ) {
            var conf = buildConf( comp ),
                cosyComps = conf.ui.concat( conf.adapter );
            registerToCosy( _c, registerToCosy, function( error, cosy ) {
                done( null, {
                    cosy: cosy,
                    middlewares: conf.middleware,
                    grid: conf.grid
                } );
            } );
        } );
    }
};