/*
 * yangshuo@oneplus.cn
 * oneplus datacollection.js 
 */
;var _opq = _opq || [] ;
;(function(){
	//alert(123);
	//button binding-function
	var opdcanalytics = function(element, options) {
		this.options = {
			url: !0,
			opSite: "onepluscn",
			opPosition: ["A"],
			JQelement: !1
		};
		for (var p in options) {
			this.options[p] = options[p];
		}
		$ = window.$;
		if($){
		//go on plz 
			}else{
			return ;
		}
		for (var _this = this, bindFunction = function(links) {
			$.each(links, 
			function(k, v) {
				var paramString = $(v).text();
				var paramIndex = k;
				var opParmas = "'" + _this.options.opSite + "_" + _this.options.opPosition[i] + paramIndex + "','" + paramString + "'";
				$(v).attr("onclick", "_opq.push(['trackEvent'," + n(opParmas.replace(/\s/gi,'')) + "])");
			})
		},
		i = 0; i < element.length; i++) {
			var links = _this.options.JQelement ? element: $(element[i]).find("a");
			bindFunction(links)
		}
	};
    //��ȡsiteURL
    function getUrl(){
		return location.host + location.pathname + location.hash.split('?')[0];
	}
    function getTime(){
		return (new Date()).getTime();
	}	
	function getQueryStr(){
		return location.search;
	}
	function getType(){
		return 'Loaded';
	}
	function getReferrer(){
		return document.referrer;
	}
	function getDomain(){
		//��ȡdomain : .oneplus.cn
		var a=location.hostname,b=a.split(".");
		size=b.length;
		var c="."+b[size-2]+"."+b[size-1];
		return c
	}
	function getLang(){
		return navigator.language||navigator.userLanguage||navigator.browserLanguage||navigator.systemLanguage
	}
	function getVendor(){
		return navigator.vendor
	}
	function getPlatform(){
		return navigator.platform
	}
	function getscreeninfo(){
		return screen.width+"*"+screen.height
	}
	function getUserAgent(){
		return navigator.userAgent+'_'+navigator.platform
	}
	function setCookie(a,b,c,d){
		//����cookie dΪ��Ч�ڣ���ѡ��
		var e=arguments.length;
		e==3?document.cookie=a+"="+b+";path=/;domain="+c:document.cookie=a+"="+b+";path=/;domain="+c+";expires="+d
	}
	function getCookie(a){
		//���cookie���Ƿ���ָ������Ϣ
		var b=document.cookie,c=n(b),d=c.split(";");
		for(var e=0;e<d.length;e++){
			var f=d[e].split("=");
			if(f.length>1&&f[0]==a){
				return f[1]
			}
		}
		return""
	}
	function getOpServerTime(){
		var str = getCookie("opsertime");
		if(str.length===12){
			str = str + "0";
		}else if(str.length===11){
			str = str + "00";
		}else if(str.length===10){
			str = str + "000";
		}
		//console.log("fixed opsertime : " + str)
		return str;
	}
	function n(a){
		//ȥ���ַ����еĿո�
		var b="";
		for(var c=0;c<a.length;c++){
			var d=a.charAt(c);d!=" "&&(b+=d)
			}
		return b
	}
	function guess(){
		//���������
		return Math.round(2147483647*Math.random())
	}
	function reqscript(a){
	    //���ɶ�̬�ű�
		var b=document.createElement("script");
		b.type="text/javascript",b.async=!0,b.src=a;
		var c=document.getElementsByTagName("script")[0];
		c.parentNode.insertBefore(b,c)
	}
	function formatTimetoSecond(str){
		if(str.length!=13){
			return "";
		}
		var timeinfo = new Date(+str);
		var timestr = [timeinfo.getFullYear(), add0(timeinfo.getMonth()+1), add0(timeinfo.getDate()), add0(timeinfo.getHours()), add0(timeinfo.getMinutes()), add0(timeinfo.getSeconds())].join('');
		return timestr;
	}
	function u(){
		var b=document.referrer;
		b=b.toLowerCase();
		var LF = new Date();
		LF.setTime(LF.getTime()+15552e8);//LF��ʮ��
		var SF = new Date();//SF��ǰʱ��
		//0419update
		var opcid = getCookie("opcid");
		if(opcid==""){
			//������cookie id ��ȫ new user
			var cu="opcid",cv=SF.getTime()+'_'+guess().toString();
			setCookie(cu,cv,getDomain(),LF.toGMTString());
			opcid = cv;
		}
		var opsid = getCookie("opsid");//30����ʧЧ
		var oppt = getCookie("oppt");//�ر������ʧЧ
		var opsct,opbct,opnt,opstep;
		var F = new Date();
		F.setTime(+F.getTime()+30*60*1000);//F��30����
		var opsert = getOpServerTime();
		if(opsid!=""&&oppt=="oneplus"){
			//ֻ�д���sessionid�Լ�δ�ر��������ʶʱ ��Ψһȷ��session����
			//����session ��������
			opsct = getCookie("opsct")==0?opsid.split("_")[0]:getCookie("opsct");//����ԭ����session create time
			opbct = getCookie("opnt")==0?opsid.split("_")[0]:getCookie("opnt");;//��ԭ����ҳ��ˢ��ʱ�� ������һ��ҳ��ˢ��ʱ��
			opnt = opsert||SF.getTime();//ȡcookie�е�opsertime||���µ�ʱ����Ϊҳ��ˢ��ʱ��
			opstep = +getCookie("opstep") + 1;//ҳ����ʴ��� +1
			setCookie("opsid",opsid,getDomain(),F.toGMTString());//����(�ӳ�)opsidʧЧʱ��
		}else{
			//һ��ȫ�µķ���
			var su="opsid",sv=SF.getTime()+'_'+guess().toString();
			opsid = sv;
			setCookie(su,sv,getDomain(),F.toGMTString());
			//���� opsct opbct opnt opstep
			opsct = opsert||SF.getTime();		
			opbct = opsert||SF.getTime();			
			opnt = opsert||SF.getTime();			
			opstep = 1;				
			setCookie("oppt","oneplus",getDomain());
		}
		setCookie("opsct",opsct,getDomain(),LF.toGMTString());
		setCookie("opbct",opbct,getDomain(),LF.toGMTString());
		setCookie("opnt",opnt,getDomain(),LF.toGMTString());
		setCookie("opstep",opstep,getDomain(),LF.toGMTString());
		
		setCookie("optime_browser",SF.getTime(),getDomain(),LF.toGMTString());
		
		//�¼�������
		setCookie("opstep_event",0,getDomain(),LF.toGMTString());
		setCookie("opnt_event",opsert,getDomain(),LF.toGMTString());
		
		var opuid=getCookie("opuserid")||getCookie("user_id")||0;
		var tips = opsert + "_" + SF.getTime();
		var infostr = "uid="+opuid+"&sid="+opsid+"&cid="+opcid+"&ssc="+opsct+"&ssb="+opbct+"&sss="+opstep+"&ssu="+opnt+"&pageurl="+encodeURIComponent(getUrl())+"&ref="
			+encodeURIComponent(b)+"&param="+encodeURIComponent(getQueryStr())+"&type="+getType()+"&sinfo="+getscreeninfo()+"&lang="+getLang()+"&tips="+tips+"&userag="+encodeURIComponent(getUserAgent())+"&buttonid="+"&buttonText=";
		return infostr;
	}

//opdc 2��
	function w(a){
		return"function"==typeof a
	}
	function s(){
		var a="";
		if(e==[])return"";
		for(var b in e)a+="&"+b+"="+e[b];
		return a
	}
	function v(a){
		reqscript(a)
	}
	var a="prototype",b=Math,c="",d="",e=[],
	x=function(){
		this.p=[]
		},
	y=x[a];
	x=function(){
		this.p=[]
		},
	y=x[a];
	y.trackPageView=function(){
		var a=u(),b=s();
		v(z+a+b)
		},
	y.push=function(a){
		if(w(a[0])){
			a[0](a.slice(1));
			return
			}
		y[a[0]](a.slice(1))
		},
	y.trackEvent=function(a){
		var LF = new Date();
		LF.setTime(LF.getTime()+15552e8);//LF��ʮ��
		var opuid=getCookie("opuserid")||getCookie("user_id")||0;
		var opsid = getCookie("opsid");
		var opcid = getCookie("opcid");
		var opsct = getCookie("opsct");
		var opbct = getCookie("opbct");
		var opnt = getCookie("opnt");
		var b=document.referrer; b=b.toLowerCase();
		var opsert = getOpServerTime();
		var tips = opsert + "_" + (new Date()).getTime();
		//�������¼��ķ�������ʱ��
		var opsertime_event = (new Date()).getTime() - getCookie("optime_browser") + (+opsert);
		//console.log("opsertime_event : " + opsertime_event);
		var opbct_event = getCookie("opnt_event");
		setCookie("opnt_event",opsertime_event,getDomain(),LF.toGMTString());
		//�������¼���step
		var opstep_event = (+getCookie("opstep_event")) + 1;
		setCookie("opstep_event",opstep_event,getDomain(),LF.toGMTString());
		var infostr = "uid="+opuid+"&sid="+opsid+"&cid="+opcid+"&ssc="+opsct+"&ssb="+opbct_event+"&sss="+opstep_event+"&ssu="+opsertime_event+"&pageurl="+encodeURIComponent(getUrl())+"&ref="+"&param="+encodeURIComponent(getQueryStr())+"&type="+"action"+"&sinfo="+getscreeninfo()+"&lang="+getLang()+"&tips="+tips+"&userag="+encodeURIComponent(getUserAgent())+"&buttonid="+a[0]+"&buttonText="+a[1];
		if((Math.random()*10) > 5){
			//v(z+infostr);
			v("http://121.9.238.46:900"+Math.round(Math.random()*6+0.5)+"/opdc.gif?"+infostr);
		}else{
			//v(z1+infostr);
			v("http://121.9.238.47:900"+Math.round(Math.random()*6+0.5)+"/opdc.gif?"+infostr);
		}
		
	};
//2�� end
	//var z="http://121.9.238.21:8889/opdc.gif?";
	//var z1 = "http://121.9.238.21:8899/opdc.gif?";
	var messagestr = u();
	if((Math.random()*10) > 5){
		//reqscript(z+messagestr);
		reqscript("http://121.9.238.46:900"+Math.round(Math.random()*6+0.5)+"/opdc.gif?"+messagestr);
	}else{
		//reqscript(z1+messagestr);
		reqscript("http://121.9.238.47:900"+Math.round(Math.random()*6+0.5)+"/opdc.gif?"+messagestr);
	}
	
	A=new x;
	A.p=window._opq;
	for(i=0;i<A.p.length;i++){
		A.push(A.p[i]);
		}
	window._opq=A;
	//��
  	opdcanalytics([".header-top",".guide-hd",".service-card",".help-container .sub-content-bd"], {
            opPosition: ["A","C","D","E"]
        }) 
/* 	opdcanalytics([$("#btn-login"),$("#pop-login .pop-close")], {
		opPosition: ["B1","B2"],
		JQelement: !0
	}) */
	opdcanalytics(["#showWeixin","#banksPay"], {
		opPosition: ["G","K"],
		JQelement: !0
	})
	
		opdcanalytics([".banks .payment-type-tab"], {
		opPosition: ["H"]
	})
	
var banks = $(".banks label input");
for(var i = 0; i < banks.length; i++){
	$($(".banks label input").get(i)).attr("onclick", "_opq.push(['trackEvent'," + "'onepluscn_J" + i + "','"+$(".banks label input").get(i).defaultValue+"'" + "])");
};
$($(".turn-plate .turn-lucky input")).attr("onclick", "_opq.push(['trackEvent'," + "'onepluscn_M','�����齱'" + "])");
})()