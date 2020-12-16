import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/iAppointmentsRepository';

import Appointment from '@modules/appointments/infra/typeorm/entities//Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/iCreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/iFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/iFindAllInDayFromProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date },
    });

    return findAppointment;
  }

  public async findAllInMonthFromProvider({
    providerId,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');
    const appointments = await this.ormRepository.find({
      where: {
        provider_id: providerId,
        date: Raw(
          dateFieldName => `
          to_char(${dateFieldName}, 'MM-YYYY' = '${parsedMonth}-${year}')
        `,
        ),
      },
    });

    return appointments;
  }

  public async findAllInDayFromProvider({
    providerId,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');
    const appointments = await this.ormRepository.find({
      where: {
        provider_id: providerId,
        date: Raw(
          dateFieldName => `
          to_char(${dateFieldName}, 'DD-MM-YYYY' = '${parsedDay}-${parsedMonth}-${year}')
        `,
        ),
      },
    });

    return appointments;
  }

  public async create(
    appointmentData: ICreateAppointmentDTO,
  ): Promise<Appointment> {
    const createdAppointment = this.ormRepository.create(appointmentData);
    await this.ormRepository.save(createdAppointment);

    return createdAppointment;
  }

  public async find(): Promise<Appointment[]> {
    const foundAppointments = await this.ormRepository.find();
    return foundAppointments;
  }
}

export default AppointmentsRepository;
