var async = require( "async" ),
    cache = {};

var load = function( ) {};

var layoutLoader = function( ) {};

var loadExternal = function( conf, loaded ) {
    var pageFolder = conf.pages,
        layoutFolder = conf.layout,
        gridFolder = conf.grids,
        controllerFolder = conf.controller;

    async.parallel( {
        grids: load.bind( {
            folder: gridFolder
        } ),
        layouts: layoutLoader.bind( {
            folder: layoutFolder
        } ),
        pages: load.bind( {
            folder: pageFolder
        } ),
        controllers: load.bind( {
            folder: controllerFolder
        } )
    }, loaded );
};

module.exports = {
    setup: loadExternal
};