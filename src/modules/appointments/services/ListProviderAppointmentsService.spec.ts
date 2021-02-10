import { v4 as uuid } from 'uuid';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeCacheProvider: FakeCacheProvider;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;

describe('ListProviderAppointmentsService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to list the providers appointments in a specified day', async () => {
    const provider_id = uuid();
    const user_id = uuid();
    const appointment_1 = await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2020, 4, 19, 13, 0, 0),
    });

    const appointment_2 = await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2020, 4, 19, 14, 0, 0),
    });

    const appointments = await listProviderAppointmentsService.execute({
      provider_id,
      day: 19,
      year: 2020,
      month: 5,
    });

    expect(appointments).toEqual([appointment_1, appointment_2]);
  });
});
