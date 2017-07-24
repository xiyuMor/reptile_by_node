var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var url = ''
//操作页面
function filterChapters(html){
  var $ = cheerio.load(html)
  var chapters = $('.post-content')
  var arrTitle = chapters.find('.su-spoiler-title').text()
  var group = chapters.find('#con_tag').find('a').text()
  var images = chapters.find('.gallery-item').find('a')
  images.each(function(item){
    var img_url = $(this).attr('href')
    var img_title = $(this).attr('title')+'.jpg'
    request.head(img_url,function(err,res,body){
        if(err){
            console.log(err);
        }
    });
    request(img_url).pipe(fs.createWriteStream('./src/' + img_title))
  })
}
//获取页面信息
http.get(url,function(res){
  var html = ''

  res.on('data',function(data){
    html += data
  })

  res.on('end',function(){
    filterChapters(html);
  })
}).on('error',function(){
  console.log('获取数据有误！')
})
