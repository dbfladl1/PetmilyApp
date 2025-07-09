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

export interface chatContentInfo {
  step: number;
  message: string;
  sender: string;
  type: string;
  examples?: string[];
  branchMap?: { [key: string]: string };
  guide?: string;
};

