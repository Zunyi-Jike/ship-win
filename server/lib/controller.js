//控制器处理

class Controller {

	//构造函数，req参数为请求，也可以是一个Controller对象，如果是Controller对象则使用该对象的req和res，否则使用req。
	//如果没有req或req不是Controller对象或req不是请求则抛出异常
	//res参数为响应，可以不传入，如果没有传入则不能使用this.res.xx
	constructor(req, res) {
		//req参数必传
		if (!req) throw new Error('创建控制器【' + this.constructor.name + '】失败，请传入参数：req');
		//如果是测试类型不用处理
		if (!req.test || req.test != 'kangkang') {
			if (req instanceof Controller) {
				//创建成功
				this.req = req;
				this.res = res;
			} else {
				//判断req的类型是不是正确
				if (!(req instanceof Controller.app.request.constructor)) {
					throw new Error('创建控制器【' + this.constructor.name + '】失败，req参数不是一个请求');
				} else {
					//创建成功
					this.req = req;
					this.res = res;
				}
			}
		}

	}

	//发送文件给客户端
	sendFile(...args) {
		return res => res.download(...args);
	}

	//重定向到一个页面
	redirect(...args) {
		return res => res.redirect(...args);
	}

	//渲染模板
	render(...args) {
		return res => res.render(...args);
	}

	//发送内容，内容可以是字符串或buffer
	send(...args) {
		return res => res.send(...args);
	}

	//报告错误并中断
	abort(err, msg = '') {
		throw new Controller.AbortError(err, msg);
	}
}


//中断错误
Controller.AbortError = class AbortError extends Error {
	constructor(err, msg = '') {
		super(err);
		this.msg = msg;
	}
}

//设置APP
Controller.setApp = (app) => {
	Controller.app = app;
}


module.exports = Controller;