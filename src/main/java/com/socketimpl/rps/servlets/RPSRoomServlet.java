package com.socketimpl.rps.servlets;

import javax.servlet.http.HttpServletRequest;

import org.apache.catalina.websocket.StreamInbound;
import org.apache.catalina.websocket.WebSocketServlet;

public class RPSRoomServlet extends WebSocketServlet {
	
	@Override
	protected StreamInbound createWebSocketInbound(String subProtocol, HttpServletRequest request) {
		// TODO Auto-generated method stub
		
		return null;
	}
	
	
	
}
