// --------------------------------------------------------------------
// update-library.js
//
// Helper script to replace the ArcGIS API for JavaScript library
// `[HOSTNAME_AND_PATH_TO_JSAPI]` text with `www.example.com/arcgis_js_api/library/4.9/`.
//
// Note: requires node version 7.10.0 and npm version 4.2.0 or higher.
// --------------------------------------------------------------------
let fs = require("fs"),
    path = require("path"),
    util = require("util"),
    // --------------------------------------------------------------------
    // hostname to replace js.arcgis.com in the library such as:
    // www.example.com
    // apiDirectory would be the virtual directory in the web server hosting
    // the ArcGIS API for JavaScript library
    // --------------------------------------------------------------------
    localHost = "www.example.com",
    apiDirectory = "arcgis_js_api/library/4.9/",
    // --------------------------------------------------------------------
    // path to the downloaded ArcGIS API for JavaScript library
    // download archive contents arcgis_js_v49_api/arcgis_js_api/4.9/
    // to Apache HTTP server root directory /var/www/html/arcgis_js_api/library/4.9/
    // --------------------------------------------------------------------
    jsapiDownloadLocation = path.join("./", "arcgis_js_api", "library", "4.9"),
    // --------------------------------------------------------------------
    // Regular expression to match the template text
    // [HOSTNAME_AND_PATH_TO_JSAPI] in
    // baseUrl:"https://[HOSTNAME_AND_PATH_TO_JSAPI]dojo"
    // --------------------------------------------------------------------
    hostnameAndPathRegEx = /\[HOSTNAME_AND_PATH_TO_JSAPI\]/i,
    // --------------------------------------------------------------------
    // base url for the locally hosted ArcGIS API for JavaScript such as:
    // www.example.com/arcgis_js_api/library/4.9/
    // --------------------------------------------------------------------
    jsapiURLBaseLocal = util.format("%s/%s", localHost, apiDirectory),
    // --------------------------------------------------------------------
    // Dojo file containing the CDN link to ArcGIS API for JavaScript
    // /var/www/html/arcgis_js_api/library/4.9\dojo\dojo.js
    // --------------------------------------------------------------------
    jsapiDojoFile = path.join(jsapiDownloadLocation, "dojo", "dojo.js"),
    // --------------------------------------------------------------------
    // Dojo file containing the CDN link to ArcGIS API for JavaScript
    // /var/www/html/arcgis_js_api/library/4.9/init.js
    // --------------------------------------------------------------------
    jsapiInitFile = path.join(jsapiDownloadLocation, "init.js");

// --------------------------------------------------------------------
// 1) Read the ArcGIS API for JavaScript library files
// 2) Replace the script src attribute for the ArcGIS API for JavaScript CDN
// --------------------------------------------------------------------

// --------------------------------------------------------------------
// Read the dojo file contents from disk
// --------------------------------------------------------------------
console.log("library - reading %s", jsapiDojoFile);
let rawDojoContent = fs.readFileSync(jsapiDojoFile, "utf-8");
// --------------------------------------------------------------------
// Replace the script src attribute for the ArcGIS API for JavaScript CDN
// --------------------------------------------------------------------
console.log("library - replacing script tag for %s", jsapiDojoFile);
let updatedDojoContent = rawDojoContent.replace(hostnameAndPathRegEx, jsapiURLBaseLocal);
// --------------------------------------------------------------------
// Save the dojo file contents to disk
// --------------------------------------------------------------------
console.log("library - saving %s", jsapiDojoFile);
fs.writeFileSync(jsapiDojoFile, updatedDojoContent, "utf-8");

// --------------------------------------------------------------------
// Read the init file contents from disk
// --------------------------------------------------------------------
console.log("library - reading %s", jsapiInitFile);
let rawInitContent = fs.readFileSync(jsapiInitFile, "utf-8");
// --------------------------------------------------------------------
// Replace the script src attribute for the ArcGIS API for JavaScript CDN
// --------------------------------------------------------------------
console.log("library - replacing script tag for %s", jsapiInitFile);
let updatedInitContent = rawInitContent.replace(hostnameAndPathRegEx, jsapiURLBaseLocal);
// --------------------------------------------------------------------
// Save the init file contents to disk
// --------------------------------------------------------------------
console.log("library - saving %s", jsapiInitFile);
fs.writeFileSync(jsapiInitFile, updatedInitContent, "utf-8");