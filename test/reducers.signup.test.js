require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models');

const mutationsResolvers = require('../graphQL/resolvers/mutations.resolvers');

jest.mock('../models', () => ({
  Roadmaps: {
    destroy: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
  ChecklistItems: {
    destroy: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
  Users: {
    destroy: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));
describe('user creation mutations', () => {
  test.only('correctly adds new user', async () => {
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
    bcrypt.hash.mockResolvedValue('abc');
    const hash = await bcrypt.hash('mypassword', saltRounds);
    db.Users.create.mockResolvedValue({
      name: 'Cipriana', email: 'cipriana@cipriana.com', id: 88, password: hash,
    });
    db.Users.findOne.mockResolvedValue(false);
    const resp = await mutationsResolvers.signup({}, {
      name: 'Cipriana', email: 'cipriana@cipriana.com', password: 'mypassword',
    });
    expect(resp).toEqual(jwt.sign({ id: 88, name: 'Cipriana', email: 'cipriana@cipriana.com' }, process.env.JWT_SECRET));
  });
  test('return empty string if user exists', async () => {
    await db.Users.findOne.mockResolvedValue(true);
    const resp = await mutationsResolvers.signup({}, {
      name: 'Cipriana', email: 'cipriana@cipriana.com', password: 'mypassword',
    });
    expect(resp).toEqual('');
  });
});
