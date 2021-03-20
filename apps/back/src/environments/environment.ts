import { comunes } from './environments.general';

export const environment = {
    produccion: false,
    url_recover_account: 'http://localhost:4200/auth/setpassword/',
    ...comunes
};
