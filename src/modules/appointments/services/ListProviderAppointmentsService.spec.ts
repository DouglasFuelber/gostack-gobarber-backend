import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list provider appointments in day', async () => {
    const ap1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'client',
      date: new Date(2020, 8, 20, 14, 0, 0),
    });

    const ap2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'client',
      date: new Date(2020, 8, 20, 10, 0, 0),
    });

    const ap3 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'client',
      date: new Date(2020, 8, 20, 15, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider',
      year: 2020,
      month: 9,
      day: 20,
    });

    expect(appointments).toEqual([ap1, ap2, ap3]);
  });
});
