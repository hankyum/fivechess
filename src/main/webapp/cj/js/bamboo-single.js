function remainTime(){var a,b,c=new Date;if(b=c.getTime()+op.zhuzhi.duration,a=op.zhuzhi.end-b,0>=a)return clearTimeout(op.zhuzhi.timerID),void showBuyBtn();op.zhuzhi.timerID=setTimeout("remainTime()",1e3)}function showBuyBtn(){$(".buy-btn").removeClass("btn-gray")}function getDuration(a){return a-(new Date).getTime()}op.zhuzhi=op.zhuzhi||{},window.onload=function(){var a=$(".header").height()+5,b=setInterval(function(){var c=$(window).scrollTop();a>c?$(window).scrollTop(c+=5):clearInterval(b)},1)};var success_jsonpCallback=function(){};$(function(){$("#qaList").niceScroll({cursorborder:"none",cursorcolor:"#333333",cursoropacitymin:1,cursorwidth:"9px",cursorborderradius:"0px"}),$("#getRulesBtn").click(function(){$("#jiayouRules").fadeIn(),$("#closeRulesBtn").click(function(){$("#jiayouRules").fadeOut()})}),changeLoginStatus(),$.ajax({url:_GLOBAL_CONFIG.ajaxOyTime,type:"GET",data:{format:"json"},dataType:"jsonp",jsonp:"success_jsonpCallback",jsonpCallback:"success_jsonpCallback"}).done(function(a){return 1!==a.ret?void window.pop.alert(a.errMsg):(op.zhuzhi.end=a.data.timeStart,op.zhuzhi.serverDate=a.data.timeNow,op.zhuzhi.duration=getDuration(op.zhuzhi.serverDate),void remainTime())})});