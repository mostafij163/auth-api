export interface JwtPayload {
  email: string;
  role: string;
}

export interface signInDTO {
  email: string;
  password: string;
}
