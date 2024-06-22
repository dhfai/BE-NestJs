import { HttpException, Inject, Injectable } from "@nestjs/common";
import { Contact, User } from "@prisma/client";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "src/common/prisma.service";
import { ValidationService } from "src/common/validation.service";
import { ContactResponse, CreateContactRequest } from "src/model/contact.model";
import { Logger } from "winston";
import { ContactValidation } from "./contact.validation";

@Injectable()
export class ContactService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private readonly prismaService: PrismaService,
        private validationService: ValidationService
    ){}

    async create(user: User, request: CreateContactRequest): Promise<ContactResponse> {
        const createRequest: CreateContactRequest = this.validationService.validate(
            ContactValidation.CREATE,
            request
        );

        this.logger.debug(`Creating contact for user ${user.username}`);

        const contact = await this.prismaService.contact.create({
            data: {
                ...createRequest,
                ...{username: user.username}
            }
        });

        return this.toContactResponse(contact);
    }

    toContactResponse(contact: Contact): ContactResponse {
        return {
            first_name: contact.first_name,
            last_name: contact.last_name,
            email: contact.email,
            phone: contact.phone,
            id: contact.id
        }
    }

    async get(user: User, contactId: number): Promise<ContactResponse> {
        this.logger.debug(`Getting contact for user ${user.username}`);

        const contact = await this.prismaService.contact.findFirst({
            where: {
                id: contactId,
                username: user.username
            }
        });

        if(!contact) {
            throw new HttpException('Contact not found', 404);
        }

        return this.toContactResponse(contact);
    }
}