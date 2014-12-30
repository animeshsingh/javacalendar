/*****************************************************************
 * IBM Confidential
 * OCO Source Material
 * 5724-W78
 * (C) Copyright IBM Corp. 2010
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U. S. Copyright Office.
 *****************************************************************
 */
package com.ibm.model;

import java.util.ArrayList;
import java.util.List;

import com.ibm.Copyright;

public class Flight {
  //Copyright message for object code
  @SuppressWarnings("unused")
  private static final String COPYRIGHT_TEXT = Copyright.COPYRIGHT_TEXT;


  private int id;
  private String orig;
  private String dest;
  private String arrivalTime;
  private String departureTime;
  private double price;

  public double getPrice() { return price; }
  public void setPrice(double price) { this.price = price; }

  public String getArrivalTime() {
    return arrivalTime;
  }

  public void setArrivalTime(String arrivalTime) {
    this.arrivalTime = arrivalTime;
  }

  public String getDepartureTime() {
    return departureTime;
  }

  public void setDepartureTime(String departureTime) {
    this.departureTime = departureTime;
  }

  public static List<Flight> loadFights(String customQuery) {
    String[][] t = {
        {"SFO", "JFK", "8am", "10pm", "75"},
        {"JFK", "SFO", "6pm", "8am", "75"},
        {"SFO", "MIA", "7am", "11pm", "50"},
        {"MIA", "SFO", "5pm", "9am", "50"},
        {"SFO", "ATL", "7am", "11pm", "50"},
        {"ATL", "SFO", "5pm", "9am", "50"},
        {"SFO", "ORD", "7am", "11pm", "2"},
        {"ORD", "SFO", "5pm", "9am", "2"},
        {"SFO", "STL", "7am", "11pm", "40"},
        {"STL", "SFO", "5pm", "9am", "40"}

    };
    List<Flight> flights = new ArrayList<Flight>();
    for (String[] row: t) {
      String orig = row[0];
      String dest = row[1];
      String arrivalTime = row[2];
      String departureTime = row[3];
      double price = Double.valueOf(row[4]);
      Flight f = new Flight(orig, dest, arrivalTime, departureTime, price);			
      flights.add(f);
    }
    return flights;
  }

  public Flight(String orig, String dest,String arrivalTime,String departureTime, double price) {
    this.orig = orig;
    this.dest = dest;
    this.departureTime=departureTime;
    this.arrivalTime=arrivalTime;
    this.price = price;
  }

  public int getId() {
    return id;
  }

  public String getOrig() {
    return orig;
  }

  public String getDest() {
    return dest;
  }

  public void setOrig(String orig) {
    this.orig = orig;
  }

  public void setDest(String dest) {
    this.dest = dest;
  }

  public static Flight getFlightById(String key) {
    System.out.println("GETFLIGHTBYID");
    return null;
  }
  public static Flight getFlightById(int key) {
    System.out.println("GETFLIGHTBYID");
    return null;
  }

}
