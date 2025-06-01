export const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Currency Transfer API",
        version: "1.0.0",
        description: "API for managing accounts and currency transfers",
        contact: {
            name: "API Support"
        }
    },
    servers: [
        {
            url: "http://localhost:3001",
            description: "Development server"
        }
    ],
    components: {
        schemas: {
            Account: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        format: "uuid",
                        description: "Account unique identifier"
                    },
                    ownerId: {
                        type: "integer",
                        description: "Owner's unique identifier"
                    },
                    currency: {
                        type: "string",
                        enum: ["USD", "EUR"],
                        description: "Account currency (USD or EUR)"
                    },
                    balance: {
                        type: "number",
                        format: "decimal",
                        description: "Current account balance"
                    },
                    createdAt: {
                        type: "string",
                        format: "date-time",
                        description: "Account creation timestamp"
                    },
                    updatedAt: {
                        type: "string",
                        format: "date-time",
                        description: "Account last update timestamp"
                    }
                },
                required: ["id", "ownerId", "currency", "balance"]
            },
            Transfer: {
                type: "object",
                properties: {
                    fromAccountId: {
                        type: "string",
                        format: "uuid",
                        description: "Source account ID"
                    },
                    toAccountId: {
                        type: "string",
                        format: "uuid",
                        description: "Destination account ID"
                    },
                    amount: {
                        type: "number",
                        format: "decimal",
                        description: "Amount to transfer"
                    }
                },
                required: ["fromAccountId", "toAccountId", "amount"]
            },
            Error: {
                type: "object",
                properties: {
                    error: {
                        type: "string",
                        description: "Error message"
                    }
                }
            }
        }
    },
    paths: {
        "/api/accounts": {
            get: {
                tags: ["Accounts"],
                summary: "Get all accounts",
                responses: {
                    "200": {
                        description: "List of accounts",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Account"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ["Accounts"],
                summary: "Create a new account",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    ownerId: {
                                        type: "integer"
                                    },
                                    currency: {
                                        type: "string",
                                        enum: ["USD", "EUR"]
                                    },
                                    balance: {
                                        type: "number",
                                        default: 0
                                    }
                                },
                                required: ["ownerId", "currency"]
                            }
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "Account created",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Account"
                                }
                            }
                        }
                    },
                    "400": {
                        description: "Invalid input",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/accounts/{id}": {
            get: {
                tags: ["Accounts"],
                summary: "Get account by ID",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                            format: "uuid"
                        }
                    }
                ],
                responses: {
                    "200": {
                        description: "Account found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Account"
                                }
                            }
                        }
                    },
                    "404": {
                        description: "Account not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                }
                            }
                        }
                    }
                }
            },
            put: {
                tags: ["Accounts"],
                summary: "Update account",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                            format: "uuid"
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    balance: {
                                        type: "number"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Account updated",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Account"
                                }
                            }
                        }
                    },
                    "404": {
                        description: "Account not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                }
                            }
                        }
                    }
                }
            },
            delete: {
                tags: ["Accounts"],
                summary: "Delete account",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                            format: "uuid"
                        }
                    }
                ],
                responses: {
                    "204": {
                        description: "Account deleted"
                    },
                    "404": {
                        description: "Account not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/accounts/owner/{ownerId}": {
            get: {
                tags: ["Accounts"],
                summary: "Get accounts by owner ID",
                parameters: [
                    {
                        name: "ownerId",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer"
                        }
                    }
                ],
                responses: {
                    "200": {
                        description: "List of accounts for the owner",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Account"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/accounts/search": {
            get: {
                tags: ["Accounts"],
                summary: "Search accounts",
                parameters: [
                    {
                        name: "query",
                        in: "query",
                        required: true,
                        schema: {
                            type: "string"
                        },
                        description: "Search query"
                    },
                    {
                        name: "ownerId",
                        in: "query",
                        required: false,
                        schema: {
                            type: "integer"
                        },
                        description: "Filter by owner ID"
                    }
                ],
                responses: {
                    "200": {
                        description: "List of matching accounts",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Account"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/transfers": {
            post: {
                tags: ["Transfers"],
                summary: "Create a new transfer",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Transfer"
                            }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Transfer completed",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: {
                                            type: "string"
                                        },
                                        fromAccount: {
                                            $ref: "#/components/schemas/Account"
                                        },
                                        toAccount: {
                                            $ref: "#/components/schemas/Account"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        description: "Invalid input or insufficient funds",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                }
                            }
                        }
                    },
                    "404": {
                        description: "Account not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/transfers/preview": {
            get: {
                tags: ["Transfers"],
                summary: "Preview currency conversion",
                parameters: [
                    {
                        name: "fromCurrency",
                        in: "query",
                        required: true,
                        schema: {
                            type: "string",
                            enum: ["USD", "EUR"]
                        }
                    },
                    {
                        name: "toCurrency",
                        in: "query",
                        required: true,
                        schema: {
                            type: "string",
                            enum: ["USD", "EUR"]
                        }
                    },
                    {
                        name: "amount",
                        in: "query",
                        required: true,
                        schema: {
                            type: "number"
                        }
                    }
                ],
                responses: {
                    "200": {
                        description: "Conversion preview",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        convertedAmount: {
                                            type: "number"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
} as const; 