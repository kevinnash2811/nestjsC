import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  HealthCheckService,
  HealthCheck,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
// import { WinstonLoggerService } from 'src/common/services/logging.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private db: TypeOrmHealthIndicator,
    // private winstonLogger: WinstonLoggerService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get application health status' })
  @ApiResponse({ status: 200, description: 'Health check successful' })
  @ApiResponse({ status: 503, description: 'Health check failed' })
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memory.checkRSS('memory_rss', 512 * 1024 * 1024),
      () => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024),
    ]);
  }

  @Get('liveness')
  @ApiOperation({
    summary: 'Liveness probe - checks if application is running',
  })
  @ApiResponse({ status: 200, description: 'Application is alive' })
  @HealthCheck()
  checkLiveness() {
    return this.health.check([
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
    ]);
  }

  @Get('readiness')
  @ApiOperation({
    summary:
      'Readiness probe - checks if application is ready to serve traffic',
  })
  @ApiResponse({ status: 200, description: 'Application is ready' })
  @ApiResponse({ status: 503, description: 'Application is not ready' })
  @HealthCheck()
  checkReadiness() {
    return this.health.check([]);
  }
}