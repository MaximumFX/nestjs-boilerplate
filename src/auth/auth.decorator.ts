import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { ApiKeyGuard } from './guards/api-key.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { AuthenticatedUserGuard } from './guards/authenticated-user.guard';

export const IS_PUBLIC_KEY = 'isPublic';

export function SecuredEndpoint() {
  return applyDecorators(
    ApiSecurity('x-api-key'),
    UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard),
  );
}

export function Public() {
  return SetMetadata(IS_PUBLIC_KEY, true);
}

export function Protected() {
  return ApiBearerAuth();
}

export function Authenticated() {
  return applyDecorators(ApiBearerAuth(), UseGuards(AuthenticatedUserGuard));
}
