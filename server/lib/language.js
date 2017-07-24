//多国语言处理中间件

module.exports = (req, res, next) => {
	let lang = req.header('language') || 'zh-ch';
	req.lang = {
		back: require('./../language/zh-cn/back')
	};
	next();
}