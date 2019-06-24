var http = require('http')
var fs = require('fs')
var server = http.createServer()

var wwwDir = 'C:/Users/HP/nodejs/02/www'

server.on('request',function(req,res){
    var url = req.url
    fs.readFile(wwwDir + '/tample.html',function(err,data){
        if(err){
            return res.end('404 NOT FOUND.')
        }
        
        //  1.如何得到wwwDir目录列表中的文件名和目录名
        //      fs.readdir
        //  2.如何将得到的文件名和目录名替换到template.html中
        //      2.1在temple.html中需要替换的位置预留一个特殊的标记
        //      2.2根据files生成需要的HTML内容


        fs.readdir(wwwDir,function(err,files){
        //注意是readir 不是 readFile    注意！！！！！！！！！！！！！！！！！！
            if(err){
                return res.end('目录读取失败！！')
            }

            var content=''
            files.forEach(function (item) {
                content += `
            <tr>
                <td data-value="a.txt"><a class="icon file" draggable="true" href="/C:/Users/HP/nodejs/02/www/tample.html/a.txt">${item}</a></td>
                <td class="detailsColumn" data-value="39">39 B</td>
                <td class="detailsColumn" data-value="1551958490">2019/3/7 下午7:34:50</td>
            </tr>
                `
            })
            data = data.toString()

            //普通的字符串替换
            data = data.replace('^_^',content)

            res.end(data)
        })


        
    })
})

server.listen(3000,function(){
    console.log('running..........')
})