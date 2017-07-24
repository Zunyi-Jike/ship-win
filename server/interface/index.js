let { createInterface, makeRoute } = require('./../lib/interface');
let IndexController = require('./../controller/Index');

module.exports = createInterface('/', IndexController, [
	//主路由
	makeRoute('/', 'get', 'index', { noToken: true }),
	makeRoute('/', 'post', 'index', { noToken: true }),
	makeRoute('/', 'put', 'index', { noToken: true }),
	makeRoute('/', 'delete', 'index', { noToken: true }),
])