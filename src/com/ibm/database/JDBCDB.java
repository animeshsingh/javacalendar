package com.ibm.database;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

import com.ibm.exception.ExternalCallException;
import com.ibm.model.CalendarEntry;

public class JDBCDB implements ETADB {

	@Override
	public ArrayList<CalendarEntry> getAllCalendarEntries() {

		ArrayList<CalendarEntry> entries = new ArrayList<CalendarEntry>();

		Connection conn = null;
		try {
			// JNDI
			Context aContext = new InitialContext();
			DataSource aDataSource = (DataSource) aContext
					.lookup("jdbc/mysqlCalendar");
			conn = (Connection) (aDataSource.getConnection());
			// JNDI end

			Statement stmt = conn.createStatement();
			String sSQL = "select * from calendar ORDER BY start_time";

			System.out.println("Execute Query...");
			ResultSet result = stmt.executeQuery(sSQL);

			while (result.next()) {
				entries.add(CalendarEntry.createFromResultRow(result));
			}

			if (conn != null) {
				conn.close();
				System.out.println("Successfully closed");
			}
		} catch (Exception e) {
			System.out.println(e);
			throw new ExternalCallException("error in getCalendarEntriesByDate(date)");
		}

		return entries;
	}

	@Override
	public ArrayList<CalendarEntry> getCalendarEntriesByDate(String date) {

		ArrayList<CalendarEntry> entries = new ArrayList<CalendarEntry>();

		Connection conn = null;
		try {
			// JNDI
			Context aContext = new InitialContext();
			DataSource aDataSource = (DataSource) aContext
					.lookup("jdbc/mysqlCalendar");
			conn = (Connection) (aDataSource.getConnection());
			// JNDI end

			Statement stmt = conn.createStatement();
			String sSQL = "select * from calendar WHERE instance_date = '"
					+ date + "'  ORDER BY start_time";

			System.out.println("Execute Query...");
			ResultSet result = stmt.executeQuery(sSQL);

			while (result.next()) {
				entries.add(CalendarEntry.createFromResultRow(result));
			}

			if (conn != null) {
				conn.close();
				System.out.println("Successfully closed");
			}
		} catch (Exception e) {
			System.out.println(e);
			throw new ExternalCallException("error in getCalendarEntriesByDate(date)");
		}
		
		return entries;
	}

//	public void insertCalEntry() {
//		String insertQuery = "INSERT INTO calendar (name, location, ,start_time, end_time)	VALUES ('?', '?', '?', ''?', '?');";
//	}
	
	public static void createCalendarInserts(){
		for(int i = 0 ; i < 100; i++){
			System.out.println(CalendarEntry.getRandomInstance().toInsertStmt());
		}	
	}
	
	public static void main(String[] args) {
		createCalendarInserts();
	}
}
