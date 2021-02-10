"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _celebrate = require("celebrate");

var _ensureAuthenticated = _interopRequireDefault(require("../../../../users/infra/http/middlewares/ensureAuthenticated"));

var _ProviderController = _interopRequireDefault(require("../controllers/ProviderController"));

var _ProviderDayAvailavilityController = _interopRequireDefault(require("../controllers/ProviderDayAvailavilityController"));

var _ProviderMonthAvailabilityController = _interopRequireDefault(require("../controllers/ProviderMonthAvailabilityController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const providersRouter = (0, _express.Router)();
providersRouter.use(_ensureAuthenticated.default);
const appointmentsController = new _ProviderController.default();
const providerDayAvailabilityController = new _ProviderDayAvailavilityController.default();
const providerMonthAvailabilityController = new _ProviderMonthAvailabilityController.default();
providersRouter.get('/', appointmentsController.index);
providersRouter.get('/:provider_id/day-availability', (0, _celebrate.celebrate)({
  [_celebrate.Segments.PARAMS]: {
    provider_id: _celebrate.Joi.string().uuid().required()
  }
}), providerDayAvailabilityController.index);
providersRouter.get('/:provider_id/month-availability', (0, _celebrate.celebrate)({
  [_celebrate.Segments.PARAMS]: {
    provider_id: _celebrate.Joi.string().uuid().required()
  }
}), providerMonthAvailabilityController.index);
var _default = providersRouter;
exports.default = _default;