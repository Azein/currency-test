import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Currency } from "../entities/currency.entity";

const currencyRepository = AppDataSource.getRepository(Currency);

export const CurrencyController = {
    async getAll(_: Request, res: Response) {
        try {
            const currencies = await currencyRepository.find();
            return res.json(currencies);
        } catch (error) {
            return res.status(500).json({ error: "Failed to fetch currencies" });
        }
    },

    async getOne(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const currency = await currencyRepository.findOneBy({ id });
            
            if (!currency) {
                return res.status(404).json({ error: "Currency not found" });
            }
            
            return res.json(currency);
        } catch (error) {
            return res.status(500).json({ error: "Failed to fetch currency" });
        }
    },

    async create(req: Request, res: Response) {
        try {
            const currency = currencyRepository.create(req.body);
            const result = await currencyRepository.save(currency);
            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ error: "Failed to create currency" });
        }
    },

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const currency = await currencyRepository.findOneBy({ id });
            
            if (!currency) {
                return res.status(404).json({ error: "Currency not found" });
            }
            
            currencyRepository.merge(currency, req.body);
            const result = await currencyRepository.save(currency);
            return res.json(result);
        } catch (error) {
            return res.status(500).json({ error: "Failed to update currency" });
        }
    },

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const currency = await currencyRepository.findOneBy({ id });
            
            if (!currency) {
                return res.status(404).json({ error: "Currency not found" });
            }
            
            await currencyRepository.remove(currency);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: "Failed to delete currency" });
        }
    }
}; 