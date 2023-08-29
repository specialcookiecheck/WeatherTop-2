export const historyController = {
  
  // renders the history page
  index(request, response) {
    const viewData = {
      title: "History",
    };
    console.log("history rendering");
    response.render("history-view", viewData);
  },
};