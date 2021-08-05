import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';

export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
}

export const hourValidation = (control: FormControl) => {
    const value = control.value;

    if (!value) {
        return null;
    }

    if (value.hour < 4) {
        return { tooEarly: true };
    }

    if (value.hour > 22) {
        return { tooLate: true };
    }

    return null;
}

export const numberOnly = (event): boolean => {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

//INSERT PERSON (TO-WIN MODULE)

// FOR GET POSITION OF CONTROL (LIKE A STEP)
const getStep = (controlName: string): number => {

    let controls = [
        ["idDocumentType","documentNumber","names","surNames","birthDate","gender","idCivilStatus"],
        ["phone","email","address","mobile","neighborhoods","idZone"],
        ["idPastor","idLeader","personInvites","idMeeting","petition"],
        ["Date","Code","Description","IdResultPhoneVisit"]
    ];
    let _step: number = 0; // step of material
    controls.map((step, i)=>{ // for obtain index of aoa
        step.map((control) => {
            if(control.toLowerCase() === controlName.toLowerCase()){
                _step = i;
            }
        })
    })
    return _step;
}
// FOR GET CONTROL NAME AND OBTAIN THEM POSITION 
export const toFailedStep = (controls: any): number => {
    let step = 0;
    for(let i in controls){
        if(controls[i].errors){
            step = getStep(i);
        }
    }
    return step;
}

export const parseToObjectOtherObject = (array: any[], key: string): Promise<{ [key: string]: any }> => {
    return new Promise(async (resolve, reject) => {
        let object = {};
        const iterateArray = async () => {
            return Promise.all(
                array.map((item) => {
                    object[item[key]] = item;
                    return Promise.resolve('ok');
                })
            );
        }
        await iterateArray();
        resolve(object);
    });
}