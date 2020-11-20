import { Values } from "../packages/user/utils";
import ValidateSignUp from "../packages/user/ValidateSignUp";
describe("Validate Sign Up inputs", () => {
  it("Catches a non-strong password", async () => {
    const values: Values = {
      username: "test",
      email: "test@test.com",
      password: "notastrongpassword",
      confPassword: "notastrongpassword",
      dob: new Date(),
    };
    const result = await ValidateSignUp(values, new Date("01-01-2020"));
    expect(result.confPassword).toBe(
      "Please enter a strong password\n8 Characters in length; Atleast:\n\t1 Number,\n\t1 Symbol,\n\t1 Uppercase Character,\n\t1 Lowercase Character"
    );
  });
  it("Catches an incorrect email", async () => {
    const values: Values = {
      username: "test",
      email: "nota@email",
      password: "Super_Secure_Password1",
      confPassword: "Super_Secure_Password1",
      dob: new Date(),
    };
    const result = await ValidateSignUp(values, new Date("01-01-2020"));
    expect(result.email).toBe("Please enter a valid email");
  });
  it("Catches an empty email", async () => {
    const values: Values = {
      username: "test",
      email: "",
      password: "Super_Secure_Password1",
      confPassword: "Super_Secure_Password1",
      dob: new Date(),
    };
    const result = await ValidateSignUp(values, new Date("01-01-2020"));
    expect(result.email).toBe("Email is required");
  });
  it("Catches an empty username", async () => {
    const values: Values = {
      username: "",
      email: "nota@email.com",
      password: "Super_Secure_Password1",
      confPassword: "Super_Secure_Password1",
      dob: new Date(),
    };
    const result = await ValidateSignUp(values, new Date("01-01-2020"));
    expect(result.username).toBe("Username is required");
  });
  it("Catches an empty password", async () => {
    const values: Values = {
      username: "test",
      email: "nota@email",
      password: "",
      confPassword: "Super_Secure_Password1",
      dob: new Date(),
    };
    const result = await ValidateSignUp(values, new Date("01-01-2020"));
    expect(result.confPassword).toBe(
      "Passwords cannot be empty\nPlease enter a strong password\n8 Characters in length; Atleast:\n\t1 Number,\n\t1 Symbol,\n\t1 Uppercase Character,\n\t1 Lowercase Character"
    );
  });
  it("Catches an empty confirm password", async () => {
    const values: Values = {
      username: "test",
      email: "nota@email",
      password: "Super_Secure_Password1",
      confPassword: "",
      dob: new Date(),
    };
    const result = await ValidateSignUp(values, new Date("01-01-2020"));
    expect(result.confPassword).toBe("Passwords cannot be empty\n");
  });
  it("Catches Date of Birth being today", async () => {
    const values: Values = {
      username: "test",
      email: "nota@email",
      password: "Super_Secure_Password1",
      confPassword: "",
      dob: new Date(),
    };
    const result = await ValidateSignUp(values, new Date());
    expect(result.dob).toBe("Date of Birth is required");
  });
  it("Catches Date of Birth being in the future", async () => {
    const values: Values = {
      username: "test",
      email: "nota@email",
      password: "Super_Secure_Password1",
      confPassword: "",
      dob: new Date(),
    };
    //Could allow erros if this app is still being used in the year 2100,
    //but hopefully I'll be dead by then
    const result = await ValidateSignUp(values, new Date("01-01-2100"));
    expect(result.dob).toBe("Date of Birth cannot be in the future");
  });
});
