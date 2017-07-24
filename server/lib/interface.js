//用户接口相关处理

let { Router } = require('express')

let Controller = require('./../lib/controller')
let resBack = require('./../lib/res-back')


//创建一个接口
exports.createInterface = (name, controllerClass, routes) => {
	//测试控制器类是否正常
	if (!(new controllerClass({ test: 'kangkang' })) instanceof Controller) {
		throw new Error('【' + controllerClass.name + '】不是Controller的子类.')
	}
	//创建一个路由器
	let router = Router();
	//创建所有路由
	routes.forEach(route => {
		//处理一个路由
		router[route.method](route.name, async (req, res) => {
			try {
				//创建控制器
				let controller = new controllerClass(req, res);
				//将所有参数合并成一个
				let params = Object.assign({}, req.params || {}, req.query || {}, req.body || {}, req.files || {});
				//调用控制器函数
				let result = await controller[route.funcName].call(controller, params);
				//没有返回结果，表示服务器无响应
				if (undefined === result) resBack.code500(req, res, '');
				else {
					//返回的是一个函数表示要调用一下那个函数
					if (result instanceof Function) result(res);
					//否则返回结果
					else resBack.success(res, result);
					//请求成功后判断是否产生了myslq事务，如果产生了则提交事务
					req.mysqlTrans && req.mysqlConn.commit();
				}
			} catch (e) {
				//中断错误返回中断信息
				if (e instanceof Controller.AbortError) resBack.code500(req, res, e.message, e.msg);
				//其他错误，直接返回错误
				else {
					resBack.code500(req, res, '', e.message);
					console.log(e);
				}
			}
			//判断是否已经产生了数据库连接，如果已经产生需要调用断开方法断开连接
			req.mysqlConn && req.mysqlConn.end();
		})
	});
	//返回路由信息
	return { name, router };
}

//创建路由
exports.makeRoute = (name, method, funcName, args = {}) => ({ name, method, funcName, args });