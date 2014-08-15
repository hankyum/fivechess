var admin = "admin";
var time = 0;
var queryTimer = null;
var keepMsgNum = 15;
var QUERY_INTERVAL = 600;
var classChessBackground = "chessBackground";
var classChessContainer = "chessContainer";

var GridPainter = {
	allBorder : [ "Top", "Left", "Right", "Bottom" ],
	topLeftBorder : [ "Top", "Left" ],
	rightBottomBorder : [ "Right", "Bottom" ],
	columns : 20,
	rows : 20,
	cubicSize : 30,
	borderWidth : 1,
	_matchNumber : 5,
	init : function(columns, rows, cubicSize, borderWidth) {
		this.columns = columns;
		this.rows = rows;
		this.cubicSize = cubicSize;
		this.borderWidth = borderWidth;
	},
	draw : function(target, isChessContainer) {
		var isBoxMo = true;
		var rows = isChessContainer ? this.rows : this.rows + 1;
		var columns = isChessContainer ? this.columns : this.columns + 1;
		var gridWidth = isChessContainer ? (this.cubicSize + (isBoxMo ? this.borderWidth
				: 0))
				: this.cubicSize;
		var borderWidth = isChessContainer ? 0 : this.borderWidth;

		var targetWidth = columns * gridWidth
				+ (isBoxMo ? columns * borderWidth : borderWidth);
		var targetHeight = rows * gridWidth
				+ (isBoxMo ? rows * borderWidth : borderWidth);

		target.css("width", targetWidth + "px");
		target.css("height", targetHeight + "px");

		if (isChessContainer) {
			var offset = this.cubicSize / 2 + (isBoxMo ? this.borderWidth : 0);
			target.css("left", offset + "px");
			target.css("top", offset + "px");
			this.setBorder(target, this.allBorder, 0)
		} else {
			this.setBorder(target, this.topLeftBorder, this.borderWidth);
		}
		for (var i = 0; i < rows; i++) {
			var grid = null;
			for (var j = 0; j < columns; j++) {
				grid = $("<span/>");
				grid.css("width", gridWidth + "px");
				grid.css("height", gridWidth + "px");
				var tid = i + "_" + j;
				if (isChessContainer) {
					grid.attr("id", tid);
					grid.bind("click", function() {
						play($(this).attr("id"));
					});
					this.setBorder(grid, this.allBorder, 0);
				} else {
					this.setBorder(grid, this.rightBottomBorder,
							this.borderWidth);
				}
				target.append(grid);
			}
		}
		return;
	},
	setBorder : function(ele, positions, width) {
		if (width == 0) {
			ele.css("border", "none");
			return;
		}
		$.each(positions, function(i, position) {
			ele.css("border" + position + "Style", "solid");
			ele.css("border" + position + "Width", width + "px");
		})
	},
	drawChessContainer : function() {
		var chesses = $("#container span");
		if (chesses.size() == 0) {
			GridPainter.draw($("#container"), true);
		} else {
			$.each(chesses, function(i, chess) {
				$(chess).removeClass("white");
				$(chess).removeClass("black");
			});
		}
	},
	drawChessGrid : function() {
		if ($("#back span").size() == 0) {
			GridPainter.draw($("#back"), false);
		}
	},
	render : function() {
		this.drawChessContainer();
		this.drawChessGrid()
	},
	hasMatch : function(id, player) {
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
			} else {
				break;
			}
		}
		x = index.x;
		y = index.y;
		while (++x < GridPainter.columns && ++y < GridPainter.rows) {
			if (className(x, y) == player) {
				matchOne++;
			} else {
				break;
			}
		}

		x = index.x;
		y = index.y;
		while (--x >= 0 && ++y < GridPainter.rows) {
			if (className(x, y) == player) {
				matchTwo++;
			} else {
				break;
			}
		}
		x = index.x;
		y = index.y;
		while (++x < GridPainter.columns && --y >= 0) {
			if (className(x, y) == player) {
				matchTwo++;
			} else {
				break;
			}
		}

		x = index.x;
		y = index.y;
		while (++y < GridPainter.rows) {
			if (className(x, y) == player) {
				matchThree++;
			} else {
				break;
			}
		}
		x = index.x;
		y = index.y;
		while (--y >= 0) {
			if (className(x, y) == player) {
				matchThree++;
			} else {
				break;
			}
		}

		x = index.x;
		y = index.y;
		while (++x < GridPainter.columns) {
			if (className(x, y) == player) {
				matchFour++;
			} else {
				break;
			}
		}
		x = index.x;
		y = index.y;
		while (--x >= 0) {
			if (className(x, y) == player) {
				matchFour++;
			} else {
				break;
			}
		}

		if (matchOne == this._matchNumber || matchTwo == this._matchNumber
				|| matchThree == this._matchNumber
				|| matchFour == this._matchNumber) {
			return true;
		} else {
			return false;
		}
	}
}

function className(a, b) {
	return $("#" + a + "_" + b).attr("class");
}

var Session = {
	user : {},
	target : "#qijiu",
	sentReplay : false,
	refuseReplay : false,
	PlayerA : {
		role : "white"
	},
	PlayerB : {
		role : "black"
	},
	updateUser : function(u) {
		this.user = u;
		setRole(u.role);
		setPlayer(u.nextPlayer);
	},
	getRoles : function() {
		return [ this.PlayerA.role, this.PlayerB.role ];
	},
	contains : function(r) {
		return contains(this.getRoles(), r);
	},
	choosePartner : function(r) {
		if (r == this.PlayerA.role) {
			return this.PlayerB.role;
		} else if (r == this.PlayerB.role) {
			return this.PlayerA.role;
		}
	},
	switchPlayer : function() {
		if (this.user.nextPlayer == this.PlayerA.role) {
			this.user.nextPlayer = this.PlayerB.role
		} else {
			this.user.nextPlayer = this.PlayerA.role
		}
		this.updateUser(this.user);
	}
}

function getWinMessage(player) {
	var res = "";
	if (player == Session.user.role) {
		res = "You are the winner.";
	} else {
		res = player.toUpperCase() + " is the winner.";
	}
	return res;
}

function toIndex(id) {
	var ids = id.match(/\d+/g);
	return {
		x : new Number(ids[0]),
		y : new Number(ids[1])
	};
}

function setPlayer(p) {
	var playerMessage = "";
	if (!Session.contains(p)) {
		return;
	} else {
		Session.user.nextPlayer = p;
	}
	if (Session.user.role == p) {
		playerMessage = "self";
	} else {
		playerMessage = Session.user.nextPlayer;
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
	id = "#" + id;
	if ($(id).hasClass(Session.PlayerA.role)
			|| $(id).hasClass(Session.PlayerB.role))
		return false;
	if (Session.successor == null) {
		$(id).addClass(player);
	}
	if (Session.successor == null && GridPainter.hasMatch(id, player)) {
		Session.successor = player;
	}
	if (Session.successor != null) {
		alert(getWinMessage(Session.successor));
		if (!Session.contains(Session.user.role)) {
			$("input[name='reSee']").show();
		}
	}
	return true;
}

function contains(ary, value) {
	return $.inArray(value, ary) > -1;
}

function showSteps(res) {
	if (res.steps.length != 0) {
		if (Session.successor == null /* && !contains(res.replayers, role) */) {
			$.each(res.steps, function(i, step) {
				showChess(step.x + "_" + step.y, step.player);
			});
		}
	}
	if (res.steps.length == 0) {
		GridPainter.render();
	}
}

function handleReplay(res) {
	if (res.replayers.length == 1 && !sentReplay && Session.contains(role)
			&& !contains(res.replayers, role)) {
		if (!refusePlay) {
			refusePlay = !confirm(res.replayers[0].toUpperCase()
					+ " request to replay, will you replay?");
			if (!refusePlay) {
				requestReplay();
			}
		}
	}
	if (res.replayers.length == 2) {
		requestReplay();
	}
}

function handlePlayers(res) {
	if (Session.user == null) {
		var autoRole = null;
		if (Session.contains(res.role)) {
			autoRole = res.role;
		} else if (res.players.length == 0) {
			autoRole = Session.PlayerA.role;
		} else if (res.players.length == 1) {// automaticly set the role if
			// there is already one role
			// selected by some other user
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
	$("#roleInfo span").each(function() {
		if ($(this).attr("name") == Session.user.role) {
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
	if (_role != null) {
		$("#chooseRole").hide();
	}
}

function chooseRole() {
	var chooseRole = null;
	$("input[name='selectRole']").each(function() {
		if (this.checked == true) {
			chooseRole = this.value;
		}
	});
	sendChooseRole(chooseRole);
}

function getTimeStamp() {
	var d = new Date();
	return d.getTime();
}

function createMessageLi(player, time, message) {
	var msg = [];
	msg.push("<li><div class='firstLine'> ", time, " ", player.toUpperCase(),
			" said:</div><div class='secondLine'>", message, "</div></li>");
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
	if ($.trim(message).length == 0) {
		return;
	}
	showMessage("ME", createTime(), message);
	$.get("sendMessage", $.param({
		message : message
	}));
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
	for (var i = msgsSize - keepMsgNum; i > 0; i--) {
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
	if ($(targetCon.get(0).parentNode).attr("class") == 'raised')
		return;
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
		'overflow' : 'hidden',
		'float' : 'left'
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
	$("input[name='reSee']").bind("click", GridPainter.drawChessContainer());
	$("input[name='requestReplay']").bind("click", requestReplay);
	$("#playInfo span").each(function() {
		$(this).hide();
	});
	$("input[name='clearRooms']").hide();
	$("input[name='createRoom']").bind("click", createRoom);
	$(".boxcontent").each(function() {
		circleOne($(this));
	});
	if (Session.user.name == admin) {
		$("input[name='doQueryJob']").show();
		$("input[name='clearRooms']").show();
		$("input[name='clearRooms']").bind("click", clearRooms);
	}
	$("input[name='cancleQueryJob']").bind("click", {
		user : Session.user.name
	}, function(event) {
		cancleQueryJob(event.data.user)
	});
	$("input[name='doQueryJob']").bind("click", {
		user : Session.user.name
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
	if (Session.user.roomNum) {
		doQueryJob(Session.user.name);
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
	GridPainter.render();
	$("#info").width($("#back").css("width"));
	initOperations();
}