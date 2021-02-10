"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _FakeUserTokensRepository = _interopRequireDefault(require("../repositories/fakes/FakeUserTokensRepository"));

var _ResetPasswordService = _interopRequireDefault(require("./ResetPasswordService"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRepository;
let fakeUserTokensRepository;
let fakeHashProvider;
let resetPassword;
describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeUserTokensRepository = new _FakeUserTokensRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    resetPassword = new _ResetPasswordService.default(fakeUsersRepository, fakeUserTokensRepository, fakeHashProvider);
  });
  it('shoud be able to reset password', async () => {
    const user = await fakeUsersRepository.createUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password'
    });
    const {
      token
    } = await fakeUserTokensRepository.generate(user.id);
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');
    await resetPassword.execute({
      password: 'newPassword',
      token
    });
    const updatedUser = await fakeUsersRepository.findOneByID(user.id);
    expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.password).toBe('newPassword');
    expect(generateHash).toHaveBeenCalledWith('newPassword');
  });
  it('should not be able to reset password with non-existing token', async () => {
    await expect(resetPassword.execute({
      token: 'fakeToken',
      password: 'fakePassword'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to reset password with non-existing user', async () => {
    const {
      token
    } = await fakeUserTokensRepository.generate('fakeUserID');
    await expect(resetPassword.execute({
      token,
      password: 'fakePassword'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to reset password 2 hours after token creation', async () => {
    const user = await fakeUsersRepository.createUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password'
    });
    const {
      token
    } = await fakeUserTokensRepository.generate(user.id);
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customHours = new Date();
      return customHours.setHours(customHours.getHours() + 3);
    });
    await expect(resetPassword.execute({
      password: 'newPassword',
      token
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});