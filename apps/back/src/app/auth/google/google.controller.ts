import { GoogleLoginDto } from '@comfeco/interfaces';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from "express";

import { GoogleService } from './google.service';

@ApiTags('Autenticación')
@ApiTags('Google')
@Controller('auth/google')
export class GoogleController {

    constructor( private _googleService: GoogleService ){}

    @Post("verify")
    async verify(@Res() res:Response, @Body() googleDto:GoogleLoginDto): Promise<any> {
        const user = await this._googleService.login(googleDto);

        res.status(user.code).send(user);
    }

}

