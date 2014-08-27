<%--
    Document   : xx
    Created on : Dec 2, 2010, 5:51:31 PM
    Author     : hank.guo
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Hank's Tetris</title>
<link rel="STYLESHEET" type="text/css" href="../css/chess.css">
<script src="/webjars/jquery/2.1.1/jquery.min.js"></script>
<script type="text/javascript" src="../js/chess.js"></script>
<script type="text/javascript" src="../js/tetris.js"></script>
</head>
<body>
	<div id="back" class="chessBackground"></div>
	<div id="operation">
		<div>
			Score : <span id="score" class="highLight">0</span>
		</div>
		<div>Preview of tetris</div>
		<div id="preview" class="chessBackground"></div>
	</div>
</body>
</html>
