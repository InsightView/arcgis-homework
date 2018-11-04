const fs = require('fs')

/**
 * 读取文件方法
 * @param  {string} 文件本地的绝对路径
 * @return {string|binary} 
 */
function file(filePath) {
    let content
    if (filePath.indexOf(".js") >= 0 || filePath.indexOf(".html") >= 0) {
        content = fs.readFileSync(filePath, 'utf8')
        // console.log(content)
    } else {
        content = fs.readFileSync(filePath, 'binary')
    }
    return content
}

module.exports = file