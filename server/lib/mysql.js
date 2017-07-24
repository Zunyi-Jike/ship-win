let mysql = require('mysql');
let mysqlConf = require('./../config/server/mysql.json');

module.exports = class MySQL {
	//构造函数
	constructor(req) {
		this.req = req;
		if (!req.mysqlConn) this.connect(req);
		else this.connection = req.mysqlConn;
	}

	//创建连接
	async connect() {
		return new Promise((resolve, reject) => {
			this.connection = mysql.createConnection({
				host: mysqlConf.host,
				user: mysqlConf.user,
				password: mysqlConf.passwd,
				database: mysqlConf.db,
				charset: mysqlConf.charset
			});
			this.req.mysqlConn = this.connection;
			this.connection.connect(err => err ? reject(new Error('MySQL数据库连接失败')) : resolve(this.connection));
		});
	}

	//执行SQL语句
	async query(sql, ...args) {
		return new Promise((resolve, reject) => {
			let q = this.connection.query(sql, args, (err, results, fields) => {
				err ? reject(err) : resolve(results);
			});
			this.sql = q.sql;
		});
	}

	//开启事务
	async trans() {
		return new Promise((resolve, reject) => {
			if (this.req.mysqlTrans) {
				resolve();
				return;
			}
			//标记已经进行了事务操作
			this.req.mysqlTrans = true;
			this.connection.beginTransaction(err => err ? reject(err) : resolve());
		});
	}

	//事务回滚
	async back() {
		this.connection.rollback();
	}

	//提交事务
	async commit() {
		return new Promise((resolve, reject) => this.connection.commit(err => err ? reject(err) : resolve()));
	}

}