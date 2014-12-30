package com.ibm.model;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class CalendarEntry {
	private int id;
	private String name;
	private String location;
	private String instanceDate;
	private String startTime;
	private String endTime;

	public CalendarEntry() {

	}

	public CalendarEntry(String name, String location, String instanceDate,
			String startTime, String endTime) {
		this(-1, name, location, instanceDate, startTime, endTime);
	}

	public CalendarEntry(int id, String name, String location,
			String instanceDate, String startTime, String endTime) {
		this.id = id;
		this.name = name;
		this.location = location;
		this.instanceDate = instanceDate;
		this.startTime = startTime;
		this.endTime = endTime;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getInstanceDate() {
		return instanceDate;
	}

	public void setInstanceDate(String instanceDate) {
		this.instanceDate = instanceDate;
	}

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	public static CalendarEntry createFromResultRow(ResultSet result) {
		CalendarEntry ce = new CalendarEntry();

		try {
			ce.setId(result.getInt("instance_id"));
			ce.setName(result.getString("instance_name"));
			ce.setLocation(result.getString("location"));
			ce.setInstanceDate(result.getString("instance_date"));
			ce.setStartTime(result.getString("start_time"));
			ce.setEndTime(result.getString("end_time"));
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return ce;
	}

	public static String toHTMLString(ArrayList<CalendarEntry> entries) {
		StringBuffer buf = new StringBuffer();

		buf.append("<table>");

		buf.append("<tr><td>Id</td><td>Name</td><td>Location</td><td>Start</td><td>End</td></tr>");

		for (CalendarEntry e : entries) {
			buf.append("<tr><td>" + e.getId() + "</td><td>" + e.getName()
					+ "</td><td>" + e.getLocation() + "</td><td>"
					+ e.getStartTime() + "</td><td>" + e.getEndTime()
					+ "</td></tr>");
		}

		buf.append("</table>");

		return buf.toString();
	}

	public static ArrayList<String> loadFileLines(String filePath) {
		ArrayList<String> toReturn = new ArrayList<String>();

		try {
			BufferedReader reader = new BufferedReader(new FileReader(filePath));
			String line = null;

			while ((line = reader.readLine()) != null) {

				toReturn.add(line);
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		return toReturn;
	}

	private static ArrayList<String> locations = null;
	private static ArrayList<String> meetingTitles = null;

	public static CalendarEntry getRandomInstance() {
		if (locations == null) {
			locations = loadFileLines("cityList.txt");
		}
		if (meetingTitles == null) {
			meetingTitles = loadFileLines("meetingTitleList.txt");
		}
		
		int randTitle = (int) (Math.random() * meetingTitles.size());
		int randCity = (int) (Math.random() * locations.size());
		int randDay = (int) (Math.random() * 30) + 1;
		String randDayStr = Integer.toString(randDay);
		if(randDayStr.length() == 1){
			randDayStr = "0" + randDayStr;
		}

		int randStartTime = (int) (Math.random() * 10) + 1;

		int randEndTime = (int) (Math.random() * (11 - (randStartTime + 1)))
				+ randStartTime + 1;

		return new CalendarEntry(meetingTitles.get(randTitle), locations.get(randCity), "Mar "
				+ randDayStr + " 2011", randStartTime + "PT", randEndTime + "PT");
	}

	public String toInsertStmt() {
		return "INSERT INTO calendar (name, location, instance_date, start_time, end_time)	VALUES ('"
				+ name
				+ "', '"
				+ location
				+ "', '"
				+ instanceDate
				+ "', '"
				+ startTime + "', '" + endTime + "');";
	}
}
