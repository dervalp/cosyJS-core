var async = require( "async" ),
    _ = require( "underscore" ),
    async = require( "async" ),
    folderHelper = require( "./utils/folderCrawler" ),
    jsonHelper = require( "./utils/jsonHelper" ),
    requireHelper = require( "./utils/require" ),
    layoutHelper = require( "./utils/layout" ),
    cache = {};

var loadingType = {
    json: jsonHelper.parse,
    require: requireHelper.parse,
    layout: layoutHelper.parse
};

var layoutCallback = function( callback ) {
    var done = callback;

    return function( err, res ) {
        res = _.flatten( res );
        done( err, res );
    };
};

var load = function( callback ) {
    var folderToParse = this.folder,
        type = this.type,
        callback = layoutCallback( callback );

    if ( !folderToParse ) {
        return callback( null );
    };

    if ( !_.isArray( folderToParse ) ) {
        folderToParse = [ this.folder ];
    }

    var visit = loadingType[ type ];

    folderHelper.build( folderToParse, visit, callback );
};

var loadExternal = function( conf, loaded ) {
    var pageFolder = conf.pages,
        layoutFolder = conf.layouts,
        gridFolder = conf.grids,
        controllerFolder = conf.controllers;

    async.parallel( {
        grids: load.bind( {
            folder: gridFolder,
            type: "json"
        } ),
        layouts: load.bind( {
            folder: layoutFolder,
            type: "layout"
        } ),
        pages: load.bind( {
            folder: pageFolder,
            type: "json"
        } ),
        controllers: load.bind( {
            folder: controllerFolder,
            type: "require"
        } )
    }, loaded );
};

module.exports = {
    setup: loadExternal
};