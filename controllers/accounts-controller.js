import { userStore } from "../models/user-store.js";
import { stationStore } from "../models/station-store.js";
import { stationController } from "../controllers/station-controller.js";

export const accountsController = {
  async index(request, response) {
    const user = await accountsController.getLoggedInUser(request);
    const viewData = {
      title: "Account",
      user: user,
      userId: user._id,
    };
    response.render("account-view", viewData);
  },

  login(request, response) {
    const viewData = {
      title: "Login to the Service",
    };
    response.render("login-view", viewData);
  },

  logout(request, response) {
    response.cookie("weathertop2", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Login to the Service",
    };
    response.render("signup-view", viewData);
  },

  async register(request, response) {
    const user = request.body;
    await userStore.addUser(user);
    response.cookie("weathertop2", user._id);
    console.log(`logging in ${user.email} with id: ${user._id}`);
    response.redirect("/dashboard");
  },

  async authenticate(request, response) {
    const user = await userStore.getUserByEmail(request.body.email);
    if (user) {
      response.cookie("weathertop2", user._id);
      console.log(`logging in ${user.email} with id: ${user._id}`);
      response.redirect("/dashboard");
    } else {
      response.redirect("/login");
    }
  },

  async getLoggedInUser(request) {
    const userId = request.cookies.weathertop2;
    return await userStore.getUserById(userId);
  },
  
  async updateUser(request, response) {
    const userId = request.cookies.weathertop2;
    console.log("UserId: " + userId);
    const updatedUser = {
      firstName: request.body.firstname,
      lastName: request.body.lastname,
      email: request.body.email,
      password: request.body.password,
    };
    console.log(`Updating User ${userId}`);
    await userStore.updateUser(userId, updatedUser);
    response.redirect("/account/" + userId);
  },
  
  async deleteUser(request, response) {
    const userId = request.cookies.weathertop2;
    await accountsController.deleteAllStationsByUserId(userId);
    console.log(`Deleting User ${userId}`);
    await userStore.deleteUserById(userId);
    response.redirect("/");
  },
  
  async deleteAllStationsByUserId(userId) {
    console.log(`deleting all stations associated with user ${userId}:`)
    const stations = await stationStore.getStationsByUserId(userId);
    for (let i = 0; i < stations.length; i++) {
      const stationId = stations[i]._id;
      console.log(`StationId: ${stationId}`);
      console.log(`deleting station ${stationId} from user ${userId}`)
      await stationController.deleteAllReadingsFromStationByStationId(stationId);
      await stationStore.deleteStationById(stationId);
      console.log(`station ${stationId} deleted`);
    }
  }
  
};
