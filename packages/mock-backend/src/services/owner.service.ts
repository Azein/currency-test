import { AppDataSource } from "../data-source";
import { Account } from "../entities/account.entity";

export class OwnerService {
    private accountRepository = AppDataSource.getRepository(Account);

    async generateNewOwnerId(): Promise<number> {
        // Use a transaction to prevent race conditions
        return await AppDataSource.transaction(async transactionalEntityManager => {
            // Get the highest owner ID currently in use
            const result = await transactionalEntityManager
                .createQueryBuilder(Account, "account")
                .select("MAX(account.ownerId)", "maxOwnerId")
                .getRawOne();

            const currentMaxId = result.maxOwnerId || 0;
            return currentMaxId + 1;
        });
    }

    async findExistingOwner(ownerName: string, ownerAddress: string): Promise<number | null> {
        // Find an existing owner with the exact same name and address
        const existingAccount = await this.accountRepository.findOne({
            where: {
                ownerName,
                ownerAddress
            }
        });

        return existingAccount ? existingAccount.ownerId : null;
    }
} 