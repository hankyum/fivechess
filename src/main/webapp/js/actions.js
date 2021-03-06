var target = "_blank";
var creatingRoom = false;
$(document).ready(function() {
	showRooms();
	_gridWidth = 30;
	_columns = 20;
	 setInterval(showRooms, 2000);
	$.getJSON("player", function(user) {
		Session.updateUser(user);
		if (user.roomNum && user.roomNum.length > 0) {
			join(user.roomNum);
		}
		initGame("#qijiu");
	});
});

var app = angular.module("myApp", []);
app.controller("UserInfo", [ "$scope", "$rootScope",
		function($scope, $rootScope) {
			$scope.msg = "great";
			$rootScope.safeApply = function(fn) {
				var phase = this.$root.$$phase;
				if (phase == '$apply' || phase == '$digest') {
					if (fn) {
						fn();
					}
				} else {
					this.$apply(fn);
				}
			};
		} ]);

function applyUser(user) {
	var scope = angular.element($("#NgUserInfo")).scope();
	scope.safeApply(function() {
		scope.user = user;
	})
}

function shareLink(text) {
	var ele = document.createElement("a");
	ele.href = text;
	if (copy2Clipboard(ele.href) == false) {
		alert("Please manuly copy.");
	}
}

function createLinkEle(room) {
	var link = document.createElement("a");
	$(link).attr("href", "?room=" + room + "&userName=${param.userName}");
	$(link).attr("target", target);
	$(link).html(room);
	return $(link);
}

function createCopyButton(room) {
	var btn = document.createElement("input");
	$(btn).attr("type", "button");
	$(btn).attr("value", "Copy");
	$(btn).bind("click", {
		url : 'rooms.jsp?room' + room
	}, function(event) {
		shareLink(event.data.url);
	});
	return $(btn);
}

function createJoinButton(room) {
	var btn = document.createElement("input");
	$(btn).attr("type", "button");
	$(btn).attr("value", "Join");
	$(btn).bind("click", {
		room : room
	}, function(event) {
		join(event.data.room);
	});
	return $(btn);
}

function createRoom() {
	if (!creatingRoom) {
		creatingRoom = true;
		var room = $.trim($("#roomName").val());
		$.getJSON("createRoom/" + room, function(data) {
			alert("xxx");
			creatingRoom = false;
			if (data.success) {
				alert("Success");
				if (Session.user.name != admin) {
					$("#roomName").hide();
					$("input[name='createRoom']").hide();
				}
				var li = $("<li class='list-group-item' id='room_" + room
						+ "'/>");
				li.append(createLinkEle(room));
				var span = $("<span/>");
				span.addClass("floatRight");
				span.append(createJoinButton(room));
				// span.append(createCopyButton(room));
				li.append(span);
				$("#roomsList").prepend(li);
			}
		});
	}
	return false;
}

function play(id) {
	if (Session.user.role == null) {
		alert("Please choose your role first!");
		return false;
	}
	if (Session.user.role == Session.user.nextPlayer
			&& showChess(id, Session.user.role)) {
		Session.switchPlayer();
		if (Session.successor == null || Session.successor == Session.user.role)
			$.getJSON("play/" + id, function(player) {
				Session.updateUser(player);
			});
	}
	return false;
}

function resetRoom() {
	$.get("reset");
	GridPainter.render();
}

function requestReplay() {
	$.getJSON("requestReplay", function(data) {
		if ($.inArray(Session.user.role, data)) {
			Session.sentReplay = true;
		}
	});
}

function sendChooseRole(chooseRole) {
	var param = {
		role : chooseRole
	}
	$.getJSON("selectRole", param, function(user) {
		Session.updateUser(user);
		console.log(user);
	});
}

function clearRooms() {
	$.get("reset", function(data) {
		$("#roomsList").html("");
	});
}

function showRooms() {
	$("#roomsList").load("/showRooms");
}

function query() {
	$.getJSON("/query/" + Session.user.roomNum, function(data) {
		setPlayer(data.nextPlayer);
		Session.user.nextPlayer = data.nextPlayer;
		Session.updateUser(Session.user);
		showSteps(data);
		if (data.steps.length == 0) {
			Session.successor = null;
		}
		if (data.playerA && Session.user.role == data.playerA.role) {
			showMessages(data.playerAMessages);
		}
		if (data.playerB && Session.user.role == data.playerB.role) {
			showMessages(data.playerBMessages);
		}
	});
}

function join(room) {
	$.getJSON("selectRoom/" + room, function(data) {
		Session.updateUser(data);
		if (queryTimer == null) {
			doQueryJob(Session.user.name);
		}
	});
}

function doQueryJob(u) {
	queryTimer = setInterval(query, QUERY_INTERVAL);
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

function copy2Clipboard(txt) {
	if (window.clipboardData) {
		window.clipboardData.clearData();
		window.clipboardData.setData("Text", txt);
	} else if (navigator.userAgent.indexOf("Opera") != -1) {
		window.location = txt;
	} else if (window.netscape) {
		try {
			netscape.security.PrivilegeManager
					.enablePrivilege("UniversalXPConnect");
		} catch (e) {
			alert("Open about:config in address bar. Set signed.applets.codebase_principal_support as ’true’");
			return false;
		}
		var clip = Components.classes['@mozilla.org/widget/clipboard;1']
				.createInstance(Components.interfaces.nsIClipboard);
		if (!clip)
			return;
		var trans = Components.classes['@mozilla.org/widget/transferable;1']
				.createInstance(Components.interfaces.nsITransferable);
		if (!trans)
			return;
		trans.addDataFlavor('text/unicode');
		var str = new Object();
		var len = new Object();
		var str = Components.classes["@mozilla.org/supports-string;1"]
				.createInstance(Components.interfaces.nsISupportsString);
		var copytext = txt;
		str.data = copytext;
		trans.setTransferData("text/unicode", str, copytext.length * 2);
		var clipid = Components.interfaces.nsIClipboard;
		if (!clip)
			return false;
		clip.setData(trans, null, clipid.kGlobalClipboard);
	}
}