//lwacht: 190318: require at least one field in the pool status table
try{
	if (GuidesheetModel && "POOL TEST RESULTS"== GuidesheetModel.getGuideType().toUpperCase()) {
		var hasPoolStatus = false;
		var guidesheetItem = GuidesheetModel.getItems();
		for(var j=0;j< guidesheetItem.size();j++) {
			var item = guidesheetItem.get(j);
			var guideItemASITs = item.getItemASITableSubgroupList();
			if (guideItemASITs!=null){
				for(var jj = 0; jj < guideItemASITs.size(); jj++){
					var guideItemASIT = guideItemASITs.get(jj);
					if(guideItemASIT && "POOL STATUS" == guideItemASIT.getTableName().toUpperCase()){
						var tableArr = new Array();
						var columnList = guideItemASIT.getColumnList();
						for (var k = 0; k < columnList.size() ; k++ ){
							var column = columnList.get(k);
							var values = column.getValueMap().values();
							var iteValues = values.iterator();
							if(iteValues.hasNext()){
								hasPoolStatus = true;
							}
						}
					}
				}
			}
		}
		if(!hasPoolStatus){
			cancel=true;
			showMessage=true;
			comment("At least one row needs to be populated in the Pool Status table.");
		}
	}
}catch(err){
	logDebug("A JavaScript Error occurred: GSUB:EnvHealth/WQ/Pool/License: " + err.message);
	logDebug(err.stack)
}
//lwacht: 190318: end
