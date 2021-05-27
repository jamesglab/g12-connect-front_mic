import * as moment from 'moment';

export const DAYS_OF_WEEK = [
    { id: "1", name: "Lunes" },
    { id: "2", name: "Martes" },
    { id: "3", name: "Miercoles" },
    { id: "4", name: "Jueves" },
    { id: "5", name: "Viernes" },
    { id: "6", name: "Sabado" },
    { id: "7", name: "Domingo" }
];

export const MONTHS_OBJECT = {
    "1": "Enero",
    "2": "Febrero",
    "3": "Marzo",
    "4": "Abril",
    "5": "Mayo",
    "6": "Junio",
    "7": "Julio",
    "8": "Agosto",
    "9": "Septiembre",
    "10": "Octubre",
    "11": "Noviembre",
    "12": "Diciembre"
};

export const WEEKS_OF_MONTH = (selectedMonth: string, year: number) => {

    var weeks: {}[] = [];

    const currentDate = new Date();

    if(selectedMonth){
        if(year === currentDate.getFullYear()){

            if ((new Date().getMonth() + 1) == parseInt(selectedMonth)) {
                //WE ARE IN SELECTED MONTH
                
                var createdDate = moment(new Date(currentDate));
                let currentWeek = (Math.ceil(createdDate.date() / 7)); // SELECTED CURRENT WEEK
        
                for (let i = 0; i < currentWeek; i++) {
                    weeks.push({ number: i + 1, name: `Semana ${i + 1}` });
                }
        
            } else {
                //WHE ARE IN OTHER MONTH
                var firstDay = (((new Date(currentDate.getFullYear(), parseInt(selectedMonth) - 1, 1).getDay() - 1) % 7) + 7) % 7;
                var days = new Date(currentDate.getFullYear(), parseInt(selectedMonth), 0).getDate() - 7 + firstDay;
                
                let numberOfWeeks = Math.ceil(days / 7); // NUMBER OF WEEKS OF THE SELECTED MONTH
                if(numberOfWeeks < 4){ numberOfWeeks = 4; }
                if(selectedMonth == "3"){ numberOfWeeks = 5; } //ADD 5 WEEKS TO MARCH -- FRAY PETITION

                for(let i = 0; i < numberOfWeeks ; i++){
                    weeks.push({ number: i + 1, name: `Semana ${i + 1}` });
                }
            }
    
        } else {
            //WHE ARE IN OTHER YEAR
            var firstDay = (((new Date(year, parseInt(selectedMonth) - 1, 1).getDay() - 1) % 7) + 7) % 7;
            var days = new Date(year, parseInt(selectedMonth), 0).getDate() - 7 + firstDay;
    
            let numberOfWeeks = Math.ceil(days / 7); // NUMBER OF WEEKS OF THE SELECTED MONTH
            if(numberOfWeeks < 4){ numberOfWeeks = 4; }
            
            for(let i = 0; i < numberOfWeeks ; i++){
                weeks.push({ number: i + 1, name: `Semana ${i + 1}` });
            }
        }
    }

    return weeks;
}

export const GET_MONTHS = (year: number) => {
    let _months = [];
    var currentMonth = moment(new Date()).month() + 1;
    var currentYear = new Date().getFullYear();
    let i = 1;
    if(year < currentYear){
        while (i <= 12) {
            _months.push({ id: i.toString(), name: MONTHS_OBJECT[i] });
            i++;
        }
    }else{
        while (i <= currentMonth) {
            _months.push({ id: i.toString(), name: MONTHS_OBJECT[i] });
            i++;
        }
    }
    return _months;
}

// const MONTHS = GET_MONTHS();

const disabledYears = (year): boolean => {
    const currentDate = new Date();
    return (year <= currentDate.getFullYear()) ? false : true;
}

export const YEARS = (): {}[] => {
    var _years = [];

    for (let i = 2020; i < 2024; i++) { _years.push({ id: i, name: i, disabled: disabledYears(i) }) }
    return _years;
}

