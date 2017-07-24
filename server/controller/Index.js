let Controller = require('./../lib/controller');

let TestModel = require('./../model/Test');


let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = class IndexController extends Controller {

	async index(params) {
		return params;
	}
}