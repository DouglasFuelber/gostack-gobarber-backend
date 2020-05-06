import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(
      fakeUsersRepository,
    );

    const user = await createUser.execute({
      name: "Douglas",
      email: "test@test.com",
      password: "123456"
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('test@test.com');
  });

  it('should not be able to create a new user with same email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(
      fakeUsersRepository,
    );

    const user = await createUser.execute({
      name: "Douglas",
      email: "test@test.com",
      password: "123456"
    });

    expect(createUser.execute({
      name: "Felipe",
      email: "test@test.com",
      password: "654321"
    })).rejects.toBeInstanceOf(AppError);
  });
});
