'use strict';

const Controller = require('../core/baseController');
const userRule = require('../validateRules/user');
const messages = require('../common/messages');
const userStatus = require('../common/userStatus');
const emailTypes = require('../common/emailTypes');

class UserController extends Controller {
  async signUp() {
    const {
      config,
      ctx: { request, service, logger, cookies },
    } = this;

    if (!this.isValid(userRule.signUp, request.body)) return;

    const { email, mail_code, nickname, password } = request.body;
    const emailType = emailTypes.types.SIGN_UP.type;

    try {
      // 检查邮箱验证码
      const cachedCode = await service.sendMail.getEmailVerifyCode(email, emailType);
      if (!cachedCode || mail_code !== cachedCode) {
        this.fail(messages.common.invalidEmailCode);
        return;
      }

      // 重复检查
      const old = await service.user.checkExists(email, nickname);
      if (old) {
        this.fail(messages.user[old === 1 ? 'emailExists' : 'nickNameExists']);
        return;
      }

      const userId = await service.user.insert({
        email,
        nickname,
        password,
        status: userStatus.NORMAL,
      });

      cookies.set(config.auth_cookie_name, userId.toString(), {
        encrypt: true,
        httpOnly: true,
      });

      await service.sendMail.delEmailVerifyCode(email, emailType);

      this.success(userId);
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  async login() {
    const {
      config,
      ctx: { request, service, logger, cookies },
    } = this;

    if (!this.isValid(userRule.login, request.body)) return;

    const { email, password, remember } = request.body;

    try {
      const loginResult = await service.user.login(email, password);
      // 记住密码保存30天
      const maxAge = remember ? 30 * 24 * 60 * 60 * 1000 : null;
      if (loginResult.success) {
        cookies.set(config.auth_cookie_name, loginResult.id.toString(), {
          encrypt: true,
          maxAge,
          httpOnly: true,
        });

        this.success();
      } else {
        logger.warn(`用户登录失败，email: ${email}，password: ${password}`);
        this.fail(loginResult.code === 1 ? messages.user.emailNotExists : messages.user.passwordError);
      }
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  async logout() {
    this.ctx.cookies.set(this.config.auth_cookie_name);
    this.success();
  }

  async getUser() {
    const { user } = this.ctx;
    user ? this.success(user) : this.fail(messages.common.notLogged);
  }

  /**
   * 根据用户名搜索用户
   * @example
   *   get /user/search?key=abc
   */
  async search() {
    const { request, service, logger } = this.ctx;
    const { key } = request.query;

    if (!key) {
      this.fail(messages.common.paramError);
      return;
    }

    try {
      const users = await service.user.searchByNickname(key);
      this.success(users);
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  async resetPass() {
    const { request, service, logger } = this.ctx;

    if (!this.isValid(userRule.resetPass, request.body)) return;

    const { email, mail_code, password } = request.body;
    const emailType = emailTypes.types.RESET_PASS.type;

    try {
      // 检查邮箱验证码
      const cachedCode = await service.sendMail.getEmailVerifyCode(email, emailType);
      if (!cachedCode || mail_code !== cachedCode) {
        this.fail(messages.common.invalidEmailCode);
        return;
      }

      await service.user.resetPass(email, password);
      await service.sendMail.delEmailVerifyCode(email, emailType);
      this.success('密码修改成功');
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  async all() {
    const { request, service, logger } = this.ctx;
    const current = parseInt(request.query.current, 10) || 1;
    const pageSize = parseInt(request.query.pageSize, 10) || 20;

    try {
      const total = await service.user.count();
      let result = [];
      if (total > 0) {
        result = await service.user.search({
          limit: pageSize,
          offset: current - 1,
        });
      }
      this.success({
        page: {
          current,
          pageSize,
          total,
        },
        data: result,
      });
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  async changeStatus() {
    const { request, service, logger } = this.ctx;
    const { id, status } = request.query;

    if (!id || !status) {
      this.fail(messages.common.paramError);
      return;
    }

    try {
      const savedUser = await service.user.getById(id);
      savedUser.status = status;
      const result = await service.user.update(savedUser);
      this.success(result);
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }
}

module.exports = UserController;
