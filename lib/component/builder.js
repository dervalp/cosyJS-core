// [Disclaimer]
// This is a modified version from TJ Holowaychuk component builder
// later I wish I could use directly his own builder but I try to smooth the transition
// step by step in order to keep cosy working. When cosy will be close from using all the
// public API done by TJ, I will use these libraries directly.
//
// Source: https://github.com/component/builder.js/blob/master/lib/builder.js
var fs = require( "fs" ),
    path = require( 'path' ),
    read = fs.readFileSync,
    Batch = require( "batch" ),
    basename = path.basename,
    exists = fs.existsSync;

var normalizeConfig = function( conf ) {
    // support "./" in main
    if ( conf.main ) conf.main = conf.main.replace( /^\.\//, '' );
};

function Builder( directory ) {
    this.dir = directory;
    this.config = this.getJSON( );

    this.basename = basename( directory );
}

Builder.prototype.getJSON = function( ) {
    var path = this.path( 'component.json' ),
        str = read( path, 'utf8' );

    try {
        var obj = JSON.parse( str );
    } catch ( err ) {
        err.message += ' in ' + path;
        throw err;
    }

    normalizeConfig( obj );

    return obj;
}

/**
 * Return a resolved path relative to this
 * builder's dir.
 *
 * @param {String} file
 * @return {String}
 * @api public
 */
Builder.prototype.path = function( file ) {
    return path.resolve( path.join( this.dir, file ) );
};

Builder.prototype.build = function( fn ) {
    var self = this,
        batch = new Batch;

    batch.push( this.buildScripts.bind( this ) );
    batch.push( this.buildStyles.bind( this ) );
    batch.push( this.buildTemplates.bind( this ) );
    batch.end( function( err, res ) {
        if ( err ) return fn( err );
        fn( null, {
            dir: self.dir,
            config: self.config,
            js: res.shift( ),
            css: res.shift( ),
            template: res.shift( )
        } );
    } );
};

Builder.prototype.buildScripts = function( fn ) {
    this.buildType( 'scripts', fn, register );
};

Builder.prototype.buildStyles = function( fn ) {
    this.buildType( 'styles', fn, register );
};

Builder.prototype.buildTemplates = function( fn ) {
    this.buildType( 'templates', fn, register );
};

/**
 * Return a js string representing a commonjs
 * client-side module with the given `builder`,
 * `file` and `js`.
 *
 * NOTE: Here we special-case the root script so
 * that for example if you are building "tip"
 * to test, you may require('tip') instead of
 * require('component-tip');
 *
 * TODO: ^ remove this special-casing for lazy-loading
 *
 * @param {Builder} builder
 * @param {String} file
 * @param {String} js
 * @return {String}
 * @api private
 */

function register( builder, file, js ) {
    file = builder.root ? builder.config.name + '/' + file : builder.basename + '/' + file;

    if ( builder.sourceUrls ) {
        js = JSON.stringify( js + '//@ sourceURL=' + file );
        js = js.replace( /\\n/g, '\\n\\\n' );
        return js;
        //return 'require.register("' + file + '", Function("exports, require, module",\n' + js + '\n));';
    } else {
        return js;
        //return 'require.register("' + file + '", function(exports, require, module){\n' + js + '\n});';
    }
}

/**
 * Build `type` and invoke `fn`.
 *
 * @param {String} type
 * @param {String} fn
 * @param {String} process
 * @api private
 */

Builder.prototype.buildType = function( type, fn, process ) {
    var self = this,
        batch = new Batch,
        conf = this.config;

    var addToBuffer = function( file ) {
        batch.push( function( done ) {
            var path = self.path( file );
            fs.readFile( path, 'utf8', function( err, str ) {
                if ( err ) return fn( err );
                done( null, process( self, file, str ) );
            } );
        } );
    };

    if ( conf[ type ] && Array.isArray( conf[ type ] ) ) {
        conf[ type ].forEach( addToBuffer );
    } else if ( conf[ type ] ) {
        addToBuffer( conf[ type ] );
    }

    batch.end( function( err, res ) {
        if ( err ) return fn( err );
        fn( null, res.join( '\n' ) );
    } );

    // build dependencies
    /* if ( self.hasDependencies( ) ) {
        Object.keys( self.dependencies( ) ).forEach( function( dep ) {
            dep = normalize( dep );

            // ignored
            if ( self.ignoring( dep, type ) ) return debug( 'ignoring %s', dep );

            // ignore it so we dont have dups
            self.ignore( dep, type );

            // lookup dep
            batch.push( function( done ) {
                self.lookup( dep, function( err, dir ) {
                    if ( err ) return done( err );
                    debug( 'building dependency %s in %s', dep, dir );
                    var builder = new Builder( dir, self );
                    self.emit( 'dependency', builder );
                    builder.buildType( type, done, process );
                } );
            } );
        } );
    }*/

    // "before <type>" hook
    /* self.performHook( 'before ' + type, function( err ) {
        if ( err ) return fn( err );

        // build files
        if ( conf[ type ] ) {
            conf[ type ].forEach( function( file ) {
                var path = self.path( file );
                batch.push( function( done ) {
                    var val = self._files[ file ];

                    // on disk
                    if ( null == val ) {
                        debug( 'read file %s', path );
                        fs.readFile( path, 'utf8', function( err, str ) {
                            if ( err ) return fn( err );
                            done( null, process( self, file, str ) );
                        } );
                        return
                    }

                    // fabricated
                    done( null, process( self, file, val ) );
                } );
            } );
        }

        batch.end( function( err, res ) {
            if ( err ) return fn( err );
            fn( null, res.join( '\n' ) );
        } );
    } );*/
};


module.exports = Builder;