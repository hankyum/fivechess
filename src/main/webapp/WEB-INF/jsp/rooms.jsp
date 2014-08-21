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
<title>Hank's Five in a row</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link href="/webjars/bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet" media="screen" />
<link rel="STYLESHEET" type="text/css" href="../css/chess.css">
</head>
<body>
	<div class="container-fluid">
		<div class="row">
			<h2>
				Welcome to Hank's <span class="highLight">Five In Row</span>.
			</h2>
		</div>
		<div class="row">
			<div id="rooms" class="col-md-2 panel panel-default">
				<div class="panel-heading">You can start to play by choose one room and share link to your friends</div>
				<div class="addArea panel-body">
					<input type="text" id="roomName" />
					<div class="floatRight">
						<input name="createRoom" type="button" value="Create" onclick="createRoom();"> <input name="clearRooms" type="button" value="Clear All" onclick="clearRooms();" />
					</div>
					<ul id="roomsList" class="list-group">
					</ul>
				</div>
			</div>
			<div class="col-md-2 panel panel-default">
				<div class="panel-heading">Chat Room</div>
				<div class="panel-body">
					<ul id="messages">
					</ul>
					<textarea id="messageBox" name="textMessage"></textarea>
					<div class="floatRight">
						<input type="button" name="clearMessage" value="Clear" onclick="clearMessage();" /> <input type="button" name="sendMessage" value="Send" onclick="sendMessage();" />
					</div>
				</div>
			</div>
			<div class="col-md-8 panel panel-default" ng-app="myApp">
				<div class="panel-heading" id="NgUserInfo" ng-controller="UserInfo">
					<div>
						Room number: {{user.roomNum}}
						<div id="chooseRole">
							Select Role:
							<div>
								<label for="whiteRole">White</label> <input id="whiteRole" name="selectRole" type="radio" value="white" onclick="chooseRole();" />
							</div>
							<div>
								<label for="blackRole">Black</label> <input id="blackRole" name="selectRole" type="radio" value="black" onclick="chooseRole();" />
							</div>
						</div>
					</div>
					<div>
						Your Role: <span class="highLight">{{user.role}}</span>
					</div>
					<div>Your Opponent: {{user.opponent}}</div>
					<div>
						Next Player: <span ng-if="user.role == user.nextPlayer">It is your turn to play.</span> <span ng-if="user.role != user.nextPlayer">Wait for <span class="highLight">{{user.nextPlayer}}</span> to play.
						</span>
					</div>
					<input name="doQueryJob" type="button" value="StartQueryJob" /> <input name="cancleQueryJob" type="button" value="CancleQueryJob" /> <input name="reSee" type="button" value="ReSee" /> <input name="requestReplay" type="button" value="Request Replay" />
				</div>
				<div class="panel-body">
					<div id="qiju">
						<div id="back" class="chessBackground"></div>
						<div id="container" class="chessContainer"></div>
					</div>
				</div>
			</div>
			<!-- 			<div class="col-md-10" id="playRoom"> -->
			<%-- 				<jsp:include page="fiveChess.jsp" /> --%>
			<!-- 			</div> -->
		</div>
		<div class="row">Contact email: lakeguo@gmail.com</div>
	</div>
	<script src="/webjars/jquery/2.1.1/jquery.min.js"></script>
	<script src="/webjars/bootstrap/3.2.0/js/bootstrap.min.js"></script>
	<script src="/webjars/angularjs/1.3.0-beta.15/angular.js"></script>
<!-- 	<script type="text/javascript" src="../js/chess.js"></script> -->
<!-- 	<script type="text/javascript" src="../js/actions.js"></script> -->
	<script type="text/javascript" src="../js/script.min.js"></script>
</body>
</html>
