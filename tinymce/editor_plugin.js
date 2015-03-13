(function() {

    // Load plugin specific language pack
    tinymce.PluginManager.requireLangPack('chemeditor');

    tinymce.create('tinymce.plugins.Chemeditor', {

                    init : function(ed, url) {

                        ed.addCommand('openEditor', function(v, molecule) {

                            ed.windowManager.open({
                                            file : ed.getParam("moodle_plugin_base") + 'chemeditor/tinymce/editor.php',
                                            width : 1050,
                                            height : 600,
                                            inline : 1
                            }, {
                                            plugin_url : url, //  /lib/editor/tinymce/plugins/loader.php/chemeditor/-1"
                                            molecule : (molecule == undefined) ? "" : molecule
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

                            //console.log(elementClicked.nodeName);
                            if (elementClicked.nodeName == 'IMG' && elementClicked.hasAttribute("data-mol")) {
                                molecule = elementClicked.getAttribute("data-mol")
                                ed.execCommand('openEditor', false, molecule);
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