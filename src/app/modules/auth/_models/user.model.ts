import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';
import { SocialNetworksModel } from './social-networks.model';

export class UserModel extends AuthModel {

  idRol: number;
  rol: string;
  rolCode: string;
  userName: string;
  listSedes?: string;
  listObjetos?: string;
  objectsList?: { [ key: string]: string };
  email?: string;
  user: string;
  idUser: number;
  idLider: number;
  liderCode: string;

  // setUser(user: any) {
  //   this.id = user.id;
  //   this.username = user.username || '';
  //   this.password = user.password || '';
  //   this.fullname = user.fullname || '';
  //   this.email = user.email || '';
  //   this.pic = user.pic || './assets/media/users/default.jpg';
  //   this.roles = user.roles || [];
  //   this.occupation = user.occupation || '';
  //   this.companyName = user.companyName || '';
  //   this.phone = user.phone || '';
  //   this.address = user.address;
  //   this.socialNetworks = user.socialNetworks;
  // }
}

export interface ProfileUser {
  address?: string;
  civilStatus?: string;
  dateBirth?: string;
  documentNumber: string;
  documentType: string;
  email?: string;
  idUser: number;
  invitedBy?: string;
  leader?: string;
  location?: string;
  mainLeader?: string;
  neighborhood?: string;
  petition?: string;
  phone?: string;
  red?: string;
  sexualGender?: string;
  user: string;
}

export interface UsuarioRequest {
  user: string;
  password: string;
  idAccess?: number;
}
