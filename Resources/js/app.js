function initialize(container){
	return new Promise(function(resolve, reject){
        try {
            var element = document.querySelector(container || "body");
            if(!element){
                throw new Error("选择器中找不到元素：" + container);
            };
            element.style.opacity = 1;
            setTimeout(function(){
                resolve();
            },300);
        } catch(error) {
            reject(error);
        }
    })
};