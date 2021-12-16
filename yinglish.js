'use strict';
let yinglish_node = [];
let yinglish_node_to_translate = [];
let yinglish_node_translated = [];

function yinglish_generate(text, type, yin_number) {
    let reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
    if(!reg.test(text)){
        return text;
    }
    if (Math.random() > yin_number) {
        return text;
    }
    if (["，", "。", ",", "."].includes(text)) {
        return '……' + (Math.random() < 0.5 ? '' : '❤');
    }
    if (["!", "！"].includes(text)) {
        return '❤';
    }
    if (text.length > 1 && Math.random() < 0.5) {
        return text[0] + '……' + text;
    } else if ((type & 0x00100000) != 0){
        let text_yin = '';
        for (let i = 0; i < text.length; i++) {
            text_yin += '〇';
        }
        return '……' + text_yin;
    } else if((type & 0x00080000) != 0){
        let text_yin = '';
        if(text.length <= 1){
            return '揪~';
        }
        for(let i = 0; i < text.length; i += 2){
            text_yin += '噗叽';
        }
        text_yin += '~~~';
        return text_yin;
    } else if((type & 0x40000000) != 0){
        let number = parseInt(Math.random() * 10, 10) % 3;
        switch (number) {
            case 1:
                return '好大❤~~~';
            case 2:
                return '好硬❤~~~';
            default:
                return '坏掉了❤~~~';
        }
    } else if((type & 0x02000000) != 0){
        if(Math.random() < 0.5){
            return '在里面❤~~~';
        } else {
            return '在外面❤';
        }
    }else if((type & 0x00001000) != 0){
      if(Math.random() < 0.5){
          return '要去了~~~';
      } else {
          return '一起做❤';
      }
    }else if((type & 0x00000000) != 0){
        return '啊~什么要来了~~~';
    }else if((type & 0x00000080) != 0 || (type & 0x00000040) != 0 || (type & 0x00000001) != 0 || (type & 0x00010000) != 0){
        return text;
    }else {
        let text_yin = '哈';
        if(text.length <= 2){
            return '嗯~';
        }
        for(let i = 0; i < text.length; i += 2){
            text_yin += '啊';
        }
        text_yin += '~~~';
        return text_yin;
    }
}

async function yinglish_real_translate() {
    const segmentit = Segmentit.useDefault(new Segmentit.Segment());
    let total = 0;
    for (let key in yinglish_node) {
        let value = yinglish_node[key];
        walkTheDOM(value, function (node) {
            if (node.nodeType === 3) { // Is it a Text node?
                var text = node.data.trim();
                var parent = node.parentNode;
                var parent_parent = parent.parentNode;
                if (parent.nodeName != "SCRIPT"
                    && parent.nodeName != "NOSCRIPT"
                    && parent.nodeName != "STYLE"
                    && parent.nodeName != 'TEXTAREA'
                    && parent.nodeName != 'PRE'
                    && parent.nodeName != 'CODE'
                    && (parent_parent != null && parent_parent.nodeName != 'CODE')) {
                    if (text.length > 0) {
                        total++;
                    }
                }
            }
        });
    }
    let current = 0;
    for (let key in yinglish_node) {
        let value = yinglish_node[key];
        walkTheDOM(value, function (node) {
            if (node.nodeType === 3) { // Is it a Text node?
                var text = node.data.trim();
                var parent = node.parentNode;
                var parent_parent = parent.parentNode;
                if (parent.nodeName != "SCRIPT"
                    && parent.nodeName != "NOSCRIPT"
                    && parent.nodeName != "STYLE"
                    && parent.nodeName != 'TEXTAREA'
                    && parent.nodeName != 'PRE'
                    && parent.nodeName != 'CODE'
                    && (parent_parent != null && parent_parent.nodeName != 'CODE')) {
                    if (text.length > 0) {
                        const result = segmentit.doSegment(text);
                        let output = '';
                        for (let i = 0; i < result.length; i++) {
                            output += yinglish_generate(result[i]["w"], result[i]["p"], 0.4);
                        }
                        node.data = output;
                        current++;
                    }
                }
            }
        })
        yinglish_show_progress(current / total);
        yinglish_node_translated[value.id] = value.cloneNode(true);
        await sleep(500);
    }
    yinglish_show_complete(true);
}

function yinglish_show_origin(){
    for(let key in yinglish_node){
        let value = yinglish_node[key];
        value.replaceWith(yinglish_node_to_translate[key]);
        yinglish_node[key] = yinglish_node_to_translate[key];
    }
    yinglish_show_complete(false);
}

function yinglish_show_translated(){
    for(let key in yinglish_node){
        let value = yinglish_node[key];
        value.replaceWith(yinglish_node_translated[key]);
        yinglish_node[key] = yinglish_node_translated[key];
    }
    yinglish_show_complete(true);
}

function yinglish_start_translate(){
    if(document.getElementById("segmentit")){
        yinglish_real_translate();
        return;
    }
    let new_element = document.createElement("script");
    new_element.id = "segmentit";
    new_element.setAttribute("type", "text/javascript");
    new_element.setAttribute("src", "https://cdn.jsdelivr.net/npm/segmentit@2.0.3/dist/umd/segmentit.js");
    new_element.onload = yinglish_real_translate;
    document.body.appendChild(new_element);
}

function yinglish_show_window(){
    let yinglish_style = document.createElement("style");
    yinglish_style.innerHTML = 'div.translate_language {\n' +
        '            font-weight: bold;\n' +
        '            display: inline-block;\n' +
        '            text-decoration: underline;\n' +
        '        }\n' +
        '\n' +
        '        div.translate_banner {\n' +
        '            top: 0px;' +
        '            left: 0px;' +
        '            right: 0px;' +
        '            padding: 1% 0;\n' +
        '            background-color: #8866FF;\n' +
        '            color: #FFFFFF;\n' +
        '            width: 100%;\n' +
        '            min-height: 30px;\n' +
        '            text-align: center;\n' +
        '            z-index: auto;\n' +
        '            font-family: \'Noto Sans SC\', sans-serif;\n' +
        '            font-size: large;\n' +
        '            position: absolute;\n' +
        '            position: fixed;\n' +
        '            animation: yinglish_fly 1s ease-out 0s;\n' +
        '        }\n' +
        '\n' +
        '        @keyframes yinglish_fly {\n' +
        '            from {\n' +
        '                opacity: 0;\n' +
        '                transform: translateY(-50px)\n' +
        '            }\n' +
        '            to {\n' +
        '                opacity: 1;\n' +
        '                transform: translateY(0px)\n' +
        '            }\n' +
        '        }\n' +
        '\n' +
        '        @keyframes yinglish_fly_back {\n' +
        '            from {\n' +
        '                opacity: 1;\n' +
        '                transform: translateY(0px)\n' +
        '            }\n' +
        '            to {\n' +
        '                opacity: 0;\n' +
        '                transform: translateY(-50px)\n' +
        '            }\n' +
        '        }\n' +
        '\n' +
        '        .yinglish_button_positive {\n' +
        '            margin: 0 0.5% 0 2%;\n' +
        '            background-color: #FFFFFF;\n' +
        '            border-width: 0;\n' +
        '            outline: none;\n' +
        '            border-radius: 5%;\n' +
        '            font-family: \'Noto Sans SC\', sans-serif;\n' +
        '            font-size: medium;\n' +
        '        }\n' +
        '\n' +
        '        .yinglish_button_negative {\n' +
        '            background: transparent; /*按钮背景透明*/\n' +
        '            border-width: 0; /*边框透明*/\n' +
        '            outline: none; /*点击后没边框*/\n' +
        '            text-decoration: underline;\n' +
        '            color: #FFFFFF;\n' +
        '            padding: 0 5px 0 5px;\n' +
        '        }';

    document.head.appendChild(yinglish_style);

    let yinglish_container = document.createElement("div");
    yinglish_container.className = "translate_banner";
    yinglish_container.id = "yinglish_container";
    yinglish_container.innerHTML = '网页翻译 将 <div class="translate_language">简体中文</div>\n' +
        '    翻译成\n' +
        '    <div class="translate_language">淫语</div>\n' +
        '    <button id="yinglish_button_yes" class="yinglish_button_positive">翻译</button>\n' +
        '    <button id="yinglish_button_no" class="yinglish_button_negative">不用了，谢谢</button>\n' ;

    yinglish_container.onanimationstart = function () {
        console.log(yinglish_container.offsetHeight);
        document.documentElement.style.marginTop = yinglish_container.offsetHeight + 1 +'px';
    }

    document.body.insertBefore(yinglish_container, document.body.firstChild);

    document.getElementById("yinglish_button_yes").addEventListener("click", function () {
        yinglish_start_translate();
    });
    document.getElementById("yinglish_button_no").addEventListener("click", function () {
        yinglish_container.onanimationstart = null;
        yinglish_container.style.animation = 'yinglish_fly_back 1s ease-out 0s';
        yinglish_container.onanimationend = function () {
            yinglish_container.style.display = 'none';
        }
        document.documentElement.style.marginTop = 0 + 'px';
    });
}

function yinglish_show_progress(progress){
    document.getElementById("yinglish_container").innerHTML = '网页翻译 已完成：' + parseInt(progress * 99, 10) + '%......';
}

function yinglish_show_complete(showing_translated){
    document.getElementById("yinglish_container").innerHTML =  '网页翻译 已完成 <div class="translate_language">简体中文</div>\n' +
        '    到\n' +
        '    <div class="translate_language">淫语</div>\n';
    let yinglish_switch_action = (showing_translated ? yinglish_show_origin : yinglish_show_translated);
    let yinglish_switch_button = document.createElement("button");
    yinglish_switch_button.id = "yinglish_button_switch";
    yinglish_switch_button.className = "yinglish_button_positive";
    yinglish_switch_button.innerText = (showing_translated ? '显示原文' : '显示译文');
    yinglish_switch_button.addEventListener("click", function () {
        yinglish_switch_action();
    });
    document.getElementById("yinglish_container").appendChild(yinglish_switch_button);
}

function yinglish_setup(){
    document.head.innerHTML = document.head.innerHTML + '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
        '    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
        '    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@500&display=swap" rel="stylesheet">';
    let index = 0;
    var el = document.body.firstChild;
    while(el!==null){
        if(!el.id){
            el.id = "yinglish_" + index;
        }
        yinglish_node[el.id] = el;
        yinglish_node_to_translate[el.id] = el.cloneNode(true);
        index++;
        el=el.nextSibling;
    }
    yinglish_show_window();
}

/**
 * DOM遍历
 */
function walkTheDOM(node, func) {
    func(node);
    node = node.firstChild;
    while (node) {
        walkTheDOM(node, func);
        node = node.nextSibling;
    }
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
