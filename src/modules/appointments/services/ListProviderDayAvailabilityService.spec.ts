import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });
  it('should be able to list the providers availability in a specified day', async () => {
    fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 4, 19, 12, 0, 0),
    });

    fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 4, 19, 13, 0, 0),
    });

    const availability = await listProviderDayAvailability.execute({
      providerId: 'user',
      day: 19,
      year: 2020,
      month: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 12, available: false },
        { hour: 13, available: false },
        { hour: 14, available: true },
        { hour: 15, available: true },
      ]),
    );
  });
});
