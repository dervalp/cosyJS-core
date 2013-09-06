/* jshint evil: true */

var async = require( "async" ),
    path = require( "path" ),
    parserHelper = require( "../utils/parser" ),
    isArray = Array.isArray;
/**
 * Load a component and register it
 */
var loadComponent = function( comp, cb ) {
    var self = this,
        placeholders,
        type = comp.config.name,
        adapter = comp.config.adapter || "",
        plugins = comp.config.plugins || "",
        scriptRequires = [ ],
        fullscripts = [ ],
        _c = this._c;

    _c.scripts[ type ] = { 
        adapter: (comp.config.adapter) ? comp.config.adapter : undefined,
        plugins: (comp.config.plugins) ? comp.config.plugins : undefined
    };

    if ( comp.js ) {
        scriptRequires = isArray( comp.config.scripts ) ? comp.config.scripts : [ comp.config.scripts ];
        scriptRequires.forEach( function( file ) {
            fullscripts.push( path.normalize( comp.dir + "\\" + file ) );
        } );

        _c.scripts[ type ].path = fullscripts;

        try {
            eval( comp.js );
        } catch ( e ) {
            console.log( "!Error executing command!" );
            console.log( e );
        }
    } else if ( !comp.js && comp.template ) {
        var template = comp.template,
            type = parserHelper.extractType( template );

        _c.component( {
            type: type
        } );
    } else {
        throw " not loaded";
    }

    if ( comp.template ) {
        _c.templates[ type ] = comp.template;
    }

    if ( comp.template ) {
        placeholders = parserHelper.extractPlaceholders( comp.template ) || [ ];

        console.log( "Has placholder" );
        console.log( placeholders );

        if ( placeholders.length > 0 ) {
            _c.components[ type ].placeholders = placeholders;
            _c.components[ type ].hasPlaceholder = true;
        }
    }

    if ( comp.css ) {
        _c.styles[ type ] = comp.css;
    }

    _c.components[ type ].adapter = adapter;
    _c.components[ type ].plugins = plugins;

    cb( null, self );
};

var loadAdapter = function( comp, cb ) {

    var path = comp.dir + "\\" + comp.config.scripts;

//    var adapter = require( path );
    var _c = this._c;

    eval(comp.js);

    this._c.adapters[comp.config.name].path = path;
/*
    this._c.adapter( comp.config.name, adapter, path );
*/
    cb( null, this );
};

var loadPlugin = function( comp, cb ) {

    var path = comp.dir + "\\" + comp.config.scripts;

//    var adapter = require( path );
    var _c = this._c;

    eval(comp.js);

    this._c.plugins[comp.config.name].path = path;
/*
    this._c.adapter( comp.config.name, adapter, path );
*/
    cb( null, this );

};

var strategy = {
    adapter: loadAdapter,
    ui: loadComponent,
    plugin: loadPlugin
};

var load = function( comp, cb ) {
    strategy[ comp.config.category ].apply( this, arguments );
};

module.exports = {
    configure: function( _c, comps, cb ) {

        _c.scripts = _c.scripts || [ ];
        _c.templates = _c.templates || [ ];
        _c.styles = _c.styles || {};

        var result = {
            _c: _c
        };

        if ( !comps || comps.length === 0 ) {
            return cb( null, _c );
        }

        async.map( comps, load.bind( result ), function( err, result ) {
            cb( err, _c );
        } );
    }
};