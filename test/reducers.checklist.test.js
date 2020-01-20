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

describe('checklist mutations', () => {
  test('correctly adds new checklist item', async () => {
    db.ChecklistItems.create.mockResolvedValue({ dataValues: { TopicId: 8, title: 'Open the computer' } });
    const resp = await mutationsResolvers.createChecklistItem({}, { title: 'Open the computer', TopicId: 8 });
    expect(resp).toEqual({ TopicId: 8, title: 'Open the computer' });
  });
  test('should throw an error for incorrect insertion of checklist item', async () => {
    db.ChecklistItems.create.mockResolvedValueOnce(false);
    await expect(mutationsResolvers.createChecklistItem({}, { title: 'Open the computer', TopicId: 8 })).toReject();
  });
  test('calls create checklist item with correct arguments', async () => {
    db.ChecklistItems.create.mockResolvedValueOnce({ dataValues: { TopicId: 8, title: 'Open the computer' } });
    await mutationsResolvers.createChecklistItem({}, { title: 'Open the computer', TopicId: 8 });
    expect(db.ChecklistItems.create).toHaveBeenCalledWith({ TopicId: 8, title: 'Open the computer' });
  });
  test('correctly updates existing checklist item', async () => {
    db.ChecklistItems.update.mockResolvedValue([[9], [{ dataValues: { id: 76, title: 'Open the computer', completed: true } }]]);
    const resp = await mutationsResolvers.updateChecklistItem({}, { id: 5, title: 'Open the computer', completed: true });
    expect(resp).toEqual({ id: 76, title: 'Open the computer', completed: true });
  });
  test('calls update checklist with the correct arguments', async () => {
    db.ChecklistItems.update.mockResolvedValueOnce([[9], [{ dataValues: { id: 76, title: 'Open the computer', completed: true } }]]);
    await mutationsResolvers.updateChecklistItem({}, { id: 76, title: 'Open the computer', completed: true });
    expect(db.ChecklistItems.update).toHaveBeenCalledWith({ title: 'Open the computer', completed: true },
      { where: { id: 76 }, returning: true });
  });
  test('correctly deletes existing checklist item', async () => {
    db.ChecklistItems.destroy.mockResolvedValue(true);
    const resp = await mutationsResolvers.deleteChecklistItem({}, { id: 47 });
    expect(resp).toEqual(47);
  });
  test('should throw error for incorrect deletion of checklist item', async () => {
    db.ChecklistItems.destroy.mockResolvedValue(false);
    await expect(mutationsResolvers.deleteChecklistItem({}, { id: 47 })).toReject();
  });
});
