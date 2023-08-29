export const aboutController = {
  
  // renders about page
  index(request, response) {
    const viewData = {
      title: "About WeatherTop2",
    };
    console.log("about rendering");
    response.render("about-view", viewData);
  },
};
