/**
    Export layers from PSD as tifs
**/ 


/*
// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>Publish Top Layers...</name>
<category>aaaaTopMostItem</category>
<menu>automate</menu>
</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING
*/


#target photoshop


$.localize = true;

try {

    GlobalVariables();

    var gpl = new PublishLayers();

    gpl.CreateDialog();

    if ( gRunButtonID === gpl.RunDialog() )
    {
        gpl.Execute();
    } else {
        gScriptResult = 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
    }
}


// Lot's of things can go wrong
// Give a generic alert and see if they want the details
catch( e ) {
    if ( e.number != 8007 ) { // don't report error on user cancel
        if ( confirm( strSorry ) ) {
            alert( e + " : " + e.line );
        }
    }
    gScriptResult = 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
}


// must be the last thing
gScriptResult; 




///////////////////////////////////////////////////////////////////////////////
// Function: GlobalVariables
// Usage: all of my globals
// Input: <none>
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function GlobalVariables() {

    // a version for possible expansion issues
    gVersion = 1;

    gScriptResult = undefined;

    // ok and cancel button
    gRunButtonID = 1;
    gCancelButtonID = 2;


    // all the strings that need localized
    strTitle =  "Publish Layers" ;
    strLabelDestination =  "Select location to save published layers" ;
    strLabelLayers = "Select layers to publish";
    strSaveMaster = "Save master PSD";
    
    strButtonBrowse1 =  "Select Folder..." ;
    strButtonRun =  "Run" ;
    strButtonCancel = "Cancel";
    
    strNoFolderSelected =  "No folder has been selected" ;
    strSaveInSameLocation =  "S&ave in Same Location" ;
    strSaveInSameLocationHelp =  "Save the new documents next to the original documents" ;
        
    strLabelSource =  "Select the images to process" ;
    strNoImagesSelected =  "No images have been selected" ;
    strLabelSourceHelp =  "Location of files to process" ;
    strOpenFirst =  "&Open first image to apply settings" ;
    strOpenFirstHelp =  "Show the Camera RAW dialog on the first image to apply settings" ;
    strBridge =  "Process files from Bridge only" ;
    strBridgeHelp =  "Selected files from Bridge will be processed" ;
    strFileType =  "File Type" ;
    strPreferences =  "Preferences" ;
    strRunAction =  "Run Action:" ;
    strActionHelp =  "Select an action set and an action" ;
    strSaveAsJPEG =  "Save as &JPEG" ;
    strSaveAsJPEGHelp =  "Save a file to the JPEG format" ;
    strQuality =  "Quality:" ;
    strConvertICC =  "Con&vert Profile to sRGB" ;
    strConvertICCHelp =  "Convert the ICC profile to sRGB before saving" ;
    strResizeToFit1 =  "&Resize to Fit" ;
    strResizeToFit2 =  "R&esize to Fit" ;
    strResizeToFit3 =  "Resi&ze to Fit" ;
    strResizeToFitHelp =  "Select to resize for this format" ;
    strSaveAsPSD =  "Save as &PSD" ;
    strSaveAsPSDHelp =  "Save a file to the PSD format" ;
    strMaximize =  "&Maximize Compatibility" ;
    strMaximizeHelp =  "Maximize compatibility when saving to PSD format" ;
    strSaveAsTIFF =  "Save as &TIFF" ;
    strSaveAsTIFFHelp =  "Save a file to the TIFF format" ;
    strLZW =  "LZ&W Compression" ;
    strLZWHelp =  "Use LZW compression when saving in TIFF format" ;
    strCopyright =  "Copyright Info:" ;
    strCopyrightHelp =  "Add copyright metadata to your images" ;
    strW =  "W:" ;
    strWHelp =  "Type in a width to resize image" ;
    strH =  "H:" ;
    strHHelp =  "Type in a height to resize image" ;
    strPX =  "px" ;
    strPickXML =  "Pick an XML file to load" ;
    strPickXMLWin =  "XML Files: *.xml" ;
    strPickXMLSave =  "Pick an XML file to save" ;
    strPickSource =  "Pick a source folder" ;
    strPickDest =  "Pick a destination folder" ;
    strSpecifySource =  "Please specify a source folder." ;
    strSpecifyDest =  "Please specify a destination folder." ;
    strJPEGQuality =  "JPEG Quality must be between 0 and 12." ;
    strJPEGWandH =  "You must specify width and height when using resize image options for JPEG." ;
    strTIFFWandH =  "You must specify width and height when using resize image options for TIFF." ;
    strPSDWandH =  "You must specify width and height when using resize image options for PSD." ;
    strOneType =  "You must save to at least one file type." ;
    strWidthAndHeight =  "Width and Height must be defined to use FitImage function!" ;
    strMustUse =  "You must use Photoshop CS 2 or later to run this script!" ;
    strSorry =  "Sorry, something major happened and I can't continue! Would you like to see more info?" ;
    strCouldNotProcess =  "Sorry, I could not process the following files:^r" ;
    strMustSaveOpen =  "Open files must be saved before they can be used by the Image Processor." ;
    strFollowing =  "The following files will not be saved." ;
    strNoOpenableFiles =  "There were no source files that could be opened by Photoshop." ;
    strCannotWriteToFolder =  "I am unable to create a file in this folder. Please check your access rights to this location " ;
    strKeepStructure =  "Keep folder structure" ;
    strIncludeAllSubfolders =  "Include All sub-folders" ;
    strIncludeAllSubfoldersHelp =   "Process all the folders within the source folder" ;
    strFileAlreadyExists =   "The file already exists. Do you want to replace?" ;
    
    // some strings that need localized to define the preferred sizes of items for different languages
    strsourceAndDestLength =  "210" ;
    stractionDropDownLength =  "165" ;

}

function PublishLayers(){


    this.CreateDialog = function() {
    
        // create the main dialog window, this holds all our data
        this.dlgMain = new Window( 'dialog', strTitle );
        
        // create a shortcut for easier typing
        var d = this.dlgMain;
        
        d.orientation = 'row';
        d.alignChildren = 'fill';

        var sourceAndDestLength = StrToIntWithDefault( strsourceAndDestLength, 210 );

        var squeezePlay = 5;
        
        d.marginLeft = 15;

        // I use some hidden items to help auto layout
        // change this to see them
        var showHidden = false;
        
        // LEFT

        d.grpLeft = d.add( 'group' );
        
        // create a shortcut for easier typing
        var l = d.grpLeft;
        
        l.orientation = 'column';
        l.alignChildren = 'fill';
        l.spacing = 3;

        // Desination

        l.grp1 = l.add( 'group' );
        l.grp1.orientation = 'row';
        l.grp1.alignChildren = 'center';

        d.icnOne = l.grp1.add( 'image', undefined, 'Step1Icon' );
        d.icnOne.helpTip = strLabelDestination;

        d.stDestination = l.grp1.add( 'statictext', undefined, strLabelDestination );
        d.stDestination.helpTip = strLabelDestination;

        l.grp1Info = l.add( 'group' );
        l.grp1Info.orientation = 'row';
        l.grp1Info.alignChildren = 'fill';
        l.grp1Info.margins = [d.marginLeft, 0, 0, 0];

        l.grp1Info.grpLeft = l.grp1Info.add( 'group' );
        l.grp1Info.grpLeft.orientation = 'row';
        l.grp1Info.grpLeft.alignChildren = 'left';

        d.icnDest = l.grp1Info.grpLeft.add( 'image', undefined, 'DestinationFolderIcon' );
        d.icnDest.helpTip = strLabelDestination;

        l.grp1Info.grpRight = l.grp1Info.add( 'group' );
        l.grp1Info.grpRight.orientation = 'column';
        l.grp1Info.grpRight.alignChildren = 'left';
        l.grp1Info.grpRight.spacing = squeezePlay;

        l.grpSaveOptions = l.grp1Info.grpRight.add( 'group' );
        l.grpSaveOptions.orientation = 'row';
        l.grpSaveOptions.alignChildren = 'center';

        d.rbSaveInSame = l.grpSaveOptions.add( 'radiobutton', undefined, strSaveInSameLocation );
        d.rbSaveInSame.helpTip = strSaveInSameLocationHelp;
    
        l.grpDestBrowse = l.grp1Info.grpRight.add( 'group' );
        l.grpDestBrowse.orientation = 'row';
        l.grpDestBrowse.alignChildren = 'center';

        d.rbSaveInNew = l.grpDestBrowse.add( 'radiobutton', undefined, '' );
        d.rbSaveInNew.helpTip = strLabelDestination;

        d.btnDest = l.grpDestBrowse.add( 'button', undefined, strButtonBrowse1 );
        d.btnDest.helpTip = strLabelDestination;
        
        d.stDest = l.grpDestBrowse.add( 'statictext', undefined, strNoFolderSelected, { truncate:'middle' } );
        d.stDest.helpTip = strLabelDestination;
        d.stDest.preferredSize.width = sourceAndDestLength;

        d.line1 = l.add( 'panel', undefined, undefined);

        // Layer chooser

        l.grp2 = l.add( 'group' );
        l.grp2.orientation = 'row';
        l.grp2.alignChildren = 'center';

        d.icnTwo = l.grp2.add( 'image', undefined, 'Step2Icon' );
        d.icnTwo.helpTip = strLabelLayers;

        d.stLayers = l.grp2.add( 'statictext', undefined, strLabelLayers );
        d.stLayers.helpTip = strLabelLayers;

        l.grp2Info = l.add( 'group' );
        l.grp2Info.orientation = 'row';
        l.grp2Info.alignChildren = 'fill';
        l.grp2Info.margins = [d.marginLeft, 0, 0, 0];


        l.grp2Info.grpLeft = l.grp2Info.add( 'group' );
        l.grp2Info.grpLeft.orientation = 'column';
        l.grp2Info.grpLeft.alignChildren = 'left';
        
        l.grpLayerList =  l.grp2Info.grpLeft.add( 'group' );
        l.grpLayerList.orientation = 'row';
        l.grpLayerList.alignChildren = 'center';

        d.ltLayersList = l.grpLayerList.add( 'ListBox',  [0,0,300,190], undefined, {multiselect:true} );
        d.ltLayersList.helpTip = strLabelLayers;

        l.grpOptions =  l.grp2Info.grpLeft.add( 'group' );
        l.grpOptions.orientation = 'row';
        l.grpOptions.alignChildren = 'center';

        d.cbSaveMaster = l.grpOptions.add( 'checkbox', undefined, strSaveMaster  );
        d.cbSaveMaster.helpTip = strSaveMaster;
        
        d.line2 = l.add( 'panel', undefined, undefined);

        // RIGHT

        d.grpRight = d.add( 'group' );
        d.grpRight.orientation = 'column';
        d.grpRight.alignChildren = 'fill';
        d.grpRight.alignment = 'fill';

        d.btnRun = d.grpRight.add( 'button', undefined, strButtonRun );
        d.btnCancel = d.grpRight.add( 'button', undefined, strButtonCancel );

        d.defaultElement = d.btnRun;
        d.cancelElement = d.btnCancel;

    }


    // transfer from the dialog widgets to my internal params
    this.GetParamsFromDialog = function() {
        
        var p = this.params;
        var d = this.dlgMain;

        p["saveinsame"] = d.rbSaveInSame.value;
        p["savemaster"] = d.cbSaveMaster.value;
        p["dest"] = d.destLongText;
        p["selectedlayers"] = d.ltLayersList.selection;
    }


    // run the dialog and get ready to run the script
    this.RunDialog = function() {

        this.dlgMain.btnCancel.onClick = function() { 
            var d = FindDialog( this );
            d.close( gCancelButtonID );
        }


        this.dlgMain.rbSaveInSame.onClick = function() {
            var d = FindDialog( this );
            d.rbSaveInNew.value = ! this.value;
            d.btnDest.enabled = ! this.value;
            d.stDest.enabled = ! this.value;
        }
        
        this.dlgMain.rbSaveInNew.onClick = function() {
            var d = FindDialog( this );
            d.rbSaveInSame.value = ! this.value;
            d.btnDest.enabled = this.value;
            d.stDest.enabled = this.value;
        }


        this.dlgMain.btnDest.onClick = function() { 
            var d = FindDialog( this );
            var selFolder = Folder.selectDialog( strPickDest, d.destLongText );
            if ( selFolder != null ) {
                d.destLongText = selFolder.fsName.toString()
                d.stDest.text = d.destLongText;
            }
            d.defaultElement.active = true;
        }

        this.dlgMain.btnRun.onClick = function () {
            var testFolder = null;
            var d = FindDialog( this );
            if ( this.rbUseFolder ) {
                if ( d.sourceLongText.length > 0 && d.sourceLongText[0] != '.' ) {
                    testFolder = new Folder( d.sourceLongText );
                    if ( !testFolder.exists ) {
                        alert( strSpecifySource );
                        return;
                    }
                } else {
                    alert( strSpecifySource );
                    return;
                }
            }

            if ( d.rbSaveInNew.value ) {
                if ( d.destLongText.length > 0 && d.destLongText[0] != '.' ) {
                    testFolder = new Folder( d.destLongText );
                    if ( !testFolder.exists ) {
                        alert( strSpecifyDest );
                        return;
                    }
                } else {
                    alert( strSpecifyDest );
                    return;
                }
            }

            d.ip.GetParamsFromDialog()
            
            d.close( gRunButtonID );
        }

        this.InitDialog();
        this.ForceDialogUpdate();    
        // in case we double clicked the file
        app.bringToFront();

        this.dlgMain.center();
        
        return this.dlgMain.show();



    }

    // pretend like i clicked it to get the other items to respond to the current settings
    this.ForceDialogUpdate = function() {   
        this.dlgMain.rbSaveInSame.onClick();
    }

    // populate the layers dialog with top most layers
    this.PopulateLayers = function() {

        var d = this.dlgMain;
        var p = this.params;
        
        layers = GetTopLayers();
        
        p['layers'] = layers;

        this.dlgMain.ltLayersList.removeAll();

        for (l in layers)
        {
            d.ltLayersList.add('item', layers[l].name);
        }

        d.ltLayersList.selection = d.ltLayersList.items; 
    }

    // set up the parameters
    this.InitParams = function() {
        var params = new Object();
        params["version"] = gVersion;
        params["saveinsame"] = true;
        params["savemaster"] = true;
        params["dest"] = "";
        params["psd"] = true;
        params["jpeg"] = false;
        params["tiff"] = false;
        params["layers"] = Array();
        params["selectedlayers"] = Array();
        return params;
    }

    this.InitDialog = function() {

        var d = this.dlgMain;
        var p = this.params;
        
        this.dlgMain.ip = this;
        
        d.rbSaveInSame.value = p["saveinsame"];
        d.cbSaveMaster.value = p["savemaster"];

        d.stDest.text = p["dest"];
        if ( d.stDest.text == "" ) {
            d.stDest.text = strNoFolderSelected;
        }
        d.destLongText = p["dest"];
        // d.cbJPEG.value = p["jpeg"];
        // d.cbPSD.value = p["psd"];
        // d.cbTIFF.value = p["tiff"];

        this.PopulateLayers();
    }

    // main exectution of script
    this.Execute = function() {


        // Get active document        
        var docRef = app.activeDocument;

        var p = this.params;
        var DEST,VERSION;
        if (p['saveinsame']){
            DEST = docRef.path+ '/export';        
        } else {
            DEST = p['dest'];
        }


        
        //detect the operating sysem
        iswin = $.os.match(/windows/i)
        ismac = $.os.match(/macintosh/i)
        
        var layerSet;
        var layer;        
       
        var filename =  docRef.name; 
        var VERSION = filename.match(/v[0-9]+/) || 'v001';

        var OUT_PATH = Folder(DEST + '/' + VERSION);

        // make the outfolder if it doesn't exist

        if(!OUT_PATH.exists) OUT_PATH.create();
                        
        var startState = docRef.activeHistoryState;


        // save master document if set

        if (p['savemaster'])
        {
            var master_path = Folder(OUT_PATH+'/master');
            if (!master_path.exists) master_path.create();
            var out_master = (master_path + '/' + filename);

            masterFile = new File(out_master);
            SaveFileasPSD(masterFile,true);

        }

        var filename_obj = separateFileName(filename); 

        these_layers = p['selectedlayers']; // to be populated with the choosen layers from the dialog.
        visible_layers = Array(); 
        
        if ( docRef.layers.length > 0 )
        {
            // First hide all root-level layers             
            for(var c=0; c < docRef.layers.length; c++)
            {
                if ( !docRef.layers[c].name.match ('_VIS') )
                {
                    if (docRef.layers[c].visible === true)
                    {
                        visible_layers.push(docRef.layers[c])
                    }
                    docRef.layers[c].visible = false;
                }
                else {
                    docRef.layers[c].visible = true;
                }
                for (tl in these_layers){
            
                    lName=docRef.layers[c].name;
                    
                    if (lName.match(these_layers[tl])){
                        docRef.layers[c].visible=true;
                    }
                }
            }

            // save the current state
            var savedState = docRef.activeHistoryState;

            // TODO Flattern image before save
            
            // save flatterned version ...

            // var flat_tif = (OUT_PATH+'/'+WORKSPACE+'_'+CAM+'_f'+FRAME+'_'+CS+'_COMP_REF_v'+pad(%(VERSION)d,3) + '.tif');
            // var flat_tif = (OUT_PATH+'/'+ filename_obj.filename + '.tif');

            // // Export TIF
            // var tifFile = new File(flat_tif);
            // SaveFileasTIFF(tifFile);


            // var flat_jpg = (OUT_PATH+'/'+ filename_obj.filename  + '.jpg');

            // Resize the doc

            // currentImageWidth = docRef.width 
            // currentImageHeight = docRef.height 

            // docRef.resizeImage(currentImageWidth/10, currentImageHeight/10);

            // // Export Jpg
            // var jpgFile = new File(flat_jpg);
            // SaveFileasJPG(jpgFile);

            docRef.activeHistoryState = savedState;
            
            //hide all the layers except the VIS labled ones
            
            //First hide all root-level layers that are not marked VIS
            for(var c=0;c < docRef.layers.length; c++)
            {
                if (!docRef.layers[c].name.match ('VIS')){
                            docRef.layers[c].visible = false;
                } else {
                    docRef.layers[c].visible = true;
                }
            }

            for (var l=0;l < docRef.layers.length; l++)
            {
                for (tl in these_layers){
                    
                     lName=docRef.layers[l].name;
                    
                    if (lName.match(these_layers[tl])){
                    
                        ln = lName.replace(/ /g,"_");
                        
                        docRef.layers[l].visible=true;
                        
                        layer_fileName = (OUT_PATH+'/' + ln + '_' + filename_obj.filename + '.psd');
                        
                        layerFile = new File(layer_fileName);
                        SaveFileasPSD(layerFile);
                        
                        docRef.layers[l].visible = false;
                        
                    }       
                }   
            }
                
            docRef.activeHistoryState = startState;
            // Set the orignal visable layers to true
            for ( l in visible_layers ){
                visible_layers[l].visible = true;
            }
        
            alert("Publish Complete");
        }           
    }
 
    this.params = this.InitParams();
}

function SaveFileasPSD(saveFile, savelayers) {

    var savelayers = savelayers || false;

    psdSaveOptions = new PhotoshopSaveOptions();
    psdSaveOptions.alphaChannels = true;
    psdSaveOptions.layers = savelayers;
    app.activeDocument.saveAs(saveFile, psdSaveOptions, true, Extension.LOWERCASE);
}

function SaveFileasTIFF(saveFile) {
    tiffSaveOptions = new TiffSaveOptions();
    tiffSaveOptions.alphaChannels = true;
    tiffSaveOptions.imageCompression = TIFFEncoding.TIFFLZW;
    tiffSaveOptions.layers = false;
    tiffSaveOptions.transparency = true;
    app.activeDocument.saveAs(saveFile, tiffSaveOptions, true, Extension.LOWERCASE);
} 

function SaveFileasJPG(saveFile) {
    jpgSaveOptions = new JPEGSaveOptions();
    jpgSaveOptions.quality = 8
    app.activeDocument.saveAs(saveFile, jpgSaveOptions, true, Extension.LOWERCASE);
} 

function GetTopLayers() {

    // Get active document        
    var docRef = app.activeDocument;

    var layers = Array();

    for(var c=0; c < docRef.layers.length; c++)
    {
        // add layer to export layers if name does not match _IGNORE

        if (docRef.layers[c].name.match (/LR[0-9]+/)){
            layers.push(docRef.layers[c])
        }
    }

    return layers;
} 

function CreatePath(path) {
    var folder = new Folder(path);      
    if (!folder.exists) {  
        var parts = path.split('/');  
        parts.pop();  
        CreatePath(parts.join('/'));  
        folder.create();  
    }  
}

function separateFileName(theFileName){ 
    if (/\.\w+$/.test(theFileName)) { 
        var m = theFileName.match(/([^\/\\]+)\.(\w+)$/); 
        if (m) 
            return {filename: m[1], ext: m[2]}; 
        else 
            return {filename: 'no file name', ext:null}; 
    } else { 
        var m = theFileName.match(/([^\/\\]+)$/); 
        if (m) 
            return {filename: m[1], ext: null}; 
        else 
            return {filename: 'no file name', ext:null}; 
    } 
}


///////////////////////////////////////////////////////////////////////////////
// Function: FindDialog
// Usage: From a deeply grouped dialog item go up til you find the parent dialog
// Input: Current dialog item, an actual item or a group
// Return: top parent dialog
///////////////////////////////////////////////////////////////////////////////
function FindDialog( inItem ) {
    var w = inItem;
    while ( 'dialog' != w.type ) {
        if ( undefined == w.parent ) {
            w = null;
            break;
        }
        w = w.parent;
    }
    return w;
}

///////////////////////////////////////////////////////////////////////////
// Function: StrToIntWithDefault
// Usage: convert a string to a number, first stripping all characters
// Input: string and a default number
// Return: a number
///////////////////////////////////////////////////////////////////////////
function StrToIntWithDefault( s, n ) {
    var onlyNumbers = /[^0-9]/g;
    var t = s.replace( onlyNumbers, "" );
    t = parseInt( t );
    if ( ! isNaN( t ) ) {
        n = t;
    }
    return n;
}


function pad(number, length){
   var str = "" + number;
   while(str.length<length){
      str = 0+str;
   }
   return str;
}

function oc(a)
{
  var o = {};
  for(var i=0;i<a.length;i++)
  {
    o[a[i]]='';
  }
  return o;
}
