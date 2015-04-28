<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.


/**
 * Main editor integration window
 *
 * This file defines popup window which is shown when a button is clicked
 * in tinymce.
 *
 * @package tinymce_chemdraw
 * @copyright 2015 Martin Mastny
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define('NO_MOODLE_COOKIES', true);

require(dirname(dirname(dirname(dirname(dirname(dirname(dirname(__FILE__))))))) . '/config.php');

$PAGE->set_context(context_system::instance());
$PAGE->set_url('/lib/editor/tinymce/plugins/chemeditor/editor.php');
$PAGE->requires->yui_module("node", "");
$config = get_config("tinymce_chemeditor");
$marvinurl = $config->marvinurl;

header('Content-Type: text/html; charset=utf-8');
header('X-UA-Compatible: IE=edge')
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<title>{#chemeditor.title}</title>
<script type="text/javascript">
        // Because there is no relative path to TinyMCE, we have to use JavaScript
        // to work out correct path from the .js files from TinyMCE. Only files
        // inside this plugin can be included with relative path (below).
        var editor_tinymce_include = function(path) {
            document.write('<script type="text/javascript" src="' +
                    parent.tinyMCE.baseURL + '/' + path + '"></' + 'script>');
        };
        editor_tinymce_include('tiny_mce_popup.js');
		var langInterval = setInterval(function(){
			if (typeof tinyMCEPopup != "undefined"){
				tinyMCEPopup.requireLangPack();
				clearInterval(langInterval);
			}
			},100);



    </script>


<link href="css/chemeditor.css" rel="stylesheet" type="text/css" />
</head>
<body>
	<table border="1">
		<tr>
			<td colspan="4">
				<div id="marvin_div">
					<iframe id="marvinsketch" src="<?php echo $marvinurl."/editor.html"?>"
						style="overflow: hidden; min-width: 500px; min-height: 450px; border: 1px solid darkgray;"></iframe>
				</div>
			</td>
			<td>
				<div id="image_prev">
					<img id="molimage" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" />
					<img id="loading_image" src="img/loading.gif"/>
				</div>
			</td>
		</tr>
		<tr>
			<td class="tdcenter"><label for="carbonLabelVisible">{#chemeditor.carbonlabels}</label>
			</td>
			<td ><input type="checkbox" id="carbonLabelVisible" />
			</td>
			<td class="tdcenter"><label for="cpkColoring">{#chemeditor.cpkcolor}</label>
			</td>
			<td><input type="checkbox" id="cpkColoring" />
			</td>
			<td rowspan="4" class="tdcenter">
				<input type="button" disabled value="{#chemeditor.pastebutton}" id="chemeditor_paste"></input>
			</td>
		</tr>
		<tr>
			<td class="tdcenter"><label for="implicitHydrogen">{#chemeditor.implhydrogens}</label>
			</td>
			<td><select id="implicitHydrogen">
					<option value="ALL">{#chemeditor.implhydrogens_all}</option>
					<option value="OFF">{#chemeditor.implhydrogens_off}</option>
					<option value="HETERO">{#chemeditor.implhydrogens_hetero}</option>
					<option value="TERMINAL_AND_HETERO">{#chemeditor.implhydrogens_terminalandhetero}</option>
			</select>
			</td>
			<td class="tdcenter"><label for="displayMode">{#chemeditor.displaymode}</label>
			</td>
			<td><select id="displayMode">
					<option value="WIREFRAME">{#chemeditor.displaymode_wireframe}</option>
					<option value="BALLSTICK">{#chemeditor.displaymode_ballstick}</option>
			</select>
			</td>
		</tr>

		<tr>
			<td class="tdcenter"><label for="imgwidth">{#chemeditor.imgwidth}</label>
			</td>
			<td><input type="number" value=200 min=100 max=500 id="imgwidth" />
			</td>
			<td class="tdcenter"><label for="imgheight">{#chemeditor.imgheight}</label>
			</td>
			<td><input type="number" value=200 min=100 max=500
				id="imgheight" />
			</td>
		</tr>

		<tr>
			<td class="tdcenter"><label for="zoomMode">{#chemeditor.zoommode}</label>
			</td>
			<td><select id="zoomMode">
					<option value="FIT">{#chemeditor.zoommode_fit}</option>
					<option value="AUTOSHRINK">{#chemeditor.zoommode_autoshrink}</option>
			</select>
			</td>
			<td class="tdcenter"><label for="backgroundColor">{#chemeditor.color}</label>
			</td>
			<td><input type="color" id="backgroundColor" value="#FFFFFF" />
			</td>
		</tr>
	</table>
<script type="text/javascript"
-       src="<?php echo $marvinurl."/js/marvinjslauncher.js"; ?>"></script>
-<script type="text/javascript" src="js/chemeditor.js"></script>
</body>
</html>
