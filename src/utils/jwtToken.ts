import { JwtPayload, sign, verify } from "jsonwebtoken";

class JwtToken {
  private jwtSecret: string =
    <string>process.env.JWT_SECRET || "token.01010101";
  private id: string = "";

  constructor(id: string) {
    this.id = id;
  }

  public generateSessionToken(): string {
    const jwt = sign({ id: this.id }, this.jwtSecret, {
      expiresIn: "48h",
    });
    return jwt;
  }
  public verifySessionToken(jwt: string): string | JwtPayload {
    const jwtPayload = verify(jwt, this.jwtSecret);
    return jwtPayload;
  }
}

export default JwtToken;
