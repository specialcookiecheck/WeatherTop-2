export const weatherInfoController = {
  
  // renders the weather info page
  index(request, response) {
    const viewData = {
      title: "Weather Info",
    };
    console.log("weatherinfo rendering");
    response.render("weatherinfo-view", viewData);
  },
};
