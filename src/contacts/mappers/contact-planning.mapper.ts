import { ContactPlanningDto } from '../dto';
import { ContactRawPlanning } from '../interface';

export const mapContactRawToPlanningContactDto = (
  raw: ContactRawPlanning,
): ContactPlanningDto => {
  return {
    id: raw.id,
    firstName: raw.first_name,
    lastName: raw.last_name,
    phoneMobile: raw.phone_mobile,
    salutation: raw.salutation,
    title: raw.title,
    contactSpeciality: raw.contactSpeciality,
    clasificacion: raw.clasificacion_c,
  };
};
