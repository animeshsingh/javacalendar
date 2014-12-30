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

<%@page import="com.ibm.model.CalendarEntry"%>

<title>IBM AT&T Prototype</title>
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

<div id="calendar" style="position: relative;">

<div id="mycalendar" style="position: relative;">
<table width="320px" cellspacing=1>
	<tr>
		<td><img width="50px" height="50px" src="images/1.jpg" /></td>
		<td width="160px" height="30px" class="label1"><b>My Calendar</b></td>
		<td width="160px" height="30px" class="label1 align="right"><a
			href="login.jsp"
			style="font-size: 8pt; text-decoration: underline; color: #f2f2f2"><b>Logout</b></a></td>
	</tr>
</table>

<table width="320px" cellpadding=0 cellspacing=1>
	<tr>
		<td class="TitleBar" valign="top" width="145px" height="330px">
		<table cellspacing=1>
			<tr>
				<td valign="top">
				<div style="width: 145px;" dojoType="datepicker" widgetId="foo"></div>
				</td>
			</tr>
			<tr>
				<td height="10px"></td>
			</tr>
			<!-- 
    <tr><td height="20px"> <a href="map.html" style="font-size: 8pt; text-decoration:underline; color:#f2f2f2"><b>Map View</b></a>
     </td></tr> -->
			<tr>
				<td height="20px"><a href="javascript: scheduleView();"
					style="font-size: 8pt; text-decoration: underline; color: #f2f2f2"><b>Schedule
				Flights</b></a></td>
			</tr>
			<tr>
				<td height="120px"></td>
			</tr>
		</table>
		</td>

		<td height="330px" valign="top" class="borderTable">
		<div id="BlankData" style="height: 30px;"><b><br />
		<br />
		<font color="red" />&nbsp;&nbsp;&nbsp;&nbsp;WELCOME KIM !</b> <br />
		<br />
		<br />
		<b><font color="blue" />Please click on a date to see your
		schedule. </div>

		<div id="calData" style="position: relative;"></div>
		</td>
	</tr>
</table>

<table cellspacing=0>
	<tr>
		<td width="315px" height="30px">
		<div ; style="width: 315px; height: 50px" dojoType="TitlePane"
			label="Other Calendars" labelNodeClass="definition" open=true>
		<div style="width: 315px; height: 50px; position: relative;"
			class="label4">

		<div class="outerbar" style="position: relative;">

		<div dojoType="FisheyeList" itemWidth="50" itemHeight="50"
			itemMaxWidth="150" itemMaxHeight="150" orientation="horizontal"
			effectUnits="2" itemPadding="10" attachEdge="top" labelEdge="bottom"
			enableCrappySvgSupport="false">

		<div dojoType="FisheyeListItem" onClick="load_app(1);"
			iconsrc="images/4.jpg" caption="Alice Grayson"></div>

		<div dojoType="FisheyeListItem" onClick="load_app(2);"
			iconsrc="images/2.jpg" caption="John Daniels"></div>

		<div dojoType="FisheyeListItem" onClick="load_app(3);"
			iconsrc="images/0.jpg" caption="Julia Gore"></div>

		<div dojoType="FisheyeListItem" onClick="load_app(4);"
			iconsrc="images/3.jpg" caption="Jack Walker"></div>

		<div dojoType="FisheyeListItem" onClick="load_app(5);"
			iconsrc="images/6.jpg" caption="Anna Dean"></div>

		<div dojoType="FisheyeListItem" onClick="load_app(6);"
			iconsrc="images/5.jpg" caption="Jane Kennedy"></div>



		</div>

		</div>

		</div>
		</div>
		</td>
	</tr>
</table>
</div>
<div id="flight" style="position: relative;">

<div style="width: 314px; height: 30px; position: relative;"
	class="label1">
<table>
	<tr>
		<td width="157px" colspan="2" height="30px"><b>Flights</b></td>
		<td width="157px" colspan="2" align="right"><a href="MyCal.jsp"
			style="font-size: 8pt; text-decoration: underline; color: #f2f2f2"><b>My
		Calendar</b></a></td>
	</tr>
</table>
</div>

<table width="320px" cellspacing=0>
	<tr>
		<td width="30px" height="60px" class="label2"><b></b></td>

		<td>
		<table cellspacing=0>
			<tr>
				<td colspan="2" width="145px" height="30px" class="label2"><b>Departing</b></td>
			</tr>
			<tr>
				<td width="95px" height="30px" class="label3"><b>City</b></td>
				<td width="50px" height="30px" class="label3"><b>Time<br>(EST)
				
				</b></td>
			</tr>
		</table>
		</td>
		<td>
		<table cellspacing=0>
			<tr>
				<td colspan="2" width="145px" height="30px" class="label2"><b>Arriving</b></td>
			</tr>
			<tr>
				<td width="95px" height="30px" class="label3"><b>City</b></td>
				<td width="50px" height="30px" class="label3"><b>Time<br>(EST)
				
				</b></td>
			</tr>
		</table>
		</td>

	</tr>
</table>

<div id="flightDetails" style="position: relative; height: 320px">
<b><br><br><font color="red" />&nbsp;&nbsp;&nbsp;&nbsp;Loading
Your Flights..... 
</b></div>
<div style="width: 316px; height: 25px" class="label1">
<table>
	<tr>
		<td width="316px" align="center" valign="center">
		<button dojoType="button" onclick="construct();"><b>Book
		Flights</b></button>
		</td>
	</tr>
</table>
</div>
</div>
<div></div>
</body>
</html>
