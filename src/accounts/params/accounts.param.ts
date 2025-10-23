// import { ApiParam } from "@nestjs/swagger";

// export const page = ApiParam({
//     name: 'page',
//     type: 'number',
//     required: true,
//     description: 'Pagina',
//     example: '1',
// });
  
// export const rowsPerPage = ApiParam({
//     name: 'rowsPerPage',
//     type: 'number',
//     required: true,
//     description: 'Filas por pagina',
//     example: '100',
// });

// export const filter = ApiParam({
//     name: 'filter',
//     type: 'object',
//     required: false,
//     description: 'objeto de filtro para filtro avanzado y rapido',
//     example: {
//         name: '',
//         lastname: '',
//         comercial_name: '',
//         client_type: '',
//         account_type: '',
//         aio_code: '',
//         nit_ci: '',
//         cellphone: '',
//         email: '',
//         industry: '',
//         sub_industry: '',
//         country: '',
//         state: '',
//         city: '',
//         street: '',
//         document_type: '',
//         tax_regime: '',
//         website: '',
//         created_by: [],
//         modified_by: [],
//         assigned_to: [],
//         creation_date: {
//           from: '',
//           to: '',
//           operator: '',
//           option: ''
//         },
//         easyFilter: ''
//     }
// });

// export const sortBy = ApiParam({
//     name: 'sortBy',
//     type: 'string',
//     required: true,
//     description: 'Ordenamiento por el campo',
//     example: 'nombre',
// })

// export const order = ApiParam({
//     name: 'order',
//     type: 'string',
//     required: true,
//     description: 'De forma Ascendente o Descendente',
//     //example: 'desc',
//     enum: ['asc', 'desc']
// })