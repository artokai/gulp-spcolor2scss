'use strict';

var spcolor2scss = require('./index.js');
var should = require('should');
var File = require('vinyl');
var path = require('path');
require('mocha');

describe("gulp-spcolor2scss", function() {

	var spcolorContents = `
		<?xml version="1.0" encoding="utf-8"?>
		<s:colorPalette isInverted="false" previewSlot1="BackgroundOverlay" previewSlot2="BodyText" previewSlot3="AccentText" xmlns:s="http://schemas.microsoft.com/sharepoint/">
			<s:color name="ColorA" value="333333" />
			<s:color name="ColorB" value="666666" />
			<s:color name="TransparentColorC" value="33669900" />
			<s:color name="TransparentColorD" value="336699FF" />
			<s:color name="TransparentColorE" value="33669999" />
		</s:colorPalette>
	`;

	var expectedScss = "$spcolor_ColorA: #333333;\n";
	expectedScss += "$spcolor_ColorB: #666666;\n";
	expectedScss += "$spcolor_TransparentColorC: rgba(#336699, 0.00);\n";
	expectedScss += "$spcolor_TransparentColorD: rgba(#336699, 1.00);\n";
	expectedScss += "$spcolor_TransparentColorE: rgba(#336699, 0.60);\n";
	
	function getFakeFile() {
		return new File({ 
			path: '/dummy/input.spcolor', 
			cwd: '/', 
			base: '/dummy/', 
			contents: new Buffer(spcolorContents) 
		}); 
	}
	
	it("should convert to scss", function(done) {
		var file_count = 0;
		
		var stream = spcolor2scss();
		stream.on('data', function(newFile) {
			should.exist(newFile, "file does not exist"); 
			should.exist(newFile.path, "file.path does not exist"); 
			should.exist(newFile.relative, "file.relative does not exist"); 
			should.exist(newFile.contents, "file.contents does not exist"); 
			 
			newFile.path.should.equal(path.join('/dummy/', '_input_spcolor.scss'), "file.path is not correct");
			newFile.relative.should.equal('_input_spcolor.scss', "file.relative is wrong"); 
		 
			newFile.contents.toString('utf-8').should.equal(expectedScss, "generated scss is wrong");
			 
			++file_count;
		});
		
		stream.once('end', function () {
			file_count.should.equal(1, "File count is wrong");
			done();
		});		

		var inputFile = getFakeFile();
		stream.write(inputFile);
		stream.end();
	});
});