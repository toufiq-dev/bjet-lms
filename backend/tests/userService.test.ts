// import UserService from "../src/services/userService";
// import User from "../src/models/user";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// jest.mock("../src/models/User");
// jest.mock("bcrypt");
// jest.mock("jsonwebtoken");

// describe("UserService", () => {
//   describe("register", () => {
//     it("should register a new user", async () => {
//       const mockUserSave = jest.fn();
//       (User.prototype.save as jest.Mock) = mockUserSave;

//       const hashedPassword = "hashedpassword";
//       (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

//       const email = "testuser@email.com";
//       const password = "password123";

//       await UserService.register(email, password);
//       expect(User).toHaveBeenCalledWith({
//         email,
//         password: hashedPassword,
//       });
//       expect(mockUserSave).toHaveBeenCalled();
//     });
//   });

//   describe("login", () => {
//     it("should return a token for valid credentials", async () => {
//       const mockFindOne = jest.fn().mockResolvedValue({
//         username: "testuser",
//         password: "hashedpassword",
//       });
//       (User.findOne as jest.Mock) = mockFindOne;

//       (bcrypt.compare as jest.Mock).mockResolvedValue(true);

//       const token = "jsonwebtoken";
//       (jwt.sign as jest.Mock).mockReturnValue(token);

//       const result = await UserService.login("testuser", "password123");

//       expect(mockFindOne).toHaveBeenCalledWith({ username: "testuser" });
//       expect(bcrypt.compare).toHaveBeenCalledWith(
//         "password123",
//         "hashedpassword"
//       );
//       expect(result).toBe(token);
//     });
//   });
// });
