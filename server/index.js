// 服务端程序入口

const express = require('express')
const http = require('http')
const path = require('path')
const bodyParser = require('body-parser')
const multer = require('multer')
let logger = require('morgan')
let cros = require('cors')
let fs = require('fs')

let serverConfig = require('./config/server/server')
let resBack = require('./lib/res-back')
let mulLanguage = require('./lib/language')
let Controller = require('./lib/controller')



//创建应用和服务器
let app = express();
let server = http.createServer(app);


//静态资源
app.use(express.static(path.join(__dirname, './static')));

//模板引擎和视图
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'html');
app.engine('.html', require('hbs').__express);

//日志
app.use(logger('dev'));

//body处理
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//跨域请求
app.use(cros());

//form data 处理
app.use(multer({ dest: path.join(__dirname, './cache') }).any());

//多国语言
app.use(mulLanguage);

//接口路由处理
Controller.setApp(app);
fs.readdirSync(path.join(__dirname, './interface')).forEach(fileName => {
	let { name, router } = require('./interface/' + fileName);
	app.use(name, router);
});


//404错误处理
app.use((req, res, next) => resBack.code404(req, res));

//500错误处理
app.use((err, req, res, next) => {
	console.error(err);
	resBack.code500(req, res, err);
});

//监听端口
server.listen(serverConfig.PORT, () => console.log('Server is listen at port of ' + serverConfig.PORT));