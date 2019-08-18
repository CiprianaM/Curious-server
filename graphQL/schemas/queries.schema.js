module.exports = `
  type Query {
    roadmaps (id: ID category: String): [Roadmap]
    topics (RoadmapId: ID TopicId: ID): [Topic]
  }
  `;
