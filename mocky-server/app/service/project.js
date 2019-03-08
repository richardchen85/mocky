'use strict';

/**
 * mock project service
 */

const BaseService = require('../core/baseService');

module.exports = class ProjectService extends BaseService {
  constructor(args) {
    super(args);
    this.tableName = 'mk_project';
    this.updateFields = [ 'name', 'desc' ];
  }

  /**
   * insert project with members use sql transaction
   * @param {Object} project project
   * @example project
   *  {
   *    name: 'project1',
   *    desc: 'description of project1',
   *    members: [ 1111, 2222 ]
   *  }
   */
  async insert(project) {
    const trans = await this.app.mysql.beginTransaction();

    try {
      const members = project.members;
      delete project.members;
      const created = await trans.insert(this.tableName, project);
      // save members
      if (members && members.length > 0) {
        await this.ctx.service.member.insertByTransaction(trans, created.insertId, members);
      }
      await trans.commit();
    } catch (err) {
      await trans.rollback();
      throw err;
    }
  }

  /**
   * update project with members use sql transaction
   * @param {Object} project project
   * @example project
   *  {
   *    name: 'project1',
   *    desc: 'description of project1',
   *    members: [ 111, 222 ],
   *    status: dbStatus.NORMAL,
   *  }
   */
  async update(project) {
    const trans = await this.app.mysql.beginTransaction();

    try {
      const members = project.members;
      delete project.members;
      await trans.update(this.tableName, project);
      // sync members
      if (members) {
        await this.ctx.service.member.syncByProject(trans, project.id, members);
      }
      await trans.commit();
    } catch (err) {
      await trans.rollback();
      throw err;
    }
  }

  async deleteById(id) {
    const trans = await this.app.mysql.beginTransaction();

    try {
      await trans.delete(this.tableName, { id });
      await this.ctx.service.member.deleteByProject(trans, id);
      await trans.commit();
    } catch (err) {
      await trans.rollback();
      throw err;
    }
  }

  owned(user_id) {
    const param = {
      where: {
        user_id,
      },
      orders: [
        [ 'id', 'desc' ],
      ],
    };
    return super.query(param);
  }

  joined(user_id) {
    const { service } = this.ctx;
    const sql = `
      SELECT
        m.project_id, p.*
      FROM ${service.member.tableName} AS m
      INNER JOIN ${this.tableName} AS p
        ON m.project_id=p.id
      WHERE m.user_id=?
      ORDER BY p.id DESC
    `;

    return this.app.mysql.query(sql, [ user_id ]);
  }

  async ownerOrMember(project_id, user_id) {
    const memberTableName = this.ctx.service.member.tableName;
    const sql = `
      SELECT COUNT(*) AS count FROM (
        SELECT p1.id,p1.user_id FROM ${this.tableName} AS p1 WHERE p1.id=? AND p1.user_id=?
        UNION
        SELECT m.project_id,m.user_id FROM ${memberTableName} AS m JOIN ${this.tableName} AS p ON m.project_id=p.id
          WHERE m.project_id=? AND m.user_id=?
      ) AS rows
    `;
    const rows = await this.app.mysql.query(sql, [ project_id, user_id, project_id, user_id ]);
    return rows[0].count > 0;
  }
};