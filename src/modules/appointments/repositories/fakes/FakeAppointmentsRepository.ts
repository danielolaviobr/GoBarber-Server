import { v4 as uuid } from 'uuid';
import { getDate, getMonth, getYear, isEqual } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/iAppointmentsRepository';
import Appointment from '@modules/appointments/infra/typeorm/entities//Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/iCreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/iFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/iFindAllInDayFromProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const foundAppointment = this.appointments.find(appointment =>
      isEqual(appointment.date, date),
    );

    return foundAppointment;
  }

  public async findAllInMonthFromProvider({
    providerId,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year &&
        appointment.provider_id === providerId,
    );

    return appointments;
  }

  public async findAllInDayFromProvider({
    providerId,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year &&
        appointment.provider_id === providerId,
    );

    return appointments;
  }

  public async create(
    appointmentData: ICreateAppointmentDTO,
  ): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), ...appointmentData });

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
