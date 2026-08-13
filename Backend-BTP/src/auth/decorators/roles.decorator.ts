import { SetMetadata } from '@nestjs/common';
import { RoleUtilisateur } from '../../utilisateurs/entities/utilisateur.entity';

export const ROLES_KEY = 'roles';

/** Décorateur @Roles(...) à placer sur un controller ou une route */
export const Roles = (...roles: RoleUtilisateur[]) => SetMetadata(ROLES_KEY, roles);
