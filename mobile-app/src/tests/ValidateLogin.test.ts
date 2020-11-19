import { exp, sub } from "react-native-reanimated";
import { SignIn } from "../packages/user/utils";
import ValidateLogin from "../packages/user/ValidateLogin";

describe("Validate Login", () => {
  it("Should return invalid email", async () => {
    const values: SignIn = {
      email: "not_an_email@fake",
      password: "legit_password_1",
    };
    let errors = await ValidateLogin(values, (_: string) => {});
    expect(errors.email).toBe("Please enter a valid email");
    expect(errors.password).toBe("");
  });

  it("Should return empty email message", async () => {
    const values: SignIn = {
      email: "",
      password: "legit_password_1",
    };

    let errors = await ValidateLogin(values, (_: string) => {});
    expect(errors.email).toBe("Email cannot be empty");
    expect(errors.password).toBe("");
  });

  it("Should return empty password and email", async () => {
    const values: SignIn = {
      email: "",
      password: "",
    };
    let errors = await ValidateLogin(values, (_: string) => {});
    expect(errors.email).toBe("Email cannot be empty");
    expect(errors.password).toBe("Password cannot be empty");
  });
});
