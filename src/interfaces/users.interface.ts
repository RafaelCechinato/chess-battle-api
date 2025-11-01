interface UserModel {
    name: string;
    email: string;
    birthDate: string;
    password: string;
}

interface UserModelUpdate {
    id: number;
    name: string;
    email: string;
    birthDate: string;
    password: string;
    ranking: number;
}