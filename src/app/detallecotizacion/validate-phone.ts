import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[PhoneValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ValidatePhoneDirective,
    multi: true
  }]
})

export class ValidatePhoneDirective implements Validator {
  private phone: string = "";
  validate(control: AbstractControl): { [key: string]: any } | null {
    this.phone = control.value != undefined ? control.value : "NO" ;
    //console.log(this.phone.length);
    //debugger;
    if (this.phone.length === 0) {
      return { 'Vacio': true };
    }
    return this.phone.length < 14 ? { 'LongitudMinima': true } : null;
  }
}

@Directive({
  selector: '[CPValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ValidateCPDirective,
    multi: true
  }]
})

export class ValidateCPDirective implements Validator {
  private cod_post: string = "";
  validate(control: AbstractControl): { [key: string]: any } | null {
    this.cod_post = control.value != undefined ? control.value : "NO";
    //console.log(this.cod_post.length);
    //debugger;
    if (this.cod_post.length === 0) {
      return { 'Vacio': true };
    }
    return this.cod_post.length < 5 ? { 'LongitudMinima': true } : null;
  }
}



@Directive({
  selector: '[DropDownValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: SelectRequiredValidatorDirective,
    multi: true
  }]
})

export class SelectRequiredValidatorDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    return control.value <= 0 ? { 'defaultSelected': true } : null;
  }
}


@Directive({
  selector: '[ConfirmRangelValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ConfirmRangelValidatorDirective,
    multi: true
  }]
})
export class ConfirmRangelValidatorDirective implements Validator {
  @Input() ConfirmRangelValidator: string;

  validate(control: AbstractControl): { [key: string]: any } | null {
    const controlToCompare = control.parent.get(this.ConfirmRangelValidator);
    //debugger;
    if (controlToCompare && controlToCompare.value > control.value) {
      return { 'esMayor': true };
    }
    return null;
  }
}
