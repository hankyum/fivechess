<%--
    Document   : fiveChess
    Created on : Nov 19, 2010, 2:25:42 AM
    Author     : hguo
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<div id="messages" class="boxcontent">
    <ul>
    </ul>
    <div class="noborder messageInput">
        <textarea name="textMessage"></textarea>
        <div class="buttons">
            <input type="button" name="clearMessage" value="Clear" onclick="clearMessage();"/>
            <input type="button" name="sendMessage" value="Send" onclick="sendMessage();"/>
        </div>
        
    </div>
</div>
<div id="chessPlayRoom">
    <div id="info" class="noborder boxcontent">
        <div class="noborder">
            <span class="noborder">
                Room number:&nbsp;<h4 class="highLight">${param.room}</h4>
            </span>&nbsp;
            <span id="chooseRole" class="noborder">
                Select Role:&nbsp;
                <label for="whiteRole">White</label>
                <input id="whiteRole" name="selectRole" type="radio" value="white" onclick="chooseRole();"/>
                &nbsp;
                <label for="whiteRole">Black</label>
                <input id="blackRole" name="selectRole" type="radio" value="black" onclick="chooseRole();"/>
            </span>
            <span id="roleInfo" class="noborder">
                <span name="observer" class="hidden">You are <p class="highLight">Observer.</p></span>
                <span name="white" class="hidden">You are <p class="highLight">White.</p></span>
                <span name="black" class="hidden">You are <p class="highLight">Black.</p></span>
            </span>&nbsp;
            <span id="playInfo" class="noborder">
                <span name="self" class="hidden">It is your turn to play.</span>
                <span name="white" class="hidden">Wait for <p class="highLight">White</p> to play.</span>
                <span name="black" class="hidden">Wait for <p class="highLight">Black</p> to play.</span>
            </span>&nbsp;
        </div>
        <div class="noborder" name="operationGroup">
            <input name="doQueryJob" type="button" value="StartQueryJob"/>
            <input name="cancleQueryJob" type="button" value="CancleQueryJob"/>
            <input name="reSee" type="button" value="ReSee"/>
            <input name="requestReplay" type="button" value="Request Replay"/>
        </div>
    </div>
    <div id="qiju">
        <div id="back" class="chessBackground"></div>
        <div id="container" class="chessContainer"></div>
    </div>
</div>

