"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dateFns = require("date-fns");

var _tsyringe = require("tsyringe");

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _iNotificationsRepository = _interopRequireDefault(require("../../notifications/repositories/iNotificationsRepository"));

var _iCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/models/iCacheProvider"));

var _iAppointmentsRepository = _interopRequireDefault(require("../repositories/iAppointmentsRepository"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let CreateAppointmentService = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('AppointmentsRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('NotificationsRepository')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('CacheProvider')(target, undefined, 2);
}, _dec5 = Reflect.metadata("design:type", Function), _dec6 = Reflect.metadata("design:paramtypes", [typeof _iAppointmentsRepository.default === "undefined" ? Object : _iAppointmentsRepository.default, typeof _iNotificationsRepository.default === "undefined" ? Object : _iNotificationsRepository.default, typeof _iCacheProvider.default === "undefined" ? Object : _iCacheProvider.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = class CreateAppointmentService {
  constructor(appointmentsRepository, notificationsRepository, cacheProvider) {
    this.appointmentsRepository = appointmentsRepository;
    this.notificationsRepository = notificationsRepository;
    this.cacheProvider = cacheProvider;
  }

  async execute({
    provider_id,
    user_id,
    date
  }) {
    const appointmentDate = (0, _dateFns.startOfHour)(date);
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate, provider_id);

    if (findAppointmentInSameDate) {
      throw new _AppError.default('This appointment is already booked.');
    }

    if ((0, _dateFns.isBefore)(appointmentDate, Date.now())) {
      throw new _AppError.default('Appointmenets can not be scheduled in the past');
    }

    if (user_id === provider_id) {
      throw new _AppError.default('Can not create an appointment with yourself');
    }

    if (appointmentDate.getHours() < 8 || appointmentDate.getHours() > 17) {
      throw new _AppError.default('Appointmnets can only be created between 8:00 and 17:00');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate
    });
    const formattedDate = (0, _dateFns.format)(date, "dd/MM/yyyy 'às' HH'h'");
    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para ${formattedDate}`
    });
    const cacheKey = `provider-appointments:${provider_id}:${(0, _dateFns.format)(appointmentDate, 'yyyy-M-d')}`;
    await this.cacheProvider.invalidate(cacheKey);
    return appointment;
  }

}) || _class) || _class) || _class) || _class) || _class) || _class);
var _default = CreateAppointmentService;
exports.default = _default;