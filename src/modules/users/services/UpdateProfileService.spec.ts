import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Douglas',
      email: 'test@test.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Felipe',
      email: 'felipe@teste.com',
    });

    expect(updatedUser.name).toBe('Felipe');
    expect(updatedUser.email).toBe('felipe@teste.com');
  });

  it('should not be able to update non-existing user profile', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'false-id',
        name: 'Felipe',
        email: 'felipe@teste.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user profile with email already used', async () => {
    await fakeUsersRepository.create({
      name: 'Douglas',
      email: 'douglas@test.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Felipe',
      email: 'felipe@test.com',
      password: '654321',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Felipe',
        email: 'douglas@test.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update user password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Douglas',
      email: 'test@test.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Felipe',
      email: 'felipe@teste.com',
      old_password: '123456',
      password: 'abcdef',
    });

    expect(updatedUser.password).toBe('abcdef');
  });

  it('should not be able to update user password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Douglas',
      email: 'test@test.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Felipe',
        email: 'felipe@teste.com',
        password: 'abcdef',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Douglas',
      email: 'test@test.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Felipe',
        email: 'felipe@teste.com',
        old_password: '654321',
        password: 'abcdef',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
