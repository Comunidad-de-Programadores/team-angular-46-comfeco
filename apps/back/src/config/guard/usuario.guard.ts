import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UsuarioGuard extends AuthGuard('jwt') {}