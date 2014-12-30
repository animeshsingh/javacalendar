<?xml version="1.0" encoding="UTF-8" ?>
<%-- © Copyright IBM Corporation 2010  All Rights Reserved. --%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!-- © Copyright IBM Corporation 2010  All Rights Reserved. -->

<%@page import="com.ibm.model.*"%>
<%-- Note: http://publib.boulder.ibm.com/infocenter/wchelp/v6r0m0/index.jsp?topic=/com.ibm.commerce.esupport.doc/html/Migration/swg21252647.html  --%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="x" uri="http://java.sun.com/jsp/jstl/xml"%>

<%
  pageContext.setAttribute("cost", PurchaseTrip.totalPrice(request));
%>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="DC.Rights"
	content="© Copyright IBM Corporation 2010  All Rights Reserved." />
<link href="theme/Opera.css" rel="stylesheet" type="text/css" />
<link href="theme/Opera1.css" rel="stylesheet" type="text/css" />
<title>Purchase your flight</title>
<script type="text/javascript">
var db;
var preapprovals = new Array();
var preapproval = null;
 
try {
    if (window.openDatabase) {
        db = openDatabase("IBMWallet", "1.0", "IBM Wallet", 200000);
        if (!db)
            alert("Failed to open the database on disk.  This is probably because the version was bad or there is not enough space left in this domain's quota");
    } else
        db = null; //alert("Couldn't open the database.  Please try with a browser with this feature enabled");
} catch(err) { alert("error opening the database: " + err); }      

function docLoaded()
{
    
}

function Preapproval() {
  var self = this;
  return this;
}
 
addEventListener('load', docLoaded, false);

</script>
</head>
<body>
<table width="305px" position="relative" cellspacing=0>
	<tr width="305px">
		<td width="305px" colspan="4" height="30px" class="label1"><b>Please
		confirm and purchase your trip.</b></td>
	</tr>

	<tr width="305px">
		<!-- 
<td width="50px" height="30px" class="label2"><b>Flight No.</b></td>
 -->
		<td width="150px">
		<table width="150px" cellspacing=0>
			<tr>
				<td colspan="2" width="150px" height="30px" class="label2"><b>Departing</b></td>
			</tr>
			<tr>
				<td width="100px" height="30px" class="label3"><b>City</b></td>
				<td width="50px" height="30px" class="label3"><b>Time<br />
				(EST)</b></td>
			</tr>
		</table>
		</td>
		<td width="150px">
		<table width="150px" cellspacing=0>
			<tr>
				<td colspan="2" width="150px" height="30px" class="label2"><b>Arriving</b></td>
			</tr>
			<tr>
				<td width="100px" height="30px" class="label3"><b>City</b></td>
				<td width="50px" height="30px" class="label3"><b>Time<br />
				(EST)</b></td>
			</tr>
		</table>
		</td>

	</tr>
</table>
<div id="flightDetails"
	style="height: 120px; width: 305px; position: relative;">
<table width="305px" cellspacing=1 cellpadding=1>

	<%
		java.util.List<Flight> flights = Flight.loadFights(request.getParameter("q"));
					int i =Integer.parseInt((String) request.getSession().getAttribute("valSelected"));
		
			for(int count=0;count<2;count++){
				Flight f = flights.get(i*2+count);
				%>
	<tr width="305px" class="borderTitle2">
		<td align="center" width="100px" height="60px"><%= f.getOrig()  %></td>
		<td align="center" width="50px" height="60px"><%= f.getDepartureTime()  %></td>
		<td align="center" width="100px" height="60px"><%= f.getDest()  %></td>
		<td align="center" width="50px" height="60px"><%= f.getArrivalTime() %></td>
	</tr>

	<% } %>
</table>
</div>

<table>
	<tr>
		<td class="label2" width="305" height="215" align="left">
		<p>Your total cost for the trip is ${cost} USD</p>
		<form action="pay.jsp">
		<p><input type="submit"
			value="Reserve Now"
			name="submit" /></p>
		<p><input TYPE=CHECKBOX NAME="smscheck">Send SMS</input></p>
		
		<table style="border: solid;">
			<tr><td class="label2">Phone No:</td></td><td class="label2"><input TYPE=TEXTAREA NAME="sms" /></td></tr>
			<tr><td class="label2">Carrier:</td></td><td class="label2"><input type="radio" name="carrier" value="txt.att.net"> ATT</input>
			<input type="radio" name="carrier" value="vtext.com"> Verizon</input>
			<input type="radio" name="carrier" value="messaging.sprintpcs.com"> Sprint</input></td></tr>
			<p> </p>
		</table>
			</form>

		</td>
	</tr>
</table>
<div style="width: 305px; height: 30px; position: relative;"
	class="label1">
<table>
	<tr>
		<td width="150px"><a href="MyCal.jsp"
			style="font-size: 8pt; text-decoration: underline; color: #f2f2f2"><b>My
		Calendar</b></a></td>
	</tr>
</table>
</div>

</body>
</html>