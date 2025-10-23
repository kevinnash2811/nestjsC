import { ContactFilterDto } from "../dto"

/**
 * Funcion que devuelve los parametros junto a sus nombres. NOTA: Los parametros tendran los mismos nombres que el parametros filter
 * @param filter Filtro que contiene todos los datos
 * @param excludePages verdadero si se requiere excluir los valors del paginado (page, pageSize, order, sortBy) por defecto false
 * @returns { strParams: string, params: any[] }
 */
export const processAdvancedFilter = (filter: ContactFilterDto, excludePages: boolean = false): { strParams: string, params: any[] } => {
  const strParams = [];
  const params = [];
  if (excludePages) {
    delete filter.page;
    delete filter.pageSize;
    delete filter.order;
    delete filter.sortBy;
  }

  // atributos cadena vacios
  for (const key in filter) {
    if (filter.hasOwnProperty(key)) {
      const value = filter[key];
      const index = params.length;
      if (typeof value === 'string' && value !== '') {
        strParams.push(`@${key} = @${index}`)
        params.push(value);
      } else if (typeof value === 'number' && value) {
        strParams.push(`@${key} = @${index}`)
        params.push(value)
      }
    }
  }

  return { strParams: strParams.join(', '), params };
}
