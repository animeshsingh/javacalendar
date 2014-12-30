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
import java.util.List;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ibm.Copyright;
import com.ibm.model.Flight;

public class ScheduleServlet extends HttpServlet implements Servlet {
	// Copyright message for object code
	@SuppressWarnings("unused")
	private static final String COPYRIGHT_TEXT = Copyright.COPYRIGHT_TEXT;

	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest req, HttpServletResponse res)
			throws ServletException, IOException {

		List<Flight> flights = Flight.loadFights(req.getParameter("q"));

		String str = req.getParameter("str");

		if (str.equalsIgnoreCase("schedule")) {

			res.setContentType("text/plain");
			String hint = "";

			hint = "<table width=\"320px\" cellspacing=1 >";

			for (int i = 0; i < 5; i++) {
				if (i % 2 == 0)
					hint += "<tr class=\"borderTitle1\"><td width=\"30px\" height=\"60px\"><input id=\""
							+ i
							+ "\" type=\"radio\" name=\"group1\" value=\""
							+ i;
				else
					hint += "<tr><td width=\"30px\" height=\"60px\"><input id=\""
							+ i
							+ "\" type=\"radio\" name=\"group1\" value=\""
							+ i;
				hint += "\" onClick=\"handleCheck(this.value)\"/></td><td><table cellspacing=0>";

				for (int count = 0; count < 2; count++) {
					Flight f = flights.get(i * 2 + count);
					hint += "<tr><td width=\"95px\" height=\"30px\">"
							+ f.getOrig() + "</td>";
					hint += "<td width=\"50px\" height=\"30px\">"
							+ f.getDepartureTime() + "</td>";
					hint += "<td width=\"95px\" height=\"30px\">" + f.getDest()
							+ "</td>";
					hint += "<td width=\"50px\" height=\"30px\">"
							+ f.getArrivalTime() + "</td></tr>";

				}
				hint += "</table></td></tr>";
			}
			hint += "</table>";

			req.getSession().setAttribute("sch", hint);

			if (hint == "") {
				res.getWriter().write("no suggestion");
			} else {
				res.getWriter().write(hint);
			}
		} else if (str.equalsIgnoreCase("showConfirmation")) {

			int i = Integer.parseInt((String) req.getSession().getAttribute(
					"valSelected"));
			String hint = "";

			hint += "<table width=\"350px\" cellspacing=1 cellpadding=1>";

			for (int count = 0; count < 2; count++) {
				Flight f = flights.get(i * 2 + count);
				hint += "<tr class=\"borderTitle2\" >";
				hint += "<td align=\"center\" width=\"100px\" height=\"60px\">"
						+ f.getOrig() + "</td>";
				hint += "<td align=\"center\" width=\"50px\" height=\"60px\">"
						+ f.getDepartureTime() + "</td>";
				hint += "<td align=\"center\" width=\"100px\" height=\"60px\">"
						+ f.getDest() + "</td>";
				hint += "<td align=\"center\" width=\"50px\" height=\"60px\">"
						+ f.getArrivalTime() + "</td></tr>";
			}
			hint += "</tr></table>";
			req.getSession().setAttribute("details", hint);
			res.getWriter().write(hint);

		} 
		
		
		// Always include the calEntries
//		String htmlEntries = CalendarEntry.toHTMLString(DBUtils
//				.getAllCalendarEntries());
//		System.out.println(htmlEntries);
//		req.getSession().setAttribute("calEntries", htmlEntries);

		else {
			req.getSession().setAttribute("valSelected", str);
			res.sendRedirect("purchase.jsp");
		}

	}

}