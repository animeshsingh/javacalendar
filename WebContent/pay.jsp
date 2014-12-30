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
  //try {
  System.out.println("Paying...");
    PurchaseTrip.purchase(request);
    
   // if (payResponse == null) throw new RuntimeException("No PayPal pay response!");
   // pageContext.setAttribute("payResponse", payResponse);
   // pageContext.setAttribute("payKey", payResponse.getPayKey());
   // PurchaseTrip.next(payResponse, response);    
  //} catch (com.paypal.svcs.services.PPFaultMessage exn) {
   // response.sendRedirect("bookingDetails.html");
 // }
 	response.sendRedirect("bookingDetails.html");
%>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="DC.Rights" content="© Copyright IBM Corporation 2010  All Rights Reserved." />
<title>Purchase your flight</title>
</head>
<body>
  <p>PayKey is ${payKey}.</p>

</body>
</html>