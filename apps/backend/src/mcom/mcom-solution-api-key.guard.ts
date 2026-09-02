import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

// Verifies the `x-mcom-solution-api-key` header used by the MCOM Solutions
// Console when it calls our /system/plans CRUD endpoints.
@Injectable()
export class McomSolutionApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-mcom-solution-api-key'] as
      | string
      | undefined;
    const expected = process.env.MCOM_SOLUTION_API_KEY;

    if (!expected || !apiKey || apiKey !== expected) {
      throw new UnauthorizedException(
        'Invalid or missing MCOM solution API key',
      );
    }
    return true;
  }
}
