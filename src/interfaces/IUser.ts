export type IUser<T = Date> = {
  id: number;
  email: string;
  login: string;
  date_start_subscription?: T | null;
  date_end_subscription?: T | null;
};

export type CreateUser = {
  email: string;
  login: string;
  password: string;
};
