/**
 * @OnlyCurrentDoc
 *
 * The above comment directs Apps Script to limit the scope of file
 * access for this add-on. It specifies that this add-on will only
 * attempt to read or modify the files in which the add-on is used,
 * and not all of the user's files. The authorization request message
 * presented to users will reflect this limited scope.
 */

/**
 * Creates a menu entry in the Google Docs UI when the document is opened.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onOpen trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode.
 */

//GLOBALS
var summary = 0;
var commentary = 0;
var evidence = 0;
var nullChar = 0;

function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
      .addItem('Start', 'showSidebar')
      .addToUi();
}

/**
 * Runs when the add-on is installed.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onInstall trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode. (In practice, onInstall triggers always
 *     run in AuthMode.FULL, but onOpen triggers may be AuthMode.LIMITED or
 *     AuthMode.NONE.)
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * Opens a sidebar in the document containing the add-on's user interface.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 */
function showSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('highlight')
      .setTitle('Highlighter');
  DocumentApp.getUi().showSidebar(ui);
}

function highlightText(background){
  var selection = DocumentApp.getActiveDocument().getSelection();
if (selection) {
  var elements = selection.getRangeElements();
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    // Only modify elements that can be edited as text; skip images and other non-text elements.
    if (element.getElement().editAsText) {
      var text = element.getElement().editAsText();

      // Highlight the selected part of the element, or the full element if it's completely selected.
        text.setBackgroundColor(element.getStartOffset(), element.getEndOffsetInclusive(), background);

    }
  }
}
  return statsLogger();
}

function statsLogger(){
  var paras = DocumentApp.getActiveDocument().getBody().getParagraphs();
  summary = 0;
  commentary = 0;
  evidence = 0;
  nullChar = 0;
  
  for(var x in paras){
    try{
      atts = paras[x].editAsText();
      var i = 0
      while(true){
        
        color = atts.getBackgroundColor(i);
        if('#f3f315' == color){
          summary++;
        }
        else if('#0dd5fc' == color){
          commentary++;
        }
        else if('#39ff14' == color){
          evidence++;
        }
        else{
          nullChar++;
        }
        i++
      }
    }
    
    catch(e){
      continue;
    }
  }
  
  var summaryStats = summary/(summary+commentary+evidence+nullChar);
  var commentaryStats = commentary/(summary+commentary+evidence+nullChar);
  var evidenceStats = evidence/(summary+commentary+evidence+nullChar);
  var nullCharStats = nullChar/(summary+commentary+evidence+nullChar);
  
  Logger.log('Summary: ' + summary + 'chars');
  Logger.log(summaryStats);
  Logger.log('Commentary: ' + commentary + 'chars');
  Logger.log(commentaryStats);
  Logger.log('Evidence: ' + evidence + 'chars');
  Logger.log(evidenceStats);
  Logger.log('Nulls: ' + nullChar + 'chars');
  Logger.log(nullCharStats);
  
  var remainder = Math.floor(summaryStats) + Math.floor(commentaryStats) + Math.floor(evidenceStats) + Math.floor(nullCharStats);
  remainder = Math.round(100-remainder);
  
  
  var test = 0.027916251246261216;
  var test2 = 0.027916251246261216*100-2;
  Logger.log('TEST: ' + test2);
  
  return stats;
}

//updates the stats when add-on is started
statsLogger();
