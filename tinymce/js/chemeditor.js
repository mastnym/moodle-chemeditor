var marvinSketch;
var marvinPackage;

var Chemeditor = {
                marvinSketch : null,
                marvinPackage : null,

                init : function(ed) {
                    molecule = top.tinymce.activeEditor.windowManager.params.molecule;

                    tinyMCEPopup.resizeToInnerSize();
                    // ugly hack - load event for marvinsketch iframe does not
                    // work
                    var interval = setInterval(function() {
                        var iframe = document.getElementById("marvinsketch");
                        var content = (iframe.contentWindow || iframe.contentDocument);
                        if (content.document && content.document.getElementById("sketch")) {
                            // expecting frame to be loaded now
                            MarvinJSUtil.getEditor("#marvinsketch").then(function(sketcherInstance) {
                                Chemeditor.marvinSketch = sketcherInstance;
                                Chemeditor.marvinSketch.on("molchange", Chemeditor.molchanged);
                                Chemeditor.settingsChanged();
                                document.getElementById("loading_image").style.display = "none";
                                document.getElementById("chemeditor_paste").addEventListener("click", Chemeditor.pasteMol);

                            }, function(error) {
                                alert(tinyMCEPopup.getLang('chemeditor.loaderror'));
                            });
                            MarvinJSUtil.getPackage("#marvinsketch").then(function(packageInstance) {
                                Chemeditor.marvinPackage = packageInstance;
                                // takes longer to get package which is needed
                                // to display an image of edited molecule
                                if (molecule != "") {
                                    Chemeditor.marvinSketch.importAsMol(molecule);
                                }

                            }, function() {
                                alert(tinyMCEPopup.getLang('chemeditor.loaderror'));
                            });
                            clearInterval(interval);
                        }
                    }, 200);

                },
                getImageURL : function(mol) {
                    marvinSettings = {
                                    'carbonLabelVisible' : document.getElementById("carbon_labels").checked,
                                    'cpkColoring' : document.getElementById("cpk_color").checked,
                                    'implicitHydrogen' : document.getElementById("implicit_hydrogens").value,
                                    'displayMode' : document.getElementById("display_mode").value,
                                    'background-color' : document.getElementById("color").value,
                                    'zoomMode' : document.getElementById("zoom_mode").value,
                                    'width' : parseInt(document.getElementById("imgwidth").value, 10),
                                    'height' : parseInt(document.getElementById("imgheight").value, 10),
                    };
                    Chemeditor.marvinSketch.setDisplaySettings(marvinSettings);
                    return Chemeditor.marvinPackage.ImageExporter.molToDataUrl(mol, "image/png", marvinSettings);
                },

                molchanged : function() {
                    // not ready for src export yet
                    /*
                     * if (marvinPackage==null){ return }
                     */
                    var mol = Chemeditor.marvinSketch.exportAsMol();
                    /*
                     * if (mol==""){
                     * document.getElementById("chemeditor_paste").disabled=true;
                     * return; }
                     */
                    document.getElementById("loading_image").style.display = "inline";
                    document.getElementById("chemeditor_paste").disabled = false;
                    var url = Chemeditor.getImageURL(mol);
                    document.getElementById("molimage").setAttribute("src", url);
                    document.getElementById("loading_image").style.display = "none";
                },

                settingsChanged : function() {
                    document.getElementById("carbon_labels").addEventListener("click", Chemeditor.molchanged);
                    document.getElementById("cpk_color").addEventListener("click", Chemeditor.molchanged);
                    document.getElementById("implicit_hydrogens").addEventListener("change", Chemeditor.molchanged);
                    document.getElementById("display_mode").addEventListener("change", Chemeditor.molchanged);
                    document.getElementById("color").addEventListener("change", Chemeditor.molchanged);
                    document.getElementById("zoom_mode").addEventListener("change", Chemeditor.molchanged);
                    document.getElementById("imgwidth").addEventListener("change", Chemeditor.molchanged);
                    document.getElementById("imgheight").addEventListener("change", Chemeditor.molchanged);
                },

                pasteMol : function() {
                    var ed = tinyMCEPopup.editor;
                    var mol = Chemeditor.marvinSketch.exportAsMol();
                    var url = Chemeditor.getImageURL(mol);
                    var args = {
                        src : url
                    };
                    //have to add this way because of the dash in attr name
                    args["data-mol"] = mol;

                    ed.execCommand('mceInsertContent', false, tinyMCEPopup.editor.dom.createHTML('img', args), {});
                    tinyMCEPopup.close();
                }
};
tinyMCEPopup.onInit.add(Chemeditor.init, Chemeditor);
