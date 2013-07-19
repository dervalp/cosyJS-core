var _ = require( "underscore" ),
    grid = require( "cosy-grid" );

var gridCache = {};

var Cosy = function( _c, gridConfiguration, res, external ) {
    this._c = _c;
    this.conf = res,
    this.pages = external.pages;
    this.structures = external.structures;
    this.controllers = external.controllers;
    this.grid = grid.create( gridConfiguration );
};

Cosy.prototype.renderGrid = function( structure ) {
    var cache = gridCache[ structure ];

    return cache ? cache : this.grid.render( structure );
};

Cosy.prototype.getConfig = function( route ) {
    return _.find( pages, function( p ) {
        var route = p.route;
        if ( p.subdomain ) {
            route = "/" + p.subdomain + route;
        }
        return route === currentRoute;
    } );
};

Cosy.prototype.getMiddlewares = function( middlewares ) {
    var result = [ ],
        self = this;

    if ( !_.isArray( middlewares ) ) {
        middlewares = [ middlewares ];
    }

    middlewares.forEach( function( pageMiddlewares ) {
        result.push( self.middlewares[ pageMiddlewares ] );
    } );

    return result;
};

Cosy.prototype.getPage = function( route ) {
    var page = this.getPage( route ),
        structure = this.getStructure( page.structure ),
        layout = this.getLayout( page.layout ),
        components = this.getComponents( page.components ),
        controllers = this.getControllers( page.controllers );

    return {
        structure: structure,
        layout: layout,
        components: components,
        getControllers
    };
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
        result.push( self.controllers[ pageController ] );
    } );

    return result;
};

Cosy.prototype.getLayout = function( layout ) {
    layout = layout || "layout";
    return this.layouts[ layout + ".master" ];
};

Cosy.prototype.getTemplate = function( name ) {
    return this._c.templates[ name ];
};

Cosy.prototype.getScript = function( name ) {
    return this._c.scripts[ name ];
};

module.exports = Cosy;