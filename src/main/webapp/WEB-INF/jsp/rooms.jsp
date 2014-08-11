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
        <script type="text/javascript" src="../js/jquery-1.4.4.js"></script>
        <script type="text/javascript" src="../js/chess.js"></script>
        <script type="text/javascript">
            var target = "_blank";
            function shareLink(text){
                var ele = document.createElement("a");
                ele.href=text;
                if(copy2Clipboard(ele.href)==false){
                    alert("Please manuly copy.");
                }
            }
            
            function join(room) {
                /*$.get("fiveChess.jsp?room=" + room + "&user=${param.user}", function(page) {
                    $("#playRoom").html("");
                    $("#playRoom").html(page);
                    initGame("#qijiu");
                });*/
                var param = "room=" + room;
                var reg = /room=[^&]*/g;
                var loc = document.location + "";
                loc = loc + (loc.indexOf("?") > 0 ? "" : "?");
                loc = loc.match(reg) ? loc.replace(reg, param) : (loc + "&" + param);
                document.location = loc;
            }

            function copy2Clipboard(txt){
                if(window.clipboardData){
                    window.clipboardData.clearData();
                    window.clipboardData.setData("Text",txt);
                }
                else if(navigator.userAgent.indexOf("Opera")!=-1){
                    window.location=txt;
                }
                else if(window.netscape){
                    try{
                        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                    }
                    catch(e){
                        alert("Open about:config in address bar. Set signed.applets.codebase_principal_support as ’true’");
                        return false;
                    }
                    var clip=Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
                    if(!clip)return;
                    var trans=Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
                    if(!trans)return;
                    trans.addDataFlavor('text/unicode');
                    var str=new Object();
                    var len=new Object();
                    var str=Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
                    var copytext=txt;str.data=copytext;
                    trans.setTransferData("text/unicode",str,copytext.length*2);
                    var clipid=Components.interfaces.nsIClipboard;
                    if(!clip)return false;
                    clip.setData(trans,null,clipid.kGlobalClipboard);
                }
            }

            function createRoom() {
                var room = $.trim($("#roomName").val());
                if (room.length == 0) return;
                params.room = room;
                params.method = "createRoom";
                $.get(requestURL, params, function(data) {
                    if (parseJSON(data).success) {
                        if ('${param.user}' != admin) {
                            $("#roomName").attr("disabled", true);
                            $("input=[name='createRoom']").attr("disabled", true);
                        }
                        var li = $("<li id='room_" + room + "'/>");
                        li.append(createLinkEle(room));
                        var span = $("<span/>");
                        span.addClass("buttons");
                        span.append(createJoinButton(room));
                        span.append(createCopyButton(room));
                        li.append(span);
                        $("#roomsList").prepend(li);
                    }
                });
            }

            function createLinkEle(room) {
                var link = document.createElement("a");
                $(link).attr("href", "fiveChess.jsp?room=" + room + "&user=${param.user}");
                $(link).attr("target", target);
                $(link).html(room);
                return $(link);
            }

            function createCopyButton(room) {
                var btn = document.createElement("input");
                $(btn).attr("type", "button");
                $(btn).attr("value", "Copy");
                $(btn).bind("click", {url: 'rooms.jsp?room' + room}, function(event) {
                    shareLink(event.data.url);
                });
                return $(btn);
            }

            function createJoinButton(room) {
                var btn = document.createElement("input");
                $(btn).attr("type", "button");
                $(btn).attr("value", "Join");
                $(btn).bind("click", {room: room}, function(event) {
                    join(event.data.room);
                });
                return $(btn);
            }

            function clearRooms() {
                params.method = "reset";
                $.get(requestURL, params, function(data) {
                    $("#roomsList").html("");
                });
            }

            function showRooms() {
                /*$.get("showRooms.jsp?user=${param.user}", function(data) {
                    $.each($(data).get().reverse(), function(i, nRoom) {
                        var roomId = "#" + $(nRoom).attr("id");
                        var current = $(roomId);
                        if (current.get(0) == null) {
                            $("#roomsList").prepend($(nRoom));
                        } else {
                            $("#roomsList").remove(roomId);
                        }
                    });
                });*/
                $("#roomsList").load("showRooms.jsp?user=${param.user}");
            }

            $(document).ready(function() {
                showRooms();
                user = "${param.user}";
                _gridWidth = 30;
                _columns = 20;
                params.room = "${param.room != null ? param.room : 'default'}";
                initGame("#qijiu");
                setInterval(showRooms, 5000);
            });
        </script>
    </head>
    <body class="_body">
        <div class="_container">
            <div class="_header">
                <h2>Welcome to Hank's <span class="highLight">Five In A Row</span>.</h2>
            </div>
            <div class="_mainContent">
                <div class="_leftZone">
                    <div id="rooms" class="boxcontent">
                        <p>You can start to play by choose one room and share link to your friends.</p>
                        <div class="addArea">
                            <textarea id="roomName"></textarea>
                            <div class="buttons">
                                <input name="createRoom" type="button" value="Create" onclick="createRoom();">
                                <input name="clearRooms" type="button" value="Clear All" onclick="clearRooms();"/>
                            </div>
                        </div>
                        <ol id="roomsList">
                        </ol>
                    </div>
                </div>
                <div class="_rightZone" id="playRoom">
                    <jsp:include page="fiveChess.jsp"/>
                </div>
            </div>
            <div class="_footer">
                Contact email: lakeguo@gmail.com
            </div>
        </div>
    </body>
</html>
