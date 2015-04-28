var marvinSketch;
var marvinPackage;

var Chemeditor = {
                marvinSketch : null,
                marvinPackage : null,
                
                init : function(ed) {
                    var molecule = top.tinymce.activeEditor.windowManager.params.molecule;
                    var settings = top.tinymce.activeEditor.windowManager.params.settings;
                    var self = this;
                    tinyMCEPopup.resizeToInnerSize();

                    MarvinJSUtil.getEditor("#marvinsketch").then(function(sketcherInstance) {
                        self.marvinSketch = sketcherInstance;
                        self.settingsChanged();
                        self.marvinSketch.on("molchange", self.molchanged.bind(self), false);
                        document.getElementById("loading_image").style.display = "none";
                        document.getElementById("chemeditor_paste").addEventListener("click", self.pasteMol.bind(self), false);
                        if (molecule != "") {
                            if (settings != ""){
                                settings = JSON.parse(settings);
                                self.updateUI(settings);
                                self.marvinSketch.setDisplaySettings(settings);
                                
                            }
                            self.marvinSketch.importAsMol(molecule);
                            
                        }
                        
                        
                    }, function(error) {
                        alert(tinyMCEPopup.getLang('chemeditor.loaderror'));
                    });
                    MarvinJSUtil.getPackage("#marvinsketch").then(function(packageInstance) {
                        self.marvinPackage = packageInstance;
                    }, function() {
                        alert(tinyMCEPopup.getLang('chemeditor.loaderror'));
                    });
                    

                },
                getCurrentSettings : function() {
                    
                    var marvinSettings = {
                                    "carbonLabelVisible" : document.getElementById("carbonLabelVisible").checked,
                                    "cpkColoring" : document.getElementById("cpkColoring").checked,
                                    "implicitHydrogen" : document.getElementById("implicitHydrogen").value,
                                    "displayMode" : document.getElementById("displayMode").value,
                                    "backgroundColor" : document.getElementById("backgroundColor").value,
                                    "zoomMode" : document.getElementById("zoomMode").value,
                                    "width" : parseInt(document.getElementById("imgwidth").value, 10),
                                    "height" : parseInt(document.getElementById("imgheight").value, 10),
                    };
                    return marvinSettings;
                },
                updateUI : function(settings) {
                    for (var property in settings){
                        if (settings.hasOwnProperty(property)){
                            var settingWidget = document.getElementById(property);
                            if (settingWidget != undefined){
                                var type = settingWidget.type;
                                if (type!="checkbox"){
                                    settingWidget.value = settings[property];
                                }
                                else{
                                    settingWidget.checked = settings[property];
                                }
                                
                            }
                        }
                    }
                },
                molchanged : function() {
                    var mol = this.marvinSketch.exportAsMol();
                    var settings = this.getCurrentSettings();
                    this.marvinSketch.setDisplaySettings(settings);
                    document.getElementById("loading_image").style.display = "inline";
                    document.getElementById("chemeditor_paste").disabled = false;
                    var url = this.marvinPackage.ImageExporter.molToDataUrl(mol, "image/png", settings);
                    document.getElementById("molimage").setAttribute("src", url);
                    document.getElementById("loading_image").style.display = "none";
                },

                settingsChanged : function() {
                    document.getElementById("carbonLabelVisible").addEventListener("click", this.molchanged.bind(this), false);
                    document.getElementById("cpkColoring").addEventListener("click", this.molchanged.bind(this), false);
                    document.getElementById("implicitHydrogen").addEventListener("change", this.molchanged.bind(this), false);
                    document.getElementById("displayMode").addEventListener("change", this.molchanged.bind(this), false);
                    document.getElementById("backgroundColor").addEventListener("change", this.molchanged.bind(this), false);
                    document.getElementById("zoomMode").addEventListener("change", this.molchanged.bind(this), false);
                    document.getElementById("imgwidth").addEventListener("change", this.molchanged.bind(this), false);
                    document.getElementById("imgheight").addEventListener("change", this.molchanged.bind(this), false);
                },

                pasteMol : function() {
                    var ed = tinyMCEPopup.editor;
                    var mol = this.marvinSketch.exportAsMol();
                    var url = this.marvinPackage.ImageExporter.molToDataUrl(mol, "image/png", this.getCurrentSettings());
                    var args = {
                        src : url
                    };
                    //have to add this way because of the dash in attr name
                    args["data-mol"] = mol;
                    args["data-sett"] = JSON.stringify(this.marvinSketch.getDisplaySettings());
                    ed.execCommand('mceInsertContent', false, tinyMCEPopup.editor.dom.createHTML('img', args), {});
                    tinyMCEPopup.close();
                }
};
tinyMCEPopup.onInit.add(Chemeditor.init, Chemeditor);
