const supertest = require('supertest');
const app = require('./server');
const jwt = require('jsonwebtoken');

// Mock MongoDB implementation
const mockMongoClient = {
  connect: jest.fn().mockResolvedValue(true),
  db: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue({
      findOne: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      deleteMany: jest.fn(),
    }),
  }),
  close: jest.fn(),
};

jest.mock('mongodb', () => ({
  MongoClient: jest.fn().mockImplementation(() => mockMongoClient),
}));

describe('Server Tests', () => {
  let request;
  let mockUser;

  beforeAll(() => {
    request = supertest(app);
    mockUser = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      months: Array(12).fill({ budget: null, total: null, expenses: {} }),
      timestamp: Date.now(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/signup', () => {
    it('should create a new user', async () => {
      mockMongoClient.db().collection().insertOne.mockResolvedValueOnce(true);

      const response = await request.post('/api/v1/signup').send(mockUser);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(mockMongoClient.db().collection().insertOne).toHaveBeenCalledTimes(1);
    });
  });
    describe('POST /api/v1/login', () => {
        it('should get login information', async () => {
            mockMongoClient.db().collection().findOne.mockResolvedValueOnce(true);

            const response = await request.post('/api/v1/login').send(mockUser.email);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(mockMongoClient.db().collection().findOne).toHaveBeenCalledTimes(1);
        });
    }); 

    describe('POST /api/v1/refresh-token', () => {
        it('should get a new token', async () => {
            const response = await request.post('/api/v1/refresh-token').send(mockUser);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });
    }); 
});
