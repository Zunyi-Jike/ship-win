// 响应数据

//错误处理
function error(req, res, code, err, msg) {
	//得到信息
	if (err instanceof Error) err = err.message;
	//返回状态
	res.status(code);
	//默认错误
	err || (err = req.lang.back['err' + code]);
	//返回数据
	res.json({ code, err, msg: msg || '' });
}

//成功
exports.success = function (res, data) {
	res.status(200);
	res.json(data);
}

//400错误
exports.code400 = (req, res, err = "", msg = "") => error(req, res, 400, err, msg);

//404错误
exports.code404 = (req, res, err = "", msg = "") => error(req, res, 404, err, msg);

//500错误
exports.code500 = (req, res, err = "", msg = '') => error(req, res, 500, err, msg);

//503错误
exports.code503 = (req, res, err = "", msg = '') => error(req, res, 503, err, msg);