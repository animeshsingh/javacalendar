package com.ibm.exception;

public class ExternalCallException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public ExternalCallException(String message){
		super(message);
	}
}
