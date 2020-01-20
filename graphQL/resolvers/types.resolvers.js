/* eslint-disable no-return-await */
const db = require('../../models/index');

exports.User = {
  roadmaps: async (user) => {
    await db.Roadmaps.findAll({
      include: [
        {
          model: db.Users,
          where: { id: user.id },
        },
      ],
    });
  },
};

exports.Roadmap = {
  topics: async (roadmap) => await db.Topics.findAll({
    include: [
      {
        model: db.Roadmaps,
        where: { id: roadmap.id },
      },
    ],
  }),
  user: async (roadmap) => await db.Users.findOne({
    where: { id: roadmap.UserId },
  }),
};

exports.Topic = {
  checklist: async (topic) => await db.ChecklistItems.findAll({
    include: [
      {
        model: db.Topics,
        where: { id: topic.id },
      },
    ],
  }),
};
