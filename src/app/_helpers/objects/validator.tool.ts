export const parseToObject = (array: any[], key: string, value: string): Promise<{ [key: string]: string }> => {
    return new Promise(async (resolve, reject) => {
        let object = {};
        const iterateArray = async () => {
            return Promise.all(
                array.map((item) => {
                    object[item[key]] = item[value];
                    return Promise.resolve('ok');
                })
            );
        }
        await iterateArray();
        resolve(object);
    });
}

export const numberOnly = (event): boolean => {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

const getStep = (controlName: string): number => {

    let controls = [
        ["DocumentType", "DocumentNumber", "Name", "LastName", "Gender", "DateBirth"], //POSITION 0 -> STEP 0
        ["Movile", "Email", "City"], // POSITION 1 -> STEP 1
        ["TypeChurch", "Headquarters",
            "Pastor", "Leader", "ChurchName", "PastorName"], // POSITION 2 -> STEP 2
        ["terms"] //POSITION 3 -> STEP 3
    ];
    let _step: number = 0; // step of material
    controls.map((step, i) => { // for obtain index of aoa
        step.map((control) => {
            if (control.toLowerCase() === controlName.toLowerCase()) {
                _step = i;
            }
        })
    })
    return _step;
}
// FOR GET CONTROL NAME AND OBTAIN THEM POSITION 
export const toFailedStep = (controls: any): number => {
    let step = 0;
    for (let i in controls) {
        if (controls[i].errors) {
            step = getStep(i);
        }
    }
    return step;
}

export const validateCardFlag = (number: string) => {
    let firstTwo = (number.length > 2) ? number[0] + number[1] : "";
    if (parseInt(firstTwo) == 34 || parseInt(firstTwo) == 37) {
        return "AMERICAN";
    } else if (parseInt(firstTwo) >= 40 && parseInt(firstTwo) <= 49) {
        return "VISA"
    } else if (parseInt(firstTwo) >= 51 && parseInt(firstTwo) <= 55) {
        return "MASTERCARD"
    } else {
        return null;
    }
}

export const getJSONPaymentType = (formFields, eventName: string, assistants: number): any => {
    switch (formFields.paymentType) {
        case 'PSE':
            return {
                "customer": getCustomer(formFields),
                "payment": {
                    "paymentType": "PSE",
                    "doc_type": "CC",
                    "doc_number": formFields.document,
                    "name": formFields.name,
                    "last_name": formFields.lastName,
                    "email": formFields.email,
                    "currency": formFields.currency.toUpperCase(),
                    "value": parseInt(formFields.amount),
                    "bank": formFields.financialInstitutionCode,
                    "type_person": formFields.clientType,
                    "country": "CO",
                    "description": "Compra online " + eventName,
                    "cell_phone": formFields.contactPhone
                }
            }
        case 'TC':
            return {
                "customer": getCustomer(formFields),
                "payment": {
                    "paymentType": (formFields.currency.toLowerCase() == "cop") ? 'CREDIT' : "stripe",
                    "card": {
                        "number": formFields.cardNumber,
                        "exp_year": formFields.cardYear,
                        "exp_month": formFields.cardMonth,
                        "cvc": formFields.cardSecurityCode
                    },
                    "doc_type": "CC",
                    "doc_number": formFields.document,
                    "name": formFields.name,
                    "last_name": formFields.lastName,
                    "email": formFields.email,
                    "currency": formFields.currency.toLowerCase(),
                    "value": (formFields.currency.toLowerCase() == "cop") ? parseInt(formFields.amount) : parseInt(formFields.amount) * 100
                }
            }
        case 'PE':
            return {
                "customer": getCustomer(formFields),
                "payment": {
                    "paymentType": "CASH",
                    "pointPayment": formFields.paymentMethod,
                    "amount": parseInt(formFields.amount),
                    "description": "Compra online " + eventName,
                    "addDays": 1
                }
            }
    }
}

const getCustomer = (formFields) => {
    return {
        "email": formFields.email,
        "name": formFields.name,
        "lastName": formFields.lastName
    }
}

// export const getPaymentMethod = () => { }

export const getIpAddress = () => { }