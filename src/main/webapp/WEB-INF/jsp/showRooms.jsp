<%-- 
    Document   : showRooms
    Created on : Nov 25, 2010, 12:12:01 AM
    Author     : hguo
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<%@taglib uri="http://java.sun.com/jstl/core_rt" prefix="c"%>
<%@taglib uri="jstlFunction" prefix="fn"%>
<%@page import="com.hgame.*" %>
<%
// HTTP 1.1
        response.setHeader("Cache-Control", "max-age=0, no-cache");
// HTTP 1.0
        response.setHeader("Pragma", "no-cache");
// Prevents caching at the proxy server
        response.setDateHeader("Expires", -1);
        request.setAttribute("SESSION_ID", session.getId());
%>
<c:forEach items="${roomKeys}" var="key" varStatus="stat">
    <c:if test="${not empty key}">
        <li id="room_${key}">
            <a href="fiveChess.jsp?room=${room.key}&user=${param.user}" target="_palyContainer">${key}</a>
            <span class="buttons">
                <input type="button" value="${fn:contains(rooms[key].sessionIdString, SESSION_ID) ? 'Back' : (rooms[key].playersSize < rooms[key].rolesSize ? 'Join' : 'View')}"
                       onclick="join('${key}');"/>
                <input type="button" value="Copy" onclick="shareLink('rooms.jsp?room=${key}');"/>
            </span>
        </li>
    </c:if>
</c:forEach>
