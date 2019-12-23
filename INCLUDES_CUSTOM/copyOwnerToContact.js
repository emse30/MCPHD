 
function copyOwnerToContact(cType, cRelation, itemCap) {
	
	//get owner from current cap
	var OwnersResult = aa.owner.getOwnerByCapId(capId);
	if (OwnersResult.getSuccess()) {
		Owners = OwnersResult.getOutput();
		for (var oIndex in Owners) {
			thisOwner = Owners[oIndex];

			var newPeopleModel = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.PeopleModel").getOutput();
			newPeopleModel.setServiceProviderCode(aa.getServiceProviderCode());
			newPeopleModel.setAuditID("ADMIN");
		
			var newCapContactModel = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.CapContactModel").getOutput();
			newCapContactModel.setCapID(itemCap);
			newPeopleModel.setContactType(cType);
			newCapContactModel.setContactType(cType);
			newPeopleModel.setRelation(cRelation);
			newCapContactModel.setRelation(cRelation);
			newPeopleModel.setFlag("Y");
			newCapContactModel.setPrimaryFlag("Y");

			newPeopleModel.setFullName(thisOwner.getOwnerFullName());
			newCapContactModel.setFullName(thisOwner.getOwnerFullName());

			var cAddress = newPeopleModel.getCompactAddress();
			cAddress.setAddressId(null);
			cAddress.setAddressLine1(thisOwner.getMailAddress1());
			cAddress.setAddressLine2(thisOwner.getMailAddress2());;
			cAddress.setCity(thisOwner.getMailCity());
			cAddress.setCountry(thisOwner.getCountry());
			cAddress.setState(thisOwner.getMailState());
			cAddress.setZip(thisOwner.getMailZip());
			newPeopleModel.setCompactAddress(cAddress);
			newCapContactModel.setCompactAddress(cAddress);

			newPeopleModel.setPhone1(thisOwner.getPhone());
			newCapContactModel.setPhone1(thisOwner.getPhone());

			newPeopleModel.setEmail(thisOwner.getEmail());
			newCapContactModel.setEmail(thisOwner.getEmail());

			newCapContactModel.setPeople(newPeopleModel)
			createResult = aa.people.createCapContactWithAttribute(newCapContactModel);
			if (createResult.getSuccess()) 
				logDebug("Succesfully created contact");
			else
				logDebug("Error creating contact " + createResult.getErrorMessage());
		}
	}
}
 