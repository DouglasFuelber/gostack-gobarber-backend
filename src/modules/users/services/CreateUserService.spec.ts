import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Douglas',
      email: 'test@test.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('test@test.com');
  });

  it('should not be able to create a new user with same email', async () => {
    await createUser.execute({
      name: 'Douglas',
      email: 'test@test.com',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'Felipe',
        email: 'test@test.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
