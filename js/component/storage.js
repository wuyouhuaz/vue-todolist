;
'use strict';
//设置本地历史记录(localStorage长期存储)(sessionStorage临时存储)
function setStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}
//获取本地历史纪录(localStorage长期存储)(sessionStorage临时存储)
function getStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}