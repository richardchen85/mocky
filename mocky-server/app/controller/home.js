'use strict';

const Controller = require('../core/baseController');

class HomeController extends Controller {
  async index() {
    await this.ctx.render('index');
  }
}

module.exports = HomeController;
