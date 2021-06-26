var t = require('./t')
var fs = require('fs');
var path = require('path');
/*
 * 对目录中的所有文件操作
 * @param{ String } srcDir 转化路径
 * @param{ Func } cb 成功回调
 */
const handleFolder = function (srcDir, handle, cb) {
    fs.readdir(srcDir, function (err, files) {
        let count = 0;
        let checkEnd = function () {
            ++count == files.length && cb && cb();
        }
        if (err) {
            checkEnd();
            return;
        }
        files.forEach(function (file) {
            let srcPath = path.join(srcDir, file)
            handle(srcPath + '/tpl.html', srcPath + '/index.html')
        })
        //为空时直接回调
        files.length === 0 && cb && cb();
    })
}
const translateStr = (str, config, extraCofig) => {
    let target = str
    Object.keys(config).map(key=> {
        let reg = new RegExp('[$]{'+key+'}','g')
        target = target.replace(reg, config[key])
    })
    Object.keys(extraCofig).map(key=> {
        let reg = new RegExp('["|\'][$]{'+key+'}["|\']','g')
        target = target.replace(reg, `window.homeInfo.${extraCofig[key]}`)
    })
    // 检测是否存在未转化字段
    if (!checkTranslate(target)) {
        return ''
    }
    return target
}

const compilerScript = (scriptList) => {
    let targetScript = scriptList.find(i=>i.indexOf('/*start*/')>-1)
    let insertCode = scriptList.filter(i=>i.indexOf('/*start*/') === -1).map(i=> {
        return i.replace('<script>', '').replace('<\/script>', '')
    }).reduce((a,b)=>{return a+b}, '')
    targetScript = targetScript.replace('/*start*/', t.translateEs6(insertCode));
    return targetScript
}

const checkTranslate = (str) => {
    let variReg = /\$\{(\w+)\}/g
    let variableArrey = str.match(variReg)
    if (variableArrey && variableArrey.length > 0) {
        console.log(variableArrey, 'jsp变量暂未转换')
        return false
    }
    return true
}

module.exports = {
    handleFolder,
    translateStr,
    checkTranslate,
    compilerScript
}