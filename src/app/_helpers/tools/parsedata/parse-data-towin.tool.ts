/*THIS DOC IS CREATED WHIT THE FINALLY TO PARSE DATA 
FOR CORRECT INSERT OR UPDATE WHEN WE NEED CALLED SOME METHOD TO API*/
import { Person } from 'src/app/modules/to-win/_models/people.model';
import * as moment from 'moment';

///////////////////////////////////////////////////////PERSONS///////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////PHONEVISIT//////////////////////////////////////////////////////

export const formatToFilter = (formData: any): any => {
    let fixed = { Call: null, Visited: null };
    if(formData.Call){
        if(formData.Call == "1"){
            fixed.Call = true
        }else{
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
/////////////////////////////////////////////////////////////////////////////////////////////