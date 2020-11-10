export interface IUser{
  fName?: string;
  loginState: loginState
}

export enum loginState {
  failed,
  undefined,
  success
};