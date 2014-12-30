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
package com.ibm.servlets;

import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ibm.Constants;
import com.ibm.Copyright;
import com.ibm.model.CalendarEntry;

public class CalendarDataServlet extends HttpServlet implements Servlet {
	// Copyright message for object code
	@SuppressWarnings("unused")
	private static final String COPYRIGHT_TEXT = Copyright.COPYRIGHT_TEXT;

	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest req, HttpServletResponse res)
			throws ServletException, IOException {

		String calDate = req.getParameter("calDate");
		String baseDate = calDate.substring(4);

		System.out.println("Current Date to Set " + baseDate);

		StringBuffer buf = new StringBuffer();

		buf.append("<table cellspacing=1 cellpadding=3>");
		buf.append("<tr><td colspan=\"2\" class=\"label2\" width=\"175px\" height=\"30px\">"
				+ calDate + "</td></tr>");

		ArrayList<CalendarEntry> calendarEntries = Constants.ETA_DB
				.getCalendarEntriesByDate(baseDate);

		if (calendarEntries.size() == 0) {
			buf.append("<tr><td colspan=\"2\" width=\"200px\" height=\"50px\" class=\"CalendarEntry\" align=\"center\">No Events Scheduled on the Selected Date</td></tr>");
		}

		for (CalendarEntry e : calendarEntries) {

			buf.append("<tr><td width=\"50px\" height=\"50px\" class=\"CalendarEntry\">"
					+ e.getStartTime()
					+ "-"
					+ e.getEndTime()
					+ "</td><td width=\"125px\" class=\"CalendarEntry\">"
					+ e.getName() + "<br>" + e.getLocation() + "</td></tr>");
		}

		buf.append("<tr><td height=\"130px\"></td><td></td></tr></table>");

		res.getWriter().write(buf.toString());

	}
}