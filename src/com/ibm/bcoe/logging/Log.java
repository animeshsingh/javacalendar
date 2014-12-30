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
package com.ibm.bcoe.logging;

import com.ibm.Copyright;

public class Log {
  //Copyright message for object code
  @SuppressWarnings("unused")
  private static final String COPYRIGHT_TEXT = Copyright.COPYRIGHT_TEXT;

  // TODO: use j2ee/log4j/commons logging

  public static void d(String tag, String string) {
    System.out.println("["+tag+"] " + string);
  }
  
}