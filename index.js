'use strict';

var through = require('through2');
var xmldoc = require('xmldoc'); 
var path = require('path');
var PluginError = require('gulp-util').PluginError;

const PLUGIN_NAME = 'gulp-spcolor2scss';
const PREFIX = "spcolor_";

function convertToSCSS(contents)
{
    var output = "";
    var doc = new xmldoc.XmlDocument(contents);
    doc.eachChild(function(child, index, array) {
        var name = child.attr.name;
        var hex = child.attr.value;
        var hasAlpha = (hex.length === 8);
        if (hasAlpha) {
            var alpha = (parseInt(hex.substr(6,2), 16) / 255).toFixed(2);
            hex = hex.substr(0, 6);
            output += "$" + PREFIX + name + ": rgba(#" + hex + ", " + alpha + ");\n";
        } else {
            output += "$" + PREFIX + name + ": #" + hex + ";\n";
        }        
    });        
    return new Buffer(output);
}

module.exports = function() {
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
        cb(null, file);
        return;
    }
    
    if (file.isStream()) {
        this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
    }
              
    if (file.isBuffer())
    {
        try {
            file.contents = convertToSCSS(file.contents);
            file.path = path.join(path.dirname(file.path), "_" + path.basename(file.path, ".spcolor")  + "_spcolor.scss");            
            return cb(null, file);
        } catch (e) {
             this.emit('error', new PluginError(PLUGIN_NAME, e));       
        }
    }
  });
};
