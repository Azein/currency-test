import { AppDataSource } from "../data-source";
import { Account } from "../entities/account.entity";

type SupportedCurrency = 'USD' | 'EUR';
type ExchangeRates = {
    [K in SupportedCurrency]: {
        [V in SupportedCurrency]: number;
    };
};

const EXCHANGE_RATES: ExchangeRates = {
    'USD': {
        'EUR': 0.9,
        'USD': 1
    },
    'EUR': {
        'USD': 1 / 0.9,
        'EUR': 1
    }
};

export class TransferService {
    private accountRepository = AppDataSource.getRepository(Account);

    private convertAmount(amount: number, fromCurrency: SupportedCurrency, toCurrency: SupportedCurrency): number {
        const rate = EXCHANGE_RATES[fromCurrency][toCurrency];
        if (rate === undefined) {
            throw new Error(`Unsupported currency pair: ${fromCurrency}/${toCurrency}`);
        }
        return amount * rate;
    }

    async transfer(
        fromAccountId: string,
        toAccountId: string,
        amount: number
    ): Promise<{ fromAccount: Account; toAccount: Account }> {
        // Input validation
        if (amount <= 0) {
            throw new Error("Transfer amount must be positive");
        }

        // Prevent transfer to the same account
        if (fromAccountId === toAccountId) {
            throw new Error("Cannot transfer to the same account");
        }

        // Start transaction
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Get accounts within transaction
            const fromAccount = await queryRunner.manager.findOne(Account, {
                where: { id: fromAccountId }
            });
            const toAccount = await queryRunner.manager.findOne(Account, {
                where: { id: toAccountId }
            });

            // Validate accounts exist
            if (!fromAccount || !toAccount) {
                throw new Error("One or both accounts not found");
            }

            // Validate currencies
            if (!this.isSupportedCurrency(fromAccount.currency) || !this.isSupportedCurrency(toAccount.currency)) {
                throw new Error("Unsupported currency");
            }

            // Check sufficient balance first
            if (fromAccount.balance < amount) {
                throw new Error(`Insufficient balance: available ${fromAccount.balance} ${fromAccount.currency}, requested ${amount} ${fromAccount.currency}`);
            }

            // Calculate converted amount
            const convertedAmount = this.convertAmount(
                amount,
                fromAccount.currency as SupportedCurrency,
                toAccount.currency as SupportedCurrency
            );

            // Update balances
            fromAccount.balance -= amount;
            toAccount.balance += convertedAmount;

            // Save changes
            await queryRunner.manager.save(fromAccount);
            await queryRunner.manager.save(toAccount);

            // Commit transaction
            await queryRunner.commitTransaction();

            return { fromAccount, toAccount };
        } catch (error) {
            // Rollback on error
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            // Release resources
            await queryRunner.release();
        }
    }

    private isSupportedCurrency(currency: string): currency is SupportedCurrency {
        return currency in EXCHANGE_RATES;
    }

    previewConversion(
        fromCurrency: string,
        toCurrency: string,
        amount: number
    ): { convertedAmount: number } {
        // Input validation
        if (!amount || amount <= 0) {
            return { convertedAmount: 0 };
        }

        if (!this.isSupportedCurrency(fromCurrency) || !this.isSupportedCurrency(toCurrency)) {
            throw new Error("Unsupported currency");
        }

        // Calculate converted amount
        const convertedAmount = this.convertAmount(
            amount,
            fromCurrency as SupportedCurrency,
            toCurrency as SupportedCurrency
        );

        return { convertedAmount };
    }
} 