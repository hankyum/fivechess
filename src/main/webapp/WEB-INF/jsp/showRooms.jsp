<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page isELIgnored="false"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<%@taglib uri="http://java.sun.com/jstl/core_rt" prefix="c"%>
<%@taglib uri="/WEB-INF/fn.tld" prefix="fn"%>
<%@page import="demo.*"%>
<%
	// HTTP 1.1
	response.setHeader("Cache-Control", "max-age=0, no-cache");
	// HTTP 1.0
	response.setHeader("Pragma", "no-cache");
	// Prevents caching at the proxy server
	response.setDateHeader("Expires", -1);
%>
<c:forEach items="${roomKeys}" var="key" varStatus="stat">
	<c:if test="${not empty key}">
		<li id="room_${key}">
			<a href="?roomNum=${user.roomNum}" target="_palyContainer">${key}</a>
			<div class="buttons">
				<input type="button" value="Join" onclick="join('${key}');" /> <input type="button" value="Copy" onclick="shareLink('?roomNum=${key}');" />
			</div>
		</li>
	</c:if>
</c:forEach>
