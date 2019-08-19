const { AuthenticationError } = require('apollo-server');
const Sequelize = require('sequelize');
const db = require('../../models/index');

const { Op } = Sequelize;

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

exports.roadmaps = async (obj, args, { user }) => {
  if (!user) throw new AuthenticationError('You must be logged in');

  if (args.category && args.title) {
    const regex = escapeRegexCharacters(args.title.trim());
    const roadmapsByCategory = await db.Roadmaps.findAll(
      {
        where: {
          category: args.category,
          title: {
            [Op.iRegexp]: regex,
          },
        },
      },
    );
    return roadmapsByCategory;
  }
  if (args.category) {
    const roadmapsByCategory = await db.Roadmaps.findAll({ where: { category: args.category } });
    return roadmapsByCategory;
  }
  if (!args.id) {
    const allRoadmaps = await db.Roadmaps.findAll();
    return allRoadmaps;
  }
  if (args.id === String(user.id)) {
    const roadmaps = await db.Roadmaps.findAll({ where: { UserId: args.id } });
    return roadmaps;
  }
  throw new Error('incorrect user');
};

exports.topics = async (obj, args, { user }) => {
  if (!user) throw new AuthenticationError('You must be logged in');
  const { RoadmapId, TopicId } = args;
  if (TopicId) {
    const topic = await db.Topics.findOne({ where: { id: TopicId } });
    return [topic];
  }
  if (RoadmapId) {
    const topics = await db.Topics.findAll({ where: { RoadmapId } });
    return topics;
  }
  throw new Error('please pass either a TopicId or a RoadmapId');
};
