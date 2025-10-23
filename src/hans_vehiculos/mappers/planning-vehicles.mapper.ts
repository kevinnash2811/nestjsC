import { ConductorDto, VehiclePlanningDto } from "../dto/planning-vehicles.dto";
import { ConductorRaw, VehiculoRaw } from "../interface";

export const mapConductorRawToDto = (
  conductorRaw: ConductorRaw,
): ConductorDto => {
  return {
    nombre: conductorRaw.name,
    userId: conductorRaw.user_id,
    tipo: conductorRaw.tipo_c,
    tipoLabel: conductorRaw.tipo_c_label,
    divisionId: conductorRaw.user_iddivision_c,
    division: conductorRaw.user_division_c,
    mercadoId: conductorRaw.user_idamercado_c,
    mercado: conductorRaw.user_amercado_c,
    regionalId: conductorRaw.user_idregional_c,
    regional: conductorRaw.user_regional_c,
    nombreUsuario: conductorRaw.user_name,
  };
};

export const mapVehiculoRawToDto = (vehiculoRaw: VehiculoRaw): VehiclePlanningDto => {
  let conductoresParsed: ConductorRaw[] = [];
  try {
    conductoresParsed = JSON.parse(vehiculoRaw.conductores);
  } catch (error) {
    console.error('Error parsing conductores JSON:', error);
  }

  const conductoresDto = conductoresParsed.map(mapConductorRawToDto);

  return {
    id: vehiculoRaw.id,
    nombre: vehiculoRaw.name,
    idamercado: vehiculoRaw.amercado_c,
    amercado: vehiculoRaw.amercado_label_c,
    iddivision: vehiculoRaw.iddivision_c,
    division: vehiculoRaw.division_label_c,
    idregional: vehiculoRaw.regional_c,
    regional: vehiculoRaw.regional_label_c,
    capacidad: parseInt(vehiculoRaw.capacidad_1_c, 10) || 0,
    tipoAuto: vehiculoRaw.tipo_auto_c,
    estadoVehiculoId: vehiculoRaw.estado_vehiculo_c,
    estadoVehiculo: vehiculoRaw.estado_vehiculo_label,
    conductores: conductoresDto,
  };
};

export const mapVehiculosRawToDto = (
  vehiculosRaw: VehiculoRaw[],
): VehiclePlanningDto[] => {
  return vehiculosRaw.map(mapVehiculoRawToDto);
};
