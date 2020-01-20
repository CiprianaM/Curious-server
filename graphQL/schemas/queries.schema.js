module.exports = `
  type Query {
    user(UserID: ID): [User]
    roadmaps (UserId: ID, id: ID, category: String, title: String, offset: Int, limit: Int): [Roadmap]
    topics (RoadmapId: ID TopicId: ID): [Topic]
  }
  `;
