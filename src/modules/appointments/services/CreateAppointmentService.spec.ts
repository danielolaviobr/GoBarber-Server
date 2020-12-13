import { v4 as uuid } from 'uuid';
import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });
  it('shoud be able to create a new appointment', async () => {
    const provider_id = uuid();

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(provider_id);
  });

  it('should not be able to create two appointments at the same date and time', async () => {
    const provider_id = uuid();
    const date = new Date(2020, 4, 19, 11);

    await createAppointment.execute({
      date,
      provider_id,
    });

    await expect(
      createAppointment.execute({
        date,
        provider_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
