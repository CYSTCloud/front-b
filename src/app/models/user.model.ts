export class User {
  id?: number;
  username?: string;
  // Propriétés utilisées par le frontend
  firstName?: string;
  lastName?: string;
  // Propriétés utilisées par le backend
  firstname?: string;
  name?: string;
  email?: string;
  birthDate?: string;
  avatarUrl?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
