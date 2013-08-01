var API = require( "../lib/API" ),
    StaticServer = require( "../lib/static" ),
    path = require( "path" ),
    should = require( "should" );

var gridPath = path.normalize( process.cwd( ) + "/test/data/grids/" ),
    layoutPath = path.normalize( process.cwd( ) + "/test/data/layouts/" ),
    controllerPath = path.normalize( process.cwd( ) + "/test/data/controllers/" ),
    pagePath = path.normalize( process.cwd( ) + "/test/data/pages/" );

describe( "Given a Static Server", function( ) {
    describe( "and a cosy instance", function( ) {
        var instance,
            staticServer;

        before( function( done ) {
            API.start( {
                pages: pagePath,
                grids: gridPath,
                layouts: layoutPath,
                controllers: controllerPath
            }, function( err, cosy ) {
                instance = cosy;
                staticServer = new StaticServer( instance );
                done( );
            } );
        } );
        it( "should be able to instantiate it", function( ) {
            staticServer.css.should.exists;
            staticServer.components.should.exists;
            staticServer.controller.should.exists;
        } );
        it( "should be able to get javascript content for a component", function( done ) {
            staticServer.components( "compJS", function( err, res ) {
                var isPresent = ( res.indexOf( "_c.component" ) > 0 );
                isPresent.should.equal( true );
                done( );
            } );
        } );
        it( "should be able to get css content for a component", function( done ) {
            staticServer.css( "compJS", function( err, res ) {
                var isPresent = ( res.indexOf( "test" ) > 0 );
                isPresent.should.equal( true );
                done( );
            } );
        } );
        it( "should be able to get a controller", function( done ) {
            staticServer.controller( "test", false, function( err, res ) {
                var hasCtr = ( res.indexOf( "test:" ) > 0 );
                hasCtr.should.equal( true );
                done( );
            } );
        } );
    } );
} );