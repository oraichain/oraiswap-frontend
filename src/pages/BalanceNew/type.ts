export interface Balance {
    denom: string;
    amount: string;
}

export interface Pagination {
    next_key?: any;
    total: string;
}

export interface BalancesOraiBridge {
    balances: Balance[];
    pagination: Pagination;
}