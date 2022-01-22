import * as moment from 'moment';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { MONTHS_OBJECT } from '../items/forSelect';

const SHORT_MONTHS_OBJECT = {
  '1': 'Ene',
  '2': 'Feb',
  '3': 'Mar',
  '4': 'Abr',
  '5': 'May',
  '6': 'Jun',
  '7': 'Jul',
  '8': 'Ago',
  '9': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dic',
};

export const getCurrentDate = (format: string) => {
  return moment().format(format);
};

export const toInsertDate = (date: any, format: string) => {
  return moment(date).format(format);
};

export const getFirstDayOfWeek = (format: string) => {
  var now = moment();
  return now
    .clone()
    .isoWeekday(1)
    .set('hours', 0)
    .set('minutes', 0)
    .format(format); // RETURN MONDAY
};

///PHONE VISIT BOARD
export const getLastThreeMonths = (): string => {
  let _last = moment().month() - 1;
  if (_last == -1) {
    _last = 11;
  }
  return (
    SHORT_MONTHS_OBJECT[_last] + '-' + SHORT_MONTHS_OBJECT[moment().month() + 1]
  );
};

export const CURRENT_MONTH = MONTHS_OBJECT[moment().month() + 1];

export const getCurrentWeekBoard = () => {
  var now = moment();
  //now.format('w') +
  return (
    '(' +
    now.clone().weekday(1).format('DD') +
    '-' +
    now.clone().weekday(7).format('DD') +
    ')'
  );
};
////////////////////////////

export const toInsertHour = (date: {
  hour: number;
  minute: number;
  second: number;
}): string => {
  let newHour = '';
  let newMinute = '';

  if (date.hour < 10 && date.hour.toString()[0] != '0') {
    newHour = '0' + date.hour;
  } else {
    newHour = date.hour.toString();
  }

  if (
    (date.minute < 10 && date.minute.toString()[0] != '0') ||
    date.minute.toString() == '0'
  ) {
    newMinute = '0' + date.minute;
  } else {
    newMinute = date.minute.toString();
  }

  return newHour + ':' + newMinute + ':' + '00';
};

export const notificationConfig = (
  type: number,
  message?: string
): MatSnackBarConfig => {
  let _configType = {
    1: 'alert-success',
    2: 'alert-warning',
    3: 'alert-danger',
  };
  return {
    panelClass: ['alert', _configType[type], 'fade', 'show'],
    data: {
      message:
        type === 3
          ? message
            ? message
            : 'Nuestro servidor presenta problemas, intentalo nuevamente'
          : message,
    },
    duration: 4000,
    horizontalPosition: 'end',
    verticalPosition: 'bottom',
  };
};

export const parseToObjectOtherObject = (
  array: any[],
  key: string
): Promise<{ [key: string]: any }> => {
  return new Promise(async (resolve, reject) => {
    let object = {};
    const iterateArray = async () => {
      return Promise.all(
        array.map((item) => {
          object[item[key]] = item;
          return Promise.resolve('ok');
        })
      );
    };
    await iterateArray();
    resolve(object);
  });
};

export const parseMonth = (month: number): string => {
  return SHORT_MONTHS_OBJECT[month];
};

//OBTAIN BASE 64 FROM IMAGE
export const getBase64 = async (event) => {
  return new Promise((resolve, reject) => {
    let file = event.target.files[0];
    // if (file.size < 2097152) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
      resolve(event.target.result);
    };
    // } else {
    //   reject("Imagen Mayor a 2 MB")
    // }
  });
};

////////////////////GO CONSOLIDATED REPORT/////////////////////
export const makeSum = (data: any[], isFinal: boolean, position?: number) => {
  let sumObject: any = {
    assistants: 0,
    notReported: 0,
    reported: 0,
    total: 0,
    total12: 0,
    totalCel: 0,
    totalGo: 0,
  };
  if (!isFinal) {
    //FIRST, FOR REST THE OBJECT TO LEADER OBJECT
    data.map((item, i) => {
      if (i != position) {
        // IS NOT THE LEADER
        sumObject = getSumObject(sumObject, item);
      }
    });
    return sumObject;
  } else {
    //SECOND, FOR SHOW THE DATA
    data.map((item) => {
      sumObject = getSumObject(sumObject, item);
    });
    return sumObject;
  }
};

const getSumObject = (currentSum: any, item: any): any => {
  currentSum.totalGo += item.totalGo;
  currentSum.total12 += item.total12;
  currentSum.totalCel += item.totalCel;
  currentSum.total += item.total;
  currentSum.assistants += item.assistants;
  currentSum.reported += item.reported;
  currentSum.notReported += item.notReported;
  return currentSum;
};

export const makeRest = (leaderObject: any, restObject: any) => {
  leaderObject.totalGo -= restObject.totalGo;
  leaderObject.total12 -= restObject.total12;
  leaderObject.totalCel -= restObject.totalCel;
  leaderObject.total -= restObject.total;
  leaderObject.assistants -= restObject.assistants;
  leaderObject.reported -= restObject.reported;
  leaderObject.notReported -= restObject.notReported;
  return leaderObject;
};

export const foundLeader = (data: any): any => {
  //DEFINE OBJECT
  let leaderObject: any = { total: 0 };
  data.map((item, i) => {
    if (item.total > leaderObject.total) {
      item['position'] = i;
      leaderObject = item;
    }
  });
  return leaderObject;
};
//////////////////////////////////////////////////////////////

export const MONTHS_CREDIT_CARD = [
  { id: '01', name: 'Enero' },
  { id: '02', name: 'Febrero' },
  { id: '03', name: 'Marzo' },
  { id: '04', name: 'Abril' },
  { id: '05', name: 'Mayo' },
  { id: '06', name: 'Junio' },
  { id: '07', name: 'Julio' },
  { id: '08', name: 'Agosto' },
  { id: '09', name: 'Septiembre' },
  { id: '10', name: 'Octubre' },
  { id: '11', name: 'Noviembre' },
  { id: '12', name: 'Diciembre' },
];

export const YEARS_CREDIT_CARD = [
  { id: '2020', name: '2020' },
  { id: '2021', name: '2021' },
  { id: '2022', name: '2022' },
  { id: '2023', name: '2023' },
  { id: '2024', name: '2024' },
  { id: '2025', name: '2025' },
  { id: '2026', name: '2026' },
  { id: '2027', name: '2027' },
  { id: '2028', name: '2028' },
  { id: '2029', name: '2029' },
  { id: '2030', name: '2030' },
];

export const createCeld = (position) => {
  let celd = '';
  switch (position) {
    case 1:
      celd = 'A';
      break;

    case 2:
      celd = 'B';

      break;
    case 3:
      celd = 'C';

      break;
    case 4:
      celd = 'D';

      break;
    case 5:
      celd = 'E';

      break;
    case 6:
      celd = 'F';

      break;
    case 7:
      celd = 'G';

      break;
    case 8:
      celd = 'H';

      break;
    case 9:
      celd = 'I';

      break;
    case 10:
      celd = 'J';

      break;
    case 11:
      celd = 'K';

      break;
    case 12:
      celd = 'L';

      break;
    case 13:
      celd = 'M';

      break;
    case 14:
      celd = 'N';

      break;
    case 15:
      celd = 'O';

      break;
    case 16:
      celd = 'P';

      break;
    case 17:
      celd = 'Q';

      break;
    case 18:
      celd = 'R';

      break;

    case 19:
      celd = 'S';

      break;
    case 20:
      celd = 'T';

      break;
    case 21:
      celd = 'U';

      break;
    case 22:
      celd = 'V';

      break;
    case 23:
      celd = 'W';

      break;
    case 24:
      celd = 'X';

      break;
    case 25:
      celd = 'Y';

      break;

    case 26:
      celd = 'Z';

      break;
    default:
      break;
  }

  if (celd) {
    return celd;
  }
};
