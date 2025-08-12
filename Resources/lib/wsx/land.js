/**
 * 说明：存储一些经常使用的js函数
 * 创建时间：2025-04-11
 * 最近一次更新时间：2025-06-23
 */

/**
 * 动态计算并设置根元素(html)的font-size，实现响应式REM布局方案
 * @function rem
 * @param {number} [designWidth=1920] - 设计稿基准宽度（单位：px）
 * @param {number} [windowWidth=1920] - 窗口最大限制宽度（单位：px）
 * @param {number} [num=10] - REM换算基数（通常设为10便于计算）
 * @param {number} [minWidth=null] - 窗口最小限制宽度（单位：px）
 * @throws {Error} 当参数不是有效数字时抛出错误并显示UI通知
 * @description
 * 1. 核心功能：根据窗口宽度动态计算REM值（公式：REM = 窗口宽度 * num / designWidth）
 * 2. 边界控制：
 *    - 实际宽度超过windowWidth时按windowWidth计算
 *    - 实际宽度低于minWidth时按minWidth计算（同时设置body最小宽度）
 * 3. 自动处理：
 *    - 窗口resize/pageshow事件自动重计算
 *    - 动态创建/更新<style>标签注入REM规则
 *    - 设置默认body字体大小为16px（确保DOM加载完成后生效）
 * @example
 * // 设计稿1920px，限制最大宽度2560px，REM基数10，最小宽度1200px
 * rem(1920, 2560, 10, 1200);
 * 
 * // 使用默认配置（设计稿1920px，无最小宽度限制）
 * rem();
 */
function rem(designWidth,windowWidth,num,minWidth){
    if(designWidth && designWidth !== undefined && !isNumber(designWidth)){
        notification({
            title:'参数错误提示',
            message:'错误函数：rem<br/>错误原因：你传入了一个不能转成数字的参数<br/>错误位置：第一个参数',
            type:'error'
        });
        throw new Error('你传入的第一个参数无法转为数字');
    };
    if(windowWidth && windowWidth !== undefined && !isNumber(windowWidth)){
        notification({
            title:'参数错误提示',
            message:'错误函数：rem<br/>错误原因：你传入了一个不能转成数字的参数<br/>错误位置：第二个参数',
            type:'error'
        });
        throw new Error('你传入的第二个参数无法转为数字');
    };
    if(num && num !== undefined && !isNumber(num)){
        notification({
            title:'参数错误提示',
            message:'错误函数：rem<br/>错误原因：你传入了一个不能转成数字的参数<br/>错误位置：第三个参数',
            type:'error'
        });
        throw new Error('你传入的第三个参数无法转为数字');
    };
    if(minWidth && minWidth !== undefined && !isNumber(minWidth)){
        notification({
            title:'参数错误提示',
            message:'错误函数：rem<br/>错误原因：你传入了一个不能转成数字的参数<br/>错误位置：第四个参数',
            type:'error'
        });
        throw new Error('你传入的第四个参数无法转为数字');
    };
    var defaultValue = {
        designWidth:Number(designWidth) || 1920,
        windowWidth:Number(windowWidth) || 1920,
        num:Number(num) || 10,
        minWidth:Number(minWidth) || null
    };
    var remStyle = document.createElement('style');
    var tid = 'land_js_id_001';
    remStyle.id = tid;
    var refreshRem = function(){
        var width = document.documentElement.getBoundingClientRect().width;
        width > defaultValue.windowWidth && (width = defaultValue.windowWidth);
        if(defaultValue.minWidth){
            if(width < defaultValue.minWidth){
                width = defaultValue.minWidth;
                document.body.style.minWidth = defaultValue.minWidth + 'px';
            }
        };
        var rempx = width * defaultValue.num / defaultValue.designWidth;
        remStyle.innerHTML = 'html{font-size: '+rempx+'px;}';
    };
    if(document.getElementById(tid)){
        document.getElementById(tid).parentNode.removeChild(document.getElementById(tid));
    };
    if(document.documentElement.firstElementChild){
        document.documentElement.firstElementChild.appendChild(remStyle);
    }else{
        var wrap = document.createElement('div');
        wrap.appendChild(remStyle);
        document.write(wrap.innerHTML);
        wrap = null;
    };
    refreshRem();
    window.addEventListener('resize',function(){
        refreshRem();
    },false);
    window.addEventListener('pageshow',function(e){
        if(e.persisted){
            refreshRem();
        }
    },300);
    if(document.readyState === 'complete'){
        document.body.style.fontSize = '16px';
    }else{
        document.addEventListener('DOMContentLoaded',function(e){
            document.body.style.fontSize = '16px';
        },false)
    }
};

/**
 * 获取当前页面中所有元素的最大 z-index 值
 * @returns {number} 返回页面中最大的 z-index 值（默认为1）
 */
function getMaxZIndex(){
    var max = 1;
    var elements = document.getElementsByTagName('*');
    Array.from(elements).forEach(function(element){
        var style = getComputedStyle(element);
        var zIndex = style.getPropertyValue('z-index');
        if(zIndex && !isNaN(parseInt(zIndex))){
            max = Math.max(max,parseInt(zIndex))
        }
    });
    return max;
};

/**
 * 生成随机值（数字、字符串或颜色）
 * @param {number} [a=100] - 控制参数（长度/透明度）
 * @param {string|boolean} [b='str'] - 类型标识 
 *    ('num': 数字, 'color': 颜色, 'str': 字符串, true: 数字, false: 字符串, 'guid': guid（直接过滤第一个参数，也就是第一个参数没有用）)
 * @returns {string} 生成的随机值
 * 
 * @example
 * random(10, 'num')    // 生成10位随机数字串
 * random(50, 'color')  // 生成透明度50%的随机RGBA颜色
 * random(8)            // 生成8位随机字母数字串
 */
function random(a,b){
    var num = a || 100;
    var type = b || 'str';
    var generateGUID = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    var generateRandomNum = function(){
        var num2 = Math.floor(Math.random() * 10);
        var result = [];
        for(var i = 0; i<Number(num) - 1; i++){
            (function(index){
                result.push(parseInt(Math.random() * 10));
            })(i);
        };
        return result.join('') + num2;
    };
    var generateRandomColor = function(){
        if(Number(num) >= 100){
            return "#" + Math.random().toString(16).substring(2,8).padEnd(6,'0');
        }else{
            var a = Math.random().toString(16).substring(2,8).padEnd(6,'0');
            var r = parseInt(a.substring(0,2),16);
            var g = parseInt(a.substring(2,4),16);
            var b = parseInt(a.substring(4,6),16);
            var opacity = Number(num);
            if(num < 0){
                opacity = Math.abs(opacity);
            };
            var alpha = opacity < 1 ? opacity : opacity / 100;
            return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
        }
    };
    var generateRandomString = function(len){
        return len <= 11 ? Math.random().toString(36).substring(2,2 + len).padEnd(len,0) : generateRandomString(11) + generateRandomString(len - 11);
    };
    if (type === 'guid') {
        return generateGUID();
    };
    if(typeof type === 'boolean'){
        return type ? generateRandomNum() : generateRandomString(Number(num));
    }else{
        switch (type){
            case 'num':
                return generateRandomNum();
            case 'color':
                return generateRandomColor();
            default:
                return generateRandomString(Number(num));
        }
    }
};

/**
 * 自定义弹窗组件
 * @param {string|...string} a - 弹窗提示内容(当第二个参数不是函数时，会拼接所有参数)
 * @param {function|string} [b] - 回调函数或附加消息内容
 * @param {string} [c] - 弹窗类型或附加消息内容
 * @param {string} [d] - 弹窗标题或附加消息内容
 * 
 * @example
 * // 常规用法(第二个参数是函数)
 * alert('操作成功', () => {console.log('回调')}, 'success', '提示');
 * 
 * // 拼接消息内容用法(第二个参数不是函数)
 * alert('操作', '成功', '!'); // 消息内容为"操作成功!"
 */
function alert(a,b,c,d){
	// 判断是否为特殊参数情况（null/undefined/空字符串/函数）
	var isSpecialCase = function(x){
		return x === null || x === undefined || x === '' || typeof x === 'function';
	};
    // 处理参数
    var message,callback,type,title;
    // 判断第二个参数是否是函数
    if(isSpecialCase(b)){
        // 原始参数结构
        message = a || ''; 
        callback = b;
        type = c ? String(c).toLowerCase() : 'info';
        title = d || '系统提示'
    }else{
        // 拼接所有参数作为消息内容
        message = '';
        for(var i=0;i<arguments.length;i++){
            if(arguments[i] !== null && arguments[i] !== undefined){
                message += arguments[i];
            }
        };
        callback = null;
        type = 'info';
        title = '系统提示';
    };
    var dialogId = random(10);
    var styleId = random(10);
    var div1 = document.createElement('div');
    var div2 = document.createElement('div');
    var div3 = document.createElement('div');
    var div4 = document.createElement('div');
    var div5 = document.createElement('div');
    var div6 = document.createElement('div');
    var div7 = document.createElement('div');
    var button = document.createElement('button');
    var dialog = document.createElement('dialog');
    var styles = document.createElement('style');
    div1.className = 'alert1' + dialogId;
    div2.className = 'alert2' + dialogId;
    div3.className = 'alert3' + dialogId;
    div4.className = 'alert4' + dialogId;
    div5.className = 'alert5' + dialogId;
    div6.className = 'alert6' + dialogId;
    div7.className = 'alert7' + dialogId;
    button.className = 'alert8' + dialogId;
    dialog.className = 'alert9' + dialogId;
    var styleHtml = '';
    styleHtml += '.alert1' + dialogId + '{width: 420px;height: auto;min-height: 160px;padding: 24px;box-sizing: border-box;background-color: #ffffff;box-shadow: 0 0 10px rgba(0,0,0,0.1);position: fixed;top: 50%;left: 50%;transform: translate(-50%,-50%);border-radius: 4px;}';
    styleHtml += '.alert2' + dialogId + '{display: flex;flex-direction: row;justify-content: flex-start;align-items: center;padding-top: 16px;box-sizing: border-box;width: 100%;height: 40px;}';
    styleHtml += '.alert3' + dialogId + '{width: 21px;height: 21px;margin: 0 13.5px;border-radius: 50%;line-height: 21px;text-align: center;font-weight: bold;color: #ffffff;background-color: '+(type === 'success'?'#27C777':type === 'info'?'#326FF1':type === 'error'?'#F54A45':'#FAC022')+';position: relative;}';
    styleHtml += '.alert3' + dialogId + ' svg{position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);}';
    styleHtml += '.alert4' + dialogId + '{font-size: 16px;color: #262A30;}';
    styleHtml += '.alert5' + dialogId + '{width: 100%;height: auto;min-height: 36px;margin-top: 4px;padding-left: 48px;box-sizing: border-box;}';
    styleHtml += '.alert6' + dialogId + '{line-height: 20px;font-size: 14px;color: #5C626B;}';
    styleHtml += '.alert7' + dialogId + '{display: flex;flex-direction: row;justify-content: flex-end;align-items: center;}';
    styleHtml += '.alert8' + dialogId + '{outline: none;border: none;background-color: #326FF1;width: 74px;height: 32px;text-align: center;line-height: 32px;color: #ffffff;font-size: 14px;border-radius: 6px;cursor: pointer;}';
    styleHtml += '.alert9' + dialogId + '{width: 100%;height: 100%;border: none;background-color: transparent;padding: 0;margin: 0;outline: none;}';
    styleHtml += '.alert9' + dialogId + '::backdrop{background-color: rgba(0,0,0,0.5);backdrop-filter: blur(5px);}';
    var svg = '';
    if(type === 'success'){
        svg = '<svg t="1744276132617" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2658" width="16" height="16"><path d="M887.904 298.208c-12.864-12.064-33.152-11.488-45.216 1.408L415.936 753.984l-233.12-229.696C170.208 511.872 149.952 512 137.536 524.608c-12.416 12.576-12.256 32.864 0.352 45.248l256.48 252.672c0.096 0.096 0.224 0.128 0.32 0.224 0.096 0.096 0.128 0.224 0.224 0.32 2.016 1.92 4.448 3.008 6.784 4.288 1.152 0.672 2.144 1.664 3.36 2.144 3.776 1.472 7.776 2.24 11.744 2.24 4.192 0 8.384-0.832 12.288-2.496 1.312-0.544 2.336-1.664 3.552-2.368 2.4-1.408 4.896-2.592 6.944-4.672 0.096-0.096 0.128-0.256 0.224-0.352 0.064-0.096 0.192-0.128 0.288-0.224l449.184-478.208C901.44 330.592 900.768 310.336 887.904 298.208z" fill="#ffffff" p-id="2659"></path></svg>'
    }else if(type === 'error'){
        svg = '<svg t="1744276189059" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3638" width="16" height="16"><path d="M220.8 812.8l22.4 22.4 272-272 272 272 48-44.8-275.2-272 275.2-272-48-48-272 275.2-272-275.2-22.4 25.6-22.4 22.4 272 272-272 272z" fill="#ffffff" p-id="3639"></path></svg>'
    }else if(type === 'info'){
        svg = '<svg t="1744277506525" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9253" width="16" height="16"><path d="M512 256c36.266667 0 64-27.733333 64-64s-27.733333-64-64-64-64 27.733333-64 64S475.733333 256 512 256zM512 341.333333c-36.266667 0-64 27.733333-64 64l0 426.666667c0 36.266667 27.733333 64 64 64s64-27.733333 64-64L576 405.333333C576 369.066667 548.266667 341.333333 512 341.333333z" p-id="9254" fill="#ffffff"></path></svg>'
    }else{
        svg = '<svg t="1744277544653" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10274" width="16" height="16"><path d="M468.114286 621.714286c7.314286 21.942857 21.942857 36.571429 43.885714 36.571428s36.571429-14.628571 43.885714-36.571428L585.142857 219.428571c0-43.885714-36.571429-73.142857-73.142857-73.142857-43.885714 0-73.142857 36.571429-73.142857 80.457143l29.257143 394.971429zM512 731.428571c-43.885714 0-73.142857 29.257143-73.142857 73.142858s29.257143 73.142857 73.142857 73.142857 73.142857-29.257143 73.142857-73.142857-29.257143-73.142857-73.142857-73.142858z" p-id="10275" fill="#ffffff"></path></svg>'
    };
    div3.innerHTML = svg;
    div4.innerHTML = title;
    div6.innerHTML = message;
    button.innerHTML = '我知道了';
    dialog.id = dialogId;
    div2.appendChild(div3);
    div2.appendChild(div4);
    div5.appendChild(div6);
    div7.appendChild(button);
    div1.appendChild(div2);
    div1.appendChild(div5);
    div1.appendChild(div7);
    dialog.appendChild(div1);
    styles.innerHTML = styleHtml;
    styles.id = styleId;
    document.head.appendChild(styles);
    document.body.appendChild(dialog);
    dialog.showModal();
	// dialog.addEventListener('click',function(event){
	// 	if(event.target === dialog){
	// 		dialog.close();
	// 	}
	// });
    button.addEventListener('click',function(event){
        dialog.close();
        if(document.getElementById(dialogId)){
            document.getElementById(dialogId).parentNode.removeChild(document.getElementById(dialogId));
        };
        if(document.getElementById(styleId)){
            document.getElementById(styleId).parentNode.removeChild(document.getElementById(styleId));
        };
        if(callback){
            callback();
        };
        event.stopPropagation();
    })
};

/**
 * 显示一个全局通知消息
 * @param {Object} obj - 配置对象
 * @param {string} [obj.position='right-top'] - 通知位置 (right-top/right-bottom/left-top/left-bottom)
 * @param {string} [obj.title='通知'] - 通知标题
 * @param {string} [obj.message=''] - 通知内容
 * @param {string} [obj.type='info'] - 通知类型 (info/success/error/warning)
 * @param {number} [obj.duration=5000] - 自动关闭延时(毫秒)
 * 
 * @example
 * // 显示一个5秒后自动关闭的成功通知
 * notification({
 *   title: '操作成功',
 *   message: '您的订单已提交',
 *   type: 'success',
 *   duration: 5000
 * });
 * 
 * // 显示一个右下角的警告通知
 * notification({
 *   position: 'right-bottom',
 *   title: '警告',
 *   message: '磁盘空间不足',
 *   type: 'warning'
 * });
 */
function notification(obj){
    var divId1 = 'land_js_id_002';
    var divId2 = random(10);
    var defaultInfo = {
        position:obj.position || 'right-top',
        title:obj.title || '通知',
        message:obj.message || '',
        type:obj.type?obj.type.toLowerCase():'info',
        duration:obj.duration || 5000
    };
    var div1 = document.createElement('div');
    var div2 = document.createElement('div');
    var div3 = document.createElement('div');
    var div4 = document.createElement('div');
    var div5 = document.createElement('div');
    var div6 = document.createElement('div');
    var inHML = '';
    var isType = '';
    div1.id = divId1;
    div1.style.cssText = 'position: fixed;max-height: 100%;z-index: '+(getMaxZIndex() + 1)+';';
    switch (defaultInfo.position){
        case 'right-top':
            div1.style.cssText += 'top:16px;right:16px;';
            break;
        case 'right-bottom':
            div1.style.cssText += 'bottom:16px;right:16px;';
            break;
        case 'left-top':
            div1.style.cssText += 'left:16px;top:16px;';
            break;
        case 'left-bottom':
            div1.style.cssText += 'left:16px;bottom:16px;';
            break;
    };
    div2.style.cssText = 'width: 330px;padding: 14px 26px 14px 13px;background-color: #ffffff;border-radius: 8px;margin-bottom: 16px;position: relative;box-shadow: 0 0 16px rgba(0,0,0,0.15);box-sizing: border-box;opacity: 1;transition: height 0.5s ease-in,opacity 0.5s ease-in,padding 0.5s ease-in,margin-bottom 0.5s ease-in;overflow: hidden;';
    div2.id = divId2;
    div3.style.cssText = 'display: flex;flex-direction: row;font-size: 16px;';
    switch (defaultInfo.type){
        case 'info':
            isType = '#326FF1';
            inHML = '<svg style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);" t="1744277506525" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9253" width="16" height="16"><path d="M512 256c36.266667 0 64-27.733333 64-64s-27.733333-64-64-64-64 27.733333-64 64S475.733333 256 512 256zM512 341.333333c-36.266667 0-64 27.733333-64 64l0 426.666667c0 36.266667 27.733333 64 64 64s64-27.733333 64-64L576 405.333333C576 369.066667 548.266667 341.333333 512 341.333333z" p-id="9254" fill="#ffffff"></path></svg>';
            break;
        case 'success':
            isType = '#27C777';
            inHML = '<svg style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);" t="1744276132617" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2658" width="16" height="16"><path d="M887.904 298.208c-12.864-12.064-33.152-11.488-45.216 1.408L415.936 753.984l-233.12-229.696C170.208 511.872 149.952 512 137.536 524.608c-12.416 12.576-12.256 32.864 0.352 45.248l256.48 252.672c0.096 0.096 0.224 0.128 0.32 0.224 0.096 0.096 0.128 0.224 0.224 0.32 2.016 1.92 4.448 3.008 6.784 4.288 1.152 0.672 2.144 1.664 3.36 2.144 3.776 1.472 7.776 2.24 11.744 2.24 4.192 0 8.384-0.832 12.288-2.496 1.312-0.544 2.336-1.664 3.552-2.368 2.4-1.408 4.896-2.592 6.944-4.672 0.096-0.096 0.128-0.256 0.224-0.352 0.064-0.096 0.192-0.128 0.288-0.224l449.184-478.208C901.44 330.592 900.768 310.336 887.904 298.208z" fill="#ffffff" p-id="2659"></path></svg>';
            break;
        case 'error':
            isType = '#F54A45';
            inHML = '<svg style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);" t="1744276189059" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3638" width="16" height="16"><path d="M220.8 812.8l22.4 22.4 272-272 272 272 48-44.8-275.2-272 275.2-272-48-48-272 275.2-272-275.2-22.4 25.6-22.4 22.4 272 272-272 272z" fill="#ffffff" p-id="3639"></path></svg>';
            break;
        default:
            isType = '#FAC022';
            inHML = '<svg style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);" t="1744277544653" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10274" width="16" height="16"><path d="M468.114286 621.714286c7.314286 21.942857 21.942857 36.571429 43.885714 36.571428s36.571429-14.628571 43.885714-36.571428L585.142857 219.428571c0-43.885714-36.571429-73.142857-73.142857-73.142857-43.885714 0-73.142857 36.571429-73.142857 80.457143l29.257143 394.971429zM512 731.428571c-43.885714 0-73.142857 29.257143-73.142857 73.142858s29.257143 73.142857 73.142857 73.142857 73.142857-29.257143 73.142857-73.142857-29.257143-73.142857-73.142857-73.142858z" p-id="10275" fill="#ffffff"></path></svg>'
    };
    div4.style.cssText = 'width: 21px;height: 21px;border-radius: 50%;background-color: '+isType+';position: relative;';
    div4.innerHTML = inHML;
    div5.style.cssText = 'font-weight: 700;color: #333333;margin-left: 10px;';
    div5.innerHTML = defaultInfo.title;
    div6.style.cssText = 'text-indent: 24px;font-size: 16px;color: #333333;margin-top: 10px;line-height: 24px;';
    div6.innerHTML = defaultInfo.message;
    div3.appendChild(div4);
    div3.appendChild(div5);
    div2.appendChild(div3);
    div2.appendChild(div6);
    if(document.getElementById(divId1)){
        if(defaultInfo.position === 'right-bottom' || defaultInfo.position === 'left-bottom'){
            document.getElementById(divId1).insertBefore(div2,document.getElementById(divId1).firstChild);
        }else{
            document.getElementById(divId1).appendChild(div2);
        }
    }else{
        div1.appendChild(div2);
        document.body.appendChild(div1);
    };
    var removeDiv = function(){
        var length = document.getElementById(divId1).childNodes.length;
        if(length === 0){
            document.getElementById(divId1).parentNode.removeChild(document.getElementById(divId1));
        }
    };
    var heightDiv2=function(id){
        document.getElementById(id).style.height = document.getElementById(id).clientHeight + 'px';
        setTimeout(function(){
            document.getElementById(id).style.height = '0px';
            document.getElementById(id).style.opacity = 0;
            document.getElementById(id).style.padding = '0 26px 0 13px';
            document.getElementById(id).style.marginBottom = 0;
            setTimeout(function(){
                document.getElementById(id).parentNode.removeChild(document.getElementById(id));
                removeDiv();
            },500);
        },Number(defaultInfo.duration));
    };
    heightDiv2(divId2);
}

/**
 * 判断是否为数字
 * @param {*} input 任意类型
 * @returns {boolean} 如果是数字返回true,否则返回false
 */
function isNumber(input){
    // 检查类型是否为number，注意NaN也是number类型需要排除
    if(typeof input === 'number'){
        return !isNaN(input);
    };
    // 检查是否为数字字符串（包括科学计数法、十六进制、八进制等）
    if(typeof input === 'string'){
        // 去除首尾空格
        var str = input.trim();
        // 空字符串不是数字
        if(!str) return false;
        // 使用Number转换并且检查是否为NaN
        return !isNaN(Number(str));
    };
    return false;
};

/**
 * 发送 AJAX 请求
 * @param {string} [type='GET'] - 请求方法类型，默认为 GET（支持 GET/POST）
 * @param {string} src - 请求的 URL 地址（必填）
 * @param {Object} [params=null] - 请求参数对象（可选）
 * @returns {Promise} 返回一个 Promise 对象，成功时返回响应文本，失败时返回状态码
 * @example
 * // GET 请求示例
 * ajax('GET', '/api/data', {id: 1}).then(res => console.log(res))
 * 
 * // POST 请求示例
 * ajax('POST', '/api/save', {name: '张三'}).then(res => console.log(res))
 */
function ajax(type,src,params){
    var methods = type?type.toUpperCase():'GET';
    var url = src || '';
    var data = params || null;
    if(!url || url === ''){
        notification({
            title:'ajax参数错误',
            message:'src，第二个参数必传',
            type:'error'
        });
        return;
    };
    if(url.endsWith(".json")){
        return new Promise(function(resolve,reject){
            fetch(url).then(function(response){
                if(!response.ok){
                    throw new Error('网络请求错误');
                };
                return response.json();
            }).then(function(data){
                resolve(data);
            }).catch(function(error){
                reject(error);
            })
        })
    };
    return new Promise(function(resolve,reject){
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        xhr.open(methods,url,true);
        if(methods === 'POST'){
            xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        };
        if(data){
            var data2 = null;
            for(var key in data){
                data2 += key + '=' + data[key] + '&';
            };
            data2 = data2.slice(0,data2.length - 1);
            xhr.onreadystatechange = function(){
                if(xhr.readyState === 4){
                    if(xhr.status === 200){
                        resolve(xhr.responseText);
                    }else{
                        reject(xhr.status)
                    }
                }
            };
            xhr.send(data2);
        }else{
            xhr.onreadystatechange = function(){
                if(xhr.readyState === 4){
                    if(xhr.status === 200){
                        resolve(xhr.responseText);
                    }else{
                        reject(xhr.status)
                    }
                }
            };
            xhr.send(null);
        }
    });
};

/**
 * Cookie 操作函数（设置、获取、删除）
 * @param {string} code - 操作类型：'get'（获取）、'set'（设置）、'delete'（删除）
 * @param {string} str - Cookie 的名称
 * @param {string} [data] - 可选，Cookie 的值（仅 'set' 时需传入）
 * @param {number} [time] - 可选，Cookie 的过期天数（默认 1 天，仅 'set' 时生效）
 * @example
 * // 设置cookie
 * cookie('set','name','张三',1);
 * // 获取cookie
 * cookie('get','name');
 * // 删除cookie
 * cookie('delete','name');
 */
function cookie(code,str,data,time){
    var type = code ? code.toLowerCase():'';
    if(type !== 'get' && type !== 'set' && type !== 'delete'){
        notification({
            title:'cookie参数错误提示',
            message:'第一个参数取值范围：【get，set，delete】',
            type:'error'
        });
        return;
    };
    var setCookie = function(name,value,days){
        var expires = '';
        if(days){
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        };
        document.cookie = name + '=' + value + expires + "; path=/";
    };
    var getCookie = function(name){
        var nameEQ = name + '=';
        var cookies = document.cookie.split(';');
        for(var i=0;i<cookies.length;i++){
            var cookie1 = cookies[i];
            while(cookie1.charAt(0) === ' '){
                cookie1=cookie1.substring(1,cookie1.length);
            };
            if(cookie1.indexOf(nameEQ) === 0){
                return cookie1.substring(nameEQ.length,cookie1.length);
            }
        };
        return null;
    };
    if(type === 'set'){
        var a = time || 1;
        var b = data || '';
        var c = getCookie(str);
        if(c === null || c !== str){
            setCookie(str,b,a);
        }
    };
    if(type === 'get'){
        return getCookie(str);
    };
    if(type === 'delete'){
        document.cookie = '$' + str + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
};

/**
 * 深拷贝函数（支持对象、数组、Date、RegExp 及循环引用）
 * @param {*} params - 需要拷贝的目标值（任意类型）
 * @param {WeakMap} [defaultValue] - 可选，用于处理循环引用的 WeakMap（内部递归使用，无需手动传入）
 * @returns {*} 深拷贝后的新对象或原始值（若无需拷贝）
 */
function deepClone(params,defaultValue){
    var obj = params || {};
    var hash = defaultValue || new WeakMap();
    if(obj === null) return null;
    if(obj instanceof Date) return new Date(obj);
    if(obj instanceof RegExp) return new RegExp(obj);
    if(typeof obj !== 'object') return obj;
    if(hash.has(obj)) return hash.get(obj);
    var cloneObj = new obj.constructor();
    hash.set(obj,cloneObj);
    for(var key in obj){
        if(obj.hasOwnProperty(key)){
            cloneObj[key] = deepClone(obj[key],hash);
        }
    };
    return cloneObj;
};

/**
 * 深度合并多个对象（支持循环引用检测）
 * @param {...Object} objs - 需要合并的对象（可传入多个）
 * @returns {Object} 合并后的新对象
 * @description
 * 1. 递归合并对象的可枚举属性（包括嵌套对象）
 * 2. 自动处理循环引用（避免无限递归）
 * 3. 数组合并规则：直接覆盖（非深度合并）
 * 4. 非对象属性直接覆盖
 */
function deepMerge(...objs){
    var seen = new WeakMap();
    var isObject = function(item){
        return (item && typeof item === 'object' && !Array.isArray(item));
    };
    var merge = function(target,source,sourceIndex){
        if(seen.has(source)) return seen.get(source);
        seen.set(source,source);
        for(var key in source){
            if(source.hasOwnProperty(key)){
                var targetValue = target[key];
                var sourceValue = source[key];
                if(isObject(sourceIndex) && isObject(targetValue)){
                    merge(targetValue,sourceValue,sourceIndex);
                }else{
                    target[key] = sourceValue;
                }
            }
        }
    };
    if(objs.length === 0) return {};
    var result = Object.assign({},objs[0]);
    for(var i=0;i<objs.length;i++){
        merge(result,objs[i],i);
    };
    return result;
};

/**
 * 数字/字符串填充函数（支持前导补位或后导补位）
 * @param {number|string} num - 需要填充的目标值（数字或字符串）
 * @param {number} n - 填充后的总长度
 * @param {string} str - 用于填充的字符（通常为单个字符，如 '0'、' '）
 * @param {boolean} [code=false] - 可选，填充模式：
 *   - true:  前导补位（在开头填充）
 *   - false: 后导补位（在末尾填充，默认）
 * @returns {string} 填充后的字符串
 * @example
 * ez(5, 3, '0')       // 返回 "005"（后导补位）
 * ez(5, 3, '0', true) // 返回 "500"（前导补位）
 */
function ez(num,n,str,code){
    var type = code || false;
    var targetStr = String(num);
    if(targetStr.length >= n){
        return targetStr;
    };
    var padLength = n - targetStr.length;
    var padStr = str.repeat(padLength).slice(0,padLength);
    return type ? padStr + targetStr : targetStr + padStr;
};

/**
 * 字体样式操作工具函数
 * @param {string} [selector] - CSS选择器，可选。若不传则默认选择所有元素('*')
 * @returns {Object} 返回包含多个方法的字体操作对象
 * @example
 * fonts('div').size(1.2).color('#ff0000');
 */
function fonts(selector){
    var fontObj = {};
    fontObj.elements = typeof selector === 'string' ? document.querySelectorAll(selector) : document.querySelectorAll('*');
    fontObj.unit = 'px';
    fontObj.initialFontSize = new WeakMap();
    fontObj.lastSize = null;
    var initializeInitialFontSize = function(){
        Array.prototype.forEach.call(fontObj.elements,function(element){
            if(!fontObj.initialFontSize.has(element)){
                var currentFontSize = window.getComputedStyle(element).fontSize;
                fontObj.initialFontSize.set(element,parseFloat(currentFontSize));
            }
        })
    };
    var applySize = function(){
        if(!fontObj.lastSize) return;
        initializeInitialFontSize();
        Array.prototype.forEach.call(fontObj.elements,function(element){
            var initialFontSize = fontObj.initialFontSize.get(element);
            var newFontSize = Math.round(initialFontSize * Number(fontObj.lastSize));
            element.style.fontSize = newFontSize + fontObj.unit;
        });
    };
    fontObj.size = function(multiplier){
        if(multiplier && !isNaN(Number(multiplier))){
            initializeInitialFontSize();
            fontObj.lastSize = multiplier;
            applySize();
        };
        return this;
    };
    fontObj.color = function(color){
        if(color){
            Array.prototype.forEach.call(fontObj.elements,function(element){
                element.style.color = color;
            });
        };
        return this;
    };
    fontObj.set = function(unit){
        if(unit){
            fontObj.unit = unit;
            applySize();
        };
        return this;
    };
    return fontObj;
};

/**
 * 从当前URL的查询参数中获取指定参数值或全部参数对象
 * @function getSearchString
 * @param {string} [params=""] - 需要获取的查询参数键名（可选）。若留空则返回全部参数对象
 * @returns {(string|object|null)} - 返回结果取决于输入参数：
 *   - 当params为空时：返回包含所有查询参数的键值对对象
 *   - 当params有值时：返回对应参数值（若不存在则返回null并显示通知）
 * @example
 * // 示例URL: http://example.com?name=张三&age=20
 * getSearchString();      // 返回: {name: "张三", age: "20"}
 * getSearchString("age"); // 返回: "20"
 * getSearchString("sex"); // 显示通知"当前地址栏没有您需要的参数：sex"，返回null
 * @description
 * 1. 解析当前窗口URL的search部分（问号后的查询字符串）
 * 2. 将查询字符串转换为参数键值对对象
 * 3. 对参数名和值都执行decodeURIComponent解码
 * 4. 当目标参数不存在/值为空时，会触发UI通知提示
 * @notice 函数内部使用了全局的notification方法显示提示信息
 */
function getSearchString(params) {
    var key = params || "";
    var url = window.location.search;
    var obj = {};
    if (url) {
        var str = url.substring(1);
        var arr = str.split('&');
        for (var i = 0; i < arr.length; i++) {
            var paramPair = arr[i].split('=');
            var paramName = decodeURIComponent(paramPair[0] || "");
            var paramValue = decodeURIComponent(paramPair[1] || "");
            if (paramName) {
                obj[paramName] = paramValue;
            }
        }
    }
    if (key === "") {
        return obj;
    } else {
        if (obj[key] === undefined || obj[key] === "") {
            if(key && key !== ''){
                notification({
                    title:'getSearchString返回值提示',
                    message:'当前地址栏没有您需要的参数：' + key,
                    type:'success'
                });
            }
            return null;
        } else {
            return obj[key];
        }
    }
};

/**
 * 颜色格式转换工具（HEX和RGBA互转）
 * @param {string} color - 颜色值，支持 #RGB/#RRGGBB 或 rgba(r,g,b,a)
 * @param {number} [opacity=1] - 透明度（0-1）
 * @returns {string} 转换后的颜色值
 * 
 * // 示例：
 * hexRGBA("#f00") => "rgba(255,0,0,1)"
 * hexRGBA("rgba(255,0,0,0.5)") => "#ff0000"
 */
function hexRGBA(params,opacity){
    var color =params || '';
    var alpha = isNaN(Number(opacity))?1:Number(opacity);
    var colors = '';
    if(color === ''){
        return;
    };
    var detectColorType = function(color){
        if (/^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),?\s*(0|1|0\.\d+)?\)$/i.test(color)){
            return "RGBA";
        }else if(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/i.test(color)){
            return "HEX";
        }else{
            return "Color Name";
        }
    };
    var convertRGBAToHex = function(rgba){
        var [r,g,b]=rgba.replace(/^rgba?\(|\s+|\)$/g, '').split(',').slice(0,3).map(Number);
        var hex = "#" + (r >> 16).toString().padStart(2,'0') + (g >> 16).toString().padStart(2,'0') + (b >> 16).toString().padStart(2,'0');
        return hex;
    };
    var convertHexToHex = function(hex){
        if(hex.length===4){
            hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
        };
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return 'rgba('+r+','+g+','+b+','+alpha+')';
    };
    switch (detectColorType(color)){
        case 'RGBA':
            colors = convertRGBAToHex(color);
            break;
        case 'HEX':
            colors = convertHexToHex(color);
            break;
        default:
            notification({
                title:"hexRGBA参数提示",
                message:'函数 hexRGBA 不支持颜色名称转换',
                type:'error'
            })
    };
    return colors;
};

/**
 * 检查字符串是否为有效路径格式
 * @param {string} path - 要检查的路径字符串
 * @returns {boolean} 返回true表示是有效路径，false表示无效
 * @description
 * 支持检查两种路径格式：
 * 1. 本地路径：以/开头，可包含字母、数字、下划线和连字符（如 /user/profile）
 * 2. URL路径：http/https协议开头的网址（如 https://example.com/path）
 * 
 * @example
 * isPath('/user/profile') // true
 * isPath('https://example.com') // true
 * isPath('invalid path') // false
 * isPath('') // 显示错误提示并返回false
 */
function isPath(params) {
    var str = params || '';
	if (str === '') {
		notification({
			title: 'isPath提示',
			message: '参数不能为空！',
			type: 'error',
		});
		return false;
	}
	var pathRegex = /^(\/[\w-]+)+\/?|^(http|https):\/\/[\w-.]+\.[\w-./?%&=]*$/;
	return pathRegex.test(str);
};

/**
 * 格式化数字字符串，添加千位分隔符
 * @param {string|number} value - 要格式化的数字或字符串
 * @returns {string} 格式化后的字符串（带千位分隔符）
 * @description
 * 1. 处理整数和小数（如 1234567.89 → 1,234,567.89）
 * 2. 支持负数（如 -1234567 → -1,234,567）
 * 3. 空值会触发错误提示
 * 
 * @example
 * numberString(1234567) // "1,234,567"
 * numberString("-1234567.89") // "-1,234,567.89"
 * numberString("") // 显示错误提示并返回undefined
 */
function numberString(value){
    var str = value || '';
    if(str === ''){
        this.notification({
			title: 'numberString提示',
			message: '参数必传',
			type: 'error',
		});
		return;
    };
    str = String(str);
    var isNegative = str.startsWith('-');
    if(isNegative) {
        str = str.substring(1); // 移除负号临时处理
    }
    var decimalIndex = str.indexOf('.');
    var formattedStr;
    if(decimalIndex !== -1){
        var integerPart = str.slice(0,decimalIndex);
        var decimalPart = str.slice(decimalIndex);
        integerPart = integerPart.replace(/(?=(\d{3})+(?!\d))/g, ',');
	    formattedStr = integerPart + decimalPart;
    }else{
        formattedStr = str.replace(/(?=(\d{3})+$)/g, ',');
    };
    if (formattedStr[0] === ',') {
		formattedStr = formattedStr.slice(1, formattedStr.length);
	};
    if(isNegative){
        formattedStr = '-' + formattedStr;
    };
    return formattedStr;
};

/**
 * 全屏/退出全屏切换控制函数
 * @function screenful
 * @param {string|null} [params=null] - 需要全屏显示的DOM元素ID（可选）
 * @description
 * 1. 功能说明：
 *    - 不传参数时：切换整个文档的全屏状态
 *    - 传入元素ID时：切换指定元素的全屏状态
 * 2. 浏览器兼容性：
 *    - 支持所有现代浏览器的全屏API（包括带前缀的版本）
 *    - 包括：标准API、Firefox(moz)、IE/Edge(ms)、Opera(o)、Chrome/Safari(webkit)
 * 3. 特性：
 *    - 自动检测当前全屏状态，实现切换功能
 *    - 如果当前已在全屏状态，则执行退出操作
 * 
 * @example
 * // 切换整个页面全屏
 * screenful();
 * 
 * // 切换指定元素全屏（ID为"video-container"的元素）
 * screenful("video-container");
 * 
 * @note 需要在用户交互事件（如click）中调用，否则浏览器可能会阻止全屏请求
 */
function screenful(params) {
    var id = params || null;
	if (!id) {
		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		} else if (document.documentElement.mozRequestFullScreen) {
			document.documentElement.mozRequestFullScreen();
		} else if (document.documentElement.msRequestFullscreen) {
			document.documentElement.msRequestFullscreen();
		} else if (document.documentElement.oRequestFullScreen) {
			document.documentElement.oRequestFullScreen();
		} else if (document.documentElement.webkitRequestFullScreen) {
			document.documentElement.webkitRequestFullScreen();
		}
		if (document.fullscreenElement !== null) {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.oRequestFullScreen) {
				document.oRequestFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			}
		}
	} else {
		const full = document.getElementById(id);
		if (full.requestFullscreen) {
			full.requestFullscreen();
		} else if (full.mozRequestFullScreen) {
			full.mozRequestFullScreen();
		} else if (full.msRequestFullscreen) {
			full.msRequestFullscreen();
		} else if (full.oRequestFullScreen) {
			full.oRequestFullScreen();
		} else if (full.webkitRequestFullScreen) {
			full.webkitRequestFullScreen();
		}
		if (document.fullscreenElement !== null) {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.oRequestFullScreen) {
				document.oRequestFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			}
		}
	}
};

/**
 * 获取当前系统时间并格式化为结构化对象
 * @function systemTime
 * @returns {Object} 包含格式化时间信息的对象
 * @description
 * 返回包含以下属性的时间对象：
 * - Years: 四位数的年份（如 2023）
 * - Month: 两位数的月份（01-12）
 * - Date: 两位数的日期（01-31）
 * - Hours: 两位数的小时（00-23）
 * - Minutes: 两位数的分钟（00-59）
 * - Seconds: 两位数的秒数（00-59）
 * - Week: 格式化星期（如 "星期三"）
 * 
 * @example
 * // 返回示例：
 * {
 *   Years: 2023,
 *   Month: "08",
 *   Date: "15",
 *   Hours: "14",
 *   Minutes: "05",
 *   Seconds: "30",
 *   Week: "星期二"
 * }
 */
function systemTime() {
	var Years = new Date().getFullYear();
	var Month = new Date().getMonth() + 1;
	var No = new Date().getDate();
	var Hours = new Date().getHours();
	var Minutes = new Date().getMinutes();
	var Seconds = new Date().getSeconds();
	var Day = new Date().getDay();
	var newD = ['日', '一', '二', '三', '四', '五', '六'];
	if (Month < 10) { Month = '0' + Month; }
	if (No < 10) { No = '0' +　No; }
	if (Hours < 10) { Hours = '0' + Hours; }
	if (Minutes < 10) { Minutes = '0' + Minutes; }
	if (Seconds < 10) { Seconds = '0' + Seconds; }
	var Week = newD[Day];
	return {
		Years:Years,
		Month:Month,
		Date: No,
		Hours:Hours,
		Minutes:Minutes,
		Seconds:Seconds,
		Week: '星期' + Week,
	};
}

/**
 * 动态创建DOM元素并设置属性和内容
 * @function createTag
 * @param {string} name - 要创建的HTML标签名（如'div'、'a'等）
 * @param {Array<Array<string>>} [att] - 属性键值对数组（可选）
 * @param {string} [html] - 元素内部HTML内容（可选）
 * @returns {HTMLElement} 创建并配置好的DOM元素
 * @description
 * 1. 创建一个指定类型的HTML元素
 * 2. 支持批量设置元素属性（传入二维数组）
 * 3. 支持设置元素内部HTML内容
 * 
 * @example
 * // 创建一个带href属性的链接
 * const link = createTag('a', [['href','https://example.com']], '点击这里');
 * 
 * // 创建一个简单的div
 * const div = createTag('div', null, 'Hello World');
 * 
 * // 创建带多个属性的按钮
 * const btn = createTag('button', [
 *   ['class', 'primary-btn'],
 *   ['id', 'submit-btn'],
 *   ['disabled', 'true']
 * ], '提交');
 */
function createTag(name,att,html){
    var tag = document.createElement(name);
    if(att && att.length > 0){
        for(var i = 0;i < att.length;i++){
            tag.setAttribute(att[i][0],att[i][1]);
        }
    };
    if(html){
        tag.innerHTML = html;
    };
    return tag;
};

/**
 * 动态创建SVG图标元素
 * @function createSvg
 * @param {string} pathData - SVG path路径数据
 * @param {string} color - 图标填充颜色（支持颜色名称、HEX、RGB等）
 * @param {string} [className='icon'] - 自定义CSS类名（默认'icon'）
 * @returns {SVGElement} 创建好的SVG元素
 * @description
 * 1. 创建一个标准SVG元素（1024x1024 viewBox）
 * 2. 内置默认样式类名'icon'
 * 3. 自动设置SVG版本和视图框
 * 
 * @example
 * // 创建红色箭头图标
 * const arrowSvg = createSvg(
 *   'M512 0L288 224v448l224 224 224-224V224z',
 *   'red',
 *   'arrow-icon'
 * );
 * 
 * // 创建默认样式的蓝色图标
 * const userSvg = createSvg(
 *   'M512 512m-256 0a256 256 0 1 0 512 0 256 256 0 1 0-512 0Z',
 *   '#1890ff'
 * );
 */
function createSvg(pathData,color,className){
    if(!className){
        className = 'icon';
    };
    var svgNS="http://www.w3.org/2000/svg";
    var svg=document.createElementNS(svgNS,'svg');
    svg.setAttribute('class',className);
    svg.setAttribute('viewBox','0 0 1024 1024');
    svg.setAttribute('version','1.1');
	var paths = Array.isArray(pathData) ? pathData : [pathData];
	var colors;
	if(Array.isArray(color)){
		colors = [];
		for(var i=0;i<paths.length;i++){
			colors.push(color[i] || color[0] || 'currentColor');
		}
	}else{
		colors = [];
		var defaultColor = color || 'currentColor';
		for (var j = 0; j < paths.length; j++) {
			colors.push(defaultColor);
		}
	};
	for (var k = 0; k < paths.length; k++) {
		var pathElement = document.createElementNS(svgNS, 'path');
		pathElement.setAttribute('d', paths[k]);
		pathElement.setAttribute('fill', colors[k]);
		svg.appendChild(pathElement);
	}
    return svg;
};

/**
 * 函数节流装饰器，限制函数的执行频率
 * @param {Function} fn - 需要节流的原函数
 * @param {number} [time=500] - 节流时间间隔（毫秒）
 * @param {boolean} [type=true] - 节流模式：true表示立即执行模式，false表示延迟执行模式
 * @returns {Function} - 经过节流处理的新函数
 * 
 * @example
 * // 基本用法
 * const throttledFn = throttle(() => console.log('resized'), 200);
 * window.addEventListener('resize', throttledFn);
 * 
 * @description
 * 该节流函数支持两种模式：
 * 1. 立即执行模式(type=true)：首次调用立即执行，后续在节流时间内只执行最后一次调用
 * 2. 延迟执行模式(type=false)：在节流时间结束后执行最后一次调用
 * 
 * 注意：函数内部使用了闭包变量lastTime和timer来跟踪状态
 */
function throttle(fn,time,type){
    var delay = time || 500;
    var immediate = typeof type === 'undefined'?true:type;
    var lastTime = 0;
    var timer = null;
    return function(...args){
        var context = this;
        var now = Date.now();
        if (immediate && lastTime === 0) {
            fn.apply(context, args);
            lastTime = now;
            return;
        };
        if (now - lastTime < delay) {
            if (timer) {
                clearTimeout(timer);
            };
            timer = setTimeout(function () {
                lastTime = Date.now();
                fn.apply(context, args);
            }, delay - (now - lastTime));
        } else {
            lastTime = now;
            fn.apply(context, args);
        }
    }
};

/**
 * 显示一个模态确认对话框
 * 
 * 此函数会创建一个美观的模态对话框，包含标题、消息内容和确认/取消按钮。
 * 用户点击按钮后会触发回调函数并自动移除对话框元素。
 * 
 * @param {string} message - 对话框中显示的主要消息内容
 * @param {Function} callback - 用户点击按钮后的回调函数，接收一个参数:
 *      'confirm' 表示用户点击了确认按钮
 *      'cancel' 表示用户点击了取消按钮
 * @param {string} [title='系统提示'] - 对话框标题(可选)
 * 
 * @example
 * // 显示确认对话框并处理用户选择
 * confirm('确定要删除这条数据吗？', (result) => {
 *     if(result === 'confirm') {
 *         // 用户点击了确认
 *         deleteData();
 *     } else {
 *         // 用户点击了取消
 *         console.log('操作已取消');
 *     }
 * }, '删除确认');
 * 
 * @description
 * 对话框特性:
 * 1. 使用HTML5 dialog元素实现模态效果
 * 2. 包含半透明黑色遮罩层和模糊效果
 * 3. 自适应内容高度
 * 4. 点击按钮后自动清理DOM元素
 * 5. 内置蓝色信息图标
 */
function confirm(message,callback,title){
    var dialogId = random(10);
    var styleId = random(10);
    var dialog = document.createElement('dialog');
    var div1 = document.createElement('div');
    var div2 = document.createElement('div');
    var div3 = document.createElement('div');
    var div4 = document.createElement('div');
    var div5 = document.createElement('div');
    var div6 = document.createElement('div');
    var div7 = document.createElement('div');
    var button1 = document.createElement('button');
    var button2 = document.createElement('button');
    var styles = document.createElement('style');
    dialog.id = dialogId;
    dialog.className = 'confirm1' + dialogId;
    div1.className = 'confirm2' + dialogId;
    div2.className = 'confirm3' + dialogId;
    div3.className = 'confirm4' + dialogId;
    div4.className = 'confirm5' + dialogId;
    div5.className = 'confirm6' + dialogId;
    div6.className = 'confirm7' + dialogId;
    div7.className = 'confirm8' + dialogId;
    button1.className = 'confirm9' + dialogId;
    button2.className = 'confirm10' + dialogId;
    styles.id = styleId;
    var styleHtml = '';
    styleHtml += '.confirm1' + dialogId + '{width: 100%;height: 100%;border: none;background-color: transparent;padding: 0;margin: 0;outline: none;}';
    styleHtml += '.confirm1' + dialogId + '::backdrop{background-color: rgba(0,0,0,0.5);backdrop-filter: blur(5px);}';
    styleHtml += '.confirm2' + dialogId + '{width: 420px;height: auto;min-height: 160px;padding: 24px;box-sizing: border-box;background-color: #ffffff;box-shadow: 0 0 10px rgba(0,0,0,0.1);position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);border-radius: 4px;}';
    styleHtml += '.confirm3' + dialogId + '{display: flex;flex-direction: row;justify-content: flex-start;align-items: center;padding-top: 16px;box-sizing: border-box;width: 100%;height: 40px;}';
    styleHtml += '.confirm4' + dialogId + '{width: 21px;height: 21px;margin: 0 13.5px;background-color: #326FF1;border-radius: 50%;text-align: center;font-weight: bold;color: #ffffff;}';
    styleHtml += '.confirm5' + dialogId + '{font-size: 16px;color: #262A30;}';
    styleHtml += '.confirm6' + dialogId + '{width: 100%;height: auto;min-height: 36px;margin-top: 4px;padding-left: 48px;box-sizing: border-box;}';
    styleHtml += '.confirm7' + dialogId + '{line-height: 20px;font-size: 14px;color: #5C626B;}';
    styleHtml += '.confirm8' + dialogId + '{display: flex;flex-direction: row;justify-content: flex-end;align-items: center;}';
    styleHtml += '.confirm9' + dialogId + '{outline: none;border: none;background-color: #ffffff;width: 74px;height: 32px;text-align: center;line-height: 32px;color: #333333;font-size: 14px;border-radius: 6px;cursor: pointer;border: 1px solid #cbcfd6;}';
    styleHtml += '.confirm10' + dialogId + '{outline: none;border: none;background-color: #326FF1;width: 74px;height: 32px;text-align: center;line-height: 32px;color: #ffffff;font-size: 14px;border-radius: 6px;cursor: pointer;margin-left: 8px;}';
    var svg = '<svg t="1744277506525" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9253" width="16" height="16"><path d="M512 256c36.266667 0 64-27.733333 64-64s-27.733333-64-64-64-64 27.733333-64 64S475.733333 256 512 256zM512 341.333333c-36.266667 0-64 27.733333-64 64l0 426.666667c0 36.266667 27.733333 64 64 64s64-27.733333 64-64L576 405.333333C576 369.066667 548.266667 341.333333 512 341.333333z" p-id="9254" fill="#ffffff"></path></svg>';
    div3.innerHTML = svg;
    div4.textContent = title || '系统提示';
    div6.textContent = message || '';
    button1.textContent = '取消';
    button2.textContent = '确认';
    div2.appendChild(div3);
    div2.appendChild(div4);
    div5.appendChild(div6);
    div7.appendChild(button1);
    div7.appendChild(button2);
    div1.appendChild(div2);
    div1.appendChild(div5);
    div1.appendChild(div7);
    dialog.appendChild(div1);
    styles.innerHTML = styleHtml;
    document.head.appendChild(styles);
    document.body.appendChild(dialog);
    dialog.showModal();
    button1.onclick = function(event){
        event.stopPropagation();
        dialog.close();
        if(document.getElementById(styleId)){
            document.getElementById(styleId).parentNode.removeChild(document.getElementById(styleId));
        };
        if(document.getElementById(dialogId)){
            document.getElementById(dialogId).parentNode.removeChild(document.getElementById(dialogId));
        };
        if(callback){
            callback('cancel');
        }
    };
    button2.onclick = function(event){
        event.stopPropagation();
        dialog.close();
        if(document.getElementById(styleId)){
            document.getElementById(styleId).parentNode.removeChild(document.getElementById(styleId));
        };
        if(document.getElementById(dialogId)){
            document.getElementById(dialogId).parentNode.removeChild(document.getElementById(dialogId));
        };
        if(callback){
            callback('confirm');
        }
    }
};

/**
 * 智能合并多个选项（自动判断合并方式，忽略无效参数）
 * 
 * 规则：
 * 1. 跳过所有非对象/非数组参数，找到第一个有效参数确定类型
 * 2. 如果找到对象，则执行对象合并，忽略后续数组
 * 3. 如果找到数组，则执行数组合并，忽略后续对象
 * 4. 如果全部参数无效，返回null
 * 
 * @param {...(Object|Array)} [options] - 要合并的选项（对象或数组）
 * @returns {Object|Array|null} 合并后的结果
 * 
 * @example
 * // 对象合并（跳过非对象参数）
 * mergeOptions(null, {a:1}, [1,2]) // => {a:1}
 * 
 * @example
 * // 数组合并（跳过非数组参数）
 * mergeOptions(undefined, [1], {b:2}) // => [1]
 * 
 * @example
 * // 全部无效返回null
 * mergeOptions(null, undefined) // => null
 */
function merge() {
    var args = Array.prototype.slice.call(arguments);
    var mergeType = null;
    var firstValidIndex = -1;
    for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        if (Array.isArray(arg)) {
            mergeType = 'array';
            firstValidIndex = i;
            break;
        }
        if (typeof arg === 'object' && arg !== null) {
            mergeType = 'object';
            firstValidIndex = i;
            break;
        }
    }
    if (mergeType === null) return null;
    if (mergeType === 'object') {
        var result = {};
        for (var j = firstValidIndex; j < args.length; j++) {
            var item = args[j];
            if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
                for (var key in item) {
                    if (item.hasOwnProperty(key)) {
                        result[key] = item[key];
                    }
                }
            }
        }
        return result;
    } else {
        var result = [];
        var seen = new Set();
        for (var k = firstValidIndex; k < args.length; k++) {
            var element = args[k];
            if (Array.isArray(element)) {
                for (var m = 0; m < element.length; m++) {
                    var value = element[m];
                    var valueKey = typeof value + JSON.stringify(value);
                    if (!seen.has(valueKey)) {
                        seen.add(valueKey);
                        result.push(value);
                    }
                }
            }
        }
        return result;
    }
}

/**
 * 创建一个自动轮播滚动效果（支持横向或纵向滚动）
 * 
 * @param {string} id - 目标容器的ID（该容器应包含多个子元素）
 * @param {string} [type='top'] - 滚动方向，可选值：'top'（纵向滚动）或 'left'（横向滚动）
 * @param {number} [time=5000] - 轮播间隔时间（单位：毫秒）
 * @param {string} [size='0px'] - 滚动距离（CSS单位，如 '20px'）
 * @param {number} [num=1] - 触发轮播的最小子元素数量（若子元素数量不足，则不启动轮播）
 * @param {string} [margin='0px'] - 子元素默认外边距（用于复位）
 * @param {boolean} [lets=false] - 是否允许鼠标交互（鼠标悬停暂停轮播，移出恢复）
 * 
 * @example
 * // 纵向轮播示例（每5秒向上滚动20px）
 * appointScroll('container', 'top', 5000, '20px');
 * 
 * @example
 * // 横向轮播示例（每3秒向左滚动一个子元素宽度）
 * appointScroll('slider', 'left', 3000, '-100%', 1, '0px', true);
 */
function appointScroll(id,type,time,size,num,margin,lets){
    var timmerIDJSABC = null;
    var acquiesce = {
        lets:lets || false,
        type:type || 'top',
        time:Number(time) || 5000,
        margin:margin || '0px',
        size:size || '0px',
        num:num || 1
    };
    if(acquiesce.lets){
        clearInterval(timmerIDJSABC);
    };
    var childLabel = document.getElementById(id).children;
    for(var i=0;i<childLabel.length;i++){
        var item = childLabel[i];
        if(acquiesce.type === 'top'){
            item.style.transition = 'margin-top 0.8s';
        };
        if(acquiesce.type === 'left'){
            item.style.transition = 'margin-left 0.8s';
            item.style.float = 'left';
        }
    };
    if(acquiesce.type === 'left'){
        document.getElementById(id).style.width = (childLabel[0].clientWidth * childLabel.length) + 'px';
    };
    var MhyMar = function(){
        var first = document.getElementById(id).firstElementChild;
        switch (type){
            case 'left':
                first.style.marginLeft = acquiesce.margin;
                first.style.marginLeft = acquiesce.size;
                break;
            default:
                first.style.marginTop = acquiesce.margin;
				first.style.marginTop = acquiesce.size;
        };
        window.setTimeout(function(){
            switch (type){
                case 'left':
                    first.style.marginLeft = acquiesce.margin;
                    break;
                default:
                    first.style.marginTop = acquiesce.margin;
            };
            document.getElementById(id).appendChild(first);
        },800);
    };
    if(document.getElementById(id).children.length >= acquiesce.num){
        timmerIDJSABC = window.setInterval(MhyMar,acquiesce.time);
        if(acquiesce.lets){
            document.getElementById(id).onmousedown = function(){
                window.clearInterval(timmerIDJSABC);
            };
            document.getElementById(id).onmouseover = function(){
                window.clearInterval(timmerIDJSABC);
            };
            document.getElementById(id).onmouseout = function(){
                timmerIDJSABC = window.setInterval(MhyMar,acquiesce.time);
            };
        };
    }
};

/**
 * 数字动画函数
 * @param { object } options 配置对象
 * @property { number } from 起始数字
 * @property { number } to 目标数字
 * @property { number } duration 动画持续时间（毫秒）
 * @property { function } onUpdate 更新回调函数
 * @property { function } [onComplete] 动画完成回调函数
 * @property { string } [easing='linear'] 缓存函数类型
 * @property { number } [decimals=0] 保留小数位数
 * @returns { Object } 返回包含stop方法的对象
 * 
 * @example
 * // 启动动画
 *  var animation = animateNumber({
 *      from: 0,
 *      to: 1000,
 *      duration: 2000,
 *      decimals: 2,
 *      onUpdate: function(value) {
 *          document.getElementById('counter').innerHTML = value.toFixed(2);
 *      },
 *      onComplete: function() {
 *          alert('动画完成!');
 *      }
 *  });
 *
 *  // 停止按钮事件绑定
 *  var stopBtn = document.getElementById('stopBtn');
 *  if (stopBtn.attachEvent) {
 *      stopBtn.attachEvent('onclick', function() {
 *          animation.stop();
 *      });
 *  } else {
 *      stopBtn.addEventListener('click', function() {
 *          animation.stop();
 *      });
 *  }
 */
function animateNumber(options){
    if(!options || typeof options !== 'object'){
        alert('animateNumber函数报错！Options must be an object');
        throw new Error('Options must be an object');
    };
    var from = options.from !== undefined ? options.from : 0;
    var to = options.to !== undefined ? options.to : 0;
    var duration = options.duration !== undefined ? options.duration : 1000;
    var onUpdate = options.onUpdate;
    var onComplete = options.onComplete;
    var easing = options.easing || 'linear';
    var decimals = options.decimals !== undefined ? options.decimals : 0;
    if(typeof onUpdate !== 'function'){
        alert('animateNumber函数报错！onUpdate must be a function');
        throw new Error('onUpdate must be a function');
    };
    var easingFunctions = {
        linear:function(t){return t;},
        easeIn:function(t){return t * t;},
        easeOut:function(t){return t * (2 - t);},
        easeInOut:function(t){return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;}
    };
    var easingFunc = easingFunctions[easing] || easingFunctions.linear;
    var distance = to - from;
    var startTime = null;
    var animationId = null;
    var lastValue = null;
    var formatNumber = function(value){
        var factor = Math.pow(10,decimals);
        return Math.round(value * factor) / factor;
    };
    var step = function(){
        var currentTime = new Date().getTime();
        if(!startTime) startTime = currentTime;
        var elapsed = currentTime - startTime;
        var progress = Math.min(elapsed / duration,1);
        progress = easingFunc(progress);
        var currentValue = from + distance * progress;
        var formattedValue = formatNumber(currentValue);
        if(formattedValue !== lastValue){
            lastValue = formattedValue;
            onUpdate(formattedValue);
        };
        if(progress < 1){
            animationId = setTimeout(step,16);
        } else if (typeof onComplete === 'function'){
            onComplete();
        }
    };
    step();
    return {
        stop:function(){
            if(animationId){
                clearTimeout(animationId);
                animationId = null;
            }
        }
    }
};

/**
 * 右键菜单管理器 (单例模式)
 * 
 * 这是一个全局右键菜单解决方案，支持多区域注册、默认菜单、动画效果等功能。
 * 确保同一时间页面上只显示一个右键菜单。
 * 
 * @function rightClick
 * @param {Object} options - 配置选项
 * @param {Array} options.menuItems - 菜单项数组
 * @param {string} [options.menuClass] - 菜单容器CSS类名(以防被覆盖，请尽量约束样式或使用“!important”)
 * @param {string} [options.itemClass] - 菜单项CSS类名(以防被覆盖，请尽量约束样式或使用“!important”)
 * @param {string} [options.activeClass] - 激活状态CSS类名(以防被覆盖，请尽量约束样式或使用“!important”)
 * @param {boolean} [options.preventDefault=true] - 是否阻止默认右键行为
 * @param {number} [options.animationDuration=200] - 动画持续时间(ms)
 * @param {boolean} [options.closeOnClickOutside=true] - 点击外部是否关闭菜单
 * @param {boolean} [options.closeOnScroll=true] - 滚动时是否关闭菜单
 * @param {string|HTMLElement} [options.triggerArea=document] - 触发区域选择器或DOM元素
 * @param {boolean} [options.isDefault=false] - 是否设为默认菜单(未匹配区域时触发)
 * 
 * @returns {Object} 菜单API对象
 * 
 * @example
 * // 基本使用
 * const menu = rightClick({
 *   triggerArea: '#app', // 指定触发区域
 *   menuItems: [
 *     { text: '复制', action: () => console.log('复制') },
 *     { text: '粘贴', action: () => console.log('粘贴') }
 *   ]
 * });
 * 
 * @example
 * // 默认菜单(整个页面未匹配区域时触发)
 * const defaultMenu = rightClick({
 *   isDefault: true,
 *   menuItems: [
 *     { text: '全局选项1', action: () => alert('选项1') },
 *     { text: '全局选项2', action: () => alert('选项2') }
 *   ]
 * });
 * 
 * @example
 * // 带图标的菜单项
 * rightClick({
 *   menuItems: [
 *     { 
 *       text: '下载', 
 *       icon: '↓', 
 *       action: downloadFile 
 *     },
 *     { 
 *       text: '删除', 
 *       icon: '×', 
 *       action: deleteItem,
 *       disabled: true // 禁用状态
 *     }
 *   ]
 * });
 */
const rightClick = (function(){
    let currentMenu = null;
    const registeredMenus = [];
    const styleId = random(16,'str');
    let showTime = 0;
    
    // 显示菜单的统一方法
    function showMenu(menu,x,y){
        // 如果已经有其他菜单显示，先隐藏
        if(currentMenu && currentMenu !== menu){
            currentMenu.hide();
        };
        // 显示新菜单
        currentMenu = menu;
        menu.show(x,y);
    };
    
    // 全局事件处理函数
    function handleGlobalContextMenu(e){
        // 检查是否在已注册的区域内
        for(const menuInfo of registeredMenus){
            if(menuInfo.triggerArea.contains(e.target)){
                e.preventDefault();
                if (currentMenu && currentMenu === menuInfo.menu) {
                    currentMenu.hide();
                    currentMenu = null;
                };
                setTimeout(function(){
                    showMenu(menuInfo.menu, e.clientX, e.clientY);
                },showTime);
                return;
            }
        };
        // 默认菜单处理
        for(const menuInfo of registeredMenus){
            if(menuInfo.isDefault){
                e.preventDefault();
                if (currentMenu && currentMenu === menuInfo.menu) {
                    currentMenu.hide();
                    currentMenu = null;
                };
                setTimeout(function(){
                    showMenu(menuInfo.menu, e.clientX, e.clientY);
                },showTime);
                return;
            }
        }
    };
    
    // 全局点击外部处理
    function handleGlobalClickOutside(e){
        if (currentMenu && !currentMenu.element.contains(e.target)) {
            currentMenu.hide();
            currentMenu = null;
        }
    };
    
    // 全局滚动处理
    function handleGlobalScroll(){
        if (currentMenu) {
            currentMenu.hide();
            currentMenu = null;
        }
    };
    
    // 初始化全局监听
    document.addEventListener('contextmenu', handleGlobalContextMenu);
    document.addEventListener('click', handleGlobalClickOutside);
    window.addEventListener('scroll', handleGlobalScroll, true);
    
    createStyle();
    
    function createStyle(){
        const styles = createTag('style',[['id',styleId],['rel','stylesheet']]);
        const style = `
            .menu-${styleId} {
                position: fixed;
                display: none;
                opacity: 0;
                transform: scale(0.95);
                box-shadow: 0 0 8px rgba(191,191,191,0.8);
                background-color: #ffffff;
                border-radius: 4px;
                font-size: 16px;
                padding: 3px 0;
            }
            .menuItem-${styleId} {
                padding: 2px 5px;
            }
            .menuItem-${styleId} .menu-item-text{
                padding: 4px 5px;
                background-color: #ffffff;
                color: #333333;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.3s ease,color 0.3s ease;
                text-align: left;
            }
            .menuItem-${styleId}.select-${styleId} .menu-item-text{
                background-color: #246bcc;
                color: #ffffff;
            }
            .menuItem-${styleId}.separator{
                border-bottom: 1px solid #cecece;
                margin-bottom: 3px;
            }
            .menuItem-${styleId}.disabled .menu-item-text,.menuItem-${styleId}.select-${styleId}.disabled .menu-item-text{
                transition: none;
                cursor: default;
                background-color: #edecec;
                opacity: 0.6;
            }
        `;
        styles.innerHTML = style;
        document.head.appendChild(styles);
    };
    
    return function(options){
        // 默认配置
        const defaults = {
            menuItems: [],
            menuClass: `menu-${styleId}`,
            itemClass: `menuItem-${styleId}`,
            activeClass: `select-${styleId}`,
            preventDefault: true,
            animationDuration: 200,
            closeOnClickOutside: true,
            closeOnScroll: true,
            triggerArea: document,
            isDefault: false
        };
        
        // 合并配置
        const config = {
            ...defaults,
            ...options,
            menuClass: `${defaults.menuClass}${options.menuClass ? ' ' + options.menuClass : ''}`,
            itemClass: `${defaults.itemClass}${options.itemClass ? ' ' + options.itemClass : ''}`,
            activeClass: `${defaults.activeClass}${options.activeClass ? ' ' + options.activeClass : ''}`
        };
        
        // 获取触发区域
        const triggerArea = typeof config.triggerArea === 'string' ? document.querySelector(config.triggerArea) : config.triggerArea;
        
        // 创建菜单容器
        const menuElement = createTag('div',[['class',config.menuClass]]);
        Object.assign(menuElement.style,{
            zIndex: getMaxZIndex(),
            transition: `opacity ${config.animationDuration}ms ease, transform ${config.animationDuration}ms ease`
        });
        
        // 创建菜单项
        function createMenuItems(items){
            menuElement.innerHTML = '';
            items.forEach(item => {
                const menuItem = createTag('div',[['class',config.itemClass]]);
                if(item.icon){
                    const icon = createTag('span',[['class',"menu-item-icon"]],item.icon);
                    menuItem.appendChild(icon);
                };
                const text = createTag('div',[['class',"menu-item-text"]],item.text);
                menuItem.appendChild(text);
                if(item.separator){
                    menuItem.classList.add('separator');
                };
                if(item.disabled){
                    menuItem.classList.add("disabled");
                }else{
                    menuItem.addEventListener('click',function(e){
                        item.action?.();
                        hide();
                        e.stopPropagation();
                    });
                    menuItem.addEventListener('mouseenter',function(){
                        const classesToAdd = config.activeClass.split(/\s+/);
                        menuItem.classList.add(...classesToAdd);
                    });
                    menuItem.addEventListener('mouseleave',function(){
                        const classesToAdd = config.activeClass.split(/\s+/);
                        menuItem.classList.remove(...classesToAdd);
                    })
                };
                menuElement.appendChild(menuItem);
            });
        };
        
        // 初始化菜单项
        createMenuItems(config.menuItems);
        document.body.appendChild(menuElement);
        
        // 计算最佳显示位置
        function calculatePosition(x,y){
            // 临时显示菜单以获取尺寸
            const originalDisplay = menuElement.style.display;
            const originalOpacity = menuElement.style.opacity;
            const originalTransform = menuElement.style.transform;
            
            menuElement.style.display = 'block';
            menuElement.style.opacity = '0';
            menuElement.style.transform = 'scale(1)';
            menuElement.style.visibility = 'hidden'; // 防止闪烁
            menuElement.style.left = '0';
            menuElement.style.top = '0';
            
            const menuRect = menuElement.getBoundingClientRect();
            const menuWidth = menuRect.width;
            const menuHeight = menuRect.height;
            
            // 恢复原始状态
            menuElement.style.display = originalDisplay;
            menuElement.style.opacity = originalOpacity;
            menuElement.style.transform = originalTransform;
            menuElement.style.visibility = '';
            
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            let finalX = x + 5;
            let finalY = y + 5;
            let transformOrigin = 'top left';
            
            if (x + menuWidth > windowWidth) {
                finalX = x - menuWidth - 5;
                transformOrigin = 'top right';
            }
            if (y + menuHeight > windowHeight) {
                finalY = y - menuHeight - 5;
                transformOrigin = transformOrigin.replace('top', 'bottom');
            }
            
            finalX = Math.max(5, Math.min(finalX, windowWidth - menuWidth - 5));
            finalY = Math.max(5, Math.min(finalY, windowHeight - menuHeight - 5));
            
            return {
                x: finalX,
                y: finalY,
                transformOrigin,
                width: menuWidth,
                height: menuHeight
            };
        };
        
        // 隐藏菜单
        function hide() {
            if (menuElement.style.display === 'none') return;

            menuElement.style.opacity = '0';
            menuElement.style.transform = 'scale(0.95)';

            setTimeout(() => {
                menuElement.style.display = 'none';
            }, config.animationDuration);
        };
        
        // 显示菜单
        function show(x, y) {
            const position = calculatePosition(x, y);
            Object.assign(menuElement.style, {
                display: 'block',
                left: `${position.x}px`,
                top: `${position.y}px`,
                transformOrigin: position.transformOrigin
            });
            
            // 触发重绘
            void menuElement.offsetHeight;
            
            // 动画效果
            menuElement.style.opacity = '1';
            menuElement.style.transform = 'scale(1)';
            showTime = config.animationDuration;
        };
        
        // 创建菜单API对象
        const menuApi = {
            element: menuElement,
            show,
            hide,
            updateItems: function (newItems) {
                createMenuItems(newItems);
            },
            destroy: function () {
                if (currentMenu?.element === menuElement) {
                    currentMenu = null;
                }
                document.body.removeChild(menuElement);
                const index = registeredMenus.findIndex(m => m.menu === menuApi);
                if (index !== -1) {
                    registeredMenus.splice(index, 1);
                }
            }
        };
        
        // 注册当前菜单
        registeredMenus.push({
            menu: menuApi,
            triggerArea,
            isDefault: config.isDefault
        });

        return menuApi;
    }
})();

/**
 * 使指定元素及其直接子元素可拖拽，实现拖拽排序功能
 * @param { string } [element='body'] 目标元素，该元素下的直接子元素将被设置为可拖拽
 * @example
 * // 直接让body下直接一级元素可拖拽
 * draggable()/draggable('body');
 * // 指定元素下直接一级子元素可拖拽
 * draggable("#div")
 */
function draggable(element="body") {
    var node=document.querySelector(element);
	var objChind=new Array();
	var objs=node.getElementsByTagName("*");
	for(var i=0,j=objs.length;i<j;++i){
		if(objs[i].nodeType != 1){
			continue;
		};
		var temp=objs[i].parentNode;
		if(temp.nodeType == 1){
			if(temp == node){
				objChind[objChind.length]=objs[i]
			}
		}else if(temp.parentNode == node){
			objChind[objChind.length] = objs[i];
		};
	};
	for(var i=0;i<objChind.length;i++){
		if(objChind[i].getAttribute("draggable")=="true"){
			continue;
		}else{
			objChind[i].setAttribute("draggable","true");	
		}
	};
	var draging=null;
	node.ondragstart=function(event){
		event.dataTransfer.setData("text",event.target.innerText);//为了兼容IE,第一个参数只能是text,不区分大小写
		draging=event.target;
	};
	node.ondragover=function(event){
		event.preventDefault();
		var target=event.target;
		if(target.getAttribute("draggable")=="false" || !target.getAttribute("draggable")){
			return;
		}
		if(target !== draging){
			var targetRect=target.getBoundingClientRect();
			var dragingRect=draging.getBoundingClientRect();
			if(target){
				if(target.animated){
					return;
				}
			};
			if (_index(draging) < _index(target)) {
				target.parentNode.insertBefore(draging, target.nextSibling)
			} else {
				target.parentNode.insertBefore(draging, target)
			}
			_animate(dragingRect, draging)
			_animate(targetRect, target)
		}
	};
	function _index(el){
		var index=0;
		if(!el || !el.parentNode){
			return;
		};
		while (el && (el=el.previousElementSibling)){
			index++
		}
		return index;
	};
	function _animate(prevRect,target){
		var ms=300;
		if(ms){
			var currentRect=target.getBoundingClientRect();
			if(prevRect.nodeType===1){
				prevRect=prevRect.getBoundingClientRect();
			};
			_css(target, 'transition', 'none')
			_css(target, 'transform', 'translate3d(' + (prevRect.left - currentRect.left) + 'px,' + (prevRect.top - currentRect.top) + 'px,0)');
			target.offsetWidth;
			_css(target, 'transition', 'all ' + ms + 'ms');
			_css(target, 'transform', 'translate3d(0,0,0)');
			clearTimeout(target.animated);
			target.animated=setTimeout(function(){
				_css(target, 'transition', '');
				_css(target, 'transform', '');
				target.animated = false;
			},ms);
		}
	};
	function _css(el,prop,val){
		el.style[prop] = val + (typeof val === 'string' ? '' : 'px');
	}
};

/**
 * 全屏滚动切页组件 - 流畅优化版
 * @param {string|HTMLElement} container - 容器选择器或DOM节点
 * @param {Object} [options] - 配置项
 * @param {number} [options.duration=800] - 动画时长(ms)
 * @param {string} [options.easing='cubic-bezier(0.25, 0.1, 0.25, 1)'] - 动画缓动函数
 * @param {string} [options.direction='vertical'] - 'vertical'垂直|'horizontal'水平
 * @param {boolean} [options.infinite=true] - 是否无限循环
 * @param {Function} [options.beforeChange] - 切换前回调(prevIndex,nextIndex)
 * @param {Function} [options.afterChange] - 切换后回调(currentIndex)
 * @param {number} [options.throttleTime=800] - 滚轮节流时间(ms)
 * @param {number} [options.sensitivity=1] - 滚轮灵敏度(0-1)
 * 
 * @example // 基础使用
 * const pager = scrollPager('#pages', {
 *   duration: 500,
 *   afterChange: (index) => {
 *     console.log('当前页:', index + 1)
 *   }
 * });
 * 
 * @example // 手动控制
 * btnNext.addEventListener('click', () => pager.next());
 */
function scrollPager(container, options = {}) {
  // 合并默认配置
  const config = {
    duration: 800,
    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    direction: 'vertical',
    infinite: true,
    throttleTime: 800,
    sensitivity: 1,
    ...options
  };

  // 获取容器元素
  const containerEl = typeof container === 'string' 
    ? document.querySelector(container) 
    : container;
  
  if (!containerEl) {
    console.error('ScrollPager: Container not found');
    return;
  }

  // 设置容器样式
  Object.assign(containerEl.style, {
    overflow: 'hidden',
    position: 'relative',
    height: '100vh',
    width: '100%',
    touchAction: 'none' // 防止触摸默认行为
  });

  // 获取所有原始页面
  const originalPages = Array.from(containerEl.children);
  if (originalPages.length === 0) return;

  // 克隆首尾页面用于无限滚动
  let pages = [...originalPages];
  if (config.infinite && originalPages.length > 1) {
    const firstClone = originalPages[0].cloneNode(true);
    const lastClone = originalPages[originalPages.length - 1].cloneNode(true);
    
    containerEl.insertBefore(lastClone, originalPages[0]);
    containerEl.appendChild(firstClone);
    
    pages = [lastClone, ...originalPages, firstClone];
  }

  // 设置页面样式
  pages.forEach(page => {
    Object.assign(page.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      willChange: 'transform', // 提示浏览器优化
      backfaceVisibility: 'hidden' // 防止闪烁
    });
  });

  // 当前页面索引（考虑克隆页）
  let currentIndex = config.infinite ? 1 : 0;
  let isAnimating = false;
  let animationFrameId = null;
  let startTimestamp = null;
  let startPosition = 0;
  let targetPosition = 0;

  // 初始化页面位置
  function initPages() {
    cancelAnimationFrame(animationFrameId);
    pages.forEach((page, index) => {
      const translateValue = (index - currentIndex) * 100;
      page.style.transition = 'none';
      page.style.transform = config.direction === 'vertical' 
        ? `translateY(${translateValue}%)` 
        : `translateX(${translateValue}%)`;
    });
  }

  // 滚动到指定页面
  function scrollTo(index, isInstant = false) {
    if (isAnimating) return;
    
    const prevIndex = currentIndex;
    currentIndex = Math.max(0, Math.min(index, pages.length - 1));
    isAnimating = true;

    // 执行切换前回调（使用原始页面索引）
    const beforeChangePromise = typeof config.beforeChange === 'function'
      ? config.beforeChange(
          getOriginalIndex(prevIndex),
          getOriginalIndex(currentIndex))
      : Promise.resolve();

    beforeChangePromise.then(() => {
      // 检查是否需要无缝跳转
      let needsReset = false;
      let resetIndex = currentIndex;
      
      if (config.infinite && pages.length > 1) {
        if (currentIndex >= pages.length - 1) {
          needsReset = true;
          resetIndex = 1;
        } else if (currentIndex <= 0) {
          needsReset = true;
          resetIndex = pages.length - 2;
        }
      }

      // 如果需要无缝跳转
      if (needsReset) {
        animateScroll(isInstant).then(() => {
          isAnimating = false;
          currentIndex = resetIndex;
          updatePagesPosition(true);
          triggerAfterChange();
        });
      } else {
        animateScroll(isInstant).then(() => {
          isAnimating = false;
          triggerAfterChange();
        });
      }
    });
  }

  // 平滑滚动动画
  function animateScroll(isInstant) {
    return new Promise(resolve => {
      if (isInstant) {
        updatePagesPosition(true);
        resolve();
        return;
      }

      startTimestamp = null;
      startPosition = currentIndex;
      targetPosition = currentIndex;

      const animate = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / config.duration, 1);
        
        updatePagesPosition(false, progress);
        
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    });
  }

  // 获取原始页面索引（不考虑克隆页）
  function getOriginalIndex(index) {
    if (!config.infinite) return index;
    
    if (index <= 0) return originalPages.length - 1;
    if (index >= pages.length - 1) return 0;
    return index - 1;
  }

  // 更新页面位置
  function updatePagesPosition(isInstant, progress = 1) {
    const transition = isInstant 
      ? 'none' 
      : `transform ${config.duration}ms ${config.easing}`;
    
    pages.forEach((page, i) => {
      page.style.transition = transition;
      
      let translateValue;
      if (isInstant || progress === 1) {
        translateValue = (i - currentIndex) * 100;
      } else {
        const startValue = (i - startPosition) * 100;
        const endValue = (i - targetPosition) * 100;
        translateValue = startValue + (endValue - startValue) * progress;
      }

      page.style.transform = config.direction === 'vertical'
        ? `translateY(${translateValue}%)`
        : `translateX(${translateValue}%)`;
    });
  }

  // 触发切换后回调
  function triggerAfterChange() {
    if (typeof config.afterChange === 'function') {
      config.afterChange(getOriginalIndex(currentIndex));
    }
  }

  // 处理滚轮事件
  function handleWheel(e) {
    console.log("测试1",currentIndex)
    if (isAnimating) {
      e.preventDefault();
      return;
    }

    const delta = config.direction === 'vertical' 
      ? e.deltaY * config.sensitivity
      : e.deltaX * config.sensitivity;
    
    const direction = delta > 0 ? 1 : -1;
    
    // 非无限模式边界检查
    if (!config.infinite) {
      if ((direction < 0 && currentIndex === 0) || 
          (direction > 0 && currentIndex === originalPages.length - 1)) {
        e.preventDefault();
        return;
      }
    }
    
    scrollTo(currentIndex + direction);
    e.preventDefault();
  }

  // 处理触摸事件
  function handleTouchStart(e) {
    if (isAnimating) return;
    
    const touch = e.touches[0];
    startTouch = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  }

  function handleTouchMove(e) {
    if (!startTouch || isAnimating) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startTouch.x;
    const deltaY = touch.clientY - startTouch.y;
    
    // 根据滚动方向判断是否处理
    if (config.direction === 'vertical' && Math.abs(deltaY) > Math.abs(deltaX)) {
      e.preventDefault();
    } else if (config.direction === 'horizontal' && Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
    }
  }

  function handleTouchEnd(e) {
    if (!startTouch || isAnimating) return;
    
    const touch = e.changedTouches[0];
    const deltaTime = Date.now() - startTouch.time;
    const deltaX = touch.clientX - startTouch.x;
    const deltaY = touch.clientY - startTouch.y;
    
    let direction = 0;
    if (config.direction === 'vertical') {
      const distance = deltaY;
      const isQuickSwipe = deltaTime < 300 && Math.abs(distance) > 50;
      if (isQuickSwipe || Math.abs(distance) > window.innerHeight / 3) {
        direction = distance > 0 ? 1 : -1;
      }
    } else {
      const distance = deltaX;
      const isQuickSwipe = deltaTime < 300 && Math.abs(distance) > 50;
      if (isQuickSwipe || Math.abs(distance) > window.innerWidth / 3) {
        direction = distance > 0 ? 1 : -1;
      }
    }
    
    if (direction !== 0) {
      scrollTo(currentIndex + direction);
    }
    
    startTouch = null;
  }

  // 初始化
  initPages();

  // 事件监听
  const throttledWheel = throttle(handleWheel, config.throttleTime,true);
  containerEl.addEventListener('wheel', (e) => {
    // 非无限模式 + 到达边界时，直接拦截！
    if (!config.infinite) {
        const delta = config.direction === 'vertical' ? e.deltaY : e.deltaX;
        const direction = delta > 0 ? 1 : -1;

        if ((direction < 0 && currentIndex === 0) ||  // 第一页还往上滑
            (direction > 0 && currentIndex === originalPages.length - 1)) {  // 最后一页还往下滑
            e.preventDefault();
            return; // 直接退出，不进入节流函数！
        }
    }
    // 只有真正需要滚动时，才触发节流
    throttledWheel(e);
    }, { passive: false });
  
  // 触摸事件支持
  let startTouch = null;
  containerEl.addEventListener('touchstart', handleTouchStart, { passive: true });
  containerEl.addEventListener('touchmove', handleTouchMove, { passive: false });
  containerEl.addEventListener('touchend', handleTouchEnd, { passive: true });

  // 返回API方法
  return {
    next: () => {
      const nextIndex = config.infinite 
        ? currentIndex + 1
        : Math.min(currentIndex + 1, originalPages.length - 1);
      scrollTo(nextIndex);
    },
    prev: () => {
      const prevIndex = config.infinite
        ? currentIndex - 1
        : Math.max(currentIndex - 1, 0);
      scrollTo(prevIndex);
    },
    scrollTo: (index) => scrollTo(config.infinite ? index + 1 : index),
    getCurrentIndex: () => getOriginalIndex(currentIndex),
    getTotalPages: () => originalPages.length,
    destroy: () => {
      cancelAnimationFrame(animationFrameId);
      containerEl.removeEventListener('wheel', throttledWheel);
      containerEl.removeEventListener('touchstart', handleTouchStart);
      containerEl.removeEventListener('touchmove', handleTouchMove);
      containerEl.removeEventListener('touchend', handleTouchEnd);
      
      // 恢复原始DOM结构
      if (config.infinite && pages.length > originalPages.length) {
        containerEl.removeChild(pages[pages.length - 1]);
        containerEl.removeChild(pages[0]);
      }
    }
  };
}

/**
 * 计算指定日期到今天的时间差
 * @param {Date|string} targetDate 目标日期（支持 Date 对象或字符串格式：2023.10.01 / 2023/10/01 / 2023-10-01）
 * @param {string} [unit] 可选单位（'day' | 'hour' | 'minute' | 'second' | 'ms'）
 * @returns {number|Object} 传 unit 返回数字，不传返回 {day, hour, minute, second, ms}
 */
function getDateDiff(targetDate, unit) {
    // 1. 统一处理输入日期（兼容字符串和 Date 对象）
    let date;
    if (targetDate instanceof Date) {
        date = new Date(targetDate);
    } else {
        // 替换非标准分隔符为横杠（如 2023.10.01 → 2023-10-01）
        const normalizedDateStr = String(targetDate).replace(/[./]/g, '-');
        date = new Date(normalizedDateStr);
    }
    if (isNaN(date.getTime())) throw new Error(`Invalid date: ${targetDate}`);

    // 2. 计算时间差（毫秒）
    const now = new Date();
    const diffMs = Math.floor(now - date);

    // 3. 如果传了 unit，返回对应单位的数字
    if (unit) {
        switch (unit.toLowerCase()) {
            case 'ms': return diffMs;
            case 'second': return Math.floor(diffMs / 1000);
            case 'minute': return Math.floor(diffMs / (1000 * 60));
            case 'hour': return Math.floor(diffMs / (1000 * 60 * 60));
            case 'day': return Math.floor(diffMs / (1000 * 60 * 60 * 24));
            default: throw new Error('Invalid unit. Use: day/hour/minute/second/ms');
        }
    }

    // 4. 不传 unit 时返回对象
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return {
        day: days,
        hour: hours % 24,
        minute: minutes % 60,
        second: seconds % 60,
        ms: diffMs % 1000
    };
}