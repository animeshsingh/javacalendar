<%-- © Copyright IBM Corporation 2010  All Rights Reserved. --%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!-- © Copyright IBM Corporation 2010  All Rights Reserved. -->
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />
<meta name="GENERATOR" content="IBM Software Development Platform" />
<meta name="DC.Rights" content="© Copyright IBM Corporation 2010  All Rights Reserved." />
<meta http-equiv="Content-Style-Type" content="text/css" />
<link href="theme/Opera.css" rel="stylesheet" type="text/css" />
<link href="theme/Opera1.css" rel="stylesheet" type="text/css" />
<title>IBM Prototype</title>
<script type="text/javascript">
var str;  
var val=null;
function handleCheck(value){
val = value;
}
function construct(){
if(val==null)
alert("Please select one schedule");
else{
str = "/ScheduleServlet?str=" + val;
window.location=str;
}
}
</script>
    </head>
    <body>
<table width="320px" cellspacing=1 >
<tr><td  width="320px" colspan="4" height="30px" class="label1"><b>Flights</b></td></tr>
<tr>
<td width="30px" height="60px" class="label2"><b></b></td>

<td>
<table  cellspacing=0>
<tr><td colspan="2" width="145px" height="30px" class="label2"><b>Departing</b></td></tr>
<tr><td width="80px" height="30px" class="label3"><b>City</b></td>
    <td width="65px" height="30px" class="label3"><b>Date/Time<br>(EST)</b></td>
</tr>
</table>
</td>
<td>
<table cellspacing=0>
<tr><td colspan="2" width="145px" height="30px" class="label2"><b>Arriving</b></td></tr>
<tr><td width="80px" height="30px" class="label3"><b>City</b></td>
    <td width="65px" height="30px" class="label3"><b>Date/Time<br>(EST)</b></td>
</tr>
</table>
</td>

</tr>
</table>
<div id="flightDetails" style="position: relative;">
<%=(String)session.getAttribute("sch") %>
</div>
<div style="width: 320px; height: 30px; position: relative;" class="label1"><table><tr>
<td width="110px"><a href="javascript:construct()" style="font-size: 8pt; text-decoration:underline; color:#f2f2f2"><b>Book Flights</b></a></td>
<td width="110px"><a href="MyCal.jsp" style="font-size: 8pt;text-decoration:underline; color:#f2f2f2"><b>My Calendar</b></a>
</td>
</tr></table>
</div> 

  </body>
</html>
