import { RecoverAccountDto } from './recover_account.dto';

export class LoginDto extends RecoverAccountDto {
    readonly password: string;
}