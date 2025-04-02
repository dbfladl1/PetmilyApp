export type addrType = {
  state: boolean;
  address: string;
  postcode: string;
};

export interface userForm {
  id: string;
  idVal: boolean;
  pw: string;
  pwChk: boolean;
  pwMatch: string;
  isPwMatch: boolean;
  gender: "F" | "M";
  phone: string;
  email: string;
  emailVal: boolean;
  profile: string;
  address: addrType | "";
  term: boolean;
}

export interface loginInfo {
  loginId: string;
  password: string;
}

export interface userInfo {
  email: string;
  emailVal: boolean;
  gender: string;
  joinDate: string;
  loginId: string;
  phone: string;
  profilePicturePath: string | null;
}
