export interface petInfo {
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  weight: string;
}

export interface addedPetInfo {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  weight: string;
}


export interface questionInfo {
  step: number;
  message: string;
  type: string;
  examples?: string[];
  branchMap?: { [key: string]: string };
  guide?: string;
}
[];
