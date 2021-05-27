/*THIS DOC IS CREATED WHIT THE FINALLY TO PARSE DATA 
FOR CORRECT INSERT OR UPDATE WHEN WE NEED CALLED SOME METHOD TO API*/
import { Person } from 'src/app/modules/to-win/_models/people.model';
import * as moment from 'moment';

export const editHostLeader = (formData: any): Person => {
    // console.log("CÓMO ES LA COSA", formData);
    return {
        idWin: formData.idGanarMCI,
        idLeader: formData.idLeader,
        idZone: formData.idZone,
        idCivilStatus: formData.idCivilStatus,
        names: formData.names,
        surNames: formData.surNames,
        idChurchType: formData.idChurchType,
        idUserCreation: formData.idUserCreation,
        personInvites: formData.personInvites,
        verifiedData: true,
        disposable: true,
        neighborhoods: "",
        idMeeting: 1,
        idDocumentType: formData.idDocumentType,
        documentNumber: formData.documentNumber,
        idPartnerWin: 1,
        phone: formData.phone,
        mobile: formData.mobile,
        address: formData.address,
        email: formData.email,
        petition: ""
    };
    // return {
    //     "idWin": 67126,
    //     "idLeader": 1,
    //     "idZone": 1,
    //     "idCivilStatus": 1,
    //     "names": "",
    //     "surNames": "",
    //     "idChurchType": 1,
    //     "idUserCreation": 1,
    //     "personInvites": "",
    //     "verifiedData": false,
    //     "disposable": true,
    //     "idDocumentType": 5,
    //     "idMeeting": 1,
    //     "documentNumber": "",
    //     "birthDate": "2020-01-01",
    //     "phone": "",
    //     "mobile": "",
    //     "neighborhoods": "",
    //     "address": "",
    //     "email": "",
    //     "petition": "",
    //     "idPartnerWin": 1,
    //     "gender": ""
    // }
}