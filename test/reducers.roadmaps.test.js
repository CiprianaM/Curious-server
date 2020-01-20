require('dotenv').config();
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

describe('roadmap mutations', () => {
  test('correctly adds new roadmap', async () => {
    db.Roadmaps.create.mockResolvedValue({ dataValues: { UserId: 22, title: 'Learn to draw', category: 'Personal Development' } });
    const resp = await mutationsResolvers.createRoadmap({}, { UserId: 22, title: 'Learn to draw', category: 'Personal Development' });
    expect(resp).toEqual({
      title: 'Learn to draw', category: 'Personal Development', UserId: 22, topics: [],
    });
  });
  test('calls create roadmap with the correct arguments', async () => {
    db.Roadmaps.create.mockResolvedValueOnce({ dataValues: { UserId: 22, title: 'Learn to draw', category: 'Personal Development' } });
    await mutationsResolvers.createRoadmap({}, { UserId: 22, title: 'Learn to draw', category: 'Personal Development' });
    expect(db.Roadmaps.create).toHaveBeenCalledWith({ title: 'Learn to draw', category: 'Personal Development', UserId: 22 });
  });
  test('given existing roadmap, should call update with correct arguments', async () => {
    db.Roadmaps.update.mockResolvedValueOnce([[9], [{ dataValues: { UserId: 7, title: 'Play Piano', category: 'Music' } }]]);
    await mutationsResolvers.updateRoadmap({}, { id: 5, title: 'Play piano', category: 'Music' });
    expect(db.Roadmaps.update).toHaveBeenCalledWith({ title: 'Play piano', category: 'Music' },
      { where: { id: 5 }, returning: true });
  });
  test('correctly updates existing roadmap', async () => {
    db.Roadmaps.update.mockResolvedValue([[9], [{ dataValues: { UserId: 7, title: 'Play Piano', category: 'Music' } }]]);
    const resp = await mutationsResolvers.updateRoadmap({}, { id: 5, title: 'Play piano', category: 'Music' });
    expect(resp).toEqual({ UserId: 7, category: 'Music', title: 'Play Piano' });
  });
  test('correctly deletes an existing roadmap', async () => {
    db.Roadmaps.destroy.mockResolvedValue(true);
    const resp = await mutationsResolvers.deleteRoadmap({}, { id: 10 });
    expect(resp).toEqual(10);
  });
  test('should throw error for incorrect deletion', async () => {
    db.Roadmaps.destroy.mockResolvedValueOnce(false);
    await expect(mutationsResolvers.deleteRoadmap({}, { id: 5 })).toReject();
  });
  test('given existing roadmap, should call destroy with correct arguments', async () => {
    db.Roadmaps.destroy.mockResolvedValueOnce(true);
    await mutationsResolvers.deleteRoadmap({}, { id: 42 });
    expect(db.Roadmaps.destroy).toHaveBeenCalledWith({ where: { id: 42 } });
  });
});
