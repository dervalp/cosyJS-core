var API = require( "../lib/API" ),
    path = require( "path" ),
    should = require( "should" );

var gridPath = path.normalize( process.cwd( ) + "/data/grids/" ),
    layoutPath = path.normalize( process.cwd( ) + "/data/layouts/" ),
    pagePath = path.normalize( process.cwd( ) + "/data/pages/" );

var basicTestResult = "<!DOCTYPE html><html><head><title></title></head><body><div id='root' ><div id='global' ><div id='globalHeader' ><div id='globalHeaderContent' class='cosy-12 globalHeaderContent'></div></div></div><div id='content' ><div id='contentMain' class='cosy-12 contentMain'><div cosy-type='test' cosy-id='Test1'>Toto</div></div></div><div id='footer' ></div></div></body></html>";
var placeholderTestResult = "<!DOCTYPE html><html><head><title></title></head><body><div id='root' ><div id='global' ><div id='globalHeader' ><div id='globalHeaderContent' class='cosy-12 globalHeaderContent'></div></div></div><div id='content' ><div id='contentMain' class='cosy-12 contentMain'><div cosy-type='placeholderComp' cosy-id='Test2'><div cosy-type='test' cosy-id='Test1'>Toto</div></div></div></div><div id='footer' ></div></div></body></html>";
var multipleCompTestResult = "<!DOCTYPE html><html><head><title></title></head><body><div id='root' ><div id='global' ><div id='globalHeader' ><div id='globalHeaderContent' class='cosy-12 globalHeaderContent'></div></div></div><div id='content' ><div id='contentMain' class='cosy-12 contentMain'><div cosy-type='test' cosy-id='Test1'>Toto</div><div cosy-type='test' cosy-id='Test1'>Toto</div></div></div><div id='footer' ></div></div></body></html>";
var subCompTestResult = "<!DOCTYPE html><html><head><title></title></head><body><div id='root' ><div id='global' ><div id='globalHeader' ><div id='globalHeaderContent' class='cosy-12 globalHeaderContent'></div></div></div><div id='content' ><div id='contentMain' class='cosy-12 contentMain'><div cosy-type='masterComp' cosy-id='Test3'><div cosy-type='test' cosy-id='Test1'>Toto</div></div></div></div><div id='footer' ></div></div></body></html>";
var adapterCompetTestResult = "<!DOCTYPE html><html><head><title></title></head><body><div id='root' ><div id='global' ><div id='globalHeader' ><div id='globalHeaderContent' class='cosy-12 globalHeaderContent'></div></div></div><div id='content' ><div id='contentMain' class='cosy-12 contentMain'><div cosy-type='cosyComp' cosy-id='Test4'>Titi</div></div></div><div id='footer' ></div></div></body></html>";

describe( "Given a API", function( ) {
    it( "should be defined", function( ) {
        API.should.exists;
    } );
    it( "should have a start method", function( ) {
        API.start.should.exists;
    } );
    it( "should have a Page model", function( ) {
        API.Page.should.exists;
    } );
    it( "should have a Static model", function( ) {
        API.Static.should.exists;
    } );
    it( "should get result from the start method", function( done ) {
        API.start( {}, function( err ) {

            done( );
        } );
    } );
    describe( "Given a API", function( ) {
        var instance;
        before( function( done ) {
            API.start( {
                pages: pagePath,
                grids: gridPath,
                layouts: layoutPath
            }, function( err, cosy ) {
                instance = cosy;
                done( );
            } );
        } );

        it( "should be able to build a one Page", function( done ) {

            var config = instance.getConfig( "/test" ),
                placholders = instance.getStructure( config.grid ),
                layout = instance.getLayout( config.layout );

            var page = new API.Page( instance._c, instance.grid, placholders, layout, config, {} );

            page.should.exists;
            page.render.exists;

            page.render( function( html ) {
                html.should.equal( basicTestResult );
                done( );
            } );
        } );
        it( "should be able to build a one Page with a placeholder", function( done ) {

            var config = instance.getConfig( "/test2" ),
                placholders = instance.getStructure( config.grid ),
                layout = instance.getLayout( config.layout );

            var page = new API.Page( instance._c, instance.grid, placholders, layout, config, {} );

            page.should.exists;
            page.render.exists;

            page.render( function( html ) {
                html.should.equal( placeholderTestResult );

                done( );
            } );
        } );
        it( "should be able to build a one Page with 2 components", function( done ) {

            var config = instance.getConfig( "/test3" ),
                placholders = instance.getStructure( config.grid ),
                layout = instance.getLayout( config.layout );

            var page = new API.Page( instance._c, instance.grid, placholders, layout, config, {} );

            page.should.exists;
            page.render.exists;

            page.render( function( html ) {

                html.should.equal( multipleCompTestResult );

                done( );
            } );
        } );
        it( "should be able to build a one Page with 1 component which uses an Adapter", function( done ) {

            var config = instance.getConfig( "/test5" ),
                placholders = instance.getStructure( config.grid ),
                layout = instance.getLayout( config.layout );

            var page = new API.Page( instance._c, instance.grid, placholders, layout, config, {} );

            page.should.exists;
            page.render.exists;

            page.render( function( html ) {

                html.should.equal( adapterCompetTestResult );
                done( );
            } );
        } );
        it( "should be able to build a one Page with 1 component with sub comp", function( done ) {

            var config = instance.getConfig( "/test4" ),
                placholders = instance.getStructure( config.grid ),
                layout = instance.getLayout( config.layout );

            var page = new API.Page( instance._c, instance.grid, placholders, layout, config, {} );

            page.should.exists;
            page.render.exists;

            page.render( function( html ) {

                html.should.equal( subCompTestResult );

                done( );
            } );
        } );
    } );
} );