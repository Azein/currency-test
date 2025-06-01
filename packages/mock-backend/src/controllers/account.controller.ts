import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Account } from "../entities/account.entity";
import { Like, ILike } from "typeorm";
import { OwnerService } from "../services/owner.service";

const accountRepository = AppDataSource.getRepository(Account);
const ownerService = new OwnerService();

export const AccountController = {
    async getAll(req: Request, res: Response) {
        try {
            const accounts = await accountRepository.find({
                order: {
                    createdAt: "DESC"
                }
            });

            return res.json(accounts);
        } catch (error) {
            return res.status(500).json({ error: "Failed to fetch accounts" });
        }
    },

    async getOne(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const account = await accountRepository.findOneBy({ id });
            
            if (!account) {
                return res.status(404).json({ error: "Account not found" });
            }
            
            return res.json(account);
        } catch (error) {
            return res.status(500).json({ error: "Failed to fetch account" });
        }
    },

    async getByOwnerId(req: Request, res: Response) {
        try {
            const { ownerId } = req.params;
            const accounts = await accountRepository.find({
                where: { ownerId: parseInt(ownerId) }
            });
            return res.json(accounts);
        } catch (error) {
            return res.status(500).json({ error: "Failed to fetch accounts by owner ID" });
        }
    },

    async create(req: Request, res: Response) {
        try {
            // Validate required fields
            const { ownerName, ownerAddress, currency, balance } = req.body;
            if (!ownerName || !ownerAddress || !currency) {
                return res.status(400).json({ error: "Owner name, address, and currency are required" });
            }

            // Validate currency format
            if (typeof currency !== 'string' || currency.length !== 3) {
                return res.status(400).json({ error: "Currency must be a 3-letter code" });
            }

            // Check if an owner with the same name and address already exists
            const existingOwnerId = await ownerService.findExistingOwner(ownerName, ownerAddress);
            
            // If owner exists, use their ID, otherwise generate a new one
            const ownerId = existingOwnerId || await ownerService.generateNewOwnerId();

            const account = accountRepository.create({
                ownerId,
                ownerName,
                ownerAddress,
                currency: currency.toUpperCase(),
                balance: balance || 0
            });

            const result = await accountRepository.save(account);
            return res.status(201).json(result);
        } catch (error) {
            console.error('Error creating account:', error);
            return res.status(500).json({ error: "Failed to create account" });
        }
    },

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const account = await accountRepository.findOneBy({ id });
            
            if (!account) {
                return res.status(404).json({ error: "Account not found" });
            }

            // Prevent editing of ownerId and currency
            if (req.body.ownerId !== undefined) {
                return res.status(400).json({ 
                    error: "Cannot modify owner ID of an existing account" 
                });
            }

            if (req.body.currency !== undefined) {
                return res.status(400).json({ 
                    error: "Cannot modify currency of an existing account" 
                });
            }

            // Only allow updating ownerName and balance
            const updatedAccount = {
                ...account,
                ownerName: req.body.ownerName !== undefined ? req.body.ownerName : account.ownerName,
                balance: req.body.balance !== undefined ? Number(req.body.balance) : account.balance
            };

            const result = await accountRepository.save(updatedAccount);
            return res.json(result);
        } catch (error) {
            return res.status(500).json({ error: "Failed to update account" });
        }
    },

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const account = await accountRepository.findOneBy({ id });
            
            if (!account) {
                return res.status(404).json({ error: "Account not found" });
            }

            // Don't allow deletion of accounts with non-zero balance
            if (account.balance !== 0) {
                return res.status(400).json({ 
                    error: "Cannot delete account with non-zero balance" 
                });
            }
            
            await accountRepository.remove(account);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: "Failed to delete account" });
        }
    },

    async search(req: Request, res: Response) {
        try {
            const { query, ownerId } = req.query;

            if (!query) {
                return res.status(400).json({ error: "Search query is required" });
            }

            const whereConditions: any[] = [
                { ownerName: ILike(`%${query}%`) }
            ];

            // If ownerId is provided, add it to the where conditions
            if (ownerId) {
                whereConditions.length = 0; // Clear previous conditions
                whereConditions.push({ ownerId: parseInt(ownerId as string) });
            }

            const accounts = await accountRepository.find({
                where: whereConditions,
                order: {
                    ownerName: "ASC"
                }
            });

            return res.json(accounts);
        } catch (error) {
            return res.status(500).json({ error: "Failed to search accounts" });
        }
    }
}; 