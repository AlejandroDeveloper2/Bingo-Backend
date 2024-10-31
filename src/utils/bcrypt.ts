import { hash, compare } from "bcryptjs";

class Bcrypt {
  private password: string = "";
  private salt: string | number = "";

  constructor(password: string, salt: string | number) {
    this.password = password;
    this.salt = salt;
  }

  public async encryptPassword(): Promise<string> {
    const encryptedPassword = await hash(this.password, this.salt);
    return encryptedPassword;
  }

  public async verifyEncryptedPass(
    encryptedPassword: string
  ): Promise<boolean> {
    const isCorrect = await compare(this.password, encryptedPassword);
    return isCorrect;
  }
}

export default Bcrypt;
