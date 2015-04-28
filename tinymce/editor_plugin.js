(function() {

    // Load plugin specific language pack
    tinymce.PluginManager.requireLangPack('chemeditor');

    tinymce.create('tinymce.plugins.Chemeditor', {

                    init : function(ed, url) {

                        ed.addCommand('openEditor', function(v, args) {
                            ed.windowManager.open({
                                            file : ed.getParam("moodle_plugin_base") + 'chemeditor/tinymce/editor.php',
                                            width : 1050,
                                            height : 600,
                                            inline : 1
                            }, {
                                            plugin_url : url, //  /lib/editor/tinymce/plugins/loader.php/chemeditor/-1"
                                            molecule : (args == undefined) ? "" : args.molecule,
                                            settings : (args == undefined) ? "" : args.settings
                            });

                        });
                        ed.onInit.add(function(ed, o) {
                            tooltip = 'chemeditor.doubleclick'
                            tinymceBody = ed.getBody();

                            Y.one(tinymceBody).delegate("mouseenter", function(e) {
                                this.set("title", tooltip);
                            }, "img[data-mol]");

                            Y.one(tinymceBody).delegate("mouseleave", function(e) {
                                this.removeAttribute("title");
                            }, "img[data-mol]");

                        });

                        // Register example button
                        ed.addButton('chemeditor', {
                                        title : 'chemeditor.button',
                                        cmd : 'openEditor',
                                        image : url + '/img/icon.png'
                        });

                        //make images editable
                        ed.onDblClick.add(function(ed, e) {
                            elementClicked = e.target;

                            if (elementClicked.nodeName == 'IMG' && elementClicked.hasAttribute("data-mol")) {
                                var molecule = elementClicked.getAttribute("data-mol");
                                var settings = elementClicked.getAttribute("data-sett");
                                ed.execCommand('openEditor', false, {molecule:molecule, settings:settings});
                            }
                        });

                    },

                    getInfo : function() {
                        return {
                                        longname : 'Martin mastny',
                                        author : 'Martin Mastny',
                                        authorurl : '',
                                        infourl : 'http://www.chemaxon.com/products/marvin/marvin-js/',
                                        version : "1.0"
                        };
                    }
    });
    // Register plugin
    tinymce.PluginManager.add('chemeditor', tinymce.plugins.Chemeditor);
})();