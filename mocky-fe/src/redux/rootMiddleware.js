import { apiMiddleware } from './api';
import { middleware as authMiddleware } from './auth';
import { middleware as projectMiddleware } from './project';

export default [
  authMiddleware,
  projectMiddleware,
  // 必须在 feature middleware 的后面，才能捕获到由 feature middleware 触发的 action
  apiMiddleware,
];
