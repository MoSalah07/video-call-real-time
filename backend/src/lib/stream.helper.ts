import { IUser } from "../interfaces/auth.interface";
import { upsertStreamUser } from "./stream";

export interface IStreamUser {
  id: string;
  name: string;
  image: string;
}
export const insertStreamUser = async (user: IStreamUser): Promise<void> => {
  try {
    await upsertStreamUser({
      id: user.id.toString(),
      name: user.name,
      image: user.image || "",
    });
    console.log(`Stream User created successfully for ${user.name}`);
  } catch (err) {
    console.log(`Error in creating Stream User: ${err}`);
  }
};
