package com.socketimpl.beans;

public class User {

	private String displayName;
	
	private String fullName;
	private String emailId;
	
	
	/* Constructors */
	
	public User(String displayName, String fullName, String emailId) {
		super();
		this.displayName = displayName;
		this.fullName = fullName;
		this.emailId = emailId;
	}
	
	
	
	/* Getters and Setters */

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

}
