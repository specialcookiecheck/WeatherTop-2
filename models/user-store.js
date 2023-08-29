import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("users");

export const userStore = {
  
  // returns all users in the database
  async getAllUsers() {
    await db.read();
    return db.data.users;
  },
  
  // adds a user to the database
  async addUser(user) {
    await db.read();
    user._id = v4();
    db.data.users.push(user);
    await db.write();
    const addedUser = await this.getUserByEmail(user.email);
    console.log(`Added user: ${addedUser}`);
    return addedUser;
  },
  
  // updates a user entry in the database
  async updateUser(userId, updatedUser) {
    const user = await this.getUserById(userId);
    console.log(`user to be updated: ${user._id}`);
    user.firstName = updatedUser.firstName;
    user.lastName = updatedUser.lastName;
    user.email = updatedUser.email;
    user.password = updatedUser.password;
    await db.write();
  },
  
  // returns a user based on the user ID
  async getUserById(id) {
    await db.read();
    return db.data.users.find((user) => user._id === id);
  },
  
  // returns a user based on the user email
  async getUserByEmail(email) {
    await db.read();
    return db.data.users.find((user) => user.email === email);
  },
  
  // deletes a user from the database
  async deleteUserById(id) {
    await db.read();
    const index = db.data.users.findIndex((user) => user._id === id);
    db.data.users.splice(index, 1);
    await db.write();
  },
  
  // deletes all users from the database
  async deleteAll() {
    db.data.users = [];
    await db.write();
  },
};
