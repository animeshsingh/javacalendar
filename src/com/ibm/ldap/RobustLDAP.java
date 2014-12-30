package com.ibm.ldap;


public class RobustLDAP implements ETALDAP {

	private BluePagesLDAP realLDAP;
	private SampleLDAP fakeLDAP;

	public RobustLDAP() {
		realLDAP = new BluePagesLDAP();
	}

	public void initializeFake() {
		fakeLDAP = new SampleLDAP();
	}
	
	@Override
	public boolean authenticateUser(String user, String pass) {
		// Failed once so use fake
		if (fakeLDAP != null) {
			return fakeLDAP.authenticateUser(user, pass);
		}

		// No fail so use real
		boolean toReturn = false;
		try {
			toReturn = realLDAP.authenticateUser(user, pass);
		}

		catch (Exception e) {
			// Some problem occurred so use fake data
			initializeFake();
			return fakeLDAP.authenticateUser(user, pass);
		}

		return toReturn;
	}
}
