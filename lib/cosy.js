var _ = require( "underscore" ),
    grid = require( "cosy-grid" );

var gridCache = {};

var Cosy = function( kernel, gridConfiguration, external ) {
    external = external || {};
    kernel = kernel || {};

    this._c = kernel.cosy;
    this.pages = external.pages || [ ];
    this.structures = external.grids;
    this.controllers = external.controllers || [ ];
    this.middlewares = external.middlewares || [ ];
    this.layouts = external.layouts;
    this.grid = grid.create( gridConfiguration );
};

Cosy.prototype.renderGrid = function( structure ) {
    var cache = gridCache[ structure ];

    return cache ? cache : this.grid.render( structure );
};

Cosy.prototype.getConfig = function( route ) {
    return _.find( this.pages, function( p ) {
        var currentRoute = p.route;

        if ( p.subdomain ) {
            route = "/" + p.subdomain + route;
        }
        return route === currentRoute;
    } );
};

Cosy.prototype.getMiddlewares = function( middlewares ) {
    var result = [ ],
        self = this;

    if ( !middlewares || !self.middlewares || self.middlewares.length === 0 ) {
        return void 0;
    }

    if ( !_.isArray( middlewares ) ) {
        middlewares = [ middlewares ];
    }

    middlewares.forEach( function( pageMiddlewares ) {
        result.push( self.middlewares[ pageMiddlewares ] );
    } );

    return result;
};

Cosy.prototype.getPages = function( route ) {
    return this.pages;
};

Cosy.prototype.getStructure = function( name ) {

    return _.find( this.structures, function( struc ) {
        return name === struc.id;
    } );
};

Cosy.prototype.getControllers = function( controllers ) {
    var result = [ ],
        self = this;

    if ( !_.isArray( controllers ) ) {
        controllers = [ controllers ];
    }

    controllers.forEach( function( pageController ) {
        var ctrl = _.find( self.controllers, function( c ) {
            return Object.keys( c )[ 0 ] === pageController;
        } );

        result.push( ctrl );
    } );

    return result;
};

Cosy.prototype.getLayout = function( layout ) {
    return _.find( this.layouts, function( l ) {
        return l.name === layout;
    } );
};

Cosy.prototype.getStyle = function( name ) {
    return this._c.styles[ name ];
};

Cosy.prototype.getTemplate = function( name ) {
    return this._c.templates[ name ];
};

Cosy.prototype.getScript = function( name ) {
    return this._c.scripts[ name ];
};

module.exports = Cosy;