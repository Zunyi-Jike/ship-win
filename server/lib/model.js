let MySQL = require('./mysql');

module.exports = class model {

	//构造函数
	constructor(controller) {
		let db = new MySQL(controller.req);
		//执行SQL语句
		//sql 为要执行的SQL语句
		//del_cols 表示从结果中删除某些列（仅查询语句可用），不需要则设置为null
		//其他的是参数
		this.query = async (sql, del_cols, ...args) => {
			let ret = await db.query(sql, ...args);
			this.sql = db.sql;
			//只针对数组进行列删除
			if (del_cols && ret instanceof Array) {
				//转换成数组
				if (!(del_cols instanceof Array)) del_cols = [del_cols];
				//处理每个查询结果
				ret.forEach(item => {
					//删除每个结果中的指定列
					let keys = Object.keys(item);
					del_cols.forEach(col => {
						//字符串直接比较
						if (typeof col == 'string') {
							if (keys.indexOf(col) >= 0) delete item[col];
						}
						//如果是正则表达式则依次比较每个key，遇到满足条件的删除
						else if (col instanceof RegExp) {
							keys.forEach(key => {
								if (col.test(key)) delete item[key];
							});
						}
					})
				})
			}
			return ret;
		};
		this.trans = async () => await db.trans();
		this.commit = async () => await db.commit();
		this.back = async () => db.back();
	}

};