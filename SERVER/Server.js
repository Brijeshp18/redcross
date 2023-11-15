const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5001;
require("dotenv").config();
const dbConfig = require("./config/dbconfig");
app.use(express.json());
app.use(cors()); // connect between different ports
const userRoutes = require("./routes/usersRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes")
const dashboardRoutes = require('./routes/dashboardRoutes')
app.use("/api/users", userRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/dashboard",dashboardRoutes)

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Bloodbank",
      version: "1.0.0",
      description: "API documentation for my Blood bank application.",
    },
    contact: {
      name: "Brijeshp",
      email: "mailto:brijesh@pumexinfotech.com",
    },
    servers: [
      {
        url: "http://localhost:5001/",
      },
    ],
  },

  apis: ["./routes/usersRoutes.js"],
};
const swaggerSpec = swaggerJSDoc(options);
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`node server is listening on port ${port}`);
});
