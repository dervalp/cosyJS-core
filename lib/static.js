var browserify = require( "browserify" ),
    cacheCSS = {},
    cacheScript = {},
    cacheCtrls = {};

var toArray = function( param ) {
    if ( !Array.isArray( param ) ) {
        return [ param ];
    }

    return param.slice( 1, param.length - 1 ).split( "," );
};

var Builder = function( cosy ) {
    this.cosy = cosy;
};

Builder.prototype.css = function( param, cb ) {
    var self = this,
        result = "";

    param = toArray( param );

    param.forEach( function( css ) {
        result += self.getFiles( css, "css" );
    } );

    cb( null, result );
};

var stategy = {
    script: function( files ) {
        return this.cosy.getScript( files );
    },
    controller: function( files ) {
        return this.cosy.getControllers( files );
    },
    css: function( files ) {
        return this.cosy.getStyle( files );
    }
}

Builder.prototype.getFiles = function( files, type ) {
    return stategy[ type ].call( this, files );
};


var buildFiles = function( files, cb ) {
    var b = browserify( );
    files.forEach( function( file ) {

        b.add( file );
    } );

    b.bundle( cb );
};

Builder.prototype.buildScript = function( param, type, cb ) {
    var self = this,
        result = [ ];

    param = toArray( param );

    param.forEach( function( comp ) {
        var f = self.getFiles( comp, type );
        if ( f ) {
            result = result.concat( f );
        }
    } );

    if ( result && result.length > 0 ) {
        return buildFiles( result, cb );
    }

    cb( "" );
};

Builder.prototype.components = function( param, cb ) {
    this.buildScript( param, "script", cb );
};

Builder.prototype.controller = function( param, isServer, cb ) {
    var self = this,
        result = [ ],
        dirs = [ ];

    param = toArray( param );

    param.forEach( function( ctr ) {
        var res = self.getFiles( ctr, "controller" );

        res.forEach( function( ctrObj ) {
            dirs.push( ctrObj[ ctr ].dir );
        } );
        result = result.concat( res );
    } );

    if ( isServer ) {
        cb( null, result );
    } else {
        buildFiles( dirs, cb );
    }
}

module.exports = Builder;