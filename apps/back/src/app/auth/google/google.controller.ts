import { Controller, Get, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from "express";

import { GoogleService } from './google.service';

@ApiTags('Autenticación')
@ApiTags('Google')
@Controller('auth/google')
export class GoogleController {

    constructor( private _googleService: GoogleService ){}


    @ApiOperation({
        summary: 'Ingresar con google',
        description: 'Muestra la pantalla para ingresar con una cuenta de google'
    })
    @Get()
    @UseGuards(AuthGuard('google'))
    pageLogin(@Res() resp:Response): void {
        resp.status(HttpStatus.OK);
    }

    
    @Get('respuesta')
    @ApiExcludeEndpoint()
    @UseGuards(AuthGuard('google'))
    async login(@Req() req:Request, @Res() res:Response): Promise<void> {
        const user = await this._googleService.login(req)

        res.status(user.code).send(user);
    }
    
}
