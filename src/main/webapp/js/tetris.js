var Key = {
	LEFT : 37,
	UP : 38,
	RIGHT : 39,
	DOWN : 40,
	ENTER : 13
}

function range(i, j) {
	var res = r();
	function r() {
		return parseInt(Math.random() * j * 10);
	}
	;
	while (!(res >= i && res <= j)) {
		res = r();
	}
	return res;
}

GridPainter.isBoxMode = true;
var styles = [ "cubicStyleBlue", "cubicStylePurple", "cubicStyleYellow",
		"cubicStylePink", "cubicStyleGreen" ];
var TurnTool = {
	corners : [ "ONE", "TWO", "THREE", "FOUR" ],
	realtives : [ "LEFT", "TOP", "RIGHT", "BOTTOM" ],
	
	ONE : function(ary) {
		return ary[0][0];
	},
	
	TWO : function(ary) {
		return ary[0][this.getColmns(ary) - 1];
	},
	
	THREE : function(ary) {
		return ary[this.getRows(ary) - 1][this.getColmns(ary) - 1];
	},
	
	FOUR : function(ary) {
		return ary[this.getRows(ary) - 1][0];
	},
	
	LEFT : function(ary, cubic) {
		var post = this.find(ary, cubic);
		return ary[post.x][post.y - 1];
	},
	
	TOP : function(ary, cubic) {
		var post = this.find(ary, cubic);
		return ary[post.x - 1][post.y];
	},
	
	RIGHT : function(ary, cubic) {
		var post = this.find(ary, cubic);
		return ary[post.x][post.y + 1];
	},
	
	BOTTOM : function(ary, cubic) {
		var post = this.find(ary, cubic);
		return ary[post.x + 1][post.y];
	},
	
	getRows : function(ary) {
		return ary.length;
	},
	
	getColmns : function(ary) {
		return ary[0].length;
	},
	
	find : function(ary, ele) {
		var post = {
			x : -1,
			y : -1
		};
		for ( var i in ary) {
			for ( var j in ary[i]) {
				if (ele.y == ary[i][j].y && ele.x == ary[i][j].x) {
					post.x = parseInt(i);
					post.y = parseInt(j);
				}
			}
		}
		return post;
	},
	
	turn : function(ary) {
		var res = [];
		for ( var i in ary) {
			res[i] = this.getNext(ary[i]);
		}
		return res;
	},
	
	getNext : function(corner) {
		var index = -1;
		for ( var i in this.corners) {
			if (corner == this.corners[i]) {
				index = i;
				break;
			}
		}
		index = parseInt(index);
		if (index >= 0) {
			index = index + 1;
			index = (index < this.corners.length) ? index : index
					- this.corners.length;
			return this.corners[index];
		} else {
			for ( var i in this.realtives) {
				if (corner == this.realtives[i]) {
					index = i;
					break;
				}
			}
			index = parseInt(index);
			if (index >= 0) {
				index = index + 1;
				index = (index < this.realtives.length) ? index : index
						- this.realtives.length;
				return this.realtives[index];
			}
		}
		return null;
	}
}

function Cubic(x, y) {
	this.context = [];
	this.style = null;
	this.xLimit = 0;
	this.yLimit = 0;
	this.x = x;
	this.y = y;
	this.disabled = false;

	if (arguments.length == 3 && arguments[2]) {
		this.disabled = true;
	}

	this.isValid = function() {
		return this.x >= 0 && this.x < this.getXLimit() && this.y >= 0
				&& this.y < this.getYLimit();
	}

	this.getCubic = function() {
		var x = this.x;
		var y = this.y;
		if (arguments.length == 2) {
			x = arguments[0];
			y = arguments[1];
		}
		if (this.context && this.context[x] != null) {
			return this.context[x][y];
		}
	}

	this.isRenderable = function() {
		var x = this.x;
		var y = this.y;
		if (arguments.length == 2) {
			x = arguments[0];
			y = arguments[1];
		}
		// return this.getCubic(x, y) == null
		// || !this.getCubic(x, y).hasClass(this.style);
		return this.getCubic(x, y) != null
				&& this.getCubic(x, y).prop("class").indexOf("cubicStyle") < 0;
		;
	}

	this.isRendered = function() {
		var x = this.x;
		var y = this.y;
		if (arguments.length == 2) {
			x = arguments[0];
			y = arguments[1];
		}
		// return true;//this.getCubic(x, y) != null
		// && this.getCubic(x, y).hasClass(this.style);
		return this.getCubic(x, y) != null
				&& this.getCubic(x, y).prop("class").indexOf("cubicStyle") >= 0;
	}

	this.clear = function() {
		var cub = this.getCubic(this.x, this.y);
		if (cub != null) {
			console.log("Clear style" + this.style);
			cub.removeClass(this.style);
		}
	}

	this.render = function() {
		if (this.disabled)
			return;
		var cub = this.getCubic(this.x, this.y);
		if (cub != null) {
			cub.addClass(this.style);
		}
	}

	this.setStyle = function(style) {
		this.style = style;
	}

	this.getStyle = function() {
		return this.style;
	}

	this.left = function() {
		if (this.y - 1 >= 0) {
			this.y = this.y - 1;
			return true;
		}
		return false;
	}

	this.right = function() {
		if (this.y + 1 <= this.getYLimit()) {
			this.y = this.y + 1;
			return true;
		}
		return false;
	}

	this.down = function() {
		if (this.x + 1 <= this.getXLimit()) {
			this.x = this.x + 1;
			return true;
		}
		return false;
	}

	this.leftAble = function() {
		if (this.y - 1 >= 0) {
			return this.isRenderable(this.x, this.y - 1);
		}
		return false;
	}

	this.rightAble = function() {
		if (this.y + 1 <= this.getYLimit()) {
			return this.isRenderable(this.x, this.y + 1);
		}
		return false;
	}

	this.downAble = function() {
		if (this.x + 1 <= this.getXLimit()) {
			return this.isRenderable(this.x + 1, this.y);
		}
		return false;
	}

	this.moveAble = function(drct) {
		return this[drct + "Able"]();
	}

	this.move = function(drct) {
		return this[drct]();
	}

	this.getXLimit = function() {
		return this.context != null ? this.context.length : 0;
	}

	this.getYLimit = function() {
		return this.context != null ? this.context[0].length : 0;
	}

	this.disable = function() {
		this.disabled = true;
	}
}

Cubic.prototype.toString = function() {
	return (!this.disabled ? this.x + ":" + this.y : 'xx:xx') + ' ';
};

function TetrisStyle(rows, columns, disables) {
	this.rows = rows;
	this.columns = columns;
	this.disables = disables;
	this.turn = function() {
		return new TetrisStyle(this.columns, this.rows, TurnTool
				.turn(this.disables));
	}
	this.disable = function(ary) {
		if (this.disables.length <= 0)
			return;
		var corner = null;
		var realtive = null;
		for ( var m in this.disables) {
			var ele = this.disables[m];
			if (contains(TurnTool.corners, ele)) {
				corner = TurnTool[ele](ary);
				corner.disable();
			} else {
				realtive = ele;
			}
		}
		if (contains(TurnTool.realtives, realtive) && corner != null) {
			TurnTool[realtive](ary, corner).disable();
		}
	}
}

function Tetris(context) {
	this.cubics = [];
	this.context = context;
	this.styleClasses = styles;
	this.styleClass = null;

	this.cubicStyles = [ new TetrisStyle(1, 4, []), new TetrisStyle(4, 1, []),
			new TetrisStyle(2, 2, []), new TetrisStyle(2, 3, [ "ONE", "TWO" ]),
			new TetrisStyle(2, 3, [ "THREE", "LEFT" ]),
			new TetrisStyle(2, 3, [ "FOUR", "RIGHT" ]),
			new TetrisStyle(3, 2, [ "TWO", "THREE" ]),
			new TetrisStyle(3, 2, [ "ONE", "THREE" ]),
			new TetrisStyle(3, 2, [ "ONE", "FOUR" ]) ];

	this.cubicStyle = null;

	this.init = function() {
		this.styleClass = this.styleClasses[range(0,
				this.styleClasses.length - 1)];
		var styleIndx = range(0, this.cubicStyles.length - 1);
		this.cubicStyle = this.cubicStyles[styleIndx];
		this.setCubics(this.createCubics());
	}

	this.createCubics = function() {
		var res = [];
		var style = arguments.length == 1 ? arguments[0] : this.cubicStyle;
		var ref = arguments.length == 2 ? arguments[1] : {
			x : 0,
			y : 0
		}
		for (var i = 0; i < style.rows; i++) {
			res[i] = [];
			for (var j = 0; j < style.columns; j++) {
				res[i][j] = this.getCubic(ref.x + i, ref.y + j, false);
			}
		}
		style.disable(res);
		return res;
	}

	this.turn = function() {
		var style = this.cubicStyle.turn();
		var ref = {
			x : this.cubics[0][0].x,
			y : this.cubics[0][0].y
		}
		var res = this.createCubics(style, ref);
		if (this.isRenderable(res)) {
			this.setCubics(res);
			this.cubicStyle = style;
			return true;
		}
		return false;
	}

	this.getCubic = function(x, y, disabled) {
		var cub = new Cubic(x, y, disabled);
		cub.context = this.context;
		return cub;
	}

	this.setCubics = function(cubics) {
		this.cubics = cubics;
		this.setStyleForCubics(this.cubics);
	}

	this.setStyleForCubics = function(cubics) {
		for ( var i in cubics) {
			for ( var j in cubics[i]) {
				cubics[i][j].setStyle(this.styleClass);
			}
		}
	}

	this.setContext = function(context) {
		this.context = context;
		if (this.cubics != null) {
			for ( var i in this.cubics) {
				for ( var j in this.cubics[i]) {
					this.cubics[i][j].context = this.context;
				}
			}
		}
	}

	this.YCenter = function() {
		var offsetY = (this.context[0].length - this.cubics[0].length) / 2;
		if (this.cubics != null) {
			for ( var i in this.cubics) {
				for ( var j in this.cubics[i]) {
					this.cubics[i][j].context = this.context;
					this.cubics[i][j].y = this.cubics[i][j].y + offsetY;
				}
			}
		}
	}

	this.XCenter = function() {
		var offsetX = (this.context.length - this.cubics.length) / 2;
		if (this.cubics != null) {
			for ( var i in this.cubics) {
				for ( var j in this.cubics[i]) {
					this.cubics[i][j].context = this.context;
					this.cubics[i][j].x = this.cubics[i][j].x + offsetX;
				}
			}
		}
	}

	this.rights = function() {
		var res = [];
		var cubics = arguments.length == 1 ? arguments[0] : this.getCubics();
		for ( var i in cubics) {
			var d = cubics[i][cubics[i].length - 1];
			if (!d.disabled) {
				res[i] = d;
			}
		}
		return res;
	}

	this.lefts = function() {
		var res = [];
		var cubics = arguments.length == 1 ? arguments[0] : this.getCubics();
		for ( var i in cubics) {
			var d = cubics[i][0];
			if (!d.disabled) {
				res[i] = d;
			}
		}
		return res;
	}

	this.bottoms = function() {
		var res = [];
		var cubics = arguments.length == 1 ? arguments[0] : this.getCubics();
		for ( var i in cubics) {
			for ( var j in cubics[i]) {
				var d = cubics[i][j];
				if (!d.disabled) {
					res[j] = d;
				}
			}
		}
		return res;
	}

	this.getCubics = function() {
		return this.cubics;
	}

	this.moveAble = function(drct) {
		var res = true;
		var needDataMethod = drct == "down" ? "bottom" : drct;
		var data = this[needDataMethod + "s"]();
		for ( var i in data) {
			if (!data[i].moveAble(drct)) {
				return false;
			}
		}
		return res;
	}

	this.isRenderable = function() {
		var cubics = arguments.length == 1 ? arguments[0] : this.getCubics();
		var renderAble = true;
		for ( var i in cubics) {
			for ( var j in cubics[i]) {
				if (!cubics[i][j].isRenderable()) {
					renderAble = false;
					break;
				}
			}
		}
		return renderAble;
	}

	this.move = function(act) {
		if (!this.moveAble(act))
			return false;
		for ( var i in this.getCubics()) {
			if ($.isArray(this.getCubics()[i])) {
				for ( var j in this.getCubics()[i]) {
					var res = this.getCubics()[i][j];
					if (res != null) {
						res[act]();
					}
				}
			}
		}
		return true;
	}

	this.render = function() {
		var cubics = arguments.length == 1 ? arguments[0] : this.getCubics();
		for ( var i in cubics) {
			for ( var j in cubics[i]) {
				cubics[i][j].render();
			}
		}
	}

	this.clear = function() {
		var cubics = arguments.length == 1 ? arguments[0] : this.getCubics();
		for ( var i in cubics) {
			for ( var j in cubics[i]) {
				cubics[i][j].clear();
			}
		}
	}

	this.init();
}

var Client = {
	columns: 8, 
	rows: 18,
	context : null,
	previewTetris : null,
	previewContext : null,
	tetris : [],
	speed : 1000,
	score : 0,
	scorePerLine : 100,
	moveJob : null,
	getSpeed : function() {
		return this.speed - this.score / 10;
	},
	start : function() {
		Client.createTetris()
	},
	createTetris : function() {
		this.tetris = this.getTetris();
		if (this.tetris.moveAble("down")) {
			this.tetris.clear();
		}
		if (!this.tetris.isRenderable()) {
			alert("Game over!");
		}
		this.tetris.render();
		this.startMoveJob();
		this.createNextTetris();
	},
	getTetris : function() {
		var newTetris = new Tetris(this.context);
		if (this.previewTetris != null) {
			this.previewTetris.clear();
			newTetris = this.previewTetris;
			newTetris.setContext(this.context);
		}
		return newTetris;
	},
	startMoveJob : function() {
		if (this.moveJob != null) {
			clearInterval(this.moveJob);
		}
		this.moveJob = setInterval(function() {
			Client.move("down")
		}, this.getSpeed());
	},
	createNextTetris : function() {
		this.previewTetris = new Tetris(this.previewContext);
		while (!this.previewTetris.isRenderable()) {
			this.previewTetris = new Tetris(this.previewContext);
		}
		this.previewTetris.render();
	},
	move : function(act) {
		if (this.tetris.moveAble("down")) {
			if (this.tetris.moveAble(act)) {
				this.tetris.clear();
				this.tetris.move(act);
				this.tetris.render();
				return true;
			}
		} else {
			this.checkMatch();
		}
		return false;
	},
	turn : function() {
		if (this.tetris.moveAble("down")) {
			this.tetris.clear();
			this.tetris.turn();
			this.tetris.render();
		}
	},
	checkMatch : function() {
		var grids = this.context;
		var checkLimit = 0;
		for (var i = grids.length - 1; i > checkLimit; i--) {
			var checkLength = grids[i].length;
			var renerdedNum = 0;
			for (var j = 0; j < checkLength; j++) {
				if (this.tetris.getCubic(i, j).isRendered()) {
					renerdedNum++;
				}
			}
			if (renerdedNum == grids[i].length) {
				for (var j = 0; j < checkLength; j++) {
					var current = this.tetris.getCubic(i, j);
					current.clear();
					for (var h = i - 1; h > checkLimit; h--) {
						var up = this.tetris.getCubic(h, j);
						current.setStyle(up.getStyle());
						current.render();
						up.clear();
						current = up;
					}
				}
				this.updateScore();
			}
		}
	},
	updateScore : function() {
		this.score = this.score + this.scorePerLine;
		$("#score").html(this.score);
	}
}

$(document).ready(function() {
	GridPainter.init(Client.columns, Client.rows, 35, 1);
	GridPainter.setId = true;
	Client.context = GridPainter.draw($("#back"), false);
	GridPainter.columns = 3;
	GridPainter.rows = 3;
	GridPainter.setId = false;
	Client.previewContext = GridPainter.draw($("#preview"), false);
	$("#operation").css({
		top : "0px",
		left : $("#back").css("width"),
		width : "200px",
		position : "absolute",
		padding : "10px"
	});
	$("#preview").css({
		top : "45px",
		margin : "5px",
		position : "realtive"
	});
	$(document).bind("keydown", function(event) {
		var code = event.which || event.keyCode;
		switch (code) {
		case Key.UP:
			Client.turn();
			break;
		case Key.LEFT:
			Client.move("left");
			break;
		case Key.RIGHT:
			Client.move("right");
			break;
		case Key.DOWN:
			Client.move("down");
			if (!Client.tetris.moveAble("down")) {
				Client.createTetris();
			}
			break;
		default:
		}
	});
	Client.start();
});