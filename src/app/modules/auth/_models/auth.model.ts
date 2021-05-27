export class AuthModel {
  accessToken: string;
  refreshToken: string;
  expiresIn: Date;

  setAuth(auth: any) {
    this.accessToken = auth.accessToken;
    this.refreshToken = auth.refreshToken;
    this.expiresIn = auth.expiresIn;
  }
}
export interface Response {
  result: boolean;
  entity: any[];
  message: string[];
  notificationType: Notification;
}

enum Notification {
  Exitoso = 1,
  Advertencia = 2,
  Fallida = 3
}