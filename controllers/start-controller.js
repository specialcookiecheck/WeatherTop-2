export const startController = {
  
  // renders the start view
  index(request, response) {
    const viewData = {
      title: "Welcome to WeatherTop2!",
    };
    console.log("start rendering");
    response.render("start-view", viewData);
  },
};