package com.ibm.ldap;

public class SampleLDAP implements ETALDAP {
	
	public boolean authenticateUser(String user, String pass){
		return true;
	}
}
