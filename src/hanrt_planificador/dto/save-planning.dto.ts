import { IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { IHanrtPlanificador, IRutaPLanning } from '../interface';

export class SavePlanningDto {
   
    @ApiProperty({
        default: {
            "id": "1",
            "name": "Planificacion Nest",
            "userId": "1",
            "description": "Descripcion Nest",
            "tipo": "T01",
            "iddivisionC": "03",
            "idamercadoC": "03_01",
            "regionC": "01_01",
            "canalC": "01",
            "estadoPlanificacionC": "EP01",
            "fechaInicioC": "2024-07-11 18:40:09",
            "fechaFinC": "2024-07-11 18:40:09"
          },
        description: 'datos de la planificacion'
    })
    @IsOptional()
    hanrtPlanificadorData : IHanrtPlanificador;

    @ApiProperty({
        default: [
            '25534e95-e71f-fb66-f3f7-667ec51498ee',
            '4d1fee15-c89b-f8da-d381-5c1a66496e60'
        ],
        description: 'id de todos los vehiculos en la planificacion'
    })
    @IsArray()
	idVehiculosList :  string[];

    @ApiProperty({
        default: [
           {
            "ruta":{
                "name": "Grupo Nest 1",
                "description":"Descripcion Nest 1",
                "fechaPlanC": "2024-07-13 00:00:00",
                "capacidadC": 30,
                "horaInicioC": "2024-07-13 12:00:00",
                "duracionC": "2024-07-13 04:30:00",
                "horaFinC": "2024-07-13 23:00:00",
                "userId":"1",
                "secuenciaC":1,
                "idVehiculo":"25534e95-e71f-fb66-f3f7-667ec51498ee"
            },
            "entregas":[
                {
                    "name" : "Visita Nest 1",
                    "description" : "Descripcion Nest 1",
                    "tipoVisitaC" :"TV02",
                    "fechaInicioC" :"2024-07-11 00:00:00",
                    "horaInicioC" : "2024-07-11 12:00:00",
                    "duracionC": "2024-07-11 04:30:00",
                    "fechaFinC": "2024-07-11 00:00:00",
                    "horaFinC": "2024-07-11 12:30:00",
                    "secuenciaC":1,
                    "idAccount": "01010FA5-F21A-44A9-A71C-E5C67783EED8",
                    "userId":"1",
                    "latitud":"7.50808",
                    "longitud":"171.02573",
                    "tareasPlan":[
                        "599a02b1-d433-cee6-b44d-668fee5c8bef",
                        "9a83cadd-4716-50a6-0478-6699206af4bd"
                    ],
                    "entregasList":[
                        "53be45f7-54e6-3878-3d39-669fa39baba4",
                        "4ea5b4eb-be27-ceeb-5a6b-66982607985d"
                    ]
                },
                {
                    "name" : "Visita Nest 2",
                    "description" : "Descripcion Nest 2",
                    "tipoVisitaC" :"TV02",
                    "fechaInicioC" :"2024-07-11 00:00:00",
                    "horaInicioC" : "2024-07-11 12:00:00",
                    "duracionC": "2024-07-11 04:30:00",
                    "fechaFinC": "2024-07-11 00:00:00",
                    "horaFinC": "2024-07-11 12:30:00",
                    "secuenciaC":2,
                    "idAccount": "2f6301bc-202e-a960-c0ad-660d7ecd1d11",
                    "userId":"1",
                    "latitud":"7.50808",
                    "longitud":"171.02573",
                    "tareasPlan":[
                        "599a02b1-d433-cee6-b44d-668fee5c8bef"
                    ]
                }
            ]
           },
           {
            "ruta":{
                "name": "Grupo Nest 2",
                "description":"Descripcion Nest 2",
                "fechaPlanC": "2024-07-13 00:00:00",
                "capacidadC": 30,
                "horaInicioC": "2024-07-13 12:00:00",
                "duracionC": "2024-07-13 04:30:00",
                "horaFinC": "2024-07-13 23:00:00",
                "userId":"1",
                "secuenciaC":2
            },
            "entregas":[
                {
                    "name" : "Visita Nest 1",
                    "description" : "Descripcion Nest 1",
                    "tipoVisitaC" :"TV02",
                    "fechaInicioC" :"2024-07-11 00:00:00",
                    "horaInicioC" : "2024-07-11 12:00:00",
                    "duracionC": "2024-07-11 04:30:00",
                    "fechaFinC": "2024-07-11 00:00:00",
                    "horaFinC": "2024-07-11 12:30:00",
                    "secuenciaC":1,
                    "idAccount": "01010FA5-F21A-44A9-A71C-E5C67783EED8",
                    "idContact": "01010FA5-F21A-44A9-A71C-E5C67783EED8",                
                    "userId":"1",
                    "latitud":"7.50808",
                    "longitud":"171.02573",
                }
            ]           
           }
        ],
        description: 'datos para el registro de las rutas y entregas'
    })
    @IsOptional()
	rutasEntregasList : IRutaPLanning[];
}
