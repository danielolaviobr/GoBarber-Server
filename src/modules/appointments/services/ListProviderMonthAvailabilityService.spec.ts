import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });
  it('should be able to list the providers availability in a specified month', async () => {
    fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2040, 4, 19, 8, 0, 0),
    });

    fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2040, 4, 19, 9, 0, 0),
    });

    fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2040, 4, 19, 10, 0, 0),
    });

    fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2040, 4, 19, 11, 0, 0),
    });

    fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2040, 4, 19, 12, 0, 0),
    });

    fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2040, 4, 19, 13, 0, 0),
    });

    fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2040, 4, 19, 14, 0, 0),
    });

    fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2040, 4, 19, 15, 0, 0),
    });

    fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2040, 4, 19, 16, 0, 0),
    });

    fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2040, 4, 19, 17, 0, 0),
    });

    fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2040, 4, 20, 15, 0, 0),
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'user',
      year: 2040,
      month: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 18, available: true },
        { day: 19, available: false },
        { day: 20, available: true },
        { day: 21, available: true },
      ]),
    );
  });
});
