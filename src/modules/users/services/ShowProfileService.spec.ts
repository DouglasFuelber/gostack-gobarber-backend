import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Douglas',
      email: 'test@test.com',
      password: '123456',
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('Douglas');
    expect(profile.email).toBe('test@test.com');
  });

  it('should not be able to show user profile of non-existing user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'false-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
