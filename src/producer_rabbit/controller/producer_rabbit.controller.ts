import {Body, Controller, Logger, Post} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProducerRabbitService } from '../service';
import { ProducerRabbitDto, BodyPlanificador } from '../dto';
import { SendPlanningQueueDto } from 'src/hanrt_planificador/dto/send-planning-queue.dto';

@ApiBearerAuth()
@ApiTags('Producer')
@Controller('producer_rabbit')
export class ProducerRabbitController{
    constructor(private readonly producerRabbitService:ProducerRabbitService){}

    @Post()
    @ApiOperation({ summary: 'agrega un valor de prueba al queue de rabbit' })
    @ApiBody({ 
        description: "datos de prueba para simular una carga al queue",
        type: ProducerRabbitDto
    })
    sendDataPlanningToQueue(@Body() data: SendPlanningQueueDto) {
        return this.producerRabbitService.sendDataPlanningToQueue(data);
    }

    @Post('planificador')
    @ApiOperation({ summary: 'Busca por id de la planificación todas las visitas (itemRuta)' })
    @ApiBody({ 
        description: "Data de envio a rabbitMQ",
        type: BodyPlanificador
    })
    getDataByIdPlanificador(@Body() data: BodyPlanificador) {
        return this.producerRabbitService.getDataByIdPlanificador(data);
    }
}