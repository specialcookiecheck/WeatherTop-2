export const weatherInfoController = {
  index(request, response) {
    const viewData = {
      title: "Weather Info",
    };
    console.log("weatherinfo rendering");
    response.render("weatherinfo-view", viewData);
  },
};