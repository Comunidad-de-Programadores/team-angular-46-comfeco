import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
    private readonly variables: { [key: string]: string };
    
    private _puerto: number | string;
    private _urlApi: string;

    constructor() {
        this.variables = {...process.env};
    }

    parametrosServidor(puerto:number|string, urlApi:string) {
        this._puerto = puerto;
        this._urlApi = urlApi;
    }

    get(key: string): string {
        return this.variables[key];
    }

    get puerto() {
        return this._puerto;
    }

    get urlApi() {
        return this._urlApi;
    }

}
