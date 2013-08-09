var Builder = require( "../../lib/component/builder" ),
    path = require( "path" ),
    testPath = path.resolve( __dirname + "/../../data/components/test/" ),
    should = require( "should" );

describe( "Given a component builder", function( ) {
    it( "should be defined", function( ) {
        Builder.should.exists;
    } );
    describe( "and an appropriate instantiation", function( ) {
        var builder = new Builder( testPath );

        it( "should exists", function( ) {
            builder.should.exists;
        } );
        it( "should be able to build the Component Object", function( done ) {
            builder.build( function( err, res ) {
                res.config.should.exists;
                res.dir.should.exists;
                res.config.name.should.equal( "test" );
                var index = res.js.indexOf( "_c.component" );
                ( index > -1 ).should.be.true;
                res.css.should.equal( ".test {color:red;}" );
                done( );
            } );
        } );
    } );
} );