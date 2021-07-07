import * as parser from '@babel/parser';
import * as babel from '@babel/core';
import * as parserJsp from 'node-jsp';

var fs = require('fs');


const createJspPreprocessor = (args, config) => {
    return function jspPreprocessor(content, file, done) {
        var model = args;
        parserJsp(file.originalPath, content, model, config)
            .then(function (renderedContent) {
                done(null, renderedContent)
            }, function (error) {
                done(error);
            });

    };
}

// 缺polyfill
const translateEs6 = (str) => {
    const ast = parser.parse(str, {sourceType: 'script'})

    const {code} = babel.transformFromAst(ast, null , {
        presets: ['@babel/preset-env']
    })
    return code
}

const compilerScript = (scriptList) => {
    let targetScript = scriptList.find(i=>i.indexOf('/*start*/')>-1)
    let insertCode = scriptList.filter(i=>i.indexOf('/*start*/') === -1).map(i=> {
        return i.replace('<script>', '').replace('<\/script>', '')
    }).reduce((a,b)=>{return a+b}, '')
    targetScript = targetScript.replace('/*start*/', translateEs6(insertCode));
    return targetScript
}

const getHtml = (path) => {
    const file = fs.readFileSync(path);
    let data = file.toString();
    let scriptReg = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    const scriptList = data.match(scriptReg);
    let targetScript = compilerScript(scriptList);
    let str = data.replace(scriptReg, "");
    str += targetScript;
    return str;
}


export {
    translateEs6,
    getHtml,
    createJspPreprocessor,
}