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
        scriptRequires = [ ],
        fullscripts = [ ],
        _c = this._c;

    if ( comp.js ) {
        scriptRequires = isArray( comp.config.scripts ) ? comp.config.scripts : [ comp.config.scripts ];
        scriptRequires.forEach( function( file ) {
            fullscripts.push( path.normalize( comp.dir + "\\" + file ) );
        } );

        _c.scripts[ type ] = fullscripts;
        eval( comp.js );
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

        if ( placeholders.length > 0 ) {
            _c.components[ type ].placeholders = placeholders;
            _c.components[ type ].hasPlaceholder = true;
        }
    }

    if ( comp.css ) {
        _c.styles[ type ] = comp.css;
    }

    _c.components[ type ].adapter = adapter;

    cb( null, self );
};

var loadAdapter = function( comp, cb ) {

    var path = comp.dir + "\\" + comp.config.scripts;

    var adapter = require( path );

    this._c.adapter( comp.config.name, adapter );

    cb( null, this );
};

var strategy = {
    adapter: loadAdapter,
    ui: loadComponent
}

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