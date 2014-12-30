package com.ibm.database;

import java.util.ArrayList;

import com.ibm.model.CalendarEntry;

public class RobustDB implements ETADB {

	private JDBCDB realDB;
	private SampleDB fakeDB;

	public RobustDB() {
		realDB = new JDBCDB();
	}

	public void initializeFake() {
		fakeDB = new SampleDB();
	}

	@Override
	public ArrayList<CalendarEntry> getAllCalendarEntries() {
		// Failed once so use fake
		if (fakeDB != null) {
			return fakeDB.getAllCalendarEntries();
		}

		// No fail so use real
		ArrayList<CalendarEntry> toReturn = null;
		try {
			toReturn = realDB.getAllCalendarEntries();
		}

		catch (Exception e) {
			// Some problem occurred so use fake data
			initializeFake();
			return fakeDB.getAllCalendarEntries();
		}

		return toReturn;
	}

	@Override
	public ArrayList<CalendarEntry> getCalendarEntriesByDate(String date) {
		// Failed once so use fake
		if (fakeDB != null) {
			return fakeDB.getCalendarEntriesByDate(date);
		}

		// No fail so use real
		ArrayList<CalendarEntry> toReturn = null;
		try {
			toReturn = realDB.getCalendarEntriesByDate(date);
		}

		catch (Exception e) {
			// Some problem occurred so use fake data
			initializeFake();
			return fakeDB.getCalendarEntriesByDate(date);
		}

		return toReturn;
	}

}
