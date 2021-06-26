const parser = require('@babel/parser');
const t = require('@babel/traverse');
const babel = require('@babel/core');

// 缺polyfill
const translateEs6 = (str) => {
    const ast = parser.parse(str, {sourceType: 'script'})

    const {code} = babel.transformFromAst(ast, null , {
        presets: ['@babel/preset-env']
    })
    return code
}


module.exports = {
    translateEs6,
}