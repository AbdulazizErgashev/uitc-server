import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Testimonials API",
      version: "1.0.0",
      description: "Education platform API",
    },
    servers: [{ url: process.env.BASE_URL || "http://localhost:5050/api" }],
  },
  apis: ["./routes/*.js", "./validators/*.js"], // auto-documentation
};

const specs = swaggerJsDoc(options);

export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  console.log("Swagger running at /api-docs");
};
