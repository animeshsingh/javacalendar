package com.ibm.database;

import java.util.ArrayList;

import com.ibm.model.CalendarEntry;

public class SampleDB implements ETADB {

	@Override
	public ArrayList<CalendarEntry> getAllCalendarEntries() {
		return getFakeCalendarEvents(null);
	}

	@Override
	public ArrayList<CalendarEntry> getCalendarEntriesByDate(String date) {
		return getFakeCalendarEvents(date);
	}
	
	private static ArrayList<CalendarEntry> getFakeCalendarEvents(String date){
		ArrayList<CalendarEntry> toReturn = new ArrayList<CalendarEntry>();
		
		String dateToUse = "Mar 15 2011";
		if(date != null){
			dateToUse = date;
		}
		
		toReturn.add(new CalendarEntry("WPC Meeting", "Chesapeake, VA", dateToUse, "10AM", "11AM"));
		toReturn.add(new CalendarEntry("Tucson, AZ", "San Jose, CA", dateToUse, "1PT", "3PT"));
		toReturn.add(new CalendarEntry("Corporate Dinner", "Tucson, AZ", dateToUse, "7PT", "10PT"));
		
		return toReturn;
	}

}
