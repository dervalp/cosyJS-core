var cosy = new Cosy( );

var buildPage = function( scope, callback ) {
    var current = new PageBuilder( _c, cosy.getPage( route ), req.scope );
    current.initialized( req, function( ) {
        current.render( function( content ) {
            callback( content );
        } );
    } );
};

var buildWebServer = function( app ) {
    cosy.getPages( ).forEach( function( page ) {
        var route = page.route,
            middlewares = cosy.getMiddlewares( page.middlewares ),
            customCallback = function( req, res ) {
                res.send( content );
            };

        route = page.subdomain ? "/" + page.subdomain + route : route;

        if ( middlewares ) {
            app.get( route, middlewares, customCallback );
        } else {
            app.get( route, customCallback );
        }
    } );
};