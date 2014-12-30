package com.ibm.mail;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

public class MailUtils {

	public static void sendEmail(String name, String email, String messageBody,
			String subject, String destinationAddress) {
		System.out.println("Entering MailServlet");

		// extract parameters from HttpServletRequest object
		// String name = "Jason Anderson";
		// String email = "anderslj@us.ibm.com";
		// String messageBody = "This is a message " + (new Date()).getTime();
		// String subject = "Mail from MailServlet";
		// String destinationAddress = "whitestpdropper9@hotmail.com";
		try {
			// look up MailSession
			Context context = new InitialContext();
			Session mailSession = (Session) context.lookup("mail/ibmMail");
			Message msg = new MimeMessage(mailSession);
			msg.setFrom(new InternetAddress(email));
			msg.setRecipients(Message.RecipientType.TO,
					InternetAddress.parse(destinationAddress));
			// Set the subject and body text
			msg.setSubject(subject);
			msg.setText(messageBody);
			// send message
			Transport.send(msg);
			System.out.println("Message Sent");
			// javax.servlet.RequestDispatcher dispatcher = getServletContext()
			// .getRequestDispatcher("/sent.jsp");
			// dispatcher.forward(request, response);
		} catch (NamingException e) {
			e.printStackTrace();
			// javax.servlet.RequestDispatcher dispatcher = getServletContext()
			// .getRequestDispatcher("/error.jsp");
			// dispatcher.forward(request, response);
		} catch (MessagingException e) {
			e.printStackTrace();
			// javax.servlet.RequestDispatcher dispatcher = getServletContext()
			// .getRequestDispatcher("/error.jsp");
			// dispatcher.forward(request, response);
		}
		System.out.println("Exiting MailServlet");

	}

	public static void sendEmail(String messageBody,
			String subject, String destinationAddress) {
		sendEmail("Enterprise Travel App", "notifier@eta.com",messageBody,subject,destinationAddress);

	}
}
