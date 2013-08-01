/**
 * Given a folder, it loads component files
 */
var folderCrawler = require( "../utils/folderCrawler" ),
    compBuilder = require( "../component/builder" ),
    async = require( "async" );

var createComponent = function( compFolder, callback ) {
    var comp = new compBuilder( compFolder );
    comp.build( callback );
};

module.exports = {
    load: function( folder, cb ) {
        var components = folderCrawler.crawlSync( folder );
        async.map( components, createComponent, cb );
    }
};