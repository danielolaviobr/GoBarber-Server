"use strict";

var _uuid = require("uuid");

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeNotificationsRepository = _interopRequireDefault(require("../../notifications/repositories/fakes/FakeNotificationsRepository"));

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _FakeAppointmentsRepository = _interopRequireDefault(require("../repositories/fakes/FakeAppointmentsRepository"));

var _CreateAppointmentService = _interopRequireDefault(require("./CreateAppointmentService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeAppointmentsRepository;
let fakeNotificationsRepository;
let fakeCacheProvider;
let createAppointment;
describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new _FakeAppointmentsRepository.default();
    fakeNotificationsRepository = new _FakeNotificationsRepository.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    createAppointment = new _CreateAppointmentService.default(fakeAppointmentsRepository, fakeNotificationsRepository, fakeCacheProvider);
  });
  it('shoud be able to create a new appointment', async () => {
    const provider_id = (0, _uuid.v4)();
    const user_id = (0, _uuid.v4)();
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime();
    });
    const appointment = await createAppointment.execute({
      date: new Date(2020, 5, 10, 13),
      provider_id,
      user_id
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(provider_id);
  });
  it('should not be able to create two appointments at the same date and time', async () => {
    const provider_id = (0, _uuid.v4)();
    const user_id = (0, _uuid.v4)();
    const date = new Date(2020, 4, 10, 12);
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 10).getTime();
    });
    await createAppointment.execute({
      date,
      user_id,
      provider_id
    });
    await expect(createAppointment.execute({
      date,
      provider_id,
      user_id
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    const provider_id = (0, _uuid.v4)();
    const user_id = (0, _uuid.v4)();
    const date = new Date(2020, 4, 10, 11);
    await expect(createAppointment.execute({
      date,
      provider_id,
      user_id
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    const provider_id = (0, _uuid.v4)();
    const user_id = provider_id;
    const date = new Date(2020, 4, 10, 13);
    await expect(createAppointment.execute({
      date,
      provider_id,
      user_id
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create an appointment before 8:00 nor after 17:00', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    const provider_id = (0, _uuid.v4)();
    const user_id = (0, _uuid.v4)();
    const date1 = new Date(2020, 4, 11, 7);
    const date2 = new Date(2020, 4, 11, 18);
    await expect(createAppointment.execute({
      date: date1,
      provider_id,
      user_id
    })).rejects.toBeInstanceOf(_AppError.default);
    await expect(createAppointment.execute({
      date: date2,
      provider_id,
      user_id
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});