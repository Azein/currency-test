import "reflect-metadata";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { AppDataSource } from "./data-source";
import currencyRoutes from "./routes/currency.routes";
import accountRoutes from "./routes/account.routes";
import transferRoutes from "./routes/transfer.routes";
import { swaggerDefinition } from "./swagger";
import { seedDatabase } from "./seed";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

// Basic health check endpoint
app.get("/health", (_, res) => {
    res.json({ status: "ok" });
});

// API Routes
app.use("/api/currencies", currencyRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transfers", transferRoutes);

async function bootstrap() {
    try {
        // Initialize TypeORM connection
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");

        // Seed the database with sample data
        await seedDatabase();

        console.log(`\nSwagger documentation available at http://localhost:${PORT}/api-docs`);
        console.log("\nSample accounts created for testing:");
        console.log("- Owner ID 1: Has accounts in USD (1000) and EUR (500)");
        console.log("- Owner ID 2: Has accounts in USD (750) and EUR (1200)");
        console.log("\nYou can use these accounts to test transfers!");

        // Start Express server
        app.listen(PORT, () => {
            console.log(`\nServer is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error during initialization:", error);
        process.exit(1);
    }
}

bootstrap(); 