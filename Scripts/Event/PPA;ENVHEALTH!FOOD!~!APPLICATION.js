//lwacht: 031018: #229: Auto Schedule Initial Inspection
try{
	if(balanceDue==0){
		 scheduleInspectDate("Initial", nextWorkDay(dateAdd(null,14)));
	}
}catch(err){
	logDebug("A JavaScript Error occurred: PPA:EnvHealth/Food/*/Application: " + err.message);
	logDebug(err.stack)
}
//lwacht: 031018: #229: end