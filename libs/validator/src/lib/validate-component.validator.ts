import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { GenericResponse } from "@comfeco/interfaces";

import { ValidatorService } from './validator-service.validator';

export class ValidateComponent {

    public static matchPasswords(matchTo: string): ValidationErrors | null {
        return (formGroup: AbstractControl): ValidationErrors | null => {
            const parent:FormGroup|FormArray = formGroup.parent;
            const controls:any = parent?.controls;
            let actualValue:any;
            let otherMatch:any;

            try {
                otherMatch = controls[matchTo]?.value.trim();
                actualValue = formGroup?.value.trim();
            } catch(err) {}

            if(!otherMatch && !actualValue) return null;

          return !!parent && !!parent?.value &&
            actualValue === otherMatch
            ? null
            : { error: ['Las contraseñas deben de ser iguales'] };
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
        return new ValidateComponent()._validate(control, 'email', false);
    }

    static user(control:FormControl) {
        return new ValidateComponent()._validate(control, 'user', false);
    }

    static password(control:FormControl) {
        return new ValidateComponent()._validate(control, 'password', false);
    }

    static passwordRequired(control:FormControl) {
        return new ValidateComponent()._validate(control, 'password', true);
    }
    
    static token(control:FormControl) {
        return new ValidateComponent()._validate(control, 'token', false);
    }

    private _validate(control:FormControl, component:string, required:boolean) {
        const value:string = control.value?.trim();

        if(required || !!value) {
            const validator:any = ValidatorService;
            const response:GenericResponse = validator[component](value, null);
            
            if(response!==null) {
                return {
                    error: response.errors
                };
            }
        }

        return null;
    }

}
