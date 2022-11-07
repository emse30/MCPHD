if ((appMatch("EnvHealth/WQ/Pump/NA") || appMatch("EnvHealth/WQ/Well/NA")) && (wfTask == 'Intake' && wfStatus == 'Accepted')) {
    newAppName = "";
    if (AInfo["Profile Name"]) {
        newAppName += AInfo["Profile Name"];
    }
    
    var capAddrResult = aa.address.getAddressByCapId(capId);
    var addressToUse = null;
    var strAddress = "";
        
    if (capAddrResult.getSuccess()) {
        var addresses = capAddrResult.getOutput();
        if (addresses) {
            for (zz in addresses) {
                    capAddress = addresses[zz];
                if (capAddress.getPrimaryFlag() && capAddress.getPrimaryFlag().equals("Y")) 
                    addressToUse = capAddress;
            }
            if (addressToUse == null)
                addressToUse = addresses[0];

            if (addressToUse) {
                strAddress = addressToUse.getHouseNumberStart();				
                var addPart = addressToUse.getStreetName();
                if (addPart && addPart != "") 
                    strAddress += " " + addPart;	
                var addPart = addressToUse.getStreetSuffix();
                if (addPart && addPart != "") 
                    strAddress += " " + addPart;					
            }
        }
    }
    if (strAddress != "") {
        if (newAppName != "")
            newAppName += " - " + strAddress;
        else
            newAppName = strAddress
    }
    
    editAppName(newAppName);
}

if (appMatch("EnvHealth/WQ/Well/NA") && wfTask == 'Final Permit Creation' && wfStatus == 'Issued') {
inspCancelAll();
}
if (appMatch("EnvHealth/WQ/OWTS/NA") && wfTask == 'Inspection' && wfStatus == 'Approved') {
if (getAppSpecific("Operator Permit") == 'CHECKED') {
    deactivateTask('Final Permit Issuance');
    closeTask('Permit Closed', 'Closed', 'Closed by Script', 'Closed');
}
}
if (appMatch("EnvHealth/WQ/OWTS/NA") && wfTask == 'Site Survey' && wfStatus == 'Complete') {
var supportStaff = hhcgetUserByDiscipline('WQPumpWellOWTSSupp'); // changed the discipline so this task gets assigned to Debra White - TASK0380741
updateTask('Application Intake','Pending','Updated by script');
assignTask('Application Intake', supportStaff);
}
if (appMatch("EnvHealth/WQ/OWTS/NA") && wfTask == 'Plan Review' && wfStatus == 'Accepted') {
var supportStaff = hhcgetUserByDiscipline('WQBodyArtChildCareSupp');
updateTask('Permit Issuance','Pending','Updated by script');
assignTask('Permit Issuance', supportStaff);
}
if (appMatch("EnvHealth/WQ/OWTS/NA") && wfTask == 'Inspection' && wfStatus == 'Approved') {
var supportStaff = hhcgetUserByDiscipline('WQPoolsSupv');
updateTask('Final Permit Issuance','Pending','Updated by script');
assignTask('Final Permit Issuance', supportStaff);
}
if (appMatch("EnvHealth/WQ/Well/NA") && wfTask == 'Site Survey' && wfStatus == 'Approved') {
    var supportStaff = hhcgetUserByDiscipline('WQBodyArtChildCareSupp');
    assignTask('Permit Issuance', supportStaff);
}
if (appMatch("EnvHealth/WQ/Pump/NA") && wfTask == 'Application Review' && wfStatus == 'Approved') {
    var supportStaff = hhcgetUserByDiscipline('WQBodyArtChildCareSupp');
    assignTask('Permit Issuance', supportStaff);
}
if ((appMatch("EnvHealth/WQ/Well/NA")) && wfTask == 'Inspection' && wfStatus == 'Approved') {
    var supportStaff = hhcgetUserByDiscipline('WQPoolsSupv');
    assignTask('Final Permit Creation', supportStaff);
}
if ((appMatch("EnvHealth/WQ/Pump/NA")) && wfTask == 'Water Sample Inspection' && wfStatus == 'Approved') {
    var supportStaff = hhcgetUserByDiscipline('WQPoolsSupv');
    assignTask('Closed', supportStaff);
}
if (appTypeString == "EnvHealth/WQ/File Search/NA" && wfTask == 'File Review' && matches(wfStatus,'Complete - Info Found', 'Complete - No Info Found')){
		var supportStaff = hhcgetUserByDiscipline('WQFileSearch');  //Assigns the Workflow task "Case Closed" to WQFileSearch user discipline - TASK0383584
		assignTask('Case Closed', supportStaff);		
	}
