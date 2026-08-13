import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** Injecte l'utilisateur courant depuis req.user : @UtilisateurCourant() user */
export const UtilisateurCourant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
