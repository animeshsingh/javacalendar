package com.ibm;

import com.ibm.database.ETADB;
import com.ibm.database.RobustDB;
import com.ibm.ldap.ETALDAP;
import com.ibm.ldap.RobustLDAP;

public class Constants {
	public static ETADB ETA_DB = new RobustDB();
	public static ETALDAP ETA_LDAP = new RobustLDAP();
}
