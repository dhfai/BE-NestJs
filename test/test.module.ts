import { Module } from "@nestjs/common";
import { TestSErvice } from "./test.service";



@Module({
    providers: [TestSErvice],
})

export class TestModule {}