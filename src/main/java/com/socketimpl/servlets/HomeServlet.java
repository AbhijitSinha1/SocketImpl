package com.socketimpl.servlets;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet(name = "homeServlet", displayName="HomeServlet", urlPatterns= "/home")
public class HomeServlet extends HttpServlet {
	
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)	throws ServletException, IOException {
		System.out.println("HelloWorld");
		
		HttpSession session= request.getSession(true);
		session.setAttribute("name", "Milli");
		
	    String url="/pages/home.jsp"; 
		ServletContext context = getServletContext();
		RequestDispatcher dispatcher = context.getRequestDispatcher("/pages/home.jsp");
		dispatcher.include(request, response);
	}
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		this.doGet(request, response);
	}

}
