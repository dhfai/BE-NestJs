import { ExecutionContext, HttpException, createParamDecorator } from "@nestjs/common";

export const Auth = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user) {
        return user;
    } else {
        throw new HttpException('User not found', 401);
    }
});