import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
    private readonly variables: { [key: string]: string };
    
    private _port: number | string;
    private _urlApi: string;

    constructor() {
        this.variables = {...process.env};
    }

    parametersServer(puerto:number|string, urlApi:string) {
        this._port = puerto;
        this._urlApi = urlApi;
    }

    get(key: string): string {
        return this.variables[key];
    }

    get puerto() {
        return this._port;
    }

    get urlApi() {
        return this._urlApi;
    }

}
