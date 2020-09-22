/*------------------------------------------------------------------------------------------------------/
| Set Script - CCF License Routines
| 
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
var documentOnly = false;						// Document Only -- displays hierarchy of std choice steps

/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = 3.0

eval(getScriptText("INCLUDES_BATCH", null, true));
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, true));
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS_ASB", null, true));
eval(getScriptText("INCLUDES_CUSTOM", null, true));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, true));
eval(getScriptText("INCLUDES_CUSTOM_GLOBALS", null, true));


function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode)  servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		if (useProductScripts) {
			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		} else {
			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
		}
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}
/*------------------------------------------------------------------------------------------------------/
| BEGIN Event Specific Variables
/------------------------------------------------------------------------------------------------------*/
var showDebug = 1;
var showMessage = false;
var cnt = 0;
var currentUserID = "ADMIN";
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var message = "";								
var debug = "";									
var br = "<BR>";
var sysDate = aa.date.getCurrentDate();

var SetMemberArray= aa.env.getValue("SetMemberArray");
var setID = aa.env.getValue("SetID");


try {
    // set is created by user. Contains active pool license records
    for (var i=0; i < SetMemberArray.length; i++) {
        var id= SetMemberArray[i];
        capId = aa.cap.getCapID(id.getID1(), id.getID2(),id.getID3()).getOutput();
        var capIDString = capId.getCustomID();	

        areaInspector = getAssignedToRecord();
        scheduleInspectDate('Routine',dateAdd(null,90),areaInspector);
    }
}
catch (err) {
    logDebug("Exception processing set members " + err)
}
