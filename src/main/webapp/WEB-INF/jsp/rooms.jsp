<%-- 
    Document   : rooms
    Created on : Nov 23, 2010, 12:40:34 AM
    Author     : hguo
--%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">
<%@taglib uri="http://java.sun.com/jstl/core_rt" prefix="c"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Hank's Five in a row</title>
<link rel="STYLESHEET" type="text/css" href="../css/chess.css">
<script src="/webjars/jquery/2.1.1/jquery.min.js"></script>
<script type="text/javascript" src="../js/chess.js"></script>
<script type="text/javascript" src="../js/actions.js"></script>
</head>
<body class="_body">
	<div class="_container">
		<div class="_header">
			<h2>
				Welcome to Hank's <span class="highLight">Five In A Row</span>.
			</h2>
		</div>
		<div class="_mainContent">
			<div class="_leftZone">
				<div id="rooms" class="boxcontent">
					<p>You can start to play by choose one room and share link to your friends.</p>
					<div class="addArea">
						<textarea id="roomName"></textarea>
						<div class="buttons">
							<input name="createRoom" type="button" value="Create" onclick="createRoom();"> <input name="clearRooms" type="button" value="Clear All" onclick="clearRooms();" />
						</div>
					</div>
					<ol id="roomsList">
					</ol>
				</div>
			</div>
			<div class="_rightZone" id="playRoom">
				<jsp:include page="fiveChess.jsp" />
			</div>
		</div>
		<div class="_footer">Contact email: lakeguo@gmail.com</div>
	</div>
</body>
</html>
