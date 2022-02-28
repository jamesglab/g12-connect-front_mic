/*THIS DOC IS CREATED WHIT THE FINALLY TO PARSE DATA 
FOR CORRECT INSERT OR UPDATE WHEN WE NEED CALLED SOME METHOD TO API*/
import { Person } from 'src/app/modules/to-win/_models/people.model';
import * as moment from 'moment';

export const insertPerson = (formData: any): Person => {
    return {
        ...formData,
        idDocumentType: parseInt(formData.idDocumentType),
        idCivilStatus: parseInt(formData.idCivilStatus),
        birthDate: moment(new Date(formData.birthDate)).format('YYYY-MM-DD'),
        idLeader: parseInt(formData.idLeader.id),
        idMeeting: parseInt(formData.idMeeting),
        idChurchType: parseInt(formData.idChurchType),
        idUserCreation: parseInt(formData.idUserCreation),
        idUserModification: parseInt(formData.idUserModification),
        idZone: parseInt(formData.idZone)
    };
}

export const updatePerson = (formData: any): any => {
    return {
        ...formData,
        idDocumentType: parseInt(formData.idDocumentType),
        idCivilStatus: parseInt(formData.idCivilStatus),
        birthDate: moment(new Date(formData.birthDate)).format('YYYY-MM-DD'),
        idLeader: (formData.idLeader.id) ? parseInt(formData.idLeader.id) : parseInt(formData.idLeader), //OJO
        idMeeting: parseInt(formData.idMeeting),
        idChurchType: parseInt(formData.idChurchType),
        idUserCreation: parseInt(formData.idUserCreation),
        idUserModification: parseInt(formData.idUserModification),
        idZone: parseInt(formData.idZone),
        verifiedData: true,
        disposable: true
    };
}

export const searchPerson = (formData: any): any => {
    const getFilter = (number: string) => {
        let _filters = {
            "0": "DOCUMENTO",
            "1": "EMAIL",
            "2": "TELEFONO"
        };
        return _filters[number];
    }

    return {
        ...formData,
        Filter: getFilter(formData.Filter),
        DocumentType: parseInt(formData.DocumentType)
    }
}

export const renderUpdatePerson = (person: any): any => {

    return {
        ...person,
        idDocumentType: person.idDocumentType.toString(),
        idCivilStatus: person.idCivilStatus.toString(),
        idZone: person.idZone.toString(),
        idMeeting: person.idMeeting.toString(),
        birthDate: new Date(person.birthDate)
    }

}

export const formatToFilter = (formData: any): any => {
    let fixed = { Call: null, Visited: null };
    if (formData.Call) {
        if (formData.Call == "1") {
            fixed.Call = true
        } else {
            fixed.Visited = true;
        }
    }
    return {
        ...formData,
        StartDateWin: moment(new Date(formData.StartDateWin)).format('YYYY-MM-DD'),
        EndDateWin: moment(new Date(formData.EndDateWin)).format('YYYY-MM-DD'),
        IdLeader: parseInt(formData.IdLeader),
        ...fixed
    }
}

export const insertReportVisit = (formData: any, type: string): any => {
    return {
        ...formData,
        IdWin: parseInt(formData.IdWin),
        Date: moment(new Date(formData.Date)).format('YYYY-MM-DD'),
        Code: (formData.IdResultPhoneVisit < 10) ? "0" + formData.IdResultPhoneVisit.toString() : formData.IdResultPhoneVisit.toString(),
        Description: formData.Description,
        Commentary: formData.Description,
        IdUser: parseInt(formData.IdUser),
        Process: (type == 'call') ? 'LLAMADO' : 'VISITA',
        IdResultPhoneVisit: parseInt(formData.IdResultPhoneVisit)
    };
}

export const insertUsers = (form: any, totalPrices: any, box: any): any => {

    let users: any = [];

    if (form.users && form.users.length > 0) {

        form.users.map((item: any) => {
            users.push({
                event_information: {
                    event: item.event_information.event,
                    financial_cut: item.event_information.financial_cut,
                    is_translator: item.event_information.event.is_translator,
                    translator: form.payment_information.currency === 'COP' ? parseInt(item.event_information.event.translators?.cop) : parseInt(item.event_information.translators.prices?.usd),
                },
                assistant: {
                    id: item.assistant.id,
                    name: item.assistant.name,
                    last_name: item.assistant.last_name,
                    identification: item.assistant.identification,
                    document_type: item.assistant.document_type,
                    email: item.assistant.email,
                    phone: item.assistant.phone,
                    gender: item.assistant.gender,
                    language: item.assistant.language,
                    country: item.assistant.country.name,
                    church: item.assistant.church,
                    leader: item.assistant.leader,
                    name_church: item.assistant.name_church,
                    name_pastor: item.assistant.name_pastor,
                    network: item.assistant.network,
                    pastor: item.assistant.pastor,
                    type_church: item.assistant.type_church
                }
            });
        });

    }

    let data = {

        payment_information: {
            amount: form.payment_information.currency === 'COP' ? totalPrices.total_price_cop : totalPrices.total_price_usd,
            translator: form.payment_information.currency === 'COP' ? totalPrices.prices_translator_cop : totalPrices.prices_translator_usd,
            is_translator: totalPrices.prices_translator_cop ? true : false,
            country: form.payment_information.country ? form.payment_information.country.name : form.payment_information.country,
            currency: form.payment_information.currency ? form.payment_information.currency : "COP",
            document: form.payment_information.document ? form.payment_information.document : null,
            document_type: form.payment_information.document_type ? form.payment_information.document_type : null,
            email: form.payment_information.email ? form.payment_information.email : null,
            last_name: form.payment_information.last_name ? form.payment_information.last_name : null,
            name: form.payment_information.name ? form.payment_information.name : null,
            description_of_change: form.payment_information.description_of_change ? form.payment_information.description_of_change : null,
            is_dataphone: form.payment_information.is_dataphone,
            payment_type: form.payment_information.payment_type ? form.payment_information.payment_type : null,
            platform: form.payment_information.platform ? form.payment_information.platform : null,
            url_response: "https://www.eventosg12.com/payment/transaction"
        },
        users: [...users],
        box: box

    };

    return data;

};