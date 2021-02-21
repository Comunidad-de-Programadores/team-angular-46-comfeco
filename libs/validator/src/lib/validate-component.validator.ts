import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { GenericResponse } from "@comfeco/interfaces";

import { ValidatorService } from './validacion-servicio.validator';

export class ValidateComponent {

    public static matchPasswords(matchTo: string): ValidationErrors | null {
        return (formGroup: AbstractControl): ValidationErrors | null => {
            const parent:FormGroup|FormArray = formGroup.parent;
            const controls:any = parent?.controls;

          return !!parent && !!parent?.value &&
            formGroup.value === controls[matchTo]?.value
            ? null
            : { error: 'Las contraseñas deben de ser iguales' };
        };
    }

    static invalidField(formGroup:FormGroup, field:string) {
        return formGroup.controls[field].errors 
            && formGroup.controls[field].touched;
    }

    static subscriptionMatchValues(formGroup:FormGroup, field1:string, field2:string): Subscription {
        return formGroup.controls[field1].valueChanges.subscribe(() => {
            formGroup.controls[field2].updateValueAndValidity();
        });
    }

    static componentValueChanges(formGroup:FormGroup, field:string):Observable<string> {
        return formGroup.get(field)?.valueChanges
                    .pipe(
                        map( _ => {
                            return formGroup.controls[field].errors?.error;
                        })
                    );
    }

    static email(control:FormControl) {
        return new ValidateComponent()._validate(control, 'email');
    }

    static user(control:FormControl) {
        return new ValidateComponent()._validate(control, 'user');
    }

    static password(control:FormControl) {
        return new ValidateComponent()._validate(control, 'password');
    }

    static token(control:FormControl) {
        return new ValidateComponent()._validate(control, 'token');
    }

    private _validate(control:FormControl, componente:string) {
        const valor:string = control.value?.trim();

        if(valor) {
            const validator:any = ValidatorService;
            const respuesta:GenericResponse = validator[componente](valor, null);

            if(respuesta!==null) {
                return {
                    error: respuesta.errors
                };
            }
        }

        return null;
    }

}
