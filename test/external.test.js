var external = require( "../lib/external" ),
    _c = require( "cosy-client" ),
    path = require( "path" ),
    should = require( "should" );

var gridPath = path.normalize( process.cwd( ) + "/test/data/grids/" ),
    pagePath = path.normalize( process.cwd( ) + "/test/data/pages/" ),
    controllerPath = path.normalize( process.cwd( ) + "/test/data/controllers/" ),
    layoutPath = path.normalize( process.cwd( ) + "/test/data/layouts/" );

describe( "Given cosy Kernel", function( ) {
    it( "should be defined", function( ) {
        external.should.exists;
    } );
    it( "should have a setup method", function( ) {
        external.setup.should.exists;
    } );
    it( "setup should work for empty instance", function( done ) {
        external.setup( {}, function( err, res ) {
            Object.keys( res ).length.should.equal( 4 );
            done( );
        } );
    } );
    it( "setup should work for grids", function( done ) {
        external.setup( {
            grids: gridPath
        }, function( err, res ) {
            res.grids.should.exists;
            res.grids.length.should.equal( 1 );
            done( );
        } );
    } );
    it( "setup should work for pages", function( done ) {
        external.setup( {
            pages: pagePath
        }, function( err, res ) {
            res.pages.should.exists;
            res.pages.length.should.equal( 5 );
            done( );
        } );
    } );
    it( "setup should work for layouts", function( done ) {
        external.setup( {
            layouts: layoutPath
        }, function( err, res ) {
            res.layouts.should.exists;
            Object.keys( res.layouts ).length.should.equal( 2 );
            done( );
        } );
    } );
    it( "setup should work for controllers", function( done ) {
        external.setup( {
            controllers: controllerPath
        }, function( err, res ) {
            res.layouts.should.exists;
            Object.keys( res.controllers ).length.should.equal( 1 );
            done( );
        } );
    } );
} );