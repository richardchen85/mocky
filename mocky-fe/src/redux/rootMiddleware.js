import { apiMiddleware } from './api';
import { middleware as authMiddleware } from './auth';
import { middleware as projectMiddleware } from './project';
import { middleware as dataMapMiddleware } from './dataMap';
import { middleware as mockMiddleware } from './mock';

export default [
  authMiddleware,
  projectMiddleware,
  dataMapMiddleware,
  mockMiddleware,
  // 必须在 feature middleware 的后面，才能捕获到由 feature middleware 触发的 action
  apiMiddleware,
];
