import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { ApiKeyGuard } from './guards/api-key.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { AuthenticatedUserGuard } from './guards/authenticated-user.guard';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator to secure endpoints with API key authentication.
 */
export function SecuredEndpoint() {
  return applyDecorators(
    ApiSecurity('x-api-key'),
    UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard),
  );
}

/**
 * Marks a route as public, allowing unauthenticated access (with an API key).
 */
export function Public() {
  return SetMetadata(IS_PUBLIC_KEY, true);
}

/**
 * Marks a route as protected, adding optional authentication.
 */
export function Protected() {
  return ApiBearerAuth();
}

/**
 * Marks a route as authenticated, requiring a valid JWT token.
 */
export function Authenticated() {
  return applyDecorators(ApiBearerAuth(), UseGuards(AuthenticatedUserGuard));
}
