var extractComp = function( str ) {
    var componentRegex = new RegExp( /\{\{component(.*?)\}\}/g ),
        matches,
        result = [ ];

    while ( matches = componentRegex.exec( str ) ) {
        result.push( matches[ 1 ].replace( /^\s+|\s+$/g, "" ) );
    }

    return result;
};


var render = function( callback ) {
    var html,
        toClient = [ ],
        self = this;

    var template = this.template || undefined;

    /*if ( isBrowser && this.bindings ) {
        this.bindings.unbind( );
    }*/

    var render = function( tmplContent, extend ) {

        if ( self.dynamic ) {
            //var data = self.model.toJSON( );
            var data = ( self.serialize ) ? self.serialize( ) : self;

            /*if ( extend ) {
                data.disabledBinding = true;
            }*/
            toClient.push( data );
        }

        var compiled = _c.tmpl.compile( tmplContent );

        extend = extend || {};

        if ( self.hasPlaceholder ) {
            return callback( compiled, toClient );
        }

        //if ( isBrowser ) {
        //    html = compiled( self.model.toJSON( ) );
        //    self.$el.html( html );
        //    for ( var ex in extend ) {
        //        self.$el.find( "#" + ex ).html( extend[ ex ] );
        //    }
        //if (self.model.attributes) {
        //    if ( !data.disabledBinding && !self.model.get( "disabledBinding" ) ) {
        //        self.bindings.build( );
        //        self.bindings.bind( );
        //        self.bindings.sync( );
        //    }
        //}
        //    if ( callback ) {
        //        callback( self.$el.html( ), toClient );
        //    }
        //} else {
        html = compiled( _c.extend( extend, self.model.toJSON( ) ) );
        return callback( html, toClient );
        // }
    };

    _c.tmpl.get( template, function( tmplString ) {

        var nestedComp = extractComp( tmplString ),
            result = {};

        if ( nestedComp.length === 0 ) {
            render( tmplString );
        } else {

            _c.async.each( nestedComp, function( subComp, cb ) {
                var id = _.uniqueId( "nested_" ),
                    regex = new RegExp( "\{\{\{component " + subComp + "\}\}\}", "g" ),
                    component = {
                        type: subComp,
                        isInstance: true,
                        dynamic: true,
                        id: id
                    };
                component.clientSide = isBrowser ? true : false;
                var data = ( self.serialize ) ? self.serialize( ) : self,
                    initialData = _c.extend( component ),
                    inst = _c.expose( component, initialData );

                /*if ( isBrowser ) {
                    tmplString = tmplString.replace( regex, "<span id='" + id + "'></span>" );
                } else {*/
                tmplString = tmplString.replace( regex, "{{{" + id + "}}}" );
                /*}*/

                var el = inst.view.$el;

                inst.view.render( function( partialml, clientSide ) {
                    toClient = toClient.concat( clientSide );

                    /*if ( isBrowser ) {
                        result[ id ] = el;
                        cb( null, el );
                    } else {*/
                    result[ id ] = partialml;
                    cb( null, partialml );
                    /*}*/
                } );
            }, function( err, final ) {
                render( tmplString, result );
            } );
        }
    } );
    return self;
};


var get = function( path, cb ) {
    var template = cache[ path ];
    if ( !template ) {
        Backbone.$.get( "/cosy/template/" + path, function( data ) {
            cache[ path ] = data;

            return cb( data );
        } );
    } else {
        return cb( template );
    }
}