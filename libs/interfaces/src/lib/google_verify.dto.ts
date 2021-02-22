import { FacebookLoginDto } from "./facebook_verify.dto";

export class GoogleLoginDto extends FacebookLoginDto {
    readonly idToken:string;
}