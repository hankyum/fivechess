/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var admin = "admin";
var user = null;
var time = 0;
var role = null;
var successor = null;
var _matchNumber = 5;
var sentReplay = false;
var queryTimer = null;
var refusePlay = false;
var keepMsgNum = 15;
var requestURL = "../fiveChess";
var classChessBackground = "chessBackground";
var classChessContainer = "chessContainer";
var params = {
    "room":null,
    "role":role,
    "method": null,
    "playId":""
};

var GridPainter = {
    columns : 20,
    rows : 20,
    cubicSize : 30,
    borderWidth : 1,
    init : function(columns, rows, cubicSize, borderWidth) {
        this.columns = columns;
        this.rows = rows;
        this.cubicSize = cubicSize;
        this.borderWidth = borderWidth;
    },
    draw : function(target, isInner){
        var grids = [];
        var isBoxMo = $.support.boxModel;
        var rows = isInner ? this.rows : this.rows + 1;
        var columns = isInner ? this.columns : this.columns + 1;
        var gridWidth = isInner ? (this.cubicSize + (isBoxMo ? this.borderWidth : 0)) : this.cubicSize;
        var borderWidth = isInner ? 0 : this.borderWidth;
        var targetWidth = columns * gridWidth + (isBoxMo ? columns * borderWidth : borderWidth);
        var targetHeight = rows * gridWidth + (isBoxMo ? rows * borderWidth : borderWidth);

        target.css("width", targetWidth + "px");
        target.css("height", targetHeight + "px");

        if (isInner) {
            var offset = this.cubicSize / 2 + (isBoxMo ? this.borderWidth : 0);
            target.css("left", offset + "px");
            target.css("top", offset + "px");
            this.setBorder(target, ["Top", "Left", "Right", "Bottom"], 0)
        } else {
            this.setBorder(target, ["Top", "Left"], this.borderWidth);
        }
        for (var i = 0; i < rows; i++) {
            var grid = null;
            grids[i] = [];
            for (var j = 0; j < columns; j++) {
                grid = $("<span/>");
                grid.css("width", gridWidth + "px");
                grid.css("height", gridWidth + "px");
                var tid = i + "_" + j;
                if (isInner) {
                    grid.attr("id", tid);
                    grid.bind("click", {
                        playId:tid
                    }, function(event) {
                        click("#" + event.data.playId);
                    });
                    this.setBorder(grid, ["Top", "Left", "Right", "Bottom"], 0);
                } else {
                    this.setBorder(grid, ["Right", "Bottom"], this.borderWidth);
                }
                target.append(grid);
                grids[i][j] = grid;
            }
        }
        return grids;
    },
    setBorder : function (ele, positions, width) {
        if (width == 0) {
            ele.css("border", "none");
            return;
        }
        $.each(positions, function(i, position) {
            ele.css("border" + position + "Style", "solid");
            ele.css("border" + position + "Width", width + "px");
        })
    }
}

function className(a, b){
    return $("#" + a + "_" + b).attr("class");
}

var Session = {
    target: "#qijiu",
    PlayerA: {
        role: "white"
    },
    PlayerB: {
        role: "black"
    },
    player: "white",
    getRoles:function() {
        return [this.PlayerA.role, this.PlayerB.role];
    },
    contains:function(r) {
        return contains(this.getRoles(), r);
    },
    choosePartner:function(r) {
        if (r == this.PlayerA.role) {
            return this.PlayerB.role;
        } else if (r == this.PlayerB.role){
            return this.PlayerA.role;
        }
    },
    switchPlayer: function(){
        if (this.player == this.PlayerA.role) {
            this.player = this.PlayerB.role
        }
        else {
            this.player = this.PlayerA.role
        }
    }
}

function hasMatch(id, player){
    var index = toIndex(id);
    var x = index.x;
    var y = index.y;
    var matchOne = 1;
    var matchTwo = 1;
    var matchThree = 1;
    var matchFour = 1;
    while (--x >= 0 && --y >= 0) {
        if (className(x, y) == player) {
            matchOne++;
        }
        else {
            break;
        }
    }
    x = index.x;
    y = index.y;
    while (++x < GridPainter.columns && ++y < GridPainter.rows) {
        if (className(x, y) == player) {
            matchOne++;
        }
        else {
            break;
        }
    }

    x = index.x;
    y = index.y;
    while (--x >= 0 && ++y < GridPainter.rows) {
        if (className(x, y) == player) {
            matchTwo++;
        }
        else {
            break;
        }
    }
    x = index.x;
    y = index.y;
    while (++x < GridPainter.columns && --y >= 0) {
        if (className(x, y) == player) {
            matchTwo++;
        }
        else {
            break;
        }
    }

    x = index.x;
    y = index.y;
    while (++y < GridPainter.rows) {
        if (className(x, y) == player) {
            matchThree++;
        }
        else {
            break;
        }
    }
    x = index.x;
    y = index.y;
    while (--y >= 0) {
        if (className(x, y) == player) {
            matchThree++;
        }
        else {
            break;
        }
    }

    x = index.x;
    y = index.y;
    while (++x < GridPainter.columns) {
        if (className(x, y) == player) {
            matchFour++;
        }
        else {
            break;
        }
    }
    x = index.x;
    y = index.y;
    while (--x >= 0) {
        if (className(x, y) == player) {
            matchFour++;
        }
        else {
            break;
        }
    }

    if (matchOne == _matchNumber ||
        matchTwo == _matchNumber ||
        matchThree == _matchNumber ||
        matchFour == _matchNumber) {
        return true;
    } else {
        return false;
    }
}

function getWinMessage(player) {
    var res = "";
    if (player == role) {
        res = "You are the winner.";
    } else {
        res = player.toUpperCase() + " is the winner.";
    }
    return res;
}

function toIndex(id){
    var ids = id.match(/\d+/g);
    return {
        x: new Number(ids[0]),
        y: new Number(ids[1])
    };
}

function click(id){
    if (role == null) {
        alert("Please choose your role first!");
        return false;
    }
    if (role == Session.player && successor == null) {
        showChess(id, role);
        var sid =  id.replace(/#/g, "");
        params.method = "play";
        params.playId = sid
        Session.switchPlayer();
        $.get(requestURL, params, function(nextPlayer) {
            setPlayer(nextPlayer)
        });
    }
    return false;
}

function setPlayer(p){
    var playerMessage = "";
    if (Session.contains(p)) {
        Session.player = p;
    } else {
        return;
    }
    if (Session.player == role) {
        playerMessage = "self";
    } else {
        playerMessage = Session.player;
    }
    $("#playInfo span").each(function() {
        if ($(this).attr("name") == playerMessage) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

function showChess(id, player) {
    if ($(id).attr("class") == player) return;
    $(id).attr("class", player);
    $(id).unbind("click");
    if (successor == null && hasMatch(id, player)) {
        alert(getWinMessage(player));
        if (Session.contains(role)) {
            if (player == role && sentReplay == false) {
                if (confirm("Would you want to replay?")) {
                    requestReplay();
                }
            }
        } else {
            $("input[name='reSee']").show();
        }
        successor = player;
    }
}

function resetRoom() {
    params.method = "reset";
    $.get(requestURL, params);
    drawChessContainer();
}

function requestReplay() {
    sentReplay = true;
    params.method = "replay";
    $.get(requestURL, params, function(data) {
        var res = parseJSON(data);
        if (contains(res, role) || res.length == 0) {
            drawChessContainer();
        }
        if (res.length == 2) {
            requestReplay();
        }
    });
}

function contains(ary, value) {
    for (var i = 0; i < ary.length; i ++) {
        if (ary[i] == value) {
            return true;
        }
    }
    return false;
}

function parseJSON(data) {
    return eval("(" + data + ")");
}

function showSteps(res) {
    if (res.steps.length != 0) {
        if (successor == null && !contains(res.replayers, role)) {
            $.each(res.steps, function(i, step) {
                showChess("#" + step.playId, step.player);
            });
        }
    }
}

function handleReplay(res) {
    if (res.replayers.length == 1
        && !sentReplay && Session.contains(role)
        && !contains(res.replayers, role)) {
        if (!refusePlay) {
            refusePlay = !confirm(res.replayers[0].toUpperCase() + " request to replay, will you replay?");
            if(!refusePlay) {
                requestReplay();
            }
        }
    }
    if (res.replayers.length == 2) {
        requestReplay();
    }
}

function handlePlayers(res) {
    if (role == null) {
        var autoRole = null;
        if (Session.contains(res.role)) {
            autoRole = res.role;
        } else if (res.players.length == 0) {
            autoRole = Session.PlayerA.role;
        } else if (res.players.length == 1) {// automaticly set the role if there is already one role selected by some other user
            autoRole = Session.choosePartner(res.players[0]);
        } else if (res.players.length == 2) {
            autoRole = "observer";
        }
        if (Session.contains(autoRole)) {
            sendChooseRole(autoRole);
        } else {
            setRole(autoRole);
        }
    } 
}

function setRole(_role) {
    $("#chooseRole").hide();
    $("#roleInfo span").each(function() {
        if ($(this).attr("name") == _role) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
    if (!Session.contains(_role)) {
        $("input[name='requestReplay']").hide();
        $("#container div span").each(function() {
            $(this).unbind("click");
        });
    }
    role = _role;
}

function chooseRole(){
    var chooseRole = null;
    $("input[name='selectRole']").each(function() {
        if (this.checked == true) {
            chooseRole = this.value;
        }
    });
    sendChooseRole(chooseRole);
}

function sendChooseRole(chooseRole) {
    params.role = chooseRole
    params.method = "selectRole";
    $.get(requestURL, params, function(data) {
        var res = parseJSON(data);
        if (res.success) {
            setRole(res.role);
        }
        setPlayer(res.player);
    }) ;
}

function getTimeStamp() {
    var d = new Date();
    return d.getTime();
}

function QUERY() {
    params.method = "query";
    params.time = getTimeStamp();
    $.get(requestURL, params, function(json) {
        var res = parseJSON(json);
        setPlayer(res.player);
        showMessages(res.messages);
        showSteps(res);
        handleReplay(res);
        handlePlayers(res);
    });
}

function doQueryJob(u) {
    queryTimer = setInterval(QUERY, 600);
    if (u == admin) {
        $("input[name='doQueryJob']").toggle();
        $("input[name='cancleQueryJob']").toggle();
    }
}

function cancleQueryJob(u) {
    if (u == admin) {
        $("input[name='doQueryJob']").toggle();
        $("input[name='cancleQueryJob']").toggle();
    }
    clearInterval(queryTimer);
}

function drawChessContainer(){
    sentReplay = false;
    successor = null;
    var chesses = $("span", $("#container")).get();
    if (chesses.length == 0) {
        GridPainter.draw($("#container"), true);
    } else {
        $.each(chesses, function() {
            $(this).removeAttr("class");
        });
    }
}

function drawChessGrid() {
    GridPainter.draw($("#back"), false);
    var tagert = $(Session.target);
    var backgroundWidth = $("#back").css("width");
    var backgroundHeight = $("#back").css("height");
    tagert.width(backgroundWidth);
    tagert.height(backgroundHeight);
}

function createMessageLi(player, time, message) {
    var msg = [];
    msg.push("<li><div class='firstLine'> ", time, " ", player.toUpperCase(), " said:</div><div class='secondLine'>", message, "</div></li>");
    return $(msg.join(""));
}

function createTime() {
    var date = new Date();
    var res = [];
    res.push(date.getHours(), ":", date.getMinutes(), ":", date.getSeconds());
    return res.join("");
}

function sendMessage() {
    var msgEle = $(".messageInput textarea");
    var message = msgEle.val();
    if ($.trim(message).length == 0) return;
    params.method = "message";
    params.message = encodeURIComponent(message);
    showMessage("ME", createTime(), message);
    $.get(requestURL, params);
    msgEle.val("");
}

function clearMessage() {
    $(".messageInput textarea").val('');
}

function showMessage(p, time, message) {
    var msgContainer = $("#messages ul");
    msgContainer.append(createMessageLi(p, time, message));
    var msgs = $("#messages ul li");
    var msgsSize = msgs.get().length;
    for (var i = msgsSize - keepMsgNum; i > 0; i --) {
        $("#messages ul li:nth-child(" + i + ")").remove();
    }
}

function showMessages(res) {
    if (res.length > 0) {
        $.each(res, function(i, r) {
            showMessage(r.player, r.time, decodeURIComponent(r.message));
        });
    }
}

function circleOne(targetCon) {
    if ($(targetCon.get(0).parentNode).attr("class") == 'raised') return;
    var outer = $("<div class='raised'></div>");
    var beforeContent = $("<b class='b1'></b><b class='b2'></b><b class='b3'></b><b class='b4'></b>");
    var afterContent = $("<b class='b4b'></b><b class='b3b'></b><b class='b2b'></b><b class='b1b'></b>");
    circle(outer, targetCon, beforeContent, afterContent);
}

function circle(outer, tagertContent, beforeContent, afterContent) {
    outer.offset(tagertContent.offset());
    outer.css("position", tagertContent.css("position"));
    outer.css("float", tagertContent.css("float"));
    outer.width(tagertContent.css("width"));
    outer.height(tagertContent.css("height"));
    tagertContent.css("position", "static");
    tagertContent.css({
        'overflow':'hidden',
        'float':'left'
    });
    tagertContent.wrap(outer);
    beforeContent.insertBefore(tagertContent);
    afterContent.insertAfter(tagertContent);
}

function initOperations() {
    $("input[name='cancleQueryJob']").hide();
    $("input[name='doQueryJob']").hide();
    $("input[name='reSee']").hide();
    $("input[name='resetRoom']").bind("click", resetRoom);
    $("input[name='reSee']").bind("click", drawChessContainer);
    $("input[name='requestReplay']").bind("click", requestReplay);
    $("#playInfo span").each(function() {
        $(this).hide();
    });
    $("input[name='clearRooms']").hide();
    $("input=[name='createRoom']").bind("click", createRoom);
    $(".boxcontent").each(function(){
        circleOne($(this));
    });
    if (user == admin) {
        $("input[name='doQueryJob']").show();
        $("input[name='clearRooms']").show();
        $("input[name='clearRooms']").bind("click", clearRooms);
    }
    $("input[name='cancleQueryJob']").bind("click", {
        user:user
    }, function(event) {
        cancleQueryJob(event.data.user)
    });
    $("input[name='doQueryJob']").bind("click",  {
        user:user
    }, function(event) {
        doQueryJob(event.data.user);
    });
    $(document).bind("keyup", function(event) {
        if (event.ctrlKey && event.keyCode == 13) {
            sendMessage();
            return false;
        }
    });
    $(".messageInput textarea").bind("focus", function() {
        $(document).bind("keyup", autoSendMessage);
    });
    $(".messageInput textarea").bind("blur", function() {
        $(document).unbind("keyup", autoSendMessage);
    });
    if (params.room.length > 0) {
        doQueryJob(user);
    }
}

function autoSendMessage(event) {
    if (event.keyCode == 13) {
        sendMessage();
    }
    return false;
}

function initGame(target) {
    Session.target = target;
    setPlayer();
    drawChessGrid();
    drawChessContainer();
    $("#info").width($("#back").css("width"));
    initOperations();
}