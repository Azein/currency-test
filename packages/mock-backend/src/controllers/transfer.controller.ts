import { Request, Response } from "express";
import { TransferService } from "../services/transfer.service";

const transferService = new TransferService();

export const TransferController = {
    async transfer(req: Request, res: Response) {
        try {
            const { fromAccountId, toAccountId, amount } = req.body;

            // Validate required fields
            if (!fromAccountId || !toAccountId || amount === undefined) {
                return res.status(400).json({
                    error: "fromAccountId, toAccountId, and amount are required"
                });
            }

            // Validate amount is a number
            const transferAmount = Number(amount);
            if (isNaN(transferAmount)) {
                return res.status(400).json({
                    error: "Amount must be a valid number"
                });
            }

            // Perform transfer
            const result = await transferService.transfer(
                fromAccountId,
                toAccountId,
                transferAmount
            );

            return res.json({
                message: "Transfer successful",
                fromAccount: result.fromAccount,
                toAccount: result.toAccount
            });
        } catch (error) {
            if (error instanceof Error) {
                // Handle known errors
                switch (error.message) {
                    case "Transfer amount must be positive":
                    case "Amount must be a valid number":
                        return res.status(400).json({ error: error.message });
                    case "One or both accounts not found":
                        return res.status(404).json({ error: error.message });
                    case "Insufficient balance":
                        return res.status(422).json({ error: error.message });
                    case "Unsupported currency":
                        return res.status(422).json({ error: error.message });
                    default:
                        console.error("Transfer error:", error);
                        return res.status(500).json({ error: "Failed to process transfer" });
                }
            }
            return res.status(500).json({ error: "Failed to process transfer" });
        }
    },

    async previewConversion(req: Request, res: Response) {
        try {
            const { fromCurrency, toCurrency, amount } = req.query;
            
            if (!fromCurrency || !toCurrency || !amount) {
                return res.status(400).json({ error: 'Missing required parameters' });
            }

            const numericAmount = Number(amount);
            if (isNaN(numericAmount)) {
                return res.status(400).json({ error: 'Invalid amount' });
            }

            const result = transferService.previewConversion(
                fromCurrency as string,
                toCurrency as string,
                numericAmount
            );
            
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}; 