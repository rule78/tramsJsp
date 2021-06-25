var fs = require('fs');
var path = require('path');
var fileHelper = require('../utils/files')
const chokidar = require('chokidar')

const defaultCofig = {
    payHost: 'pay.61info.cn',
}
const envCofig = {
    dev: {
        dengtaBakDomainUrl: 'http://dev.dengta-t-1.61hualala.com/',
        ...defaultCofig
    },
    test: {
        dengtaBakDomainUrl: "http://dengta-t-2.61hualala.com/",
        ...defaultCofig
    },
    product: {
        dengtaBakDomainUrl: "http://dengta-t-2.61hualala.com/",
        ...defaultCofig
    }
}

// 手动转换为小写
const extraCofig = {
    openId: 'openId', // sectionList
}

const entryPath = path.resolve(__dirname, '../html');

const translateFile = (entryHtmlPath, outPutPath) => {
    fs.readFile(entryHtmlPath,'utf-8',function(err,data) {
        if (err) {
            return console.error(err);
        }
        if (!process.env.target) {
            console.log('未设置打包环境变量');
            return
        }
        const config = envCofig[process.env.target]
        let scriptReg = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
        const scriptList = data.match(scriptReg);
        let targetScript = fileHelper.compilerScript(scriptList);

        data = data.replace(scriptReg, '');
        data = data + targetScript

        let html = fileHelper.translateStr(data, config, extraCofig)
        // 检测是否存在未转化字段
        if (!fileHelper.checkTranslate(html)) {
            return
        }
        //检测成功则写入
        fs.writeFile(outPutPath, html,  function(err) {
            if (err) {
                console.log('转换失败');
                return
            }
            console.log('转换成功')
        })
    });
}


if (process.env.mode === 'build') {
    fileHelper.handleFolder(entryPath, translateFile);
    return
}
fileHelper.handleFolder(entryPath, translateFile);
// 本地开发时使用
const targetPath = path.resolve(__dirname, '../html/test/tpl.html');
chokidar.watch(targetPath, {
    awaitWriteFinish: {
        stabilityThreshold:800,
        pollInterval: 800,
    }
}).on('change', function(){
    fileHelper.handleFolder(entryPath, translateFile);
})