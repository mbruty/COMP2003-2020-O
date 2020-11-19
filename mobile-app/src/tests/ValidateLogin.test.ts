import { SignIn } from "../packages/user/utils";
import ValidateLogin from "../packages/user/ValidateLogin";

describe("Validate Login", () => {
  it("Catches a bad email", async () => {
    const values: SignIn = {
      email: "not_an_email@fake",
      password: "legit_password_1",
    };
    let errors = await ValidateLogin(values, (_: string) => {});
    expect(errors.email).toBe("Please enter a valid email");
    expect(errors.password).toBe("");
  });

  it("Catches an empty email", async () => {
    const values: SignIn = {
      email: "",
      password: "legit_password_1",
    };

    let errors = await ValidateLogin(values, (_: string) => {});
    expect(errors.email).toBe("Email cannot be empty");
    expect(errors.password).toBe("");
  });

  it("Catches an empty email and password", async () => {
    const values: SignIn = {
      email: "",
      password: "",
    };
    let errors = await ValidateLogin(values, (_: string) => {});
    expect(errors.email).toBe("Email cannot be empty");
    expect(errors.password).toBe("Password cannot be empty");
  });
});
