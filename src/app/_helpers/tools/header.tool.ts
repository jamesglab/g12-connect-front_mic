import { HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export const header = new HttpHeaders({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
});

export const headerFile = new HttpHeaders({
  
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
});
export const handleError = (error: HttpErrorResponse) => {
  if (error.error instanceof ErrorEvent) {
    throw error.error.message;
  } else {
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }
  return throwError(error);
}
