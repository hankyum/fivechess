function reSize(a, b, c) {
	var d = $(window).height(),
	e = $(window).width(),
	f = a / e,
	g = b / d;
	g >= f && $(c).css({
		width : e + "px",
		height : "auto"
	}),
	f > g && $(c).css({
		width : "auto",
		height : d + "px"
	})
}
function showText() {
	var a = -1;
	setInterval(function () {
		return a > 4 ? !1 : (a += 1, void $("#copyText p").eq(a).animate({
				opacity : 1,
				height : "100%"
			}, 1500))
	}, 1500),
	setTimeout(function () {
		$("#enterBtn").animate({
			"margin-top" : "172px",
			opacity : 1,
			filter : "alpha(opacity=50)"
		}, 1e3, function () {
			hasVieo || setTimeout(function () {
				enterPage()
			}, 500)
		})
	}, 2e3)
}
function enterPage() {
	$("#play_con").slideUp(800, function () {
		$(this).remove();
		var a = $(".header").height(),
		b = setInterval(function () {
				var c = $(window).scrollTop();
				a > c ? $(window).scrollTop(c += 1) : clearInterval(b)
			}, 1)
	}),
	$("html,body").removeClass("hidden"),
	$("#b_con").show(),
	$(".beyond-img ul").bxSlider({
		mode : "fade",
		speed : 1e3,
		controls : !1,
		pagerSelector : ".img-control",
		auto : !0,
		pause : 5e3,
		onSliderLoad : function (a) {
			$(".beyond-img li").eq(a).find(".banner").addClass("scale")
		},
		onSlideAfter : function (a) {
			$(".beyond-img .banner").removeClass("scale"),
			$(a).find(".banner").addClass("scale")
		}
	}),
	$(".homeSlider").bxSlider({
		pager : false,
		mode : "fade",
		auto : true
	})
}
function noVideo() {
	$("#playCon").html($("#hiddenImg").html()),
	$("#enterBg")[0].onload = function () {
		$("#loading").hide(),
		$("#playCon").fadeIn(),
		showText();
		var a = $("#enterBg").width(),
		b = $("#enterBg").height();
		reSize(a, b, "#enterBg"),
		$(window).resize(function () {
			reSize(a, b, "#enterBg")
		})
	}
}
function showTitle(a, b, c) {
	$(a).animate({
		height : "73px",
		opacity : 1
	}, 1e3, function () {
		$(b).animate({
			height : "56px",
			opacity : 1
		}, 500, function () {
			$(c).animate({
				height : "73px",
				opacity : 1
			}, 1e3)
		})
	})
}
function remainTime() {
	var a,
	b,
	c,
	d,
	e,
	f,
	g = new Date;
	if (f = g.getTime() + op.zhuzhi.duration, a = op.zhuzhi.end - f, showStatus(a), 0 >= a)
		return clearTimeout(op.zhuzhi.timerID), void showClock(op.zhuzhi.elm, {
			d : 0,
			h : 0,
			m : 0,
			s : 0
		});
	b = Math.floor(a / 864e5),
	a -= 864e5 * b,
	c = Math.floor(a / 36e5),
	a -= 36e5 * c,
	d = Math.floor(a / 6e4),
	a -= 6e4 * d,
	e = Math.floor(a / 1e3),
	showClock(op.zhuzhi.elm, {
		d : b,
		h : c,
		m : d,
		s : e
	});
	op.zhuzhi.timerID = setTimeout("remainTime()", 1e3)
}
function showClock(a, b) {
	b.d ? (a.find(".time").html(b.d), a.find("#unit").html("天")) : b.h ? (a.find(".time").html(b.h), a.find("#unit").html("时")) : (a.find(".time").html(b.m), a.find("#unit").html("分"))
}
function getDuration(a) {
	return a - (new Date).getTime()
}
function showStatus(a) {
	3 == op.zhuzhi.state ? $("#setRemind").attr({
		href : "javascript:;",
		target : ""
	}).addClass("btn-gray").text("已售罄") : 5 == op.zhuzhi.state ? $("#setRemind").attr({
		href : "javascript:;",
		target : ""
	}).addClass("btn-gray") : 504e5 > a && $("#setRemind").attr("href", _GLOBAL_CONFIG.buyZhuPhone).attr("target", "_blank").text("前往购买")
}
var qqPop = new PopWin({
		className : "q-tips"
	}), remindPop = new PopWin({
		className : "set-remind-pop"
	});
op.zhuzhi = op.zhuzhi || {};
var hasVieo = document.createElement("video").canPlayType, success_jsonpCallback = function () {}, num = !0;
$(function () {
	function a(a, b, c) {
		$(".set-remind-pop").on(a, b, function () {
			var a = i();
			c(a)
		})
	}
	function b(a) {
		$.ajax({
			url : a.url,
			data : a.data || {},
			type : a.type || "POST",
			dataType : "jsonp",
			jsonp : "success_jsonpCallback",
			jsonpCallback : "success_jsonpCallback"
		}).done(function (b) {
			"function" == typeof a.callback && a.callback.call(this, b)
		}).fail(function () {
			return a.silent ? void 0 : void window.pop.alert("服务器正忙！请稍后再试")
		})
	}
	var c = $("#registerBtn").attr("href");
	if ($("#registerBtn").attr("href", c + "?jump=" + encodeURIComponent(window.location.href)), changeLoginStatus(), $("html,body").addClass("hidden"), $(window).scrollTop(0), $(window).scroll(function () {
			var a = $(".nature-scene").offset().top + $(".n-title").height();
			a >= $(window).scrollTop() && a < $(window).scrollTop() + $(window).height() && (showTitle(".n-title .quzhi", ".n-title .xian", ".n-title .ziran"), $(".n-text-box .n-text").animate({
					top : "188px",
					opacity : 1
				}, 1e3));
			var b = $(".n-icon ul").offset().top + $(".n-icon ul").height();
			if (b >= $(window).scrollTop() && b < $(window).scrollTop() + $(window).height() && num) {
				var c = 0,
				d = 0,
				e = 0,
				f = setInterval(function () {
						c += 25,
						$("#growDay").html(c),
						c >= 1825 && clearInterval(f)
					}, 60),
				g = setInterval(function () {
						d += 1,
						$("#bamNum").html(d),
						d >= 20 && clearInterval(g)
					}, 100),
				h = setInterval(function () {
						e += 1,
						$("#proNum").html(e),
						e >= 28 && clearInterval(h)
					}, 100);
				num = !1
			}
			var i = $(".beyond-scene").offset().top + $(".beyond-scene").height() / 3;
			i >= $(window).scrollTop() && i < $(window).scrollTop() + $(window).height() && (showTitle(".b-title .beyond", ".b-title .xian", ".b-title .ziran"), $(".beyond-text .b-text").animate({
					top : "237px",
					opacity : 1
				}, 1e3));
			var j = $(".only-scene").offset().top + $(".only-title").height();
			j >= $(window).scrollTop() && j < $(window).scrollTop() + $(window).height() && (showTitle(".only-title .duyi", ".only-title .xian", ".only-title .wuer"), $(".only-intro .only-p").animate({
					marginTop : 0,
					opacity : 1
				}, 1e3))
		}), hasVieo) {
		var d = $("#zplayer")[0],
		e = setInterval(function () {
				if (d.readyState > 1) {
					clearInterval(e),
					$("#loading").hide(),
					$(".play-container").fadeIn(),
					d.play(),
					showText();
					var a = $("#zplayer").width(),
					b = $("#zplayer").height();
					reSize(a, b, "#zplayer"),
					$(window).resize(function () {
						reSize(a, b, "#zplayer")
					})
				}
			}, 100);
		d.addEventListener("ended", function () {
			setTimeout(enterPage, 500)
		})
	} else
		noVideo();
	$("#enterBtn").click(function () {
		enterPage()
	});
	var f = ! - [1] && !window.XMLHttpRequest;
	f ? $("#playBtn").click(function () {
		window.open(_GLOBAL_CONFIG.youku_url)
	}) : ($("#playBtn").click(function () {
			$("#introVideo").show(),
			$("html,body").addClass("hidden")
		}), $("#bb_player_btn").on("click", function () {
			$("html,body").removeClass("hidden"),
			$(this).parents(".bb-win").fadeOut()
		}));
	var g = '<div class="remind-way clearfix"><div class="meg-remind"><span><a class="icon" id="setM_r" href="javascript:;"></a></span><p>短信提醒</p></div><div class="qq-remind"><span><a class="icon" id="setQ_r" href="javascript:;"></a></span><p>QQ提醒</p></div></div>',
	h = '<form id="setRemidForm" class="set-remind-form"><div class="block"><label for="">手机号码</label><input type="text" id="tel" /><span class="error-tip tel-tip"></span></div><div class="block"><label for="">图形验证码</label><input type="text" id="imgCode" /><img src="" width="90" height="35" id="validCode"  title="看不清？点击换一个"/><span class="error-tip ic-tip"></span></div><div class="block"><label for="">短信验证码</label><input type="text" id="telCode" /><a href="javascript:;" id="getTelCodeBtn" class="get-code-btn">获取验证码</a><span class="error-tip it-tip"></span></div><div class="block submit-btn"><button type="submit" id="submitBtn">提交</button></div><div class="warm-tip">温馨提示：手机验证通过后我们会在开放购买前一天为您发送短信提醒</div></form>',
	i = function () {
		var a = {
			tel : $("#tel").val(),
			imgCode : $("#imgCode").val(),
			telCode : $("#telCode").val()
		};
		return a
	},
	j = {
		tel : function (a, c, d) {
			return $(a).attr("sta", 0),
			"" == $(a).val() ? ($(c).html("手机号码不能为空"), !1) : /^1(3|5|7|8)\d{9}$/g.test($(a).val()) ? ($(c).html("检验中..."), void b({
					url : d,
					data : {
						mobile : $(a).val(),
						format : "json"
					},
					callback : function (b) {
						return 1 != b.ret ? (2 == b.ret ? $(c).html("此号码已经设置过提醒") : window.pop.alert(b.errMsg), !1) : ($(c).html(""), void $(a).attr("sta", 1))
					}
				})) : ($(c).html("号码格式不正确，请重填写"), !1)
		},
		imgCode : function (a, c, d) {
			return $(a).attr("sta", 0),
			"" == $(a).val() ? ($(c).html("请输入图形验证码"), !1) : ($(c).html("检验中..."), void b({
					url : d,
					data : {
						code : $(a).val(),
						format : "json"
					},
					callback : function (b) {
						return 1 != b.ret ? (0 == b.ret ? $(c).html("验证码输入错误") : window.pop.alert(b.errMsg), !1) : ($(c).html(""), void $(a).attr("sta", 1))
					}
				}))
		},
		telCode : function (a, c, d) {
			return $(a).attr("sta", 0),
			"" == $(a).val() ? ($(c).html("请输入短信验证码"), !1) : ($(c).html("检验中..."), void b({
					url : d,
					data : {
						verify : $(a).val(),
						mobile : $("#tel").val(),
						format : "json"
					},
					callback : function (b) {
						return 1 != b.ret ? (0 == b.ret ? $(c).html("验证码输入错误") : window.pop.alert(b.errMsg), !1) : ($(c).html(""), void $(a).attr("sta", 1))
					}
				}))
		}
	};
	$("#setRemind").on("click", function () {
		"开抢提醒" == $(this).text() && ($(this).hasClass("btn-gray") ? pop.tip("8月18日00:00才可以开始设置开抢提醒哦！", 2e3, "#setRemind", "tr") : remindPop.text("开抢提醒", !0, g, "", "", "", !0, !1, !0, 670, 420))
	}),
	$(".set-remind-pop").on("click", "#setM_r", function () {
		remindPop.text("开抢提醒", !0, h, "", "", "", !0, !1, !0, 670, 420),
		$("#validCode").attr("src", _GLOBAL_CONFIG.setRemind.getImgCode + "?time=" + Math.random())
	}),
	$(".set-remind-pop").on("click", "#validCode", function () {
		$("#validCode").attr("src", _GLOBAL_CONFIG.setRemind.getImgCode + "?time=" + Math.random())
	}),
	a("blur", "#tel", function () {
		j.tel("#tel", ".tel-tip", _GLOBAL_CONFIG.setRemind.telValidte)
	}),
	a("blur", "#imgCode", function () {
		j.imgCode("#imgCode", ".ic-tip", _GLOBAL_CONFIG.setRemind.validImgCode)
	}),
	a("blur", "#telCode", function () {
		j.telCode("#telCode", ".it-tip", _GLOBAL_CONFIG.setRemind.validTelCode)
	}),
	a("click", "#getTelCodeBtn", function (a) {
		return 1 != $("#tel").attr("sta") ? ($("#tel").trigger("blur"), !1) : 1 != $("#imgCode").attr("sta") ? ($("#imgCode").trigger("blur"), !1) : ($("#getTelCodeBtn").off("click").addClass("disable-btn"), void b({
				url : _GLOBAL_CONFIG.setRemind.getTelCode,
				data : {
					mobile : a.tel,
					code : a.imgCode,
					format : "json"
				},
				callback : function (a) {
					if (1 != a.ret)
						return window.pop.alert(a.errMsg), $("#validCode").attr("src", _GLOBAL_CONFIG.setRemind.getImgCode + "?time=" + Math.random()), $("#getTelCodeBtn").on("click").removeClass("disable-btn"), !1;
					$("#getTelCodeBtn").html('重新获取(<span id="second">60</span>)');
					var b = 60,
					c = setInterval(function () {
							b--,
							$("#second").html(b),
							0 == b && (clearInterval(c), $("#getTelCodeBtn").on("click").removeClass("disable-btn").html("获取验证码"))
						}, 1e3)
				}
			}))
	}),
	$(".set-remind-pop").on("click", "#submitBtn", function () {
		if (1 != $("#tel").attr("sta"))
			return $("#tel").trigger("blur"), !1;
		if (1 != $("#imgCode").attr("sta"))
			return $("#imgCode").trigger("blur"), !1;
		if (1 != $("#telCode").attr("sta"))
			return $("#telCode").trigger("blur"), !1;
		var a = $(this),
		c = i();
		return a.off("click").html("提交中..."),
		b({
			url : _GLOBAL_CONFIG.setRemind.submitRemind,
			data : {
				mobile : c.tel,
				code : c.imgCode,
				authenticode : c.telCode
			},
			callback : function (b) {
				return 1 != b.ret ? (window.pop.alert(b.errMsg), a.on("click").html("提交"), !1) : void $(".set-remind-pop .pop-content").html('<p class="suc-tips">恭喜您已成功订阅竹质手机的开抢提醒，我们将于开放购买前一天为您发送短信提醒，请留意短信。</p><span class="suc-btn" data-api="share_sina" data-searchpic="false" data-pic="http://statics.oneplus.cn/img/backcover/bamboo/weibo_share.jpg" data-url="http://v.youku.com/v_show/id_XNzQ0MDk3ODY0.html" data-title="#夏天就换竹子手机#我已成功预约一加手机竹质限量版，天生唯一，给世界上独一无二的你。分享赢取一加手机竹质限量版！预约请点： http://cheers.oneplus.cn/activity/zhuzhi.html">分享赢手机</span>')
			}
		}),
		!1
	}),
	$(document).on("click", ".set-remind-pop .suc-btn", function () {
		remindPop.close()
	}),
	$(".set-remind-pop").on("click", "#setQ_r", function () {
		remindPop.close();
		var a = {
			content : "亲爱的加油！周一（8月25日）上午10点，一加手机竹质限量版准时开售。请提前访问http://oneplus.cn 并登录哦！【一加手机】",
			time : "2014-8-25 10:00",
			advance : 15,
			url : window.location.href,
			icon : "2_1"
		},
		b = "http://qzs.qq.com/snsapp/app/bee/widget/open.htm#content=" + encodeURIComponent(a.content) + "&time=" + encodeURIComponent(a.time) + "&advance=" + a.advance + "&url=" + encodeURIComponent(a.url),
		c = '<iframe width="580px" height="460px" style="margin-top: -85px;" frameborder="0" scrolling="no" src="' + b + '" allowtransparency="true"></iframe>';
		qqPop.text("", !0, c, "", "", "", !1, !1, !0, 670, 420)
	})
});
