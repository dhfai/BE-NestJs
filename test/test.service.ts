import { Injectable } from "@nestjs/common";
import { PrismaService } from "../src/common/prisma.service";
import * as bcrypt from 'bcrypt';
@Injectable()
export class TestSErvice {
    constructor(private prismaService: PrismaService) {}

    async deleteUser() {
        await this.prismaService.user.deleteMany({
            where: {
                username: "tes"
            },
        });
    }

    async createUser() {
        await this.prismaService.user.create({
            data: {
                username: "tes",
                name: "tes",
                password: await bcrypt.hash("tes", 10),
                token: "tes",
            }
        })
    }
}