import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RoleUtilisateur } from '../../utilisateurs/entities/utilisateur.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRequis = this.reflector.getAllAndOverride<RoleUtilisateur[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si aucun rôle requis, la route est accessible à tous les utilisateurs authentifiés
    if (!rolesRequis || rolesRequis.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!rolesRequis.includes(user?.role)) {
      throw new ForbiddenException(
        `Accès refusé. Rôle requis : ${rolesRequis.join(' ou ')}.`,
      );
    }

    return true;
  }
}
