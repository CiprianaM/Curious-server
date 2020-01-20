const EasyGraphQLTester = require('easygraphql-tester');
require('dotenv').config();

const types = require('../graphQL/schemas/types.schema');
const queries = require('../graphQL/schemas/queries.schema');
const mutations = require('../graphQL/schemas/mutations.schema');


const tester = new EasyGraphQLTester(types + queries + mutations);


describe('Graphql Schema', () => {
  describe('Should pass if the query is valid', () => {
    it('should get roadmaps', () => {
      // topics (RoadmapId: ID TopicId: ID): [Topic]
      const validRoadmapsQuery = `
      {
        roadmaps{
          id,
          title,
          topics{
            id,
            title,
            description,
            completed,
            rowNumber,
            checklist{
              id,
              title,
              completed
            }
          },
          category,
          UserId,
          user{
            id,
            name,
            email,
            token
          }
        }
      }
      `;
      // First arg: true, there is no invalidField on the schema.
      tester.test(true, validRoadmapsQuery);
    });

    it('should get topics', () => {
      // topics (RoadmapId: ID TopicId: ID): [Topic]
      const validTopicsQuery = `
      {
        topics{
          id,
          title,
          description,
          resources,
          completed,
          rowNumber,
          checklist{
            id,
            title,
            completed
          }
        }
      }
      `;
      // First arg: true, there is no invalidField on the schema.
      tester.test(true, validTopicsQuery);
    });
  });
});
