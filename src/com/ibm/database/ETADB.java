package com.ibm.database;

import java.util.ArrayList;

import com.ibm.model.CalendarEntry;

public interface ETADB {
	public ArrayList<CalendarEntry> getAllCalendarEntries();
	public ArrayList<CalendarEntry> getCalendarEntriesByDate(String date);
}
