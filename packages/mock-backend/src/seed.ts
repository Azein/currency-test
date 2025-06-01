import { AppDataSource } from "./data-source";
import { Account } from "./entities/account.entity";

export async function seedDatabase() {
    const accountRepository = AppDataSource.getRepository(Account);

    // Check if we already have data
    const existingAccounts = await accountRepository.find();
    if (existingAccounts.length > 0) {
        console.log("Database already has data, skipping seed");
        return;
    }

    // Define owner names and addresses
    const owners = [
        { id: 1, name: "John Smith", address: "123 Main St, New York, NY 10001" },
        { id: 2, name: "Emma Davis", address: "456 Park Ave, Los Angeles, CA 90001" },
        { id: 3, name: "John Smith", address: "789 Oak Rd, Chicago, IL 60601" },
        { id: 4, name: "Sarah Johnson", address: "321 Pine St, San Francisco, CA 94101" },
        { id: 5, name: "Michael Brown", address: "567 Maple Ave, Boston, MA 02108" },
        { id: 6, name: "Lisa Anderson", address: "890 Cedar Ln, Seattle, WA 98101" },
        { id: 7, name: "David Wilson", address: "432 Birch Rd, Miami, FL 33101" },
        { id: 8, name: "Jennifer Taylor", address: "765 Elm St, Denver, CO 80201" },
        { id: 9, name: "Robert Martinez", address: "234 Willow Dr, Austin, TX 78701" },
        { id: 10, name: "Emily White", address: "876 Spruce Ct, Portland, OR 97201" },
        { id: 11, name: "James Thompson", address: "543 Ash Way, Phoenix, AZ 85001" },
        { id: 12, name: "Maria Garcia", address: "987 Palm Blvd, San Diego, CA 92101" },
        { id: 13, name: "William Lee", address: "654 Beach Ave, Houston, TX 77001" }
    ];

    // Create sample accounts for each owner
    const accounts: Account[] = [];
    for (const owner of owners) {
        // USD Account
        accounts.push(
            accountRepository.create({
                ownerId: owner.id,
                ownerName: owner.name,
                ownerAddress: owner.address,
                currency: "USD",
                balance: 1000 + Math.floor(Math.random() * 2000) // Random balance between 1000 and 3000
            })
        );

        // EUR Account
        accounts.push(
            accountRepository.create({
                ownerId: owner.id,
                ownerName: owner.name,
                ownerAddress: owner.address,
                currency: "EUR",
                balance: 500 + Math.floor(Math.random() * 1500) // Random balance between 500 and 2000
            })
        );
    }

    // Save all accounts
    await accountRepository.save(accounts);
    console.log("Sample data has been loaded");
    
    // Log the created accounts
    console.log("\nCreated accounts:");
    accounts.forEach(account => {
        console.log(`Account ID: ${account.id}`);
        console.log(`Owner ID: ${account.ownerId}`);
        console.log(`Owner Name: ${account.ownerName}`);
        console.log(`Owner Address: ${account.ownerAddress}`);
        console.log(`Currency: ${account.currency}`);
        console.log(`Balance: ${account.balance}`);
        console.log("---");
    });

    // Print summary for testing
    console.log("\nSample accounts created for testing:");
    owners.forEach(owner => {
        const usdAccount = accounts.find(a => a.ownerId === owner.id && a.currency === "USD");
        const eurAccount = accounts.find(a => a.ownerId === owner.id && a.currency === "EUR");
        console.log(`- Owner ID ${owner.id}: ${owner.name} has accounts in USD (${usdAccount?.balance}) and EUR (${eurAccount?.balance})`);
    });
    console.log("You can use these accounts to test transfers!");
} 