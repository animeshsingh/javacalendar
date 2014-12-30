<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!-- © Copyright IBM Corporation 2010  All Rights Reserved. -->
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />
<meta name="GENERATOR" content="IBM Software Development Platform" />
<meta http-equiv="Content-Style-Type" content="text/css" />
<meta name="DC.Rights"
	content="© Copyright IBM Corporation 2010  All Rights Reserved." />
<link href="theme/Opera.css" rel="stylesheet" type="text/css" />
<link href="theme/Opera1.css" rel="stylesheet" type="text/css" />

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@page import="com.ibm.model.CalendarEntry"%>

<title>Enterprise Travel App</title>
<script type="text/javascript" src="dojoAjax/dojo.js"></script>
<script type="text/javascript">
	dojo.require("dojo.widget.DatePicker");
	dojo.require("dojo.widget.FisheyeList");

	var xhr;

	function handleCheckEvent(str) {
		xhr = createXHR();
		xhr.onreadystatechange = processSuggestions;
		xhr.open("GET", "ScheduleServlet?str=" + str, true);
		xhr.send(null);
	}

	function processSuggestions() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var data = xhr.responseText;
				document.getElementById("flightDetails").innerHTML = data;

			} else {
				document.getElementById("flightDetails").innerHTML = "Error";
			}
		}
	}

	function loadCalendarEntries(date) {
		xhr = createXHR();
		xhr.onreadystatechange = processCalendarEntries;
		xhr.open("GET", "CalendarDataServlet?calDate=" + date, true);
		xhr.send(null);
	}

	function processCalendarEntries() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var data = xhr.responseText;
				document.getElementById("calData").innerHTML = data;

			} else {
				document.getElementById("calData").innerHTML = "Error";
			}
		}
	}

	function createXHR() {
		var xhr;
		try {
			xhr = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (E) {
				xhr = false;
			}
		}

		if (!xhr && typeof XMLHttpRequest != 'undefined') {
			xhr = new XMLHttpRequest();
		}
		return xhr;
	}

	var val = null;
	function handleCheck(value) {
		val = value;
	}
	function construct() {
		if (val == null)
			alert("Please select one schedule");
		else {
			str = "ScheduleServlet?str=" + val;
			window.location = str;
		}
	}

	function load_app(val) {
	}
	function scheduleView() {
		document.getElementById("BlankData").style.display = 'none';
		document.getElementById("mycalendar").style.display = 'none';
		document.getElementById("flight").style.display = '';
	}

	function handler(rfcDate) {
		var strDate = rfcDate.toString();

		var date = strDate.split("00:00:00");
		document.getElementById("calData").style.display = '';
		document.getElementById("BlankData").style.display = 'none';

		loadCalendarEntries(date[0]);
	}
	function calendarView() {
		document.getElementById("BlankData").style.display = '';
		document.getElementById("mycalendar").style.display = '';
		document.getElementById("flight").style.display = 'none';
		document.getElementById("calData").style.display = 'none';
		dojo.event.connect(dojo.widget.byId("foo"), "setDate", handler);
	}
</script>

</head>
<body onLoad="handleCheckEvent('schedule');calendarView();">

<table width="320px" cellspacing=1>
	<tr>
		<td><img width="50px" height="50px" src="images/1.jpg" /></td>
		<td width="160px" height="30px" class="label1"><b>My Calendar</b></td>
		<td width="160px" height="30px" class="label1 align="right">&nbsp;</td>
	</tr>
</table>


<table width="320px">
	<tr>
		<td height="330px">
		<form name="loginForm" action="MyCal.jsp" method="post">
		<table cellpadding="5px">
			<tr>
				<td class="label2">User Name:</td>
				<td class="label2"><input TYPE="text" NAME="j_username" /></td>
			</tr>
			<tr>
				<td class="label2">Password:</td>
				<td class="label2"><input TYPE="password" NAME="j_password" /></td>
			</tr>
			<tr>
				<td>&nbsp;</td>
				<td align="right"><input TYPE="submit" value="Login" /></td>
			</tr>
		</table>
		</form>

		</td>
	</tr>
</table>

<div>

<table cellspacing=0 align="left">
	<tr>
		<td width="315px" height="30px">
		<div ; style="width: 315px; height: 50px" dojoType="TitlePane"
			label="" labelNodeClass="definition" open=true>
		<div style="width: 315px; height: 50px; position: relative;"
			class="label4">

		<div class="outerbar" style="position: relative;">

		&nbsp;

		</div>

		</div>
		</div>
		</div>
		</td>
	</tr>
</table>
</div>

</body>
</html>
