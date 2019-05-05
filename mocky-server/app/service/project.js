'use strict';

/**
 * mock project service
 */

const BaseService = require('../core/baseService');
const cacheKeys = require('../common/cacheKeys');

module.exports = class ProjectService extends BaseService {
  constructor(args) {
    super(args);
    this.tableName = 'mk_project';
    this.updateFields = ['name', 'desc'];
    this.cacheKeyFn = cacheKeys.project;
  }

  /**
   * insert project with members use sql transaction
   * @param {Object} project project
   * @return {Number} id id
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
        await this.service.member.insertByTransaction(trans, created.insertId, members);
      }
      await trans.commit();

      return created.insertId;
    } catch (err) {
      await trans.rollback();
      throw err;
    }
  }

  async delete(id) {
    const { mysql } = this.app;
    const trans = await mysql.beginTransaction();

    try {
      await trans.delete(this.tableName, { id });
      await this.service.member.deleteByProject(trans, id);
      await trans.commit();
      await super.deleteCache(id);
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
    const { mysql } = this.app;
    const trans = await mysql.beginTransaction();

    try {
      const members = project.members;
      delete project.members;
      await trans.update(this.tableName, project);
      // sync members
      if (members) {
        await this.service.member.syncByProject(trans, project.id, members);
      }
      await trans.commit();
      await super.deleteCache(project.id);
    } catch (err) {
      await trans.rollback();
      throw err;
    }
  }

  async getById(id) {
    const { service } = this.ctx;

    let project = await super.getCache(id);

    if (!project) {
      project = await super.getById(id);

      // get owner
      project.owner = await service.user.getById(project.user_id);

      // get members
      let memberIds = await service.member.getByProject(project.id);
      memberIds = memberIds.map(m => m.user_id);
      if (memberIds.length > 0) {
        project.members = await service.user.search({
          where: {
            id: memberIds,
          },
        });
      } else {
        project.members = [];
      }

      project && await super.setCache(project);
    }

    return project;
  }

  async getByUser(user_id) {
    const { service } = this;
    const owned = await this.owned(user_id);
    const joined = await this.joined(user_id);

    joined.forEach(p1 => {
      if (p1.user_id !== user_id) {
        owned.push(p1);
      }
    });

    if (owned.length > 0) {
      const ownerIds = [];
      const projectIds = [];

      owned.forEach(p => {
        ownerIds.push(p.user_id);
        projectIds.push(p.id);
      });

      const ownerPromise = service.user.search({
        where: {
          id: ownerIds,
        },
      });
      const memberPromise = service.member.search({
        where: {
          project_id: projectIds,
        },
      });
      const [owners, members] = await Promise.all([ownerPromise, memberPromise]);

      let memberIds = [];
      owned.forEach(p => {
        p.owner = owners.find(u => u.id === p.user_id);
        const pMemberIds = members.filter(m => m.project_id === p.id).map(m => m.user_id);
        p.members = pMemberIds;
        memberIds = memberIds.concat(pMemberIds);
      });

      if (memberIds.length > 0) {
        const members = await service.user.search({
          where: {
            id: memberIds,
          },
        });
        owned.forEach(p => {
          p.members = p.members.map(mId => {
            return members.find(m => m.id === mId);
          });
        });
      }
    }

    return owned;
  }

  owned(user_id) {
    const param = {
      where: {
        user_id,
      },
      orders: [['id', 'desc']],
    };
    return super.search(param);
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

    return this.app.mysql.query(sql, [user_id]);
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
    const rows = await this.app.mysql.query(sql, [project_id, user_id, project_id, user_id]);
    return rows[0].count > 0;
  }

  async transfer(project_id, user_id) {
    await super.update({ id: project_id, user_id }, { where: { id: project_id } });
    await this.app.redis.del(this.cacheKeyFn(project_id));
  }
};
