const proxy = require("http-proxy-middleware");
module.exports = app => {
  console.log("i am loaded!!!!!!!!!!!!!");
  app.use(
    proxy("/socket.io", {
      target: "http://localhost:5000",
      //target: "https://obscure-beach-22779.herokuapp.com",
      ws: true,
      changeOrigin: true
    })
  );
  app.use(
    proxy("/api", {
      target: "http://localhost:5000",
      //target: "https://obscure-beach-22779.herokuapp.com",
      ws: true,
      secure: false,
      changeOrigin: true
    })
  );
};
