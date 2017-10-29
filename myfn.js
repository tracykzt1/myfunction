//获取样式属性值；(获取非行间样式属性值的函数)
function getStyle(obj, attrname) {
	if (obj.currentStyle) {
		return obj.currentStyle[attrname]; //IE
	} else {
		return getComputedStyle(obj, false)[attrname]; //标准浏览器
	}
}

//运动框架;
function move(obj, json, callfn) {
	clearInterval(obj.timer);
	obj.timer = setInterval(function() {
		var status = true;
		for (var attr in json) {
			var currAttr = 0;
			if (attr == 'opacity') {
				currAttr = Math.round(parseFloat(getStyle(obj, attr)) * 100);
			} else {
				currAttr = parseInt(getStyle(obj, attr));
			}

			var step = (json[attr] - currAttr) / 5;
			step = step > 0 ? Math.ceil(step) : Math.floor(step);

			if (currAttr != json[attr]) {
				status = false;
			}

			if (attr == 'opacity') {
				obj.style.filter = 'alpha(opacity=' + (currAttr + step) + ')';
				obj.style.opacity = (currAttr + step) / 100;
			} else {
				obj.style[attr] = currAttr + step + 'px';
			}
		}

		if (status) {
			clearInterval(obj.timer);
			if (callfn) {
				callfn();
			}
		}
	}, 30)
}


//通过ID获取元素
function getById(id) {
	return typeof id == 'string' ? document.getElementById(id) : id;
}


//通过Class获取元素，兼容IE6,7,8
function getByClass(obj, className) {
	if (obj.getElementsByClassName) { // 支持 getElementsByClassName 方法的使用 
		return obj.getElementsByClassName(className);
	} else {
		/* 不支持 getElementsByClassName 方法的使用 */
		// 保存所有查找到的元素的数组结构  
		var arr = [],
			elements = obj.getElementsByTagName('*'); // 查找出 obj 对象后代所有元素 

		for (var i = 0; i < elements.length; i++) { // 遍历每个元素  
			var classnames = elements[i].className.split(" "); // 获取到当前遍历元素所使用的所有类名  
			for (var j = 0; j < classnames.length; j++) { // 遍历当前元素的每个类名
				if (classnames[j] == className) { // 说明当前遍历到的元素使用过要查找的类名
					arr.push(elements[i]);
					break;
				}
			}
		}

		return arr; // 返回结果集  
	}
}

// 绑定事件，解绑事件，获取事件对象，事件对象目标，阻止默认事件，防止事件冒泡
var EventUtil = {
	addHandler: function(ele, evt, Fn) {
		if (ele.addEventListener) {
			ele.addEventListener(evt, Fn, false);
		} else if (ele.attachEvent) {
			ele.attachEvent("on" + evt, Fn);
		} else {
			ele["on" + evt] = Fn;
		}
	},

	removeHandler: function(ele, evt, Fn) {
		if (ele.removeEventListener) {
			ele.removeEventListener(evt, Fn, false);
		} else if (ele.detachEvent) {
			ele.detachEvent("on" + evt, Fn);
		} else {
			ele["on" + evt] = null;
		}
	},

	getEvent: function(event) {
		return event || window.event;
	},

	getTarget: function(event) {
		return event.target || event.srcElement;
	},

	preventDefault: function(event) {
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	},

	stopPropagation: function(event) {
		if (event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
	}
}

//封装hasClass,removeClass,addClass
function hasClass(el, className) {
	var reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
	return reg.test(el.className);
}

function addClass(el, className) {
	if (hasClass(el, className)) {
		return;
	};

	var newClass = el.className.split(' ');
	newClass.push(className);
	el.className = newClass.join(' ');
}

function removeClass(el, className) {
	if (hasClass(el, className)) {
		var reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
		el.className = el.className.replace(reg, " ");
	}
}

//封装原生ajax.
function ajax(object) {
	var xhr = null;
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	} else {
		xhr = new ActiveXObject('Microsoft.XMLHTTP');
	}

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
				var data = JSON.parse(xhr.responseText);
				object.success(data);
			} else {
				if (object.error) {
					object.error(xhr.status);
				}
			}
		}
	}

	var str = '';
	if (object.data) {
		for (var key in object.data) {
			str += key + '=' + object.data[key] + '&';
		}
		str = str.substr(0, str.length - 1);
	}

	if (object.methods.toUpperCase() === 'GET') {
		var url = object.url + '?' + str;
		xhr.open('GET', url, object.async);
		xhr.send(null);
	} else if (object.methods.toUpperCase() === 'POST') {
		xhr.open('POST', object.url, object.async);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.send(str);
	}
}

/*示例
var params = {
	methods: 'get',
	url: 'www.xxx.com',
	data: {a: 1, b: 2},
	async: true,
	success: function(res) {
		console.log(res);
	},
	error: function(error) {
		console.log(error);
	}
}

ajax(params);*/

//封装数组洗牌
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

function shuffle(arr) {
	var _arr = arr.slice();
	for (var i = 0; i < _arr.length; i++) {
		var j = getRandomInt(0, i);
		var t = _arr[i];
		_arr[i] = _arr[j]
		_arr[j] = t
	}
	return _arr
}


// 封装两种数组去重
// 第一种
function clearReapt(arr) {
  var obj = {},
    array = [];

  for (var i = 0, len = arr.length; i < len; i++) {
    if (!(arr[i] in obj)) {
      obj[arr[i]] = 1;
      array.push(arr[i]);
    }
  }

  return array;
}

// 第二种
/*function clearReapt(arr) {
  var array = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    if (array.indexOf(arr[i]) == -1) {
      array.push(arr[i]);
    }
  }

  return array;
}*/


// 封装函数节流
function throttle(fn, delay, mustRunDelay) {
	var timer = null;
	var startTime;
	return function() {
		var context = this,
			args = arguments,
			currTime = +new Date();
		clearTimeout(timer);
		if (!startTime) {
			startTime = currTime;
		}
		if (currTime - startTime >= mustRunDelay) {
			fn.apply(context, args);
			startTime = currTime;
		} else {
			timer = setTimeout(function() {
				fn.apply(context, args);
			}, delay);
		}
	};
};

//获取输入框和文本框中选中的文本(input,textarea)
function getSelectText(input) {  //input指的是文本框或输入框
	if (typeof input.selectionStart == "number") { //IE9+,Firefox, Safari, Chrome, Opera
		return input.value.substring(input.selectionStart, input.selectionEnd);
	} else if (document.selection) { //IE6,7,8
		return document.selection.createRange().text;
	}
}