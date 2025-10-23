import { Injectable, Logger }                      from '@nestjs/common';
import { InjectEntityManager }                     from '@nestjs/typeorm';
import { EntityManager }                           from 'typeorm';
import { FilterAdvancedEntregasDto, MainDto }      from '../dto';
import { cleanSpecialCharacters }                  from '../../helpers';
import { datosEntregasCompletasItem }                      from '../interface'
import * as querySQL                               from '../SQL';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HaneEntregasPostService {
  SQL_DATABASE: string;
  SQL_SCHEMA: string;

  constructor(
    @InjectEntityManager('DBCRM') private readonly mssqlEntityManager: EntityManager,
    private readonly configService: ConfigService,
  ){
    this.SQL_DATABASE = this.configService.get('SQL_DATABASE');
    this.SQL_SCHEMA = this.configService.get('SQL_SCHEMA');
  }

  async listHaneEntregas(filterAdvancedEntregasDto: FilterAdvancedEntregasDto){
    try {
      //**DESFRAGMENTANDO DATA */
      const {page, rowsPerPage, filter, sortBy, order} = filterAdvancedEntregasDto;
      const {
        easyFilter = '',
        name = '',
        lastname = '',
        comercial_name = '',
        client_type = '',
        account_type = '',
        aio_code = '',
        nit_ci = '',
        cellphone = '',
        email = '',
        industry = '',
        sub_industry = '',
        country = '',
        state = '',
        city = '',
        street = '',
        document_type = '',
        tax_regime = '',
        website = '',
        created_by = '',
        modified_by = '',
        assigned_to = '',
        date= {
          from: '',
          to: ''
        },
        start_date= '',
        end_date= '',
        operator = '',
        latlng,
        statusEntrega,
        zona_venta_c = '',
        category = '',
        category2 = '',
        campaign ='',
        customerGroup = '',
        exclude = '',
        planificacion = '',
        includes = ''
      } = filter;
      const { from, to } = date;
      const query = `EXEC [${this.SQL_DATABASE}].[${this.SQL_SCHEMA}].[Hane_Entregas_Filter_Advanced] 
        ${page},
        ${rowsPerPage},
        '${sortBy}',
        '${order}',
        '${cleanSpecialCharacters(easyFilter,)}',
        '${cleanSpecialCharacters(name,)}',
        '${cleanSpecialCharacters(lastname,)}',
        '${cleanSpecialCharacters(comercial_name,)}',
        '${client_type}',
        '${account_type}',
        '${cleanSpecialCharacters(aio_code,)}',
        '${cleanSpecialCharacters(nit_ci,)}',
        '${cleanSpecialCharacters(cellphone)}',
        '${cleanSpecialCharacters(email,)}',
        '${industry}',
        '${sub_industry}',
        '${country}',
        '${state}',
        '${cleanSpecialCharacters(city,)}',
        '${cleanSpecialCharacters(street)}',
        '${document_type}',
        '${tax_regime}',
        '${website}',
        '${created_by}',
        '${modified_by}',
        '${assigned_to}',
        '${from}',
        '${to}',
        '${start_date}',
        '${end_date}',
        '${operator}',
        '${latlng}',
        '${statusEntrega}',
        '${zona_venta_c}',
        '${category}',
        '${category2}',
        '${campaign}',
        '${customerGroup}',
        '${exclude}',
        '${planificacion}',
        '${includes}'`;

      const data= await this.mssqlEntityManager.query(query);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async listTotalHaneEntregas(filterAdvancedEntregasDto: FilterAdvancedEntregasDto){
    try {
      //**DESFRAGMENTANDO DATA */
      const {page, rowsPerPage, filter, sortBy, order} = filterAdvancedEntregasDto;
      const {
        easyFilter = '',
        name = '',
        lastname = '',
        comercial_name = '',
        client_type = '',
        account_type = '',
        aio_code = '',
        nit_ci = '',
        cellphone = '',
        email = '',
        industry = '',
        sub_industry = '',
        country = '',
        state = '',
        city = '',
        street = '',
        document_type = '',
        tax_regime = '',
        website = '',
        created_by = '',
        modified_by = '',
        assigned_to = '',
        date= {
          from: '',
          to: ''
        },
        start_date = '',
        end_date = '',
        operator = '',
        latlng,
        statusEntrega,
        zona_venta_c = '',
        category = '',
        category2 = '',
        campaign ='',
        customerGroup = '',
        exclude = '',
        planificacion = '',
        includes = ''
      } = filter;
      const { from, to } = date;
      const data= await this.mssqlEntityManager.query(`EXEC [${this.SQL_DATABASE}].[${this.SQL_SCHEMA}].[Hane_Entregas_Get_Total] '${easyFilter}','${name}','${lastname}','${comercial_name}','${client_type}',
        '${account_type}','${aio_code}','${nit_ci}','${cellphone}','${email}',
        '${industry}','${sub_industry}','${country}','${state}','${city}',
        '${street}','${document_type}','${tax_regime}','${website}','${created_by}',
        '${modified_by}','${assigned_to}','${from}','${to}','${start_date}','${end_date}','${operator}','${latlng}','${statusEntrega}','${zona_venta_c}','${category}','${category2}','${campaign}','${customerGroup}','${exclude}','${planificacion}','${includes}'`);
      return data[0].total;
    } catch (error) {
      console.log(error);
    }
  }

  // async saveListEntregasExcel(mainDto:MainDto){
  //   try {
  //     const { rows, productos, current_user_id, iddivision_c  } = mainDto;

  //     //VERIFICAMOS SI EXISTEN LAS ENTREGAS:
  //     const entregas                    = rows.map(item => item.entrega); // Extraemos los campos 'entrega'
  //     const query                       = querySQL.hane_entregas.Get_Hane_Entregas_By_Name(entregas); //armamos la consulta
  //     const resultados                  = await this.mssqlEntityManager.query(query);// Ejecutamos la consulta y obtenemos los resultados
  //     const entregasEncontradas         = resultados.map(result => result.name); // Extraemos solo los valores de entrega encontrados en la base de datos
  //     const datosEntregasEncontradas    = rows.filter(item => entregasEncontradas.includes(item.entrega));

  //     // Ahora complementamos 'datosEntregasEncontradas' con los datos de 'resultados'
  //     const datosEntregasCompletas = datosEntregasEncontradas.map(item => {
  //       const datosComplementarios = resultados.find(result => result.name === item.entrega);// Encontramos el valor complementario en 'resultados' basado en el campo 'entrega'
  //       // Retornamos un nuevo objeto combinando el original con los datos complementarios
  //       return {
  //           ...item, // Mantiene las propiedades originales de 'rows'
  //           ...datosComplementarios, // Añade las propiedades de 'resultados' que coinciden
  //       };
  //     });
  //     const datosEntregasNoEncontradas  = rows.filter(item => !entregasEncontradas.includes(item.entrega));// Determinamos cuáles entregas no se encontraron

  //     console.log('datosEntregasEncontradas');
  //     console.log(datosEntregasCompletas);
  //     console.log('datosEntregasNoEncontradas');
  //     console.log(datosEntregasNoEncontradas);

  //     // Actualización de las entregas existentes y sus productos
  //     const actualizarEntregas = datosEntregasCompletas.filter(item => item.estado_c === '03').map(async (item) => {
  //       const query = querySQL.hane_entregas_patch.Patch_Hane_Entregas_Update(item, current_user_id, iddivision_c);

  //       // Procesar los productos asociados
  //       const productosPromises = item.productos.map(async (producto) => {
  //         const query_material = querySQL.hane_entregas.Get_Products_By_MainCode(producto.material);
  //         const resultados_material = await this.mssqlEntityManager.query(query_material);

  //         // Verificamos si se encontró el producto
  //         if (resultados_material.length > 0) {
  //           console.log(`Producto encontrado: ${producto.material}`);
  //           //*verificamos si existe ya el registro en aos_products_quotes
  //           const query_aos_products_quotes = querySQL.hane_entregas.Get_Aos_Products_Quotes_By_Id(producto.name, item.id);
  //           const resultados_aos_products_quotes = await this.mssqlEntityManager.query(query_aos_products_quotes);
  //           if (resultados_aos_products_quotes[0].existsFlag) {
  //               console.log('El registro existe.');
  //           } else {
  //             const query_insert_producto = querySQL.hane_entregas_post.Post_Aos_Product_Quotes_New(item, producto, resultados_material[0], current_user_id, iddivision_c);
  //             await this.mssqlEntityManager.query(query_insert_producto);
  //           }
            
  //         } else {
  //           console.log(`Producto no encontrado: ${producto.material}`);
  //           const query_aos_products_quotes = querySQL.hane_entregas.Get_Aos_Products_Quotes_By_Id(producto.name, item.id);
  //           const resultados_aos_products_quotes = await this.mssqlEntityManager.query(query_aos_products_quotes);
  //           if (resultados_aos_products_quotes[0].existsFlag) {
  //               console.log('El registro existe.');
  //           } else {
  //             const query_insert_no_producto = querySQL.hane_entregas_post.Post_Aos_Product_Quotes_New_No_Product(item, producto, resultados_material[0], current_user_id, iddivision_c);
  //             await this.mssqlEntityManager.query(query_insert_no_producto);
  //           }
  //         }
  //       });

  //       // Verificamos si se encontro al cliente
  //       const query_account= querySQL.hane_entregas.Get_Accounts_By_Sic_Code(item.accCode);
  //       const resultados_query_account = await this.mssqlEntityManager.query(query_account);
  //       if (resultados_query_account.length>0) {
  //         const query_hane_entregas_accounts = querySQL.hane_entregas.Get_Hane_Entregas_Accounts(resultados_query_account[0].id, item.id);
  //         const resultados_hane_entregas_accounts = await this.mssqlEntityManager.query(query_hane_entregas_accounts);
  //         if (resultados_hane_entregas_accounts[0].existsFlag) {
  //           console.log('El registro existe.');
  //         } else {
  //           const query_hane_entregas_account = querySQL.hane_entregas_post.Post_Hane_Entregas_Accounts(resultados_query_account[0].id, item.id);
  //           await this.mssqlEntityManager.query(query_hane_entregas_account);
  //         }
  //       } else {
  //          console.log(`La cuenta con ${item.accCode} no encontrado en el CRM`);
  //       }
  //       // Esperar a que todos los productos sean procesados
  //       await Promise.all(productosPromises);
  //       // Actualizar la entrega
  //       return this.mssqlEntityManager.query(query);
  //     });

  //     // Ejecutar todas las actualizaciones en paralelo
  //     await Promise.all(actualizarEntregas);

  //     // Crear nuevas entregas no encontradas y sus productos
  //     const crearEntregas = datosEntregasNoEncontradas.map(async (item) => {
  //       const query = querySQL.hane_entregas_post.Post_Hane_Entregas_New(item, current_user_id, iddivision_c);
  //       const resultadoInsert = await this.mssqlEntityManager.query(query);
  //       const item_query = resultadoInsert[0]; //Obtenemos todos los campos del query ejecutado
  //       const item_complementado = {
  //         ...item,
  //         ...item_query
  //       }; //Complementamos los item que vienen de inicio con los resultados del query
  //       const productosPromises = item.productos.map(async (producto) => {
  //         const query_material = querySQL.hane_entregas.Get_Products_By_MainCode(producto.material);
  //         const resultados_material = await this.mssqlEntityManager.query(query_material);

  //         // Verificamos si se encontró el producto
  //         if (resultados_material.length > 0) {
  //           console.log(`Producto encontrado NO STOCK: ${producto.material}`);
  //           const query_insert_producto = querySQL.hane_entregas_post.Post_Aos_Product_Quotes_New(item_complementado, producto, resultados_material[0], current_user_id, iddivision_c);
  //           await this.mssqlEntityManager.query(query_insert_producto);
  //         } else {
  //           console.log(`Producto no encontrado NO STOCK: ${producto.material}`);
  //           const query_insert_no_producto = querySQL.hane_entregas_post.Post_Aos_Product_Quotes_New_No_Product(item_complementado, producto, resultados_material[0], current_user_id, iddivision_c);
  //           await this.mssqlEntityManager.query(query_insert_no_producto);
  //         }
  //       });
        

  //       // Verificamos si se encontro al cliente
  //       const query_account= querySQL.hane_entregas.Get_Accounts_By_Sic_Code(item.accCode);
  //       const resultados_query_account = await this.mssqlEntityManager.query(query_account);
  //       if (resultados_query_account.length>0) {
  //         console.log('El registro existe.');
  //         //Verificamos si ya existe la relacion entre cuenta y entrega
  //         const query_hane_entregas_accounts = querySQL.hane_entregas.Get_Hane_Entregas_Accounts(resultados_query_account[0].id, item_query.id);
  //         const resultados_hane_entregas_accounts = await this.mssqlEntityManager.query(query_hane_entregas_accounts);
  //         if (resultados_hane_entregas_accounts[0].existsFlag) {
  //           console.log('El registro existe.');
  //         } else {
  //           const query_hane_entregas_account = querySQL.hane_entregas_post.Post_Hane_Entregas_Accounts(resultados_query_account[0].id, item_query.id);
  //           await this.mssqlEntityManager.query(query_hane_entregas_account);
  //         }
  //       } else {
  //          console.log(`La cuenta con ${item.accCode} no encontrado en el CRM`);
  //       }
  //       // Esperar a que todos los productos sean procesados
  //       await Promise.all(productosPromises);
  //       // Actualizar la entrega
  //       //return this.mssqlEntityManager.query(query);
  //     });

  //     // Ejecutar la creación de nuevas entregas en paralelo
  //     await Promise.all(crearEntregas);

  //     console.log('Todas las consultas han finalizado con éxito.');
      
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  
  async saveListEntregasExcel(mainDto: MainDto) {
  try {
    const { rows, current_user_id, iddivision_c } = mainDto;
    
    // Verificar entregas existentes
    const entregas = rows.map(item => item.entrega);
    const queryEntregas = querySQL.hane_entregas.Get_Hane_Entregas_By_Name(entregas);
    const resultados = await this.mssqlEntityManager.query(queryEntregas);

    const entregasEncontradas = resultados.map(result => result.name);
    const datosEntregasNoEncontradas = rows.filter(item => !entregasEncontradas.includes(item.entrega));
    // Procesar entregas existentes
    const actualizarEntregas = this.procesarEntregasExistentes(resultados, rows, current_user_id, iddivision_c);

    // Procesar nuevas entregas
    const crearEntregas = this.crearNuevasEntregas(datosEntregasNoEncontradas, current_user_id, iddivision_c);

    // Ejecutar en paralelo
    await Promise.all([actualizarEntregas, crearEntregas]);

    console.log('Todas las consultas han finalizado con éxito.');
    return {
      status: true,
      success: true,
      message: 'Las entregas se han procesado correctamente.',
    };
  } catch (error) {
    return {
      status: false,
      success: false,
      message: 'Error al procesar las entregas.',
      error: error.message || 'Error desconocido',
    };
  }
}

// Función para procesar entregas existentes
private async procesarEntregasExistentes(resultados, rows, current_user_id, iddivision_c) {
  const datosEntregasCompletas = this.complementarDatos(resultados, rows);

  const actualizarEntregas = datosEntregasCompletas
    .filter(item => item.estado_c === '03')
    .map(async (item) => {
      const queryUpdate = querySQL.hane_entregas_patch.Patch_Hane_Entregas_Update(item, current_user_id, iddivision_c);
      const productosPromises = await this.procesarProductos(item, current_user_id, iddivision_c);
      
      // Verificar cuenta asociada
      await this.verificarCuentaAsociada(item);

      await Promise.all(productosPromises);
      return this.mssqlEntityManager.query(queryUpdate);
    });

  return Promise.all(actualizarEntregas);
}

// Función para crear nuevas entregas
private async crearNuevasEntregas(datosEntregasNoEncontradas, current_user_id, iddivision_c) {
  const crearEntregas = datosEntregasNoEncontradas.map(async (item) => {
    const queryInsert = querySQL.hane_entregas_post.Post_Hane_Entregas_New(item, current_user_id, iddivision_c);
    const resultadoInsert = await this.mssqlEntityManager.query(queryInsert);
    const itemQuery = { ...item, ...resultadoInsert[0] };

    const productosPromises = await this.procesarProductos(itemQuery, current_user_id, iddivision_c);
    await this.verificarCuentaAsociada(itemQuery);

    await Promise.all(productosPromises);
  });

  return Promise.all(crearEntregas);
}

// Función para procesar productos
private async procesarProductos(item, current_user_id, iddivision_c) {
  let productCounter = 1; // Iniciar contador
  return item.productos.map(async (producto) => {
    producto.number = productCounter++;
    const queryMaterial = querySQL.hane_entregas.Get_Products_By_MainCode(producto.material);
    const resultadosMaterial = await this.mssqlEntityManager.query(queryMaterial);

    if (resultadosMaterial.length > 0) {
      const queryAos = querySQL.hane_entregas.Get_Aos_Products_Quotes_By_Id(producto.name, item.id);
      const resultadoAos = await this.mssqlEntityManager.query(queryAos);

      if (!resultadoAos[0].existsFlag) {
        const queryInsertProducto = querySQL.hane_entregas_post.Post_Aos_Product_Quotes_New(item, producto, resultadosMaterial[0], current_user_id, iddivision_c);
        await this.mssqlEntityManager.query(queryInsertProducto);
      }
    } else {
      const queryInsertNoProducto = querySQL.hane_entregas_post.Post_Aos_Product_Quotes_New_No_Product(item, producto, null, current_user_id, iddivision_c);
      await this.mssqlEntityManager.query(queryInsertNoProducto);
    }
  });
}

// Función para verificar cuentas asociadas
private async verificarCuentaAsociada(item) {
  const queryAccount = querySQL.hane_entregas.Get_Accounts_By_Sic_Code(item.accCode);
  const resultadosQueryAccount = await this.mssqlEntityManager.query(queryAccount);

  if (resultadosQueryAccount.length > 0) {
    const queryHaneEntregasAccount = querySQL.hane_entregas.Get_Hane_Entregas_Accounts(resultadosQueryAccount[0].id, item.id);
    const resultadoHaneEntregasAccount = await this.mssqlEntityManager.query(queryHaneEntregasAccount);

    if (!resultadoHaneEntregasAccount[0].existsFlag) {
      const queryInsertAccount = querySQL.hane_entregas_post.Post_Hane_Entregas_Accounts(resultadosQueryAccount[0].id, item.id);
      await this.mssqlEntityManager.query(queryInsertAccount);
    }
  } else {
    console.log(`La cuenta con ${item.accCode} no fue encontrada en el CRM`);
  }
}

// Función para complementar datos de entregas encontradas
private complementarDatos(resultados, rows) {
  return rows
    .filter(item => resultados.some(result => result.name === item.entrega))
    .map(item => {
      const datosComplementarios = resultados.find(result => result.name === item.entrega);
      return { ...item, ...datosComplementarios };
    });
}
}
