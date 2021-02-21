import { Body, Post } from '@nestjs/common';
import { Controller, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from "express";

import { FacebookLoginDto } from '@comfeco/interfaces';

import { FacebookService } from './facebook.service';

@ApiTags('Autenticación')
@Controller('auth/facebook')
export class FacebookController {

    constructor( private _facebookService: FacebookService ){}


    @Post("verify")
    async verify(@Res() res:Response, @Body() facebookDto:FacebookLoginDto): Promise<any> {
        const user = await this._facebookService.login(facebookDto);

        res.status(user.code).send(user);
    }

}
