/*****************************************************************
 * IBM Confidential
 * OCO Source Material
 * 5724-W78
 * (C) Copyright IBM Corp. 2010
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U. S. Copyright Office.
 *****************************************************************
 */
package com.ibm.model;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.ibm.Copyright;
import com.ibm.mail.SMSUtils;

public class PurchaseTrip {
	// Copyright message for object code
	@SuppressWarnings("unused")
	private static final String COPYRIGHT_TEXT = Copyright.COPYRIGHT_TEXT;

	static final boolean SOAP = false;
	static final boolean usePreapproval = true;

	public static double totalPrice(HttpServletRequest req) {
		List<Flight> flights = Flight.loadFights(null);
		double total = 0.0;

		int i = Integer.parseInt((String) req.getSession().getAttribute(
				"valSelected"));
		for (int count = 0; count < 2; count++) {
			Flight f = flights.get(i * 2 + count);
			total += f.getPrice();
		}
		return total;
	}

	static String relative(HttpServletRequest req, String path) {
		String ctx = req.getContextPath();
		return req.getScheme() + "://" + req.getServerName() + ":"
				+ req.getServerPort()
				+ (ctx == null || ctx.isEmpty() ? "/" : ctx) + path;
	}

	public static void purchase(HttpServletRequest req) {
		String smsCheck = req.getParameter("smscheck");
		String smsNumber = req.getParameter("sms");
		String carrier = req.getParameter("carrier");
		
		System.out.println("In purchase method '" + smsCheck + "' '" + smsNumber + "' '" + carrier + "'");

		if (smsCheck != null && smsCheck.equals("on")) {
			try {
				SMSUtils.sendSMS(smsNumber, carrier,
						"You just booked a flight!");
				System.out.println("SMS attempted");
			} catch (Exception e) {
				System.out.println("SMS attempted, exception: ");
				System.out.println(e);
			}
		}
		return;
	}

	static final String TAG = "PurchaseTrip";

}