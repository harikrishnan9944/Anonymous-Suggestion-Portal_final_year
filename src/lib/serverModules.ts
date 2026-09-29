export function getServerModules() {
  const memoryStore: any = require('@server/store/memoryStore');
  const UserModel: any = require('@server/models/User');
  const SubmissionModel: any = require('@server/models/Submission');
  const CategoryModel: any = require('@server/models/Category');
  const DepartmentModel: any = require('@server/models/Department');
  const db: any = require('@server/config/db');
  const sentiment: any = require('@server/utils/sentiment');
  const similarity: any = require('@server/utils/similarity');

  return {
    memoryStore,
    UserModel,
    SubmissionModel,
    CategoryModel,
    DepartmentModel,
    connectDB: db.connectDB,
    getIsConnected: db.getIsConnected,
    analyzeSentiment: sentiment.analyzeSentiment,
    groupDuplicateIssues: similarity.groupDuplicateIssues
  };
}
