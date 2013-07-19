/* jshint evil: true */

var async = require( "async" ),
    parserHelper = require( "../utils/parser" ),
    /**
     * Load a component and register it
     */
    loadSingleComponent = function( comp, cb ) {
        var self = this,
            _c = this._c;

        if ( comp.js ) {
            _c.scripts[ type ] = comp.js;
            eval( comp.js );
        } else if ( !comp.js && comp.template ) {
            var template = comp.template,
                type = parserHelper.extractType( template ),
                placeholders = parserHelper.extractPlaceholders( template ) || [ ];

            _c.component( {
                type: type
            } );
        } else {
            throw " not loaded" + directory;
        }

        if ( comp.template ) {
            _c.templates[ type ] = template;
        }

        cb( null, self );
    };

module.exports = {
    configure: function( _c, comps ) {
        var result = {
            _c: _c
        };

        async.map( comps, loadSingleComponent.bind( result ), function( err, result ) {
            cb( result[ 0 ] );
        } );
    }
};