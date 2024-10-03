import { CreateUserDto } from "src/modules";
import { IUser } from "../schema";

export interface IUserService {
    create(createUserDto: CreateUserDto): Promise<Partial<IUser>>;
    findByEmail(email: string): Promise<IUser | null>;
    findById(id: string): Promise<IUser | null>;
    update(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
  }
  