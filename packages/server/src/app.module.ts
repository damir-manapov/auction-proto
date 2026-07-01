import { Module } from "@nestjs/common";
import { AdminController } from "./admin/admin.controller.js";
import { PassengerController } from "./passenger/passenger.controller.js";

@Module({
  controllers: [AdminController, PassengerController],
})
export class AppModule {}
