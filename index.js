var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var path = require('path');
var url = ''

//操作页面
function filterChapters(html){
  var title = './src/'+url.split('.net/')[1]
  var $ = cheerio.load(html)
  var chapters = $('.post-content')
  var arrTitle = chapters.find('.su-spoiler-title').text()
  var group = chapters.find('#con_tag').find('a').text()
  var images = chapters.find('.gallery-item').find('a')
  mkdir(title);
  images.each(function(i,item){
    var img_url = $(this).attr('href')
    var img_title = $(this).attr('title')+'.jpg'
    console.log('正在下载第'+ i +'张')
    request.head(img_url,function(err,res,body){
        if(err){
          console.log('失败');
        }else{
          request(img_url).pipe(fs.createWriteStream(title + img_title))
          console.log('成功')
        }
    });

  })
}
//使用时第二个参数可以忽略
function mkdir(dirpath,dirname){
  //判断是否是第一次调用
  if(typeof dirname === "undefined"){
    if(fs.existsSync(dirpath)){
      return;
    }else{
      mkdir(dirpath,path.dirname(dirpath));
    }
  }else{
      //判断第二个参数是否正常，避免调用时传入错误参数
    if(dirname !== path.dirname(dirpath)){
      mkdir(dirpath);
      return;
    }
    if(fs.existsSync(dirname)){
      fs.mkdirSync(dirpath)
    }else{
      mkdir(dirname,path.dirname(dirname));
      fs.mkdirSync(dirpath);
    }
  }
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
