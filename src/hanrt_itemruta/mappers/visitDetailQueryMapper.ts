export const mapVisitDetailsByRouteId = (data: any) => {
  return {
    headerPlan: {
      secuenciaC: data.secuencia,
      tipoVisitaHbmC: data.tipoVisita,
      fechaInicioC: data.fechaInicio,
      horaInicioC: data.horaInicio,
      horaFinC: data.horaFin,
      fechaFinC: data.fechaFin,
      duracionC: data.duracion,
      estado: data.estado,
    },
    headerExec: data.visitaId
      ? {
          tipoVisitaHbmC: data.tipoVisita,
          fechaInicioC: data.fechaInicioReal,
          fechaFinC: data.fechaFinReal,
          estado: data.visitaEstado,
          visitado: data.visitado,
        }
      : null,
    account: {
      name: data.accountName,
      category: data.categoriaVentas,
      secondCategory: data.categoriaVentas02,
    },
    contact: data.contactId
      ? {
          contactName: data.contactName,
          clasificacionC: data.clasificacionContact,
          especialidadName: data.especialidadName,
        }
      : null,
    user: {
      fullName: data.user,
      userCode: data.userCode,
      regional: data.regionName,
    },
    tasks: mapTasksOfVisit(data.tasks),
  };
};

const mapTasksOfVisit = (tasks: any[]) => {
  return tasks.map((task) => ({
    name: task.name,
    estado: task.estado,
    fechaInicioC: task.fechaInicio,
    fechaFinC: task.fechaFin,
    obligatorio: task.obligatorioC && task.obligatorioC === 'yes',
    estadoId: task.estadoId,
    module: task.module ? {
      type: task.module.type,
      value: task.module.value,
    } : null,
    documentsCount: task.documentsCount,
  }));
};
