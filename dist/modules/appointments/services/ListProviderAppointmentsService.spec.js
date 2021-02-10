"use strict";

var _uuid = require("uuid");

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _FakeAppointmentsRepository = _interopRequireDefault(require("../repositories/fakes/FakeAppointmentsRepository"));

var _ListProviderAppointmentsService = _interopRequireDefault(require("./ListProviderAppointmentsService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeCacheProvider;
let fakeAppointmentsRepository;
let listProviderAppointmentsService;
describe('ListProviderAppointmentsService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new _FakeAppointmentsRepository.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    listProviderAppointmentsService = new _ListProviderAppointmentsService.default(fakeAppointmentsRepository, fakeCacheProvider);
  });
  it('should be able to list the providers appointments in a specified day', async () => {
    const provider_id = (0, _uuid.v4)();
    const user_id = (0, _uuid.v4)();
    const appointment_1 = await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2020, 4, 19, 13, 0, 0)
    });
    const appointment_2 = await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2020, 4, 19, 14, 0, 0)
    });
    const appointments = await listProviderAppointmentsService.execute({
      provider_id,
      day: 19,
      year: 2020,
      month: 5
    });
    expect(appointments).toEqual([appointment_1, appointment_2]);
  });
});