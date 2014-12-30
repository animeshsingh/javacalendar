package com.ibm.mail;

public class SMSUtils {
	public static void sendSMS(String number, String  carrierHost, String message) {
		MailUtils.sendEmail(message, "", number +"@"+ carrierHost);
	}
}
