	newAppName = AInfo["Complaint Type"];
	if (AInfo["Profile Name"])
		newAppName += " - " + AInfo["Profile Name"];
	
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
		newAppName += " - " + strAddress;
	}
	editAppName(newAppName);