if (wfTask == 'Case Intake' && wfStatus == 'Accepted') {
    var zone = getGISInfo("MCPHD", "EHSMQuadrantDistrict", "Quadrant");
    var assignTo = lookup('GIS - EHSM Inspector', zone);
    scheduleInspectDate('Evaluate', nextWorkDay(dateAdd(null, 0)), assignTo);
}

if (wfTask == 'Billing' && wfStatus == 'Complete Billing Letter' && balanceDue > 0) {
    activateTask('Final Processing');
    updateAppStatus('Closed/Fees Outstanding', 'Closed/Fees Outstanding');
}

if (wfTask == 'Evaluation' && wfStatus == 'Court Order Needed') {
    sendNotificationForEHSMCourtNeeded(currentUserID + "", wfComment);
}

try {
    var TRARec = getParent();
    var rcpId = capId.getCustomID();

    logDebug("Parent ID " + TRARec.getCustomID());
    var saveID = capId;
    capId = TRARec;
    var traId = capId.getCustomID();

    if (((wfTask == "Final Processing" && wfStatus == "Finaled") || (wfTask == "Evaluation" && wfStatus == "No Work Assignment") || (wfTask == 'Billing' && wfStatus == 'Complete Billing Letter') || (wfTask == 'Work Assignment' && wfStatus == 'Cleaned by Other') || (wfTask == 'Work Assignment' && wfStatus == 'Cleaned - No Bill') || (wfTask == 'Work Assignment' && wfStatus == 'Could Not Be Cleaned')) && TRARec) {
        logDebug("Trying to close RCP on TRA");
        var statusToUse = 'EHSM Cleaned';

        if (wfStatus == 'Cleaned by Other') {
            statusToUse = 'Cleaned by other';
        }

        closeTask("Request EHSM Clean", statusToUse, "Updated by Script", statusToUse);

        if (wfTask == 'Work Assignment' && wfStatus == 'Could Not Be Cleaned') {
            if (currentUserID) {
                var email = "";
        
                if (isSupervisor(currentUserID)) {
                    logDebug('User is Supervisor');
                    email = getEmailByUserID(currentUserID);
                } else {
                    logDebug('User is not Supervisor');
                    var supervisorId = HHC_getMyTeamLeadersUserID(currentUserID);
                    email = getEmailByUserID(supervisorId);
                }
        
                logDebug('Email: ' + email);
        
                if (email.indexOf("@") > 0) {
                    var myemailText = "RCP ("+rcpId+") on TRA ("+traId+") was closed with status: Could Not Be Cleaned"+br+br+"Accela's Automated Email Distribution"
					
					aa.sendMail("accela-noreply@marionhealth.org", email, "", "EHSM Clean - Not Cleaned", myemailText);
                }                        
            }
        }
        var tFeeBal = sepFeeBalance();
        var isPaid = true;
 
        if (tFeeBal > 0) {
            isPaid = false;
        }

        var ticketActive = false;
        var permanentInj = false;
        var pendingInsp = false;
        var crtCase = childGetByCapType('EnvHealth/CRT/NA/NA', capId);

        var tasks = aa.workflow.getTasks(capId).getOutput();

        for (e in tasks) {
            if (tasks[e].getTaskDescription().indexOf("Ticket") > -1 && tasks[e].getActiveFlag() == "Y") {
                ticketActive = true;
            }

            if (tasks[e].getTaskDescription().indexOf("Final Processing") > -1 && tasks[e].getDisposition() == "Permanent Injunction") {
                permanentInj = true;
            }
        }

        var inspResultObj = aa.inspection.getInspections(capId);
        if (inspResultObj.getSuccess()) {
            var inspList = inspResultObj.getOutput();
            for (xx in inspList) {
                if (inspList[xx].getInspectionStatus() == 'Scheduled') {
                    pendingInsp = true;
                }
            }
        }

        if (!ticketActive && !permanentInj && !crtCase && !pendingInsp) {
            if (isPaid) {
                closeTask("Final Processing", "Finaled", "Updated by Script", "Finaled");
                updateAppStatus('Finaled', 'Finaled');
            } else {
                closeTask("Final Processing", "Closed/Fees Outstanding", "Updated by Script", "Closed/Fees Outstanding");
                updateAppStatus('Closed/Fees Outstanding', 'Closed/Fees Outstanding');
            }
            var workflowResult = aa.workflow.getTasks(capId);

            if (workflowResult.getSuccess()) {
                wfObj = workflowResult.getOutput();

                for (i in wfObj) {
                    fTask = wfObj[i];
                    if (fTask.getActiveFlag().equals("Y")) {
                        deactivateTask(fTask.getTaskDescription());
                    }
                }
            }

        }

        logDebug('Is Full Paid: ' + isPaid);
        logDebug('Ticket Status: ' + ticketActive);
        logDebug('PI Status: ' + permanentInj);
        logDebug('CRT Case: ' + crtCase);
        logDebug('Pending Inspection: ' + pendingInsp);
    }
    capId = saveID;

} catch (err) {

}
