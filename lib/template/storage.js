var INSERTION = "<{{element}} {{attributes}} cosy-type='{{type}}' cosy-id='{{id}}'></{{element}}>";

module.exports = function( templates ) {

    var templateCache = templates;

    var get = function( name, cb ) {
        var template = templateCache[ name ];

        if ( name === "insertion" ) {
            return cb( INSERTION );
        } else {
            return cb( template );
        }
    };

    return {
        get: get
    };
};