import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { TerminusModule } from "@nestjs/terminus";

@Module({
  providers: [],
  imports:[TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}