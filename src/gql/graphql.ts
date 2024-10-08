/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A floating point number that requires more precision than IEEE 754 binary 64 */
  BigFloat: { input: any; output: any; }
  /**
   * A signed eight-byte integer. The upper big integer values are greater than the
   * max value for a JavaScript number. Therefore all big integers will be output as
   * strings and not numbers.
   */
  BigInt: { input: any; output: any; }
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: { input: any; output: any; }
  /** The day, does not include a time. */
  Date: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type Account = Node & {
  __typename?: 'Account';
  /** Reads and enables pagination through a set of `ClaimFee`. */
  claimFees: ClaimFeesConnection;
  id: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  /** Reads and enables pagination through a set of `Pool`. */
  poolCreations: PoolsConnection;
  /** Reads and enables pagination through a set of `Pool`. */
  poolsByClaimFeeOwnerIdAndPoolId: AccountPoolsByClaimFeeOwnerIdAndPoolIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Pool`. */
  poolsByPositionOwnerIdAndPoolId: AccountPoolsByPositionOwnerIdAndPoolIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Position`. */
  positions: PositionsConnection;
  /** Reads and enables pagination through a set of `Position`. */
  positionsByClaimFeeOwnerIdAndPositionId: AccountPositionsByClaimFeeOwnerIdAndPositionIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Swap`. */
  swap: SwapsConnection;
  /** Reads and enables pagination through a set of `Token`. */
  tokensByPoolPoolCreatorIdAndTokenXId: AccountTokensByPoolPoolCreatorIdAndTokenXIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Token`. */
  tokensByPoolPoolCreatorIdAndTokenYId: AccountTokensByPoolPoolCreatorIdAndTokenYIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Token`. */
  tokensBySwapSenderIdAndTokenInId: AccountTokensBySwapSenderIdAndTokenInIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Token`. */
  tokensBySwapSenderIdAndTokenOutId: AccountTokensBySwapSenderIdAndTokenOutIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Transaction`. */
  transactionsByClaimFeeOwnerIdAndTransactionId: AccountTransactionsByClaimFeeOwnerIdAndTransactionIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Transaction`. */
  transactionsByPoolPoolCreatorIdAndTransactionId: AccountTransactionsByPoolPoolCreatorIdAndTransactionIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Transaction`. */
  transactionsByPositionOwnerIdAndTransactionId: AccountTransactionsByPositionOwnerIdAndTransactionIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Transaction`. */
  transactionsBySwapSenderIdAndTransactionId: AccountTransactionsBySwapSenderIdAndTransactionIdManyToManyConnection;
};


export type AccountClaimFeesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Claim_Fees_Distinct_Enum>[]>;
  filter?: InputMaybe<ClaimFeeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimFeesOrderBy[]>;
};


export type AccountPoolCreationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};


export type AccountPoolsByClaimFeeOwnerIdAndPoolIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};


export type AccountPoolsByPositionOwnerIdAndPoolIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};


export type AccountPositionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Positions_Distinct_Enum>[]>;
  filter?: InputMaybe<PositionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionsOrderBy[]>;
};


export type AccountPositionsByClaimFeeOwnerIdAndPositionIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Positions_Distinct_Enum>[]>;
  filter?: InputMaybe<PositionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionsOrderBy[]>;
};


export type AccountSwapArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Swaps_Distinct_Enum>[]>;
  filter?: InputMaybe<SwapFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapsOrderBy[]>;
};


export type AccountTokensByPoolPoolCreatorIdAndTokenXIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Tokens_Distinct_Enum>[]>;
  filter?: InputMaybe<TokenFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokensOrderBy[]>;
};


export type AccountTokensByPoolPoolCreatorIdAndTokenYIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Tokens_Distinct_Enum>[]>;
  filter?: InputMaybe<TokenFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokensOrderBy[]>;
};


export type AccountTokensBySwapSenderIdAndTokenInIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Tokens_Distinct_Enum>[]>;
  filter?: InputMaybe<TokenFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokensOrderBy[]>;
};


export type AccountTokensBySwapSenderIdAndTokenOutIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Tokens_Distinct_Enum>[]>;
  filter?: InputMaybe<TokenFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokensOrderBy[]>;
};


export type AccountTransactionsByClaimFeeOwnerIdAndTransactionIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Transactions_Distinct_Enum>[]>;
  filter?: InputMaybe<TransactionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TransactionsOrderBy[]>;
};


export type AccountTransactionsByPoolPoolCreatorIdAndTransactionIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Transactions_Distinct_Enum>[]>;
  filter?: InputMaybe<TransactionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TransactionsOrderBy[]>;
};


export type AccountTransactionsByPositionOwnerIdAndTransactionIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Transactions_Distinct_Enum>[]>;
  filter?: InputMaybe<TransactionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TransactionsOrderBy[]>;
};


export type AccountTransactionsBySwapSenderIdAndTransactionIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Transactions_Distinct_Enum>[]>;
  filter?: InputMaybe<TransactionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TransactionsOrderBy[]>;
};

export type AccountAggregates = {
  __typename?: 'AccountAggregates';
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<AccountDistinctCountAggregates>;
  keys?: Maybe<Scalars['String']['output'][]>;
};

export type AccountDistinctCountAggregates = {
  __typename?: 'AccountDistinctCountAggregates';
  /** Distinct count of _blockRange across the matching connection */
  _blockRange?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of _id across the matching connection */
  _id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `Account` object types. All fields are combined with a logical ‘and.’ */
export type AccountFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<AccountFilter[]>;
  /** Filter by the object’s `claimFees` relation. */
  claimFees?: InputMaybe<AccountToManyClaimFeeFilter>;
  /** Some related `claimFees` exist. */
  claimFeesExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<AccountFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<AccountFilter[]>;
  /** Filter by the object’s `poolCreations` relation. */
  poolCreations?: InputMaybe<AccountToManyPoolFilter>;
  /** Some related `poolCreations` exist. */
  poolCreationsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `positions` relation. */
  positions?: InputMaybe<AccountToManyPositionFilter>;
  /** Some related `positions` exist. */
  positionsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `swap` relation. */
  swap?: InputMaybe<AccountToManySwapFilter>;
  /** Some related `swap` exist. */
  swapExist?: InputMaybe<Scalars['Boolean']['input']>;
};

/** A connection to a list of `Pool` values, with data from `ClaimFee`. */
export type AccountPoolsByClaimFeeOwnerIdAndPoolIdManyToManyConnection = {
  __typename?: 'AccountPoolsByClaimFeeOwnerIdAndPoolIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<PoolAggregates>;
  /** A list of edges which contains the `Pool`, info from the `ClaimFee`, and the cursor to aid in pagination. */
  edges: AccountPoolsByClaimFeeOwnerIdAndPoolIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<PoolAggregates[]>;
  /** A list of `Pool` objects. */
  nodes: Maybe<Pool>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Pool` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Pool` values, with data from `ClaimFee`. */
export type AccountPoolsByClaimFeeOwnerIdAndPoolIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: PoolsGroupBy[];
  having?: InputMaybe<PoolsHavingInput>;
};

/** A `Pool` edge in the connection, with data from `ClaimFee`. */
export type AccountPoolsByClaimFeeOwnerIdAndPoolIdManyToManyEdge = {
  __typename?: 'AccountPoolsByClaimFeeOwnerIdAndPoolIdManyToManyEdge';
  /** Reads and enables pagination through a set of `ClaimFee`. */
  claimFees: ClaimFeesConnection;
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Pool` at the end of the edge. */
  node?: Maybe<Pool>;
};


/** A `Pool` edge in the connection, with data from `ClaimFee`. */
export type AccountPoolsByClaimFeeOwnerIdAndPoolIdManyToManyEdgeClaimFeesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Claim_Fees_Distinct_Enum>[]>;
  filter?: InputMaybe<ClaimFeeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimFeesOrderBy[]>;
};

/** A connection to a list of `Pool` values, with data from `Position`. */
export type AccountPoolsByPositionOwnerIdAndPoolIdManyToManyConnection = {
  __typename?: 'AccountPoolsByPositionOwnerIdAndPoolIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<PoolAggregates>;
  /** A list of edges which contains the `Pool`, info from the `Position`, and the cursor to aid in pagination. */
  edges: AccountPoolsByPositionOwnerIdAndPoolIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<PoolAggregates[]>;
  /** A list of `Pool` objects. */
  nodes: Maybe<Pool>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Pool` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Pool` values, with data from `Position`. */
export type AccountPoolsByPositionOwnerIdAndPoolIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: PoolsGroupBy[];
  having?: InputMaybe<PoolsHavingInput>;
};

/** A `Pool` edge in the connection, with data from `Position`. */
export type AccountPoolsByPositionOwnerIdAndPoolIdManyToManyEdge = {
  __typename?: 'AccountPoolsByPositionOwnerIdAndPoolIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Pool` at the end of the edge. */
  node?: Maybe<Pool>;
  /** Reads and enables pagination through a set of `Position`. */
  positions: PositionsConnection;
};


/** A `Pool` edge in the connection, with data from `Position`. */
export type AccountPoolsByPositionOwnerIdAndPoolIdManyToManyEdgePositionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Positions_Distinct_Enum>[]>;
  filter?: InputMaybe<PositionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionsOrderBy[]>;
};

/** A connection to a list of `Position` values, with data from `ClaimFee`. */
export type AccountPositionsByClaimFeeOwnerIdAndPositionIdManyToManyConnection = {
  __typename?: 'AccountPositionsByClaimFeeOwnerIdAndPositionIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<PositionAggregates>;
  /** A list of edges which contains the `Position`, info from the `ClaimFee`, and the cursor to aid in pagination. */
  edges: AccountPositionsByClaimFeeOwnerIdAndPositionIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<PositionAggregates[]>;
  /** A list of `Position` objects. */
  nodes: Maybe<Position>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Position` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Position` values, with data from `ClaimFee`. */
export type AccountPositionsByClaimFeeOwnerIdAndPositionIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: PositionsGroupBy[];
  having?: InputMaybe<PositionsHavingInput>;
};

/** A `Position` edge in the connection, with data from `ClaimFee`. */
export type AccountPositionsByClaimFeeOwnerIdAndPositionIdManyToManyEdge = {
  __typename?: 'AccountPositionsByClaimFeeOwnerIdAndPositionIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** Reads and enables pagination through a set of `ClaimFee`. */
  fees: ClaimFeesConnection;
  /** The `Position` at the end of the edge. */
  node?: Maybe<Position>;
};


/** A `Position` edge in the connection, with data from `ClaimFee`. */
export type AccountPositionsByClaimFeeOwnerIdAndPositionIdManyToManyEdgeFeesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Claim_Fees_Distinct_Enum>[]>;
  filter?: InputMaybe<ClaimFeeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimFeesOrderBy[]>;
};

/** A filter to be used against many `ClaimFee` object types. All fields are combined with a logical ‘and.’ */
export type AccountToManyClaimFeeFilter = {
  /** Aggregates across related `ClaimFee` match the filter criteria. */
  aggregates?: InputMaybe<ClaimFeeAggregatesFilter>;
  /** Every related `ClaimFee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ClaimFeeFilter>;
  /** No related `ClaimFee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ClaimFeeFilter>;
  /** Some related `ClaimFee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ClaimFeeFilter>;
};

/** A filter to be used against many `Pool` object types. All fields are combined with a logical ‘and.’ */
export type AccountToManyPoolFilter = {
  /** Aggregates across related `Pool` match the filter criteria. */
  aggregates?: InputMaybe<PoolAggregatesFilter>;
  /** Every related `Pool` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<PoolFilter>;
  /** No related `Pool` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<PoolFilter>;
  /** Some related `Pool` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<PoolFilter>;
};

/** A filter to be used against many `Position` object types. All fields are combined with a logical ‘and.’ */
export type AccountToManyPositionFilter = {
  /** Aggregates across related `Position` match the filter criteria. */
  aggregates?: InputMaybe<PositionAggregatesFilter>;
  /** Every related `Position` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<PositionFilter>;
  /** No related `Position` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<PositionFilter>;
  /** Some related `Position` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<PositionFilter>;
};

/** A filter to be used against many `Swap` object types. All fields are combined with a logical ‘and.’ */
export type AccountToManySwapFilter = {
  /** Aggregates across related `Swap` match the filter criteria. */
  aggregates?: InputMaybe<SwapAggregatesFilter>;
  /** Every related `Swap` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SwapFilter>;
  /** No related `Swap` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SwapFilter>;
  /** Some related `Swap` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SwapFilter>;
};

/** A connection to a list of `Token` values, with data from `Pool`. */
export type AccountTokensByPoolPoolCreatorIdAndTokenXIdManyToManyConnection = {
  __typename?: 'AccountTokensByPoolPoolCreatorIdAndTokenXIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TokenAggregates>;
  /** A list of edges which contains the `Token`, info from the `Pool`, and the cursor to aid in pagination. */
  edges: AccountTokensByPoolPoolCreatorIdAndTokenXIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TokenAggregates[]>;
  /** A list of `Token` objects. */
  nodes: Maybe<Token>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Token` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Token` values, with data from `Pool`. */
export type AccountTokensByPoolPoolCreatorIdAndTokenXIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TokensGroupBy[];
  having?: InputMaybe<TokensHavingInput>;
};

/** A `Token` edge in the connection, with data from `Pool`. */
export type AccountTokensByPoolPoolCreatorIdAndTokenXIdManyToManyEdge = {
  __typename?: 'AccountTokensByPoolPoolCreatorIdAndTokenXIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Token` at the end of the edge. */
  node?: Maybe<Token>;
  /** Reads and enables pagination through a set of `Pool`. */
  poolsByTokenXId: PoolsConnection;
};


/** A `Token` edge in the connection, with data from `Pool`. */
export type AccountTokensByPoolPoolCreatorIdAndTokenXIdManyToManyEdgePoolsByTokenXIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};

/** A connection to a list of `Token` values, with data from `Pool`. */
export type AccountTokensByPoolPoolCreatorIdAndTokenYIdManyToManyConnection = {
  __typename?: 'AccountTokensByPoolPoolCreatorIdAndTokenYIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TokenAggregates>;
  /** A list of edges which contains the `Token`, info from the `Pool`, and the cursor to aid in pagination. */
  edges: AccountTokensByPoolPoolCreatorIdAndTokenYIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TokenAggregates[]>;
  /** A list of `Token` objects. */
  nodes: Maybe<Token>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Token` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Token` values, with data from `Pool`. */
export type AccountTokensByPoolPoolCreatorIdAndTokenYIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TokensGroupBy[];
  having?: InputMaybe<TokensHavingInput>;
};

/** A `Token` edge in the connection, with data from `Pool`. */
export type AccountTokensByPoolPoolCreatorIdAndTokenYIdManyToManyEdge = {
  __typename?: 'AccountTokensByPoolPoolCreatorIdAndTokenYIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Token` at the end of the edge. */
  node?: Maybe<Token>;
  /** Reads and enables pagination through a set of `Pool`. */
  poolsByTokenYId: PoolsConnection;
};


/** A `Token` edge in the connection, with data from `Pool`. */
export type AccountTokensByPoolPoolCreatorIdAndTokenYIdManyToManyEdgePoolsByTokenYIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};

/** A connection to a list of `Token` values, with data from `Swap`. */
export type AccountTokensBySwapSenderIdAndTokenInIdManyToManyConnection = {
  __typename?: 'AccountTokensBySwapSenderIdAndTokenInIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TokenAggregates>;
  /** A list of edges which contains the `Token`, info from the `Swap`, and the cursor to aid in pagination. */
  edges: AccountTokensBySwapSenderIdAndTokenInIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TokenAggregates[]>;
  /** A list of `Token` objects. */
  nodes: Maybe<Token>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Token` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Token` values, with data from `Swap`. */
export type AccountTokensBySwapSenderIdAndTokenInIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TokensGroupBy[];
  having?: InputMaybe<TokensHavingInput>;
};

/** A `Token` edge in the connection, with data from `Swap`. */
export type AccountTokensBySwapSenderIdAndTokenInIdManyToManyEdge = {
  __typename?: 'AccountTokensBySwapSenderIdAndTokenInIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Token` at the end of the edge. */
  node?: Maybe<Token>;
  /** Reads and enables pagination through a set of `Swap`. */
  swapsByTokenInId: SwapsConnection;
};


/** A `Token` edge in the connection, with data from `Swap`. */
export type AccountTokensBySwapSenderIdAndTokenInIdManyToManyEdgeSwapsByTokenInIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Swaps_Distinct_Enum>[]>;
  filter?: InputMaybe<SwapFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapsOrderBy[]>;
};

/** A connection to a list of `Token` values, with data from `Swap`. */
export type AccountTokensBySwapSenderIdAndTokenOutIdManyToManyConnection = {
  __typename?: 'AccountTokensBySwapSenderIdAndTokenOutIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TokenAggregates>;
  /** A list of edges which contains the `Token`, info from the `Swap`, and the cursor to aid in pagination. */
  edges: AccountTokensBySwapSenderIdAndTokenOutIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TokenAggregates[]>;
  /** A list of `Token` objects. */
  nodes: Maybe<Token>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Token` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Token` values, with data from `Swap`. */
export type AccountTokensBySwapSenderIdAndTokenOutIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TokensGroupBy[];
  having?: InputMaybe<TokensHavingInput>;
};

/** A `Token` edge in the connection, with data from `Swap`. */
export type AccountTokensBySwapSenderIdAndTokenOutIdManyToManyEdge = {
  __typename?: 'AccountTokensBySwapSenderIdAndTokenOutIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Token` at the end of the edge. */
  node?: Maybe<Token>;
  /** Reads and enables pagination through a set of `Swap`. */
  swapsByTokenOutId: SwapsConnection;
};


/** A `Token` edge in the connection, with data from `Swap`. */
export type AccountTokensBySwapSenderIdAndTokenOutIdManyToManyEdgeSwapsByTokenOutIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Swaps_Distinct_Enum>[]>;
  filter?: InputMaybe<SwapFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapsOrderBy[]>;
};

/** A connection to a list of `Transaction` values, with data from `ClaimFee`. */
export type AccountTransactionsByClaimFeeOwnerIdAndTransactionIdManyToManyConnection = {
  __typename?: 'AccountTransactionsByClaimFeeOwnerIdAndTransactionIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TransactionAggregates>;
  /** A list of edges which contains the `Transaction`, info from the `ClaimFee`, and the cursor to aid in pagination. */
  edges: AccountTransactionsByClaimFeeOwnerIdAndTransactionIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TransactionAggregates[]>;
  /** A list of `Transaction` objects. */
  nodes: Maybe<Transaction>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Transaction` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Transaction` values, with data from `ClaimFee`. */
export type AccountTransactionsByClaimFeeOwnerIdAndTransactionIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TransactionsGroupBy[];
  having?: InputMaybe<TransactionsHavingInput>;
};

/** A `Transaction` edge in the connection, with data from `ClaimFee`. */
export type AccountTransactionsByClaimFeeOwnerIdAndTransactionIdManyToManyEdge = {
  __typename?: 'AccountTransactionsByClaimFeeOwnerIdAndTransactionIdManyToManyEdge';
  /** Reads and enables pagination through a set of `ClaimFee`. */
  claimFees: ClaimFeesConnection;
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Transaction` at the end of the edge. */
  node?: Maybe<Transaction>;
};


/** A `Transaction` edge in the connection, with data from `ClaimFee`. */
export type AccountTransactionsByClaimFeeOwnerIdAndTransactionIdManyToManyEdgeClaimFeesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Claim_Fees_Distinct_Enum>[]>;
  filter?: InputMaybe<ClaimFeeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimFeesOrderBy[]>;
};

/** A connection to a list of `Transaction` values, with data from `Pool`. */
export type AccountTransactionsByPoolPoolCreatorIdAndTransactionIdManyToManyConnection = {
  __typename?: 'AccountTransactionsByPoolPoolCreatorIdAndTransactionIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TransactionAggregates>;
  /** A list of edges which contains the `Transaction`, info from the `Pool`, and the cursor to aid in pagination. */
  edges: AccountTransactionsByPoolPoolCreatorIdAndTransactionIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TransactionAggregates[]>;
  /** A list of `Transaction` objects. */
  nodes: Maybe<Transaction>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Transaction` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Transaction` values, with data from `Pool`. */
export type AccountTransactionsByPoolPoolCreatorIdAndTransactionIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TransactionsGroupBy[];
  having?: InputMaybe<TransactionsHavingInput>;
};

/** A `Transaction` edge in the connection, with data from `Pool`. */
export type AccountTransactionsByPoolPoolCreatorIdAndTransactionIdManyToManyEdge = {
  __typename?: 'AccountTransactionsByPoolPoolCreatorIdAndTransactionIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Transaction` at the end of the edge. */
  node?: Maybe<Transaction>;
  /** Reads and enables pagination through a set of `Pool`. */
  poolCreations: PoolsConnection;
};


/** A `Transaction` edge in the connection, with data from `Pool`. */
export type AccountTransactionsByPoolPoolCreatorIdAndTransactionIdManyToManyEdgePoolCreationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};

/** A connection to a list of `Transaction` values, with data from `Position`. */
export type AccountTransactionsByPositionOwnerIdAndTransactionIdManyToManyConnection = {
  __typename?: 'AccountTransactionsByPositionOwnerIdAndTransactionIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TransactionAggregates>;
  /** A list of edges which contains the `Transaction`, info from the `Position`, and the cursor to aid in pagination. */
  edges: AccountTransactionsByPositionOwnerIdAndTransactionIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TransactionAggregates[]>;
  /** A list of `Transaction` objects. */
  nodes: Maybe<Transaction>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Transaction` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Transaction` values, with data from `Position`. */
export type AccountTransactionsByPositionOwnerIdAndTransactionIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TransactionsGroupBy[];
  having?: InputMaybe<TransactionsHavingInput>;
};

/** A `Transaction` edge in the connection, with data from `Position`. */
export type AccountTransactionsByPositionOwnerIdAndTransactionIdManyToManyEdge = {
  __typename?: 'AccountTransactionsByPositionOwnerIdAndTransactionIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Transaction` at the end of the edge. */
  node?: Maybe<Transaction>;
  /** Reads and enables pagination through a set of `Position`. */
  positions: PositionsConnection;
};


/** A `Transaction` edge in the connection, with data from `Position`. */
export type AccountTransactionsByPositionOwnerIdAndTransactionIdManyToManyEdgePositionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Positions_Distinct_Enum>[]>;
  filter?: InputMaybe<PositionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionsOrderBy[]>;
};

/** A connection to a list of `Transaction` values, with data from `Swap`. */
export type AccountTransactionsBySwapSenderIdAndTransactionIdManyToManyConnection = {
  __typename?: 'AccountTransactionsBySwapSenderIdAndTransactionIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TransactionAggregates>;
  /** A list of edges which contains the `Transaction`, info from the `Swap`, and the cursor to aid in pagination. */
  edges: AccountTransactionsBySwapSenderIdAndTransactionIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TransactionAggregates[]>;
  /** A list of `Transaction` objects. */
  nodes: Maybe<Transaction>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Transaction` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Transaction` values, with data from `Swap`. */
export type AccountTransactionsBySwapSenderIdAndTransactionIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TransactionsGroupBy[];
  having?: InputMaybe<TransactionsHavingInput>;
};

/** A `Transaction` edge in the connection, with data from `Swap`. */
export type AccountTransactionsBySwapSenderIdAndTransactionIdManyToManyEdge = {
  __typename?: 'AccountTransactionsBySwapSenderIdAndTransactionIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Transaction` at the end of the edge. */
  node?: Maybe<Transaction>;
  /** Reads and enables pagination through a set of `Swap`. */
  swap: SwapsConnection;
};


/** A `Transaction` edge in the connection, with data from `Swap`. */
export type AccountTransactionsBySwapSenderIdAndTransactionIdManyToManyEdgeSwapArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Swaps_Distinct_Enum>[]>;
  filter?: InputMaybe<SwapFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapsOrderBy[]>;
};

/** A connection to a list of `Account` values. */
export type AccountsConnection = {
  __typename?: 'AccountsConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<AccountAggregates>;
  /** A list of edges which contains the `Account` and cursor to aid in pagination. */
  edges: AccountsEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<AccountAggregates[]>;
  /** A list of `Account` objects. */
  nodes: Maybe<Account>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Account` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Account` values. */
export type AccountsConnectionGroupedAggregatesArgs = {
  groupBy: AccountsGroupBy[];
  having?: InputMaybe<AccountsHavingInput>;
};

/** A `Account` edge in the connection. */
export type AccountsEdge = {
  __typename?: 'AccountsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Account` at the end of the edge. */
  node?: Maybe<Account>;
};

/** Grouping methods for `Account` for usage during aggregation. */
export enum AccountsGroupBy {
  Id = 'ID'
}

/** Conditions for `Account` aggregates. */
export type AccountsHavingInput = {
  AND?: InputMaybe<AccountsHavingInput[]>;
  OR?: InputMaybe<AccountsHavingInput[]>;
};

/** Methods to use when ordering `Account`. */
export enum AccountsOrderBy {
  ClaimFeesAverageAmountUSDAsc = 'CLAIM_FEES_AVERAGE_AMOUNT_U_S_D_ASC',
  ClaimFeesAverageAmountUSDDesc = 'CLAIM_FEES_AVERAGE_AMOUNT_U_S_D_DESC',
  ClaimFeesAverageAmountXAsc = 'CLAIM_FEES_AVERAGE_AMOUNT_X_ASC',
  ClaimFeesAverageAmountXDesc = 'CLAIM_FEES_AVERAGE_AMOUNT_X_DESC',
  ClaimFeesAverageAmountYAsc = 'CLAIM_FEES_AVERAGE_AMOUNT_Y_ASC',
  ClaimFeesAverageAmountYDesc = 'CLAIM_FEES_AVERAGE_AMOUNT_Y_DESC',
  ClaimFeesAverageBlockRangeAsc = 'CLAIM_FEES_AVERAGE_BLOCK_RANGE_ASC',
  ClaimFeesAverageBlockRangeDesc = 'CLAIM_FEES_AVERAGE_BLOCK_RANGE_DESC',
  ClaimFeesAverageIdAsc = 'CLAIM_FEES_AVERAGE_ID_ASC',
  ClaimFeesAverageIdDesc = 'CLAIM_FEES_AVERAGE_ID_DESC',
  ClaimFeesAverageOwnerIdAsc = 'CLAIM_FEES_AVERAGE_OWNER_ID_ASC',
  ClaimFeesAverageOwnerIdDesc = 'CLAIM_FEES_AVERAGE_OWNER_ID_DESC',
  ClaimFeesAveragePoolIdAsc = 'CLAIM_FEES_AVERAGE_POOL_ID_ASC',
  ClaimFeesAveragePoolIdDesc = 'CLAIM_FEES_AVERAGE_POOL_ID_DESC',
  ClaimFeesAveragePositionIdAsc = 'CLAIM_FEES_AVERAGE_POSITION_ID_ASC',
  ClaimFeesAveragePositionIdDesc = 'CLAIM_FEES_AVERAGE_POSITION_ID_DESC',
  ClaimFeesAverageTransactionIdAsc = 'CLAIM_FEES_AVERAGE_TRANSACTION_ID_ASC',
  ClaimFeesAverageTransactionIdDesc = 'CLAIM_FEES_AVERAGE_TRANSACTION_ID_DESC',
  ClaimFeesCountAsc = 'CLAIM_FEES_COUNT_ASC',
  ClaimFeesCountDesc = 'CLAIM_FEES_COUNT_DESC',
  ClaimFeesDistinctCountAmountUSDAsc = 'CLAIM_FEES_DISTINCT_COUNT_AMOUNT_U_S_D_ASC',
  ClaimFeesDistinctCountAmountUSDDesc = 'CLAIM_FEES_DISTINCT_COUNT_AMOUNT_U_S_D_DESC',
  ClaimFeesDistinctCountAmountXAsc = 'CLAIM_FEES_DISTINCT_COUNT_AMOUNT_X_ASC',
  ClaimFeesDistinctCountAmountXDesc = 'CLAIM_FEES_DISTINCT_COUNT_AMOUNT_X_DESC',
  ClaimFeesDistinctCountAmountYAsc = 'CLAIM_FEES_DISTINCT_COUNT_AMOUNT_Y_ASC',
  ClaimFeesDistinctCountAmountYDesc = 'CLAIM_FEES_DISTINCT_COUNT_AMOUNT_Y_DESC',
  ClaimFeesDistinctCountBlockRangeAsc = 'CLAIM_FEES_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  ClaimFeesDistinctCountBlockRangeDesc = 'CLAIM_FEES_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  ClaimFeesDistinctCountIdAsc = 'CLAIM_FEES_DISTINCT_COUNT_ID_ASC',
  ClaimFeesDistinctCountIdDesc = 'CLAIM_FEES_DISTINCT_COUNT_ID_DESC',
  ClaimFeesDistinctCountOwnerIdAsc = 'CLAIM_FEES_DISTINCT_COUNT_OWNER_ID_ASC',
  ClaimFeesDistinctCountOwnerIdDesc = 'CLAIM_FEES_DISTINCT_COUNT_OWNER_ID_DESC',
  ClaimFeesDistinctCountPoolIdAsc = 'CLAIM_FEES_DISTINCT_COUNT_POOL_ID_ASC',
  ClaimFeesDistinctCountPoolIdDesc = 'CLAIM_FEES_DISTINCT_COUNT_POOL_ID_DESC',
  ClaimFeesDistinctCountPositionIdAsc = 'CLAIM_FEES_DISTINCT_COUNT_POSITION_ID_ASC',
  ClaimFeesDistinctCountPositionIdDesc = 'CLAIM_FEES_DISTINCT_COUNT_POSITION_ID_DESC',
  ClaimFeesDistinctCountTransactionIdAsc = 'CLAIM_FEES_DISTINCT_COUNT_TRANSACTION_ID_ASC',
  ClaimFeesDistinctCountTransactionIdDesc = 'CLAIM_FEES_DISTINCT_COUNT_TRANSACTION_ID_DESC',
  ClaimFeesMaxAmountUSDAsc = 'CLAIM_FEES_MAX_AMOUNT_U_S_D_ASC',
  ClaimFeesMaxAmountUSDDesc = 'CLAIM_FEES_MAX_AMOUNT_U_S_D_DESC',
  ClaimFeesMaxAmountXAsc = 'CLAIM_FEES_MAX_AMOUNT_X_ASC',
  ClaimFeesMaxAmountXDesc = 'CLAIM_FEES_MAX_AMOUNT_X_DESC',
  ClaimFeesMaxAmountYAsc = 'CLAIM_FEES_MAX_AMOUNT_Y_ASC',
  ClaimFeesMaxAmountYDesc = 'CLAIM_FEES_MAX_AMOUNT_Y_DESC',
  ClaimFeesMaxBlockRangeAsc = 'CLAIM_FEES_MAX_BLOCK_RANGE_ASC',
  ClaimFeesMaxBlockRangeDesc = 'CLAIM_FEES_MAX_BLOCK_RANGE_DESC',
  ClaimFeesMaxIdAsc = 'CLAIM_FEES_MAX_ID_ASC',
  ClaimFeesMaxIdDesc = 'CLAIM_FEES_MAX_ID_DESC',
  ClaimFeesMaxOwnerIdAsc = 'CLAIM_FEES_MAX_OWNER_ID_ASC',
  ClaimFeesMaxOwnerIdDesc = 'CLAIM_FEES_MAX_OWNER_ID_DESC',
  ClaimFeesMaxPoolIdAsc = 'CLAIM_FEES_MAX_POOL_ID_ASC',
  ClaimFeesMaxPoolIdDesc = 'CLAIM_FEES_MAX_POOL_ID_DESC',
  ClaimFeesMaxPositionIdAsc = 'CLAIM_FEES_MAX_POSITION_ID_ASC',
  ClaimFeesMaxPositionIdDesc = 'CLAIM_FEES_MAX_POSITION_ID_DESC',
  ClaimFeesMaxTransactionIdAsc = 'CLAIM_FEES_MAX_TRANSACTION_ID_ASC',
  ClaimFeesMaxTransactionIdDesc = 'CLAIM_FEES_MAX_TRANSACTION_ID_DESC',
  ClaimFeesMinAmountUSDAsc = 'CLAIM_FEES_MIN_AMOUNT_U_S_D_ASC',
  ClaimFeesMinAmountUSDDesc = 'CLAIM_FEES_MIN_AMOUNT_U_S_D_DESC',
  ClaimFeesMinAmountXAsc = 'CLAIM_FEES_MIN_AMOUNT_X_ASC',
  ClaimFeesMinAmountXDesc = 'CLAIM_FEES_MIN_AMOUNT_X_DESC',
  ClaimFeesMinAmountYAsc = 'CLAIM_FEES_MIN_AMOUNT_Y_ASC',
  ClaimFeesMinAmountYDesc = 'CLAIM_FEES_MIN_AMOUNT_Y_DESC',
  ClaimFeesMinBlockRangeAsc = 'CLAIM_FEES_MIN_BLOCK_RANGE_ASC',
  ClaimFeesMinBlockRangeDesc = 'CLAIM_FEES_MIN_BLOCK_RANGE_DESC',
  ClaimFeesMinIdAsc = 'CLAIM_FEES_MIN_ID_ASC',
  ClaimFeesMinIdDesc = 'CLAIM_FEES_MIN_ID_DESC',
  ClaimFeesMinOwnerIdAsc = 'CLAIM_FEES_MIN_OWNER_ID_ASC',
  ClaimFeesMinOwnerIdDesc = 'CLAIM_FEES_MIN_OWNER_ID_DESC',
  ClaimFeesMinPoolIdAsc = 'CLAIM_FEES_MIN_POOL_ID_ASC',
  ClaimFeesMinPoolIdDesc = 'CLAIM_FEES_MIN_POOL_ID_DESC',
  ClaimFeesMinPositionIdAsc = 'CLAIM_FEES_MIN_POSITION_ID_ASC',
  ClaimFeesMinPositionIdDesc = 'CLAIM_FEES_MIN_POSITION_ID_DESC',
  ClaimFeesMinTransactionIdAsc = 'CLAIM_FEES_MIN_TRANSACTION_ID_ASC',
  ClaimFeesMinTransactionIdDesc = 'CLAIM_FEES_MIN_TRANSACTION_ID_DESC',
  ClaimFeesStddevPopulationAmountUSDAsc = 'CLAIM_FEES_STDDEV_POPULATION_AMOUNT_U_S_D_ASC',
  ClaimFeesStddevPopulationAmountUSDDesc = 'CLAIM_FEES_STDDEV_POPULATION_AMOUNT_U_S_D_DESC',
  ClaimFeesStddevPopulationAmountXAsc = 'CLAIM_FEES_STDDEV_POPULATION_AMOUNT_X_ASC',
  ClaimFeesStddevPopulationAmountXDesc = 'CLAIM_FEES_STDDEV_POPULATION_AMOUNT_X_DESC',
  ClaimFeesStddevPopulationAmountYAsc = 'CLAIM_FEES_STDDEV_POPULATION_AMOUNT_Y_ASC',
  ClaimFeesStddevPopulationAmountYDesc = 'CLAIM_FEES_STDDEV_POPULATION_AMOUNT_Y_DESC',
  ClaimFeesStddevPopulationBlockRangeAsc = 'CLAIM_FEES_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  ClaimFeesStddevPopulationBlockRangeDesc = 'CLAIM_FEES_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  ClaimFeesStddevPopulationIdAsc = 'CLAIM_FEES_STDDEV_POPULATION_ID_ASC',
  ClaimFeesStddevPopulationIdDesc = 'CLAIM_FEES_STDDEV_POPULATION_ID_DESC',
  ClaimFeesStddevPopulationOwnerIdAsc = 'CLAIM_FEES_STDDEV_POPULATION_OWNER_ID_ASC',
  ClaimFeesStddevPopulationOwnerIdDesc = 'CLAIM_FEES_STDDEV_POPULATION_OWNER_ID_DESC',
  ClaimFeesStddevPopulationPoolIdAsc = 'CLAIM_FEES_STDDEV_POPULATION_POOL_ID_ASC',
  ClaimFeesStddevPopulationPoolIdDesc = 'CLAIM_FEES_STDDEV_POPULATION_POOL_ID_DESC',
  ClaimFeesStddevPopulationPositionIdAsc = 'CLAIM_FEES_STDDEV_POPULATION_POSITION_ID_ASC',
  ClaimFeesStddevPopulationPositionIdDesc = 'CLAIM_FEES_STDDEV_POPULATION_POSITION_ID_DESC',
  ClaimFeesStddevPopulationTransactionIdAsc = 'CLAIM_FEES_STDDEV_POPULATION_TRANSACTION_ID_ASC',
  ClaimFeesStddevPopulationTransactionIdDesc = 'CLAIM_FEES_STDDEV_POPULATION_TRANSACTION_ID_DESC',
  ClaimFeesStddevSampleAmountUSDAsc = 'CLAIM_FEES_STDDEV_SAMPLE_AMOUNT_U_S_D_ASC',
  ClaimFeesStddevSampleAmountUSDDesc = 'CLAIM_FEES_STDDEV_SAMPLE_AMOUNT_U_S_D_DESC',
  ClaimFeesStddevSampleAmountXAsc = 'CLAIM_FEES_STDDEV_SAMPLE_AMOUNT_X_ASC',
  ClaimFeesStddevSampleAmountXDesc = 'CLAIM_FEES_STDDEV_SAMPLE_AMOUNT_X_DESC',
  ClaimFeesStddevSampleAmountYAsc = 'CLAIM_FEES_STDDEV_SAMPLE_AMOUNT_Y_ASC',
  ClaimFeesStddevSampleAmountYDesc = 'CLAIM_FEES_STDDEV_SAMPLE_AMOUNT_Y_DESC',
  ClaimFeesStddevSampleBlockRangeAsc = 'CLAIM_FEES_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  ClaimFeesStddevSampleBlockRangeDesc = 'CLAIM_FEES_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  ClaimFeesStddevSampleIdAsc = 'CLAIM_FEES_STDDEV_SAMPLE_ID_ASC',
  ClaimFeesStddevSampleIdDesc = 'CLAIM_FEES_STDDEV_SAMPLE_ID_DESC',
  ClaimFeesStddevSampleOwnerIdAsc = 'CLAIM_FEES_STDDEV_SAMPLE_OWNER_ID_ASC',
  ClaimFeesStddevSampleOwnerIdDesc = 'CLAIM_FEES_STDDEV_SAMPLE_OWNER_ID_DESC',
  ClaimFeesStddevSamplePoolIdAsc = 'CLAIM_FEES_STDDEV_SAMPLE_POOL_ID_ASC',
  ClaimFeesStddevSamplePoolIdDesc = 'CLAIM_FEES_STDDEV_SAMPLE_POOL_ID_DESC',
  ClaimFeesStddevSamplePositionIdAsc = 'CLAIM_FEES_STDDEV_SAMPLE_POSITION_ID_ASC',
  ClaimFeesStddevSamplePositionIdDesc = 'CLAIM_FEES_STDDEV_SAMPLE_POSITION_ID_DESC',
  ClaimFeesStddevSampleTransactionIdAsc = 'CLAIM_FEES_STDDEV_SAMPLE_TRANSACTION_ID_ASC',
  ClaimFeesStddevSampleTransactionIdDesc = 'CLAIM_FEES_STDDEV_SAMPLE_TRANSACTION_ID_DESC',
  ClaimFeesSumAmountUSDAsc = 'CLAIM_FEES_SUM_AMOUNT_U_S_D_ASC',
  ClaimFeesSumAmountUSDDesc = 'CLAIM_FEES_SUM_AMOUNT_U_S_D_DESC',
  ClaimFeesSumAmountXAsc = 'CLAIM_FEES_SUM_AMOUNT_X_ASC',
  ClaimFeesSumAmountXDesc = 'CLAIM_FEES_SUM_AMOUNT_X_DESC',
  ClaimFeesSumAmountYAsc = 'CLAIM_FEES_SUM_AMOUNT_Y_ASC',
  ClaimFeesSumAmountYDesc = 'CLAIM_FEES_SUM_AMOUNT_Y_DESC',
  ClaimFeesSumBlockRangeAsc = 'CLAIM_FEES_SUM_BLOCK_RANGE_ASC',
  ClaimFeesSumBlockRangeDesc = 'CLAIM_FEES_SUM_BLOCK_RANGE_DESC',
  ClaimFeesSumIdAsc = 'CLAIM_FEES_SUM_ID_ASC',
  ClaimFeesSumIdDesc = 'CLAIM_FEES_SUM_ID_DESC',
  ClaimFeesSumOwnerIdAsc = 'CLAIM_FEES_SUM_OWNER_ID_ASC',
  ClaimFeesSumOwnerIdDesc = 'CLAIM_FEES_SUM_OWNER_ID_DESC',
  ClaimFeesSumPoolIdAsc = 'CLAIM_FEES_SUM_POOL_ID_ASC',
  ClaimFeesSumPoolIdDesc = 'CLAIM_FEES_SUM_POOL_ID_DESC',
  ClaimFeesSumPositionIdAsc = 'CLAIM_FEES_SUM_POSITION_ID_ASC',
  ClaimFeesSumPositionIdDesc = 'CLAIM_FEES_SUM_POSITION_ID_DESC',
  ClaimFeesSumTransactionIdAsc = 'CLAIM_FEES_SUM_TRANSACTION_ID_ASC',
  ClaimFeesSumTransactionIdDesc = 'CLAIM_FEES_SUM_TRANSACTION_ID_DESC',
  ClaimFeesVariancePopulationAmountUSDAsc = 'CLAIM_FEES_VARIANCE_POPULATION_AMOUNT_U_S_D_ASC',
  ClaimFeesVariancePopulationAmountUSDDesc = 'CLAIM_FEES_VARIANCE_POPULATION_AMOUNT_U_S_D_DESC',
  ClaimFeesVariancePopulationAmountXAsc = 'CLAIM_FEES_VARIANCE_POPULATION_AMOUNT_X_ASC',
  ClaimFeesVariancePopulationAmountXDesc = 'CLAIM_FEES_VARIANCE_POPULATION_AMOUNT_X_DESC',
  ClaimFeesVariancePopulationAmountYAsc = 'CLAIM_FEES_VARIANCE_POPULATION_AMOUNT_Y_ASC',
  ClaimFeesVariancePopulationAmountYDesc = 'CLAIM_FEES_VARIANCE_POPULATION_AMOUNT_Y_DESC',
  ClaimFeesVariancePopulationBlockRangeAsc = 'CLAIM_FEES_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  ClaimFeesVariancePopulationBlockRangeDesc = 'CLAIM_FEES_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  ClaimFeesVariancePopulationIdAsc = 'CLAIM_FEES_VARIANCE_POPULATION_ID_ASC',
  ClaimFeesVariancePopulationIdDesc = 'CLAIM_FEES_VARIANCE_POPULATION_ID_DESC',
  ClaimFeesVariancePopulationOwnerIdAsc = 'CLAIM_FEES_VARIANCE_POPULATION_OWNER_ID_ASC',
  ClaimFeesVariancePopulationOwnerIdDesc = 'CLAIM_FEES_VARIANCE_POPULATION_OWNER_ID_DESC',
  ClaimFeesVariancePopulationPoolIdAsc = 'CLAIM_FEES_VARIANCE_POPULATION_POOL_ID_ASC',
  ClaimFeesVariancePopulationPoolIdDesc = 'CLAIM_FEES_VARIANCE_POPULATION_POOL_ID_DESC',
  ClaimFeesVariancePopulationPositionIdAsc = 'CLAIM_FEES_VARIANCE_POPULATION_POSITION_ID_ASC',
  ClaimFeesVariancePopulationPositionIdDesc = 'CLAIM_FEES_VARIANCE_POPULATION_POSITION_ID_DESC',
  ClaimFeesVariancePopulationTransactionIdAsc = 'CLAIM_FEES_VARIANCE_POPULATION_TRANSACTION_ID_ASC',
  ClaimFeesVariancePopulationTransactionIdDesc = 'CLAIM_FEES_VARIANCE_POPULATION_TRANSACTION_ID_DESC',
  ClaimFeesVarianceSampleAmountUSDAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_AMOUNT_U_S_D_ASC',
  ClaimFeesVarianceSampleAmountUSDDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_AMOUNT_U_S_D_DESC',
  ClaimFeesVarianceSampleAmountXAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_AMOUNT_X_ASC',
  ClaimFeesVarianceSampleAmountXDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_AMOUNT_X_DESC',
  ClaimFeesVarianceSampleAmountYAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_AMOUNT_Y_ASC',
  ClaimFeesVarianceSampleAmountYDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_AMOUNT_Y_DESC',
  ClaimFeesVarianceSampleBlockRangeAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  ClaimFeesVarianceSampleBlockRangeDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  ClaimFeesVarianceSampleIdAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_ID_ASC',
  ClaimFeesVarianceSampleIdDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_ID_DESC',
  ClaimFeesVarianceSampleOwnerIdAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_OWNER_ID_ASC',
  ClaimFeesVarianceSampleOwnerIdDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_OWNER_ID_DESC',
  ClaimFeesVarianceSamplePoolIdAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_POOL_ID_ASC',
  ClaimFeesVarianceSamplePoolIdDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_POOL_ID_DESC',
  ClaimFeesVarianceSamplePositionIdAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_POSITION_ID_ASC',
  ClaimFeesVarianceSamplePositionIdDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_POSITION_ID_DESC',
  ClaimFeesVarianceSampleTransactionIdAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_TRANSACTION_ID_ASC',
  ClaimFeesVarianceSampleTransactionIdDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_TRANSACTION_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PoolCreationsAverageBlockRangeAsc = 'POOL_CREATIONS_AVERAGE_BLOCK_RANGE_ASC',
  PoolCreationsAverageBlockRangeDesc = 'POOL_CREATIONS_AVERAGE_BLOCK_RANGE_DESC',
  PoolCreationsAverageCollectedFeesTokenXAsc = 'POOL_CREATIONS_AVERAGE_COLLECTED_FEES_TOKEN_X_ASC',
  PoolCreationsAverageCollectedFeesTokenXDesc = 'POOL_CREATIONS_AVERAGE_COLLECTED_FEES_TOKEN_X_DESC',
  PoolCreationsAverageCollectedFeesTokenYAsc = 'POOL_CREATIONS_AVERAGE_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolCreationsAverageCollectedFeesTokenYDesc = 'POOL_CREATIONS_AVERAGE_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolCreationsAverageCollectedFeesUSDAsc = 'POOL_CREATIONS_AVERAGE_COLLECTED_FEES_U_S_D_ASC',
  PoolCreationsAverageCollectedFeesUSDDesc = 'POOL_CREATIONS_AVERAGE_COLLECTED_FEES_U_S_D_DESC',
  PoolCreationsAverageCreatedAtAsc = 'POOL_CREATIONS_AVERAGE_CREATED_AT_ASC',
  PoolCreationsAverageCreatedAtBlockNumberAsc = 'POOL_CREATIONS_AVERAGE_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolCreationsAverageCreatedAtBlockNumberDesc = 'POOL_CREATIONS_AVERAGE_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolCreationsAverageCreatedAtDesc = 'POOL_CREATIONS_AVERAGE_CREATED_AT_DESC',
  PoolCreationsAverageCurrentTickAsc = 'POOL_CREATIONS_AVERAGE_CURRENT_TICK_ASC',
  PoolCreationsAverageCurrentTickDesc = 'POOL_CREATIONS_AVERAGE_CURRENT_TICK_DESC',
  PoolCreationsAverageFeesUSDAsc = 'POOL_CREATIONS_AVERAGE_FEES_U_S_D_ASC',
  PoolCreationsAverageFeesUSDDesc = 'POOL_CREATIONS_AVERAGE_FEES_U_S_D_DESC',
  PoolCreationsAverageFeeAsc = 'POOL_CREATIONS_AVERAGE_FEE_ASC',
  PoolCreationsAverageFeeDesc = 'POOL_CREATIONS_AVERAGE_FEE_DESC',
  PoolCreationsAverageIdAsc = 'POOL_CREATIONS_AVERAGE_ID_ASC',
  PoolCreationsAverageIdDesc = 'POOL_CREATIONS_AVERAGE_ID_DESC',
  PoolCreationsAverageLiquidityAsc = 'POOL_CREATIONS_AVERAGE_LIQUIDITY_ASC',
  PoolCreationsAverageLiquidityDesc = 'POOL_CREATIONS_AVERAGE_LIQUIDITY_DESC',
  PoolCreationsAveragePoolCreatorIdAsc = 'POOL_CREATIONS_AVERAGE_POOL_CREATOR_ID_ASC',
  PoolCreationsAveragePoolCreatorIdDesc = 'POOL_CREATIONS_AVERAGE_POOL_CREATOR_ID_DESC',
  PoolCreationsAverageSqrtPriceAsc = 'POOL_CREATIONS_AVERAGE_SQRT_PRICE_ASC',
  PoolCreationsAverageSqrtPriceDesc = 'POOL_CREATIONS_AVERAGE_SQRT_PRICE_DESC',
  PoolCreationsAverageTickSpacingAsc = 'POOL_CREATIONS_AVERAGE_TICK_SPACING_ASC',
  PoolCreationsAverageTickSpacingDesc = 'POOL_CREATIONS_AVERAGE_TICK_SPACING_DESC',
  PoolCreationsAverageTokenXIdAsc = 'POOL_CREATIONS_AVERAGE_TOKEN_X_ID_ASC',
  PoolCreationsAverageTokenXIdDesc = 'POOL_CREATIONS_AVERAGE_TOKEN_X_ID_DESC',
  PoolCreationsAverageTokenYIdAsc = 'POOL_CREATIONS_AVERAGE_TOKEN_Y_ID_ASC',
  PoolCreationsAverageTokenYIdDesc = 'POOL_CREATIONS_AVERAGE_TOKEN_Y_ID_DESC',
  PoolCreationsAverageTotalValueLockedTokenXAsc = 'POOL_CREATIONS_AVERAGE_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolCreationsAverageTotalValueLockedTokenXDesc = 'POOL_CREATIONS_AVERAGE_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolCreationsAverageTotalValueLockedTokenYAsc = 'POOL_CREATIONS_AVERAGE_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolCreationsAverageTotalValueLockedTokenYDesc = 'POOL_CREATIONS_AVERAGE_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolCreationsAverageTotalValueLockedUSDAsc = 'POOL_CREATIONS_AVERAGE_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolCreationsAverageTotalValueLockedUSDDesc = 'POOL_CREATIONS_AVERAGE_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolCreationsAverageTransactionIdAsc = 'POOL_CREATIONS_AVERAGE_TRANSACTION_ID_ASC',
  PoolCreationsAverageTransactionIdDesc = 'POOL_CREATIONS_AVERAGE_TRANSACTION_ID_DESC',
  PoolCreationsAverageTxCountAsc = 'POOL_CREATIONS_AVERAGE_TX_COUNT_ASC',
  PoolCreationsAverageTxCountDesc = 'POOL_CREATIONS_AVERAGE_TX_COUNT_DESC',
  PoolCreationsAverageUpdatedAtAsc = 'POOL_CREATIONS_AVERAGE_UPDATED_AT_ASC',
  PoolCreationsAverageUpdatedAtDesc = 'POOL_CREATIONS_AVERAGE_UPDATED_AT_DESC',
  PoolCreationsAverageVolumeTokenXAsc = 'POOL_CREATIONS_AVERAGE_VOLUME_TOKEN_X_ASC',
  PoolCreationsAverageVolumeTokenXDesc = 'POOL_CREATIONS_AVERAGE_VOLUME_TOKEN_X_DESC',
  PoolCreationsAverageVolumeTokenYAsc = 'POOL_CREATIONS_AVERAGE_VOLUME_TOKEN_Y_ASC',
  PoolCreationsAverageVolumeTokenYDesc = 'POOL_CREATIONS_AVERAGE_VOLUME_TOKEN_Y_DESC',
  PoolCreationsAverageVolumeUSDAsc = 'POOL_CREATIONS_AVERAGE_VOLUME_U_S_D_ASC',
  PoolCreationsAverageVolumeUSDDesc = 'POOL_CREATIONS_AVERAGE_VOLUME_U_S_D_DESC',
  PoolCreationsCountAsc = 'POOL_CREATIONS_COUNT_ASC',
  PoolCreationsCountDesc = 'POOL_CREATIONS_COUNT_DESC',
  PoolCreationsDistinctCountBlockRangeAsc = 'POOL_CREATIONS_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  PoolCreationsDistinctCountBlockRangeDesc = 'POOL_CREATIONS_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  PoolCreationsDistinctCountCollectedFeesTokenXAsc = 'POOL_CREATIONS_DISTINCT_COUNT_COLLECTED_FEES_TOKEN_X_ASC',
  PoolCreationsDistinctCountCollectedFeesTokenXDesc = 'POOL_CREATIONS_DISTINCT_COUNT_COLLECTED_FEES_TOKEN_X_DESC',
  PoolCreationsDistinctCountCollectedFeesTokenYAsc = 'POOL_CREATIONS_DISTINCT_COUNT_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolCreationsDistinctCountCollectedFeesTokenYDesc = 'POOL_CREATIONS_DISTINCT_COUNT_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolCreationsDistinctCountCollectedFeesUSDAsc = 'POOL_CREATIONS_DISTINCT_COUNT_COLLECTED_FEES_U_S_D_ASC',
  PoolCreationsDistinctCountCollectedFeesUSDDesc = 'POOL_CREATIONS_DISTINCT_COUNT_COLLECTED_FEES_U_S_D_DESC',
  PoolCreationsDistinctCountCreatedAtAsc = 'POOL_CREATIONS_DISTINCT_COUNT_CREATED_AT_ASC',
  PoolCreationsDistinctCountCreatedAtBlockNumberAsc = 'POOL_CREATIONS_DISTINCT_COUNT_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolCreationsDistinctCountCreatedAtBlockNumberDesc = 'POOL_CREATIONS_DISTINCT_COUNT_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolCreationsDistinctCountCreatedAtDesc = 'POOL_CREATIONS_DISTINCT_COUNT_CREATED_AT_DESC',
  PoolCreationsDistinctCountCurrentTickAsc = 'POOL_CREATIONS_DISTINCT_COUNT_CURRENT_TICK_ASC',
  PoolCreationsDistinctCountCurrentTickDesc = 'POOL_CREATIONS_DISTINCT_COUNT_CURRENT_TICK_DESC',
  PoolCreationsDistinctCountFeesUSDAsc = 'POOL_CREATIONS_DISTINCT_COUNT_FEES_U_S_D_ASC',
  PoolCreationsDistinctCountFeesUSDDesc = 'POOL_CREATIONS_DISTINCT_COUNT_FEES_U_S_D_DESC',
  PoolCreationsDistinctCountFeeAsc = 'POOL_CREATIONS_DISTINCT_COUNT_FEE_ASC',
  PoolCreationsDistinctCountFeeDesc = 'POOL_CREATIONS_DISTINCT_COUNT_FEE_DESC',
  PoolCreationsDistinctCountIdAsc = 'POOL_CREATIONS_DISTINCT_COUNT_ID_ASC',
  PoolCreationsDistinctCountIdDesc = 'POOL_CREATIONS_DISTINCT_COUNT_ID_DESC',
  PoolCreationsDistinctCountLiquidityAsc = 'POOL_CREATIONS_DISTINCT_COUNT_LIQUIDITY_ASC',
  PoolCreationsDistinctCountLiquidityDesc = 'POOL_CREATIONS_DISTINCT_COUNT_LIQUIDITY_DESC',
  PoolCreationsDistinctCountPoolCreatorIdAsc = 'POOL_CREATIONS_DISTINCT_COUNT_POOL_CREATOR_ID_ASC',
  PoolCreationsDistinctCountPoolCreatorIdDesc = 'POOL_CREATIONS_DISTINCT_COUNT_POOL_CREATOR_ID_DESC',
  PoolCreationsDistinctCountSqrtPriceAsc = 'POOL_CREATIONS_DISTINCT_COUNT_SQRT_PRICE_ASC',
  PoolCreationsDistinctCountSqrtPriceDesc = 'POOL_CREATIONS_DISTINCT_COUNT_SQRT_PRICE_DESC',
  PoolCreationsDistinctCountTickSpacingAsc = 'POOL_CREATIONS_DISTINCT_COUNT_TICK_SPACING_ASC',
  PoolCreationsDistinctCountTickSpacingDesc = 'POOL_CREATIONS_DISTINCT_COUNT_TICK_SPACING_DESC',
  PoolCreationsDistinctCountTokenXIdAsc = 'POOL_CREATIONS_DISTINCT_COUNT_TOKEN_X_ID_ASC',
  PoolCreationsDistinctCountTokenXIdDesc = 'POOL_CREATIONS_DISTINCT_COUNT_TOKEN_X_ID_DESC',
  PoolCreationsDistinctCountTokenYIdAsc = 'POOL_CREATIONS_DISTINCT_COUNT_TOKEN_Y_ID_ASC',
  PoolCreationsDistinctCountTokenYIdDesc = 'POOL_CREATIONS_DISTINCT_COUNT_TOKEN_Y_ID_DESC',
  PoolCreationsDistinctCountTotalValueLockedTokenXAsc = 'POOL_CREATIONS_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolCreationsDistinctCountTotalValueLockedTokenXDesc = 'POOL_CREATIONS_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolCreationsDistinctCountTotalValueLockedTokenYAsc = 'POOL_CREATIONS_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolCreationsDistinctCountTotalValueLockedTokenYDesc = 'POOL_CREATIONS_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolCreationsDistinctCountTotalValueLockedUSDAsc = 'POOL_CREATIONS_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolCreationsDistinctCountTotalValueLockedUSDDesc = 'POOL_CREATIONS_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolCreationsDistinctCountTransactionIdAsc = 'POOL_CREATIONS_DISTINCT_COUNT_TRANSACTION_ID_ASC',
  PoolCreationsDistinctCountTransactionIdDesc = 'POOL_CREATIONS_DISTINCT_COUNT_TRANSACTION_ID_DESC',
  PoolCreationsDistinctCountTxCountAsc = 'POOL_CREATIONS_DISTINCT_COUNT_TX_COUNT_ASC',
  PoolCreationsDistinctCountTxCountDesc = 'POOL_CREATIONS_DISTINCT_COUNT_TX_COUNT_DESC',
  PoolCreationsDistinctCountUpdatedAtAsc = 'POOL_CREATIONS_DISTINCT_COUNT_UPDATED_AT_ASC',
  PoolCreationsDistinctCountUpdatedAtDesc = 'POOL_CREATIONS_DISTINCT_COUNT_UPDATED_AT_DESC',
  PoolCreationsDistinctCountVolumeTokenXAsc = 'POOL_CREATIONS_DISTINCT_COUNT_VOLUME_TOKEN_X_ASC',
  PoolCreationsDistinctCountVolumeTokenXDesc = 'POOL_CREATIONS_DISTINCT_COUNT_VOLUME_TOKEN_X_DESC',
  PoolCreationsDistinctCountVolumeTokenYAsc = 'POOL_CREATIONS_DISTINCT_COUNT_VOLUME_TOKEN_Y_ASC',
  PoolCreationsDistinctCountVolumeTokenYDesc = 'POOL_CREATIONS_DISTINCT_COUNT_VOLUME_TOKEN_Y_DESC',
  PoolCreationsDistinctCountVolumeUSDAsc = 'POOL_CREATIONS_DISTINCT_COUNT_VOLUME_U_S_D_ASC',
  PoolCreationsDistinctCountVolumeUSDDesc = 'POOL_CREATIONS_DISTINCT_COUNT_VOLUME_U_S_D_DESC',
  PoolCreationsMaxBlockRangeAsc = 'POOL_CREATIONS_MAX_BLOCK_RANGE_ASC',
  PoolCreationsMaxBlockRangeDesc = 'POOL_CREATIONS_MAX_BLOCK_RANGE_DESC',
  PoolCreationsMaxCollectedFeesTokenXAsc = 'POOL_CREATIONS_MAX_COLLECTED_FEES_TOKEN_X_ASC',
  PoolCreationsMaxCollectedFeesTokenXDesc = 'POOL_CREATIONS_MAX_COLLECTED_FEES_TOKEN_X_DESC',
  PoolCreationsMaxCollectedFeesTokenYAsc = 'POOL_CREATIONS_MAX_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolCreationsMaxCollectedFeesTokenYDesc = 'POOL_CREATIONS_MAX_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolCreationsMaxCollectedFeesUSDAsc = 'POOL_CREATIONS_MAX_COLLECTED_FEES_U_S_D_ASC',
  PoolCreationsMaxCollectedFeesUSDDesc = 'POOL_CREATIONS_MAX_COLLECTED_FEES_U_S_D_DESC',
  PoolCreationsMaxCreatedAtAsc = 'POOL_CREATIONS_MAX_CREATED_AT_ASC',
  PoolCreationsMaxCreatedAtBlockNumberAsc = 'POOL_CREATIONS_MAX_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolCreationsMaxCreatedAtBlockNumberDesc = 'POOL_CREATIONS_MAX_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolCreationsMaxCreatedAtDesc = 'POOL_CREATIONS_MAX_CREATED_AT_DESC',
  PoolCreationsMaxCurrentTickAsc = 'POOL_CREATIONS_MAX_CURRENT_TICK_ASC',
  PoolCreationsMaxCurrentTickDesc = 'POOL_CREATIONS_MAX_CURRENT_TICK_DESC',
  PoolCreationsMaxFeesUSDAsc = 'POOL_CREATIONS_MAX_FEES_U_S_D_ASC',
  PoolCreationsMaxFeesUSDDesc = 'POOL_CREATIONS_MAX_FEES_U_S_D_DESC',
  PoolCreationsMaxFeeAsc = 'POOL_CREATIONS_MAX_FEE_ASC',
  PoolCreationsMaxFeeDesc = 'POOL_CREATIONS_MAX_FEE_DESC',
  PoolCreationsMaxIdAsc = 'POOL_CREATIONS_MAX_ID_ASC',
  PoolCreationsMaxIdDesc = 'POOL_CREATIONS_MAX_ID_DESC',
  PoolCreationsMaxLiquidityAsc = 'POOL_CREATIONS_MAX_LIQUIDITY_ASC',
  PoolCreationsMaxLiquidityDesc = 'POOL_CREATIONS_MAX_LIQUIDITY_DESC',
  PoolCreationsMaxPoolCreatorIdAsc = 'POOL_CREATIONS_MAX_POOL_CREATOR_ID_ASC',
  PoolCreationsMaxPoolCreatorIdDesc = 'POOL_CREATIONS_MAX_POOL_CREATOR_ID_DESC',
  PoolCreationsMaxSqrtPriceAsc = 'POOL_CREATIONS_MAX_SQRT_PRICE_ASC',
  PoolCreationsMaxSqrtPriceDesc = 'POOL_CREATIONS_MAX_SQRT_PRICE_DESC',
  PoolCreationsMaxTickSpacingAsc = 'POOL_CREATIONS_MAX_TICK_SPACING_ASC',
  PoolCreationsMaxTickSpacingDesc = 'POOL_CREATIONS_MAX_TICK_SPACING_DESC',
  PoolCreationsMaxTokenXIdAsc = 'POOL_CREATIONS_MAX_TOKEN_X_ID_ASC',
  PoolCreationsMaxTokenXIdDesc = 'POOL_CREATIONS_MAX_TOKEN_X_ID_DESC',
  PoolCreationsMaxTokenYIdAsc = 'POOL_CREATIONS_MAX_TOKEN_Y_ID_ASC',
  PoolCreationsMaxTokenYIdDesc = 'POOL_CREATIONS_MAX_TOKEN_Y_ID_DESC',
  PoolCreationsMaxTotalValueLockedTokenXAsc = 'POOL_CREATIONS_MAX_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolCreationsMaxTotalValueLockedTokenXDesc = 'POOL_CREATIONS_MAX_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolCreationsMaxTotalValueLockedTokenYAsc = 'POOL_CREATIONS_MAX_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolCreationsMaxTotalValueLockedTokenYDesc = 'POOL_CREATIONS_MAX_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolCreationsMaxTotalValueLockedUSDAsc = 'POOL_CREATIONS_MAX_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolCreationsMaxTotalValueLockedUSDDesc = 'POOL_CREATIONS_MAX_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolCreationsMaxTransactionIdAsc = 'POOL_CREATIONS_MAX_TRANSACTION_ID_ASC',
  PoolCreationsMaxTransactionIdDesc = 'POOL_CREATIONS_MAX_TRANSACTION_ID_DESC',
  PoolCreationsMaxTxCountAsc = 'POOL_CREATIONS_MAX_TX_COUNT_ASC',
  PoolCreationsMaxTxCountDesc = 'POOL_CREATIONS_MAX_TX_COUNT_DESC',
  PoolCreationsMaxUpdatedAtAsc = 'POOL_CREATIONS_MAX_UPDATED_AT_ASC',
  PoolCreationsMaxUpdatedAtDesc = 'POOL_CREATIONS_MAX_UPDATED_AT_DESC',
  PoolCreationsMaxVolumeTokenXAsc = 'POOL_CREATIONS_MAX_VOLUME_TOKEN_X_ASC',
  PoolCreationsMaxVolumeTokenXDesc = 'POOL_CREATIONS_MAX_VOLUME_TOKEN_X_DESC',
  PoolCreationsMaxVolumeTokenYAsc = 'POOL_CREATIONS_MAX_VOLUME_TOKEN_Y_ASC',
  PoolCreationsMaxVolumeTokenYDesc = 'POOL_CREATIONS_MAX_VOLUME_TOKEN_Y_DESC',
  PoolCreationsMaxVolumeUSDAsc = 'POOL_CREATIONS_MAX_VOLUME_U_S_D_ASC',
  PoolCreationsMaxVolumeUSDDesc = 'POOL_CREATIONS_MAX_VOLUME_U_S_D_DESC',
  PoolCreationsMinBlockRangeAsc = 'POOL_CREATIONS_MIN_BLOCK_RANGE_ASC',
  PoolCreationsMinBlockRangeDesc = 'POOL_CREATIONS_MIN_BLOCK_RANGE_DESC',
  PoolCreationsMinCollectedFeesTokenXAsc = 'POOL_CREATIONS_MIN_COLLECTED_FEES_TOKEN_X_ASC',
  PoolCreationsMinCollectedFeesTokenXDesc = 'POOL_CREATIONS_MIN_COLLECTED_FEES_TOKEN_X_DESC',
  PoolCreationsMinCollectedFeesTokenYAsc = 'POOL_CREATIONS_MIN_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolCreationsMinCollectedFeesTokenYDesc = 'POOL_CREATIONS_MIN_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolCreationsMinCollectedFeesUSDAsc = 'POOL_CREATIONS_MIN_COLLECTED_FEES_U_S_D_ASC',
  PoolCreationsMinCollectedFeesUSDDesc = 'POOL_CREATIONS_MIN_COLLECTED_FEES_U_S_D_DESC',
  PoolCreationsMinCreatedAtAsc = 'POOL_CREATIONS_MIN_CREATED_AT_ASC',
  PoolCreationsMinCreatedAtBlockNumberAsc = 'POOL_CREATIONS_MIN_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolCreationsMinCreatedAtBlockNumberDesc = 'POOL_CREATIONS_MIN_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolCreationsMinCreatedAtDesc = 'POOL_CREATIONS_MIN_CREATED_AT_DESC',
  PoolCreationsMinCurrentTickAsc = 'POOL_CREATIONS_MIN_CURRENT_TICK_ASC',
  PoolCreationsMinCurrentTickDesc = 'POOL_CREATIONS_MIN_CURRENT_TICK_DESC',
  PoolCreationsMinFeesUSDAsc = 'POOL_CREATIONS_MIN_FEES_U_S_D_ASC',
  PoolCreationsMinFeesUSDDesc = 'POOL_CREATIONS_MIN_FEES_U_S_D_DESC',
  PoolCreationsMinFeeAsc = 'POOL_CREATIONS_MIN_FEE_ASC',
  PoolCreationsMinFeeDesc = 'POOL_CREATIONS_MIN_FEE_DESC',
  PoolCreationsMinIdAsc = 'POOL_CREATIONS_MIN_ID_ASC',
  PoolCreationsMinIdDesc = 'POOL_CREATIONS_MIN_ID_DESC',
  PoolCreationsMinLiquidityAsc = 'POOL_CREATIONS_MIN_LIQUIDITY_ASC',
  PoolCreationsMinLiquidityDesc = 'POOL_CREATIONS_MIN_LIQUIDITY_DESC',
  PoolCreationsMinPoolCreatorIdAsc = 'POOL_CREATIONS_MIN_POOL_CREATOR_ID_ASC',
  PoolCreationsMinPoolCreatorIdDesc = 'POOL_CREATIONS_MIN_POOL_CREATOR_ID_DESC',
  PoolCreationsMinSqrtPriceAsc = 'POOL_CREATIONS_MIN_SQRT_PRICE_ASC',
  PoolCreationsMinSqrtPriceDesc = 'POOL_CREATIONS_MIN_SQRT_PRICE_DESC',
  PoolCreationsMinTickSpacingAsc = 'POOL_CREATIONS_MIN_TICK_SPACING_ASC',
  PoolCreationsMinTickSpacingDesc = 'POOL_CREATIONS_MIN_TICK_SPACING_DESC',
  PoolCreationsMinTokenXIdAsc = 'POOL_CREATIONS_MIN_TOKEN_X_ID_ASC',
  PoolCreationsMinTokenXIdDesc = 'POOL_CREATIONS_MIN_TOKEN_X_ID_DESC',
  PoolCreationsMinTokenYIdAsc = 'POOL_CREATIONS_MIN_TOKEN_Y_ID_ASC',
  PoolCreationsMinTokenYIdDesc = 'POOL_CREATIONS_MIN_TOKEN_Y_ID_DESC',
  PoolCreationsMinTotalValueLockedTokenXAsc = 'POOL_CREATIONS_MIN_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolCreationsMinTotalValueLockedTokenXDesc = 'POOL_CREATIONS_MIN_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolCreationsMinTotalValueLockedTokenYAsc = 'POOL_CREATIONS_MIN_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolCreationsMinTotalValueLockedTokenYDesc = 'POOL_CREATIONS_MIN_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolCreationsMinTotalValueLockedUSDAsc = 'POOL_CREATIONS_MIN_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolCreationsMinTotalValueLockedUSDDesc = 'POOL_CREATIONS_MIN_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolCreationsMinTransactionIdAsc = 'POOL_CREATIONS_MIN_TRANSACTION_ID_ASC',
  PoolCreationsMinTransactionIdDesc = 'POOL_CREATIONS_MIN_TRANSACTION_ID_DESC',
  PoolCreationsMinTxCountAsc = 'POOL_CREATIONS_MIN_TX_COUNT_ASC',
  PoolCreationsMinTxCountDesc = 'POOL_CREATIONS_MIN_TX_COUNT_DESC',
  PoolCreationsMinUpdatedAtAsc = 'POOL_CREATIONS_MIN_UPDATED_AT_ASC',
  PoolCreationsMinUpdatedAtDesc = 'POOL_CREATIONS_MIN_UPDATED_AT_DESC',
  PoolCreationsMinVolumeTokenXAsc = 'POOL_CREATIONS_MIN_VOLUME_TOKEN_X_ASC',
  PoolCreationsMinVolumeTokenXDesc = 'POOL_CREATIONS_MIN_VOLUME_TOKEN_X_DESC',
  PoolCreationsMinVolumeTokenYAsc = 'POOL_CREATIONS_MIN_VOLUME_TOKEN_Y_ASC',
  PoolCreationsMinVolumeTokenYDesc = 'POOL_CREATIONS_MIN_VOLUME_TOKEN_Y_DESC',
  PoolCreationsMinVolumeUSDAsc = 'POOL_CREATIONS_MIN_VOLUME_U_S_D_ASC',
  PoolCreationsMinVolumeUSDDesc = 'POOL_CREATIONS_MIN_VOLUME_U_S_D_DESC',
  PoolCreationsStddevPopulationBlockRangeAsc = 'POOL_CREATIONS_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  PoolCreationsStddevPopulationBlockRangeDesc = 'POOL_CREATIONS_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  PoolCreationsStddevPopulationCollectedFeesTokenXAsc = 'POOL_CREATIONS_STDDEV_POPULATION_COLLECTED_FEES_TOKEN_X_ASC',
  PoolCreationsStddevPopulationCollectedFeesTokenXDesc = 'POOL_CREATIONS_STDDEV_POPULATION_COLLECTED_FEES_TOKEN_X_DESC',
  PoolCreationsStddevPopulationCollectedFeesTokenYAsc = 'POOL_CREATIONS_STDDEV_POPULATION_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolCreationsStddevPopulationCollectedFeesTokenYDesc = 'POOL_CREATIONS_STDDEV_POPULATION_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolCreationsStddevPopulationCollectedFeesUSDAsc = 'POOL_CREATIONS_STDDEV_POPULATION_COLLECTED_FEES_U_S_D_ASC',
  PoolCreationsStddevPopulationCollectedFeesUSDDesc = 'POOL_CREATIONS_STDDEV_POPULATION_COLLECTED_FEES_U_S_D_DESC',
  PoolCreationsStddevPopulationCreatedAtAsc = 'POOL_CREATIONS_STDDEV_POPULATION_CREATED_AT_ASC',
  PoolCreationsStddevPopulationCreatedAtBlockNumberAsc = 'POOL_CREATIONS_STDDEV_POPULATION_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolCreationsStddevPopulationCreatedAtBlockNumberDesc = 'POOL_CREATIONS_STDDEV_POPULATION_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolCreationsStddevPopulationCreatedAtDesc = 'POOL_CREATIONS_STDDEV_POPULATION_CREATED_AT_DESC',
  PoolCreationsStddevPopulationCurrentTickAsc = 'POOL_CREATIONS_STDDEV_POPULATION_CURRENT_TICK_ASC',
  PoolCreationsStddevPopulationCurrentTickDesc = 'POOL_CREATIONS_STDDEV_POPULATION_CURRENT_TICK_DESC',
  PoolCreationsStddevPopulationFeesUSDAsc = 'POOL_CREATIONS_STDDEV_POPULATION_FEES_U_S_D_ASC',
  PoolCreationsStddevPopulationFeesUSDDesc = 'POOL_CREATIONS_STDDEV_POPULATION_FEES_U_S_D_DESC',
  PoolCreationsStddevPopulationFeeAsc = 'POOL_CREATIONS_STDDEV_POPULATION_FEE_ASC',
  PoolCreationsStddevPopulationFeeDesc = 'POOL_CREATIONS_STDDEV_POPULATION_FEE_DESC',
  PoolCreationsStddevPopulationIdAsc = 'POOL_CREATIONS_STDDEV_POPULATION_ID_ASC',
  PoolCreationsStddevPopulationIdDesc = 'POOL_CREATIONS_STDDEV_POPULATION_ID_DESC',
  PoolCreationsStddevPopulationLiquidityAsc = 'POOL_CREATIONS_STDDEV_POPULATION_LIQUIDITY_ASC',
  PoolCreationsStddevPopulationLiquidityDesc = 'POOL_CREATIONS_STDDEV_POPULATION_LIQUIDITY_DESC',
  PoolCreationsStddevPopulationPoolCreatorIdAsc = 'POOL_CREATIONS_STDDEV_POPULATION_POOL_CREATOR_ID_ASC',
  PoolCreationsStddevPopulationPoolCreatorIdDesc = 'POOL_CREATIONS_STDDEV_POPULATION_POOL_CREATOR_ID_DESC',
  PoolCreationsStddevPopulationSqrtPriceAsc = 'POOL_CREATIONS_STDDEV_POPULATION_SQRT_PRICE_ASC',
  PoolCreationsStddevPopulationSqrtPriceDesc = 'POOL_CREATIONS_STDDEV_POPULATION_SQRT_PRICE_DESC',
  PoolCreationsStddevPopulationTickSpacingAsc = 'POOL_CREATIONS_STDDEV_POPULATION_TICK_SPACING_ASC',
  PoolCreationsStddevPopulationTickSpacingDesc = 'POOL_CREATIONS_STDDEV_POPULATION_TICK_SPACING_DESC',
  PoolCreationsStddevPopulationTokenXIdAsc = 'POOL_CREATIONS_STDDEV_POPULATION_TOKEN_X_ID_ASC',
  PoolCreationsStddevPopulationTokenXIdDesc = 'POOL_CREATIONS_STDDEV_POPULATION_TOKEN_X_ID_DESC',
  PoolCreationsStddevPopulationTokenYIdAsc = 'POOL_CREATIONS_STDDEV_POPULATION_TOKEN_Y_ID_ASC',
  PoolCreationsStddevPopulationTokenYIdDesc = 'POOL_CREATIONS_STDDEV_POPULATION_TOKEN_Y_ID_DESC',
  PoolCreationsStddevPopulationTotalValueLockedTokenXAsc = 'POOL_CREATIONS_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolCreationsStddevPopulationTotalValueLockedTokenXDesc = 'POOL_CREATIONS_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolCreationsStddevPopulationTotalValueLockedTokenYAsc = 'POOL_CREATIONS_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolCreationsStddevPopulationTotalValueLockedTokenYDesc = 'POOL_CREATIONS_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolCreationsStddevPopulationTotalValueLockedUSDAsc = 'POOL_CREATIONS_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolCreationsStddevPopulationTotalValueLockedUSDDesc = 'POOL_CREATIONS_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolCreationsStddevPopulationTransactionIdAsc = 'POOL_CREATIONS_STDDEV_POPULATION_TRANSACTION_ID_ASC',
  PoolCreationsStddevPopulationTransactionIdDesc = 'POOL_CREATIONS_STDDEV_POPULATION_TRANSACTION_ID_DESC',
  PoolCreationsStddevPopulationTxCountAsc = 'POOL_CREATIONS_STDDEV_POPULATION_TX_COUNT_ASC',
  PoolCreationsStddevPopulationTxCountDesc = 'POOL_CREATIONS_STDDEV_POPULATION_TX_COUNT_DESC',
  PoolCreationsStddevPopulationUpdatedAtAsc = 'POOL_CREATIONS_STDDEV_POPULATION_UPDATED_AT_ASC',
  PoolCreationsStddevPopulationUpdatedAtDesc = 'POOL_CREATIONS_STDDEV_POPULATION_UPDATED_AT_DESC',
  PoolCreationsStddevPopulationVolumeTokenXAsc = 'POOL_CREATIONS_STDDEV_POPULATION_VOLUME_TOKEN_X_ASC',
  PoolCreationsStddevPopulationVolumeTokenXDesc = 'POOL_CREATIONS_STDDEV_POPULATION_VOLUME_TOKEN_X_DESC',
  PoolCreationsStddevPopulationVolumeTokenYAsc = 'POOL_CREATIONS_STDDEV_POPULATION_VOLUME_TOKEN_Y_ASC',
  PoolCreationsStddevPopulationVolumeTokenYDesc = 'POOL_CREATIONS_STDDEV_POPULATION_VOLUME_TOKEN_Y_DESC',
  PoolCreationsStddevPopulationVolumeUSDAsc = 'POOL_CREATIONS_STDDEV_POPULATION_VOLUME_U_S_D_ASC',
  PoolCreationsStddevPopulationVolumeUSDDesc = 'POOL_CREATIONS_STDDEV_POPULATION_VOLUME_U_S_D_DESC',
  PoolCreationsStddevSampleBlockRangeAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  PoolCreationsStddevSampleBlockRangeDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  PoolCreationsStddevSampleCollectedFeesTokenXAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_COLLECTED_FEES_TOKEN_X_ASC',
  PoolCreationsStddevSampleCollectedFeesTokenXDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_COLLECTED_FEES_TOKEN_X_DESC',
  PoolCreationsStddevSampleCollectedFeesTokenYAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolCreationsStddevSampleCollectedFeesTokenYDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolCreationsStddevSampleCollectedFeesUSDAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_COLLECTED_FEES_U_S_D_ASC',
  PoolCreationsStddevSampleCollectedFeesUSDDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_COLLECTED_FEES_U_S_D_DESC',
  PoolCreationsStddevSampleCreatedAtAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_CREATED_AT_ASC',
  PoolCreationsStddevSampleCreatedAtBlockNumberAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolCreationsStddevSampleCreatedAtBlockNumberDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolCreationsStddevSampleCreatedAtDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_CREATED_AT_DESC',
  PoolCreationsStddevSampleCurrentTickAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_CURRENT_TICK_ASC',
  PoolCreationsStddevSampleCurrentTickDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_CURRENT_TICK_DESC',
  PoolCreationsStddevSampleFeesUSDAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_FEES_U_S_D_ASC',
  PoolCreationsStddevSampleFeesUSDDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_FEES_U_S_D_DESC',
  PoolCreationsStddevSampleFeeAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_FEE_ASC',
  PoolCreationsStddevSampleFeeDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_FEE_DESC',
  PoolCreationsStddevSampleIdAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_ID_ASC',
  PoolCreationsStddevSampleIdDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_ID_DESC',
  PoolCreationsStddevSampleLiquidityAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_LIQUIDITY_ASC',
  PoolCreationsStddevSampleLiquidityDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_LIQUIDITY_DESC',
  PoolCreationsStddevSamplePoolCreatorIdAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_POOL_CREATOR_ID_ASC',
  PoolCreationsStddevSamplePoolCreatorIdDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_POOL_CREATOR_ID_DESC',
  PoolCreationsStddevSampleSqrtPriceAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_SQRT_PRICE_ASC',
  PoolCreationsStddevSampleSqrtPriceDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_SQRT_PRICE_DESC',
  PoolCreationsStddevSampleTickSpacingAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_TICK_SPACING_ASC',
  PoolCreationsStddevSampleTickSpacingDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_TICK_SPACING_DESC',
  PoolCreationsStddevSampleTokenXIdAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_TOKEN_X_ID_ASC',
  PoolCreationsStddevSampleTokenXIdDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_TOKEN_X_ID_DESC',
  PoolCreationsStddevSampleTokenYIdAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_TOKEN_Y_ID_ASC',
  PoolCreationsStddevSampleTokenYIdDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_TOKEN_Y_ID_DESC',
  PoolCreationsStddevSampleTotalValueLockedTokenXAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolCreationsStddevSampleTotalValueLockedTokenXDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolCreationsStddevSampleTotalValueLockedTokenYAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolCreationsStddevSampleTotalValueLockedTokenYDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolCreationsStddevSampleTotalValueLockedUSDAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolCreationsStddevSampleTotalValueLockedUSDDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolCreationsStddevSampleTransactionIdAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_TRANSACTION_ID_ASC',
  PoolCreationsStddevSampleTransactionIdDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_TRANSACTION_ID_DESC',
  PoolCreationsStddevSampleTxCountAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_TX_COUNT_ASC',
  PoolCreationsStddevSampleTxCountDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_TX_COUNT_DESC',
  PoolCreationsStddevSampleUpdatedAtAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_UPDATED_AT_ASC',
  PoolCreationsStddevSampleUpdatedAtDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_UPDATED_AT_DESC',
  PoolCreationsStddevSampleVolumeTokenXAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_VOLUME_TOKEN_X_ASC',
  PoolCreationsStddevSampleVolumeTokenXDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_VOLUME_TOKEN_X_DESC',
  PoolCreationsStddevSampleVolumeTokenYAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_VOLUME_TOKEN_Y_ASC',
  PoolCreationsStddevSampleVolumeTokenYDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_VOLUME_TOKEN_Y_DESC',
  PoolCreationsStddevSampleVolumeUSDAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_VOLUME_U_S_D_ASC',
  PoolCreationsStddevSampleVolumeUSDDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_VOLUME_U_S_D_DESC',
  PoolCreationsSumBlockRangeAsc = 'POOL_CREATIONS_SUM_BLOCK_RANGE_ASC',
  PoolCreationsSumBlockRangeDesc = 'POOL_CREATIONS_SUM_BLOCK_RANGE_DESC',
  PoolCreationsSumCollectedFeesTokenXAsc = 'POOL_CREATIONS_SUM_COLLECTED_FEES_TOKEN_X_ASC',
  PoolCreationsSumCollectedFeesTokenXDesc = 'POOL_CREATIONS_SUM_COLLECTED_FEES_TOKEN_X_DESC',
  PoolCreationsSumCollectedFeesTokenYAsc = 'POOL_CREATIONS_SUM_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolCreationsSumCollectedFeesTokenYDesc = 'POOL_CREATIONS_SUM_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolCreationsSumCollectedFeesUSDAsc = 'POOL_CREATIONS_SUM_COLLECTED_FEES_U_S_D_ASC',
  PoolCreationsSumCollectedFeesUSDDesc = 'POOL_CREATIONS_SUM_COLLECTED_FEES_U_S_D_DESC',
  PoolCreationsSumCreatedAtAsc = 'POOL_CREATIONS_SUM_CREATED_AT_ASC',
  PoolCreationsSumCreatedAtBlockNumberAsc = 'POOL_CREATIONS_SUM_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolCreationsSumCreatedAtBlockNumberDesc = 'POOL_CREATIONS_SUM_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolCreationsSumCreatedAtDesc = 'POOL_CREATIONS_SUM_CREATED_AT_DESC',
  PoolCreationsSumCurrentTickAsc = 'POOL_CREATIONS_SUM_CURRENT_TICK_ASC',
  PoolCreationsSumCurrentTickDesc = 'POOL_CREATIONS_SUM_CURRENT_TICK_DESC',
  PoolCreationsSumFeesUSDAsc = 'POOL_CREATIONS_SUM_FEES_U_S_D_ASC',
  PoolCreationsSumFeesUSDDesc = 'POOL_CREATIONS_SUM_FEES_U_S_D_DESC',
  PoolCreationsSumFeeAsc = 'POOL_CREATIONS_SUM_FEE_ASC',
  PoolCreationsSumFeeDesc = 'POOL_CREATIONS_SUM_FEE_DESC',
  PoolCreationsSumIdAsc = 'POOL_CREATIONS_SUM_ID_ASC',
  PoolCreationsSumIdDesc = 'POOL_CREATIONS_SUM_ID_DESC',
  PoolCreationsSumLiquidityAsc = 'POOL_CREATIONS_SUM_LIQUIDITY_ASC',
  PoolCreationsSumLiquidityDesc = 'POOL_CREATIONS_SUM_LIQUIDITY_DESC',
  PoolCreationsSumPoolCreatorIdAsc = 'POOL_CREATIONS_SUM_POOL_CREATOR_ID_ASC',
  PoolCreationsSumPoolCreatorIdDesc = 'POOL_CREATIONS_SUM_POOL_CREATOR_ID_DESC',
  PoolCreationsSumSqrtPriceAsc = 'POOL_CREATIONS_SUM_SQRT_PRICE_ASC',
  PoolCreationsSumSqrtPriceDesc = 'POOL_CREATIONS_SUM_SQRT_PRICE_DESC',
  PoolCreationsSumTickSpacingAsc = 'POOL_CREATIONS_SUM_TICK_SPACING_ASC',
  PoolCreationsSumTickSpacingDesc = 'POOL_CREATIONS_SUM_TICK_SPACING_DESC',
  PoolCreationsSumTokenXIdAsc = 'POOL_CREATIONS_SUM_TOKEN_X_ID_ASC',
  PoolCreationsSumTokenXIdDesc = 'POOL_CREATIONS_SUM_TOKEN_X_ID_DESC',
  PoolCreationsSumTokenYIdAsc = 'POOL_CREATIONS_SUM_TOKEN_Y_ID_ASC',
  PoolCreationsSumTokenYIdDesc = 'POOL_CREATIONS_SUM_TOKEN_Y_ID_DESC',
  PoolCreationsSumTotalValueLockedTokenXAsc = 'POOL_CREATIONS_SUM_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolCreationsSumTotalValueLockedTokenXDesc = 'POOL_CREATIONS_SUM_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolCreationsSumTotalValueLockedTokenYAsc = 'POOL_CREATIONS_SUM_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolCreationsSumTotalValueLockedTokenYDesc = 'POOL_CREATIONS_SUM_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolCreationsSumTotalValueLockedUSDAsc = 'POOL_CREATIONS_SUM_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolCreationsSumTotalValueLockedUSDDesc = 'POOL_CREATIONS_SUM_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolCreationsSumTransactionIdAsc = 'POOL_CREATIONS_SUM_TRANSACTION_ID_ASC',
  PoolCreationsSumTransactionIdDesc = 'POOL_CREATIONS_SUM_TRANSACTION_ID_DESC',
  PoolCreationsSumTxCountAsc = 'POOL_CREATIONS_SUM_TX_COUNT_ASC',
  PoolCreationsSumTxCountDesc = 'POOL_CREATIONS_SUM_TX_COUNT_DESC',
  PoolCreationsSumUpdatedAtAsc = 'POOL_CREATIONS_SUM_UPDATED_AT_ASC',
  PoolCreationsSumUpdatedAtDesc = 'POOL_CREATIONS_SUM_UPDATED_AT_DESC',
  PoolCreationsSumVolumeTokenXAsc = 'POOL_CREATIONS_SUM_VOLUME_TOKEN_X_ASC',
  PoolCreationsSumVolumeTokenXDesc = 'POOL_CREATIONS_SUM_VOLUME_TOKEN_X_DESC',
  PoolCreationsSumVolumeTokenYAsc = 'POOL_CREATIONS_SUM_VOLUME_TOKEN_Y_ASC',
  PoolCreationsSumVolumeTokenYDesc = 'POOL_CREATIONS_SUM_VOLUME_TOKEN_Y_DESC',
  PoolCreationsSumVolumeUSDAsc = 'POOL_CREATIONS_SUM_VOLUME_U_S_D_ASC',
  PoolCreationsSumVolumeUSDDesc = 'POOL_CREATIONS_SUM_VOLUME_U_S_D_DESC',
  PoolCreationsVariancePopulationBlockRangeAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  PoolCreationsVariancePopulationBlockRangeDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  PoolCreationsVariancePopulationCollectedFeesTokenXAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_COLLECTED_FEES_TOKEN_X_ASC',
  PoolCreationsVariancePopulationCollectedFeesTokenXDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_COLLECTED_FEES_TOKEN_X_DESC',
  PoolCreationsVariancePopulationCollectedFeesTokenYAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolCreationsVariancePopulationCollectedFeesTokenYDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolCreationsVariancePopulationCollectedFeesUSDAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_COLLECTED_FEES_U_S_D_ASC',
  PoolCreationsVariancePopulationCollectedFeesUSDDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_COLLECTED_FEES_U_S_D_DESC',
  PoolCreationsVariancePopulationCreatedAtAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_CREATED_AT_ASC',
  PoolCreationsVariancePopulationCreatedAtBlockNumberAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolCreationsVariancePopulationCreatedAtBlockNumberDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolCreationsVariancePopulationCreatedAtDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_CREATED_AT_DESC',
  PoolCreationsVariancePopulationCurrentTickAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_CURRENT_TICK_ASC',
  PoolCreationsVariancePopulationCurrentTickDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_CURRENT_TICK_DESC',
  PoolCreationsVariancePopulationFeesUSDAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_FEES_U_S_D_ASC',
  PoolCreationsVariancePopulationFeesUSDDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_FEES_U_S_D_DESC',
  PoolCreationsVariancePopulationFeeAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_FEE_ASC',
  PoolCreationsVariancePopulationFeeDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_FEE_DESC',
  PoolCreationsVariancePopulationIdAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_ID_ASC',
  PoolCreationsVariancePopulationIdDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_ID_DESC',
  PoolCreationsVariancePopulationLiquidityAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_LIQUIDITY_ASC',
  PoolCreationsVariancePopulationLiquidityDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_LIQUIDITY_DESC',
  PoolCreationsVariancePopulationPoolCreatorIdAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_POOL_CREATOR_ID_ASC',
  PoolCreationsVariancePopulationPoolCreatorIdDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_POOL_CREATOR_ID_DESC',
  PoolCreationsVariancePopulationSqrtPriceAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_SQRT_PRICE_ASC',
  PoolCreationsVariancePopulationSqrtPriceDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_SQRT_PRICE_DESC',
  PoolCreationsVariancePopulationTickSpacingAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_TICK_SPACING_ASC',
  PoolCreationsVariancePopulationTickSpacingDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_TICK_SPACING_DESC',
  PoolCreationsVariancePopulationTokenXIdAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_TOKEN_X_ID_ASC',
  PoolCreationsVariancePopulationTokenXIdDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_TOKEN_X_ID_DESC',
  PoolCreationsVariancePopulationTokenYIdAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_TOKEN_Y_ID_ASC',
  PoolCreationsVariancePopulationTokenYIdDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_TOKEN_Y_ID_DESC',
  PoolCreationsVariancePopulationTotalValueLockedTokenXAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolCreationsVariancePopulationTotalValueLockedTokenXDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolCreationsVariancePopulationTotalValueLockedTokenYAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolCreationsVariancePopulationTotalValueLockedTokenYDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolCreationsVariancePopulationTotalValueLockedUSDAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolCreationsVariancePopulationTotalValueLockedUSDDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolCreationsVariancePopulationTransactionIdAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_TRANSACTION_ID_ASC',
  PoolCreationsVariancePopulationTransactionIdDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_TRANSACTION_ID_DESC',
  PoolCreationsVariancePopulationTxCountAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_TX_COUNT_ASC',
  PoolCreationsVariancePopulationTxCountDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_TX_COUNT_DESC',
  PoolCreationsVariancePopulationUpdatedAtAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_UPDATED_AT_ASC',
  PoolCreationsVariancePopulationUpdatedAtDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_UPDATED_AT_DESC',
  PoolCreationsVariancePopulationVolumeTokenXAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_VOLUME_TOKEN_X_ASC',
  PoolCreationsVariancePopulationVolumeTokenXDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_VOLUME_TOKEN_X_DESC',
  PoolCreationsVariancePopulationVolumeTokenYAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_VOLUME_TOKEN_Y_ASC',
  PoolCreationsVariancePopulationVolumeTokenYDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_VOLUME_TOKEN_Y_DESC',
  PoolCreationsVariancePopulationVolumeUSDAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_VOLUME_U_S_D_ASC',
  PoolCreationsVariancePopulationVolumeUSDDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_VOLUME_U_S_D_DESC',
  PoolCreationsVarianceSampleBlockRangeAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  PoolCreationsVarianceSampleBlockRangeDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  PoolCreationsVarianceSampleCollectedFeesTokenXAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_COLLECTED_FEES_TOKEN_X_ASC',
  PoolCreationsVarianceSampleCollectedFeesTokenXDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_COLLECTED_FEES_TOKEN_X_DESC',
  PoolCreationsVarianceSampleCollectedFeesTokenYAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolCreationsVarianceSampleCollectedFeesTokenYDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolCreationsVarianceSampleCollectedFeesUSDAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_COLLECTED_FEES_U_S_D_ASC',
  PoolCreationsVarianceSampleCollectedFeesUSDDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_COLLECTED_FEES_U_S_D_DESC',
  PoolCreationsVarianceSampleCreatedAtAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_CREATED_AT_ASC',
  PoolCreationsVarianceSampleCreatedAtBlockNumberAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolCreationsVarianceSampleCreatedAtBlockNumberDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolCreationsVarianceSampleCreatedAtDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_CREATED_AT_DESC',
  PoolCreationsVarianceSampleCurrentTickAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_CURRENT_TICK_ASC',
  PoolCreationsVarianceSampleCurrentTickDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_CURRENT_TICK_DESC',
  PoolCreationsVarianceSampleFeesUSDAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_FEES_U_S_D_ASC',
  PoolCreationsVarianceSampleFeesUSDDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_FEES_U_S_D_DESC',
  PoolCreationsVarianceSampleFeeAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_FEE_ASC',
  PoolCreationsVarianceSampleFeeDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_FEE_DESC',
  PoolCreationsVarianceSampleIdAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_ID_ASC',
  PoolCreationsVarianceSampleIdDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_ID_DESC',
  PoolCreationsVarianceSampleLiquidityAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_LIQUIDITY_ASC',
  PoolCreationsVarianceSampleLiquidityDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_LIQUIDITY_DESC',
  PoolCreationsVarianceSamplePoolCreatorIdAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_POOL_CREATOR_ID_ASC',
  PoolCreationsVarianceSamplePoolCreatorIdDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_POOL_CREATOR_ID_DESC',
  PoolCreationsVarianceSampleSqrtPriceAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_SQRT_PRICE_ASC',
  PoolCreationsVarianceSampleSqrtPriceDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_SQRT_PRICE_DESC',
  PoolCreationsVarianceSampleTickSpacingAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TICK_SPACING_ASC',
  PoolCreationsVarianceSampleTickSpacingDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TICK_SPACING_DESC',
  PoolCreationsVarianceSampleTokenXIdAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TOKEN_X_ID_ASC',
  PoolCreationsVarianceSampleTokenXIdDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TOKEN_X_ID_DESC',
  PoolCreationsVarianceSampleTokenYIdAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TOKEN_Y_ID_ASC',
  PoolCreationsVarianceSampleTokenYIdDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TOKEN_Y_ID_DESC',
  PoolCreationsVarianceSampleTotalValueLockedTokenXAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolCreationsVarianceSampleTotalValueLockedTokenXDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolCreationsVarianceSampleTotalValueLockedTokenYAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolCreationsVarianceSampleTotalValueLockedTokenYDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolCreationsVarianceSampleTotalValueLockedUSDAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolCreationsVarianceSampleTotalValueLockedUSDDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolCreationsVarianceSampleTransactionIdAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TRANSACTION_ID_ASC',
  PoolCreationsVarianceSampleTransactionIdDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TRANSACTION_ID_DESC',
  PoolCreationsVarianceSampleTxCountAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TX_COUNT_ASC',
  PoolCreationsVarianceSampleTxCountDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TX_COUNT_DESC',
  PoolCreationsVarianceSampleUpdatedAtAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_UPDATED_AT_ASC',
  PoolCreationsVarianceSampleUpdatedAtDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_UPDATED_AT_DESC',
  PoolCreationsVarianceSampleVolumeTokenXAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_VOLUME_TOKEN_X_ASC',
  PoolCreationsVarianceSampleVolumeTokenXDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_VOLUME_TOKEN_X_DESC',
  PoolCreationsVarianceSampleVolumeTokenYAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_VOLUME_TOKEN_Y_ASC',
  PoolCreationsVarianceSampleVolumeTokenYDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_VOLUME_TOKEN_Y_DESC',
  PoolCreationsVarianceSampleVolumeUSDAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_VOLUME_U_S_D_ASC',
  PoolCreationsVarianceSampleVolumeUSDDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_VOLUME_U_S_D_DESC',
  PositionsAverageBlockRangeAsc = 'POSITIONS_AVERAGE_BLOCK_RANGE_ASC',
  PositionsAverageBlockRangeDesc = 'POSITIONS_AVERAGE_BLOCK_RANGE_DESC',
  PositionsAverageClosedAtAsc = 'POSITIONS_AVERAGE_CLOSED_AT_ASC',
  PositionsAverageClosedAtDesc = 'POSITIONS_AVERAGE_CLOSED_AT_DESC',
  PositionsAverageCreatedAtAsc = 'POSITIONS_AVERAGE_CREATED_AT_ASC',
  PositionsAverageCreatedAtDesc = 'POSITIONS_AVERAGE_CREATED_AT_DESC',
  PositionsAverageIdAsc = 'POSITIONS_AVERAGE_ID_ASC',
  PositionsAverageIdDesc = 'POSITIONS_AVERAGE_ID_DESC',
  PositionsAverageLiquidityAsc = 'POSITIONS_AVERAGE_LIQUIDITY_ASC',
  PositionsAverageLiquidityDesc = 'POSITIONS_AVERAGE_LIQUIDITY_DESC',
  PositionsAverageOwnerIdAsc = 'POSITIONS_AVERAGE_OWNER_ID_ASC',
  PositionsAverageOwnerIdDesc = 'POSITIONS_AVERAGE_OWNER_ID_DESC',
  PositionsAveragePoolIdAsc = 'POSITIONS_AVERAGE_POOL_ID_ASC',
  PositionsAveragePoolIdDesc = 'POSITIONS_AVERAGE_POOL_ID_DESC',
  PositionsAveragePrincipalAmountXAsc = 'POSITIONS_AVERAGE_PRINCIPAL_AMOUNT_X_ASC',
  PositionsAveragePrincipalAmountXDesc = 'POSITIONS_AVERAGE_PRINCIPAL_AMOUNT_X_DESC',
  PositionsAveragePrincipalAmountYAsc = 'POSITIONS_AVERAGE_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsAveragePrincipalAmountYDesc = 'POSITIONS_AVERAGE_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsAverageStatusAsc = 'POSITIONS_AVERAGE_STATUS_ASC',
  PositionsAverageStatusDesc = 'POSITIONS_AVERAGE_STATUS_DESC',
  PositionsAverageTickLowerAsc = 'POSITIONS_AVERAGE_TICK_LOWER_ASC',
  PositionsAverageTickLowerDesc = 'POSITIONS_AVERAGE_TICK_LOWER_DESC',
  PositionsAverageTickUpperAsc = 'POSITIONS_AVERAGE_TICK_UPPER_ASC',
  PositionsAverageTickUpperDesc = 'POSITIONS_AVERAGE_TICK_UPPER_DESC',
  PositionsAverageTokenIdAsc = 'POSITIONS_AVERAGE_TOKEN_ID_ASC',
  PositionsAverageTokenIdDesc = 'POSITIONS_AVERAGE_TOKEN_ID_DESC',
  PositionsAverageTransactionIdAsc = 'POSITIONS_AVERAGE_TRANSACTION_ID_ASC',
  PositionsAverageTransactionIdDesc = 'POSITIONS_AVERAGE_TRANSACTION_ID_DESC',
  PositionsCountAsc = 'POSITIONS_COUNT_ASC',
  PositionsCountDesc = 'POSITIONS_COUNT_DESC',
  PositionsDistinctCountBlockRangeAsc = 'POSITIONS_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  PositionsDistinctCountBlockRangeDesc = 'POSITIONS_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  PositionsDistinctCountClosedAtAsc = 'POSITIONS_DISTINCT_COUNT_CLOSED_AT_ASC',
  PositionsDistinctCountClosedAtDesc = 'POSITIONS_DISTINCT_COUNT_CLOSED_AT_DESC',
  PositionsDistinctCountCreatedAtAsc = 'POSITIONS_DISTINCT_COUNT_CREATED_AT_ASC',
  PositionsDistinctCountCreatedAtDesc = 'POSITIONS_DISTINCT_COUNT_CREATED_AT_DESC',
  PositionsDistinctCountIdAsc = 'POSITIONS_DISTINCT_COUNT_ID_ASC',
  PositionsDistinctCountIdDesc = 'POSITIONS_DISTINCT_COUNT_ID_DESC',
  PositionsDistinctCountLiquidityAsc = 'POSITIONS_DISTINCT_COUNT_LIQUIDITY_ASC',
  PositionsDistinctCountLiquidityDesc = 'POSITIONS_DISTINCT_COUNT_LIQUIDITY_DESC',
  PositionsDistinctCountOwnerIdAsc = 'POSITIONS_DISTINCT_COUNT_OWNER_ID_ASC',
  PositionsDistinctCountOwnerIdDesc = 'POSITIONS_DISTINCT_COUNT_OWNER_ID_DESC',
  PositionsDistinctCountPoolIdAsc = 'POSITIONS_DISTINCT_COUNT_POOL_ID_ASC',
  PositionsDistinctCountPoolIdDesc = 'POSITIONS_DISTINCT_COUNT_POOL_ID_DESC',
  PositionsDistinctCountPrincipalAmountXAsc = 'POSITIONS_DISTINCT_COUNT_PRINCIPAL_AMOUNT_X_ASC',
  PositionsDistinctCountPrincipalAmountXDesc = 'POSITIONS_DISTINCT_COUNT_PRINCIPAL_AMOUNT_X_DESC',
  PositionsDistinctCountPrincipalAmountYAsc = 'POSITIONS_DISTINCT_COUNT_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsDistinctCountPrincipalAmountYDesc = 'POSITIONS_DISTINCT_COUNT_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsDistinctCountStatusAsc = 'POSITIONS_DISTINCT_COUNT_STATUS_ASC',
  PositionsDistinctCountStatusDesc = 'POSITIONS_DISTINCT_COUNT_STATUS_DESC',
  PositionsDistinctCountTickLowerAsc = 'POSITIONS_DISTINCT_COUNT_TICK_LOWER_ASC',
  PositionsDistinctCountTickLowerDesc = 'POSITIONS_DISTINCT_COUNT_TICK_LOWER_DESC',
  PositionsDistinctCountTickUpperAsc = 'POSITIONS_DISTINCT_COUNT_TICK_UPPER_ASC',
  PositionsDistinctCountTickUpperDesc = 'POSITIONS_DISTINCT_COUNT_TICK_UPPER_DESC',
  PositionsDistinctCountTokenIdAsc = 'POSITIONS_DISTINCT_COUNT_TOKEN_ID_ASC',
  PositionsDistinctCountTokenIdDesc = 'POSITIONS_DISTINCT_COUNT_TOKEN_ID_DESC',
  PositionsDistinctCountTransactionIdAsc = 'POSITIONS_DISTINCT_COUNT_TRANSACTION_ID_ASC',
  PositionsDistinctCountTransactionIdDesc = 'POSITIONS_DISTINCT_COUNT_TRANSACTION_ID_DESC',
  PositionsMaxBlockRangeAsc = 'POSITIONS_MAX_BLOCK_RANGE_ASC',
  PositionsMaxBlockRangeDesc = 'POSITIONS_MAX_BLOCK_RANGE_DESC',
  PositionsMaxClosedAtAsc = 'POSITIONS_MAX_CLOSED_AT_ASC',
  PositionsMaxClosedAtDesc = 'POSITIONS_MAX_CLOSED_AT_DESC',
  PositionsMaxCreatedAtAsc = 'POSITIONS_MAX_CREATED_AT_ASC',
  PositionsMaxCreatedAtDesc = 'POSITIONS_MAX_CREATED_AT_DESC',
  PositionsMaxIdAsc = 'POSITIONS_MAX_ID_ASC',
  PositionsMaxIdDesc = 'POSITIONS_MAX_ID_DESC',
  PositionsMaxLiquidityAsc = 'POSITIONS_MAX_LIQUIDITY_ASC',
  PositionsMaxLiquidityDesc = 'POSITIONS_MAX_LIQUIDITY_DESC',
  PositionsMaxOwnerIdAsc = 'POSITIONS_MAX_OWNER_ID_ASC',
  PositionsMaxOwnerIdDesc = 'POSITIONS_MAX_OWNER_ID_DESC',
  PositionsMaxPoolIdAsc = 'POSITIONS_MAX_POOL_ID_ASC',
  PositionsMaxPoolIdDesc = 'POSITIONS_MAX_POOL_ID_DESC',
  PositionsMaxPrincipalAmountXAsc = 'POSITIONS_MAX_PRINCIPAL_AMOUNT_X_ASC',
  PositionsMaxPrincipalAmountXDesc = 'POSITIONS_MAX_PRINCIPAL_AMOUNT_X_DESC',
  PositionsMaxPrincipalAmountYAsc = 'POSITIONS_MAX_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsMaxPrincipalAmountYDesc = 'POSITIONS_MAX_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsMaxStatusAsc = 'POSITIONS_MAX_STATUS_ASC',
  PositionsMaxStatusDesc = 'POSITIONS_MAX_STATUS_DESC',
  PositionsMaxTickLowerAsc = 'POSITIONS_MAX_TICK_LOWER_ASC',
  PositionsMaxTickLowerDesc = 'POSITIONS_MAX_TICK_LOWER_DESC',
  PositionsMaxTickUpperAsc = 'POSITIONS_MAX_TICK_UPPER_ASC',
  PositionsMaxTickUpperDesc = 'POSITIONS_MAX_TICK_UPPER_DESC',
  PositionsMaxTokenIdAsc = 'POSITIONS_MAX_TOKEN_ID_ASC',
  PositionsMaxTokenIdDesc = 'POSITIONS_MAX_TOKEN_ID_DESC',
  PositionsMaxTransactionIdAsc = 'POSITIONS_MAX_TRANSACTION_ID_ASC',
  PositionsMaxTransactionIdDesc = 'POSITIONS_MAX_TRANSACTION_ID_DESC',
  PositionsMinBlockRangeAsc = 'POSITIONS_MIN_BLOCK_RANGE_ASC',
  PositionsMinBlockRangeDesc = 'POSITIONS_MIN_BLOCK_RANGE_DESC',
  PositionsMinClosedAtAsc = 'POSITIONS_MIN_CLOSED_AT_ASC',
  PositionsMinClosedAtDesc = 'POSITIONS_MIN_CLOSED_AT_DESC',
  PositionsMinCreatedAtAsc = 'POSITIONS_MIN_CREATED_AT_ASC',
  PositionsMinCreatedAtDesc = 'POSITIONS_MIN_CREATED_AT_DESC',
  PositionsMinIdAsc = 'POSITIONS_MIN_ID_ASC',
  PositionsMinIdDesc = 'POSITIONS_MIN_ID_DESC',
  PositionsMinLiquidityAsc = 'POSITIONS_MIN_LIQUIDITY_ASC',
  PositionsMinLiquidityDesc = 'POSITIONS_MIN_LIQUIDITY_DESC',
  PositionsMinOwnerIdAsc = 'POSITIONS_MIN_OWNER_ID_ASC',
  PositionsMinOwnerIdDesc = 'POSITIONS_MIN_OWNER_ID_DESC',
  PositionsMinPoolIdAsc = 'POSITIONS_MIN_POOL_ID_ASC',
  PositionsMinPoolIdDesc = 'POSITIONS_MIN_POOL_ID_DESC',
  PositionsMinPrincipalAmountXAsc = 'POSITIONS_MIN_PRINCIPAL_AMOUNT_X_ASC',
  PositionsMinPrincipalAmountXDesc = 'POSITIONS_MIN_PRINCIPAL_AMOUNT_X_DESC',
  PositionsMinPrincipalAmountYAsc = 'POSITIONS_MIN_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsMinPrincipalAmountYDesc = 'POSITIONS_MIN_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsMinStatusAsc = 'POSITIONS_MIN_STATUS_ASC',
  PositionsMinStatusDesc = 'POSITIONS_MIN_STATUS_DESC',
  PositionsMinTickLowerAsc = 'POSITIONS_MIN_TICK_LOWER_ASC',
  PositionsMinTickLowerDesc = 'POSITIONS_MIN_TICK_LOWER_DESC',
  PositionsMinTickUpperAsc = 'POSITIONS_MIN_TICK_UPPER_ASC',
  PositionsMinTickUpperDesc = 'POSITIONS_MIN_TICK_UPPER_DESC',
  PositionsMinTokenIdAsc = 'POSITIONS_MIN_TOKEN_ID_ASC',
  PositionsMinTokenIdDesc = 'POSITIONS_MIN_TOKEN_ID_DESC',
  PositionsMinTransactionIdAsc = 'POSITIONS_MIN_TRANSACTION_ID_ASC',
  PositionsMinTransactionIdDesc = 'POSITIONS_MIN_TRANSACTION_ID_DESC',
  PositionsStddevPopulationBlockRangeAsc = 'POSITIONS_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  PositionsStddevPopulationBlockRangeDesc = 'POSITIONS_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  PositionsStddevPopulationClosedAtAsc = 'POSITIONS_STDDEV_POPULATION_CLOSED_AT_ASC',
  PositionsStddevPopulationClosedAtDesc = 'POSITIONS_STDDEV_POPULATION_CLOSED_AT_DESC',
  PositionsStddevPopulationCreatedAtAsc = 'POSITIONS_STDDEV_POPULATION_CREATED_AT_ASC',
  PositionsStddevPopulationCreatedAtDesc = 'POSITIONS_STDDEV_POPULATION_CREATED_AT_DESC',
  PositionsStddevPopulationIdAsc = 'POSITIONS_STDDEV_POPULATION_ID_ASC',
  PositionsStddevPopulationIdDesc = 'POSITIONS_STDDEV_POPULATION_ID_DESC',
  PositionsStddevPopulationLiquidityAsc = 'POSITIONS_STDDEV_POPULATION_LIQUIDITY_ASC',
  PositionsStddevPopulationLiquidityDesc = 'POSITIONS_STDDEV_POPULATION_LIQUIDITY_DESC',
  PositionsStddevPopulationOwnerIdAsc = 'POSITIONS_STDDEV_POPULATION_OWNER_ID_ASC',
  PositionsStddevPopulationOwnerIdDesc = 'POSITIONS_STDDEV_POPULATION_OWNER_ID_DESC',
  PositionsStddevPopulationPoolIdAsc = 'POSITIONS_STDDEV_POPULATION_POOL_ID_ASC',
  PositionsStddevPopulationPoolIdDesc = 'POSITIONS_STDDEV_POPULATION_POOL_ID_DESC',
  PositionsStddevPopulationPrincipalAmountXAsc = 'POSITIONS_STDDEV_POPULATION_PRINCIPAL_AMOUNT_X_ASC',
  PositionsStddevPopulationPrincipalAmountXDesc = 'POSITIONS_STDDEV_POPULATION_PRINCIPAL_AMOUNT_X_DESC',
  PositionsStddevPopulationPrincipalAmountYAsc = 'POSITIONS_STDDEV_POPULATION_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsStddevPopulationPrincipalAmountYDesc = 'POSITIONS_STDDEV_POPULATION_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsStddevPopulationStatusAsc = 'POSITIONS_STDDEV_POPULATION_STATUS_ASC',
  PositionsStddevPopulationStatusDesc = 'POSITIONS_STDDEV_POPULATION_STATUS_DESC',
  PositionsStddevPopulationTickLowerAsc = 'POSITIONS_STDDEV_POPULATION_TICK_LOWER_ASC',
  PositionsStddevPopulationTickLowerDesc = 'POSITIONS_STDDEV_POPULATION_TICK_LOWER_DESC',
  PositionsStddevPopulationTickUpperAsc = 'POSITIONS_STDDEV_POPULATION_TICK_UPPER_ASC',
  PositionsStddevPopulationTickUpperDesc = 'POSITIONS_STDDEV_POPULATION_TICK_UPPER_DESC',
  PositionsStddevPopulationTokenIdAsc = 'POSITIONS_STDDEV_POPULATION_TOKEN_ID_ASC',
  PositionsStddevPopulationTokenIdDesc = 'POSITIONS_STDDEV_POPULATION_TOKEN_ID_DESC',
  PositionsStddevPopulationTransactionIdAsc = 'POSITIONS_STDDEV_POPULATION_TRANSACTION_ID_ASC',
  PositionsStddevPopulationTransactionIdDesc = 'POSITIONS_STDDEV_POPULATION_TRANSACTION_ID_DESC',
  PositionsStddevSampleBlockRangeAsc = 'POSITIONS_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  PositionsStddevSampleBlockRangeDesc = 'POSITIONS_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  PositionsStddevSampleClosedAtAsc = 'POSITIONS_STDDEV_SAMPLE_CLOSED_AT_ASC',
  PositionsStddevSampleClosedAtDesc = 'POSITIONS_STDDEV_SAMPLE_CLOSED_AT_DESC',
  PositionsStddevSampleCreatedAtAsc = 'POSITIONS_STDDEV_SAMPLE_CREATED_AT_ASC',
  PositionsStddevSampleCreatedAtDesc = 'POSITIONS_STDDEV_SAMPLE_CREATED_AT_DESC',
  PositionsStddevSampleIdAsc = 'POSITIONS_STDDEV_SAMPLE_ID_ASC',
  PositionsStddevSampleIdDesc = 'POSITIONS_STDDEV_SAMPLE_ID_DESC',
  PositionsStddevSampleLiquidityAsc = 'POSITIONS_STDDEV_SAMPLE_LIQUIDITY_ASC',
  PositionsStddevSampleLiquidityDesc = 'POSITIONS_STDDEV_SAMPLE_LIQUIDITY_DESC',
  PositionsStddevSampleOwnerIdAsc = 'POSITIONS_STDDEV_SAMPLE_OWNER_ID_ASC',
  PositionsStddevSampleOwnerIdDesc = 'POSITIONS_STDDEV_SAMPLE_OWNER_ID_DESC',
  PositionsStddevSamplePoolIdAsc = 'POSITIONS_STDDEV_SAMPLE_POOL_ID_ASC',
  PositionsStddevSamplePoolIdDesc = 'POSITIONS_STDDEV_SAMPLE_POOL_ID_DESC',
  PositionsStddevSamplePrincipalAmountXAsc = 'POSITIONS_STDDEV_SAMPLE_PRINCIPAL_AMOUNT_X_ASC',
  PositionsStddevSamplePrincipalAmountXDesc = 'POSITIONS_STDDEV_SAMPLE_PRINCIPAL_AMOUNT_X_DESC',
  PositionsStddevSamplePrincipalAmountYAsc = 'POSITIONS_STDDEV_SAMPLE_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsStddevSamplePrincipalAmountYDesc = 'POSITIONS_STDDEV_SAMPLE_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsStddevSampleStatusAsc = 'POSITIONS_STDDEV_SAMPLE_STATUS_ASC',
  PositionsStddevSampleStatusDesc = 'POSITIONS_STDDEV_SAMPLE_STATUS_DESC',
  PositionsStddevSampleTickLowerAsc = 'POSITIONS_STDDEV_SAMPLE_TICK_LOWER_ASC',
  PositionsStddevSampleTickLowerDesc = 'POSITIONS_STDDEV_SAMPLE_TICK_LOWER_DESC',
  PositionsStddevSampleTickUpperAsc = 'POSITIONS_STDDEV_SAMPLE_TICK_UPPER_ASC',
  PositionsStddevSampleTickUpperDesc = 'POSITIONS_STDDEV_SAMPLE_TICK_UPPER_DESC',
  PositionsStddevSampleTokenIdAsc = 'POSITIONS_STDDEV_SAMPLE_TOKEN_ID_ASC',
  PositionsStddevSampleTokenIdDesc = 'POSITIONS_STDDEV_SAMPLE_TOKEN_ID_DESC',
  PositionsStddevSampleTransactionIdAsc = 'POSITIONS_STDDEV_SAMPLE_TRANSACTION_ID_ASC',
  PositionsStddevSampleTransactionIdDesc = 'POSITIONS_STDDEV_SAMPLE_TRANSACTION_ID_DESC',
  PositionsSumBlockRangeAsc = 'POSITIONS_SUM_BLOCK_RANGE_ASC',
  PositionsSumBlockRangeDesc = 'POSITIONS_SUM_BLOCK_RANGE_DESC',
  PositionsSumClosedAtAsc = 'POSITIONS_SUM_CLOSED_AT_ASC',
  PositionsSumClosedAtDesc = 'POSITIONS_SUM_CLOSED_AT_DESC',
  PositionsSumCreatedAtAsc = 'POSITIONS_SUM_CREATED_AT_ASC',
  PositionsSumCreatedAtDesc = 'POSITIONS_SUM_CREATED_AT_DESC',
  PositionsSumIdAsc = 'POSITIONS_SUM_ID_ASC',
  PositionsSumIdDesc = 'POSITIONS_SUM_ID_DESC',
  PositionsSumLiquidityAsc = 'POSITIONS_SUM_LIQUIDITY_ASC',
  PositionsSumLiquidityDesc = 'POSITIONS_SUM_LIQUIDITY_DESC',
  PositionsSumOwnerIdAsc = 'POSITIONS_SUM_OWNER_ID_ASC',
  PositionsSumOwnerIdDesc = 'POSITIONS_SUM_OWNER_ID_DESC',
  PositionsSumPoolIdAsc = 'POSITIONS_SUM_POOL_ID_ASC',
  PositionsSumPoolIdDesc = 'POSITIONS_SUM_POOL_ID_DESC',
  PositionsSumPrincipalAmountXAsc = 'POSITIONS_SUM_PRINCIPAL_AMOUNT_X_ASC',
  PositionsSumPrincipalAmountXDesc = 'POSITIONS_SUM_PRINCIPAL_AMOUNT_X_DESC',
  PositionsSumPrincipalAmountYAsc = 'POSITIONS_SUM_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsSumPrincipalAmountYDesc = 'POSITIONS_SUM_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsSumStatusAsc = 'POSITIONS_SUM_STATUS_ASC',
  PositionsSumStatusDesc = 'POSITIONS_SUM_STATUS_DESC',
  PositionsSumTickLowerAsc = 'POSITIONS_SUM_TICK_LOWER_ASC',
  PositionsSumTickLowerDesc = 'POSITIONS_SUM_TICK_LOWER_DESC',
  PositionsSumTickUpperAsc = 'POSITIONS_SUM_TICK_UPPER_ASC',
  PositionsSumTickUpperDesc = 'POSITIONS_SUM_TICK_UPPER_DESC',
  PositionsSumTokenIdAsc = 'POSITIONS_SUM_TOKEN_ID_ASC',
  PositionsSumTokenIdDesc = 'POSITIONS_SUM_TOKEN_ID_DESC',
  PositionsSumTransactionIdAsc = 'POSITIONS_SUM_TRANSACTION_ID_ASC',
  PositionsSumTransactionIdDesc = 'POSITIONS_SUM_TRANSACTION_ID_DESC',
  PositionsVariancePopulationBlockRangeAsc = 'POSITIONS_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  PositionsVariancePopulationBlockRangeDesc = 'POSITIONS_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  PositionsVariancePopulationClosedAtAsc = 'POSITIONS_VARIANCE_POPULATION_CLOSED_AT_ASC',
  PositionsVariancePopulationClosedAtDesc = 'POSITIONS_VARIANCE_POPULATION_CLOSED_AT_DESC',
  PositionsVariancePopulationCreatedAtAsc = 'POSITIONS_VARIANCE_POPULATION_CREATED_AT_ASC',
  PositionsVariancePopulationCreatedAtDesc = 'POSITIONS_VARIANCE_POPULATION_CREATED_AT_DESC',
  PositionsVariancePopulationIdAsc = 'POSITIONS_VARIANCE_POPULATION_ID_ASC',
  PositionsVariancePopulationIdDesc = 'POSITIONS_VARIANCE_POPULATION_ID_DESC',
  PositionsVariancePopulationLiquidityAsc = 'POSITIONS_VARIANCE_POPULATION_LIQUIDITY_ASC',
  PositionsVariancePopulationLiquidityDesc = 'POSITIONS_VARIANCE_POPULATION_LIQUIDITY_DESC',
  PositionsVariancePopulationOwnerIdAsc = 'POSITIONS_VARIANCE_POPULATION_OWNER_ID_ASC',
  PositionsVariancePopulationOwnerIdDesc = 'POSITIONS_VARIANCE_POPULATION_OWNER_ID_DESC',
  PositionsVariancePopulationPoolIdAsc = 'POSITIONS_VARIANCE_POPULATION_POOL_ID_ASC',
  PositionsVariancePopulationPoolIdDesc = 'POSITIONS_VARIANCE_POPULATION_POOL_ID_DESC',
  PositionsVariancePopulationPrincipalAmountXAsc = 'POSITIONS_VARIANCE_POPULATION_PRINCIPAL_AMOUNT_X_ASC',
  PositionsVariancePopulationPrincipalAmountXDesc = 'POSITIONS_VARIANCE_POPULATION_PRINCIPAL_AMOUNT_X_DESC',
  PositionsVariancePopulationPrincipalAmountYAsc = 'POSITIONS_VARIANCE_POPULATION_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsVariancePopulationPrincipalAmountYDesc = 'POSITIONS_VARIANCE_POPULATION_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsVariancePopulationStatusAsc = 'POSITIONS_VARIANCE_POPULATION_STATUS_ASC',
  PositionsVariancePopulationStatusDesc = 'POSITIONS_VARIANCE_POPULATION_STATUS_DESC',
  PositionsVariancePopulationTickLowerAsc = 'POSITIONS_VARIANCE_POPULATION_TICK_LOWER_ASC',
  PositionsVariancePopulationTickLowerDesc = 'POSITIONS_VARIANCE_POPULATION_TICK_LOWER_DESC',
  PositionsVariancePopulationTickUpperAsc = 'POSITIONS_VARIANCE_POPULATION_TICK_UPPER_ASC',
  PositionsVariancePopulationTickUpperDesc = 'POSITIONS_VARIANCE_POPULATION_TICK_UPPER_DESC',
  PositionsVariancePopulationTokenIdAsc = 'POSITIONS_VARIANCE_POPULATION_TOKEN_ID_ASC',
  PositionsVariancePopulationTokenIdDesc = 'POSITIONS_VARIANCE_POPULATION_TOKEN_ID_DESC',
  PositionsVariancePopulationTransactionIdAsc = 'POSITIONS_VARIANCE_POPULATION_TRANSACTION_ID_ASC',
  PositionsVariancePopulationTransactionIdDesc = 'POSITIONS_VARIANCE_POPULATION_TRANSACTION_ID_DESC',
  PositionsVarianceSampleBlockRangeAsc = 'POSITIONS_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  PositionsVarianceSampleBlockRangeDesc = 'POSITIONS_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  PositionsVarianceSampleClosedAtAsc = 'POSITIONS_VARIANCE_SAMPLE_CLOSED_AT_ASC',
  PositionsVarianceSampleClosedAtDesc = 'POSITIONS_VARIANCE_SAMPLE_CLOSED_AT_DESC',
  PositionsVarianceSampleCreatedAtAsc = 'POSITIONS_VARIANCE_SAMPLE_CREATED_AT_ASC',
  PositionsVarianceSampleCreatedAtDesc = 'POSITIONS_VARIANCE_SAMPLE_CREATED_AT_DESC',
  PositionsVarianceSampleIdAsc = 'POSITIONS_VARIANCE_SAMPLE_ID_ASC',
  PositionsVarianceSampleIdDesc = 'POSITIONS_VARIANCE_SAMPLE_ID_DESC',
  PositionsVarianceSampleLiquidityAsc = 'POSITIONS_VARIANCE_SAMPLE_LIQUIDITY_ASC',
  PositionsVarianceSampleLiquidityDesc = 'POSITIONS_VARIANCE_SAMPLE_LIQUIDITY_DESC',
  PositionsVarianceSampleOwnerIdAsc = 'POSITIONS_VARIANCE_SAMPLE_OWNER_ID_ASC',
  PositionsVarianceSampleOwnerIdDesc = 'POSITIONS_VARIANCE_SAMPLE_OWNER_ID_DESC',
  PositionsVarianceSamplePoolIdAsc = 'POSITIONS_VARIANCE_SAMPLE_POOL_ID_ASC',
  PositionsVarianceSamplePoolIdDesc = 'POSITIONS_VARIANCE_SAMPLE_POOL_ID_DESC',
  PositionsVarianceSamplePrincipalAmountXAsc = 'POSITIONS_VARIANCE_SAMPLE_PRINCIPAL_AMOUNT_X_ASC',
  PositionsVarianceSamplePrincipalAmountXDesc = 'POSITIONS_VARIANCE_SAMPLE_PRINCIPAL_AMOUNT_X_DESC',
  PositionsVarianceSamplePrincipalAmountYAsc = 'POSITIONS_VARIANCE_SAMPLE_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsVarianceSamplePrincipalAmountYDesc = 'POSITIONS_VARIANCE_SAMPLE_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsVarianceSampleStatusAsc = 'POSITIONS_VARIANCE_SAMPLE_STATUS_ASC',
  PositionsVarianceSampleStatusDesc = 'POSITIONS_VARIANCE_SAMPLE_STATUS_DESC',
  PositionsVarianceSampleTickLowerAsc = 'POSITIONS_VARIANCE_SAMPLE_TICK_LOWER_ASC',
  PositionsVarianceSampleTickLowerDesc = 'POSITIONS_VARIANCE_SAMPLE_TICK_LOWER_DESC',
  PositionsVarianceSampleTickUpperAsc = 'POSITIONS_VARIANCE_SAMPLE_TICK_UPPER_ASC',
  PositionsVarianceSampleTickUpperDesc = 'POSITIONS_VARIANCE_SAMPLE_TICK_UPPER_DESC',
  PositionsVarianceSampleTokenIdAsc = 'POSITIONS_VARIANCE_SAMPLE_TOKEN_ID_ASC',
  PositionsVarianceSampleTokenIdDesc = 'POSITIONS_VARIANCE_SAMPLE_TOKEN_ID_DESC',
  PositionsVarianceSampleTransactionIdAsc = 'POSITIONS_VARIANCE_SAMPLE_TRANSACTION_ID_ASC',
  PositionsVarianceSampleTransactionIdDesc = 'POSITIONS_VARIANCE_SAMPLE_TRANSACTION_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SwapAverageAmountInAsc = 'SWAP_AVERAGE_AMOUNT_IN_ASC',
  SwapAverageAmountInDesc = 'SWAP_AVERAGE_AMOUNT_IN_DESC',
  SwapAverageAmountOutAsc = 'SWAP_AVERAGE_AMOUNT_OUT_ASC',
  SwapAverageAmountOutDesc = 'SWAP_AVERAGE_AMOUNT_OUT_DESC',
  SwapAverageBlockRangeAsc = 'SWAP_AVERAGE_BLOCK_RANGE_ASC',
  SwapAverageBlockRangeDesc = 'SWAP_AVERAGE_BLOCK_RANGE_DESC',
  SwapAverageFeeUSDAsc = 'SWAP_AVERAGE_FEE_U_S_D_ASC',
  SwapAverageFeeUSDDesc = 'SWAP_AVERAGE_FEE_U_S_D_DESC',
  SwapAverageIdAsc = 'SWAP_AVERAGE_ID_ASC',
  SwapAverageIdDesc = 'SWAP_AVERAGE_ID_DESC',
  SwapAverageSenderIdAsc = 'SWAP_AVERAGE_SENDER_ID_ASC',
  SwapAverageSenderIdDesc = 'SWAP_AVERAGE_SENDER_ID_DESC',
  SwapAverageTokenInIdAsc = 'SWAP_AVERAGE_TOKEN_IN_ID_ASC',
  SwapAverageTokenInIdDesc = 'SWAP_AVERAGE_TOKEN_IN_ID_DESC',
  SwapAverageTokenOutIdAsc = 'SWAP_AVERAGE_TOKEN_OUT_ID_ASC',
  SwapAverageTokenOutIdDesc = 'SWAP_AVERAGE_TOKEN_OUT_ID_DESC',
  SwapAverageTransactionIdAsc = 'SWAP_AVERAGE_TRANSACTION_ID_ASC',
  SwapAverageTransactionIdDesc = 'SWAP_AVERAGE_TRANSACTION_ID_DESC',
  SwapCountAsc = 'SWAP_COUNT_ASC',
  SwapCountDesc = 'SWAP_COUNT_DESC',
  SwapDistinctCountAmountInAsc = 'SWAP_DISTINCT_COUNT_AMOUNT_IN_ASC',
  SwapDistinctCountAmountInDesc = 'SWAP_DISTINCT_COUNT_AMOUNT_IN_DESC',
  SwapDistinctCountAmountOutAsc = 'SWAP_DISTINCT_COUNT_AMOUNT_OUT_ASC',
  SwapDistinctCountAmountOutDesc = 'SWAP_DISTINCT_COUNT_AMOUNT_OUT_DESC',
  SwapDistinctCountBlockRangeAsc = 'SWAP_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  SwapDistinctCountBlockRangeDesc = 'SWAP_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  SwapDistinctCountFeeUSDAsc = 'SWAP_DISTINCT_COUNT_FEE_U_S_D_ASC',
  SwapDistinctCountFeeUSDDesc = 'SWAP_DISTINCT_COUNT_FEE_U_S_D_DESC',
  SwapDistinctCountIdAsc = 'SWAP_DISTINCT_COUNT_ID_ASC',
  SwapDistinctCountIdDesc = 'SWAP_DISTINCT_COUNT_ID_DESC',
  SwapDistinctCountSenderIdAsc = 'SWAP_DISTINCT_COUNT_SENDER_ID_ASC',
  SwapDistinctCountSenderIdDesc = 'SWAP_DISTINCT_COUNT_SENDER_ID_DESC',
  SwapDistinctCountTokenInIdAsc = 'SWAP_DISTINCT_COUNT_TOKEN_IN_ID_ASC',
  SwapDistinctCountTokenInIdDesc = 'SWAP_DISTINCT_COUNT_TOKEN_IN_ID_DESC',
  SwapDistinctCountTokenOutIdAsc = 'SWAP_DISTINCT_COUNT_TOKEN_OUT_ID_ASC',
  SwapDistinctCountTokenOutIdDesc = 'SWAP_DISTINCT_COUNT_TOKEN_OUT_ID_DESC',
  SwapDistinctCountTransactionIdAsc = 'SWAP_DISTINCT_COUNT_TRANSACTION_ID_ASC',
  SwapDistinctCountTransactionIdDesc = 'SWAP_DISTINCT_COUNT_TRANSACTION_ID_DESC',
  SwapMaxAmountInAsc = 'SWAP_MAX_AMOUNT_IN_ASC',
  SwapMaxAmountInDesc = 'SWAP_MAX_AMOUNT_IN_DESC',
  SwapMaxAmountOutAsc = 'SWAP_MAX_AMOUNT_OUT_ASC',
  SwapMaxAmountOutDesc = 'SWAP_MAX_AMOUNT_OUT_DESC',
  SwapMaxBlockRangeAsc = 'SWAP_MAX_BLOCK_RANGE_ASC',
  SwapMaxBlockRangeDesc = 'SWAP_MAX_BLOCK_RANGE_DESC',
  SwapMaxFeeUSDAsc = 'SWAP_MAX_FEE_U_S_D_ASC',
  SwapMaxFeeUSDDesc = 'SWAP_MAX_FEE_U_S_D_DESC',
  SwapMaxIdAsc = 'SWAP_MAX_ID_ASC',
  SwapMaxIdDesc = 'SWAP_MAX_ID_DESC',
  SwapMaxSenderIdAsc = 'SWAP_MAX_SENDER_ID_ASC',
  SwapMaxSenderIdDesc = 'SWAP_MAX_SENDER_ID_DESC',
  SwapMaxTokenInIdAsc = 'SWAP_MAX_TOKEN_IN_ID_ASC',
  SwapMaxTokenInIdDesc = 'SWAP_MAX_TOKEN_IN_ID_DESC',
  SwapMaxTokenOutIdAsc = 'SWAP_MAX_TOKEN_OUT_ID_ASC',
  SwapMaxTokenOutIdDesc = 'SWAP_MAX_TOKEN_OUT_ID_DESC',
  SwapMaxTransactionIdAsc = 'SWAP_MAX_TRANSACTION_ID_ASC',
  SwapMaxTransactionIdDesc = 'SWAP_MAX_TRANSACTION_ID_DESC',
  SwapMinAmountInAsc = 'SWAP_MIN_AMOUNT_IN_ASC',
  SwapMinAmountInDesc = 'SWAP_MIN_AMOUNT_IN_DESC',
  SwapMinAmountOutAsc = 'SWAP_MIN_AMOUNT_OUT_ASC',
  SwapMinAmountOutDesc = 'SWAP_MIN_AMOUNT_OUT_DESC',
  SwapMinBlockRangeAsc = 'SWAP_MIN_BLOCK_RANGE_ASC',
  SwapMinBlockRangeDesc = 'SWAP_MIN_BLOCK_RANGE_DESC',
  SwapMinFeeUSDAsc = 'SWAP_MIN_FEE_U_S_D_ASC',
  SwapMinFeeUSDDesc = 'SWAP_MIN_FEE_U_S_D_DESC',
  SwapMinIdAsc = 'SWAP_MIN_ID_ASC',
  SwapMinIdDesc = 'SWAP_MIN_ID_DESC',
  SwapMinSenderIdAsc = 'SWAP_MIN_SENDER_ID_ASC',
  SwapMinSenderIdDesc = 'SWAP_MIN_SENDER_ID_DESC',
  SwapMinTokenInIdAsc = 'SWAP_MIN_TOKEN_IN_ID_ASC',
  SwapMinTokenInIdDesc = 'SWAP_MIN_TOKEN_IN_ID_DESC',
  SwapMinTokenOutIdAsc = 'SWAP_MIN_TOKEN_OUT_ID_ASC',
  SwapMinTokenOutIdDesc = 'SWAP_MIN_TOKEN_OUT_ID_DESC',
  SwapMinTransactionIdAsc = 'SWAP_MIN_TRANSACTION_ID_ASC',
  SwapMinTransactionIdDesc = 'SWAP_MIN_TRANSACTION_ID_DESC',
  SwapStddevPopulationAmountInAsc = 'SWAP_STDDEV_POPULATION_AMOUNT_IN_ASC',
  SwapStddevPopulationAmountInDesc = 'SWAP_STDDEV_POPULATION_AMOUNT_IN_DESC',
  SwapStddevPopulationAmountOutAsc = 'SWAP_STDDEV_POPULATION_AMOUNT_OUT_ASC',
  SwapStddevPopulationAmountOutDesc = 'SWAP_STDDEV_POPULATION_AMOUNT_OUT_DESC',
  SwapStddevPopulationBlockRangeAsc = 'SWAP_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  SwapStddevPopulationBlockRangeDesc = 'SWAP_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  SwapStddevPopulationFeeUSDAsc = 'SWAP_STDDEV_POPULATION_FEE_U_S_D_ASC',
  SwapStddevPopulationFeeUSDDesc = 'SWAP_STDDEV_POPULATION_FEE_U_S_D_DESC',
  SwapStddevPopulationIdAsc = 'SWAP_STDDEV_POPULATION_ID_ASC',
  SwapStddevPopulationIdDesc = 'SWAP_STDDEV_POPULATION_ID_DESC',
  SwapStddevPopulationSenderIdAsc = 'SWAP_STDDEV_POPULATION_SENDER_ID_ASC',
  SwapStddevPopulationSenderIdDesc = 'SWAP_STDDEV_POPULATION_SENDER_ID_DESC',
  SwapStddevPopulationTokenInIdAsc = 'SWAP_STDDEV_POPULATION_TOKEN_IN_ID_ASC',
  SwapStddevPopulationTokenInIdDesc = 'SWAP_STDDEV_POPULATION_TOKEN_IN_ID_DESC',
  SwapStddevPopulationTokenOutIdAsc = 'SWAP_STDDEV_POPULATION_TOKEN_OUT_ID_ASC',
  SwapStddevPopulationTokenOutIdDesc = 'SWAP_STDDEV_POPULATION_TOKEN_OUT_ID_DESC',
  SwapStddevPopulationTransactionIdAsc = 'SWAP_STDDEV_POPULATION_TRANSACTION_ID_ASC',
  SwapStddevPopulationTransactionIdDesc = 'SWAP_STDDEV_POPULATION_TRANSACTION_ID_DESC',
  SwapStddevSampleAmountInAsc = 'SWAP_STDDEV_SAMPLE_AMOUNT_IN_ASC',
  SwapStddevSampleAmountInDesc = 'SWAP_STDDEV_SAMPLE_AMOUNT_IN_DESC',
  SwapStddevSampleAmountOutAsc = 'SWAP_STDDEV_SAMPLE_AMOUNT_OUT_ASC',
  SwapStddevSampleAmountOutDesc = 'SWAP_STDDEV_SAMPLE_AMOUNT_OUT_DESC',
  SwapStddevSampleBlockRangeAsc = 'SWAP_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  SwapStddevSampleBlockRangeDesc = 'SWAP_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  SwapStddevSampleFeeUSDAsc = 'SWAP_STDDEV_SAMPLE_FEE_U_S_D_ASC',
  SwapStddevSampleFeeUSDDesc = 'SWAP_STDDEV_SAMPLE_FEE_U_S_D_DESC',
  SwapStddevSampleIdAsc = 'SWAP_STDDEV_SAMPLE_ID_ASC',
  SwapStddevSampleIdDesc = 'SWAP_STDDEV_SAMPLE_ID_DESC',
  SwapStddevSampleSenderIdAsc = 'SWAP_STDDEV_SAMPLE_SENDER_ID_ASC',
  SwapStddevSampleSenderIdDesc = 'SWAP_STDDEV_SAMPLE_SENDER_ID_DESC',
  SwapStddevSampleTokenInIdAsc = 'SWAP_STDDEV_SAMPLE_TOKEN_IN_ID_ASC',
  SwapStddevSampleTokenInIdDesc = 'SWAP_STDDEV_SAMPLE_TOKEN_IN_ID_DESC',
  SwapStddevSampleTokenOutIdAsc = 'SWAP_STDDEV_SAMPLE_TOKEN_OUT_ID_ASC',
  SwapStddevSampleTokenOutIdDesc = 'SWAP_STDDEV_SAMPLE_TOKEN_OUT_ID_DESC',
  SwapStddevSampleTransactionIdAsc = 'SWAP_STDDEV_SAMPLE_TRANSACTION_ID_ASC',
  SwapStddevSampleTransactionIdDesc = 'SWAP_STDDEV_SAMPLE_TRANSACTION_ID_DESC',
  SwapSumAmountInAsc = 'SWAP_SUM_AMOUNT_IN_ASC',
  SwapSumAmountInDesc = 'SWAP_SUM_AMOUNT_IN_DESC',
  SwapSumAmountOutAsc = 'SWAP_SUM_AMOUNT_OUT_ASC',
  SwapSumAmountOutDesc = 'SWAP_SUM_AMOUNT_OUT_DESC',
  SwapSumBlockRangeAsc = 'SWAP_SUM_BLOCK_RANGE_ASC',
  SwapSumBlockRangeDesc = 'SWAP_SUM_BLOCK_RANGE_DESC',
  SwapSumFeeUSDAsc = 'SWAP_SUM_FEE_U_S_D_ASC',
  SwapSumFeeUSDDesc = 'SWAP_SUM_FEE_U_S_D_DESC',
  SwapSumIdAsc = 'SWAP_SUM_ID_ASC',
  SwapSumIdDesc = 'SWAP_SUM_ID_DESC',
  SwapSumSenderIdAsc = 'SWAP_SUM_SENDER_ID_ASC',
  SwapSumSenderIdDesc = 'SWAP_SUM_SENDER_ID_DESC',
  SwapSumTokenInIdAsc = 'SWAP_SUM_TOKEN_IN_ID_ASC',
  SwapSumTokenInIdDesc = 'SWAP_SUM_TOKEN_IN_ID_DESC',
  SwapSumTokenOutIdAsc = 'SWAP_SUM_TOKEN_OUT_ID_ASC',
  SwapSumTokenOutIdDesc = 'SWAP_SUM_TOKEN_OUT_ID_DESC',
  SwapSumTransactionIdAsc = 'SWAP_SUM_TRANSACTION_ID_ASC',
  SwapSumTransactionIdDesc = 'SWAP_SUM_TRANSACTION_ID_DESC',
  SwapVariancePopulationAmountInAsc = 'SWAP_VARIANCE_POPULATION_AMOUNT_IN_ASC',
  SwapVariancePopulationAmountInDesc = 'SWAP_VARIANCE_POPULATION_AMOUNT_IN_DESC',
  SwapVariancePopulationAmountOutAsc = 'SWAP_VARIANCE_POPULATION_AMOUNT_OUT_ASC',
  SwapVariancePopulationAmountOutDesc = 'SWAP_VARIANCE_POPULATION_AMOUNT_OUT_DESC',
  SwapVariancePopulationBlockRangeAsc = 'SWAP_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  SwapVariancePopulationBlockRangeDesc = 'SWAP_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  SwapVariancePopulationFeeUSDAsc = 'SWAP_VARIANCE_POPULATION_FEE_U_S_D_ASC',
  SwapVariancePopulationFeeUSDDesc = 'SWAP_VARIANCE_POPULATION_FEE_U_S_D_DESC',
  SwapVariancePopulationIdAsc = 'SWAP_VARIANCE_POPULATION_ID_ASC',
  SwapVariancePopulationIdDesc = 'SWAP_VARIANCE_POPULATION_ID_DESC',
  SwapVariancePopulationSenderIdAsc = 'SWAP_VARIANCE_POPULATION_SENDER_ID_ASC',
  SwapVariancePopulationSenderIdDesc = 'SWAP_VARIANCE_POPULATION_SENDER_ID_DESC',
  SwapVariancePopulationTokenInIdAsc = 'SWAP_VARIANCE_POPULATION_TOKEN_IN_ID_ASC',
  SwapVariancePopulationTokenInIdDesc = 'SWAP_VARIANCE_POPULATION_TOKEN_IN_ID_DESC',
  SwapVariancePopulationTokenOutIdAsc = 'SWAP_VARIANCE_POPULATION_TOKEN_OUT_ID_ASC',
  SwapVariancePopulationTokenOutIdDesc = 'SWAP_VARIANCE_POPULATION_TOKEN_OUT_ID_DESC',
  SwapVariancePopulationTransactionIdAsc = 'SWAP_VARIANCE_POPULATION_TRANSACTION_ID_ASC',
  SwapVariancePopulationTransactionIdDesc = 'SWAP_VARIANCE_POPULATION_TRANSACTION_ID_DESC',
  SwapVarianceSampleAmountInAsc = 'SWAP_VARIANCE_SAMPLE_AMOUNT_IN_ASC',
  SwapVarianceSampleAmountInDesc = 'SWAP_VARIANCE_SAMPLE_AMOUNT_IN_DESC',
  SwapVarianceSampleAmountOutAsc = 'SWAP_VARIANCE_SAMPLE_AMOUNT_OUT_ASC',
  SwapVarianceSampleAmountOutDesc = 'SWAP_VARIANCE_SAMPLE_AMOUNT_OUT_DESC',
  SwapVarianceSampleBlockRangeAsc = 'SWAP_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  SwapVarianceSampleBlockRangeDesc = 'SWAP_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  SwapVarianceSampleFeeUSDAsc = 'SWAP_VARIANCE_SAMPLE_FEE_U_S_D_ASC',
  SwapVarianceSampleFeeUSDDesc = 'SWAP_VARIANCE_SAMPLE_FEE_U_S_D_DESC',
  SwapVarianceSampleIdAsc = 'SWAP_VARIANCE_SAMPLE_ID_ASC',
  SwapVarianceSampleIdDesc = 'SWAP_VARIANCE_SAMPLE_ID_DESC',
  SwapVarianceSampleSenderIdAsc = 'SWAP_VARIANCE_SAMPLE_SENDER_ID_ASC',
  SwapVarianceSampleSenderIdDesc = 'SWAP_VARIANCE_SAMPLE_SENDER_ID_DESC',
  SwapVarianceSampleTokenInIdAsc = 'SWAP_VARIANCE_SAMPLE_TOKEN_IN_ID_ASC',
  SwapVarianceSampleTokenInIdDesc = 'SWAP_VARIANCE_SAMPLE_TOKEN_IN_ID_DESC',
  SwapVarianceSampleTokenOutIdAsc = 'SWAP_VARIANCE_SAMPLE_TOKEN_OUT_ID_ASC',
  SwapVarianceSampleTokenOutIdDesc = 'SWAP_VARIANCE_SAMPLE_TOKEN_OUT_ID_DESC',
  SwapVarianceSampleTransactionIdAsc = 'SWAP_VARIANCE_SAMPLE_TRANSACTION_ID_ASC',
  SwapVarianceSampleTransactionIdDesc = 'SWAP_VARIANCE_SAMPLE_TRANSACTION_ID_DESC'
}

/** A filter to be used against BigFloat fields. All fields are combined with a logical ‘and.’ */
export type BigFloatFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Scalars['BigFloat']['input'][]>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Scalars['BigFloat']['input'][]>;
};

/** A filter to be used against BigInt fields. All fields are combined with a logical ‘and.’ */
export type BigIntFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['BigInt']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['BigInt']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['BigInt']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigInt']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Scalars['BigInt']['input'][]>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['BigInt']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['BigInt']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['BigInt']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['BigInt']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Scalars['BigInt']['input'][]>;
};

/** A filter to be used against Boolean fields. All fields are combined with a logical ‘and.’ */
export type BooleanFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Boolean']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Boolean']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Boolean']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Boolean']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Scalars['Boolean']['input'][]>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Boolean']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Boolean']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Boolean']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Scalars['Boolean']['input'][]>;
};

export type ClaimFee = Node & {
  __typename?: 'ClaimFee';
  amountUSD?: Maybe<Scalars['String']['output']>;
  amountX: Scalars['BigFloat']['output'];
  amountY: Scalars['BigFloat']['output'];
  /** Reads and enables pagination through a set of `ClaimFeeIncentiveToken`. */
  claimFeeIncentiveTokens: ClaimFeeIncentiveTokensConnection;
  id: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  /** Reads a single `Account` that is related to this `ClaimFee`. */
  owner?: Maybe<Account>;
  ownerId: Scalars['String']['output'];
  /** Reads a single `Pool` that is related to this `ClaimFee`. */
  pool?: Maybe<Pool>;
  poolId: Scalars['String']['output'];
  /** Reads a single `Position` that is related to this `ClaimFee`. */
  position?: Maybe<Position>;
  positionId: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `Token`. */
  tokensByClaimFeeIncentiveTokenClaimFeeIdAndTokenId: ClaimFeeTokensByClaimFeeIncentiveTokenClaimFeeIdAndTokenIdManyToManyConnection;
  /** Reads a single `Transaction` that is related to this `ClaimFee`. */
  transaction?: Maybe<Transaction>;
  transactionId: Scalars['String']['output'];
};


export type ClaimFeeClaimFeeIncentiveTokensArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Claim_Fee_Incentive_Tokens_Distinct_Enum>[]>;
  filter?: InputMaybe<ClaimFeeIncentiveTokenFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimFeeIncentiveTokensOrderBy[]>;
};


export type ClaimFeeTokensByClaimFeeIncentiveTokenClaimFeeIdAndTokenIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Tokens_Distinct_Enum>[]>;
  filter?: InputMaybe<TokenFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokensOrderBy[]>;
};

export type ClaimFeeAggregates = {
  __typename?: 'ClaimFeeAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<ClaimFeeAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<ClaimFeeDistinctCountAggregates>;
  keys?: Maybe<Scalars['String']['output'][]>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<ClaimFeeMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<ClaimFeeMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<ClaimFeeStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<ClaimFeeStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<ClaimFeeSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<ClaimFeeVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<ClaimFeeVarianceSampleAggregates>;
};

/** A filter to be used against aggregates of `ClaimFee` object types. */
export type ClaimFeeAggregatesFilter = {
  /** Mean average aggregate over matching `ClaimFee` objects. */
  average?: InputMaybe<ClaimFeeAverageAggregateFilter>;
  /** Distinct count aggregate over matching `ClaimFee` objects. */
  distinctCount?: InputMaybe<ClaimFeeDistinctCountAggregateFilter>;
  /** A filter that must pass for the relevant `ClaimFee` object to be included within the aggregate. */
  filter?: InputMaybe<ClaimFeeFilter>;
  /** Maximum aggregate over matching `ClaimFee` objects. */
  max?: InputMaybe<ClaimFeeMaxAggregateFilter>;
  /** Minimum aggregate over matching `ClaimFee` objects. */
  min?: InputMaybe<ClaimFeeMinAggregateFilter>;
  /** Population standard deviation aggregate over matching `ClaimFee` objects. */
  stddevPopulation?: InputMaybe<ClaimFeeStddevPopulationAggregateFilter>;
  /** Sample standard deviation aggregate over matching `ClaimFee` objects. */
  stddevSample?: InputMaybe<ClaimFeeStddevSampleAggregateFilter>;
  /** Sum aggregate over matching `ClaimFee` objects. */
  sum?: InputMaybe<ClaimFeeSumAggregateFilter>;
  /** Population variance aggregate over matching `ClaimFee` objects. */
  variancePopulation?: InputMaybe<ClaimFeeVariancePopulationAggregateFilter>;
  /** Sample variance aggregate over matching `ClaimFee` objects. */
  varianceSample?: InputMaybe<ClaimFeeVarianceSampleAggregateFilter>;
};

export type ClaimFeeAverageAggregateFilter = {
  amountX?: InputMaybe<BigFloatFilter>;
  amountY?: InputMaybe<BigFloatFilter>;
};

export type ClaimFeeAverageAggregates = {
  __typename?: 'ClaimFeeAverageAggregates';
  /** Mean average of amountX across the matching connection */
  amountX?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of amountY across the matching connection */
  amountY?: Maybe<Scalars['BigFloat']['output']>;
};

export type ClaimFeeDistinctCountAggregateFilter = {
  _blockRange?: InputMaybe<BigIntFilter>;
  _id?: InputMaybe<BigIntFilter>;
  amountUSD?: InputMaybe<BigIntFilter>;
  amountX?: InputMaybe<BigIntFilter>;
  amountY?: InputMaybe<BigIntFilter>;
  id?: InputMaybe<BigIntFilter>;
  ownerId?: InputMaybe<BigIntFilter>;
  poolId?: InputMaybe<BigIntFilter>;
  positionId?: InputMaybe<BigIntFilter>;
  transactionId?: InputMaybe<BigIntFilter>;
};

export type ClaimFeeDistinctCountAggregates = {
  __typename?: 'ClaimFeeDistinctCountAggregates';
  /** Distinct count of _blockRange across the matching connection */
  _blockRange?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of _id across the matching connection */
  _id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of amountUSD across the matching connection */
  amountUSD?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of amountX across the matching connection */
  amountX?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of amountY across the matching connection */
  amountY?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of ownerId across the matching connection */
  ownerId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of positionId across the matching connection */
  positionId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of transactionId across the matching connection */
  transactionId?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `ClaimFee` object types. All fields are combined with a logical ‘and.’ */
export type ClaimFeeFilter = {
  /** Filter by the object’s `amountUSD` field. */
  amountUSD?: InputMaybe<StringFilter>;
  /** Filter by the object’s `amountX` field. */
  amountX?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `amountY` field. */
  amountY?: InputMaybe<BigFloatFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<ClaimFeeFilter[]>;
  /** Filter by the object’s `claimFeeIncentiveTokens` relation. */
  claimFeeIncentiveTokens?: InputMaybe<ClaimFeeToManyClaimFeeIncentiveTokenFilter>;
  /** Some related `claimFeeIncentiveTokens` exist. */
  claimFeeIncentiveTokensExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ClaimFeeFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<ClaimFeeFilter[]>;
  /** Filter by the object’s `owner` relation. */
  owner?: InputMaybe<AccountFilter>;
  /** Filter by the object’s `ownerId` field. */
  ownerId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `pool` relation. */
  pool?: InputMaybe<PoolFilter>;
  /** Filter by the object’s `poolId` field. */
  poolId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `position` relation. */
  position?: InputMaybe<PositionFilter>;
  /** Filter by the object’s `positionId` field. */
  positionId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `transaction` relation. */
  transaction?: InputMaybe<TransactionFilter>;
  /** Filter by the object’s `transactionId` field. */
  transactionId?: InputMaybe<StringFilter>;
};

export type ClaimFeeIncentiveToken = Node & {
  __typename?: 'ClaimFeeIncentiveToken';
  /** Reads a single `ClaimFee` that is related to this `ClaimFeeIncentiveToken`. */
  claimFee?: Maybe<ClaimFee>;
  claimFeeId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  index: Scalars['Int']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  rewardAmount: Scalars['BigFloat']['output'];
  /** Reads a single `Token` that is related to this `ClaimFeeIncentiveToken`. */
  token?: Maybe<Token>;
  tokenId: Scalars['String']['output'];
};

export type ClaimFeeIncentiveTokenAggregates = {
  __typename?: 'ClaimFeeIncentiveTokenAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<ClaimFeeIncentiveTokenAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<ClaimFeeIncentiveTokenDistinctCountAggregates>;
  keys?: Maybe<Scalars['String']['output'][]>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<ClaimFeeIncentiveTokenMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<ClaimFeeIncentiveTokenMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<ClaimFeeIncentiveTokenStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<ClaimFeeIncentiveTokenStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<ClaimFeeIncentiveTokenSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<ClaimFeeIncentiveTokenVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<ClaimFeeIncentiveTokenVarianceSampleAggregates>;
};

/** A filter to be used against aggregates of `ClaimFeeIncentiveToken` object types. */
export type ClaimFeeIncentiveTokenAggregatesFilter = {
  /** Mean average aggregate over matching `ClaimFeeIncentiveToken` objects. */
  average?: InputMaybe<ClaimFeeIncentiveTokenAverageAggregateFilter>;
  /** Distinct count aggregate over matching `ClaimFeeIncentiveToken` objects. */
  distinctCount?: InputMaybe<ClaimFeeIncentiveTokenDistinctCountAggregateFilter>;
  /** A filter that must pass for the relevant `ClaimFeeIncentiveToken` object to be included within the aggregate. */
  filter?: InputMaybe<ClaimFeeIncentiveTokenFilter>;
  /** Maximum aggregate over matching `ClaimFeeIncentiveToken` objects. */
  max?: InputMaybe<ClaimFeeIncentiveTokenMaxAggregateFilter>;
  /** Minimum aggregate over matching `ClaimFeeIncentiveToken` objects. */
  min?: InputMaybe<ClaimFeeIncentiveTokenMinAggregateFilter>;
  /** Population standard deviation aggregate over matching `ClaimFeeIncentiveToken` objects. */
  stddevPopulation?: InputMaybe<ClaimFeeIncentiveTokenStddevPopulationAggregateFilter>;
  /** Sample standard deviation aggregate over matching `ClaimFeeIncentiveToken` objects. */
  stddevSample?: InputMaybe<ClaimFeeIncentiveTokenStddevSampleAggregateFilter>;
  /** Sum aggregate over matching `ClaimFeeIncentiveToken` objects. */
  sum?: InputMaybe<ClaimFeeIncentiveTokenSumAggregateFilter>;
  /** Population variance aggregate over matching `ClaimFeeIncentiveToken` objects. */
  variancePopulation?: InputMaybe<ClaimFeeIncentiveTokenVariancePopulationAggregateFilter>;
  /** Sample variance aggregate over matching `ClaimFeeIncentiveToken` objects. */
  varianceSample?: InputMaybe<ClaimFeeIncentiveTokenVarianceSampleAggregateFilter>;
};

export type ClaimFeeIncentiveTokenAverageAggregateFilter = {
  index?: InputMaybe<BigFloatFilter>;
  rewardAmount?: InputMaybe<BigFloatFilter>;
};

export type ClaimFeeIncentiveTokenAverageAggregates = {
  __typename?: 'ClaimFeeIncentiveTokenAverageAggregates';
  /** Mean average of index across the matching connection */
  index?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of rewardAmount across the matching connection */
  rewardAmount?: Maybe<Scalars['BigFloat']['output']>;
};

export type ClaimFeeIncentiveTokenDistinctCountAggregateFilter = {
  _blockRange?: InputMaybe<BigIntFilter>;
  _id?: InputMaybe<BigIntFilter>;
  claimFeeId?: InputMaybe<BigIntFilter>;
  id?: InputMaybe<BigIntFilter>;
  index?: InputMaybe<BigIntFilter>;
  rewardAmount?: InputMaybe<BigIntFilter>;
  tokenId?: InputMaybe<BigIntFilter>;
};

export type ClaimFeeIncentiveTokenDistinctCountAggregates = {
  __typename?: 'ClaimFeeIncentiveTokenDistinctCountAggregates';
  /** Distinct count of _blockRange across the matching connection */
  _blockRange?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of _id across the matching connection */
  _id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of claimFeeId across the matching connection */
  claimFeeId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of index across the matching connection */
  index?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of rewardAmount across the matching connection */
  rewardAmount?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of tokenId across the matching connection */
  tokenId?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `ClaimFeeIncentiveToken` object types. All fields are combined with a logical ‘and.’ */
export type ClaimFeeIncentiveTokenFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<ClaimFeeIncentiveTokenFilter[]>;
  /** Filter by the object’s `claimFee` relation. */
  claimFee?: InputMaybe<ClaimFeeFilter>;
  /** Filter by the object’s `claimFeeId` field. */
  claimFeeId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Filter by the object’s `index` field. */
  index?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ClaimFeeIncentiveTokenFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<ClaimFeeIncentiveTokenFilter[]>;
  /** Filter by the object’s `rewardAmount` field. */
  rewardAmount?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `token` relation. */
  token?: InputMaybe<TokenFilter>;
  /** Filter by the object’s `tokenId` field. */
  tokenId?: InputMaybe<StringFilter>;
};

export type ClaimFeeIncentiveTokenMaxAggregateFilter = {
  index?: InputMaybe<IntFilter>;
  rewardAmount?: InputMaybe<BigFloatFilter>;
};

export type ClaimFeeIncentiveTokenMaxAggregates = {
  __typename?: 'ClaimFeeIncentiveTokenMaxAggregates';
  /** Maximum of index across the matching connection */
  index?: Maybe<Scalars['Int']['output']>;
  /** Maximum of rewardAmount across the matching connection */
  rewardAmount?: Maybe<Scalars['BigFloat']['output']>;
};

export type ClaimFeeIncentiveTokenMinAggregateFilter = {
  index?: InputMaybe<IntFilter>;
  rewardAmount?: InputMaybe<BigFloatFilter>;
};

export type ClaimFeeIncentiveTokenMinAggregates = {
  __typename?: 'ClaimFeeIncentiveTokenMinAggregates';
  /** Minimum of index across the matching connection */
  index?: Maybe<Scalars['Int']['output']>;
  /** Minimum of rewardAmount across the matching connection */
  rewardAmount?: Maybe<Scalars['BigFloat']['output']>;
};

export type ClaimFeeIncentiveTokenStddevPopulationAggregateFilter = {
  index?: InputMaybe<BigFloatFilter>;
  rewardAmount?: InputMaybe<BigFloatFilter>;
};

export type ClaimFeeIncentiveTokenStddevPopulationAggregates = {
  __typename?: 'ClaimFeeIncentiveTokenStddevPopulationAggregates';
  /** Population standard deviation of index across the matching connection */
  index?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of rewardAmount across the matching connection */
  rewardAmount?: Maybe<Scalars['BigFloat']['output']>;
};

export type ClaimFeeIncentiveTokenStddevSampleAggregateFilter = {
  index?: InputMaybe<BigFloatFilter>;
  rewardAmount?: InputMaybe<BigFloatFilter>;
};

export type ClaimFeeIncentiveTokenStddevSampleAggregates = {
  __typename?: 'ClaimFeeIncentiveTokenStddevSampleAggregates';
  /** Sample standard deviation of index across the matching connection */
  index?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of rewardAmount across the matching connection */
  rewardAmount?: Maybe<Scalars['BigFloat']['output']>;
};

export type ClaimFeeIncentiveTokenSumAggregateFilter = {
  index?: InputMaybe<BigIntFilter>;
  rewardAmount?: InputMaybe<BigFloatFilter>;
};

export type ClaimFeeIncentiveTokenSumAggregates = {
  __typename?: 'ClaimFeeIncentiveTokenSumAggregates';
  /** Sum of index across the matching connection */
  index: Scalars['BigInt']['output'];
  /** Sum of rewardAmount across the matching connection */
  rewardAmount: Scalars['BigFloat']['output'];
};

export type ClaimFeeIncentiveTokenVariancePopulationAggregateFilter = {
  index?: InputMaybe<BigFloatFilter>;
  rewardAmount?: InputMaybe<BigFloatFilter>;
};

export type ClaimFeeIncentiveTokenVariancePopulationAggregates = {
  __typename?: 'ClaimFeeIncentiveTokenVariancePopulationAggregates';
  /** Population variance of index across the matching connection */
  index?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of rewardAmount across the matching connection */
  rewardAmount?: Maybe<Scalars['BigFloat']['output']>;
};

export type ClaimFeeIncentiveTokenVarianceSampleAggregateFilter = {
  index?: InputMaybe<BigFloatFilter>;
  rewardAmount?: InputMaybe<BigFloatFilter>;
};

export type ClaimFeeIncentiveTokenVarianceSampleAggregates = {
  __typename?: 'ClaimFeeIncentiveTokenVarianceSampleAggregates';
  /** Sample variance of index across the matching connection */
  index?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of rewardAmount across the matching connection */
  rewardAmount?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `ClaimFeeIncentiveToken` values. */
export type ClaimFeeIncentiveTokensConnection = {
  __typename?: 'ClaimFeeIncentiveTokensConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<ClaimFeeIncentiveTokenAggregates>;
  /** A list of edges which contains the `ClaimFeeIncentiveToken` and cursor to aid in pagination. */
  edges: ClaimFeeIncentiveTokensEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<ClaimFeeIncentiveTokenAggregates[]>;
  /** A list of `ClaimFeeIncentiveToken` objects. */
  nodes: Maybe<ClaimFeeIncentiveToken>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ClaimFeeIncentiveToken` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `ClaimFeeIncentiveToken` values. */
export type ClaimFeeIncentiveTokensConnectionGroupedAggregatesArgs = {
  groupBy: ClaimFeeIncentiveTokensGroupBy[];
  having?: InputMaybe<ClaimFeeIncentiveTokensHavingInput>;
};

/** A `ClaimFeeIncentiveToken` edge in the connection. */
export type ClaimFeeIncentiveTokensEdge = {
  __typename?: 'ClaimFeeIncentiveTokensEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `ClaimFeeIncentiveToken` at the end of the edge. */
  node?: Maybe<ClaimFeeIncentiveToken>;
};

/** Grouping methods for `ClaimFeeIncentiveToken` for usage during aggregation. */
export enum ClaimFeeIncentiveTokensGroupBy {
  ClaimFeeId = 'CLAIM_FEE_ID',
  Id = 'ID',
  Index = 'INDEX',
  RewardAmount = 'REWARD_AMOUNT',
  TokenId = 'TOKEN_ID'
}

export type ClaimFeeIncentiveTokensHavingAverageInput = {
  index?: InputMaybe<HavingIntFilter>;
  rewardAmount?: InputMaybe<HavingBigfloatFilter>;
};

export type ClaimFeeIncentiveTokensHavingDistinctCountInput = {
  index?: InputMaybe<HavingIntFilter>;
  rewardAmount?: InputMaybe<HavingBigfloatFilter>;
};

/** Conditions for `ClaimFeeIncentiveToken` aggregates. */
export type ClaimFeeIncentiveTokensHavingInput = {
  AND?: InputMaybe<ClaimFeeIncentiveTokensHavingInput[]>;
  OR?: InputMaybe<ClaimFeeIncentiveTokensHavingInput[]>;
  average?: InputMaybe<ClaimFeeIncentiveTokensHavingAverageInput>;
  distinctCount?: InputMaybe<ClaimFeeIncentiveTokensHavingDistinctCountInput>;
  max?: InputMaybe<ClaimFeeIncentiveTokensHavingMaxInput>;
  min?: InputMaybe<ClaimFeeIncentiveTokensHavingMinInput>;
  stddevPopulation?: InputMaybe<ClaimFeeIncentiveTokensHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<ClaimFeeIncentiveTokensHavingStddevSampleInput>;
  sum?: InputMaybe<ClaimFeeIncentiveTokensHavingSumInput>;
  variancePopulation?: InputMaybe<ClaimFeeIncentiveTokensHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<ClaimFeeIncentiveTokensHavingVarianceSampleInput>;
};

export type ClaimFeeIncentiveTokensHavingMaxInput = {
  index?: InputMaybe<HavingIntFilter>;
  rewardAmount?: InputMaybe<HavingBigfloatFilter>;
};

export type ClaimFeeIncentiveTokensHavingMinInput = {
  index?: InputMaybe<HavingIntFilter>;
  rewardAmount?: InputMaybe<HavingBigfloatFilter>;
};

export type ClaimFeeIncentiveTokensHavingStddevPopulationInput = {
  index?: InputMaybe<HavingIntFilter>;
  rewardAmount?: InputMaybe<HavingBigfloatFilter>;
};

export type ClaimFeeIncentiveTokensHavingStddevSampleInput = {
  index?: InputMaybe<HavingIntFilter>;
  rewardAmount?: InputMaybe<HavingBigfloatFilter>;
};

export type ClaimFeeIncentiveTokensHavingSumInput = {
  index?: InputMaybe<HavingIntFilter>;
  rewardAmount?: InputMaybe<HavingBigfloatFilter>;
};

export type ClaimFeeIncentiveTokensHavingVariancePopulationInput = {
  index?: InputMaybe<HavingIntFilter>;
  rewardAmount?: InputMaybe<HavingBigfloatFilter>;
};

export type ClaimFeeIncentiveTokensHavingVarianceSampleInput = {
  index?: InputMaybe<HavingIntFilter>;
  rewardAmount?: InputMaybe<HavingBigfloatFilter>;
};

/** Methods to use when ordering `ClaimFeeIncentiveToken`. */
export enum ClaimFeeIncentiveTokensOrderBy {
  ClaimFeeIdAsc = 'CLAIM_FEE_ID_ASC',
  ClaimFeeIdDesc = 'CLAIM_FEE_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IndexAsc = 'INDEX_ASC',
  IndexDesc = 'INDEX_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RewardAmountAsc = 'REWARD_AMOUNT_ASC',
  RewardAmountDesc = 'REWARD_AMOUNT_DESC',
  TokenIdAsc = 'TOKEN_ID_ASC',
  TokenIdDesc = 'TOKEN_ID_DESC'
}

export type ClaimFeeMaxAggregateFilter = {
  amountX?: InputMaybe<BigFloatFilter>;
  amountY?: InputMaybe<BigFloatFilter>;
};

export type ClaimFeeMaxAggregates = {
  __typename?: 'ClaimFeeMaxAggregates';
  /** Maximum of amountX across the matching connection */
  amountX?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of amountY across the matching connection */
  amountY?: Maybe<Scalars['BigFloat']['output']>;
};

export type ClaimFeeMinAggregateFilter = {
  amountX?: InputMaybe<BigFloatFilter>;
  amountY?: InputMaybe<BigFloatFilter>;
};

export type ClaimFeeMinAggregates = {
  __typename?: 'ClaimFeeMinAggregates';
  /** Minimum of amountX across the matching connection */
  amountX?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of amountY across the matching connection */
  amountY?: Maybe<Scalars['BigFloat']['output']>;
};

export type ClaimFeeStddevPopulationAggregateFilter = {
  amountX?: InputMaybe<BigFloatFilter>;
  amountY?: InputMaybe<BigFloatFilter>;
};

export type ClaimFeeStddevPopulationAggregates = {
  __typename?: 'ClaimFeeStddevPopulationAggregates';
  /** Population standard deviation of amountX across the matching connection */
  amountX?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of amountY across the matching connection */
  amountY?: Maybe<Scalars['BigFloat']['output']>;
};

export type ClaimFeeStddevSampleAggregateFilter = {
  amountX?: InputMaybe<BigFloatFilter>;
  amountY?: InputMaybe<BigFloatFilter>;
};

export type ClaimFeeStddevSampleAggregates = {
  __typename?: 'ClaimFeeStddevSampleAggregates';
  /** Sample standard deviation of amountX across the matching connection */
  amountX?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of amountY across the matching connection */
  amountY?: Maybe<Scalars['BigFloat']['output']>;
};

export type ClaimFeeSumAggregateFilter = {
  amountX?: InputMaybe<BigFloatFilter>;
  amountY?: InputMaybe<BigFloatFilter>;
};

export type ClaimFeeSumAggregates = {
  __typename?: 'ClaimFeeSumAggregates';
  /** Sum of amountX across the matching connection */
  amountX: Scalars['BigFloat']['output'];
  /** Sum of amountY across the matching connection */
  amountY: Scalars['BigFloat']['output'];
};

/** A filter to be used against many `ClaimFeeIncentiveToken` object types. All fields are combined with a logical ‘and.’ */
export type ClaimFeeToManyClaimFeeIncentiveTokenFilter = {
  /** Aggregates across related `ClaimFeeIncentiveToken` match the filter criteria. */
  aggregates?: InputMaybe<ClaimFeeIncentiveTokenAggregatesFilter>;
  /** Every related `ClaimFeeIncentiveToken` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ClaimFeeIncentiveTokenFilter>;
  /** No related `ClaimFeeIncentiveToken` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ClaimFeeIncentiveTokenFilter>;
  /** Some related `ClaimFeeIncentiveToken` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ClaimFeeIncentiveTokenFilter>;
};

/** A connection to a list of `Token` values, with data from `ClaimFeeIncentiveToken`. */
export type ClaimFeeTokensByClaimFeeIncentiveTokenClaimFeeIdAndTokenIdManyToManyConnection = {
  __typename?: 'ClaimFeeTokensByClaimFeeIncentiveTokenClaimFeeIdAndTokenIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TokenAggregates>;
  /** A list of edges which contains the `Token`, info from the `ClaimFeeIncentiveToken`, and the cursor to aid in pagination. */
  edges: ClaimFeeTokensByClaimFeeIncentiveTokenClaimFeeIdAndTokenIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TokenAggregates[]>;
  /** A list of `Token` objects. */
  nodes: Maybe<Token>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Token` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Token` values, with data from `ClaimFeeIncentiveToken`. */
export type ClaimFeeTokensByClaimFeeIncentiveTokenClaimFeeIdAndTokenIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TokensGroupBy[];
  having?: InputMaybe<TokensHavingInput>;
};

/** A `Token` edge in the connection, with data from `ClaimFeeIncentiveToken`. */
export type ClaimFeeTokensByClaimFeeIncentiveTokenClaimFeeIdAndTokenIdManyToManyEdge = {
  __typename?: 'ClaimFeeTokensByClaimFeeIncentiveTokenClaimFeeIdAndTokenIdManyToManyEdge';
  /** Reads and enables pagination through a set of `ClaimFeeIncentiveToken`. */
  claimFeeIncentiveTokens: ClaimFeeIncentiveTokensConnection;
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Token` at the end of the edge. */
  node?: Maybe<Token>;
};


/** A `Token` edge in the connection, with data from `ClaimFeeIncentiveToken`. */
export type ClaimFeeTokensByClaimFeeIncentiveTokenClaimFeeIdAndTokenIdManyToManyEdgeClaimFeeIncentiveTokensArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Claim_Fee_Incentive_Tokens_Distinct_Enum>[]>;
  filter?: InputMaybe<ClaimFeeIncentiveTokenFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimFeeIncentiveTokensOrderBy[]>;
};

export type ClaimFeeVariancePopulationAggregateFilter = {
  amountX?: InputMaybe<BigFloatFilter>;
  amountY?: InputMaybe<BigFloatFilter>;
};

export type ClaimFeeVariancePopulationAggregates = {
  __typename?: 'ClaimFeeVariancePopulationAggregates';
  /** Population variance of amountX across the matching connection */
  amountX?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of amountY across the matching connection */
  amountY?: Maybe<Scalars['BigFloat']['output']>;
};

export type ClaimFeeVarianceSampleAggregateFilter = {
  amountX?: InputMaybe<BigFloatFilter>;
  amountY?: InputMaybe<BigFloatFilter>;
};

export type ClaimFeeVarianceSampleAggregates = {
  __typename?: 'ClaimFeeVarianceSampleAggregates';
  /** Sample variance of amountX across the matching connection */
  amountX?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of amountY across the matching connection */
  amountY?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `ClaimFee` values. */
export type ClaimFeesConnection = {
  __typename?: 'ClaimFeesConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<ClaimFeeAggregates>;
  /** A list of edges which contains the `ClaimFee` and cursor to aid in pagination. */
  edges: ClaimFeesEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<ClaimFeeAggregates[]>;
  /** A list of `ClaimFee` objects. */
  nodes: Maybe<ClaimFee>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ClaimFee` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `ClaimFee` values. */
export type ClaimFeesConnectionGroupedAggregatesArgs = {
  groupBy: ClaimFeesGroupBy[];
  having?: InputMaybe<ClaimFeesHavingInput>;
};

/** A `ClaimFee` edge in the connection. */
export type ClaimFeesEdge = {
  __typename?: 'ClaimFeesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `ClaimFee` at the end of the edge. */
  node?: Maybe<ClaimFee>;
};

/** Grouping methods for `ClaimFee` for usage during aggregation. */
export enum ClaimFeesGroupBy {
  AmountUSD = 'AMOUNT_U_S_D',
  AmountX = 'AMOUNT_X',
  AmountY = 'AMOUNT_Y',
  Id = 'ID',
  OwnerId = 'OWNER_ID',
  PoolId = 'POOL_ID',
  PositionId = 'POSITION_ID',
  TransactionId = 'TRANSACTION_ID'
}

export type ClaimFeesHavingAverageInput = {
  amountX?: InputMaybe<HavingBigfloatFilter>;
  amountY?: InputMaybe<HavingBigfloatFilter>;
};

export type ClaimFeesHavingDistinctCountInput = {
  amountX?: InputMaybe<HavingBigfloatFilter>;
  amountY?: InputMaybe<HavingBigfloatFilter>;
};

/** Conditions for `ClaimFee` aggregates. */
export type ClaimFeesHavingInput = {
  AND?: InputMaybe<ClaimFeesHavingInput[]>;
  OR?: InputMaybe<ClaimFeesHavingInput[]>;
  average?: InputMaybe<ClaimFeesHavingAverageInput>;
  distinctCount?: InputMaybe<ClaimFeesHavingDistinctCountInput>;
  max?: InputMaybe<ClaimFeesHavingMaxInput>;
  min?: InputMaybe<ClaimFeesHavingMinInput>;
  stddevPopulation?: InputMaybe<ClaimFeesHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<ClaimFeesHavingStddevSampleInput>;
  sum?: InputMaybe<ClaimFeesHavingSumInput>;
  variancePopulation?: InputMaybe<ClaimFeesHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<ClaimFeesHavingVarianceSampleInput>;
};

export type ClaimFeesHavingMaxInput = {
  amountX?: InputMaybe<HavingBigfloatFilter>;
  amountY?: InputMaybe<HavingBigfloatFilter>;
};

export type ClaimFeesHavingMinInput = {
  amountX?: InputMaybe<HavingBigfloatFilter>;
  amountY?: InputMaybe<HavingBigfloatFilter>;
};

export type ClaimFeesHavingStddevPopulationInput = {
  amountX?: InputMaybe<HavingBigfloatFilter>;
  amountY?: InputMaybe<HavingBigfloatFilter>;
};

export type ClaimFeesHavingStddevSampleInput = {
  amountX?: InputMaybe<HavingBigfloatFilter>;
  amountY?: InputMaybe<HavingBigfloatFilter>;
};

export type ClaimFeesHavingSumInput = {
  amountX?: InputMaybe<HavingBigfloatFilter>;
  amountY?: InputMaybe<HavingBigfloatFilter>;
};

export type ClaimFeesHavingVariancePopulationInput = {
  amountX?: InputMaybe<HavingBigfloatFilter>;
  amountY?: InputMaybe<HavingBigfloatFilter>;
};

export type ClaimFeesHavingVarianceSampleInput = {
  amountX?: InputMaybe<HavingBigfloatFilter>;
  amountY?: InputMaybe<HavingBigfloatFilter>;
};

/** Methods to use when ordering `ClaimFee`. */
export enum ClaimFeesOrderBy {
  AmountUSDAsc = 'AMOUNT_U_S_D_ASC',
  AmountUSDDesc = 'AMOUNT_U_S_D_DESC',
  AmountXAsc = 'AMOUNT_X_ASC',
  AmountXDesc = 'AMOUNT_X_DESC',
  AmountYAsc = 'AMOUNT_Y_ASC',
  AmountYDesc = 'AMOUNT_Y_DESC',
  ClaimFeeIncentiveTokensAverageBlockRangeAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_BLOCK_RANGE_ASC',
  ClaimFeeIncentiveTokensAverageBlockRangeDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_BLOCK_RANGE_DESC',
  ClaimFeeIncentiveTokensAverageClaimFeeIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_CLAIM_FEE_ID_ASC',
  ClaimFeeIncentiveTokensAverageClaimFeeIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_CLAIM_FEE_ID_DESC',
  ClaimFeeIncentiveTokensAverageIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_ID_ASC',
  ClaimFeeIncentiveTokensAverageIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_ID_DESC',
  ClaimFeeIncentiveTokensAverageIndexAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_INDEX_ASC',
  ClaimFeeIncentiveTokensAverageIndexDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_INDEX_DESC',
  ClaimFeeIncentiveTokensAverageRewardAmountAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_REWARD_AMOUNT_ASC',
  ClaimFeeIncentiveTokensAverageRewardAmountDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_REWARD_AMOUNT_DESC',
  ClaimFeeIncentiveTokensAverageTokenIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_TOKEN_ID_ASC',
  ClaimFeeIncentiveTokensAverageTokenIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_TOKEN_ID_DESC',
  ClaimFeeIncentiveTokensCountAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_COUNT_ASC',
  ClaimFeeIncentiveTokensCountDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_COUNT_DESC',
  ClaimFeeIncentiveTokensDistinctCountBlockRangeAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  ClaimFeeIncentiveTokensDistinctCountBlockRangeDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  ClaimFeeIncentiveTokensDistinctCountClaimFeeIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_CLAIM_FEE_ID_ASC',
  ClaimFeeIncentiveTokensDistinctCountClaimFeeIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_CLAIM_FEE_ID_DESC',
  ClaimFeeIncentiveTokensDistinctCountIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_ID_ASC',
  ClaimFeeIncentiveTokensDistinctCountIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_ID_DESC',
  ClaimFeeIncentiveTokensDistinctCountIndexAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_INDEX_ASC',
  ClaimFeeIncentiveTokensDistinctCountIndexDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_INDEX_DESC',
  ClaimFeeIncentiveTokensDistinctCountRewardAmountAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_REWARD_AMOUNT_ASC',
  ClaimFeeIncentiveTokensDistinctCountRewardAmountDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_REWARD_AMOUNT_DESC',
  ClaimFeeIncentiveTokensDistinctCountTokenIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_TOKEN_ID_ASC',
  ClaimFeeIncentiveTokensDistinctCountTokenIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_TOKEN_ID_DESC',
  ClaimFeeIncentiveTokensMaxBlockRangeAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_BLOCK_RANGE_ASC',
  ClaimFeeIncentiveTokensMaxBlockRangeDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_BLOCK_RANGE_DESC',
  ClaimFeeIncentiveTokensMaxClaimFeeIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_CLAIM_FEE_ID_ASC',
  ClaimFeeIncentiveTokensMaxClaimFeeIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_CLAIM_FEE_ID_DESC',
  ClaimFeeIncentiveTokensMaxIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_ID_ASC',
  ClaimFeeIncentiveTokensMaxIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_ID_DESC',
  ClaimFeeIncentiveTokensMaxIndexAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_INDEX_ASC',
  ClaimFeeIncentiveTokensMaxIndexDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_INDEX_DESC',
  ClaimFeeIncentiveTokensMaxRewardAmountAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_REWARD_AMOUNT_ASC',
  ClaimFeeIncentiveTokensMaxRewardAmountDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_REWARD_AMOUNT_DESC',
  ClaimFeeIncentiveTokensMaxTokenIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_TOKEN_ID_ASC',
  ClaimFeeIncentiveTokensMaxTokenIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_TOKEN_ID_DESC',
  ClaimFeeIncentiveTokensMinBlockRangeAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_BLOCK_RANGE_ASC',
  ClaimFeeIncentiveTokensMinBlockRangeDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_BLOCK_RANGE_DESC',
  ClaimFeeIncentiveTokensMinClaimFeeIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_CLAIM_FEE_ID_ASC',
  ClaimFeeIncentiveTokensMinClaimFeeIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_CLAIM_FEE_ID_DESC',
  ClaimFeeIncentiveTokensMinIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_ID_ASC',
  ClaimFeeIncentiveTokensMinIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_ID_DESC',
  ClaimFeeIncentiveTokensMinIndexAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_INDEX_ASC',
  ClaimFeeIncentiveTokensMinIndexDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_INDEX_DESC',
  ClaimFeeIncentiveTokensMinRewardAmountAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_REWARD_AMOUNT_ASC',
  ClaimFeeIncentiveTokensMinRewardAmountDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_REWARD_AMOUNT_DESC',
  ClaimFeeIncentiveTokensMinTokenIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_TOKEN_ID_ASC',
  ClaimFeeIncentiveTokensMinTokenIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_TOKEN_ID_DESC',
  ClaimFeeIncentiveTokensStddevPopulationBlockRangeAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  ClaimFeeIncentiveTokensStddevPopulationBlockRangeDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  ClaimFeeIncentiveTokensStddevPopulationClaimFeeIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_CLAIM_FEE_ID_ASC',
  ClaimFeeIncentiveTokensStddevPopulationClaimFeeIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_CLAIM_FEE_ID_DESC',
  ClaimFeeIncentiveTokensStddevPopulationIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_ID_ASC',
  ClaimFeeIncentiveTokensStddevPopulationIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_ID_DESC',
  ClaimFeeIncentiveTokensStddevPopulationIndexAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_INDEX_ASC',
  ClaimFeeIncentiveTokensStddevPopulationIndexDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_INDEX_DESC',
  ClaimFeeIncentiveTokensStddevPopulationRewardAmountAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_REWARD_AMOUNT_ASC',
  ClaimFeeIncentiveTokensStddevPopulationRewardAmountDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_REWARD_AMOUNT_DESC',
  ClaimFeeIncentiveTokensStddevPopulationTokenIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_TOKEN_ID_ASC',
  ClaimFeeIncentiveTokensStddevPopulationTokenIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_TOKEN_ID_DESC',
  ClaimFeeIncentiveTokensStddevSampleBlockRangeAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  ClaimFeeIncentiveTokensStddevSampleBlockRangeDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  ClaimFeeIncentiveTokensStddevSampleClaimFeeIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_CLAIM_FEE_ID_ASC',
  ClaimFeeIncentiveTokensStddevSampleClaimFeeIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_CLAIM_FEE_ID_DESC',
  ClaimFeeIncentiveTokensStddevSampleIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_ID_ASC',
  ClaimFeeIncentiveTokensStddevSampleIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_ID_DESC',
  ClaimFeeIncentiveTokensStddevSampleIndexAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_INDEX_ASC',
  ClaimFeeIncentiveTokensStddevSampleIndexDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_INDEX_DESC',
  ClaimFeeIncentiveTokensStddevSampleRewardAmountAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_REWARD_AMOUNT_ASC',
  ClaimFeeIncentiveTokensStddevSampleRewardAmountDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_REWARD_AMOUNT_DESC',
  ClaimFeeIncentiveTokensStddevSampleTokenIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_TOKEN_ID_ASC',
  ClaimFeeIncentiveTokensStddevSampleTokenIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_TOKEN_ID_DESC',
  ClaimFeeIncentiveTokensSumBlockRangeAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_BLOCK_RANGE_ASC',
  ClaimFeeIncentiveTokensSumBlockRangeDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_BLOCK_RANGE_DESC',
  ClaimFeeIncentiveTokensSumClaimFeeIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_CLAIM_FEE_ID_ASC',
  ClaimFeeIncentiveTokensSumClaimFeeIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_CLAIM_FEE_ID_DESC',
  ClaimFeeIncentiveTokensSumIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_ID_ASC',
  ClaimFeeIncentiveTokensSumIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_ID_DESC',
  ClaimFeeIncentiveTokensSumIndexAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_INDEX_ASC',
  ClaimFeeIncentiveTokensSumIndexDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_INDEX_DESC',
  ClaimFeeIncentiveTokensSumRewardAmountAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_REWARD_AMOUNT_ASC',
  ClaimFeeIncentiveTokensSumRewardAmountDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_REWARD_AMOUNT_DESC',
  ClaimFeeIncentiveTokensSumTokenIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_TOKEN_ID_ASC',
  ClaimFeeIncentiveTokensSumTokenIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_TOKEN_ID_DESC',
  ClaimFeeIncentiveTokensVariancePopulationBlockRangeAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  ClaimFeeIncentiveTokensVariancePopulationBlockRangeDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  ClaimFeeIncentiveTokensVariancePopulationClaimFeeIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_CLAIM_FEE_ID_ASC',
  ClaimFeeIncentiveTokensVariancePopulationClaimFeeIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_CLAIM_FEE_ID_DESC',
  ClaimFeeIncentiveTokensVariancePopulationIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_ID_ASC',
  ClaimFeeIncentiveTokensVariancePopulationIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_ID_DESC',
  ClaimFeeIncentiveTokensVariancePopulationIndexAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_INDEX_ASC',
  ClaimFeeIncentiveTokensVariancePopulationIndexDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_INDEX_DESC',
  ClaimFeeIncentiveTokensVariancePopulationRewardAmountAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_REWARD_AMOUNT_ASC',
  ClaimFeeIncentiveTokensVariancePopulationRewardAmountDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_REWARD_AMOUNT_DESC',
  ClaimFeeIncentiveTokensVariancePopulationTokenIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_TOKEN_ID_ASC',
  ClaimFeeIncentiveTokensVariancePopulationTokenIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_TOKEN_ID_DESC',
  ClaimFeeIncentiveTokensVarianceSampleBlockRangeAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  ClaimFeeIncentiveTokensVarianceSampleBlockRangeDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  ClaimFeeIncentiveTokensVarianceSampleClaimFeeIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_CLAIM_FEE_ID_ASC',
  ClaimFeeIncentiveTokensVarianceSampleClaimFeeIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_CLAIM_FEE_ID_DESC',
  ClaimFeeIncentiveTokensVarianceSampleIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_ID_ASC',
  ClaimFeeIncentiveTokensVarianceSampleIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_ID_DESC',
  ClaimFeeIncentiveTokensVarianceSampleIndexAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_INDEX_ASC',
  ClaimFeeIncentiveTokensVarianceSampleIndexDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_INDEX_DESC',
  ClaimFeeIncentiveTokensVarianceSampleRewardAmountAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_REWARD_AMOUNT_ASC',
  ClaimFeeIncentiveTokensVarianceSampleRewardAmountDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_REWARD_AMOUNT_DESC',
  ClaimFeeIncentiveTokensVarianceSampleTokenIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_TOKEN_ID_ASC',
  ClaimFeeIncentiveTokensVarianceSampleTokenIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_TOKEN_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  OwnerIdAsc = 'OWNER_ID_ASC',
  OwnerIdDesc = 'OWNER_ID_DESC',
  PoolIdAsc = 'POOL_ID_ASC',
  PoolIdDesc = 'POOL_ID_DESC',
  PositionIdAsc = 'POSITION_ID_ASC',
  PositionIdDesc = 'POSITION_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TransactionIdAsc = 'TRANSACTION_ID_ASC',
  TransactionIdDesc = 'TRANSACTION_ID_DESC'
}

export type HavingBigfloatFilter = {
  equalTo?: InputMaybe<Scalars['BigFloat']['input']>;
  greaterThan?: InputMaybe<Scalars['BigFloat']['input']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigFloat']['input']>;
  lessThan?: InputMaybe<Scalars['BigFloat']['input']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['BigFloat']['input']>;
  notEqualTo?: InputMaybe<Scalars['BigFloat']['input']>;
};

export type HavingIntFilter = {
  equalTo?: InputMaybe<Scalars['Int']['input']>;
  greaterThan?: InputMaybe<Scalars['Int']['input']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  lessThan?: InputMaybe<Scalars['Int']['input']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  notEqualTo?: InputMaybe<Scalars['Int']['input']>;
};

/** A filter to be used against Int fields. All fields are combined with a logical ‘and.’ */
export type IntFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Int']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Int']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Int']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Scalars['Int']['input'][]>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Int']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Int']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Scalars['Int']['input'][]>;
};

/** A filter to be used against JSON fields. All fields are combined with a logical ‘and.’ */
export type JsonFilter = {
  /** Contained by the specified JSON. */
  containedBy?: InputMaybe<Scalars['JSON']['input']>;
  /** Contains the specified JSON. */
  contains?: InputMaybe<Scalars['JSON']['input']>;
  /** Contains all of the specified keys. */
  containsAllKeys?: InputMaybe<Scalars['String']['input'][]>;
  /** Contains any of the specified keys. */
  containsAnyKeys?: InputMaybe<Scalars['String']['input'][]>;
  /** Contains the specified key. */
  containsKey?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['JSON']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['JSON']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['JSON']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['JSON']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Scalars['JSON']['input'][]>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['JSON']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['JSON']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['JSON']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['JSON']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Scalars['JSON']['input'][]>;
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']['output']>;
};

export type Pool = Node & {
  __typename?: 'Pool';
  /** Reads and enables pagination through a set of `Account`. */
  accountsByClaimFeePoolIdAndOwnerId: PoolAccountsByClaimFeePoolIdAndOwnerIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Account`. */
  accountsByPositionPoolIdAndOwnerId: PoolAccountsByPositionPoolIdAndOwnerIdManyToManyConnection;
  /** Reads and enables pagination through a set of `ClaimFee`. */
  claimFees: ClaimFeesConnection;
  collectedFeesTokenX?: Maybe<Scalars['BigFloat']['output']>;
  collectedFeesTokenY?: Maybe<Scalars['BigFloat']['output']>;
  collectedFeesUSD?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['BigFloat']['output'];
  createdAtBlockNumber?: Maybe<Scalars['BigFloat']['output']>;
  currentTick: Scalars['BigFloat']['output'];
  fee: Scalars['BigFloat']['output'];
  feesUSD?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  /** Reads a single `Account` that is related to this `Pool`. */
  poolCreator?: Maybe<Account>;
  poolCreatorId?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `PoolDayDatum`. */
  poolDayData: PoolDayDataConnection;
  /** Reads and enables pagination through a set of `PoolHourDatum`. */
  poolHourData: PoolHourDataConnection;
  /** Reads and enables pagination through a set of `PoolTokenIncentive`. */
  poolTokenIncentives: PoolTokenIncentivesConnection;
  /** Reads and enables pagination through a set of `Position`. */
  positions: PositionsConnection;
  /** Reads and enables pagination through a set of `Position`. */
  positionsByClaimFeePoolIdAndPositionId: PoolPositionsByClaimFeePoolIdAndPositionIdManyToManyConnection;
  sqrtPrice: Scalars['BigFloat']['output'];
  /** Reads and enables pagination through a set of `SwapRoute`. */
  swaps: SwapRoutesConnection;
  /** Reads and enables pagination through a set of `Swap`. */
  swapsBySwapRoutePoolIdAndSwapId: PoolSwapsBySwapRoutePoolIdAndSwapIdManyToManyConnection;
  tickSpacing: Scalars['Int']['output'];
  /** Reads a single `Token` that is related to this `Pool`. */
  tokenX?: Maybe<Token>;
  tokenXId: Scalars['String']['output'];
  /** Reads a single `Token` that is related to this `Pool`. */
  tokenY?: Maybe<Token>;
  tokenYId: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `Token`. */
  tokensByPoolTokenIncentivePoolIdAndTokenId: PoolTokensByPoolTokenIncentivePoolIdAndTokenIdManyToManyConnection;
  totalValueLockedTokenX: Scalars['BigFloat']['output'];
  totalValueLockedTokenY: Scalars['BigFloat']['output'];
  totalValueLockedUSD: Scalars['String']['output'];
  /** Reads a single `Transaction` that is related to this `Pool`. */
  transaction?: Maybe<Transaction>;
  transactionId?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `Transaction`. */
  transactionsByClaimFeePoolIdAndTransactionId: PoolTransactionsByClaimFeePoolIdAndTransactionIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Transaction`. */
  transactionsByPoolTokenIncentivePoolIdAndTransactionId: PoolTransactionsByPoolTokenIncentivePoolIdAndTransactionIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Transaction`. */
  transactionsByPositionPoolIdAndTransactionId: PoolTransactionsByPositionPoolIdAndTransactionIdManyToManyConnection;
  txCount?: Maybe<Scalars['BigFloat']['output']>;
  updatedAt: Scalars['BigFloat']['output'];
  volumeTokenX?: Maybe<Scalars['BigFloat']['output']>;
  volumeTokenY?: Maybe<Scalars['BigFloat']['output']>;
  volumeUSD?: Maybe<Scalars['String']['output']>;
};


export type PoolAccountsByClaimFeePoolIdAndOwnerIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Accounts_Distinct_Enum>[]>;
  filter?: InputMaybe<AccountFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountsOrderBy[]>;
};


export type PoolAccountsByPositionPoolIdAndOwnerIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Accounts_Distinct_Enum>[]>;
  filter?: InputMaybe<AccountFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountsOrderBy[]>;
};


export type PoolClaimFeesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Claim_Fees_Distinct_Enum>[]>;
  filter?: InputMaybe<ClaimFeeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimFeesOrderBy[]>;
};


export type PoolPoolDayDataArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pool_Day_Data_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolDayDatumFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolDayDataOrderBy[]>;
};


export type PoolPoolHourDataArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pool_Hour_Data_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolHourDatumFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolHourDataOrderBy[]>;
};


export type PoolPoolTokenIncentivesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pool_Token_Incentives_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolTokenIncentiveFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolTokenIncentivesOrderBy[]>;
};


export type PoolPositionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Positions_Distinct_Enum>[]>;
  filter?: InputMaybe<PositionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionsOrderBy[]>;
};


export type PoolPositionsByClaimFeePoolIdAndPositionIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Positions_Distinct_Enum>[]>;
  filter?: InputMaybe<PositionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionsOrderBy[]>;
};


export type PoolSwapsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Swap_Routes_Distinct_Enum>[]>;
  filter?: InputMaybe<SwapRouteFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapRoutesOrderBy[]>;
};


export type PoolSwapsBySwapRoutePoolIdAndSwapIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Swaps_Distinct_Enum>[]>;
  filter?: InputMaybe<SwapFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapsOrderBy[]>;
};


export type PoolTokensByPoolTokenIncentivePoolIdAndTokenIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Tokens_Distinct_Enum>[]>;
  filter?: InputMaybe<TokenFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokensOrderBy[]>;
};


export type PoolTransactionsByClaimFeePoolIdAndTransactionIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Transactions_Distinct_Enum>[]>;
  filter?: InputMaybe<TransactionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TransactionsOrderBy[]>;
};


export type PoolTransactionsByPoolTokenIncentivePoolIdAndTransactionIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Transactions_Distinct_Enum>[]>;
  filter?: InputMaybe<TransactionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TransactionsOrderBy[]>;
};


export type PoolTransactionsByPositionPoolIdAndTransactionIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Transactions_Distinct_Enum>[]>;
  filter?: InputMaybe<TransactionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TransactionsOrderBy[]>;
};

/** A connection to a list of `Account` values, with data from `ClaimFee`. */
export type PoolAccountsByClaimFeePoolIdAndOwnerIdManyToManyConnection = {
  __typename?: 'PoolAccountsByClaimFeePoolIdAndOwnerIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<AccountAggregates>;
  /** A list of edges which contains the `Account`, info from the `ClaimFee`, and the cursor to aid in pagination. */
  edges: PoolAccountsByClaimFeePoolIdAndOwnerIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<AccountAggregates[]>;
  /** A list of `Account` objects. */
  nodes: Maybe<Account>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Account` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Account` values, with data from `ClaimFee`. */
export type PoolAccountsByClaimFeePoolIdAndOwnerIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: AccountsGroupBy[];
  having?: InputMaybe<AccountsHavingInput>;
};

/** A `Account` edge in the connection, with data from `ClaimFee`. */
export type PoolAccountsByClaimFeePoolIdAndOwnerIdManyToManyEdge = {
  __typename?: 'PoolAccountsByClaimFeePoolIdAndOwnerIdManyToManyEdge';
  /** Reads and enables pagination through a set of `ClaimFee`. */
  claimFees: ClaimFeesConnection;
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Account` at the end of the edge. */
  node?: Maybe<Account>;
};


/** A `Account` edge in the connection, with data from `ClaimFee`. */
export type PoolAccountsByClaimFeePoolIdAndOwnerIdManyToManyEdgeClaimFeesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Claim_Fees_Distinct_Enum>[]>;
  filter?: InputMaybe<ClaimFeeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimFeesOrderBy[]>;
};

/** A connection to a list of `Account` values, with data from `Position`. */
export type PoolAccountsByPositionPoolIdAndOwnerIdManyToManyConnection = {
  __typename?: 'PoolAccountsByPositionPoolIdAndOwnerIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<AccountAggregates>;
  /** A list of edges which contains the `Account`, info from the `Position`, and the cursor to aid in pagination. */
  edges: PoolAccountsByPositionPoolIdAndOwnerIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<AccountAggregates[]>;
  /** A list of `Account` objects. */
  nodes: Maybe<Account>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Account` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Account` values, with data from `Position`. */
export type PoolAccountsByPositionPoolIdAndOwnerIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: AccountsGroupBy[];
  having?: InputMaybe<AccountsHavingInput>;
};

/** A `Account` edge in the connection, with data from `Position`. */
export type PoolAccountsByPositionPoolIdAndOwnerIdManyToManyEdge = {
  __typename?: 'PoolAccountsByPositionPoolIdAndOwnerIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Account` at the end of the edge. */
  node?: Maybe<Account>;
  /** Reads and enables pagination through a set of `Position`. */
  positions: PositionsConnection;
};


/** A `Account` edge in the connection, with data from `Position`. */
export type PoolAccountsByPositionPoolIdAndOwnerIdManyToManyEdgePositionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Positions_Distinct_Enum>[]>;
  filter?: InputMaybe<PositionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionsOrderBy[]>;
};

export type PoolAggregates = {
  __typename?: 'PoolAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<PoolAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<PoolDistinctCountAggregates>;
  keys?: Maybe<Scalars['String']['output'][]>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<PoolMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<PoolMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<PoolStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<PoolStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<PoolSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<PoolVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<PoolVarianceSampleAggregates>;
};

/** A filter to be used against aggregates of `Pool` object types. */
export type PoolAggregatesFilter = {
  /** Mean average aggregate over matching `Pool` objects. */
  average?: InputMaybe<PoolAverageAggregateFilter>;
  /** Distinct count aggregate over matching `Pool` objects. */
  distinctCount?: InputMaybe<PoolDistinctCountAggregateFilter>;
  /** A filter that must pass for the relevant `Pool` object to be included within the aggregate. */
  filter?: InputMaybe<PoolFilter>;
  /** Maximum aggregate over matching `Pool` objects. */
  max?: InputMaybe<PoolMaxAggregateFilter>;
  /** Minimum aggregate over matching `Pool` objects. */
  min?: InputMaybe<PoolMinAggregateFilter>;
  /** Population standard deviation aggregate over matching `Pool` objects. */
  stddevPopulation?: InputMaybe<PoolStddevPopulationAggregateFilter>;
  /** Sample standard deviation aggregate over matching `Pool` objects. */
  stddevSample?: InputMaybe<PoolStddevSampleAggregateFilter>;
  /** Sum aggregate over matching `Pool` objects. */
  sum?: InputMaybe<PoolSumAggregateFilter>;
  /** Population variance aggregate over matching `Pool` objects. */
  variancePopulation?: InputMaybe<PoolVariancePopulationAggregateFilter>;
  /** Sample variance aggregate over matching `Pool` objects. */
  varianceSample?: InputMaybe<PoolVarianceSampleAggregateFilter>;
};

export type PoolAverageAggregateFilter = {
  collectedFeesTokenX?: InputMaybe<BigFloatFilter>;
  collectedFeesTokenY?: InputMaybe<BigFloatFilter>;
  createdAt?: InputMaybe<BigFloatFilter>;
  createdAtBlockNumber?: InputMaybe<BigFloatFilter>;
  currentTick?: InputMaybe<BigFloatFilter>;
  fee?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  tickSpacing?: InputMaybe<BigFloatFilter>;
  totalValueLockedTokenX?: InputMaybe<BigFloatFilter>;
  totalValueLockedTokenY?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  updatedAt?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolAverageAggregates = {
  __typename?: 'PoolAverageAggregates';
  /** Mean average of collectedFeesTokenX across the matching connection */
  collectedFeesTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of collectedFeesTokenY across the matching connection */
  collectedFeesTokenY?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of createdAtBlockNumber across the matching connection */
  createdAtBlockNumber?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of fee across the matching connection */
  fee?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of tickSpacing across the matching connection */
  tickSpacing?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of totalValueLockedTokenX across the matching connection */
  totalValueLockedTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of totalValueLockedTokenY across the matching connection */
  totalValueLockedTokenY?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `PoolDayDatum` values. */
export type PoolDayDataConnection = {
  __typename?: 'PoolDayDataConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<PoolDayDatumAggregates>;
  /** A list of edges which contains the `PoolDayDatum` and cursor to aid in pagination. */
  edges: PoolDayDataEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<PoolDayDatumAggregates[]>;
  /** A list of `PoolDayDatum` objects. */
  nodes: Maybe<PoolDayDatum>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PoolDayDatum` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `PoolDayDatum` values. */
export type PoolDayDataConnectionGroupedAggregatesArgs = {
  groupBy: PoolDayDataGroupBy[];
  having?: InputMaybe<PoolDayDataHavingInput>;
};

/** A `PoolDayDatum` edge in the connection. */
export type PoolDayDataEdge = {
  __typename?: 'PoolDayDataEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `PoolDayDatum` at the end of the edge. */
  node?: Maybe<PoolDayDatum>;
};

/** Grouping methods for `PoolDayDatum` for usage during aggregation. */
export enum PoolDayDataGroupBy {
  CurrentTick = 'CURRENT_TICK',
  DayIndex = 'DAY_INDEX',
  FeesUSD = 'FEES_U_S_D',
  Id = 'ID',
  Liquidity = 'LIQUIDITY',
  PoolId = 'POOL_ID',
  SqrtPrice = 'SQRT_PRICE',
  TvlUSD = 'TVL_U_S_D',
  TxCount = 'TX_COUNT',
  VolumeTokenX = 'VOLUME_TOKEN_X',
  VolumeTokenY = 'VOLUME_TOKEN_Y',
  VolumeUSD = 'VOLUME_U_S_D'
}

export type PoolDayDataHavingAverageInput = {
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  dayIndex?: InputMaybe<HavingIntFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolDayDataHavingDistinctCountInput = {
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  dayIndex?: InputMaybe<HavingIntFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

/** Conditions for `PoolDayDatum` aggregates. */
export type PoolDayDataHavingInput = {
  AND?: InputMaybe<PoolDayDataHavingInput[]>;
  OR?: InputMaybe<PoolDayDataHavingInput[]>;
  average?: InputMaybe<PoolDayDataHavingAverageInput>;
  distinctCount?: InputMaybe<PoolDayDataHavingDistinctCountInput>;
  max?: InputMaybe<PoolDayDataHavingMaxInput>;
  min?: InputMaybe<PoolDayDataHavingMinInput>;
  stddevPopulation?: InputMaybe<PoolDayDataHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<PoolDayDataHavingStddevSampleInput>;
  sum?: InputMaybe<PoolDayDataHavingSumInput>;
  variancePopulation?: InputMaybe<PoolDayDataHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<PoolDayDataHavingVarianceSampleInput>;
};

export type PoolDayDataHavingMaxInput = {
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  dayIndex?: InputMaybe<HavingIntFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolDayDataHavingMinInput = {
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  dayIndex?: InputMaybe<HavingIntFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolDayDataHavingStddevPopulationInput = {
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  dayIndex?: InputMaybe<HavingIntFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolDayDataHavingStddevSampleInput = {
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  dayIndex?: InputMaybe<HavingIntFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolDayDataHavingSumInput = {
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  dayIndex?: InputMaybe<HavingIntFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolDayDataHavingVariancePopulationInput = {
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  dayIndex?: InputMaybe<HavingIntFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolDayDataHavingVarianceSampleInput = {
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  dayIndex?: InputMaybe<HavingIntFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

/** Methods to use when ordering `PoolDayDatum`. */
export enum PoolDayDataOrderBy {
  CurrentTickAsc = 'CURRENT_TICK_ASC',
  CurrentTickDesc = 'CURRENT_TICK_DESC',
  DayIndexAsc = 'DAY_INDEX_ASC',
  DayIndexDesc = 'DAY_INDEX_DESC',
  FeesUSDAsc = 'FEES_U_S_D_ASC',
  FeesUSDDesc = 'FEES_U_S_D_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  LiquidityAsc = 'LIQUIDITY_ASC',
  LiquidityDesc = 'LIQUIDITY_DESC',
  Natural = 'NATURAL',
  PoolIdAsc = 'POOL_ID_ASC',
  PoolIdDesc = 'POOL_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SqrtPriceAsc = 'SQRT_PRICE_ASC',
  SqrtPriceDesc = 'SQRT_PRICE_DESC',
  TvlUSDAsc = 'TVL_U_S_D_ASC',
  TvlUSDDesc = 'TVL_U_S_D_DESC',
  TxCountAsc = 'TX_COUNT_ASC',
  TxCountDesc = 'TX_COUNT_DESC',
  VolumeTokenXAsc = 'VOLUME_TOKEN_X_ASC',
  VolumeTokenXDesc = 'VOLUME_TOKEN_X_DESC',
  VolumeTokenYAsc = 'VOLUME_TOKEN_Y_ASC',
  VolumeTokenYDesc = 'VOLUME_TOKEN_Y_DESC',
  VolumeUSDAsc = 'VOLUME_U_S_D_ASC',
  VolumeUSDDesc = 'VOLUME_U_S_D_DESC'
}

export type PoolDayDatum = Node & {
  __typename?: 'PoolDayDatum';
  currentTick?: Maybe<Scalars['BigFloat']['output']>;
  dayIndex: Scalars['Int']['output'];
  feesUSD: Scalars['String']['output'];
  id: Scalars['String']['output'];
  liquidity: Scalars['BigFloat']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  /** Reads a single `Pool` that is related to this `PoolDayDatum`. */
  pool?: Maybe<Pool>;
  poolId: Scalars['String']['output'];
  sqrtPrice: Scalars['BigFloat']['output'];
  tvlUSD: Scalars['String']['output'];
  txCount: Scalars['BigFloat']['output'];
  volumeTokenX: Scalars['BigFloat']['output'];
  volumeTokenY: Scalars['BigFloat']['output'];
  volumeUSD: Scalars['String']['output'];
};

export type PoolDayDatumAggregates = {
  __typename?: 'PoolDayDatumAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<PoolDayDatumAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<PoolDayDatumDistinctCountAggregates>;
  keys?: Maybe<Scalars['String']['output'][]>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<PoolDayDatumMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<PoolDayDatumMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<PoolDayDatumStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<PoolDayDatumStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<PoolDayDatumSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<PoolDayDatumVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<PoolDayDatumVarianceSampleAggregates>;
};

/** A filter to be used against aggregates of `PoolDayDatum` object types. */
export type PoolDayDatumAggregatesFilter = {
  /** Mean average aggregate over matching `PoolDayDatum` objects. */
  average?: InputMaybe<PoolDayDatumAverageAggregateFilter>;
  /** Distinct count aggregate over matching `PoolDayDatum` objects. */
  distinctCount?: InputMaybe<PoolDayDatumDistinctCountAggregateFilter>;
  /** A filter that must pass for the relevant `PoolDayDatum` object to be included within the aggregate. */
  filter?: InputMaybe<PoolDayDatumFilter>;
  /** Maximum aggregate over matching `PoolDayDatum` objects. */
  max?: InputMaybe<PoolDayDatumMaxAggregateFilter>;
  /** Minimum aggregate over matching `PoolDayDatum` objects. */
  min?: InputMaybe<PoolDayDatumMinAggregateFilter>;
  /** Population standard deviation aggregate over matching `PoolDayDatum` objects. */
  stddevPopulation?: InputMaybe<PoolDayDatumStddevPopulationAggregateFilter>;
  /** Sample standard deviation aggregate over matching `PoolDayDatum` objects. */
  stddevSample?: InputMaybe<PoolDayDatumStddevSampleAggregateFilter>;
  /** Sum aggregate over matching `PoolDayDatum` objects. */
  sum?: InputMaybe<PoolDayDatumSumAggregateFilter>;
  /** Population variance aggregate over matching `PoolDayDatum` objects. */
  variancePopulation?: InputMaybe<PoolDayDatumVariancePopulationAggregateFilter>;
  /** Sample variance aggregate over matching `PoolDayDatum` objects. */
  varianceSample?: InputMaybe<PoolDayDatumVarianceSampleAggregateFilter>;
};

export type PoolDayDatumAverageAggregateFilter = {
  currentTick?: InputMaybe<BigFloatFilter>;
  dayIndex?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolDayDatumAverageAggregates = {
  __typename?: 'PoolDayDatumAverageAggregates';
  /** Mean average of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of dayIndex across the matching connection */
  dayIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolDayDatumDistinctCountAggregateFilter = {
  _blockRange?: InputMaybe<BigIntFilter>;
  _id?: InputMaybe<BigIntFilter>;
  currentTick?: InputMaybe<BigIntFilter>;
  dayIndex?: InputMaybe<BigIntFilter>;
  feesUSD?: InputMaybe<BigIntFilter>;
  id?: InputMaybe<BigIntFilter>;
  liquidity?: InputMaybe<BigIntFilter>;
  poolId?: InputMaybe<BigIntFilter>;
  sqrtPrice?: InputMaybe<BigIntFilter>;
  tvlUSD?: InputMaybe<BigIntFilter>;
  txCount?: InputMaybe<BigIntFilter>;
  volumeTokenX?: InputMaybe<BigIntFilter>;
  volumeTokenY?: InputMaybe<BigIntFilter>;
  volumeUSD?: InputMaybe<BigIntFilter>;
};

export type PoolDayDatumDistinctCountAggregates = {
  __typename?: 'PoolDayDatumDistinctCountAggregates';
  /** Distinct count of _blockRange across the matching connection */
  _blockRange?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of _id across the matching connection */
  _id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of dayIndex across the matching connection */
  dayIndex?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of feesUSD across the matching connection */
  feesUSD?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of tvlUSD across the matching connection */
  tvlUSD?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of volumeUSD across the matching connection */
  volumeUSD?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `PoolDayDatum` object types. All fields are combined with a logical ‘and.’ */
export type PoolDayDatumFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<PoolDayDatumFilter[]>;
  /** Filter by the object’s `currentTick` field. */
  currentTick?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `dayIndex` field. */
  dayIndex?: InputMaybe<IntFilter>;
  /** Filter by the object’s `feesUSD` field. */
  feesUSD?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Filter by the object’s `liquidity` field. */
  liquidity?: InputMaybe<BigFloatFilter>;
  /** Negates the expression. */
  not?: InputMaybe<PoolDayDatumFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<PoolDayDatumFilter[]>;
  /** Filter by the object’s `pool` relation. */
  pool?: InputMaybe<PoolFilter>;
  /** Filter by the object’s `poolId` field. */
  poolId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sqrtPrice` field. */
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `tvlUSD` field. */
  tvlUSD?: InputMaybe<StringFilter>;
  /** Filter by the object’s `txCount` field. */
  txCount?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `volumeTokenX` field. */
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `volumeTokenY` field. */
  volumeTokenY?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `volumeUSD` field. */
  volumeUSD?: InputMaybe<StringFilter>;
};

export type PoolDayDatumMaxAggregateFilter = {
  currentTick?: InputMaybe<BigFloatFilter>;
  dayIndex?: InputMaybe<IntFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolDayDatumMaxAggregates = {
  __typename?: 'PoolDayDatumMaxAggregates';
  /** Maximum of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of dayIndex across the matching connection */
  dayIndex?: Maybe<Scalars['Int']['output']>;
  /** Maximum of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolDayDatumMinAggregateFilter = {
  currentTick?: InputMaybe<BigFloatFilter>;
  dayIndex?: InputMaybe<IntFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolDayDatumMinAggregates = {
  __typename?: 'PoolDayDatumMinAggregates';
  /** Minimum of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of dayIndex across the matching connection */
  dayIndex?: Maybe<Scalars['Int']['output']>;
  /** Minimum of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolDayDatumStddevPopulationAggregateFilter = {
  currentTick?: InputMaybe<BigFloatFilter>;
  dayIndex?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolDayDatumStddevPopulationAggregates = {
  __typename?: 'PoolDayDatumStddevPopulationAggregates';
  /** Population standard deviation of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of dayIndex across the matching connection */
  dayIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolDayDatumStddevSampleAggregateFilter = {
  currentTick?: InputMaybe<BigFloatFilter>;
  dayIndex?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolDayDatumStddevSampleAggregates = {
  __typename?: 'PoolDayDatumStddevSampleAggregates';
  /** Sample standard deviation of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of dayIndex across the matching connection */
  dayIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolDayDatumSumAggregateFilter = {
  currentTick?: InputMaybe<BigFloatFilter>;
  dayIndex?: InputMaybe<BigIntFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolDayDatumSumAggregates = {
  __typename?: 'PoolDayDatumSumAggregates';
  /** Sum of currentTick across the matching connection */
  currentTick: Scalars['BigFloat']['output'];
  /** Sum of dayIndex across the matching connection */
  dayIndex: Scalars['BigInt']['output'];
  /** Sum of liquidity across the matching connection */
  liquidity: Scalars['BigFloat']['output'];
  /** Sum of sqrtPrice across the matching connection */
  sqrtPrice: Scalars['BigFloat']['output'];
  /** Sum of txCount across the matching connection */
  txCount: Scalars['BigFloat']['output'];
  /** Sum of volumeTokenX across the matching connection */
  volumeTokenX: Scalars['BigFloat']['output'];
  /** Sum of volumeTokenY across the matching connection */
  volumeTokenY: Scalars['BigFloat']['output'];
};

export type PoolDayDatumVariancePopulationAggregateFilter = {
  currentTick?: InputMaybe<BigFloatFilter>;
  dayIndex?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolDayDatumVariancePopulationAggregates = {
  __typename?: 'PoolDayDatumVariancePopulationAggregates';
  /** Population variance of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of dayIndex across the matching connection */
  dayIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolDayDatumVarianceSampleAggregateFilter = {
  currentTick?: InputMaybe<BigFloatFilter>;
  dayIndex?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolDayDatumVarianceSampleAggregates = {
  __typename?: 'PoolDayDatumVarianceSampleAggregates';
  /** Sample variance of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of dayIndex across the matching connection */
  dayIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolDistinctCountAggregateFilter = {
  _blockRange?: InputMaybe<BigIntFilter>;
  _id?: InputMaybe<BigIntFilter>;
  collectedFeesTokenX?: InputMaybe<BigIntFilter>;
  collectedFeesTokenY?: InputMaybe<BigIntFilter>;
  collectedFeesUSD?: InputMaybe<BigIntFilter>;
  createdAt?: InputMaybe<BigIntFilter>;
  createdAtBlockNumber?: InputMaybe<BigIntFilter>;
  currentTick?: InputMaybe<BigIntFilter>;
  fee?: InputMaybe<BigIntFilter>;
  feesUSD?: InputMaybe<BigIntFilter>;
  id?: InputMaybe<BigIntFilter>;
  liquidity?: InputMaybe<BigIntFilter>;
  poolCreatorId?: InputMaybe<BigIntFilter>;
  sqrtPrice?: InputMaybe<BigIntFilter>;
  tickSpacing?: InputMaybe<BigIntFilter>;
  tokenXId?: InputMaybe<BigIntFilter>;
  tokenYId?: InputMaybe<BigIntFilter>;
  totalValueLockedTokenX?: InputMaybe<BigIntFilter>;
  totalValueLockedTokenY?: InputMaybe<BigIntFilter>;
  totalValueLockedUSD?: InputMaybe<BigIntFilter>;
  transactionId?: InputMaybe<BigIntFilter>;
  txCount?: InputMaybe<BigIntFilter>;
  updatedAt?: InputMaybe<BigIntFilter>;
  volumeTokenX?: InputMaybe<BigIntFilter>;
  volumeTokenY?: InputMaybe<BigIntFilter>;
  volumeUSD?: InputMaybe<BigIntFilter>;
};

export type PoolDistinctCountAggregates = {
  __typename?: 'PoolDistinctCountAggregates';
  /** Distinct count of _blockRange across the matching connection */
  _blockRange?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of _id across the matching connection */
  _id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of collectedFeesTokenX across the matching connection */
  collectedFeesTokenX?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of collectedFeesTokenY across the matching connection */
  collectedFeesTokenY?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of collectedFeesUSD across the matching connection */
  collectedFeesUSD?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of createdAtBlockNumber across the matching connection */
  createdAtBlockNumber?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of fee across the matching connection */
  fee?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of feesUSD across the matching connection */
  feesUSD?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolCreatorId across the matching connection */
  poolCreatorId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of tickSpacing across the matching connection */
  tickSpacing?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of tokenXId across the matching connection */
  tokenXId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of tokenYId across the matching connection */
  tokenYId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of totalValueLockedTokenX across the matching connection */
  totalValueLockedTokenX?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of totalValueLockedTokenY across the matching connection */
  totalValueLockedTokenY?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of totalValueLockedUSD across the matching connection */
  totalValueLockedUSD?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of transactionId across the matching connection */
  transactionId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of volumeUSD across the matching connection */
  volumeUSD?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `Pool` object types. All fields are combined with a logical ‘and.’ */
export type PoolFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<PoolFilter[]>;
  /** Filter by the object’s `claimFees` relation. */
  claimFees?: InputMaybe<PoolToManyClaimFeeFilter>;
  /** Some related `claimFees` exist. */
  claimFeesExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `collectedFeesTokenX` field. */
  collectedFeesTokenX?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `collectedFeesTokenY` field. */
  collectedFeesTokenY?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `collectedFeesUSD` field. */
  collectedFeesUSD?: InputMaybe<StringFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `createdAtBlockNumber` field. */
  createdAtBlockNumber?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `currentTick` field. */
  currentTick?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `fee` field. */
  fee?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `feesUSD` field. */
  feesUSD?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Filter by the object’s `liquidity` field. */
  liquidity?: InputMaybe<BigFloatFilter>;
  /** Negates the expression. */
  not?: InputMaybe<PoolFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<PoolFilter[]>;
  /** Filter by the object’s `poolCreator` relation. */
  poolCreator?: InputMaybe<AccountFilter>;
  /** A related `poolCreator` exists. */
  poolCreatorExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `poolCreatorId` field. */
  poolCreatorId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `poolDayData` relation. */
  poolDayData?: InputMaybe<PoolToManyPoolDayDatumFilter>;
  /** Some related `poolDayData` exist. */
  poolDayDataExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `poolHourData` relation. */
  poolHourData?: InputMaybe<PoolToManyPoolHourDatumFilter>;
  /** Some related `poolHourData` exist. */
  poolHourDataExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `poolTokenIncentives` relation. */
  poolTokenIncentives?: InputMaybe<PoolToManyPoolTokenIncentiveFilter>;
  /** Some related `poolTokenIncentives` exist. */
  poolTokenIncentivesExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `positions` relation. */
  positions?: InputMaybe<PoolToManyPositionFilter>;
  /** Some related `positions` exist. */
  positionsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `sqrtPrice` field. */
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `swaps` relation. */
  swaps?: InputMaybe<PoolToManySwapRouteFilter>;
  /** Some related `swaps` exist. */
  swapsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `tickSpacing` field. */
  tickSpacing?: InputMaybe<IntFilter>;
  /** Filter by the object’s `tokenX` relation. */
  tokenX?: InputMaybe<TokenFilter>;
  /** Filter by the object’s `tokenXId` field. */
  tokenXId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `tokenY` relation. */
  tokenY?: InputMaybe<TokenFilter>;
  /** Filter by the object’s `tokenYId` field. */
  tokenYId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `totalValueLockedTokenX` field. */
  totalValueLockedTokenX?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `totalValueLockedTokenY` field. */
  totalValueLockedTokenY?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `totalValueLockedUSD` field. */
  totalValueLockedUSD?: InputMaybe<StringFilter>;
  /** Filter by the object’s `transaction` relation. */
  transaction?: InputMaybe<TransactionFilter>;
  /** A related `transaction` exists. */
  transactionExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `transactionId` field. */
  transactionId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `txCount` field. */
  txCount?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `volumeTokenX` field. */
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `volumeTokenY` field. */
  volumeTokenY?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `volumeUSD` field. */
  volumeUSD?: InputMaybe<StringFilter>;
};

/** A connection to a list of `PoolHourDatum` values. */
export type PoolHourDataConnection = {
  __typename?: 'PoolHourDataConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<PoolHourDatumAggregates>;
  /** A list of edges which contains the `PoolHourDatum` and cursor to aid in pagination. */
  edges: PoolHourDataEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<PoolHourDatumAggregates[]>;
  /** A list of `PoolHourDatum` objects. */
  nodes: Maybe<PoolHourDatum>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PoolHourDatum` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `PoolHourDatum` values. */
export type PoolHourDataConnectionGroupedAggregatesArgs = {
  groupBy: PoolHourDataGroupBy[];
  having?: InputMaybe<PoolHourDataHavingInput>;
};

/** A `PoolHourDatum` edge in the connection. */
export type PoolHourDataEdge = {
  __typename?: 'PoolHourDataEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `PoolHourDatum` at the end of the edge. */
  node?: Maybe<PoolHourDatum>;
};

/** Grouping methods for `PoolHourDatum` for usage during aggregation. */
export enum PoolHourDataGroupBy {
  CurrentTick = 'CURRENT_TICK',
  FeesUSD = 'FEES_U_S_D',
  HourIndex = 'HOUR_INDEX',
  Id = 'ID',
  Liquidity = 'LIQUIDITY',
  PoolId = 'POOL_ID',
  SqrtPrice = 'SQRT_PRICE',
  TvlUSD = 'TVL_U_S_D',
  TxCount = 'TX_COUNT',
  VolumeTokenX = 'VOLUME_TOKEN_X',
  VolumeTokenY = 'VOLUME_TOKEN_Y',
  VolumeUSD = 'VOLUME_U_S_D'
}

export type PoolHourDataHavingAverageInput = {
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  hourIndex?: InputMaybe<HavingIntFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolHourDataHavingDistinctCountInput = {
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  hourIndex?: InputMaybe<HavingIntFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

/** Conditions for `PoolHourDatum` aggregates. */
export type PoolHourDataHavingInput = {
  AND?: InputMaybe<PoolHourDataHavingInput[]>;
  OR?: InputMaybe<PoolHourDataHavingInput[]>;
  average?: InputMaybe<PoolHourDataHavingAverageInput>;
  distinctCount?: InputMaybe<PoolHourDataHavingDistinctCountInput>;
  max?: InputMaybe<PoolHourDataHavingMaxInput>;
  min?: InputMaybe<PoolHourDataHavingMinInput>;
  stddevPopulation?: InputMaybe<PoolHourDataHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<PoolHourDataHavingStddevSampleInput>;
  sum?: InputMaybe<PoolHourDataHavingSumInput>;
  variancePopulation?: InputMaybe<PoolHourDataHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<PoolHourDataHavingVarianceSampleInput>;
};

export type PoolHourDataHavingMaxInput = {
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  hourIndex?: InputMaybe<HavingIntFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolHourDataHavingMinInput = {
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  hourIndex?: InputMaybe<HavingIntFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolHourDataHavingStddevPopulationInput = {
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  hourIndex?: InputMaybe<HavingIntFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolHourDataHavingStddevSampleInput = {
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  hourIndex?: InputMaybe<HavingIntFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolHourDataHavingSumInput = {
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  hourIndex?: InputMaybe<HavingIntFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolHourDataHavingVariancePopulationInput = {
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  hourIndex?: InputMaybe<HavingIntFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolHourDataHavingVarianceSampleInput = {
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  hourIndex?: InputMaybe<HavingIntFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

/** Methods to use when ordering `PoolHourDatum`. */
export enum PoolHourDataOrderBy {
  CurrentTickAsc = 'CURRENT_TICK_ASC',
  CurrentTickDesc = 'CURRENT_TICK_DESC',
  FeesUSDAsc = 'FEES_U_S_D_ASC',
  FeesUSDDesc = 'FEES_U_S_D_DESC',
  HourIndexAsc = 'HOUR_INDEX_ASC',
  HourIndexDesc = 'HOUR_INDEX_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  LiquidityAsc = 'LIQUIDITY_ASC',
  LiquidityDesc = 'LIQUIDITY_DESC',
  Natural = 'NATURAL',
  PoolIdAsc = 'POOL_ID_ASC',
  PoolIdDesc = 'POOL_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SqrtPriceAsc = 'SQRT_PRICE_ASC',
  SqrtPriceDesc = 'SQRT_PRICE_DESC',
  TvlUSDAsc = 'TVL_U_S_D_ASC',
  TvlUSDDesc = 'TVL_U_S_D_DESC',
  TxCountAsc = 'TX_COUNT_ASC',
  TxCountDesc = 'TX_COUNT_DESC',
  VolumeTokenXAsc = 'VOLUME_TOKEN_X_ASC',
  VolumeTokenXDesc = 'VOLUME_TOKEN_X_DESC',
  VolumeTokenYAsc = 'VOLUME_TOKEN_Y_ASC',
  VolumeTokenYDesc = 'VOLUME_TOKEN_Y_DESC',
  VolumeUSDAsc = 'VOLUME_U_S_D_ASC',
  VolumeUSDDesc = 'VOLUME_U_S_D_DESC'
}

export type PoolHourDatum = Node & {
  __typename?: 'PoolHourDatum';
  currentTick?: Maybe<Scalars['BigFloat']['output']>;
  feesUSD: Scalars['String']['output'];
  hourIndex: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  liquidity: Scalars['BigFloat']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  /** Reads a single `Pool` that is related to this `PoolHourDatum`. */
  pool?: Maybe<Pool>;
  poolId: Scalars['String']['output'];
  sqrtPrice: Scalars['BigFloat']['output'];
  tvlUSD: Scalars['String']['output'];
  txCount: Scalars['BigFloat']['output'];
  volumeTokenX: Scalars['BigFloat']['output'];
  volumeTokenY: Scalars['BigFloat']['output'];
  volumeUSD: Scalars['String']['output'];
};

export type PoolHourDatumAggregates = {
  __typename?: 'PoolHourDatumAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<PoolHourDatumAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<PoolHourDatumDistinctCountAggregates>;
  keys?: Maybe<Scalars['String']['output'][]>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<PoolHourDatumMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<PoolHourDatumMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<PoolHourDatumStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<PoolHourDatumStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<PoolHourDatumSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<PoolHourDatumVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<PoolHourDatumVarianceSampleAggregates>;
};

/** A filter to be used against aggregates of `PoolHourDatum` object types. */
export type PoolHourDatumAggregatesFilter = {
  /** Mean average aggregate over matching `PoolHourDatum` objects. */
  average?: InputMaybe<PoolHourDatumAverageAggregateFilter>;
  /** Distinct count aggregate over matching `PoolHourDatum` objects. */
  distinctCount?: InputMaybe<PoolHourDatumDistinctCountAggregateFilter>;
  /** A filter that must pass for the relevant `PoolHourDatum` object to be included within the aggregate. */
  filter?: InputMaybe<PoolHourDatumFilter>;
  /** Maximum aggregate over matching `PoolHourDatum` objects. */
  max?: InputMaybe<PoolHourDatumMaxAggregateFilter>;
  /** Minimum aggregate over matching `PoolHourDatum` objects. */
  min?: InputMaybe<PoolHourDatumMinAggregateFilter>;
  /** Population standard deviation aggregate over matching `PoolHourDatum` objects. */
  stddevPopulation?: InputMaybe<PoolHourDatumStddevPopulationAggregateFilter>;
  /** Sample standard deviation aggregate over matching `PoolHourDatum` objects. */
  stddevSample?: InputMaybe<PoolHourDatumStddevSampleAggregateFilter>;
  /** Sum aggregate over matching `PoolHourDatum` objects. */
  sum?: InputMaybe<PoolHourDatumSumAggregateFilter>;
  /** Population variance aggregate over matching `PoolHourDatum` objects. */
  variancePopulation?: InputMaybe<PoolHourDatumVariancePopulationAggregateFilter>;
  /** Sample variance aggregate over matching `PoolHourDatum` objects. */
  varianceSample?: InputMaybe<PoolHourDatumVarianceSampleAggregateFilter>;
};

export type PoolHourDatumAverageAggregateFilter = {
  currentTick?: InputMaybe<BigFloatFilter>;
  hourIndex?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolHourDatumAverageAggregates = {
  __typename?: 'PoolHourDatumAverageAggregates';
  /** Mean average of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of hourIndex across the matching connection */
  hourIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolHourDatumDistinctCountAggregateFilter = {
  _blockRange?: InputMaybe<BigIntFilter>;
  _id?: InputMaybe<BigIntFilter>;
  currentTick?: InputMaybe<BigIntFilter>;
  feesUSD?: InputMaybe<BigIntFilter>;
  hourIndex?: InputMaybe<BigIntFilter>;
  id?: InputMaybe<BigIntFilter>;
  liquidity?: InputMaybe<BigIntFilter>;
  poolId?: InputMaybe<BigIntFilter>;
  sqrtPrice?: InputMaybe<BigIntFilter>;
  tvlUSD?: InputMaybe<BigIntFilter>;
  txCount?: InputMaybe<BigIntFilter>;
  volumeTokenX?: InputMaybe<BigIntFilter>;
  volumeTokenY?: InputMaybe<BigIntFilter>;
  volumeUSD?: InputMaybe<BigIntFilter>;
};

export type PoolHourDatumDistinctCountAggregates = {
  __typename?: 'PoolHourDatumDistinctCountAggregates';
  /** Distinct count of _blockRange across the matching connection */
  _blockRange?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of _id across the matching connection */
  _id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of feesUSD across the matching connection */
  feesUSD?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of hourIndex across the matching connection */
  hourIndex?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of tvlUSD across the matching connection */
  tvlUSD?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of volumeUSD across the matching connection */
  volumeUSD?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `PoolHourDatum` object types. All fields are combined with a logical ‘and.’ */
export type PoolHourDatumFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<PoolHourDatumFilter[]>;
  /** Filter by the object’s `currentTick` field. */
  currentTick?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `feesUSD` field. */
  feesUSD?: InputMaybe<StringFilter>;
  /** Filter by the object’s `hourIndex` field. */
  hourIndex?: InputMaybe<IntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Filter by the object’s `liquidity` field. */
  liquidity?: InputMaybe<BigFloatFilter>;
  /** Negates the expression. */
  not?: InputMaybe<PoolHourDatumFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<PoolHourDatumFilter[]>;
  /** Filter by the object’s `pool` relation. */
  pool?: InputMaybe<PoolFilter>;
  /** Filter by the object’s `poolId` field. */
  poolId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sqrtPrice` field. */
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `tvlUSD` field. */
  tvlUSD?: InputMaybe<StringFilter>;
  /** Filter by the object’s `txCount` field. */
  txCount?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `volumeTokenX` field. */
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `volumeTokenY` field. */
  volumeTokenY?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `volumeUSD` field. */
  volumeUSD?: InputMaybe<StringFilter>;
};

export type PoolHourDatumMaxAggregateFilter = {
  currentTick?: InputMaybe<BigFloatFilter>;
  hourIndex?: InputMaybe<IntFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolHourDatumMaxAggregates = {
  __typename?: 'PoolHourDatumMaxAggregates';
  /** Maximum of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of hourIndex across the matching connection */
  hourIndex?: Maybe<Scalars['Int']['output']>;
  /** Maximum of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolHourDatumMinAggregateFilter = {
  currentTick?: InputMaybe<BigFloatFilter>;
  hourIndex?: InputMaybe<IntFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolHourDatumMinAggregates = {
  __typename?: 'PoolHourDatumMinAggregates';
  /** Minimum of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of hourIndex across the matching connection */
  hourIndex?: Maybe<Scalars['Int']['output']>;
  /** Minimum of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolHourDatumStddevPopulationAggregateFilter = {
  currentTick?: InputMaybe<BigFloatFilter>;
  hourIndex?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolHourDatumStddevPopulationAggregates = {
  __typename?: 'PoolHourDatumStddevPopulationAggregates';
  /** Population standard deviation of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of hourIndex across the matching connection */
  hourIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolHourDatumStddevSampleAggregateFilter = {
  currentTick?: InputMaybe<BigFloatFilter>;
  hourIndex?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolHourDatumStddevSampleAggregates = {
  __typename?: 'PoolHourDatumStddevSampleAggregates';
  /** Sample standard deviation of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of hourIndex across the matching connection */
  hourIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolHourDatumSumAggregateFilter = {
  currentTick?: InputMaybe<BigFloatFilter>;
  hourIndex?: InputMaybe<BigIntFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolHourDatumSumAggregates = {
  __typename?: 'PoolHourDatumSumAggregates';
  /** Sum of currentTick across the matching connection */
  currentTick: Scalars['BigFloat']['output'];
  /** Sum of hourIndex across the matching connection */
  hourIndex: Scalars['BigInt']['output'];
  /** Sum of liquidity across the matching connection */
  liquidity: Scalars['BigFloat']['output'];
  /** Sum of sqrtPrice across the matching connection */
  sqrtPrice: Scalars['BigFloat']['output'];
  /** Sum of txCount across the matching connection */
  txCount: Scalars['BigFloat']['output'];
  /** Sum of volumeTokenX across the matching connection */
  volumeTokenX: Scalars['BigFloat']['output'];
  /** Sum of volumeTokenY across the matching connection */
  volumeTokenY: Scalars['BigFloat']['output'];
};

export type PoolHourDatumVariancePopulationAggregateFilter = {
  currentTick?: InputMaybe<BigFloatFilter>;
  hourIndex?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolHourDatumVariancePopulationAggregates = {
  __typename?: 'PoolHourDatumVariancePopulationAggregates';
  /** Population variance of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of hourIndex across the matching connection */
  hourIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolHourDatumVarianceSampleAggregateFilter = {
  currentTick?: InputMaybe<BigFloatFilter>;
  hourIndex?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolHourDatumVarianceSampleAggregates = {
  __typename?: 'PoolHourDatumVarianceSampleAggregates';
  /** Sample variance of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of hourIndex across the matching connection */
  hourIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolMaxAggregateFilter = {
  collectedFeesTokenX?: InputMaybe<BigFloatFilter>;
  collectedFeesTokenY?: InputMaybe<BigFloatFilter>;
  createdAt?: InputMaybe<BigFloatFilter>;
  createdAtBlockNumber?: InputMaybe<BigFloatFilter>;
  currentTick?: InputMaybe<BigFloatFilter>;
  fee?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  tickSpacing?: InputMaybe<IntFilter>;
  totalValueLockedTokenX?: InputMaybe<BigFloatFilter>;
  totalValueLockedTokenY?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  updatedAt?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolMaxAggregates = {
  __typename?: 'PoolMaxAggregates';
  /** Maximum of collectedFeesTokenX across the matching connection */
  collectedFeesTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of collectedFeesTokenY across the matching connection */
  collectedFeesTokenY?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of createdAtBlockNumber across the matching connection */
  createdAtBlockNumber?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of fee across the matching connection */
  fee?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of tickSpacing across the matching connection */
  tickSpacing?: Maybe<Scalars['Int']['output']>;
  /** Maximum of totalValueLockedTokenX across the matching connection */
  totalValueLockedTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of totalValueLockedTokenY across the matching connection */
  totalValueLockedTokenY?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolMinAggregateFilter = {
  collectedFeesTokenX?: InputMaybe<BigFloatFilter>;
  collectedFeesTokenY?: InputMaybe<BigFloatFilter>;
  createdAt?: InputMaybe<BigFloatFilter>;
  createdAtBlockNumber?: InputMaybe<BigFloatFilter>;
  currentTick?: InputMaybe<BigFloatFilter>;
  fee?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  tickSpacing?: InputMaybe<IntFilter>;
  totalValueLockedTokenX?: InputMaybe<BigFloatFilter>;
  totalValueLockedTokenY?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  updatedAt?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolMinAggregates = {
  __typename?: 'PoolMinAggregates';
  /** Minimum of collectedFeesTokenX across the matching connection */
  collectedFeesTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of collectedFeesTokenY across the matching connection */
  collectedFeesTokenY?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of createdAtBlockNumber across the matching connection */
  createdAtBlockNumber?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of fee across the matching connection */
  fee?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of tickSpacing across the matching connection */
  tickSpacing?: Maybe<Scalars['Int']['output']>;
  /** Minimum of totalValueLockedTokenX across the matching connection */
  totalValueLockedTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of totalValueLockedTokenY across the matching connection */
  totalValueLockedTokenY?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `Position` values, with data from `ClaimFee`. */
export type PoolPositionsByClaimFeePoolIdAndPositionIdManyToManyConnection = {
  __typename?: 'PoolPositionsByClaimFeePoolIdAndPositionIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<PositionAggregates>;
  /** A list of edges which contains the `Position`, info from the `ClaimFee`, and the cursor to aid in pagination. */
  edges: PoolPositionsByClaimFeePoolIdAndPositionIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<PositionAggregates[]>;
  /** A list of `Position` objects. */
  nodes: Maybe<Position>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Position` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Position` values, with data from `ClaimFee`. */
export type PoolPositionsByClaimFeePoolIdAndPositionIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: PositionsGroupBy[];
  having?: InputMaybe<PositionsHavingInput>;
};

/** A `Position` edge in the connection, with data from `ClaimFee`. */
export type PoolPositionsByClaimFeePoolIdAndPositionIdManyToManyEdge = {
  __typename?: 'PoolPositionsByClaimFeePoolIdAndPositionIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** Reads and enables pagination through a set of `ClaimFee`. */
  fees: ClaimFeesConnection;
  /** The `Position` at the end of the edge. */
  node?: Maybe<Position>;
};


/** A `Position` edge in the connection, with data from `ClaimFee`. */
export type PoolPositionsByClaimFeePoolIdAndPositionIdManyToManyEdgeFeesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Claim_Fees_Distinct_Enum>[]>;
  filter?: InputMaybe<ClaimFeeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimFeesOrderBy[]>;
};

export type PoolStddevPopulationAggregateFilter = {
  collectedFeesTokenX?: InputMaybe<BigFloatFilter>;
  collectedFeesTokenY?: InputMaybe<BigFloatFilter>;
  createdAt?: InputMaybe<BigFloatFilter>;
  createdAtBlockNumber?: InputMaybe<BigFloatFilter>;
  currentTick?: InputMaybe<BigFloatFilter>;
  fee?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  tickSpacing?: InputMaybe<BigFloatFilter>;
  totalValueLockedTokenX?: InputMaybe<BigFloatFilter>;
  totalValueLockedTokenY?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  updatedAt?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolStddevPopulationAggregates = {
  __typename?: 'PoolStddevPopulationAggregates';
  /** Population standard deviation of collectedFeesTokenX across the matching connection */
  collectedFeesTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of collectedFeesTokenY across the matching connection */
  collectedFeesTokenY?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of createdAtBlockNumber across the matching connection */
  createdAtBlockNumber?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of fee across the matching connection */
  fee?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of tickSpacing across the matching connection */
  tickSpacing?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of totalValueLockedTokenX across the matching connection */
  totalValueLockedTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of totalValueLockedTokenY across the matching connection */
  totalValueLockedTokenY?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolStddevSampleAggregateFilter = {
  collectedFeesTokenX?: InputMaybe<BigFloatFilter>;
  collectedFeesTokenY?: InputMaybe<BigFloatFilter>;
  createdAt?: InputMaybe<BigFloatFilter>;
  createdAtBlockNumber?: InputMaybe<BigFloatFilter>;
  currentTick?: InputMaybe<BigFloatFilter>;
  fee?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  tickSpacing?: InputMaybe<BigFloatFilter>;
  totalValueLockedTokenX?: InputMaybe<BigFloatFilter>;
  totalValueLockedTokenY?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  updatedAt?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolStddevSampleAggregates = {
  __typename?: 'PoolStddevSampleAggregates';
  /** Sample standard deviation of collectedFeesTokenX across the matching connection */
  collectedFeesTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of collectedFeesTokenY across the matching connection */
  collectedFeesTokenY?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of createdAtBlockNumber across the matching connection */
  createdAtBlockNumber?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of fee across the matching connection */
  fee?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of tickSpacing across the matching connection */
  tickSpacing?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of totalValueLockedTokenX across the matching connection */
  totalValueLockedTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of totalValueLockedTokenY across the matching connection */
  totalValueLockedTokenY?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolSumAggregateFilter = {
  collectedFeesTokenX?: InputMaybe<BigFloatFilter>;
  collectedFeesTokenY?: InputMaybe<BigFloatFilter>;
  createdAt?: InputMaybe<BigFloatFilter>;
  createdAtBlockNumber?: InputMaybe<BigFloatFilter>;
  currentTick?: InputMaybe<BigFloatFilter>;
  fee?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  tickSpacing?: InputMaybe<BigIntFilter>;
  totalValueLockedTokenX?: InputMaybe<BigFloatFilter>;
  totalValueLockedTokenY?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  updatedAt?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolSumAggregates = {
  __typename?: 'PoolSumAggregates';
  /** Sum of collectedFeesTokenX across the matching connection */
  collectedFeesTokenX: Scalars['BigFloat']['output'];
  /** Sum of collectedFeesTokenY across the matching connection */
  collectedFeesTokenY: Scalars['BigFloat']['output'];
  /** Sum of createdAt across the matching connection */
  createdAt: Scalars['BigFloat']['output'];
  /** Sum of createdAtBlockNumber across the matching connection */
  createdAtBlockNumber: Scalars['BigFloat']['output'];
  /** Sum of currentTick across the matching connection */
  currentTick: Scalars['BigFloat']['output'];
  /** Sum of fee across the matching connection */
  fee: Scalars['BigFloat']['output'];
  /** Sum of liquidity across the matching connection */
  liquidity: Scalars['BigFloat']['output'];
  /** Sum of sqrtPrice across the matching connection */
  sqrtPrice: Scalars['BigFloat']['output'];
  /** Sum of tickSpacing across the matching connection */
  tickSpacing: Scalars['BigInt']['output'];
  /** Sum of totalValueLockedTokenX across the matching connection */
  totalValueLockedTokenX: Scalars['BigFloat']['output'];
  /** Sum of totalValueLockedTokenY across the matching connection */
  totalValueLockedTokenY: Scalars['BigFloat']['output'];
  /** Sum of txCount across the matching connection */
  txCount: Scalars['BigFloat']['output'];
  /** Sum of updatedAt across the matching connection */
  updatedAt: Scalars['BigFloat']['output'];
  /** Sum of volumeTokenX across the matching connection */
  volumeTokenX: Scalars['BigFloat']['output'];
  /** Sum of volumeTokenY across the matching connection */
  volumeTokenY: Scalars['BigFloat']['output'];
};

/** A connection to a list of `Swap` values, with data from `SwapRoute`. */
export type PoolSwapsBySwapRoutePoolIdAndSwapIdManyToManyConnection = {
  __typename?: 'PoolSwapsBySwapRoutePoolIdAndSwapIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<SwapAggregates>;
  /** A list of edges which contains the `Swap`, info from the `SwapRoute`, and the cursor to aid in pagination. */
  edges: PoolSwapsBySwapRoutePoolIdAndSwapIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<SwapAggregates[]>;
  /** A list of `Swap` objects. */
  nodes: Maybe<Swap>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Swap` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Swap` values, with data from `SwapRoute`. */
export type PoolSwapsBySwapRoutePoolIdAndSwapIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: SwapsGroupBy[];
  having?: InputMaybe<SwapsHavingInput>;
};

/** A `Swap` edge in the connection, with data from `SwapRoute`. */
export type PoolSwapsBySwapRoutePoolIdAndSwapIdManyToManyEdge = {
  __typename?: 'PoolSwapsBySwapRoutePoolIdAndSwapIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Swap` at the end of the edge. */
  node?: Maybe<Swap>;
  /** Reads and enables pagination through a set of `SwapRoute`. */
  swapRoutes: SwapRoutesConnection;
};


/** A `Swap` edge in the connection, with data from `SwapRoute`. */
export type PoolSwapsBySwapRoutePoolIdAndSwapIdManyToManyEdgeSwapRoutesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Swap_Routes_Distinct_Enum>[]>;
  filter?: InputMaybe<SwapRouteFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapRoutesOrderBy[]>;
};

/** A filter to be used against many `ClaimFee` object types. All fields are combined with a logical ‘and.’ */
export type PoolToManyClaimFeeFilter = {
  /** Aggregates across related `ClaimFee` match the filter criteria. */
  aggregates?: InputMaybe<ClaimFeeAggregatesFilter>;
  /** Every related `ClaimFee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ClaimFeeFilter>;
  /** No related `ClaimFee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ClaimFeeFilter>;
  /** Some related `ClaimFee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ClaimFeeFilter>;
};

/** A filter to be used against many `PoolDayDatum` object types. All fields are combined with a logical ‘and.’ */
export type PoolToManyPoolDayDatumFilter = {
  /** Aggregates across related `PoolDayDatum` match the filter criteria. */
  aggregates?: InputMaybe<PoolDayDatumAggregatesFilter>;
  /** Every related `PoolDayDatum` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<PoolDayDatumFilter>;
  /** No related `PoolDayDatum` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<PoolDayDatumFilter>;
  /** Some related `PoolDayDatum` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<PoolDayDatumFilter>;
};

/** A filter to be used against many `PoolHourDatum` object types. All fields are combined with a logical ‘and.’ */
export type PoolToManyPoolHourDatumFilter = {
  /** Aggregates across related `PoolHourDatum` match the filter criteria. */
  aggregates?: InputMaybe<PoolHourDatumAggregatesFilter>;
  /** Every related `PoolHourDatum` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<PoolHourDatumFilter>;
  /** No related `PoolHourDatum` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<PoolHourDatumFilter>;
  /** Some related `PoolHourDatum` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<PoolHourDatumFilter>;
};

/** A filter to be used against many `PoolTokenIncentive` object types. All fields are combined with a logical ‘and.’ */
export type PoolToManyPoolTokenIncentiveFilter = {
  /** Aggregates across related `PoolTokenIncentive` match the filter criteria. */
  aggregates?: InputMaybe<PoolTokenIncentiveAggregatesFilter>;
  /** Every related `PoolTokenIncentive` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<PoolTokenIncentiveFilter>;
  /** No related `PoolTokenIncentive` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<PoolTokenIncentiveFilter>;
  /** Some related `PoolTokenIncentive` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<PoolTokenIncentiveFilter>;
};

/** A filter to be used against many `Position` object types. All fields are combined with a logical ‘and.’ */
export type PoolToManyPositionFilter = {
  /** Aggregates across related `Position` match the filter criteria. */
  aggregates?: InputMaybe<PositionAggregatesFilter>;
  /** Every related `Position` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<PositionFilter>;
  /** No related `Position` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<PositionFilter>;
  /** Some related `Position` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<PositionFilter>;
};

/** A filter to be used against many `SwapRoute` object types. All fields are combined with a logical ‘and.’ */
export type PoolToManySwapRouteFilter = {
  /** Aggregates across related `SwapRoute` match the filter criteria. */
  aggregates?: InputMaybe<SwapRouteAggregatesFilter>;
  /** Every related `SwapRoute` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SwapRouteFilter>;
  /** No related `SwapRoute` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SwapRouteFilter>;
  /** Some related `SwapRoute` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SwapRouteFilter>;
};

export type PoolTokenIncentive = Node & {
  __typename?: 'PoolTokenIncentive';
  id: Scalars['String']['output'];
  index?: Maybe<Scalars['Int']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  /** Reads a single `Pool` that is related to this `PoolTokenIncentive`. */
  pool?: Maybe<Pool>;
  poolId: Scalars['String']['output'];
  rewardPerSec: Scalars['BigFloat']['output'];
  startTimestamp: Scalars['BigFloat']['output'];
  /** Reads a single `Token` that is related to this `PoolTokenIncentive`. */
  token?: Maybe<Token>;
  tokenId: Scalars['String']['output'];
  totalReward: Scalars['String']['output'];
  /** Reads a single `Transaction` that is related to this `PoolTokenIncentive`. */
  transaction?: Maybe<Transaction>;
  transactionId?: Maybe<Scalars['String']['output']>;
};

export type PoolTokenIncentiveAggregates = {
  __typename?: 'PoolTokenIncentiveAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<PoolTokenIncentiveAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<PoolTokenIncentiveDistinctCountAggregates>;
  keys?: Maybe<Scalars['String']['output'][]>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<PoolTokenIncentiveMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<PoolTokenIncentiveMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<PoolTokenIncentiveStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<PoolTokenIncentiveStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<PoolTokenIncentiveSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<PoolTokenIncentiveVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<PoolTokenIncentiveVarianceSampleAggregates>;
};

/** A filter to be used against aggregates of `PoolTokenIncentive` object types. */
export type PoolTokenIncentiveAggregatesFilter = {
  /** Mean average aggregate over matching `PoolTokenIncentive` objects. */
  average?: InputMaybe<PoolTokenIncentiveAverageAggregateFilter>;
  /** Distinct count aggregate over matching `PoolTokenIncentive` objects. */
  distinctCount?: InputMaybe<PoolTokenIncentiveDistinctCountAggregateFilter>;
  /** A filter that must pass for the relevant `PoolTokenIncentive` object to be included within the aggregate. */
  filter?: InputMaybe<PoolTokenIncentiveFilter>;
  /** Maximum aggregate over matching `PoolTokenIncentive` objects. */
  max?: InputMaybe<PoolTokenIncentiveMaxAggregateFilter>;
  /** Minimum aggregate over matching `PoolTokenIncentive` objects. */
  min?: InputMaybe<PoolTokenIncentiveMinAggregateFilter>;
  /** Population standard deviation aggregate over matching `PoolTokenIncentive` objects. */
  stddevPopulation?: InputMaybe<PoolTokenIncentiveStddevPopulationAggregateFilter>;
  /** Sample standard deviation aggregate over matching `PoolTokenIncentive` objects. */
  stddevSample?: InputMaybe<PoolTokenIncentiveStddevSampleAggregateFilter>;
  /** Sum aggregate over matching `PoolTokenIncentive` objects. */
  sum?: InputMaybe<PoolTokenIncentiveSumAggregateFilter>;
  /** Population variance aggregate over matching `PoolTokenIncentive` objects. */
  variancePopulation?: InputMaybe<PoolTokenIncentiveVariancePopulationAggregateFilter>;
  /** Sample variance aggregate over matching `PoolTokenIncentive` objects. */
  varianceSample?: InputMaybe<PoolTokenIncentiveVarianceSampleAggregateFilter>;
};

export type PoolTokenIncentiveAverageAggregateFilter = {
  index?: InputMaybe<BigFloatFilter>;
  rewardPerSec?: InputMaybe<BigFloatFilter>;
  startTimestamp?: InputMaybe<BigFloatFilter>;
};

export type PoolTokenIncentiveAverageAggregates = {
  __typename?: 'PoolTokenIncentiveAverageAggregates';
  /** Mean average of index across the matching connection */
  index?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of rewardPerSec across the matching connection */
  rewardPerSec?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of startTimestamp across the matching connection */
  startTimestamp?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolTokenIncentiveDistinctCountAggregateFilter = {
  _blockRange?: InputMaybe<BigIntFilter>;
  _id?: InputMaybe<BigIntFilter>;
  id?: InputMaybe<BigIntFilter>;
  index?: InputMaybe<BigIntFilter>;
  poolId?: InputMaybe<BigIntFilter>;
  rewardPerSec?: InputMaybe<BigIntFilter>;
  startTimestamp?: InputMaybe<BigIntFilter>;
  tokenId?: InputMaybe<BigIntFilter>;
  totalReward?: InputMaybe<BigIntFilter>;
  transactionId?: InputMaybe<BigIntFilter>;
};

export type PoolTokenIncentiveDistinctCountAggregates = {
  __typename?: 'PoolTokenIncentiveDistinctCountAggregates';
  /** Distinct count of _blockRange across the matching connection */
  _blockRange?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of _id across the matching connection */
  _id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of index across the matching connection */
  index?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of rewardPerSec across the matching connection */
  rewardPerSec?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of startTimestamp across the matching connection */
  startTimestamp?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of tokenId across the matching connection */
  tokenId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of totalReward across the matching connection */
  totalReward?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of transactionId across the matching connection */
  transactionId?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `PoolTokenIncentive` object types. All fields are combined with a logical ‘and.’ */
export type PoolTokenIncentiveFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<PoolTokenIncentiveFilter[]>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Filter by the object’s `index` field. */
  index?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<PoolTokenIncentiveFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<PoolTokenIncentiveFilter[]>;
  /** Filter by the object’s `pool` relation. */
  pool?: InputMaybe<PoolFilter>;
  /** Filter by the object’s `poolId` field. */
  poolId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `rewardPerSec` field. */
  rewardPerSec?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `startTimestamp` field. */
  startTimestamp?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `token` relation. */
  token?: InputMaybe<TokenFilter>;
  /** Filter by the object’s `tokenId` field. */
  tokenId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `totalReward` field. */
  totalReward?: InputMaybe<StringFilter>;
  /** Filter by the object’s `transaction` relation. */
  transaction?: InputMaybe<TransactionFilter>;
  /** A related `transaction` exists. */
  transactionExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `transactionId` field. */
  transactionId?: InputMaybe<StringFilter>;
};

export type PoolTokenIncentiveMaxAggregateFilter = {
  index?: InputMaybe<IntFilter>;
  rewardPerSec?: InputMaybe<BigFloatFilter>;
  startTimestamp?: InputMaybe<BigFloatFilter>;
};

export type PoolTokenIncentiveMaxAggregates = {
  __typename?: 'PoolTokenIncentiveMaxAggregates';
  /** Maximum of index across the matching connection */
  index?: Maybe<Scalars['Int']['output']>;
  /** Maximum of rewardPerSec across the matching connection */
  rewardPerSec?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of startTimestamp across the matching connection */
  startTimestamp?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolTokenIncentiveMinAggregateFilter = {
  index?: InputMaybe<IntFilter>;
  rewardPerSec?: InputMaybe<BigFloatFilter>;
  startTimestamp?: InputMaybe<BigFloatFilter>;
};

export type PoolTokenIncentiveMinAggregates = {
  __typename?: 'PoolTokenIncentiveMinAggregates';
  /** Minimum of index across the matching connection */
  index?: Maybe<Scalars['Int']['output']>;
  /** Minimum of rewardPerSec across the matching connection */
  rewardPerSec?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of startTimestamp across the matching connection */
  startTimestamp?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolTokenIncentiveStddevPopulationAggregateFilter = {
  index?: InputMaybe<BigFloatFilter>;
  rewardPerSec?: InputMaybe<BigFloatFilter>;
  startTimestamp?: InputMaybe<BigFloatFilter>;
};

export type PoolTokenIncentiveStddevPopulationAggregates = {
  __typename?: 'PoolTokenIncentiveStddevPopulationAggregates';
  /** Population standard deviation of index across the matching connection */
  index?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of rewardPerSec across the matching connection */
  rewardPerSec?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of startTimestamp across the matching connection */
  startTimestamp?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolTokenIncentiveStddevSampleAggregateFilter = {
  index?: InputMaybe<BigFloatFilter>;
  rewardPerSec?: InputMaybe<BigFloatFilter>;
  startTimestamp?: InputMaybe<BigFloatFilter>;
};

export type PoolTokenIncentiveStddevSampleAggregates = {
  __typename?: 'PoolTokenIncentiveStddevSampleAggregates';
  /** Sample standard deviation of index across the matching connection */
  index?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of rewardPerSec across the matching connection */
  rewardPerSec?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of startTimestamp across the matching connection */
  startTimestamp?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolTokenIncentiveSumAggregateFilter = {
  index?: InputMaybe<BigIntFilter>;
  rewardPerSec?: InputMaybe<BigFloatFilter>;
  startTimestamp?: InputMaybe<BigFloatFilter>;
};

export type PoolTokenIncentiveSumAggregates = {
  __typename?: 'PoolTokenIncentiveSumAggregates';
  /** Sum of index across the matching connection */
  index: Scalars['BigInt']['output'];
  /** Sum of rewardPerSec across the matching connection */
  rewardPerSec: Scalars['BigFloat']['output'];
  /** Sum of startTimestamp across the matching connection */
  startTimestamp: Scalars['BigFloat']['output'];
};

export type PoolTokenIncentiveVariancePopulationAggregateFilter = {
  index?: InputMaybe<BigFloatFilter>;
  rewardPerSec?: InputMaybe<BigFloatFilter>;
  startTimestamp?: InputMaybe<BigFloatFilter>;
};

export type PoolTokenIncentiveVariancePopulationAggregates = {
  __typename?: 'PoolTokenIncentiveVariancePopulationAggregates';
  /** Population variance of index across the matching connection */
  index?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of rewardPerSec across the matching connection */
  rewardPerSec?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of startTimestamp across the matching connection */
  startTimestamp?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolTokenIncentiveVarianceSampleAggregateFilter = {
  index?: InputMaybe<BigFloatFilter>;
  rewardPerSec?: InputMaybe<BigFloatFilter>;
  startTimestamp?: InputMaybe<BigFloatFilter>;
};

export type PoolTokenIncentiveVarianceSampleAggregates = {
  __typename?: 'PoolTokenIncentiveVarianceSampleAggregates';
  /** Sample variance of index across the matching connection */
  index?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of rewardPerSec across the matching connection */
  rewardPerSec?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of startTimestamp across the matching connection */
  startTimestamp?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `PoolTokenIncentive` values. */
export type PoolTokenIncentivesConnection = {
  __typename?: 'PoolTokenIncentivesConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<PoolTokenIncentiveAggregates>;
  /** A list of edges which contains the `PoolTokenIncentive` and cursor to aid in pagination. */
  edges: PoolTokenIncentivesEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<PoolTokenIncentiveAggregates[]>;
  /** A list of `PoolTokenIncentive` objects. */
  nodes: Maybe<PoolTokenIncentive>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PoolTokenIncentive` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `PoolTokenIncentive` values. */
export type PoolTokenIncentivesConnectionGroupedAggregatesArgs = {
  groupBy: PoolTokenIncentivesGroupBy[];
  having?: InputMaybe<PoolTokenIncentivesHavingInput>;
};

/** A `PoolTokenIncentive` edge in the connection. */
export type PoolTokenIncentivesEdge = {
  __typename?: 'PoolTokenIncentivesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `PoolTokenIncentive` at the end of the edge. */
  node?: Maybe<PoolTokenIncentive>;
};

/** Grouping methods for `PoolTokenIncentive` for usage during aggregation. */
export enum PoolTokenIncentivesGroupBy {
  Id = 'ID',
  Index = 'INDEX',
  PoolId = 'POOL_ID',
  RewardPerSec = 'REWARD_PER_SEC',
  StartTimestamp = 'START_TIMESTAMP',
  TokenId = 'TOKEN_ID',
  TotalReward = 'TOTAL_REWARD',
  TransactionId = 'TRANSACTION_ID'
}

export type PoolTokenIncentivesHavingAverageInput = {
  index?: InputMaybe<HavingIntFilter>;
  rewardPerSec?: InputMaybe<HavingBigfloatFilter>;
  startTimestamp?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolTokenIncentivesHavingDistinctCountInput = {
  index?: InputMaybe<HavingIntFilter>;
  rewardPerSec?: InputMaybe<HavingBigfloatFilter>;
  startTimestamp?: InputMaybe<HavingBigfloatFilter>;
};

/** Conditions for `PoolTokenIncentive` aggregates. */
export type PoolTokenIncentivesHavingInput = {
  AND?: InputMaybe<PoolTokenIncentivesHavingInput[]>;
  OR?: InputMaybe<PoolTokenIncentivesHavingInput[]>;
  average?: InputMaybe<PoolTokenIncentivesHavingAverageInput>;
  distinctCount?: InputMaybe<PoolTokenIncentivesHavingDistinctCountInput>;
  max?: InputMaybe<PoolTokenIncentivesHavingMaxInput>;
  min?: InputMaybe<PoolTokenIncentivesHavingMinInput>;
  stddevPopulation?: InputMaybe<PoolTokenIncentivesHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<PoolTokenIncentivesHavingStddevSampleInput>;
  sum?: InputMaybe<PoolTokenIncentivesHavingSumInput>;
  variancePopulation?: InputMaybe<PoolTokenIncentivesHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<PoolTokenIncentivesHavingVarianceSampleInput>;
};

export type PoolTokenIncentivesHavingMaxInput = {
  index?: InputMaybe<HavingIntFilter>;
  rewardPerSec?: InputMaybe<HavingBigfloatFilter>;
  startTimestamp?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolTokenIncentivesHavingMinInput = {
  index?: InputMaybe<HavingIntFilter>;
  rewardPerSec?: InputMaybe<HavingBigfloatFilter>;
  startTimestamp?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolTokenIncentivesHavingStddevPopulationInput = {
  index?: InputMaybe<HavingIntFilter>;
  rewardPerSec?: InputMaybe<HavingBigfloatFilter>;
  startTimestamp?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolTokenIncentivesHavingStddevSampleInput = {
  index?: InputMaybe<HavingIntFilter>;
  rewardPerSec?: InputMaybe<HavingBigfloatFilter>;
  startTimestamp?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolTokenIncentivesHavingSumInput = {
  index?: InputMaybe<HavingIntFilter>;
  rewardPerSec?: InputMaybe<HavingBigfloatFilter>;
  startTimestamp?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolTokenIncentivesHavingVariancePopulationInput = {
  index?: InputMaybe<HavingIntFilter>;
  rewardPerSec?: InputMaybe<HavingBigfloatFilter>;
  startTimestamp?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolTokenIncentivesHavingVarianceSampleInput = {
  index?: InputMaybe<HavingIntFilter>;
  rewardPerSec?: InputMaybe<HavingBigfloatFilter>;
  startTimestamp?: InputMaybe<HavingBigfloatFilter>;
};

/** Methods to use when ordering `PoolTokenIncentive`. */
export enum PoolTokenIncentivesOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IndexAsc = 'INDEX_ASC',
  IndexDesc = 'INDEX_DESC',
  Natural = 'NATURAL',
  PoolIdAsc = 'POOL_ID_ASC',
  PoolIdDesc = 'POOL_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RewardPerSecAsc = 'REWARD_PER_SEC_ASC',
  RewardPerSecDesc = 'REWARD_PER_SEC_DESC',
  StartTimestampAsc = 'START_TIMESTAMP_ASC',
  StartTimestampDesc = 'START_TIMESTAMP_DESC',
  TokenIdAsc = 'TOKEN_ID_ASC',
  TokenIdDesc = 'TOKEN_ID_DESC',
  TotalRewardAsc = 'TOTAL_REWARD_ASC',
  TotalRewardDesc = 'TOTAL_REWARD_DESC',
  TransactionIdAsc = 'TRANSACTION_ID_ASC',
  TransactionIdDesc = 'TRANSACTION_ID_DESC'
}

/** A connection to a list of `Token` values, with data from `PoolTokenIncentive`. */
export type PoolTokensByPoolTokenIncentivePoolIdAndTokenIdManyToManyConnection = {
  __typename?: 'PoolTokensByPoolTokenIncentivePoolIdAndTokenIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TokenAggregates>;
  /** A list of edges which contains the `Token`, info from the `PoolTokenIncentive`, and the cursor to aid in pagination. */
  edges: PoolTokensByPoolTokenIncentivePoolIdAndTokenIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TokenAggregates[]>;
  /** A list of `Token` objects. */
  nodes: Maybe<Token>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Token` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Token` values, with data from `PoolTokenIncentive`. */
export type PoolTokensByPoolTokenIncentivePoolIdAndTokenIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TokensGroupBy[];
  having?: InputMaybe<TokensHavingInput>;
};

/** A `Token` edge in the connection, with data from `PoolTokenIncentive`. */
export type PoolTokensByPoolTokenIncentivePoolIdAndTokenIdManyToManyEdge = {
  __typename?: 'PoolTokensByPoolTokenIncentivePoolIdAndTokenIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Token` at the end of the edge. */
  node?: Maybe<Token>;
  /** Reads and enables pagination through a set of `PoolTokenIncentive`. */
  poolTokenIncentives: PoolTokenIncentivesConnection;
};


/** A `Token` edge in the connection, with data from `PoolTokenIncentive`. */
export type PoolTokensByPoolTokenIncentivePoolIdAndTokenIdManyToManyEdgePoolTokenIncentivesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pool_Token_Incentives_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolTokenIncentiveFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolTokenIncentivesOrderBy[]>;
};

/** A connection to a list of `Transaction` values, with data from `ClaimFee`. */
export type PoolTransactionsByClaimFeePoolIdAndTransactionIdManyToManyConnection = {
  __typename?: 'PoolTransactionsByClaimFeePoolIdAndTransactionIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TransactionAggregates>;
  /** A list of edges which contains the `Transaction`, info from the `ClaimFee`, and the cursor to aid in pagination. */
  edges: PoolTransactionsByClaimFeePoolIdAndTransactionIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TransactionAggregates[]>;
  /** A list of `Transaction` objects. */
  nodes: Maybe<Transaction>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Transaction` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Transaction` values, with data from `ClaimFee`. */
export type PoolTransactionsByClaimFeePoolIdAndTransactionIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TransactionsGroupBy[];
  having?: InputMaybe<TransactionsHavingInput>;
};

/** A `Transaction` edge in the connection, with data from `ClaimFee`. */
export type PoolTransactionsByClaimFeePoolIdAndTransactionIdManyToManyEdge = {
  __typename?: 'PoolTransactionsByClaimFeePoolIdAndTransactionIdManyToManyEdge';
  /** Reads and enables pagination through a set of `ClaimFee`. */
  claimFees: ClaimFeesConnection;
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Transaction` at the end of the edge. */
  node?: Maybe<Transaction>;
};


/** A `Transaction` edge in the connection, with data from `ClaimFee`. */
export type PoolTransactionsByClaimFeePoolIdAndTransactionIdManyToManyEdgeClaimFeesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Claim_Fees_Distinct_Enum>[]>;
  filter?: InputMaybe<ClaimFeeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimFeesOrderBy[]>;
};

/** A connection to a list of `Transaction` values, with data from `PoolTokenIncentive`. */
export type PoolTransactionsByPoolTokenIncentivePoolIdAndTransactionIdManyToManyConnection = {
  __typename?: 'PoolTransactionsByPoolTokenIncentivePoolIdAndTransactionIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TransactionAggregates>;
  /** A list of edges which contains the `Transaction`, info from the `PoolTokenIncentive`, and the cursor to aid in pagination. */
  edges: PoolTransactionsByPoolTokenIncentivePoolIdAndTransactionIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TransactionAggregates[]>;
  /** A list of `Transaction` objects. */
  nodes: Maybe<Transaction>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Transaction` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Transaction` values, with data from `PoolTokenIncentive`. */
export type PoolTransactionsByPoolTokenIncentivePoolIdAndTransactionIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TransactionsGroupBy[];
  having?: InputMaybe<TransactionsHavingInput>;
};

/** A `Transaction` edge in the connection, with data from `PoolTokenIncentive`. */
export type PoolTransactionsByPoolTokenIncentivePoolIdAndTransactionIdManyToManyEdge = {
  __typename?: 'PoolTransactionsByPoolTokenIncentivePoolIdAndTransactionIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Transaction` at the end of the edge. */
  node?: Maybe<Transaction>;
  /** Reads and enables pagination through a set of `PoolTokenIncentive`. */
  poolTokenIncentives: PoolTokenIncentivesConnection;
};


/** A `Transaction` edge in the connection, with data from `PoolTokenIncentive`. */
export type PoolTransactionsByPoolTokenIncentivePoolIdAndTransactionIdManyToManyEdgePoolTokenIncentivesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pool_Token_Incentives_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolTokenIncentiveFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolTokenIncentivesOrderBy[]>;
};

/** A connection to a list of `Transaction` values, with data from `Position`. */
export type PoolTransactionsByPositionPoolIdAndTransactionIdManyToManyConnection = {
  __typename?: 'PoolTransactionsByPositionPoolIdAndTransactionIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TransactionAggregates>;
  /** A list of edges which contains the `Transaction`, info from the `Position`, and the cursor to aid in pagination. */
  edges: PoolTransactionsByPositionPoolIdAndTransactionIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TransactionAggregates[]>;
  /** A list of `Transaction` objects. */
  nodes: Maybe<Transaction>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Transaction` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Transaction` values, with data from `Position`. */
export type PoolTransactionsByPositionPoolIdAndTransactionIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TransactionsGroupBy[];
  having?: InputMaybe<TransactionsHavingInput>;
};

/** A `Transaction` edge in the connection, with data from `Position`. */
export type PoolTransactionsByPositionPoolIdAndTransactionIdManyToManyEdge = {
  __typename?: 'PoolTransactionsByPositionPoolIdAndTransactionIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Transaction` at the end of the edge. */
  node?: Maybe<Transaction>;
  /** Reads and enables pagination through a set of `Position`. */
  positions: PositionsConnection;
};


/** A `Transaction` edge in the connection, with data from `Position`. */
export type PoolTransactionsByPositionPoolIdAndTransactionIdManyToManyEdgePositionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Positions_Distinct_Enum>[]>;
  filter?: InputMaybe<PositionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionsOrderBy[]>;
};

export type PoolVariancePopulationAggregateFilter = {
  collectedFeesTokenX?: InputMaybe<BigFloatFilter>;
  collectedFeesTokenY?: InputMaybe<BigFloatFilter>;
  createdAt?: InputMaybe<BigFloatFilter>;
  createdAtBlockNumber?: InputMaybe<BigFloatFilter>;
  currentTick?: InputMaybe<BigFloatFilter>;
  fee?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  tickSpacing?: InputMaybe<BigFloatFilter>;
  totalValueLockedTokenX?: InputMaybe<BigFloatFilter>;
  totalValueLockedTokenY?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  updatedAt?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolVariancePopulationAggregates = {
  __typename?: 'PoolVariancePopulationAggregates';
  /** Population variance of collectedFeesTokenX across the matching connection */
  collectedFeesTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of collectedFeesTokenY across the matching connection */
  collectedFeesTokenY?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of createdAtBlockNumber across the matching connection */
  createdAtBlockNumber?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of fee across the matching connection */
  fee?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of tickSpacing across the matching connection */
  tickSpacing?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of totalValueLockedTokenX across the matching connection */
  totalValueLockedTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of totalValueLockedTokenY across the matching connection */
  totalValueLockedTokenY?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolVarianceSampleAggregateFilter = {
  collectedFeesTokenX?: InputMaybe<BigFloatFilter>;
  collectedFeesTokenY?: InputMaybe<BigFloatFilter>;
  createdAt?: InputMaybe<BigFloatFilter>;
  createdAtBlockNumber?: InputMaybe<BigFloatFilter>;
  currentTick?: InputMaybe<BigFloatFilter>;
  fee?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  tickSpacing?: InputMaybe<BigFloatFilter>;
  totalValueLockedTokenX?: InputMaybe<BigFloatFilter>;
  totalValueLockedTokenY?: InputMaybe<BigFloatFilter>;
  txCount?: InputMaybe<BigFloatFilter>;
  updatedAt?: InputMaybe<BigFloatFilter>;
  volumeTokenX?: InputMaybe<BigFloatFilter>;
  volumeTokenY?: InputMaybe<BigFloatFilter>;
};

export type PoolVarianceSampleAggregates = {
  __typename?: 'PoolVarianceSampleAggregates';
  /** Sample variance of collectedFeesTokenX across the matching connection */
  collectedFeesTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of collectedFeesTokenY across the matching connection */
  collectedFeesTokenY?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of createdAtBlockNumber across the matching connection */
  createdAtBlockNumber?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of currentTick across the matching connection */
  currentTick?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of fee across the matching connection */
  fee?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of tickSpacing across the matching connection */
  tickSpacing?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of totalValueLockedTokenX across the matching connection */
  totalValueLockedTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of totalValueLockedTokenY across the matching connection */
  totalValueLockedTokenY?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of txCount across the matching connection */
  txCount?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of volumeTokenX across the matching connection */
  volumeTokenX?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of volumeTokenY across the matching connection */
  volumeTokenY?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `Pool` values. */
export type PoolsConnection = {
  __typename?: 'PoolsConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<PoolAggregates>;
  /** A list of edges which contains the `Pool` and cursor to aid in pagination. */
  edges: PoolsEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<PoolAggregates[]>;
  /** A list of `Pool` objects. */
  nodes: Maybe<Pool>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Pool` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Pool` values. */
export type PoolsConnectionGroupedAggregatesArgs = {
  groupBy: PoolsGroupBy[];
  having?: InputMaybe<PoolsHavingInput>;
};

/** A `Pool` edge in the connection. */
export type PoolsEdge = {
  __typename?: 'PoolsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Pool` at the end of the edge. */
  node?: Maybe<Pool>;
};

/** Grouping methods for `Pool` for usage during aggregation. */
export enum PoolsGroupBy {
  CollectedFeesTokenX = 'COLLECTED_FEES_TOKEN_X',
  CollectedFeesTokenY = 'COLLECTED_FEES_TOKEN_Y',
  CollectedFeesUSD = 'COLLECTED_FEES_U_S_D',
  CreatedAt = 'CREATED_AT',
  CreatedAtBlockNumber = 'CREATED_AT_BLOCK_NUMBER',
  CurrentTick = 'CURRENT_TICK',
  Fee = 'FEE',
  FeesUSD = 'FEES_U_S_D',
  Id = 'ID',
  Liquidity = 'LIQUIDITY',
  PoolCreatorId = 'POOL_CREATOR_ID',
  SqrtPrice = 'SQRT_PRICE',
  TickSpacing = 'TICK_SPACING',
  TokenXId = 'TOKEN_X_ID',
  TokenYId = 'TOKEN_Y_ID',
  TotalValueLockedTokenX = 'TOTAL_VALUE_LOCKED_TOKEN_X',
  TotalValueLockedTokenY = 'TOTAL_VALUE_LOCKED_TOKEN_Y',
  TotalValueLockedUSD = 'TOTAL_VALUE_LOCKED_U_S_D',
  TransactionId = 'TRANSACTION_ID',
  TxCount = 'TX_COUNT',
  UpdatedAt = 'UPDATED_AT',
  VolumeTokenX = 'VOLUME_TOKEN_X',
  VolumeTokenY = 'VOLUME_TOKEN_Y',
  VolumeUSD = 'VOLUME_U_S_D'
}

export type PoolsHavingAverageInput = {
  collectedFeesTokenX?: InputMaybe<HavingBigfloatFilter>;
  collectedFeesTokenY?: InputMaybe<HavingBigfloatFilter>;
  createdAt?: InputMaybe<HavingBigfloatFilter>;
  createdAtBlockNumber?: InputMaybe<HavingBigfloatFilter>;
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  fee?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  tickSpacing?: InputMaybe<HavingIntFilter>;
  totalValueLockedTokenX?: InputMaybe<HavingBigfloatFilter>;
  totalValueLockedTokenY?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  updatedAt?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolsHavingDistinctCountInput = {
  collectedFeesTokenX?: InputMaybe<HavingBigfloatFilter>;
  collectedFeesTokenY?: InputMaybe<HavingBigfloatFilter>;
  createdAt?: InputMaybe<HavingBigfloatFilter>;
  createdAtBlockNumber?: InputMaybe<HavingBigfloatFilter>;
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  fee?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  tickSpacing?: InputMaybe<HavingIntFilter>;
  totalValueLockedTokenX?: InputMaybe<HavingBigfloatFilter>;
  totalValueLockedTokenY?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  updatedAt?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

/** Conditions for `Pool` aggregates. */
export type PoolsHavingInput = {
  AND?: InputMaybe<PoolsHavingInput[]>;
  OR?: InputMaybe<PoolsHavingInput[]>;
  average?: InputMaybe<PoolsHavingAverageInput>;
  distinctCount?: InputMaybe<PoolsHavingDistinctCountInput>;
  max?: InputMaybe<PoolsHavingMaxInput>;
  min?: InputMaybe<PoolsHavingMinInput>;
  stddevPopulation?: InputMaybe<PoolsHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<PoolsHavingStddevSampleInput>;
  sum?: InputMaybe<PoolsHavingSumInput>;
  variancePopulation?: InputMaybe<PoolsHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<PoolsHavingVarianceSampleInput>;
};

export type PoolsHavingMaxInput = {
  collectedFeesTokenX?: InputMaybe<HavingBigfloatFilter>;
  collectedFeesTokenY?: InputMaybe<HavingBigfloatFilter>;
  createdAt?: InputMaybe<HavingBigfloatFilter>;
  createdAtBlockNumber?: InputMaybe<HavingBigfloatFilter>;
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  fee?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  tickSpacing?: InputMaybe<HavingIntFilter>;
  totalValueLockedTokenX?: InputMaybe<HavingBigfloatFilter>;
  totalValueLockedTokenY?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  updatedAt?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolsHavingMinInput = {
  collectedFeesTokenX?: InputMaybe<HavingBigfloatFilter>;
  collectedFeesTokenY?: InputMaybe<HavingBigfloatFilter>;
  createdAt?: InputMaybe<HavingBigfloatFilter>;
  createdAtBlockNumber?: InputMaybe<HavingBigfloatFilter>;
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  fee?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  tickSpacing?: InputMaybe<HavingIntFilter>;
  totalValueLockedTokenX?: InputMaybe<HavingBigfloatFilter>;
  totalValueLockedTokenY?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  updatedAt?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolsHavingStddevPopulationInput = {
  collectedFeesTokenX?: InputMaybe<HavingBigfloatFilter>;
  collectedFeesTokenY?: InputMaybe<HavingBigfloatFilter>;
  createdAt?: InputMaybe<HavingBigfloatFilter>;
  createdAtBlockNumber?: InputMaybe<HavingBigfloatFilter>;
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  fee?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  tickSpacing?: InputMaybe<HavingIntFilter>;
  totalValueLockedTokenX?: InputMaybe<HavingBigfloatFilter>;
  totalValueLockedTokenY?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  updatedAt?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolsHavingStddevSampleInput = {
  collectedFeesTokenX?: InputMaybe<HavingBigfloatFilter>;
  collectedFeesTokenY?: InputMaybe<HavingBigfloatFilter>;
  createdAt?: InputMaybe<HavingBigfloatFilter>;
  createdAtBlockNumber?: InputMaybe<HavingBigfloatFilter>;
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  fee?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  tickSpacing?: InputMaybe<HavingIntFilter>;
  totalValueLockedTokenX?: InputMaybe<HavingBigfloatFilter>;
  totalValueLockedTokenY?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  updatedAt?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolsHavingSumInput = {
  collectedFeesTokenX?: InputMaybe<HavingBigfloatFilter>;
  collectedFeesTokenY?: InputMaybe<HavingBigfloatFilter>;
  createdAt?: InputMaybe<HavingBigfloatFilter>;
  createdAtBlockNumber?: InputMaybe<HavingBigfloatFilter>;
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  fee?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  tickSpacing?: InputMaybe<HavingIntFilter>;
  totalValueLockedTokenX?: InputMaybe<HavingBigfloatFilter>;
  totalValueLockedTokenY?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  updatedAt?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolsHavingVariancePopulationInput = {
  collectedFeesTokenX?: InputMaybe<HavingBigfloatFilter>;
  collectedFeesTokenY?: InputMaybe<HavingBigfloatFilter>;
  createdAt?: InputMaybe<HavingBigfloatFilter>;
  createdAtBlockNumber?: InputMaybe<HavingBigfloatFilter>;
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  fee?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  tickSpacing?: InputMaybe<HavingIntFilter>;
  totalValueLockedTokenX?: InputMaybe<HavingBigfloatFilter>;
  totalValueLockedTokenY?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  updatedAt?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

export type PoolsHavingVarianceSampleInput = {
  collectedFeesTokenX?: InputMaybe<HavingBigfloatFilter>;
  collectedFeesTokenY?: InputMaybe<HavingBigfloatFilter>;
  createdAt?: InputMaybe<HavingBigfloatFilter>;
  createdAtBlockNumber?: InputMaybe<HavingBigfloatFilter>;
  currentTick?: InputMaybe<HavingBigfloatFilter>;
  fee?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
  tickSpacing?: InputMaybe<HavingIntFilter>;
  totalValueLockedTokenX?: InputMaybe<HavingBigfloatFilter>;
  totalValueLockedTokenY?: InputMaybe<HavingBigfloatFilter>;
  txCount?: InputMaybe<HavingBigfloatFilter>;
  updatedAt?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenX?: InputMaybe<HavingBigfloatFilter>;
  volumeTokenY?: InputMaybe<HavingBigfloatFilter>;
};

/** Methods to use when ordering `Pool`. */
export enum PoolsOrderBy {
  ClaimFeesAverageAmountUSDAsc = 'CLAIM_FEES_AVERAGE_AMOUNT_U_S_D_ASC',
  ClaimFeesAverageAmountUSDDesc = 'CLAIM_FEES_AVERAGE_AMOUNT_U_S_D_DESC',
  ClaimFeesAverageAmountXAsc = 'CLAIM_FEES_AVERAGE_AMOUNT_X_ASC',
  ClaimFeesAverageAmountXDesc = 'CLAIM_FEES_AVERAGE_AMOUNT_X_DESC',
  ClaimFeesAverageAmountYAsc = 'CLAIM_FEES_AVERAGE_AMOUNT_Y_ASC',
  ClaimFeesAverageAmountYDesc = 'CLAIM_FEES_AVERAGE_AMOUNT_Y_DESC',
  ClaimFeesAverageBlockRangeAsc = 'CLAIM_FEES_AVERAGE_BLOCK_RANGE_ASC',
  ClaimFeesAverageBlockRangeDesc = 'CLAIM_FEES_AVERAGE_BLOCK_RANGE_DESC',
  ClaimFeesAverageIdAsc = 'CLAIM_FEES_AVERAGE_ID_ASC',
  ClaimFeesAverageIdDesc = 'CLAIM_FEES_AVERAGE_ID_DESC',
  ClaimFeesAverageOwnerIdAsc = 'CLAIM_FEES_AVERAGE_OWNER_ID_ASC',
  ClaimFeesAverageOwnerIdDesc = 'CLAIM_FEES_AVERAGE_OWNER_ID_DESC',
  ClaimFeesAveragePoolIdAsc = 'CLAIM_FEES_AVERAGE_POOL_ID_ASC',
  ClaimFeesAveragePoolIdDesc = 'CLAIM_FEES_AVERAGE_POOL_ID_DESC',
  ClaimFeesAveragePositionIdAsc = 'CLAIM_FEES_AVERAGE_POSITION_ID_ASC',
  ClaimFeesAveragePositionIdDesc = 'CLAIM_FEES_AVERAGE_POSITION_ID_DESC',
  ClaimFeesAverageTransactionIdAsc = 'CLAIM_FEES_AVERAGE_TRANSACTION_ID_ASC',
  ClaimFeesAverageTransactionIdDesc = 'CLAIM_FEES_AVERAGE_TRANSACTION_ID_DESC',
  ClaimFeesCountAsc = 'CLAIM_FEES_COUNT_ASC',
  ClaimFeesCountDesc = 'CLAIM_FEES_COUNT_DESC',
  ClaimFeesDistinctCountAmountUSDAsc = 'CLAIM_FEES_DISTINCT_COUNT_AMOUNT_U_S_D_ASC',
  ClaimFeesDistinctCountAmountUSDDesc = 'CLAIM_FEES_DISTINCT_COUNT_AMOUNT_U_S_D_DESC',
  ClaimFeesDistinctCountAmountXAsc = 'CLAIM_FEES_DISTINCT_COUNT_AMOUNT_X_ASC',
  ClaimFeesDistinctCountAmountXDesc = 'CLAIM_FEES_DISTINCT_COUNT_AMOUNT_X_DESC',
  ClaimFeesDistinctCountAmountYAsc = 'CLAIM_FEES_DISTINCT_COUNT_AMOUNT_Y_ASC',
  ClaimFeesDistinctCountAmountYDesc = 'CLAIM_FEES_DISTINCT_COUNT_AMOUNT_Y_DESC',
  ClaimFeesDistinctCountBlockRangeAsc = 'CLAIM_FEES_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  ClaimFeesDistinctCountBlockRangeDesc = 'CLAIM_FEES_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  ClaimFeesDistinctCountIdAsc = 'CLAIM_FEES_DISTINCT_COUNT_ID_ASC',
  ClaimFeesDistinctCountIdDesc = 'CLAIM_FEES_DISTINCT_COUNT_ID_DESC',
  ClaimFeesDistinctCountOwnerIdAsc = 'CLAIM_FEES_DISTINCT_COUNT_OWNER_ID_ASC',
  ClaimFeesDistinctCountOwnerIdDesc = 'CLAIM_FEES_DISTINCT_COUNT_OWNER_ID_DESC',
  ClaimFeesDistinctCountPoolIdAsc = 'CLAIM_FEES_DISTINCT_COUNT_POOL_ID_ASC',
  ClaimFeesDistinctCountPoolIdDesc = 'CLAIM_FEES_DISTINCT_COUNT_POOL_ID_DESC',
  ClaimFeesDistinctCountPositionIdAsc = 'CLAIM_FEES_DISTINCT_COUNT_POSITION_ID_ASC',
  ClaimFeesDistinctCountPositionIdDesc = 'CLAIM_FEES_DISTINCT_COUNT_POSITION_ID_DESC',
  ClaimFeesDistinctCountTransactionIdAsc = 'CLAIM_FEES_DISTINCT_COUNT_TRANSACTION_ID_ASC',
  ClaimFeesDistinctCountTransactionIdDesc = 'CLAIM_FEES_DISTINCT_COUNT_TRANSACTION_ID_DESC',
  ClaimFeesMaxAmountUSDAsc = 'CLAIM_FEES_MAX_AMOUNT_U_S_D_ASC',
  ClaimFeesMaxAmountUSDDesc = 'CLAIM_FEES_MAX_AMOUNT_U_S_D_DESC',
  ClaimFeesMaxAmountXAsc = 'CLAIM_FEES_MAX_AMOUNT_X_ASC',
  ClaimFeesMaxAmountXDesc = 'CLAIM_FEES_MAX_AMOUNT_X_DESC',
  ClaimFeesMaxAmountYAsc = 'CLAIM_FEES_MAX_AMOUNT_Y_ASC',
  ClaimFeesMaxAmountYDesc = 'CLAIM_FEES_MAX_AMOUNT_Y_DESC',
  ClaimFeesMaxBlockRangeAsc = 'CLAIM_FEES_MAX_BLOCK_RANGE_ASC',
  ClaimFeesMaxBlockRangeDesc = 'CLAIM_FEES_MAX_BLOCK_RANGE_DESC',
  ClaimFeesMaxIdAsc = 'CLAIM_FEES_MAX_ID_ASC',
  ClaimFeesMaxIdDesc = 'CLAIM_FEES_MAX_ID_DESC',
  ClaimFeesMaxOwnerIdAsc = 'CLAIM_FEES_MAX_OWNER_ID_ASC',
  ClaimFeesMaxOwnerIdDesc = 'CLAIM_FEES_MAX_OWNER_ID_DESC',
  ClaimFeesMaxPoolIdAsc = 'CLAIM_FEES_MAX_POOL_ID_ASC',
  ClaimFeesMaxPoolIdDesc = 'CLAIM_FEES_MAX_POOL_ID_DESC',
  ClaimFeesMaxPositionIdAsc = 'CLAIM_FEES_MAX_POSITION_ID_ASC',
  ClaimFeesMaxPositionIdDesc = 'CLAIM_FEES_MAX_POSITION_ID_DESC',
  ClaimFeesMaxTransactionIdAsc = 'CLAIM_FEES_MAX_TRANSACTION_ID_ASC',
  ClaimFeesMaxTransactionIdDesc = 'CLAIM_FEES_MAX_TRANSACTION_ID_DESC',
  ClaimFeesMinAmountUSDAsc = 'CLAIM_FEES_MIN_AMOUNT_U_S_D_ASC',
  ClaimFeesMinAmountUSDDesc = 'CLAIM_FEES_MIN_AMOUNT_U_S_D_DESC',
  ClaimFeesMinAmountXAsc = 'CLAIM_FEES_MIN_AMOUNT_X_ASC',
  ClaimFeesMinAmountXDesc = 'CLAIM_FEES_MIN_AMOUNT_X_DESC',
  ClaimFeesMinAmountYAsc = 'CLAIM_FEES_MIN_AMOUNT_Y_ASC',
  ClaimFeesMinAmountYDesc = 'CLAIM_FEES_MIN_AMOUNT_Y_DESC',
  ClaimFeesMinBlockRangeAsc = 'CLAIM_FEES_MIN_BLOCK_RANGE_ASC',
  ClaimFeesMinBlockRangeDesc = 'CLAIM_FEES_MIN_BLOCK_RANGE_DESC',
  ClaimFeesMinIdAsc = 'CLAIM_FEES_MIN_ID_ASC',
  ClaimFeesMinIdDesc = 'CLAIM_FEES_MIN_ID_DESC',
  ClaimFeesMinOwnerIdAsc = 'CLAIM_FEES_MIN_OWNER_ID_ASC',
  ClaimFeesMinOwnerIdDesc = 'CLAIM_FEES_MIN_OWNER_ID_DESC',
  ClaimFeesMinPoolIdAsc = 'CLAIM_FEES_MIN_POOL_ID_ASC',
  ClaimFeesMinPoolIdDesc = 'CLAIM_FEES_MIN_POOL_ID_DESC',
  ClaimFeesMinPositionIdAsc = 'CLAIM_FEES_MIN_POSITION_ID_ASC',
  ClaimFeesMinPositionIdDesc = 'CLAIM_FEES_MIN_POSITION_ID_DESC',
  ClaimFeesMinTransactionIdAsc = 'CLAIM_FEES_MIN_TRANSACTION_ID_ASC',
  ClaimFeesMinTransactionIdDesc = 'CLAIM_FEES_MIN_TRANSACTION_ID_DESC',
  ClaimFeesStddevPopulationAmountUSDAsc = 'CLAIM_FEES_STDDEV_POPULATION_AMOUNT_U_S_D_ASC',
  ClaimFeesStddevPopulationAmountUSDDesc = 'CLAIM_FEES_STDDEV_POPULATION_AMOUNT_U_S_D_DESC',
  ClaimFeesStddevPopulationAmountXAsc = 'CLAIM_FEES_STDDEV_POPULATION_AMOUNT_X_ASC',
  ClaimFeesStddevPopulationAmountXDesc = 'CLAIM_FEES_STDDEV_POPULATION_AMOUNT_X_DESC',
  ClaimFeesStddevPopulationAmountYAsc = 'CLAIM_FEES_STDDEV_POPULATION_AMOUNT_Y_ASC',
  ClaimFeesStddevPopulationAmountYDesc = 'CLAIM_FEES_STDDEV_POPULATION_AMOUNT_Y_DESC',
  ClaimFeesStddevPopulationBlockRangeAsc = 'CLAIM_FEES_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  ClaimFeesStddevPopulationBlockRangeDesc = 'CLAIM_FEES_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  ClaimFeesStddevPopulationIdAsc = 'CLAIM_FEES_STDDEV_POPULATION_ID_ASC',
  ClaimFeesStddevPopulationIdDesc = 'CLAIM_FEES_STDDEV_POPULATION_ID_DESC',
  ClaimFeesStddevPopulationOwnerIdAsc = 'CLAIM_FEES_STDDEV_POPULATION_OWNER_ID_ASC',
  ClaimFeesStddevPopulationOwnerIdDesc = 'CLAIM_FEES_STDDEV_POPULATION_OWNER_ID_DESC',
  ClaimFeesStddevPopulationPoolIdAsc = 'CLAIM_FEES_STDDEV_POPULATION_POOL_ID_ASC',
  ClaimFeesStddevPopulationPoolIdDesc = 'CLAIM_FEES_STDDEV_POPULATION_POOL_ID_DESC',
  ClaimFeesStddevPopulationPositionIdAsc = 'CLAIM_FEES_STDDEV_POPULATION_POSITION_ID_ASC',
  ClaimFeesStddevPopulationPositionIdDesc = 'CLAIM_FEES_STDDEV_POPULATION_POSITION_ID_DESC',
  ClaimFeesStddevPopulationTransactionIdAsc = 'CLAIM_FEES_STDDEV_POPULATION_TRANSACTION_ID_ASC',
  ClaimFeesStddevPopulationTransactionIdDesc = 'CLAIM_FEES_STDDEV_POPULATION_TRANSACTION_ID_DESC',
  ClaimFeesStddevSampleAmountUSDAsc = 'CLAIM_FEES_STDDEV_SAMPLE_AMOUNT_U_S_D_ASC',
  ClaimFeesStddevSampleAmountUSDDesc = 'CLAIM_FEES_STDDEV_SAMPLE_AMOUNT_U_S_D_DESC',
  ClaimFeesStddevSampleAmountXAsc = 'CLAIM_FEES_STDDEV_SAMPLE_AMOUNT_X_ASC',
  ClaimFeesStddevSampleAmountXDesc = 'CLAIM_FEES_STDDEV_SAMPLE_AMOUNT_X_DESC',
  ClaimFeesStddevSampleAmountYAsc = 'CLAIM_FEES_STDDEV_SAMPLE_AMOUNT_Y_ASC',
  ClaimFeesStddevSampleAmountYDesc = 'CLAIM_FEES_STDDEV_SAMPLE_AMOUNT_Y_DESC',
  ClaimFeesStddevSampleBlockRangeAsc = 'CLAIM_FEES_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  ClaimFeesStddevSampleBlockRangeDesc = 'CLAIM_FEES_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  ClaimFeesStddevSampleIdAsc = 'CLAIM_FEES_STDDEV_SAMPLE_ID_ASC',
  ClaimFeesStddevSampleIdDesc = 'CLAIM_FEES_STDDEV_SAMPLE_ID_DESC',
  ClaimFeesStddevSampleOwnerIdAsc = 'CLAIM_FEES_STDDEV_SAMPLE_OWNER_ID_ASC',
  ClaimFeesStddevSampleOwnerIdDesc = 'CLAIM_FEES_STDDEV_SAMPLE_OWNER_ID_DESC',
  ClaimFeesStddevSamplePoolIdAsc = 'CLAIM_FEES_STDDEV_SAMPLE_POOL_ID_ASC',
  ClaimFeesStddevSamplePoolIdDesc = 'CLAIM_FEES_STDDEV_SAMPLE_POOL_ID_DESC',
  ClaimFeesStddevSamplePositionIdAsc = 'CLAIM_FEES_STDDEV_SAMPLE_POSITION_ID_ASC',
  ClaimFeesStddevSamplePositionIdDesc = 'CLAIM_FEES_STDDEV_SAMPLE_POSITION_ID_DESC',
  ClaimFeesStddevSampleTransactionIdAsc = 'CLAIM_FEES_STDDEV_SAMPLE_TRANSACTION_ID_ASC',
  ClaimFeesStddevSampleTransactionIdDesc = 'CLAIM_FEES_STDDEV_SAMPLE_TRANSACTION_ID_DESC',
  ClaimFeesSumAmountUSDAsc = 'CLAIM_FEES_SUM_AMOUNT_U_S_D_ASC',
  ClaimFeesSumAmountUSDDesc = 'CLAIM_FEES_SUM_AMOUNT_U_S_D_DESC',
  ClaimFeesSumAmountXAsc = 'CLAIM_FEES_SUM_AMOUNT_X_ASC',
  ClaimFeesSumAmountXDesc = 'CLAIM_FEES_SUM_AMOUNT_X_DESC',
  ClaimFeesSumAmountYAsc = 'CLAIM_FEES_SUM_AMOUNT_Y_ASC',
  ClaimFeesSumAmountYDesc = 'CLAIM_FEES_SUM_AMOUNT_Y_DESC',
  ClaimFeesSumBlockRangeAsc = 'CLAIM_FEES_SUM_BLOCK_RANGE_ASC',
  ClaimFeesSumBlockRangeDesc = 'CLAIM_FEES_SUM_BLOCK_RANGE_DESC',
  ClaimFeesSumIdAsc = 'CLAIM_FEES_SUM_ID_ASC',
  ClaimFeesSumIdDesc = 'CLAIM_FEES_SUM_ID_DESC',
  ClaimFeesSumOwnerIdAsc = 'CLAIM_FEES_SUM_OWNER_ID_ASC',
  ClaimFeesSumOwnerIdDesc = 'CLAIM_FEES_SUM_OWNER_ID_DESC',
  ClaimFeesSumPoolIdAsc = 'CLAIM_FEES_SUM_POOL_ID_ASC',
  ClaimFeesSumPoolIdDesc = 'CLAIM_FEES_SUM_POOL_ID_DESC',
  ClaimFeesSumPositionIdAsc = 'CLAIM_FEES_SUM_POSITION_ID_ASC',
  ClaimFeesSumPositionIdDesc = 'CLAIM_FEES_SUM_POSITION_ID_DESC',
  ClaimFeesSumTransactionIdAsc = 'CLAIM_FEES_SUM_TRANSACTION_ID_ASC',
  ClaimFeesSumTransactionIdDesc = 'CLAIM_FEES_SUM_TRANSACTION_ID_DESC',
  ClaimFeesVariancePopulationAmountUSDAsc = 'CLAIM_FEES_VARIANCE_POPULATION_AMOUNT_U_S_D_ASC',
  ClaimFeesVariancePopulationAmountUSDDesc = 'CLAIM_FEES_VARIANCE_POPULATION_AMOUNT_U_S_D_DESC',
  ClaimFeesVariancePopulationAmountXAsc = 'CLAIM_FEES_VARIANCE_POPULATION_AMOUNT_X_ASC',
  ClaimFeesVariancePopulationAmountXDesc = 'CLAIM_FEES_VARIANCE_POPULATION_AMOUNT_X_DESC',
  ClaimFeesVariancePopulationAmountYAsc = 'CLAIM_FEES_VARIANCE_POPULATION_AMOUNT_Y_ASC',
  ClaimFeesVariancePopulationAmountYDesc = 'CLAIM_FEES_VARIANCE_POPULATION_AMOUNT_Y_DESC',
  ClaimFeesVariancePopulationBlockRangeAsc = 'CLAIM_FEES_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  ClaimFeesVariancePopulationBlockRangeDesc = 'CLAIM_FEES_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  ClaimFeesVariancePopulationIdAsc = 'CLAIM_FEES_VARIANCE_POPULATION_ID_ASC',
  ClaimFeesVariancePopulationIdDesc = 'CLAIM_FEES_VARIANCE_POPULATION_ID_DESC',
  ClaimFeesVariancePopulationOwnerIdAsc = 'CLAIM_FEES_VARIANCE_POPULATION_OWNER_ID_ASC',
  ClaimFeesVariancePopulationOwnerIdDesc = 'CLAIM_FEES_VARIANCE_POPULATION_OWNER_ID_DESC',
  ClaimFeesVariancePopulationPoolIdAsc = 'CLAIM_FEES_VARIANCE_POPULATION_POOL_ID_ASC',
  ClaimFeesVariancePopulationPoolIdDesc = 'CLAIM_FEES_VARIANCE_POPULATION_POOL_ID_DESC',
  ClaimFeesVariancePopulationPositionIdAsc = 'CLAIM_FEES_VARIANCE_POPULATION_POSITION_ID_ASC',
  ClaimFeesVariancePopulationPositionIdDesc = 'CLAIM_FEES_VARIANCE_POPULATION_POSITION_ID_DESC',
  ClaimFeesVariancePopulationTransactionIdAsc = 'CLAIM_FEES_VARIANCE_POPULATION_TRANSACTION_ID_ASC',
  ClaimFeesVariancePopulationTransactionIdDesc = 'CLAIM_FEES_VARIANCE_POPULATION_TRANSACTION_ID_DESC',
  ClaimFeesVarianceSampleAmountUSDAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_AMOUNT_U_S_D_ASC',
  ClaimFeesVarianceSampleAmountUSDDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_AMOUNT_U_S_D_DESC',
  ClaimFeesVarianceSampleAmountXAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_AMOUNT_X_ASC',
  ClaimFeesVarianceSampleAmountXDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_AMOUNT_X_DESC',
  ClaimFeesVarianceSampleAmountYAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_AMOUNT_Y_ASC',
  ClaimFeesVarianceSampleAmountYDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_AMOUNT_Y_DESC',
  ClaimFeesVarianceSampleBlockRangeAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  ClaimFeesVarianceSampleBlockRangeDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  ClaimFeesVarianceSampleIdAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_ID_ASC',
  ClaimFeesVarianceSampleIdDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_ID_DESC',
  ClaimFeesVarianceSampleOwnerIdAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_OWNER_ID_ASC',
  ClaimFeesVarianceSampleOwnerIdDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_OWNER_ID_DESC',
  ClaimFeesVarianceSamplePoolIdAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_POOL_ID_ASC',
  ClaimFeesVarianceSamplePoolIdDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_POOL_ID_DESC',
  ClaimFeesVarianceSamplePositionIdAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_POSITION_ID_ASC',
  ClaimFeesVarianceSamplePositionIdDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_POSITION_ID_DESC',
  ClaimFeesVarianceSampleTransactionIdAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_TRANSACTION_ID_ASC',
  ClaimFeesVarianceSampleTransactionIdDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_TRANSACTION_ID_DESC',
  CollectedFeesTokenXAsc = 'COLLECTED_FEES_TOKEN_X_ASC',
  CollectedFeesTokenXDesc = 'COLLECTED_FEES_TOKEN_X_DESC',
  CollectedFeesTokenYAsc = 'COLLECTED_FEES_TOKEN_Y_ASC',
  CollectedFeesTokenYDesc = 'COLLECTED_FEES_TOKEN_Y_DESC',
  CollectedFeesUSDAsc = 'COLLECTED_FEES_U_S_D_ASC',
  CollectedFeesUSDDesc = 'COLLECTED_FEES_U_S_D_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtBlockNumberAsc = 'CREATED_AT_BLOCK_NUMBER_ASC',
  CreatedAtBlockNumberDesc = 'CREATED_AT_BLOCK_NUMBER_DESC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  CurrentTickAsc = 'CURRENT_TICK_ASC',
  CurrentTickDesc = 'CURRENT_TICK_DESC',
  FeesUSDAsc = 'FEES_U_S_D_ASC',
  FeesUSDDesc = 'FEES_U_S_D_DESC',
  FeeAsc = 'FEE_ASC',
  FeeDesc = 'FEE_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  LiquidityAsc = 'LIQUIDITY_ASC',
  LiquidityDesc = 'LIQUIDITY_DESC',
  Natural = 'NATURAL',
  PoolCreatorIdAsc = 'POOL_CREATOR_ID_ASC',
  PoolCreatorIdDesc = 'POOL_CREATOR_ID_DESC',
  PoolDayDataAverageBlockRangeAsc = 'POOL_DAY_DATA_AVERAGE_BLOCK_RANGE_ASC',
  PoolDayDataAverageBlockRangeDesc = 'POOL_DAY_DATA_AVERAGE_BLOCK_RANGE_DESC',
  PoolDayDataAverageCurrentTickAsc = 'POOL_DAY_DATA_AVERAGE_CURRENT_TICK_ASC',
  PoolDayDataAverageCurrentTickDesc = 'POOL_DAY_DATA_AVERAGE_CURRENT_TICK_DESC',
  PoolDayDataAverageDayIndexAsc = 'POOL_DAY_DATA_AVERAGE_DAY_INDEX_ASC',
  PoolDayDataAverageDayIndexDesc = 'POOL_DAY_DATA_AVERAGE_DAY_INDEX_DESC',
  PoolDayDataAverageFeesUSDAsc = 'POOL_DAY_DATA_AVERAGE_FEES_U_S_D_ASC',
  PoolDayDataAverageFeesUSDDesc = 'POOL_DAY_DATA_AVERAGE_FEES_U_S_D_DESC',
  PoolDayDataAverageIdAsc = 'POOL_DAY_DATA_AVERAGE_ID_ASC',
  PoolDayDataAverageIdDesc = 'POOL_DAY_DATA_AVERAGE_ID_DESC',
  PoolDayDataAverageLiquidityAsc = 'POOL_DAY_DATA_AVERAGE_LIQUIDITY_ASC',
  PoolDayDataAverageLiquidityDesc = 'POOL_DAY_DATA_AVERAGE_LIQUIDITY_DESC',
  PoolDayDataAveragePoolIdAsc = 'POOL_DAY_DATA_AVERAGE_POOL_ID_ASC',
  PoolDayDataAveragePoolIdDesc = 'POOL_DAY_DATA_AVERAGE_POOL_ID_DESC',
  PoolDayDataAverageSqrtPriceAsc = 'POOL_DAY_DATA_AVERAGE_SQRT_PRICE_ASC',
  PoolDayDataAverageSqrtPriceDesc = 'POOL_DAY_DATA_AVERAGE_SQRT_PRICE_DESC',
  PoolDayDataAverageTvlUSDAsc = 'POOL_DAY_DATA_AVERAGE_TVL_U_S_D_ASC',
  PoolDayDataAverageTvlUSDDesc = 'POOL_DAY_DATA_AVERAGE_TVL_U_S_D_DESC',
  PoolDayDataAverageTxCountAsc = 'POOL_DAY_DATA_AVERAGE_TX_COUNT_ASC',
  PoolDayDataAverageTxCountDesc = 'POOL_DAY_DATA_AVERAGE_TX_COUNT_DESC',
  PoolDayDataAverageVolumeTokenXAsc = 'POOL_DAY_DATA_AVERAGE_VOLUME_TOKEN_X_ASC',
  PoolDayDataAverageVolumeTokenXDesc = 'POOL_DAY_DATA_AVERAGE_VOLUME_TOKEN_X_DESC',
  PoolDayDataAverageVolumeTokenYAsc = 'POOL_DAY_DATA_AVERAGE_VOLUME_TOKEN_Y_ASC',
  PoolDayDataAverageVolumeTokenYDesc = 'POOL_DAY_DATA_AVERAGE_VOLUME_TOKEN_Y_DESC',
  PoolDayDataAverageVolumeUSDAsc = 'POOL_DAY_DATA_AVERAGE_VOLUME_U_S_D_ASC',
  PoolDayDataAverageVolumeUSDDesc = 'POOL_DAY_DATA_AVERAGE_VOLUME_U_S_D_DESC',
  PoolDayDataCountAsc = 'POOL_DAY_DATA_COUNT_ASC',
  PoolDayDataCountDesc = 'POOL_DAY_DATA_COUNT_DESC',
  PoolDayDataDistinctCountBlockRangeAsc = 'POOL_DAY_DATA_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  PoolDayDataDistinctCountBlockRangeDesc = 'POOL_DAY_DATA_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  PoolDayDataDistinctCountCurrentTickAsc = 'POOL_DAY_DATA_DISTINCT_COUNT_CURRENT_TICK_ASC',
  PoolDayDataDistinctCountCurrentTickDesc = 'POOL_DAY_DATA_DISTINCT_COUNT_CURRENT_TICK_DESC',
  PoolDayDataDistinctCountDayIndexAsc = 'POOL_DAY_DATA_DISTINCT_COUNT_DAY_INDEX_ASC',
  PoolDayDataDistinctCountDayIndexDesc = 'POOL_DAY_DATA_DISTINCT_COUNT_DAY_INDEX_DESC',
  PoolDayDataDistinctCountFeesUSDAsc = 'POOL_DAY_DATA_DISTINCT_COUNT_FEES_U_S_D_ASC',
  PoolDayDataDistinctCountFeesUSDDesc = 'POOL_DAY_DATA_DISTINCT_COUNT_FEES_U_S_D_DESC',
  PoolDayDataDistinctCountIdAsc = 'POOL_DAY_DATA_DISTINCT_COUNT_ID_ASC',
  PoolDayDataDistinctCountIdDesc = 'POOL_DAY_DATA_DISTINCT_COUNT_ID_DESC',
  PoolDayDataDistinctCountLiquidityAsc = 'POOL_DAY_DATA_DISTINCT_COUNT_LIQUIDITY_ASC',
  PoolDayDataDistinctCountLiquidityDesc = 'POOL_DAY_DATA_DISTINCT_COUNT_LIQUIDITY_DESC',
  PoolDayDataDistinctCountPoolIdAsc = 'POOL_DAY_DATA_DISTINCT_COUNT_POOL_ID_ASC',
  PoolDayDataDistinctCountPoolIdDesc = 'POOL_DAY_DATA_DISTINCT_COUNT_POOL_ID_DESC',
  PoolDayDataDistinctCountSqrtPriceAsc = 'POOL_DAY_DATA_DISTINCT_COUNT_SQRT_PRICE_ASC',
  PoolDayDataDistinctCountSqrtPriceDesc = 'POOL_DAY_DATA_DISTINCT_COUNT_SQRT_PRICE_DESC',
  PoolDayDataDistinctCountTvlUSDAsc = 'POOL_DAY_DATA_DISTINCT_COUNT_TVL_U_S_D_ASC',
  PoolDayDataDistinctCountTvlUSDDesc = 'POOL_DAY_DATA_DISTINCT_COUNT_TVL_U_S_D_DESC',
  PoolDayDataDistinctCountTxCountAsc = 'POOL_DAY_DATA_DISTINCT_COUNT_TX_COUNT_ASC',
  PoolDayDataDistinctCountTxCountDesc = 'POOL_DAY_DATA_DISTINCT_COUNT_TX_COUNT_DESC',
  PoolDayDataDistinctCountVolumeTokenXAsc = 'POOL_DAY_DATA_DISTINCT_COUNT_VOLUME_TOKEN_X_ASC',
  PoolDayDataDistinctCountVolumeTokenXDesc = 'POOL_DAY_DATA_DISTINCT_COUNT_VOLUME_TOKEN_X_DESC',
  PoolDayDataDistinctCountVolumeTokenYAsc = 'POOL_DAY_DATA_DISTINCT_COUNT_VOLUME_TOKEN_Y_ASC',
  PoolDayDataDistinctCountVolumeTokenYDesc = 'POOL_DAY_DATA_DISTINCT_COUNT_VOLUME_TOKEN_Y_DESC',
  PoolDayDataDistinctCountVolumeUSDAsc = 'POOL_DAY_DATA_DISTINCT_COUNT_VOLUME_U_S_D_ASC',
  PoolDayDataDistinctCountVolumeUSDDesc = 'POOL_DAY_DATA_DISTINCT_COUNT_VOLUME_U_S_D_DESC',
  PoolDayDataMaxBlockRangeAsc = 'POOL_DAY_DATA_MAX_BLOCK_RANGE_ASC',
  PoolDayDataMaxBlockRangeDesc = 'POOL_DAY_DATA_MAX_BLOCK_RANGE_DESC',
  PoolDayDataMaxCurrentTickAsc = 'POOL_DAY_DATA_MAX_CURRENT_TICK_ASC',
  PoolDayDataMaxCurrentTickDesc = 'POOL_DAY_DATA_MAX_CURRENT_TICK_DESC',
  PoolDayDataMaxDayIndexAsc = 'POOL_DAY_DATA_MAX_DAY_INDEX_ASC',
  PoolDayDataMaxDayIndexDesc = 'POOL_DAY_DATA_MAX_DAY_INDEX_DESC',
  PoolDayDataMaxFeesUSDAsc = 'POOL_DAY_DATA_MAX_FEES_U_S_D_ASC',
  PoolDayDataMaxFeesUSDDesc = 'POOL_DAY_DATA_MAX_FEES_U_S_D_DESC',
  PoolDayDataMaxIdAsc = 'POOL_DAY_DATA_MAX_ID_ASC',
  PoolDayDataMaxIdDesc = 'POOL_DAY_DATA_MAX_ID_DESC',
  PoolDayDataMaxLiquidityAsc = 'POOL_DAY_DATA_MAX_LIQUIDITY_ASC',
  PoolDayDataMaxLiquidityDesc = 'POOL_DAY_DATA_MAX_LIQUIDITY_DESC',
  PoolDayDataMaxPoolIdAsc = 'POOL_DAY_DATA_MAX_POOL_ID_ASC',
  PoolDayDataMaxPoolIdDesc = 'POOL_DAY_DATA_MAX_POOL_ID_DESC',
  PoolDayDataMaxSqrtPriceAsc = 'POOL_DAY_DATA_MAX_SQRT_PRICE_ASC',
  PoolDayDataMaxSqrtPriceDesc = 'POOL_DAY_DATA_MAX_SQRT_PRICE_DESC',
  PoolDayDataMaxTvlUSDAsc = 'POOL_DAY_DATA_MAX_TVL_U_S_D_ASC',
  PoolDayDataMaxTvlUSDDesc = 'POOL_DAY_DATA_MAX_TVL_U_S_D_DESC',
  PoolDayDataMaxTxCountAsc = 'POOL_DAY_DATA_MAX_TX_COUNT_ASC',
  PoolDayDataMaxTxCountDesc = 'POOL_DAY_DATA_MAX_TX_COUNT_DESC',
  PoolDayDataMaxVolumeTokenXAsc = 'POOL_DAY_DATA_MAX_VOLUME_TOKEN_X_ASC',
  PoolDayDataMaxVolumeTokenXDesc = 'POOL_DAY_DATA_MAX_VOLUME_TOKEN_X_DESC',
  PoolDayDataMaxVolumeTokenYAsc = 'POOL_DAY_DATA_MAX_VOLUME_TOKEN_Y_ASC',
  PoolDayDataMaxVolumeTokenYDesc = 'POOL_DAY_DATA_MAX_VOLUME_TOKEN_Y_DESC',
  PoolDayDataMaxVolumeUSDAsc = 'POOL_DAY_DATA_MAX_VOLUME_U_S_D_ASC',
  PoolDayDataMaxVolumeUSDDesc = 'POOL_DAY_DATA_MAX_VOLUME_U_S_D_DESC',
  PoolDayDataMinBlockRangeAsc = 'POOL_DAY_DATA_MIN_BLOCK_RANGE_ASC',
  PoolDayDataMinBlockRangeDesc = 'POOL_DAY_DATA_MIN_BLOCK_RANGE_DESC',
  PoolDayDataMinCurrentTickAsc = 'POOL_DAY_DATA_MIN_CURRENT_TICK_ASC',
  PoolDayDataMinCurrentTickDesc = 'POOL_DAY_DATA_MIN_CURRENT_TICK_DESC',
  PoolDayDataMinDayIndexAsc = 'POOL_DAY_DATA_MIN_DAY_INDEX_ASC',
  PoolDayDataMinDayIndexDesc = 'POOL_DAY_DATA_MIN_DAY_INDEX_DESC',
  PoolDayDataMinFeesUSDAsc = 'POOL_DAY_DATA_MIN_FEES_U_S_D_ASC',
  PoolDayDataMinFeesUSDDesc = 'POOL_DAY_DATA_MIN_FEES_U_S_D_DESC',
  PoolDayDataMinIdAsc = 'POOL_DAY_DATA_MIN_ID_ASC',
  PoolDayDataMinIdDesc = 'POOL_DAY_DATA_MIN_ID_DESC',
  PoolDayDataMinLiquidityAsc = 'POOL_DAY_DATA_MIN_LIQUIDITY_ASC',
  PoolDayDataMinLiquidityDesc = 'POOL_DAY_DATA_MIN_LIQUIDITY_DESC',
  PoolDayDataMinPoolIdAsc = 'POOL_DAY_DATA_MIN_POOL_ID_ASC',
  PoolDayDataMinPoolIdDesc = 'POOL_DAY_DATA_MIN_POOL_ID_DESC',
  PoolDayDataMinSqrtPriceAsc = 'POOL_DAY_DATA_MIN_SQRT_PRICE_ASC',
  PoolDayDataMinSqrtPriceDesc = 'POOL_DAY_DATA_MIN_SQRT_PRICE_DESC',
  PoolDayDataMinTvlUSDAsc = 'POOL_DAY_DATA_MIN_TVL_U_S_D_ASC',
  PoolDayDataMinTvlUSDDesc = 'POOL_DAY_DATA_MIN_TVL_U_S_D_DESC',
  PoolDayDataMinTxCountAsc = 'POOL_DAY_DATA_MIN_TX_COUNT_ASC',
  PoolDayDataMinTxCountDesc = 'POOL_DAY_DATA_MIN_TX_COUNT_DESC',
  PoolDayDataMinVolumeTokenXAsc = 'POOL_DAY_DATA_MIN_VOLUME_TOKEN_X_ASC',
  PoolDayDataMinVolumeTokenXDesc = 'POOL_DAY_DATA_MIN_VOLUME_TOKEN_X_DESC',
  PoolDayDataMinVolumeTokenYAsc = 'POOL_DAY_DATA_MIN_VOLUME_TOKEN_Y_ASC',
  PoolDayDataMinVolumeTokenYDesc = 'POOL_DAY_DATA_MIN_VOLUME_TOKEN_Y_DESC',
  PoolDayDataMinVolumeUSDAsc = 'POOL_DAY_DATA_MIN_VOLUME_U_S_D_ASC',
  PoolDayDataMinVolumeUSDDesc = 'POOL_DAY_DATA_MIN_VOLUME_U_S_D_DESC',
  PoolDayDataStddevPopulationBlockRangeAsc = 'POOL_DAY_DATA_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  PoolDayDataStddevPopulationBlockRangeDesc = 'POOL_DAY_DATA_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  PoolDayDataStddevPopulationCurrentTickAsc = 'POOL_DAY_DATA_STDDEV_POPULATION_CURRENT_TICK_ASC',
  PoolDayDataStddevPopulationCurrentTickDesc = 'POOL_DAY_DATA_STDDEV_POPULATION_CURRENT_TICK_DESC',
  PoolDayDataStddevPopulationDayIndexAsc = 'POOL_DAY_DATA_STDDEV_POPULATION_DAY_INDEX_ASC',
  PoolDayDataStddevPopulationDayIndexDesc = 'POOL_DAY_DATA_STDDEV_POPULATION_DAY_INDEX_DESC',
  PoolDayDataStddevPopulationFeesUSDAsc = 'POOL_DAY_DATA_STDDEV_POPULATION_FEES_U_S_D_ASC',
  PoolDayDataStddevPopulationFeesUSDDesc = 'POOL_DAY_DATA_STDDEV_POPULATION_FEES_U_S_D_DESC',
  PoolDayDataStddevPopulationIdAsc = 'POOL_DAY_DATA_STDDEV_POPULATION_ID_ASC',
  PoolDayDataStddevPopulationIdDesc = 'POOL_DAY_DATA_STDDEV_POPULATION_ID_DESC',
  PoolDayDataStddevPopulationLiquidityAsc = 'POOL_DAY_DATA_STDDEV_POPULATION_LIQUIDITY_ASC',
  PoolDayDataStddevPopulationLiquidityDesc = 'POOL_DAY_DATA_STDDEV_POPULATION_LIQUIDITY_DESC',
  PoolDayDataStddevPopulationPoolIdAsc = 'POOL_DAY_DATA_STDDEV_POPULATION_POOL_ID_ASC',
  PoolDayDataStddevPopulationPoolIdDesc = 'POOL_DAY_DATA_STDDEV_POPULATION_POOL_ID_DESC',
  PoolDayDataStddevPopulationSqrtPriceAsc = 'POOL_DAY_DATA_STDDEV_POPULATION_SQRT_PRICE_ASC',
  PoolDayDataStddevPopulationSqrtPriceDesc = 'POOL_DAY_DATA_STDDEV_POPULATION_SQRT_PRICE_DESC',
  PoolDayDataStddevPopulationTvlUSDAsc = 'POOL_DAY_DATA_STDDEV_POPULATION_TVL_U_S_D_ASC',
  PoolDayDataStddevPopulationTvlUSDDesc = 'POOL_DAY_DATA_STDDEV_POPULATION_TVL_U_S_D_DESC',
  PoolDayDataStddevPopulationTxCountAsc = 'POOL_DAY_DATA_STDDEV_POPULATION_TX_COUNT_ASC',
  PoolDayDataStddevPopulationTxCountDesc = 'POOL_DAY_DATA_STDDEV_POPULATION_TX_COUNT_DESC',
  PoolDayDataStddevPopulationVolumeTokenXAsc = 'POOL_DAY_DATA_STDDEV_POPULATION_VOLUME_TOKEN_X_ASC',
  PoolDayDataStddevPopulationVolumeTokenXDesc = 'POOL_DAY_DATA_STDDEV_POPULATION_VOLUME_TOKEN_X_DESC',
  PoolDayDataStddevPopulationVolumeTokenYAsc = 'POOL_DAY_DATA_STDDEV_POPULATION_VOLUME_TOKEN_Y_ASC',
  PoolDayDataStddevPopulationVolumeTokenYDesc = 'POOL_DAY_DATA_STDDEV_POPULATION_VOLUME_TOKEN_Y_DESC',
  PoolDayDataStddevPopulationVolumeUSDAsc = 'POOL_DAY_DATA_STDDEV_POPULATION_VOLUME_U_S_D_ASC',
  PoolDayDataStddevPopulationVolumeUSDDesc = 'POOL_DAY_DATA_STDDEV_POPULATION_VOLUME_U_S_D_DESC',
  PoolDayDataStddevSampleBlockRangeAsc = 'POOL_DAY_DATA_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  PoolDayDataStddevSampleBlockRangeDesc = 'POOL_DAY_DATA_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  PoolDayDataStddevSampleCurrentTickAsc = 'POOL_DAY_DATA_STDDEV_SAMPLE_CURRENT_TICK_ASC',
  PoolDayDataStddevSampleCurrentTickDesc = 'POOL_DAY_DATA_STDDEV_SAMPLE_CURRENT_TICK_DESC',
  PoolDayDataStddevSampleDayIndexAsc = 'POOL_DAY_DATA_STDDEV_SAMPLE_DAY_INDEX_ASC',
  PoolDayDataStddevSampleDayIndexDesc = 'POOL_DAY_DATA_STDDEV_SAMPLE_DAY_INDEX_DESC',
  PoolDayDataStddevSampleFeesUSDAsc = 'POOL_DAY_DATA_STDDEV_SAMPLE_FEES_U_S_D_ASC',
  PoolDayDataStddevSampleFeesUSDDesc = 'POOL_DAY_DATA_STDDEV_SAMPLE_FEES_U_S_D_DESC',
  PoolDayDataStddevSampleIdAsc = 'POOL_DAY_DATA_STDDEV_SAMPLE_ID_ASC',
  PoolDayDataStddevSampleIdDesc = 'POOL_DAY_DATA_STDDEV_SAMPLE_ID_DESC',
  PoolDayDataStddevSampleLiquidityAsc = 'POOL_DAY_DATA_STDDEV_SAMPLE_LIQUIDITY_ASC',
  PoolDayDataStddevSampleLiquidityDesc = 'POOL_DAY_DATA_STDDEV_SAMPLE_LIQUIDITY_DESC',
  PoolDayDataStddevSamplePoolIdAsc = 'POOL_DAY_DATA_STDDEV_SAMPLE_POOL_ID_ASC',
  PoolDayDataStddevSamplePoolIdDesc = 'POOL_DAY_DATA_STDDEV_SAMPLE_POOL_ID_DESC',
  PoolDayDataStddevSampleSqrtPriceAsc = 'POOL_DAY_DATA_STDDEV_SAMPLE_SQRT_PRICE_ASC',
  PoolDayDataStddevSampleSqrtPriceDesc = 'POOL_DAY_DATA_STDDEV_SAMPLE_SQRT_PRICE_DESC',
  PoolDayDataStddevSampleTvlUSDAsc = 'POOL_DAY_DATA_STDDEV_SAMPLE_TVL_U_S_D_ASC',
  PoolDayDataStddevSampleTvlUSDDesc = 'POOL_DAY_DATA_STDDEV_SAMPLE_TVL_U_S_D_DESC',
  PoolDayDataStddevSampleTxCountAsc = 'POOL_DAY_DATA_STDDEV_SAMPLE_TX_COUNT_ASC',
  PoolDayDataStddevSampleTxCountDesc = 'POOL_DAY_DATA_STDDEV_SAMPLE_TX_COUNT_DESC',
  PoolDayDataStddevSampleVolumeTokenXAsc = 'POOL_DAY_DATA_STDDEV_SAMPLE_VOLUME_TOKEN_X_ASC',
  PoolDayDataStddevSampleVolumeTokenXDesc = 'POOL_DAY_DATA_STDDEV_SAMPLE_VOLUME_TOKEN_X_DESC',
  PoolDayDataStddevSampleVolumeTokenYAsc = 'POOL_DAY_DATA_STDDEV_SAMPLE_VOLUME_TOKEN_Y_ASC',
  PoolDayDataStddevSampleVolumeTokenYDesc = 'POOL_DAY_DATA_STDDEV_SAMPLE_VOLUME_TOKEN_Y_DESC',
  PoolDayDataStddevSampleVolumeUSDAsc = 'POOL_DAY_DATA_STDDEV_SAMPLE_VOLUME_U_S_D_ASC',
  PoolDayDataStddevSampleVolumeUSDDesc = 'POOL_DAY_DATA_STDDEV_SAMPLE_VOLUME_U_S_D_DESC',
  PoolDayDataSumBlockRangeAsc = 'POOL_DAY_DATA_SUM_BLOCK_RANGE_ASC',
  PoolDayDataSumBlockRangeDesc = 'POOL_DAY_DATA_SUM_BLOCK_RANGE_DESC',
  PoolDayDataSumCurrentTickAsc = 'POOL_DAY_DATA_SUM_CURRENT_TICK_ASC',
  PoolDayDataSumCurrentTickDesc = 'POOL_DAY_DATA_SUM_CURRENT_TICK_DESC',
  PoolDayDataSumDayIndexAsc = 'POOL_DAY_DATA_SUM_DAY_INDEX_ASC',
  PoolDayDataSumDayIndexDesc = 'POOL_DAY_DATA_SUM_DAY_INDEX_DESC',
  PoolDayDataSumFeesUSDAsc = 'POOL_DAY_DATA_SUM_FEES_U_S_D_ASC',
  PoolDayDataSumFeesUSDDesc = 'POOL_DAY_DATA_SUM_FEES_U_S_D_DESC',
  PoolDayDataSumIdAsc = 'POOL_DAY_DATA_SUM_ID_ASC',
  PoolDayDataSumIdDesc = 'POOL_DAY_DATA_SUM_ID_DESC',
  PoolDayDataSumLiquidityAsc = 'POOL_DAY_DATA_SUM_LIQUIDITY_ASC',
  PoolDayDataSumLiquidityDesc = 'POOL_DAY_DATA_SUM_LIQUIDITY_DESC',
  PoolDayDataSumPoolIdAsc = 'POOL_DAY_DATA_SUM_POOL_ID_ASC',
  PoolDayDataSumPoolIdDesc = 'POOL_DAY_DATA_SUM_POOL_ID_DESC',
  PoolDayDataSumSqrtPriceAsc = 'POOL_DAY_DATA_SUM_SQRT_PRICE_ASC',
  PoolDayDataSumSqrtPriceDesc = 'POOL_DAY_DATA_SUM_SQRT_PRICE_DESC',
  PoolDayDataSumTvlUSDAsc = 'POOL_DAY_DATA_SUM_TVL_U_S_D_ASC',
  PoolDayDataSumTvlUSDDesc = 'POOL_DAY_DATA_SUM_TVL_U_S_D_DESC',
  PoolDayDataSumTxCountAsc = 'POOL_DAY_DATA_SUM_TX_COUNT_ASC',
  PoolDayDataSumTxCountDesc = 'POOL_DAY_DATA_SUM_TX_COUNT_DESC',
  PoolDayDataSumVolumeTokenXAsc = 'POOL_DAY_DATA_SUM_VOLUME_TOKEN_X_ASC',
  PoolDayDataSumVolumeTokenXDesc = 'POOL_DAY_DATA_SUM_VOLUME_TOKEN_X_DESC',
  PoolDayDataSumVolumeTokenYAsc = 'POOL_DAY_DATA_SUM_VOLUME_TOKEN_Y_ASC',
  PoolDayDataSumVolumeTokenYDesc = 'POOL_DAY_DATA_SUM_VOLUME_TOKEN_Y_DESC',
  PoolDayDataSumVolumeUSDAsc = 'POOL_DAY_DATA_SUM_VOLUME_U_S_D_ASC',
  PoolDayDataSumVolumeUSDDesc = 'POOL_DAY_DATA_SUM_VOLUME_U_S_D_DESC',
  PoolDayDataVariancePopulationBlockRangeAsc = 'POOL_DAY_DATA_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  PoolDayDataVariancePopulationBlockRangeDesc = 'POOL_DAY_DATA_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  PoolDayDataVariancePopulationCurrentTickAsc = 'POOL_DAY_DATA_VARIANCE_POPULATION_CURRENT_TICK_ASC',
  PoolDayDataVariancePopulationCurrentTickDesc = 'POOL_DAY_DATA_VARIANCE_POPULATION_CURRENT_TICK_DESC',
  PoolDayDataVariancePopulationDayIndexAsc = 'POOL_DAY_DATA_VARIANCE_POPULATION_DAY_INDEX_ASC',
  PoolDayDataVariancePopulationDayIndexDesc = 'POOL_DAY_DATA_VARIANCE_POPULATION_DAY_INDEX_DESC',
  PoolDayDataVariancePopulationFeesUSDAsc = 'POOL_DAY_DATA_VARIANCE_POPULATION_FEES_U_S_D_ASC',
  PoolDayDataVariancePopulationFeesUSDDesc = 'POOL_DAY_DATA_VARIANCE_POPULATION_FEES_U_S_D_DESC',
  PoolDayDataVariancePopulationIdAsc = 'POOL_DAY_DATA_VARIANCE_POPULATION_ID_ASC',
  PoolDayDataVariancePopulationIdDesc = 'POOL_DAY_DATA_VARIANCE_POPULATION_ID_DESC',
  PoolDayDataVariancePopulationLiquidityAsc = 'POOL_DAY_DATA_VARIANCE_POPULATION_LIQUIDITY_ASC',
  PoolDayDataVariancePopulationLiquidityDesc = 'POOL_DAY_DATA_VARIANCE_POPULATION_LIQUIDITY_DESC',
  PoolDayDataVariancePopulationPoolIdAsc = 'POOL_DAY_DATA_VARIANCE_POPULATION_POOL_ID_ASC',
  PoolDayDataVariancePopulationPoolIdDesc = 'POOL_DAY_DATA_VARIANCE_POPULATION_POOL_ID_DESC',
  PoolDayDataVariancePopulationSqrtPriceAsc = 'POOL_DAY_DATA_VARIANCE_POPULATION_SQRT_PRICE_ASC',
  PoolDayDataVariancePopulationSqrtPriceDesc = 'POOL_DAY_DATA_VARIANCE_POPULATION_SQRT_PRICE_DESC',
  PoolDayDataVariancePopulationTvlUSDAsc = 'POOL_DAY_DATA_VARIANCE_POPULATION_TVL_U_S_D_ASC',
  PoolDayDataVariancePopulationTvlUSDDesc = 'POOL_DAY_DATA_VARIANCE_POPULATION_TVL_U_S_D_DESC',
  PoolDayDataVariancePopulationTxCountAsc = 'POOL_DAY_DATA_VARIANCE_POPULATION_TX_COUNT_ASC',
  PoolDayDataVariancePopulationTxCountDesc = 'POOL_DAY_DATA_VARIANCE_POPULATION_TX_COUNT_DESC',
  PoolDayDataVariancePopulationVolumeTokenXAsc = 'POOL_DAY_DATA_VARIANCE_POPULATION_VOLUME_TOKEN_X_ASC',
  PoolDayDataVariancePopulationVolumeTokenXDesc = 'POOL_DAY_DATA_VARIANCE_POPULATION_VOLUME_TOKEN_X_DESC',
  PoolDayDataVariancePopulationVolumeTokenYAsc = 'POOL_DAY_DATA_VARIANCE_POPULATION_VOLUME_TOKEN_Y_ASC',
  PoolDayDataVariancePopulationVolumeTokenYDesc = 'POOL_DAY_DATA_VARIANCE_POPULATION_VOLUME_TOKEN_Y_DESC',
  PoolDayDataVariancePopulationVolumeUSDAsc = 'POOL_DAY_DATA_VARIANCE_POPULATION_VOLUME_U_S_D_ASC',
  PoolDayDataVariancePopulationVolumeUSDDesc = 'POOL_DAY_DATA_VARIANCE_POPULATION_VOLUME_U_S_D_DESC',
  PoolDayDataVarianceSampleBlockRangeAsc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  PoolDayDataVarianceSampleBlockRangeDesc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  PoolDayDataVarianceSampleCurrentTickAsc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_CURRENT_TICK_ASC',
  PoolDayDataVarianceSampleCurrentTickDesc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_CURRENT_TICK_DESC',
  PoolDayDataVarianceSampleDayIndexAsc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_DAY_INDEX_ASC',
  PoolDayDataVarianceSampleDayIndexDesc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_DAY_INDEX_DESC',
  PoolDayDataVarianceSampleFeesUSDAsc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_FEES_U_S_D_ASC',
  PoolDayDataVarianceSampleFeesUSDDesc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_FEES_U_S_D_DESC',
  PoolDayDataVarianceSampleIdAsc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_ID_ASC',
  PoolDayDataVarianceSampleIdDesc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_ID_DESC',
  PoolDayDataVarianceSampleLiquidityAsc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_LIQUIDITY_ASC',
  PoolDayDataVarianceSampleLiquidityDesc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_LIQUIDITY_DESC',
  PoolDayDataVarianceSamplePoolIdAsc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_POOL_ID_ASC',
  PoolDayDataVarianceSamplePoolIdDesc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_POOL_ID_DESC',
  PoolDayDataVarianceSampleSqrtPriceAsc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_SQRT_PRICE_ASC',
  PoolDayDataVarianceSampleSqrtPriceDesc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_SQRT_PRICE_DESC',
  PoolDayDataVarianceSampleTvlUSDAsc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_TVL_U_S_D_ASC',
  PoolDayDataVarianceSampleTvlUSDDesc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_TVL_U_S_D_DESC',
  PoolDayDataVarianceSampleTxCountAsc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_TX_COUNT_ASC',
  PoolDayDataVarianceSampleTxCountDesc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_TX_COUNT_DESC',
  PoolDayDataVarianceSampleVolumeTokenXAsc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_VOLUME_TOKEN_X_ASC',
  PoolDayDataVarianceSampleVolumeTokenXDesc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_VOLUME_TOKEN_X_DESC',
  PoolDayDataVarianceSampleVolumeTokenYAsc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_VOLUME_TOKEN_Y_ASC',
  PoolDayDataVarianceSampleVolumeTokenYDesc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_VOLUME_TOKEN_Y_DESC',
  PoolDayDataVarianceSampleVolumeUSDAsc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_VOLUME_U_S_D_ASC',
  PoolDayDataVarianceSampleVolumeUSDDesc = 'POOL_DAY_DATA_VARIANCE_SAMPLE_VOLUME_U_S_D_DESC',
  PoolHourDataAverageBlockRangeAsc = 'POOL_HOUR_DATA_AVERAGE_BLOCK_RANGE_ASC',
  PoolHourDataAverageBlockRangeDesc = 'POOL_HOUR_DATA_AVERAGE_BLOCK_RANGE_DESC',
  PoolHourDataAverageCurrentTickAsc = 'POOL_HOUR_DATA_AVERAGE_CURRENT_TICK_ASC',
  PoolHourDataAverageCurrentTickDesc = 'POOL_HOUR_DATA_AVERAGE_CURRENT_TICK_DESC',
  PoolHourDataAverageFeesUSDAsc = 'POOL_HOUR_DATA_AVERAGE_FEES_U_S_D_ASC',
  PoolHourDataAverageFeesUSDDesc = 'POOL_HOUR_DATA_AVERAGE_FEES_U_S_D_DESC',
  PoolHourDataAverageHourIndexAsc = 'POOL_HOUR_DATA_AVERAGE_HOUR_INDEX_ASC',
  PoolHourDataAverageHourIndexDesc = 'POOL_HOUR_DATA_AVERAGE_HOUR_INDEX_DESC',
  PoolHourDataAverageIdAsc = 'POOL_HOUR_DATA_AVERAGE_ID_ASC',
  PoolHourDataAverageIdDesc = 'POOL_HOUR_DATA_AVERAGE_ID_DESC',
  PoolHourDataAverageLiquidityAsc = 'POOL_HOUR_DATA_AVERAGE_LIQUIDITY_ASC',
  PoolHourDataAverageLiquidityDesc = 'POOL_HOUR_DATA_AVERAGE_LIQUIDITY_DESC',
  PoolHourDataAveragePoolIdAsc = 'POOL_HOUR_DATA_AVERAGE_POOL_ID_ASC',
  PoolHourDataAveragePoolIdDesc = 'POOL_HOUR_DATA_AVERAGE_POOL_ID_DESC',
  PoolHourDataAverageSqrtPriceAsc = 'POOL_HOUR_DATA_AVERAGE_SQRT_PRICE_ASC',
  PoolHourDataAverageSqrtPriceDesc = 'POOL_HOUR_DATA_AVERAGE_SQRT_PRICE_DESC',
  PoolHourDataAverageTvlUSDAsc = 'POOL_HOUR_DATA_AVERAGE_TVL_U_S_D_ASC',
  PoolHourDataAverageTvlUSDDesc = 'POOL_HOUR_DATA_AVERAGE_TVL_U_S_D_DESC',
  PoolHourDataAverageTxCountAsc = 'POOL_HOUR_DATA_AVERAGE_TX_COUNT_ASC',
  PoolHourDataAverageTxCountDesc = 'POOL_HOUR_DATA_AVERAGE_TX_COUNT_DESC',
  PoolHourDataAverageVolumeTokenXAsc = 'POOL_HOUR_DATA_AVERAGE_VOLUME_TOKEN_X_ASC',
  PoolHourDataAverageVolumeTokenXDesc = 'POOL_HOUR_DATA_AVERAGE_VOLUME_TOKEN_X_DESC',
  PoolHourDataAverageVolumeTokenYAsc = 'POOL_HOUR_DATA_AVERAGE_VOLUME_TOKEN_Y_ASC',
  PoolHourDataAverageVolumeTokenYDesc = 'POOL_HOUR_DATA_AVERAGE_VOLUME_TOKEN_Y_DESC',
  PoolHourDataAverageVolumeUSDAsc = 'POOL_HOUR_DATA_AVERAGE_VOLUME_U_S_D_ASC',
  PoolHourDataAverageVolumeUSDDesc = 'POOL_HOUR_DATA_AVERAGE_VOLUME_U_S_D_DESC',
  PoolHourDataCountAsc = 'POOL_HOUR_DATA_COUNT_ASC',
  PoolHourDataCountDesc = 'POOL_HOUR_DATA_COUNT_DESC',
  PoolHourDataDistinctCountBlockRangeAsc = 'POOL_HOUR_DATA_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  PoolHourDataDistinctCountBlockRangeDesc = 'POOL_HOUR_DATA_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  PoolHourDataDistinctCountCurrentTickAsc = 'POOL_HOUR_DATA_DISTINCT_COUNT_CURRENT_TICK_ASC',
  PoolHourDataDistinctCountCurrentTickDesc = 'POOL_HOUR_DATA_DISTINCT_COUNT_CURRENT_TICK_DESC',
  PoolHourDataDistinctCountFeesUSDAsc = 'POOL_HOUR_DATA_DISTINCT_COUNT_FEES_U_S_D_ASC',
  PoolHourDataDistinctCountFeesUSDDesc = 'POOL_HOUR_DATA_DISTINCT_COUNT_FEES_U_S_D_DESC',
  PoolHourDataDistinctCountHourIndexAsc = 'POOL_HOUR_DATA_DISTINCT_COUNT_HOUR_INDEX_ASC',
  PoolHourDataDistinctCountHourIndexDesc = 'POOL_HOUR_DATA_DISTINCT_COUNT_HOUR_INDEX_DESC',
  PoolHourDataDistinctCountIdAsc = 'POOL_HOUR_DATA_DISTINCT_COUNT_ID_ASC',
  PoolHourDataDistinctCountIdDesc = 'POOL_HOUR_DATA_DISTINCT_COUNT_ID_DESC',
  PoolHourDataDistinctCountLiquidityAsc = 'POOL_HOUR_DATA_DISTINCT_COUNT_LIQUIDITY_ASC',
  PoolHourDataDistinctCountLiquidityDesc = 'POOL_HOUR_DATA_DISTINCT_COUNT_LIQUIDITY_DESC',
  PoolHourDataDistinctCountPoolIdAsc = 'POOL_HOUR_DATA_DISTINCT_COUNT_POOL_ID_ASC',
  PoolHourDataDistinctCountPoolIdDesc = 'POOL_HOUR_DATA_DISTINCT_COUNT_POOL_ID_DESC',
  PoolHourDataDistinctCountSqrtPriceAsc = 'POOL_HOUR_DATA_DISTINCT_COUNT_SQRT_PRICE_ASC',
  PoolHourDataDistinctCountSqrtPriceDesc = 'POOL_HOUR_DATA_DISTINCT_COUNT_SQRT_PRICE_DESC',
  PoolHourDataDistinctCountTvlUSDAsc = 'POOL_HOUR_DATA_DISTINCT_COUNT_TVL_U_S_D_ASC',
  PoolHourDataDistinctCountTvlUSDDesc = 'POOL_HOUR_DATA_DISTINCT_COUNT_TVL_U_S_D_DESC',
  PoolHourDataDistinctCountTxCountAsc = 'POOL_HOUR_DATA_DISTINCT_COUNT_TX_COUNT_ASC',
  PoolHourDataDistinctCountTxCountDesc = 'POOL_HOUR_DATA_DISTINCT_COUNT_TX_COUNT_DESC',
  PoolHourDataDistinctCountVolumeTokenXAsc = 'POOL_HOUR_DATA_DISTINCT_COUNT_VOLUME_TOKEN_X_ASC',
  PoolHourDataDistinctCountVolumeTokenXDesc = 'POOL_HOUR_DATA_DISTINCT_COUNT_VOLUME_TOKEN_X_DESC',
  PoolHourDataDistinctCountVolumeTokenYAsc = 'POOL_HOUR_DATA_DISTINCT_COUNT_VOLUME_TOKEN_Y_ASC',
  PoolHourDataDistinctCountVolumeTokenYDesc = 'POOL_HOUR_DATA_DISTINCT_COUNT_VOLUME_TOKEN_Y_DESC',
  PoolHourDataDistinctCountVolumeUSDAsc = 'POOL_HOUR_DATA_DISTINCT_COUNT_VOLUME_U_S_D_ASC',
  PoolHourDataDistinctCountVolumeUSDDesc = 'POOL_HOUR_DATA_DISTINCT_COUNT_VOLUME_U_S_D_DESC',
  PoolHourDataMaxBlockRangeAsc = 'POOL_HOUR_DATA_MAX_BLOCK_RANGE_ASC',
  PoolHourDataMaxBlockRangeDesc = 'POOL_HOUR_DATA_MAX_BLOCK_RANGE_DESC',
  PoolHourDataMaxCurrentTickAsc = 'POOL_HOUR_DATA_MAX_CURRENT_TICK_ASC',
  PoolHourDataMaxCurrentTickDesc = 'POOL_HOUR_DATA_MAX_CURRENT_TICK_DESC',
  PoolHourDataMaxFeesUSDAsc = 'POOL_HOUR_DATA_MAX_FEES_U_S_D_ASC',
  PoolHourDataMaxFeesUSDDesc = 'POOL_HOUR_DATA_MAX_FEES_U_S_D_DESC',
  PoolHourDataMaxHourIndexAsc = 'POOL_HOUR_DATA_MAX_HOUR_INDEX_ASC',
  PoolHourDataMaxHourIndexDesc = 'POOL_HOUR_DATA_MAX_HOUR_INDEX_DESC',
  PoolHourDataMaxIdAsc = 'POOL_HOUR_DATA_MAX_ID_ASC',
  PoolHourDataMaxIdDesc = 'POOL_HOUR_DATA_MAX_ID_DESC',
  PoolHourDataMaxLiquidityAsc = 'POOL_HOUR_DATA_MAX_LIQUIDITY_ASC',
  PoolHourDataMaxLiquidityDesc = 'POOL_HOUR_DATA_MAX_LIQUIDITY_DESC',
  PoolHourDataMaxPoolIdAsc = 'POOL_HOUR_DATA_MAX_POOL_ID_ASC',
  PoolHourDataMaxPoolIdDesc = 'POOL_HOUR_DATA_MAX_POOL_ID_DESC',
  PoolHourDataMaxSqrtPriceAsc = 'POOL_HOUR_DATA_MAX_SQRT_PRICE_ASC',
  PoolHourDataMaxSqrtPriceDesc = 'POOL_HOUR_DATA_MAX_SQRT_PRICE_DESC',
  PoolHourDataMaxTvlUSDAsc = 'POOL_HOUR_DATA_MAX_TVL_U_S_D_ASC',
  PoolHourDataMaxTvlUSDDesc = 'POOL_HOUR_DATA_MAX_TVL_U_S_D_DESC',
  PoolHourDataMaxTxCountAsc = 'POOL_HOUR_DATA_MAX_TX_COUNT_ASC',
  PoolHourDataMaxTxCountDesc = 'POOL_HOUR_DATA_MAX_TX_COUNT_DESC',
  PoolHourDataMaxVolumeTokenXAsc = 'POOL_HOUR_DATA_MAX_VOLUME_TOKEN_X_ASC',
  PoolHourDataMaxVolumeTokenXDesc = 'POOL_HOUR_DATA_MAX_VOLUME_TOKEN_X_DESC',
  PoolHourDataMaxVolumeTokenYAsc = 'POOL_HOUR_DATA_MAX_VOLUME_TOKEN_Y_ASC',
  PoolHourDataMaxVolumeTokenYDesc = 'POOL_HOUR_DATA_MAX_VOLUME_TOKEN_Y_DESC',
  PoolHourDataMaxVolumeUSDAsc = 'POOL_HOUR_DATA_MAX_VOLUME_U_S_D_ASC',
  PoolHourDataMaxVolumeUSDDesc = 'POOL_HOUR_DATA_MAX_VOLUME_U_S_D_DESC',
  PoolHourDataMinBlockRangeAsc = 'POOL_HOUR_DATA_MIN_BLOCK_RANGE_ASC',
  PoolHourDataMinBlockRangeDesc = 'POOL_HOUR_DATA_MIN_BLOCK_RANGE_DESC',
  PoolHourDataMinCurrentTickAsc = 'POOL_HOUR_DATA_MIN_CURRENT_TICK_ASC',
  PoolHourDataMinCurrentTickDesc = 'POOL_HOUR_DATA_MIN_CURRENT_TICK_DESC',
  PoolHourDataMinFeesUSDAsc = 'POOL_HOUR_DATA_MIN_FEES_U_S_D_ASC',
  PoolHourDataMinFeesUSDDesc = 'POOL_HOUR_DATA_MIN_FEES_U_S_D_DESC',
  PoolHourDataMinHourIndexAsc = 'POOL_HOUR_DATA_MIN_HOUR_INDEX_ASC',
  PoolHourDataMinHourIndexDesc = 'POOL_HOUR_DATA_MIN_HOUR_INDEX_DESC',
  PoolHourDataMinIdAsc = 'POOL_HOUR_DATA_MIN_ID_ASC',
  PoolHourDataMinIdDesc = 'POOL_HOUR_DATA_MIN_ID_DESC',
  PoolHourDataMinLiquidityAsc = 'POOL_HOUR_DATA_MIN_LIQUIDITY_ASC',
  PoolHourDataMinLiquidityDesc = 'POOL_HOUR_DATA_MIN_LIQUIDITY_DESC',
  PoolHourDataMinPoolIdAsc = 'POOL_HOUR_DATA_MIN_POOL_ID_ASC',
  PoolHourDataMinPoolIdDesc = 'POOL_HOUR_DATA_MIN_POOL_ID_DESC',
  PoolHourDataMinSqrtPriceAsc = 'POOL_HOUR_DATA_MIN_SQRT_PRICE_ASC',
  PoolHourDataMinSqrtPriceDesc = 'POOL_HOUR_DATA_MIN_SQRT_PRICE_DESC',
  PoolHourDataMinTvlUSDAsc = 'POOL_HOUR_DATA_MIN_TVL_U_S_D_ASC',
  PoolHourDataMinTvlUSDDesc = 'POOL_HOUR_DATA_MIN_TVL_U_S_D_DESC',
  PoolHourDataMinTxCountAsc = 'POOL_HOUR_DATA_MIN_TX_COUNT_ASC',
  PoolHourDataMinTxCountDesc = 'POOL_HOUR_DATA_MIN_TX_COUNT_DESC',
  PoolHourDataMinVolumeTokenXAsc = 'POOL_HOUR_DATA_MIN_VOLUME_TOKEN_X_ASC',
  PoolHourDataMinVolumeTokenXDesc = 'POOL_HOUR_DATA_MIN_VOLUME_TOKEN_X_DESC',
  PoolHourDataMinVolumeTokenYAsc = 'POOL_HOUR_DATA_MIN_VOLUME_TOKEN_Y_ASC',
  PoolHourDataMinVolumeTokenYDesc = 'POOL_HOUR_DATA_MIN_VOLUME_TOKEN_Y_DESC',
  PoolHourDataMinVolumeUSDAsc = 'POOL_HOUR_DATA_MIN_VOLUME_U_S_D_ASC',
  PoolHourDataMinVolumeUSDDesc = 'POOL_HOUR_DATA_MIN_VOLUME_U_S_D_DESC',
  PoolHourDataStddevPopulationBlockRangeAsc = 'POOL_HOUR_DATA_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  PoolHourDataStddevPopulationBlockRangeDesc = 'POOL_HOUR_DATA_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  PoolHourDataStddevPopulationCurrentTickAsc = 'POOL_HOUR_DATA_STDDEV_POPULATION_CURRENT_TICK_ASC',
  PoolHourDataStddevPopulationCurrentTickDesc = 'POOL_HOUR_DATA_STDDEV_POPULATION_CURRENT_TICK_DESC',
  PoolHourDataStddevPopulationFeesUSDAsc = 'POOL_HOUR_DATA_STDDEV_POPULATION_FEES_U_S_D_ASC',
  PoolHourDataStddevPopulationFeesUSDDesc = 'POOL_HOUR_DATA_STDDEV_POPULATION_FEES_U_S_D_DESC',
  PoolHourDataStddevPopulationHourIndexAsc = 'POOL_HOUR_DATA_STDDEV_POPULATION_HOUR_INDEX_ASC',
  PoolHourDataStddevPopulationHourIndexDesc = 'POOL_HOUR_DATA_STDDEV_POPULATION_HOUR_INDEX_DESC',
  PoolHourDataStddevPopulationIdAsc = 'POOL_HOUR_DATA_STDDEV_POPULATION_ID_ASC',
  PoolHourDataStddevPopulationIdDesc = 'POOL_HOUR_DATA_STDDEV_POPULATION_ID_DESC',
  PoolHourDataStddevPopulationLiquidityAsc = 'POOL_HOUR_DATA_STDDEV_POPULATION_LIQUIDITY_ASC',
  PoolHourDataStddevPopulationLiquidityDesc = 'POOL_HOUR_DATA_STDDEV_POPULATION_LIQUIDITY_DESC',
  PoolHourDataStddevPopulationPoolIdAsc = 'POOL_HOUR_DATA_STDDEV_POPULATION_POOL_ID_ASC',
  PoolHourDataStddevPopulationPoolIdDesc = 'POOL_HOUR_DATA_STDDEV_POPULATION_POOL_ID_DESC',
  PoolHourDataStddevPopulationSqrtPriceAsc = 'POOL_HOUR_DATA_STDDEV_POPULATION_SQRT_PRICE_ASC',
  PoolHourDataStddevPopulationSqrtPriceDesc = 'POOL_HOUR_DATA_STDDEV_POPULATION_SQRT_PRICE_DESC',
  PoolHourDataStddevPopulationTvlUSDAsc = 'POOL_HOUR_DATA_STDDEV_POPULATION_TVL_U_S_D_ASC',
  PoolHourDataStddevPopulationTvlUSDDesc = 'POOL_HOUR_DATA_STDDEV_POPULATION_TVL_U_S_D_DESC',
  PoolHourDataStddevPopulationTxCountAsc = 'POOL_HOUR_DATA_STDDEV_POPULATION_TX_COUNT_ASC',
  PoolHourDataStddevPopulationTxCountDesc = 'POOL_HOUR_DATA_STDDEV_POPULATION_TX_COUNT_DESC',
  PoolHourDataStddevPopulationVolumeTokenXAsc = 'POOL_HOUR_DATA_STDDEV_POPULATION_VOLUME_TOKEN_X_ASC',
  PoolHourDataStddevPopulationVolumeTokenXDesc = 'POOL_HOUR_DATA_STDDEV_POPULATION_VOLUME_TOKEN_X_DESC',
  PoolHourDataStddevPopulationVolumeTokenYAsc = 'POOL_HOUR_DATA_STDDEV_POPULATION_VOLUME_TOKEN_Y_ASC',
  PoolHourDataStddevPopulationVolumeTokenYDesc = 'POOL_HOUR_DATA_STDDEV_POPULATION_VOLUME_TOKEN_Y_DESC',
  PoolHourDataStddevPopulationVolumeUSDAsc = 'POOL_HOUR_DATA_STDDEV_POPULATION_VOLUME_U_S_D_ASC',
  PoolHourDataStddevPopulationVolumeUSDDesc = 'POOL_HOUR_DATA_STDDEV_POPULATION_VOLUME_U_S_D_DESC',
  PoolHourDataStddevSampleBlockRangeAsc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  PoolHourDataStddevSampleBlockRangeDesc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  PoolHourDataStddevSampleCurrentTickAsc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_CURRENT_TICK_ASC',
  PoolHourDataStddevSampleCurrentTickDesc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_CURRENT_TICK_DESC',
  PoolHourDataStddevSampleFeesUSDAsc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_FEES_U_S_D_ASC',
  PoolHourDataStddevSampleFeesUSDDesc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_FEES_U_S_D_DESC',
  PoolHourDataStddevSampleHourIndexAsc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_HOUR_INDEX_ASC',
  PoolHourDataStddevSampleHourIndexDesc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_HOUR_INDEX_DESC',
  PoolHourDataStddevSampleIdAsc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_ID_ASC',
  PoolHourDataStddevSampleIdDesc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_ID_DESC',
  PoolHourDataStddevSampleLiquidityAsc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_LIQUIDITY_ASC',
  PoolHourDataStddevSampleLiquidityDesc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_LIQUIDITY_DESC',
  PoolHourDataStddevSamplePoolIdAsc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_POOL_ID_ASC',
  PoolHourDataStddevSamplePoolIdDesc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_POOL_ID_DESC',
  PoolHourDataStddevSampleSqrtPriceAsc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_SQRT_PRICE_ASC',
  PoolHourDataStddevSampleSqrtPriceDesc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_SQRT_PRICE_DESC',
  PoolHourDataStddevSampleTvlUSDAsc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_TVL_U_S_D_ASC',
  PoolHourDataStddevSampleTvlUSDDesc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_TVL_U_S_D_DESC',
  PoolHourDataStddevSampleTxCountAsc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_TX_COUNT_ASC',
  PoolHourDataStddevSampleTxCountDesc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_TX_COUNT_DESC',
  PoolHourDataStddevSampleVolumeTokenXAsc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_VOLUME_TOKEN_X_ASC',
  PoolHourDataStddevSampleVolumeTokenXDesc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_VOLUME_TOKEN_X_DESC',
  PoolHourDataStddevSampleVolumeTokenYAsc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_VOLUME_TOKEN_Y_ASC',
  PoolHourDataStddevSampleVolumeTokenYDesc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_VOLUME_TOKEN_Y_DESC',
  PoolHourDataStddevSampleVolumeUSDAsc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_VOLUME_U_S_D_ASC',
  PoolHourDataStddevSampleVolumeUSDDesc = 'POOL_HOUR_DATA_STDDEV_SAMPLE_VOLUME_U_S_D_DESC',
  PoolHourDataSumBlockRangeAsc = 'POOL_HOUR_DATA_SUM_BLOCK_RANGE_ASC',
  PoolHourDataSumBlockRangeDesc = 'POOL_HOUR_DATA_SUM_BLOCK_RANGE_DESC',
  PoolHourDataSumCurrentTickAsc = 'POOL_HOUR_DATA_SUM_CURRENT_TICK_ASC',
  PoolHourDataSumCurrentTickDesc = 'POOL_HOUR_DATA_SUM_CURRENT_TICK_DESC',
  PoolHourDataSumFeesUSDAsc = 'POOL_HOUR_DATA_SUM_FEES_U_S_D_ASC',
  PoolHourDataSumFeesUSDDesc = 'POOL_HOUR_DATA_SUM_FEES_U_S_D_DESC',
  PoolHourDataSumHourIndexAsc = 'POOL_HOUR_DATA_SUM_HOUR_INDEX_ASC',
  PoolHourDataSumHourIndexDesc = 'POOL_HOUR_DATA_SUM_HOUR_INDEX_DESC',
  PoolHourDataSumIdAsc = 'POOL_HOUR_DATA_SUM_ID_ASC',
  PoolHourDataSumIdDesc = 'POOL_HOUR_DATA_SUM_ID_DESC',
  PoolHourDataSumLiquidityAsc = 'POOL_HOUR_DATA_SUM_LIQUIDITY_ASC',
  PoolHourDataSumLiquidityDesc = 'POOL_HOUR_DATA_SUM_LIQUIDITY_DESC',
  PoolHourDataSumPoolIdAsc = 'POOL_HOUR_DATA_SUM_POOL_ID_ASC',
  PoolHourDataSumPoolIdDesc = 'POOL_HOUR_DATA_SUM_POOL_ID_DESC',
  PoolHourDataSumSqrtPriceAsc = 'POOL_HOUR_DATA_SUM_SQRT_PRICE_ASC',
  PoolHourDataSumSqrtPriceDesc = 'POOL_HOUR_DATA_SUM_SQRT_PRICE_DESC',
  PoolHourDataSumTvlUSDAsc = 'POOL_HOUR_DATA_SUM_TVL_U_S_D_ASC',
  PoolHourDataSumTvlUSDDesc = 'POOL_HOUR_DATA_SUM_TVL_U_S_D_DESC',
  PoolHourDataSumTxCountAsc = 'POOL_HOUR_DATA_SUM_TX_COUNT_ASC',
  PoolHourDataSumTxCountDesc = 'POOL_HOUR_DATA_SUM_TX_COUNT_DESC',
  PoolHourDataSumVolumeTokenXAsc = 'POOL_HOUR_DATA_SUM_VOLUME_TOKEN_X_ASC',
  PoolHourDataSumVolumeTokenXDesc = 'POOL_HOUR_DATA_SUM_VOLUME_TOKEN_X_DESC',
  PoolHourDataSumVolumeTokenYAsc = 'POOL_HOUR_DATA_SUM_VOLUME_TOKEN_Y_ASC',
  PoolHourDataSumVolumeTokenYDesc = 'POOL_HOUR_DATA_SUM_VOLUME_TOKEN_Y_DESC',
  PoolHourDataSumVolumeUSDAsc = 'POOL_HOUR_DATA_SUM_VOLUME_U_S_D_ASC',
  PoolHourDataSumVolumeUSDDesc = 'POOL_HOUR_DATA_SUM_VOLUME_U_S_D_DESC',
  PoolHourDataVariancePopulationBlockRangeAsc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  PoolHourDataVariancePopulationBlockRangeDesc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  PoolHourDataVariancePopulationCurrentTickAsc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_CURRENT_TICK_ASC',
  PoolHourDataVariancePopulationCurrentTickDesc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_CURRENT_TICK_DESC',
  PoolHourDataVariancePopulationFeesUSDAsc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_FEES_U_S_D_ASC',
  PoolHourDataVariancePopulationFeesUSDDesc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_FEES_U_S_D_DESC',
  PoolHourDataVariancePopulationHourIndexAsc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_HOUR_INDEX_ASC',
  PoolHourDataVariancePopulationHourIndexDesc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_HOUR_INDEX_DESC',
  PoolHourDataVariancePopulationIdAsc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_ID_ASC',
  PoolHourDataVariancePopulationIdDesc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_ID_DESC',
  PoolHourDataVariancePopulationLiquidityAsc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_LIQUIDITY_ASC',
  PoolHourDataVariancePopulationLiquidityDesc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_LIQUIDITY_DESC',
  PoolHourDataVariancePopulationPoolIdAsc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_POOL_ID_ASC',
  PoolHourDataVariancePopulationPoolIdDesc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_POOL_ID_DESC',
  PoolHourDataVariancePopulationSqrtPriceAsc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_SQRT_PRICE_ASC',
  PoolHourDataVariancePopulationSqrtPriceDesc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_SQRT_PRICE_DESC',
  PoolHourDataVariancePopulationTvlUSDAsc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_TVL_U_S_D_ASC',
  PoolHourDataVariancePopulationTvlUSDDesc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_TVL_U_S_D_DESC',
  PoolHourDataVariancePopulationTxCountAsc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_TX_COUNT_ASC',
  PoolHourDataVariancePopulationTxCountDesc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_TX_COUNT_DESC',
  PoolHourDataVariancePopulationVolumeTokenXAsc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_VOLUME_TOKEN_X_ASC',
  PoolHourDataVariancePopulationVolumeTokenXDesc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_VOLUME_TOKEN_X_DESC',
  PoolHourDataVariancePopulationVolumeTokenYAsc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_VOLUME_TOKEN_Y_ASC',
  PoolHourDataVariancePopulationVolumeTokenYDesc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_VOLUME_TOKEN_Y_DESC',
  PoolHourDataVariancePopulationVolumeUSDAsc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_VOLUME_U_S_D_ASC',
  PoolHourDataVariancePopulationVolumeUSDDesc = 'POOL_HOUR_DATA_VARIANCE_POPULATION_VOLUME_U_S_D_DESC',
  PoolHourDataVarianceSampleBlockRangeAsc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  PoolHourDataVarianceSampleBlockRangeDesc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  PoolHourDataVarianceSampleCurrentTickAsc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_CURRENT_TICK_ASC',
  PoolHourDataVarianceSampleCurrentTickDesc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_CURRENT_TICK_DESC',
  PoolHourDataVarianceSampleFeesUSDAsc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_FEES_U_S_D_ASC',
  PoolHourDataVarianceSampleFeesUSDDesc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_FEES_U_S_D_DESC',
  PoolHourDataVarianceSampleHourIndexAsc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_HOUR_INDEX_ASC',
  PoolHourDataVarianceSampleHourIndexDesc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_HOUR_INDEX_DESC',
  PoolHourDataVarianceSampleIdAsc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_ID_ASC',
  PoolHourDataVarianceSampleIdDesc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_ID_DESC',
  PoolHourDataVarianceSampleLiquidityAsc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_LIQUIDITY_ASC',
  PoolHourDataVarianceSampleLiquidityDesc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_LIQUIDITY_DESC',
  PoolHourDataVarianceSamplePoolIdAsc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_POOL_ID_ASC',
  PoolHourDataVarianceSamplePoolIdDesc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_POOL_ID_DESC',
  PoolHourDataVarianceSampleSqrtPriceAsc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_SQRT_PRICE_ASC',
  PoolHourDataVarianceSampleSqrtPriceDesc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_SQRT_PRICE_DESC',
  PoolHourDataVarianceSampleTvlUSDAsc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_TVL_U_S_D_ASC',
  PoolHourDataVarianceSampleTvlUSDDesc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_TVL_U_S_D_DESC',
  PoolHourDataVarianceSampleTxCountAsc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_TX_COUNT_ASC',
  PoolHourDataVarianceSampleTxCountDesc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_TX_COUNT_DESC',
  PoolHourDataVarianceSampleVolumeTokenXAsc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_VOLUME_TOKEN_X_ASC',
  PoolHourDataVarianceSampleVolumeTokenXDesc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_VOLUME_TOKEN_X_DESC',
  PoolHourDataVarianceSampleVolumeTokenYAsc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_VOLUME_TOKEN_Y_ASC',
  PoolHourDataVarianceSampleVolumeTokenYDesc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_VOLUME_TOKEN_Y_DESC',
  PoolHourDataVarianceSampleVolumeUSDAsc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_VOLUME_U_S_D_ASC',
  PoolHourDataVarianceSampleVolumeUSDDesc = 'POOL_HOUR_DATA_VARIANCE_SAMPLE_VOLUME_U_S_D_DESC',
  PoolTokenIncentivesAverageBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_BLOCK_RANGE_ASC',
  PoolTokenIncentivesAverageBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_BLOCK_RANGE_DESC',
  PoolTokenIncentivesAverageIdAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_ID_ASC',
  PoolTokenIncentivesAverageIdDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_ID_DESC',
  PoolTokenIncentivesAverageIndexAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_INDEX_ASC',
  PoolTokenIncentivesAverageIndexDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_INDEX_DESC',
  PoolTokenIncentivesAveragePoolIdAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_POOL_ID_ASC',
  PoolTokenIncentivesAveragePoolIdDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_POOL_ID_DESC',
  PoolTokenIncentivesAverageRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesAverageRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesAverageStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_START_TIMESTAMP_ASC',
  PoolTokenIncentivesAverageStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_START_TIMESTAMP_DESC',
  PoolTokenIncentivesAverageTokenIdAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_TOKEN_ID_ASC',
  PoolTokenIncentivesAverageTokenIdDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_TOKEN_ID_DESC',
  PoolTokenIncentivesAverageTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_TOTAL_REWARD_ASC',
  PoolTokenIncentivesAverageTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_TOTAL_REWARD_DESC',
  PoolTokenIncentivesAverageTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_TRANSACTION_ID_ASC',
  PoolTokenIncentivesAverageTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_TRANSACTION_ID_DESC',
  PoolTokenIncentivesCountAsc = 'POOL_TOKEN_INCENTIVES_COUNT_ASC',
  PoolTokenIncentivesCountDesc = 'POOL_TOKEN_INCENTIVES_COUNT_DESC',
  PoolTokenIncentivesDistinctCountBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  PoolTokenIncentivesDistinctCountBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  PoolTokenIncentivesDistinctCountIdAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_ID_ASC',
  PoolTokenIncentivesDistinctCountIdDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_ID_DESC',
  PoolTokenIncentivesDistinctCountIndexAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_INDEX_ASC',
  PoolTokenIncentivesDistinctCountIndexDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_INDEX_DESC',
  PoolTokenIncentivesDistinctCountPoolIdAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_POOL_ID_ASC',
  PoolTokenIncentivesDistinctCountPoolIdDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_POOL_ID_DESC',
  PoolTokenIncentivesDistinctCountRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesDistinctCountRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesDistinctCountStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_START_TIMESTAMP_ASC',
  PoolTokenIncentivesDistinctCountStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_START_TIMESTAMP_DESC',
  PoolTokenIncentivesDistinctCountTokenIdAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_TOKEN_ID_ASC',
  PoolTokenIncentivesDistinctCountTokenIdDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_TOKEN_ID_DESC',
  PoolTokenIncentivesDistinctCountTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_TOTAL_REWARD_ASC',
  PoolTokenIncentivesDistinctCountTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_TOTAL_REWARD_DESC',
  PoolTokenIncentivesDistinctCountTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_TRANSACTION_ID_ASC',
  PoolTokenIncentivesDistinctCountTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_TRANSACTION_ID_DESC',
  PoolTokenIncentivesMaxBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_MAX_BLOCK_RANGE_ASC',
  PoolTokenIncentivesMaxBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_MAX_BLOCK_RANGE_DESC',
  PoolTokenIncentivesMaxIdAsc = 'POOL_TOKEN_INCENTIVES_MAX_ID_ASC',
  PoolTokenIncentivesMaxIdDesc = 'POOL_TOKEN_INCENTIVES_MAX_ID_DESC',
  PoolTokenIncentivesMaxIndexAsc = 'POOL_TOKEN_INCENTIVES_MAX_INDEX_ASC',
  PoolTokenIncentivesMaxIndexDesc = 'POOL_TOKEN_INCENTIVES_MAX_INDEX_DESC',
  PoolTokenIncentivesMaxPoolIdAsc = 'POOL_TOKEN_INCENTIVES_MAX_POOL_ID_ASC',
  PoolTokenIncentivesMaxPoolIdDesc = 'POOL_TOKEN_INCENTIVES_MAX_POOL_ID_DESC',
  PoolTokenIncentivesMaxRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_MAX_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesMaxRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_MAX_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesMaxStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_MAX_START_TIMESTAMP_ASC',
  PoolTokenIncentivesMaxStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_MAX_START_TIMESTAMP_DESC',
  PoolTokenIncentivesMaxTokenIdAsc = 'POOL_TOKEN_INCENTIVES_MAX_TOKEN_ID_ASC',
  PoolTokenIncentivesMaxTokenIdDesc = 'POOL_TOKEN_INCENTIVES_MAX_TOKEN_ID_DESC',
  PoolTokenIncentivesMaxTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_MAX_TOTAL_REWARD_ASC',
  PoolTokenIncentivesMaxTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_MAX_TOTAL_REWARD_DESC',
  PoolTokenIncentivesMaxTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_MAX_TRANSACTION_ID_ASC',
  PoolTokenIncentivesMaxTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_MAX_TRANSACTION_ID_DESC',
  PoolTokenIncentivesMinBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_MIN_BLOCK_RANGE_ASC',
  PoolTokenIncentivesMinBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_MIN_BLOCK_RANGE_DESC',
  PoolTokenIncentivesMinIdAsc = 'POOL_TOKEN_INCENTIVES_MIN_ID_ASC',
  PoolTokenIncentivesMinIdDesc = 'POOL_TOKEN_INCENTIVES_MIN_ID_DESC',
  PoolTokenIncentivesMinIndexAsc = 'POOL_TOKEN_INCENTIVES_MIN_INDEX_ASC',
  PoolTokenIncentivesMinIndexDesc = 'POOL_TOKEN_INCENTIVES_MIN_INDEX_DESC',
  PoolTokenIncentivesMinPoolIdAsc = 'POOL_TOKEN_INCENTIVES_MIN_POOL_ID_ASC',
  PoolTokenIncentivesMinPoolIdDesc = 'POOL_TOKEN_INCENTIVES_MIN_POOL_ID_DESC',
  PoolTokenIncentivesMinRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_MIN_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesMinRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_MIN_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesMinStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_MIN_START_TIMESTAMP_ASC',
  PoolTokenIncentivesMinStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_MIN_START_TIMESTAMP_DESC',
  PoolTokenIncentivesMinTokenIdAsc = 'POOL_TOKEN_INCENTIVES_MIN_TOKEN_ID_ASC',
  PoolTokenIncentivesMinTokenIdDesc = 'POOL_TOKEN_INCENTIVES_MIN_TOKEN_ID_DESC',
  PoolTokenIncentivesMinTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_MIN_TOTAL_REWARD_ASC',
  PoolTokenIncentivesMinTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_MIN_TOTAL_REWARD_DESC',
  PoolTokenIncentivesMinTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_MIN_TRANSACTION_ID_ASC',
  PoolTokenIncentivesMinTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_MIN_TRANSACTION_ID_DESC',
  PoolTokenIncentivesStddevPopulationBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  PoolTokenIncentivesStddevPopulationBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  PoolTokenIncentivesStddevPopulationIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_ID_ASC',
  PoolTokenIncentivesStddevPopulationIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_ID_DESC',
  PoolTokenIncentivesStddevPopulationIndexAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_INDEX_ASC',
  PoolTokenIncentivesStddevPopulationIndexDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_INDEX_DESC',
  PoolTokenIncentivesStddevPopulationPoolIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_POOL_ID_ASC',
  PoolTokenIncentivesStddevPopulationPoolIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_POOL_ID_DESC',
  PoolTokenIncentivesStddevPopulationRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesStddevPopulationRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesStddevPopulationStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_START_TIMESTAMP_ASC',
  PoolTokenIncentivesStddevPopulationStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_START_TIMESTAMP_DESC',
  PoolTokenIncentivesStddevPopulationTokenIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_TOKEN_ID_ASC',
  PoolTokenIncentivesStddevPopulationTokenIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_TOKEN_ID_DESC',
  PoolTokenIncentivesStddevPopulationTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_TOTAL_REWARD_ASC',
  PoolTokenIncentivesStddevPopulationTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_TOTAL_REWARD_DESC',
  PoolTokenIncentivesStddevPopulationTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_TRANSACTION_ID_ASC',
  PoolTokenIncentivesStddevPopulationTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_TRANSACTION_ID_DESC',
  PoolTokenIncentivesStddevSampleBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  PoolTokenIncentivesStddevSampleBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  PoolTokenIncentivesStddevSampleIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_ID_ASC',
  PoolTokenIncentivesStddevSampleIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_ID_DESC',
  PoolTokenIncentivesStddevSampleIndexAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_INDEX_ASC',
  PoolTokenIncentivesStddevSampleIndexDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_INDEX_DESC',
  PoolTokenIncentivesStddevSamplePoolIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_POOL_ID_ASC',
  PoolTokenIncentivesStddevSamplePoolIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_POOL_ID_DESC',
  PoolTokenIncentivesStddevSampleRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesStddevSampleRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesStddevSampleStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_START_TIMESTAMP_ASC',
  PoolTokenIncentivesStddevSampleStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_START_TIMESTAMP_DESC',
  PoolTokenIncentivesStddevSampleTokenIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_TOKEN_ID_ASC',
  PoolTokenIncentivesStddevSampleTokenIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_TOKEN_ID_DESC',
  PoolTokenIncentivesStddevSampleTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_TOTAL_REWARD_ASC',
  PoolTokenIncentivesStddevSampleTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_TOTAL_REWARD_DESC',
  PoolTokenIncentivesStddevSampleTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_TRANSACTION_ID_ASC',
  PoolTokenIncentivesStddevSampleTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_TRANSACTION_ID_DESC',
  PoolTokenIncentivesSumBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_SUM_BLOCK_RANGE_ASC',
  PoolTokenIncentivesSumBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_SUM_BLOCK_RANGE_DESC',
  PoolTokenIncentivesSumIdAsc = 'POOL_TOKEN_INCENTIVES_SUM_ID_ASC',
  PoolTokenIncentivesSumIdDesc = 'POOL_TOKEN_INCENTIVES_SUM_ID_DESC',
  PoolTokenIncentivesSumIndexAsc = 'POOL_TOKEN_INCENTIVES_SUM_INDEX_ASC',
  PoolTokenIncentivesSumIndexDesc = 'POOL_TOKEN_INCENTIVES_SUM_INDEX_DESC',
  PoolTokenIncentivesSumPoolIdAsc = 'POOL_TOKEN_INCENTIVES_SUM_POOL_ID_ASC',
  PoolTokenIncentivesSumPoolIdDesc = 'POOL_TOKEN_INCENTIVES_SUM_POOL_ID_DESC',
  PoolTokenIncentivesSumRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_SUM_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesSumRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_SUM_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesSumStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_SUM_START_TIMESTAMP_ASC',
  PoolTokenIncentivesSumStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_SUM_START_TIMESTAMP_DESC',
  PoolTokenIncentivesSumTokenIdAsc = 'POOL_TOKEN_INCENTIVES_SUM_TOKEN_ID_ASC',
  PoolTokenIncentivesSumTokenIdDesc = 'POOL_TOKEN_INCENTIVES_SUM_TOKEN_ID_DESC',
  PoolTokenIncentivesSumTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_SUM_TOTAL_REWARD_ASC',
  PoolTokenIncentivesSumTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_SUM_TOTAL_REWARD_DESC',
  PoolTokenIncentivesSumTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_SUM_TRANSACTION_ID_ASC',
  PoolTokenIncentivesSumTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_SUM_TRANSACTION_ID_DESC',
  PoolTokenIncentivesVariancePopulationBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  PoolTokenIncentivesVariancePopulationBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  PoolTokenIncentivesVariancePopulationIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_ID_ASC',
  PoolTokenIncentivesVariancePopulationIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_ID_DESC',
  PoolTokenIncentivesVariancePopulationIndexAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_INDEX_ASC',
  PoolTokenIncentivesVariancePopulationIndexDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_INDEX_DESC',
  PoolTokenIncentivesVariancePopulationPoolIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_POOL_ID_ASC',
  PoolTokenIncentivesVariancePopulationPoolIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_POOL_ID_DESC',
  PoolTokenIncentivesVariancePopulationRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesVariancePopulationRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesVariancePopulationStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_START_TIMESTAMP_ASC',
  PoolTokenIncentivesVariancePopulationStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_START_TIMESTAMP_DESC',
  PoolTokenIncentivesVariancePopulationTokenIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_TOKEN_ID_ASC',
  PoolTokenIncentivesVariancePopulationTokenIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_TOKEN_ID_DESC',
  PoolTokenIncentivesVariancePopulationTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_TOTAL_REWARD_ASC',
  PoolTokenIncentivesVariancePopulationTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_TOTAL_REWARD_DESC',
  PoolTokenIncentivesVariancePopulationTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_TRANSACTION_ID_ASC',
  PoolTokenIncentivesVariancePopulationTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_TRANSACTION_ID_DESC',
  PoolTokenIncentivesVarianceSampleBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  PoolTokenIncentivesVarianceSampleBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  PoolTokenIncentivesVarianceSampleIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_ID_ASC',
  PoolTokenIncentivesVarianceSampleIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_ID_DESC',
  PoolTokenIncentivesVarianceSampleIndexAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_INDEX_ASC',
  PoolTokenIncentivesVarianceSampleIndexDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_INDEX_DESC',
  PoolTokenIncentivesVarianceSamplePoolIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_POOL_ID_ASC',
  PoolTokenIncentivesVarianceSamplePoolIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_POOL_ID_DESC',
  PoolTokenIncentivesVarianceSampleRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesVarianceSampleRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesVarianceSampleStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_START_TIMESTAMP_ASC',
  PoolTokenIncentivesVarianceSampleStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_START_TIMESTAMP_DESC',
  PoolTokenIncentivesVarianceSampleTokenIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_TOKEN_ID_ASC',
  PoolTokenIncentivesVarianceSampleTokenIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_TOKEN_ID_DESC',
  PoolTokenIncentivesVarianceSampleTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_TOTAL_REWARD_ASC',
  PoolTokenIncentivesVarianceSampleTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_TOTAL_REWARD_DESC',
  PoolTokenIncentivesVarianceSampleTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_TRANSACTION_ID_ASC',
  PoolTokenIncentivesVarianceSampleTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_TRANSACTION_ID_DESC',
  PositionsAverageBlockRangeAsc = 'POSITIONS_AVERAGE_BLOCK_RANGE_ASC',
  PositionsAverageBlockRangeDesc = 'POSITIONS_AVERAGE_BLOCK_RANGE_DESC',
  PositionsAverageClosedAtAsc = 'POSITIONS_AVERAGE_CLOSED_AT_ASC',
  PositionsAverageClosedAtDesc = 'POSITIONS_AVERAGE_CLOSED_AT_DESC',
  PositionsAverageCreatedAtAsc = 'POSITIONS_AVERAGE_CREATED_AT_ASC',
  PositionsAverageCreatedAtDesc = 'POSITIONS_AVERAGE_CREATED_AT_DESC',
  PositionsAverageIdAsc = 'POSITIONS_AVERAGE_ID_ASC',
  PositionsAverageIdDesc = 'POSITIONS_AVERAGE_ID_DESC',
  PositionsAverageLiquidityAsc = 'POSITIONS_AVERAGE_LIQUIDITY_ASC',
  PositionsAverageLiquidityDesc = 'POSITIONS_AVERAGE_LIQUIDITY_DESC',
  PositionsAverageOwnerIdAsc = 'POSITIONS_AVERAGE_OWNER_ID_ASC',
  PositionsAverageOwnerIdDesc = 'POSITIONS_AVERAGE_OWNER_ID_DESC',
  PositionsAveragePoolIdAsc = 'POSITIONS_AVERAGE_POOL_ID_ASC',
  PositionsAveragePoolIdDesc = 'POSITIONS_AVERAGE_POOL_ID_DESC',
  PositionsAveragePrincipalAmountXAsc = 'POSITIONS_AVERAGE_PRINCIPAL_AMOUNT_X_ASC',
  PositionsAveragePrincipalAmountXDesc = 'POSITIONS_AVERAGE_PRINCIPAL_AMOUNT_X_DESC',
  PositionsAveragePrincipalAmountYAsc = 'POSITIONS_AVERAGE_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsAveragePrincipalAmountYDesc = 'POSITIONS_AVERAGE_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsAverageStatusAsc = 'POSITIONS_AVERAGE_STATUS_ASC',
  PositionsAverageStatusDesc = 'POSITIONS_AVERAGE_STATUS_DESC',
  PositionsAverageTickLowerAsc = 'POSITIONS_AVERAGE_TICK_LOWER_ASC',
  PositionsAverageTickLowerDesc = 'POSITIONS_AVERAGE_TICK_LOWER_DESC',
  PositionsAverageTickUpperAsc = 'POSITIONS_AVERAGE_TICK_UPPER_ASC',
  PositionsAverageTickUpperDesc = 'POSITIONS_AVERAGE_TICK_UPPER_DESC',
  PositionsAverageTokenIdAsc = 'POSITIONS_AVERAGE_TOKEN_ID_ASC',
  PositionsAverageTokenIdDesc = 'POSITIONS_AVERAGE_TOKEN_ID_DESC',
  PositionsAverageTransactionIdAsc = 'POSITIONS_AVERAGE_TRANSACTION_ID_ASC',
  PositionsAverageTransactionIdDesc = 'POSITIONS_AVERAGE_TRANSACTION_ID_DESC',
  PositionsCountAsc = 'POSITIONS_COUNT_ASC',
  PositionsCountDesc = 'POSITIONS_COUNT_DESC',
  PositionsDistinctCountBlockRangeAsc = 'POSITIONS_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  PositionsDistinctCountBlockRangeDesc = 'POSITIONS_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  PositionsDistinctCountClosedAtAsc = 'POSITIONS_DISTINCT_COUNT_CLOSED_AT_ASC',
  PositionsDistinctCountClosedAtDesc = 'POSITIONS_DISTINCT_COUNT_CLOSED_AT_DESC',
  PositionsDistinctCountCreatedAtAsc = 'POSITIONS_DISTINCT_COUNT_CREATED_AT_ASC',
  PositionsDistinctCountCreatedAtDesc = 'POSITIONS_DISTINCT_COUNT_CREATED_AT_DESC',
  PositionsDistinctCountIdAsc = 'POSITIONS_DISTINCT_COUNT_ID_ASC',
  PositionsDistinctCountIdDesc = 'POSITIONS_DISTINCT_COUNT_ID_DESC',
  PositionsDistinctCountLiquidityAsc = 'POSITIONS_DISTINCT_COUNT_LIQUIDITY_ASC',
  PositionsDistinctCountLiquidityDesc = 'POSITIONS_DISTINCT_COUNT_LIQUIDITY_DESC',
  PositionsDistinctCountOwnerIdAsc = 'POSITIONS_DISTINCT_COUNT_OWNER_ID_ASC',
  PositionsDistinctCountOwnerIdDesc = 'POSITIONS_DISTINCT_COUNT_OWNER_ID_DESC',
  PositionsDistinctCountPoolIdAsc = 'POSITIONS_DISTINCT_COUNT_POOL_ID_ASC',
  PositionsDistinctCountPoolIdDesc = 'POSITIONS_DISTINCT_COUNT_POOL_ID_DESC',
  PositionsDistinctCountPrincipalAmountXAsc = 'POSITIONS_DISTINCT_COUNT_PRINCIPAL_AMOUNT_X_ASC',
  PositionsDistinctCountPrincipalAmountXDesc = 'POSITIONS_DISTINCT_COUNT_PRINCIPAL_AMOUNT_X_DESC',
  PositionsDistinctCountPrincipalAmountYAsc = 'POSITIONS_DISTINCT_COUNT_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsDistinctCountPrincipalAmountYDesc = 'POSITIONS_DISTINCT_COUNT_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsDistinctCountStatusAsc = 'POSITIONS_DISTINCT_COUNT_STATUS_ASC',
  PositionsDistinctCountStatusDesc = 'POSITIONS_DISTINCT_COUNT_STATUS_DESC',
  PositionsDistinctCountTickLowerAsc = 'POSITIONS_DISTINCT_COUNT_TICK_LOWER_ASC',
  PositionsDistinctCountTickLowerDesc = 'POSITIONS_DISTINCT_COUNT_TICK_LOWER_DESC',
  PositionsDistinctCountTickUpperAsc = 'POSITIONS_DISTINCT_COUNT_TICK_UPPER_ASC',
  PositionsDistinctCountTickUpperDesc = 'POSITIONS_DISTINCT_COUNT_TICK_UPPER_DESC',
  PositionsDistinctCountTokenIdAsc = 'POSITIONS_DISTINCT_COUNT_TOKEN_ID_ASC',
  PositionsDistinctCountTokenIdDesc = 'POSITIONS_DISTINCT_COUNT_TOKEN_ID_DESC',
  PositionsDistinctCountTransactionIdAsc = 'POSITIONS_DISTINCT_COUNT_TRANSACTION_ID_ASC',
  PositionsDistinctCountTransactionIdDesc = 'POSITIONS_DISTINCT_COUNT_TRANSACTION_ID_DESC',
  PositionsMaxBlockRangeAsc = 'POSITIONS_MAX_BLOCK_RANGE_ASC',
  PositionsMaxBlockRangeDesc = 'POSITIONS_MAX_BLOCK_RANGE_DESC',
  PositionsMaxClosedAtAsc = 'POSITIONS_MAX_CLOSED_AT_ASC',
  PositionsMaxClosedAtDesc = 'POSITIONS_MAX_CLOSED_AT_DESC',
  PositionsMaxCreatedAtAsc = 'POSITIONS_MAX_CREATED_AT_ASC',
  PositionsMaxCreatedAtDesc = 'POSITIONS_MAX_CREATED_AT_DESC',
  PositionsMaxIdAsc = 'POSITIONS_MAX_ID_ASC',
  PositionsMaxIdDesc = 'POSITIONS_MAX_ID_DESC',
  PositionsMaxLiquidityAsc = 'POSITIONS_MAX_LIQUIDITY_ASC',
  PositionsMaxLiquidityDesc = 'POSITIONS_MAX_LIQUIDITY_DESC',
  PositionsMaxOwnerIdAsc = 'POSITIONS_MAX_OWNER_ID_ASC',
  PositionsMaxOwnerIdDesc = 'POSITIONS_MAX_OWNER_ID_DESC',
  PositionsMaxPoolIdAsc = 'POSITIONS_MAX_POOL_ID_ASC',
  PositionsMaxPoolIdDesc = 'POSITIONS_MAX_POOL_ID_DESC',
  PositionsMaxPrincipalAmountXAsc = 'POSITIONS_MAX_PRINCIPAL_AMOUNT_X_ASC',
  PositionsMaxPrincipalAmountXDesc = 'POSITIONS_MAX_PRINCIPAL_AMOUNT_X_DESC',
  PositionsMaxPrincipalAmountYAsc = 'POSITIONS_MAX_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsMaxPrincipalAmountYDesc = 'POSITIONS_MAX_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsMaxStatusAsc = 'POSITIONS_MAX_STATUS_ASC',
  PositionsMaxStatusDesc = 'POSITIONS_MAX_STATUS_DESC',
  PositionsMaxTickLowerAsc = 'POSITIONS_MAX_TICK_LOWER_ASC',
  PositionsMaxTickLowerDesc = 'POSITIONS_MAX_TICK_LOWER_DESC',
  PositionsMaxTickUpperAsc = 'POSITIONS_MAX_TICK_UPPER_ASC',
  PositionsMaxTickUpperDesc = 'POSITIONS_MAX_TICK_UPPER_DESC',
  PositionsMaxTokenIdAsc = 'POSITIONS_MAX_TOKEN_ID_ASC',
  PositionsMaxTokenIdDesc = 'POSITIONS_MAX_TOKEN_ID_DESC',
  PositionsMaxTransactionIdAsc = 'POSITIONS_MAX_TRANSACTION_ID_ASC',
  PositionsMaxTransactionIdDesc = 'POSITIONS_MAX_TRANSACTION_ID_DESC',
  PositionsMinBlockRangeAsc = 'POSITIONS_MIN_BLOCK_RANGE_ASC',
  PositionsMinBlockRangeDesc = 'POSITIONS_MIN_BLOCK_RANGE_DESC',
  PositionsMinClosedAtAsc = 'POSITIONS_MIN_CLOSED_AT_ASC',
  PositionsMinClosedAtDesc = 'POSITIONS_MIN_CLOSED_AT_DESC',
  PositionsMinCreatedAtAsc = 'POSITIONS_MIN_CREATED_AT_ASC',
  PositionsMinCreatedAtDesc = 'POSITIONS_MIN_CREATED_AT_DESC',
  PositionsMinIdAsc = 'POSITIONS_MIN_ID_ASC',
  PositionsMinIdDesc = 'POSITIONS_MIN_ID_DESC',
  PositionsMinLiquidityAsc = 'POSITIONS_MIN_LIQUIDITY_ASC',
  PositionsMinLiquidityDesc = 'POSITIONS_MIN_LIQUIDITY_DESC',
  PositionsMinOwnerIdAsc = 'POSITIONS_MIN_OWNER_ID_ASC',
  PositionsMinOwnerIdDesc = 'POSITIONS_MIN_OWNER_ID_DESC',
  PositionsMinPoolIdAsc = 'POSITIONS_MIN_POOL_ID_ASC',
  PositionsMinPoolIdDesc = 'POSITIONS_MIN_POOL_ID_DESC',
  PositionsMinPrincipalAmountXAsc = 'POSITIONS_MIN_PRINCIPAL_AMOUNT_X_ASC',
  PositionsMinPrincipalAmountXDesc = 'POSITIONS_MIN_PRINCIPAL_AMOUNT_X_DESC',
  PositionsMinPrincipalAmountYAsc = 'POSITIONS_MIN_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsMinPrincipalAmountYDesc = 'POSITIONS_MIN_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsMinStatusAsc = 'POSITIONS_MIN_STATUS_ASC',
  PositionsMinStatusDesc = 'POSITIONS_MIN_STATUS_DESC',
  PositionsMinTickLowerAsc = 'POSITIONS_MIN_TICK_LOWER_ASC',
  PositionsMinTickLowerDesc = 'POSITIONS_MIN_TICK_LOWER_DESC',
  PositionsMinTickUpperAsc = 'POSITIONS_MIN_TICK_UPPER_ASC',
  PositionsMinTickUpperDesc = 'POSITIONS_MIN_TICK_UPPER_DESC',
  PositionsMinTokenIdAsc = 'POSITIONS_MIN_TOKEN_ID_ASC',
  PositionsMinTokenIdDesc = 'POSITIONS_MIN_TOKEN_ID_DESC',
  PositionsMinTransactionIdAsc = 'POSITIONS_MIN_TRANSACTION_ID_ASC',
  PositionsMinTransactionIdDesc = 'POSITIONS_MIN_TRANSACTION_ID_DESC',
  PositionsStddevPopulationBlockRangeAsc = 'POSITIONS_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  PositionsStddevPopulationBlockRangeDesc = 'POSITIONS_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  PositionsStddevPopulationClosedAtAsc = 'POSITIONS_STDDEV_POPULATION_CLOSED_AT_ASC',
  PositionsStddevPopulationClosedAtDesc = 'POSITIONS_STDDEV_POPULATION_CLOSED_AT_DESC',
  PositionsStddevPopulationCreatedAtAsc = 'POSITIONS_STDDEV_POPULATION_CREATED_AT_ASC',
  PositionsStddevPopulationCreatedAtDesc = 'POSITIONS_STDDEV_POPULATION_CREATED_AT_DESC',
  PositionsStddevPopulationIdAsc = 'POSITIONS_STDDEV_POPULATION_ID_ASC',
  PositionsStddevPopulationIdDesc = 'POSITIONS_STDDEV_POPULATION_ID_DESC',
  PositionsStddevPopulationLiquidityAsc = 'POSITIONS_STDDEV_POPULATION_LIQUIDITY_ASC',
  PositionsStddevPopulationLiquidityDesc = 'POSITIONS_STDDEV_POPULATION_LIQUIDITY_DESC',
  PositionsStddevPopulationOwnerIdAsc = 'POSITIONS_STDDEV_POPULATION_OWNER_ID_ASC',
  PositionsStddevPopulationOwnerIdDesc = 'POSITIONS_STDDEV_POPULATION_OWNER_ID_DESC',
  PositionsStddevPopulationPoolIdAsc = 'POSITIONS_STDDEV_POPULATION_POOL_ID_ASC',
  PositionsStddevPopulationPoolIdDesc = 'POSITIONS_STDDEV_POPULATION_POOL_ID_DESC',
  PositionsStddevPopulationPrincipalAmountXAsc = 'POSITIONS_STDDEV_POPULATION_PRINCIPAL_AMOUNT_X_ASC',
  PositionsStddevPopulationPrincipalAmountXDesc = 'POSITIONS_STDDEV_POPULATION_PRINCIPAL_AMOUNT_X_DESC',
  PositionsStddevPopulationPrincipalAmountYAsc = 'POSITIONS_STDDEV_POPULATION_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsStddevPopulationPrincipalAmountYDesc = 'POSITIONS_STDDEV_POPULATION_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsStddevPopulationStatusAsc = 'POSITIONS_STDDEV_POPULATION_STATUS_ASC',
  PositionsStddevPopulationStatusDesc = 'POSITIONS_STDDEV_POPULATION_STATUS_DESC',
  PositionsStddevPopulationTickLowerAsc = 'POSITIONS_STDDEV_POPULATION_TICK_LOWER_ASC',
  PositionsStddevPopulationTickLowerDesc = 'POSITIONS_STDDEV_POPULATION_TICK_LOWER_DESC',
  PositionsStddevPopulationTickUpperAsc = 'POSITIONS_STDDEV_POPULATION_TICK_UPPER_ASC',
  PositionsStddevPopulationTickUpperDesc = 'POSITIONS_STDDEV_POPULATION_TICK_UPPER_DESC',
  PositionsStddevPopulationTokenIdAsc = 'POSITIONS_STDDEV_POPULATION_TOKEN_ID_ASC',
  PositionsStddevPopulationTokenIdDesc = 'POSITIONS_STDDEV_POPULATION_TOKEN_ID_DESC',
  PositionsStddevPopulationTransactionIdAsc = 'POSITIONS_STDDEV_POPULATION_TRANSACTION_ID_ASC',
  PositionsStddevPopulationTransactionIdDesc = 'POSITIONS_STDDEV_POPULATION_TRANSACTION_ID_DESC',
  PositionsStddevSampleBlockRangeAsc = 'POSITIONS_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  PositionsStddevSampleBlockRangeDesc = 'POSITIONS_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  PositionsStddevSampleClosedAtAsc = 'POSITIONS_STDDEV_SAMPLE_CLOSED_AT_ASC',
  PositionsStddevSampleClosedAtDesc = 'POSITIONS_STDDEV_SAMPLE_CLOSED_AT_DESC',
  PositionsStddevSampleCreatedAtAsc = 'POSITIONS_STDDEV_SAMPLE_CREATED_AT_ASC',
  PositionsStddevSampleCreatedAtDesc = 'POSITIONS_STDDEV_SAMPLE_CREATED_AT_DESC',
  PositionsStddevSampleIdAsc = 'POSITIONS_STDDEV_SAMPLE_ID_ASC',
  PositionsStddevSampleIdDesc = 'POSITIONS_STDDEV_SAMPLE_ID_DESC',
  PositionsStddevSampleLiquidityAsc = 'POSITIONS_STDDEV_SAMPLE_LIQUIDITY_ASC',
  PositionsStddevSampleLiquidityDesc = 'POSITIONS_STDDEV_SAMPLE_LIQUIDITY_DESC',
  PositionsStddevSampleOwnerIdAsc = 'POSITIONS_STDDEV_SAMPLE_OWNER_ID_ASC',
  PositionsStddevSampleOwnerIdDesc = 'POSITIONS_STDDEV_SAMPLE_OWNER_ID_DESC',
  PositionsStddevSamplePoolIdAsc = 'POSITIONS_STDDEV_SAMPLE_POOL_ID_ASC',
  PositionsStddevSamplePoolIdDesc = 'POSITIONS_STDDEV_SAMPLE_POOL_ID_DESC',
  PositionsStddevSamplePrincipalAmountXAsc = 'POSITIONS_STDDEV_SAMPLE_PRINCIPAL_AMOUNT_X_ASC',
  PositionsStddevSamplePrincipalAmountXDesc = 'POSITIONS_STDDEV_SAMPLE_PRINCIPAL_AMOUNT_X_DESC',
  PositionsStddevSamplePrincipalAmountYAsc = 'POSITIONS_STDDEV_SAMPLE_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsStddevSamplePrincipalAmountYDesc = 'POSITIONS_STDDEV_SAMPLE_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsStddevSampleStatusAsc = 'POSITIONS_STDDEV_SAMPLE_STATUS_ASC',
  PositionsStddevSampleStatusDesc = 'POSITIONS_STDDEV_SAMPLE_STATUS_DESC',
  PositionsStddevSampleTickLowerAsc = 'POSITIONS_STDDEV_SAMPLE_TICK_LOWER_ASC',
  PositionsStddevSampleTickLowerDesc = 'POSITIONS_STDDEV_SAMPLE_TICK_LOWER_DESC',
  PositionsStddevSampleTickUpperAsc = 'POSITIONS_STDDEV_SAMPLE_TICK_UPPER_ASC',
  PositionsStddevSampleTickUpperDesc = 'POSITIONS_STDDEV_SAMPLE_TICK_UPPER_DESC',
  PositionsStddevSampleTokenIdAsc = 'POSITIONS_STDDEV_SAMPLE_TOKEN_ID_ASC',
  PositionsStddevSampleTokenIdDesc = 'POSITIONS_STDDEV_SAMPLE_TOKEN_ID_DESC',
  PositionsStddevSampleTransactionIdAsc = 'POSITIONS_STDDEV_SAMPLE_TRANSACTION_ID_ASC',
  PositionsStddevSampleTransactionIdDesc = 'POSITIONS_STDDEV_SAMPLE_TRANSACTION_ID_DESC',
  PositionsSumBlockRangeAsc = 'POSITIONS_SUM_BLOCK_RANGE_ASC',
  PositionsSumBlockRangeDesc = 'POSITIONS_SUM_BLOCK_RANGE_DESC',
  PositionsSumClosedAtAsc = 'POSITIONS_SUM_CLOSED_AT_ASC',
  PositionsSumClosedAtDesc = 'POSITIONS_SUM_CLOSED_AT_DESC',
  PositionsSumCreatedAtAsc = 'POSITIONS_SUM_CREATED_AT_ASC',
  PositionsSumCreatedAtDesc = 'POSITIONS_SUM_CREATED_AT_DESC',
  PositionsSumIdAsc = 'POSITIONS_SUM_ID_ASC',
  PositionsSumIdDesc = 'POSITIONS_SUM_ID_DESC',
  PositionsSumLiquidityAsc = 'POSITIONS_SUM_LIQUIDITY_ASC',
  PositionsSumLiquidityDesc = 'POSITIONS_SUM_LIQUIDITY_DESC',
  PositionsSumOwnerIdAsc = 'POSITIONS_SUM_OWNER_ID_ASC',
  PositionsSumOwnerIdDesc = 'POSITIONS_SUM_OWNER_ID_DESC',
  PositionsSumPoolIdAsc = 'POSITIONS_SUM_POOL_ID_ASC',
  PositionsSumPoolIdDesc = 'POSITIONS_SUM_POOL_ID_DESC',
  PositionsSumPrincipalAmountXAsc = 'POSITIONS_SUM_PRINCIPAL_AMOUNT_X_ASC',
  PositionsSumPrincipalAmountXDesc = 'POSITIONS_SUM_PRINCIPAL_AMOUNT_X_DESC',
  PositionsSumPrincipalAmountYAsc = 'POSITIONS_SUM_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsSumPrincipalAmountYDesc = 'POSITIONS_SUM_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsSumStatusAsc = 'POSITIONS_SUM_STATUS_ASC',
  PositionsSumStatusDesc = 'POSITIONS_SUM_STATUS_DESC',
  PositionsSumTickLowerAsc = 'POSITIONS_SUM_TICK_LOWER_ASC',
  PositionsSumTickLowerDesc = 'POSITIONS_SUM_TICK_LOWER_DESC',
  PositionsSumTickUpperAsc = 'POSITIONS_SUM_TICK_UPPER_ASC',
  PositionsSumTickUpperDesc = 'POSITIONS_SUM_TICK_UPPER_DESC',
  PositionsSumTokenIdAsc = 'POSITIONS_SUM_TOKEN_ID_ASC',
  PositionsSumTokenIdDesc = 'POSITIONS_SUM_TOKEN_ID_DESC',
  PositionsSumTransactionIdAsc = 'POSITIONS_SUM_TRANSACTION_ID_ASC',
  PositionsSumTransactionIdDesc = 'POSITIONS_SUM_TRANSACTION_ID_DESC',
  PositionsVariancePopulationBlockRangeAsc = 'POSITIONS_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  PositionsVariancePopulationBlockRangeDesc = 'POSITIONS_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  PositionsVariancePopulationClosedAtAsc = 'POSITIONS_VARIANCE_POPULATION_CLOSED_AT_ASC',
  PositionsVariancePopulationClosedAtDesc = 'POSITIONS_VARIANCE_POPULATION_CLOSED_AT_DESC',
  PositionsVariancePopulationCreatedAtAsc = 'POSITIONS_VARIANCE_POPULATION_CREATED_AT_ASC',
  PositionsVariancePopulationCreatedAtDesc = 'POSITIONS_VARIANCE_POPULATION_CREATED_AT_DESC',
  PositionsVariancePopulationIdAsc = 'POSITIONS_VARIANCE_POPULATION_ID_ASC',
  PositionsVariancePopulationIdDesc = 'POSITIONS_VARIANCE_POPULATION_ID_DESC',
  PositionsVariancePopulationLiquidityAsc = 'POSITIONS_VARIANCE_POPULATION_LIQUIDITY_ASC',
  PositionsVariancePopulationLiquidityDesc = 'POSITIONS_VARIANCE_POPULATION_LIQUIDITY_DESC',
  PositionsVariancePopulationOwnerIdAsc = 'POSITIONS_VARIANCE_POPULATION_OWNER_ID_ASC',
  PositionsVariancePopulationOwnerIdDesc = 'POSITIONS_VARIANCE_POPULATION_OWNER_ID_DESC',
  PositionsVariancePopulationPoolIdAsc = 'POSITIONS_VARIANCE_POPULATION_POOL_ID_ASC',
  PositionsVariancePopulationPoolIdDesc = 'POSITIONS_VARIANCE_POPULATION_POOL_ID_DESC',
  PositionsVariancePopulationPrincipalAmountXAsc = 'POSITIONS_VARIANCE_POPULATION_PRINCIPAL_AMOUNT_X_ASC',
  PositionsVariancePopulationPrincipalAmountXDesc = 'POSITIONS_VARIANCE_POPULATION_PRINCIPAL_AMOUNT_X_DESC',
  PositionsVariancePopulationPrincipalAmountYAsc = 'POSITIONS_VARIANCE_POPULATION_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsVariancePopulationPrincipalAmountYDesc = 'POSITIONS_VARIANCE_POPULATION_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsVariancePopulationStatusAsc = 'POSITIONS_VARIANCE_POPULATION_STATUS_ASC',
  PositionsVariancePopulationStatusDesc = 'POSITIONS_VARIANCE_POPULATION_STATUS_DESC',
  PositionsVariancePopulationTickLowerAsc = 'POSITIONS_VARIANCE_POPULATION_TICK_LOWER_ASC',
  PositionsVariancePopulationTickLowerDesc = 'POSITIONS_VARIANCE_POPULATION_TICK_LOWER_DESC',
  PositionsVariancePopulationTickUpperAsc = 'POSITIONS_VARIANCE_POPULATION_TICK_UPPER_ASC',
  PositionsVariancePopulationTickUpperDesc = 'POSITIONS_VARIANCE_POPULATION_TICK_UPPER_DESC',
  PositionsVariancePopulationTokenIdAsc = 'POSITIONS_VARIANCE_POPULATION_TOKEN_ID_ASC',
  PositionsVariancePopulationTokenIdDesc = 'POSITIONS_VARIANCE_POPULATION_TOKEN_ID_DESC',
  PositionsVariancePopulationTransactionIdAsc = 'POSITIONS_VARIANCE_POPULATION_TRANSACTION_ID_ASC',
  PositionsVariancePopulationTransactionIdDesc = 'POSITIONS_VARIANCE_POPULATION_TRANSACTION_ID_DESC',
  PositionsVarianceSampleBlockRangeAsc = 'POSITIONS_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  PositionsVarianceSampleBlockRangeDesc = 'POSITIONS_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  PositionsVarianceSampleClosedAtAsc = 'POSITIONS_VARIANCE_SAMPLE_CLOSED_AT_ASC',
  PositionsVarianceSampleClosedAtDesc = 'POSITIONS_VARIANCE_SAMPLE_CLOSED_AT_DESC',
  PositionsVarianceSampleCreatedAtAsc = 'POSITIONS_VARIANCE_SAMPLE_CREATED_AT_ASC',
  PositionsVarianceSampleCreatedAtDesc = 'POSITIONS_VARIANCE_SAMPLE_CREATED_AT_DESC',
  PositionsVarianceSampleIdAsc = 'POSITIONS_VARIANCE_SAMPLE_ID_ASC',
  PositionsVarianceSampleIdDesc = 'POSITIONS_VARIANCE_SAMPLE_ID_DESC',
  PositionsVarianceSampleLiquidityAsc = 'POSITIONS_VARIANCE_SAMPLE_LIQUIDITY_ASC',
  PositionsVarianceSampleLiquidityDesc = 'POSITIONS_VARIANCE_SAMPLE_LIQUIDITY_DESC',
  PositionsVarianceSampleOwnerIdAsc = 'POSITIONS_VARIANCE_SAMPLE_OWNER_ID_ASC',
  PositionsVarianceSampleOwnerIdDesc = 'POSITIONS_VARIANCE_SAMPLE_OWNER_ID_DESC',
  PositionsVarianceSamplePoolIdAsc = 'POSITIONS_VARIANCE_SAMPLE_POOL_ID_ASC',
  PositionsVarianceSamplePoolIdDesc = 'POSITIONS_VARIANCE_SAMPLE_POOL_ID_DESC',
  PositionsVarianceSamplePrincipalAmountXAsc = 'POSITIONS_VARIANCE_SAMPLE_PRINCIPAL_AMOUNT_X_ASC',
  PositionsVarianceSamplePrincipalAmountXDesc = 'POSITIONS_VARIANCE_SAMPLE_PRINCIPAL_AMOUNT_X_DESC',
  PositionsVarianceSamplePrincipalAmountYAsc = 'POSITIONS_VARIANCE_SAMPLE_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsVarianceSamplePrincipalAmountYDesc = 'POSITIONS_VARIANCE_SAMPLE_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsVarianceSampleStatusAsc = 'POSITIONS_VARIANCE_SAMPLE_STATUS_ASC',
  PositionsVarianceSampleStatusDesc = 'POSITIONS_VARIANCE_SAMPLE_STATUS_DESC',
  PositionsVarianceSampleTickLowerAsc = 'POSITIONS_VARIANCE_SAMPLE_TICK_LOWER_ASC',
  PositionsVarianceSampleTickLowerDesc = 'POSITIONS_VARIANCE_SAMPLE_TICK_LOWER_DESC',
  PositionsVarianceSampleTickUpperAsc = 'POSITIONS_VARIANCE_SAMPLE_TICK_UPPER_ASC',
  PositionsVarianceSampleTickUpperDesc = 'POSITIONS_VARIANCE_SAMPLE_TICK_UPPER_DESC',
  PositionsVarianceSampleTokenIdAsc = 'POSITIONS_VARIANCE_SAMPLE_TOKEN_ID_ASC',
  PositionsVarianceSampleTokenIdDesc = 'POSITIONS_VARIANCE_SAMPLE_TOKEN_ID_DESC',
  PositionsVarianceSampleTransactionIdAsc = 'POSITIONS_VARIANCE_SAMPLE_TRANSACTION_ID_ASC',
  PositionsVarianceSampleTransactionIdDesc = 'POSITIONS_VARIANCE_SAMPLE_TRANSACTION_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SqrtPriceAsc = 'SQRT_PRICE_ASC',
  SqrtPriceDesc = 'SQRT_PRICE_DESC',
  SwapsAverageAmountInAsc = 'SWAPS_AVERAGE_AMOUNT_IN_ASC',
  SwapsAverageAmountInDesc = 'SWAPS_AVERAGE_AMOUNT_IN_DESC',
  SwapsAverageAmountOutAsc = 'SWAPS_AVERAGE_AMOUNT_OUT_ASC',
  SwapsAverageAmountOutDesc = 'SWAPS_AVERAGE_AMOUNT_OUT_DESC',
  SwapsAverageBlockRangeAsc = 'SWAPS_AVERAGE_BLOCK_RANGE_ASC',
  SwapsAverageBlockRangeDesc = 'SWAPS_AVERAGE_BLOCK_RANGE_DESC',
  SwapsAverageCurrentTickIndexAsc = 'SWAPS_AVERAGE_CURRENT_TICK_INDEX_ASC',
  SwapsAverageCurrentTickIndexDesc = 'SWAPS_AVERAGE_CURRENT_TICK_INDEX_DESC',
  SwapsAverageEventIndexAsc = 'SWAPS_AVERAGE_EVENT_INDEX_ASC',
  SwapsAverageEventIndexDesc = 'SWAPS_AVERAGE_EVENT_INDEX_DESC',
  SwapsAverageFeeAmountAsc = 'SWAPS_AVERAGE_FEE_AMOUNT_ASC',
  SwapsAverageFeeAmountDesc = 'SWAPS_AVERAGE_FEE_AMOUNT_DESC',
  SwapsAverageFeeUSDAsc = 'SWAPS_AVERAGE_FEE_U_S_D_ASC',
  SwapsAverageFeeUSDDesc = 'SWAPS_AVERAGE_FEE_U_S_D_DESC',
  SwapsAverageIdAsc = 'SWAPS_AVERAGE_ID_ASC',
  SwapsAverageIdDesc = 'SWAPS_AVERAGE_ID_DESC',
  SwapsAverageLiquidityAsc = 'SWAPS_AVERAGE_LIQUIDITY_ASC',
  SwapsAverageLiquidityDesc = 'SWAPS_AVERAGE_LIQUIDITY_DESC',
  SwapsAveragePoolIdAsc = 'SWAPS_AVERAGE_POOL_ID_ASC',
  SwapsAveragePoolIdDesc = 'SWAPS_AVERAGE_POOL_ID_DESC',
  SwapsAverageSqrtPriceAsc = 'SWAPS_AVERAGE_SQRT_PRICE_ASC',
  SwapsAverageSqrtPriceDesc = 'SWAPS_AVERAGE_SQRT_PRICE_DESC',
  SwapsAverageSwapIdAsc = 'SWAPS_AVERAGE_SWAP_ID_ASC',
  SwapsAverageSwapIdDesc = 'SWAPS_AVERAGE_SWAP_ID_DESC',
  SwapsAverageVolumeUSDAsc = 'SWAPS_AVERAGE_VOLUME_U_S_D_ASC',
  SwapsAverageVolumeUSDDesc = 'SWAPS_AVERAGE_VOLUME_U_S_D_DESC',
  SwapsAverageXToYAsc = 'SWAPS_AVERAGE_X_TO_Y_ASC',
  SwapsAverageXToYDesc = 'SWAPS_AVERAGE_X_TO_Y_DESC',
  SwapsCountAsc = 'SWAPS_COUNT_ASC',
  SwapsCountDesc = 'SWAPS_COUNT_DESC',
  SwapsDistinctCountAmountInAsc = 'SWAPS_DISTINCT_COUNT_AMOUNT_IN_ASC',
  SwapsDistinctCountAmountInDesc = 'SWAPS_DISTINCT_COUNT_AMOUNT_IN_DESC',
  SwapsDistinctCountAmountOutAsc = 'SWAPS_DISTINCT_COUNT_AMOUNT_OUT_ASC',
  SwapsDistinctCountAmountOutDesc = 'SWAPS_DISTINCT_COUNT_AMOUNT_OUT_DESC',
  SwapsDistinctCountBlockRangeAsc = 'SWAPS_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  SwapsDistinctCountBlockRangeDesc = 'SWAPS_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  SwapsDistinctCountCurrentTickIndexAsc = 'SWAPS_DISTINCT_COUNT_CURRENT_TICK_INDEX_ASC',
  SwapsDistinctCountCurrentTickIndexDesc = 'SWAPS_DISTINCT_COUNT_CURRENT_TICK_INDEX_DESC',
  SwapsDistinctCountEventIndexAsc = 'SWAPS_DISTINCT_COUNT_EVENT_INDEX_ASC',
  SwapsDistinctCountEventIndexDesc = 'SWAPS_DISTINCT_COUNT_EVENT_INDEX_DESC',
  SwapsDistinctCountFeeAmountAsc = 'SWAPS_DISTINCT_COUNT_FEE_AMOUNT_ASC',
  SwapsDistinctCountFeeAmountDesc = 'SWAPS_DISTINCT_COUNT_FEE_AMOUNT_DESC',
  SwapsDistinctCountFeeUSDAsc = 'SWAPS_DISTINCT_COUNT_FEE_U_S_D_ASC',
  SwapsDistinctCountFeeUSDDesc = 'SWAPS_DISTINCT_COUNT_FEE_U_S_D_DESC',
  SwapsDistinctCountIdAsc = 'SWAPS_DISTINCT_COUNT_ID_ASC',
  SwapsDistinctCountIdDesc = 'SWAPS_DISTINCT_COUNT_ID_DESC',
  SwapsDistinctCountLiquidityAsc = 'SWAPS_DISTINCT_COUNT_LIQUIDITY_ASC',
  SwapsDistinctCountLiquidityDesc = 'SWAPS_DISTINCT_COUNT_LIQUIDITY_DESC',
  SwapsDistinctCountPoolIdAsc = 'SWAPS_DISTINCT_COUNT_POOL_ID_ASC',
  SwapsDistinctCountPoolIdDesc = 'SWAPS_DISTINCT_COUNT_POOL_ID_DESC',
  SwapsDistinctCountSqrtPriceAsc = 'SWAPS_DISTINCT_COUNT_SQRT_PRICE_ASC',
  SwapsDistinctCountSqrtPriceDesc = 'SWAPS_DISTINCT_COUNT_SQRT_PRICE_DESC',
  SwapsDistinctCountSwapIdAsc = 'SWAPS_DISTINCT_COUNT_SWAP_ID_ASC',
  SwapsDistinctCountSwapIdDesc = 'SWAPS_DISTINCT_COUNT_SWAP_ID_DESC',
  SwapsDistinctCountVolumeUSDAsc = 'SWAPS_DISTINCT_COUNT_VOLUME_U_S_D_ASC',
  SwapsDistinctCountVolumeUSDDesc = 'SWAPS_DISTINCT_COUNT_VOLUME_U_S_D_DESC',
  SwapsDistinctCountXToYAsc = 'SWAPS_DISTINCT_COUNT_X_TO_Y_ASC',
  SwapsDistinctCountXToYDesc = 'SWAPS_DISTINCT_COUNT_X_TO_Y_DESC',
  SwapsMaxAmountInAsc = 'SWAPS_MAX_AMOUNT_IN_ASC',
  SwapsMaxAmountInDesc = 'SWAPS_MAX_AMOUNT_IN_DESC',
  SwapsMaxAmountOutAsc = 'SWAPS_MAX_AMOUNT_OUT_ASC',
  SwapsMaxAmountOutDesc = 'SWAPS_MAX_AMOUNT_OUT_DESC',
  SwapsMaxBlockRangeAsc = 'SWAPS_MAX_BLOCK_RANGE_ASC',
  SwapsMaxBlockRangeDesc = 'SWAPS_MAX_BLOCK_RANGE_DESC',
  SwapsMaxCurrentTickIndexAsc = 'SWAPS_MAX_CURRENT_TICK_INDEX_ASC',
  SwapsMaxCurrentTickIndexDesc = 'SWAPS_MAX_CURRENT_TICK_INDEX_DESC',
  SwapsMaxEventIndexAsc = 'SWAPS_MAX_EVENT_INDEX_ASC',
  SwapsMaxEventIndexDesc = 'SWAPS_MAX_EVENT_INDEX_DESC',
  SwapsMaxFeeAmountAsc = 'SWAPS_MAX_FEE_AMOUNT_ASC',
  SwapsMaxFeeAmountDesc = 'SWAPS_MAX_FEE_AMOUNT_DESC',
  SwapsMaxFeeUSDAsc = 'SWAPS_MAX_FEE_U_S_D_ASC',
  SwapsMaxFeeUSDDesc = 'SWAPS_MAX_FEE_U_S_D_DESC',
  SwapsMaxIdAsc = 'SWAPS_MAX_ID_ASC',
  SwapsMaxIdDesc = 'SWAPS_MAX_ID_DESC',
  SwapsMaxLiquidityAsc = 'SWAPS_MAX_LIQUIDITY_ASC',
  SwapsMaxLiquidityDesc = 'SWAPS_MAX_LIQUIDITY_DESC',
  SwapsMaxPoolIdAsc = 'SWAPS_MAX_POOL_ID_ASC',
  SwapsMaxPoolIdDesc = 'SWAPS_MAX_POOL_ID_DESC',
  SwapsMaxSqrtPriceAsc = 'SWAPS_MAX_SQRT_PRICE_ASC',
  SwapsMaxSqrtPriceDesc = 'SWAPS_MAX_SQRT_PRICE_DESC',
  SwapsMaxSwapIdAsc = 'SWAPS_MAX_SWAP_ID_ASC',
  SwapsMaxSwapIdDesc = 'SWAPS_MAX_SWAP_ID_DESC',
  SwapsMaxVolumeUSDAsc = 'SWAPS_MAX_VOLUME_U_S_D_ASC',
  SwapsMaxVolumeUSDDesc = 'SWAPS_MAX_VOLUME_U_S_D_DESC',
  SwapsMaxXToYAsc = 'SWAPS_MAX_X_TO_Y_ASC',
  SwapsMaxXToYDesc = 'SWAPS_MAX_X_TO_Y_DESC',
  SwapsMinAmountInAsc = 'SWAPS_MIN_AMOUNT_IN_ASC',
  SwapsMinAmountInDesc = 'SWAPS_MIN_AMOUNT_IN_DESC',
  SwapsMinAmountOutAsc = 'SWAPS_MIN_AMOUNT_OUT_ASC',
  SwapsMinAmountOutDesc = 'SWAPS_MIN_AMOUNT_OUT_DESC',
  SwapsMinBlockRangeAsc = 'SWAPS_MIN_BLOCK_RANGE_ASC',
  SwapsMinBlockRangeDesc = 'SWAPS_MIN_BLOCK_RANGE_DESC',
  SwapsMinCurrentTickIndexAsc = 'SWAPS_MIN_CURRENT_TICK_INDEX_ASC',
  SwapsMinCurrentTickIndexDesc = 'SWAPS_MIN_CURRENT_TICK_INDEX_DESC',
  SwapsMinEventIndexAsc = 'SWAPS_MIN_EVENT_INDEX_ASC',
  SwapsMinEventIndexDesc = 'SWAPS_MIN_EVENT_INDEX_DESC',
  SwapsMinFeeAmountAsc = 'SWAPS_MIN_FEE_AMOUNT_ASC',
  SwapsMinFeeAmountDesc = 'SWAPS_MIN_FEE_AMOUNT_DESC',
  SwapsMinFeeUSDAsc = 'SWAPS_MIN_FEE_U_S_D_ASC',
  SwapsMinFeeUSDDesc = 'SWAPS_MIN_FEE_U_S_D_DESC',
  SwapsMinIdAsc = 'SWAPS_MIN_ID_ASC',
  SwapsMinIdDesc = 'SWAPS_MIN_ID_DESC',
  SwapsMinLiquidityAsc = 'SWAPS_MIN_LIQUIDITY_ASC',
  SwapsMinLiquidityDesc = 'SWAPS_MIN_LIQUIDITY_DESC',
  SwapsMinPoolIdAsc = 'SWAPS_MIN_POOL_ID_ASC',
  SwapsMinPoolIdDesc = 'SWAPS_MIN_POOL_ID_DESC',
  SwapsMinSqrtPriceAsc = 'SWAPS_MIN_SQRT_PRICE_ASC',
  SwapsMinSqrtPriceDesc = 'SWAPS_MIN_SQRT_PRICE_DESC',
  SwapsMinSwapIdAsc = 'SWAPS_MIN_SWAP_ID_ASC',
  SwapsMinSwapIdDesc = 'SWAPS_MIN_SWAP_ID_DESC',
  SwapsMinVolumeUSDAsc = 'SWAPS_MIN_VOLUME_U_S_D_ASC',
  SwapsMinVolumeUSDDesc = 'SWAPS_MIN_VOLUME_U_S_D_DESC',
  SwapsMinXToYAsc = 'SWAPS_MIN_X_TO_Y_ASC',
  SwapsMinXToYDesc = 'SWAPS_MIN_X_TO_Y_DESC',
  SwapsStddevPopulationAmountInAsc = 'SWAPS_STDDEV_POPULATION_AMOUNT_IN_ASC',
  SwapsStddevPopulationAmountInDesc = 'SWAPS_STDDEV_POPULATION_AMOUNT_IN_DESC',
  SwapsStddevPopulationAmountOutAsc = 'SWAPS_STDDEV_POPULATION_AMOUNT_OUT_ASC',
  SwapsStddevPopulationAmountOutDesc = 'SWAPS_STDDEV_POPULATION_AMOUNT_OUT_DESC',
  SwapsStddevPopulationBlockRangeAsc = 'SWAPS_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  SwapsStddevPopulationBlockRangeDesc = 'SWAPS_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  SwapsStddevPopulationCurrentTickIndexAsc = 'SWAPS_STDDEV_POPULATION_CURRENT_TICK_INDEX_ASC',
  SwapsStddevPopulationCurrentTickIndexDesc = 'SWAPS_STDDEV_POPULATION_CURRENT_TICK_INDEX_DESC',
  SwapsStddevPopulationEventIndexAsc = 'SWAPS_STDDEV_POPULATION_EVENT_INDEX_ASC',
  SwapsStddevPopulationEventIndexDesc = 'SWAPS_STDDEV_POPULATION_EVENT_INDEX_DESC',
  SwapsStddevPopulationFeeAmountAsc = 'SWAPS_STDDEV_POPULATION_FEE_AMOUNT_ASC',
  SwapsStddevPopulationFeeAmountDesc = 'SWAPS_STDDEV_POPULATION_FEE_AMOUNT_DESC',
  SwapsStddevPopulationFeeUSDAsc = 'SWAPS_STDDEV_POPULATION_FEE_U_S_D_ASC',
  SwapsStddevPopulationFeeUSDDesc = 'SWAPS_STDDEV_POPULATION_FEE_U_S_D_DESC',
  SwapsStddevPopulationIdAsc = 'SWAPS_STDDEV_POPULATION_ID_ASC',
  SwapsStddevPopulationIdDesc = 'SWAPS_STDDEV_POPULATION_ID_DESC',
  SwapsStddevPopulationLiquidityAsc = 'SWAPS_STDDEV_POPULATION_LIQUIDITY_ASC',
  SwapsStddevPopulationLiquidityDesc = 'SWAPS_STDDEV_POPULATION_LIQUIDITY_DESC',
  SwapsStddevPopulationPoolIdAsc = 'SWAPS_STDDEV_POPULATION_POOL_ID_ASC',
  SwapsStddevPopulationPoolIdDesc = 'SWAPS_STDDEV_POPULATION_POOL_ID_DESC',
  SwapsStddevPopulationSqrtPriceAsc = 'SWAPS_STDDEV_POPULATION_SQRT_PRICE_ASC',
  SwapsStddevPopulationSqrtPriceDesc = 'SWAPS_STDDEV_POPULATION_SQRT_PRICE_DESC',
  SwapsStddevPopulationSwapIdAsc = 'SWAPS_STDDEV_POPULATION_SWAP_ID_ASC',
  SwapsStddevPopulationSwapIdDesc = 'SWAPS_STDDEV_POPULATION_SWAP_ID_DESC',
  SwapsStddevPopulationVolumeUSDAsc = 'SWAPS_STDDEV_POPULATION_VOLUME_U_S_D_ASC',
  SwapsStddevPopulationVolumeUSDDesc = 'SWAPS_STDDEV_POPULATION_VOLUME_U_S_D_DESC',
  SwapsStddevPopulationXToYAsc = 'SWAPS_STDDEV_POPULATION_X_TO_Y_ASC',
  SwapsStddevPopulationXToYDesc = 'SWAPS_STDDEV_POPULATION_X_TO_Y_DESC',
  SwapsStddevSampleAmountInAsc = 'SWAPS_STDDEV_SAMPLE_AMOUNT_IN_ASC',
  SwapsStddevSampleAmountInDesc = 'SWAPS_STDDEV_SAMPLE_AMOUNT_IN_DESC',
  SwapsStddevSampleAmountOutAsc = 'SWAPS_STDDEV_SAMPLE_AMOUNT_OUT_ASC',
  SwapsStddevSampleAmountOutDesc = 'SWAPS_STDDEV_SAMPLE_AMOUNT_OUT_DESC',
  SwapsStddevSampleBlockRangeAsc = 'SWAPS_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  SwapsStddevSampleBlockRangeDesc = 'SWAPS_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  SwapsStddevSampleCurrentTickIndexAsc = 'SWAPS_STDDEV_SAMPLE_CURRENT_TICK_INDEX_ASC',
  SwapsStddevSampleCurrentTickIndexDesc = 'SWAPS_STDDEV_SAMPLE_CURRENT_TICK_INDEX_DESC',
  SwapsStddevSampleEventIndexAsc = 'SWAPS_STDDEV_SAMPLE_EVENT_INDEX_ASC',
  SwapsStddevSampleEventIndexDesc = 'SWAPS_STDDEV_SAMPLE_EVENT_INDEX_DESC',
  SwapsStddevSampleFeeAmountAsc = 'SWAPS_STDDEV_SAMPLE_FEE_AMOUNT_ASC',
  SwapsStddevSampleFeeAmountDesc = 'SWAPS_STDDEV_SAMPLE_FEE_AMOUNT_DESC',
  SwapsStddevSampleFeeUSDAsc = 'SWAPS_STDDEV_SAMPLE_FEE_U_S_D_ASC',
  SwapsStddevSampleFeeUSDDesc = 'SWAPS_STDDEV_SAMPLE_FEE_U_S_D_DESC',
  SwapsStddevSampleIdAsc = 'SWAPS_STDDEV_SAMPLE_ID_ASC',
  SwapsStddevSampleIdDesc = 'SWAPS_STDDEV_SAMPLE_ID_DESC',
  SwapsStddevSampleLiquidityAsc = 'SWAPS_STDDEV_SAMPLE_LIQUIDITY_ASC',
  SwapsStddevSampleLiquidityDesc = 'SWAPS_STDDEV_SAMPLE_LIQUIDITY_DESC',
  SwapsStddevSamplePoolIdAsc = 'SWAPS_STDDEV_SAMPLE_POOL_ID_ASC',
  SwapsStddevSamplePoolIdDesc = 'SWAPS_STDDEV_SAMPLE_POOL_ID_DESC',
  SwapsStddevSampleSqrtPriceAsc = 'SWAPS_STDDEV_SAMPLE_SQRT_PRICE_ASC',
  SwapsStddevSampleSqrtPriceDesc = 'SWAPS_STDDEV_SAMPLE_SQRT_PRICE_DESC',
  SwapsStddevSampleSwapIdAsc = 'SWAPS_STDDEV_SAMPLE_SWAP_ID_ASC',
  SwapsStddevSampleSwapIdDesc = 'SWAPS_STDDEV_SAMPLE_SWAP_ID_DESC',
  SwapsStddevSampleVolumeUSDAsc = 'SWAPS_STDDEV_SAMPLE_VOLUME_U_S_D_ASC',
  SwapsStddevSampleVolumeUSDDesc = 'SWAPS_STDDEV_SAMPLE_VOLUME_U_S_D_DESC',
  SwapsStddevSampleXToYAsc = 'SWAPS_STDDEV_SAMPLE_X_TO_Y_ASC',
  SwapsStddevSampleXToYDesc = 'SWAPS_STDDEV_SAMPLE_X_TO_Y_DESC',
  SwapsSumAmountInAsc = 'SWAPS_SUM_AMOUNT_IN_ASC',
  SwapsSumAmountInDesc = 'SWAPS_SUM_AMOUNT_IN_DESC',
  SwapsSumAmountOutAsc = 'SWAPS_SUM_AMOUNT_OUT_ASC',
  SwapsSumAmountOutDesc = 'SWAPS_SUM_AMOUNT_OUT_DESC',
  SwapsSumBlockRangeAsc = 'SWAPS_SUM_BLOCK_RANGE_ASC',
  SwapsSumBlockRangeDesc = 'SWAPS_SUM_BLOCK_RANGE_DESC',
  SwapsSumCurrentTickIndexAsc = 'SWAPS_SUM_CURRENT_TICK_INDEX_ASC',
  SwapsSumCurrentTickIndexDesc = 'SWAPS_SUM_CURRENT_TICK_INDEX_DESC',
  SwapsSumEventIndexAsc = 'SWAPS_SUM_EVENT_INDEX_ASC',
  SwapsSumEventIndexDesc = 'SWAPS_SUM_EVENT_INDEX_DESC',
  SwapsSumFeeAmountAsc = 'SWAPS_SUM_FEE_AMOUNT_ASC',
  SwapsSumFeeAmountDesc = 'SWAPS_SUM_FEE_AMOUNT_DESC',
  SwapsSumFeeUSDAsc = 'SWAPS_SUM_FEE_U_S_D_ASC',
  SwapsSumFeeUSDDesc = 'SWAPS_SUM_FEE_U_S_D_DESC',
  SwapsSumIdAsc = 'SWAPS_SUM_ID_ASC',
  SwapsSumIdDesc = 'SWAPS_SUM_ID_DESC',
  SwapsSumLiquidityAsc = 'SWAPS_SUM_LIQUIDITY_ASC',
  SwapsSumLiquidityDesc = 'SWAPS_SUM_LIQUIDITY_DESC',
  SwapsSumPoolIdAsc = 'SWAPS_SUM_POOL_ID_ASC',
  SwapsSumPoolIdDesc = 'SWAPS_SUM_POOL_ID_DESC',
  SwapsSumSqrtPriceAsc = 'SWAPS_SUM_SQRT_PRICE_ASC',
  SwapsSumSqrtPriceDesc = 'SWAPS_SUM_SQRT_PRICE_DESC',
  SwapsSumSwapIdAsc = 'SWAPS_SUM_SWAP_ID_ASC',
  SwapsSumSwapIdDesc = 'SWAPS_SUM_SWAP_ID_DESC',
  SwapsSumVolumeUSDAsc = 'SWAPS_SUM_VOLUME_U_S_D_ASC',
  SwapsSumVolumeUSDDesc = 'SWAPS_SUM_VOLUME_U_S_D_DESC',
  SwapsSumXToYAsc = 'SWAPS_SUM_X_TO_Y_ASC',
  SwapsSumXToYDesc = 'SWAPS_SUM_X_TO_Y_DESC',
  SwapsVariancePopulationAmountInAsc = 'SWAPS_VARIANCE_POPULATION_AMOUNT_IN_ASC',
  SwapsVariancePopulationAmountInDesc = 'SWAPS_VARIANCE_POPULATION_AMOUNT_IN_DESC',
  SwapsVariancePopulationAmountOutAsc = 'SWAPS_VARIANCE_POPULATION_AMOUNT_OUT_ASC',
  SwapsVariancePopulationAmountOutDesc = 'SWAPS_VARIANCE_POPULATION_AMOUNT_OUT_DESC',
  SwapsVariancePopulationBlockRangeAsc = 'SWAPS_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  SwapsVariancePopulationBlockRangeDesc = 'SWAPS_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  SwapsVariancePopulationCurrentTickIndexAsc = 'SWAPS_VARIANCE_POPULATION_CURRENT_TICK_INDEX_ASC',
  SwapsVariancePopulationCurrentTickIndexDesc = 'SWAPS_VARIANCE_POPULATION_CURRENT_TICK_INDEX_DESC',
  SwapsVariancePopulationEventIndexAsc = 'SWAPS_VARIANCE_POPULATION_EVENT_INDEX_ASC',
  SwapsVariancePopulationEventIndexDesc = 'SWAPS_VARIANCE_POPULATION_EVENT_INDEX_DESC',
  SwapsVariancePopulationFeeAmountAsc = 'SWAPS_VARIANCE_POPULATION_FEE_AMOUNT_ASC',
  SwapsVariancePopulationFeeAmountDesc = 'SWAPS_VARIANCE_POPULATION_FEE_AMOUNT_DESC',
  SwapsVariancePopulationFeeUSDAsc = 'SWAPS_VARIANCE_POPULATION_FEE_U_S_D_ASC',
  SwapsVariancePopulationFeeUSDDesc = 'SWAPS_VARIANCE_POPULATION_FEE_U_S_D_DESC',
  SwapsVariancePopulationIdAsc = 'SWAPS_VARIANCE_POPULATION_ID_ASC',
  SwapsVariancePopulationIdDesc = 'SWAPS_VARIANCE_POPULATION_ID_DESC',
  SwapsVariancePopulationLiquidityAsc = 'SWAPS_VARIANCE_POPULATION_LIQUIDITY_ASC',
  SwapsVariancePopulationLiquidityDesc = 'SWAPS_VARIANCE_POPULATION_LIQUIDITY_DESC',
  SwapsVariancePopulationPoolIdAsc = 'SWAPS_VARIANCE_POPULATION_POOL_ID_ASC',
  SwapsVariancePopulationPoolIdDesc = 'SWAPS_VARIANCE_POPULATION_POOL_ID_DESC',
  SwapsVariancePopulationSqrtPriceAsc = 'SWAPS_VARIANCE_POPULATION_SQRT_PRICE_ASC',
  SwapsVariancePopulationSqrtPriceDesc = 'SWAPS_VARIANCE_POPULATION_SQRT_PRICE_DESC',
  SwapsVariancePopulationSwapIdAsc = 'SWAPS_VARIANCE_POPULATION_SWAP_ID_ASC',
  SwapsVariancePopulationSwapIdDesc = 'SWAPS_VARIANCE_POPULATION_SWAP_ID_DESC',
  SwapsVariancePopulationVolumeUSDAsc = 'SWAPS_VARIANCE_POPULATION_VOLUME_U_S_D_ASC',
  SwapsVariancePopulationVolumeUSDDesc = 'SWAPS_VARIANCE_POPULATION_VOLUME_U_S_D_DESC',
  SwapsVariancePopulationXToYAsc = 'SWAPS_VARIANCE_POPULATION_X_TO_Y_ASC',
  SwapsVariancePopulationXToYDesc = 'SWAPS_VARIANCE_POPULATION_X_TO_Y_DESC',
  SwapsVarianceSampleAmountInAsc = 'SWAPS_VARIANCE_SAMPLE_AMOUNT_IN_ASC',
  SwapsVarianceSampleAmountInDesc = 'SWAPS_VARIANCE_SAMPLE_AMOUNT_IN_DESC',
  SwapsVarianceSampleAmountOutAsc = 'SWAPS_VARIANCE_SAMPLE_AMOUNT_OUT_ASC',
  SwapsVarianceSampleAmountOutDesc = 'SWAPS_VARIANCE_SAMPLE_AMOUNT_OUT_DESC',
  SwapsVarianceSampleBlockRangeAsc = 'SWAPS_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  SwapsVarianceSampleBlockRangeDesc = 'SWAPS_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  SwapsVarianceSampleCurrentTickIndexAsc = 'SWAPS_VARIANCE_SAMPLE_CURRENT_TICK_INDEX_ASC',
  SwapsVarianceSampleCurrentTickIndexDesc = 'SWAPS_VARIANCE_SAMPLE_CURRENT_TICK_INDEX_DESC',
  SwapsVarianceSampleEventIndexAsc = 'SWAPS_VARIANCE_SAMPLE_EVENT_INDEX_ASC',
  SwapsVarianceSampleEventIndexDesc = 'SWAPS_VARIANCE_SAMPLE_EVENT_INDEX_DESC',
  SwapsVarianceSampleFeeAmountAsc = 'SWAPS_VARIANCE_SAMPLE_FEE_AMOUNT_ASC',
  SwapsVarianceSampleFeeAmountDesc = 'SWAPS_VARIANCE_SAMPLE_FEE_AMOUNT_DESC',
  SwapsVarianceSampleFeeUSDAsc = 'SWAPS_VARIANCE_SAMPLE_FEE_U_S_D_ASC',
  SwapsVarianceSampleFeeUSDDesc = 'SWAPS_VARIANCE_SAMPLE_FEE_U_S_D_DESC',
  SwapsVarianceSampleIdAsc = 'SWAPS_VARIANCE_SAMPLE_ID_ASC',
  SwapsVarianceSampleIdDesc = 'SWAPS_VARIANCE_SAMPLE_ID_DESC',
  SwapsVarianceSampleLiquidityAsc = 'SWAPS_VARIANCE_SAMPLE_LIQUIDITY_ASC',
  SwapsVarianceSampleLiquidityDesc = 'SWAPS_VARIANCE_SAMPLE_LIQUIDITY_DESC',
  SwapsVarianceSamplePoolIdAsc = 'SWAPS_VARIANCE_SAMPLE_POOL_ID_ASC',
  SwapsVarianceSamplePoolIdDesc = 'SWAPS_VARIANCE_SAMPLE_POOL_ID_DESC',
  SwapsVarianceSampleSqrtPriceAsc = 'SWAPS_VARIANCE_SAMPLE_SQRT_PRICE_ASC',
  SwapsVarianceSampleSqrtPriceDesc = 'SWAPS_VARIANCE_SAMPLE_SQRT_PRICE_DESC',
  SwapsVarianceSampleSwapIdAsc = 'SWAPS_VARIANCE_SAMPLE_SWAP_ID_ASC',
  SwapsVarianceSampleSwapIdDesc = 'SWAPS_VARIANCE_SAMPLE_SWAP_ID_DESC',
  SwapsVarianceSampleVolumeUSDAsc = 'SWAPS_VARIANCE_SAMPLE_VOLUME_U_S_D_ASC',
  SwapsVarianceSampleVolumeUSDDesc = 'SWAPS_VARIANCE_SAMPLE_VOLUME_U_S_D_DESC',
  SwapsVarianceSampleXToYAsc = 'SWAPS_VARIANCE_SAMPLE_X_TO_Y_ASC',
  SwapsVarianceSampleXToYDesc = 'SWAPS_VARIANCE_SAMPLE_X_TO_Y_DESC',
  TickSpacingAsc = 'TICK_SPACING_ASC',
  TickSpacingDesc = 'TICK_SPACING_DESC',
  TokenXIdAsc = 'TOKEN_X_ID_ASC',
  TokenXIdDesc = 'TOKEN_X_ID_DESC',
  TokenYIdAsc = 'TOKEN_Y_ID_ASC',
  TokenYIdDesc = 'TOKEN_Y_ID_DESC',
  TotalValueLockedTokenXAsc = 'TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  TotalValueLockedTokenXDesc = 'TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  TotalValueLockedTokenYAsc = 'TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  TotalValueLockedTokenYDesc = 'TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  TotalValueLockedUSDAsc = 'TOTAL_VALUE_LOCKED_U_S_D_ASC',
  TotalValueLockedUSDDesc = 'TOTAL_VALUE_LOCKED_U_S_D_DESC',
  TransactionIdAsc = 'TRANSACTION_ID_ASC',
  TransactionIdDesc = 'TRANSACTION_ID_DESC',
  TxCountAsc = 'TX_COUNT_ASC',
  TxCountDesc = 'TX_COUNT_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  VolumeTokenXAsc = 'VOLUME_TOKEN_X_ASC',
  VolumeTokenXDesc = 'VOLUME_TOKEN_X_DESC',
  VolumeTokenYAsc = 'VOLUME_TOKEN_Y_ASC',
  VolumeTokenYDesc = 'VOLUME_TOKEN_Y_DESC',
  VolumeUSDAsc = 'VOLUME_U_S_D_ASC',
  VolumeUSDDesc = 'VOLUME_U_S_D_DESC'
}

export type Position = Node & {
  __typename?: 'Position';
  /** Reads and enables pagination through a set of `Account`. */
  accountsByClaimFeePositionIdAndOwnerId: PositionAccountsByClaimFeePositionIdAndOwnerIdManyToManyConnection;
  closedAt?: Maybe<Scalars['BigFloat']['output']>;
  createdAt: Scalars['BigFloat']['output'];
  /** Reads and enables pagination through a set of `ClaimFee`. */
  fees: ClaimFeesConnection;
  id: Scalars['String']['output'];
  liquidity: Scalars['BigFloat']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  /** Reads a single `Account` that is related to this `Position`. */
  owner?: Maybe<Account>;
  ownerId: Scalars['String']['output'];
  /** Reads a single `Pool` that is related to this `Position`. */
  pool?: Maybe<Pool>;
  poolId: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `Pool`. */
  poolsByClaimFeePositionIdAndPoolId: PositionPoolsByClaimFeePositionIdAndPoolIdManyToManyConnection;
  principalAmountX: Scalars['BigFloat']['output'];
  principalAmountY: Scalars['BigFloat']['output'];
  status: Scalars['Boolean']['output'];
  tickLower: Scalars['BigFloat']['output'];
  tickUpper: Scalars['BigFloat']['output'];
  tokenId: Scalars['Int']['output'];
  /** Reads a single `Transaction` that is related to this `Position`. */
  transaction?: Maybe<Transaction>;
  transactionId?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `Transaction`. */
  transactionsByClaimFeePositionIdAndTransactionId: PositionTransactionsByClaimFeePositionIdAndTransactionIdManyToManyConnection;
};


export type PositionAccountsByClaimFeePositionIdAndOwnerIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Accounts_Distinct_Enum>[]>;
  filter?: InputMaybe<AccountFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountsOrderBy[]>;
};


export type PositionFeesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Claim_Fees_Distinct_Enum>[]>;
  filter?: InputMaybe<ClaimFeeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimFeesOrderBy[]>;
};


export type PositionPoolsByClaimFeePositionIdAndPoolIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};


export type PositionTransactionsByClaimFeePositionIdAndTransactionIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Transactions_Distinct_Enum>[]>;
  filter?: InputMaybe<TransactionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TransactionsOrderBy[]>;
};

/** A connection to a list of `Account` values, with data from `ClaimFee`. */
export type PositionAccountsByClaimFeePositionIdAndOwnerIdManyToManyConnection = {
  __typename?: 'PositionAccountsByClaimFeePositionIdAndOwnerIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<AccountAggregates>;
  /** A list of edges which contains the `Account`, info from the `ClaimFee`, and the cursor to aid in pagination. */
  edges: PositionAccountsByClaimFeePositionIdAndOwnerIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<AccountAggregates[]>;
  /** A list of `Account` objects. */
  nodes: Maybe<Account>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Account` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Account` values, with data from `ClaimFee`. */
export type PositionAccountsByClaimFeePositionIdAndOwnerIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: AccountsGroupBy[];
  having?: InputMaybe<AccountsHavingInput>;
};

/** A `Account` edge in the connection, with data from `ClaimFee`. */
export type PositionAccountsByClaimFeePositionIdAndOwnerIdManyToManyEdge = {
  __typename?: 'PositionAccountsByClaimFeePositionIdAndOwnerIdManyToManyEdge';
  /** Reads and enables pagination through a set of `ClaimFee`. */
  claimFees: ClaimFeesConnection;
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Account` at the end of the edge. */
  node?: Maybe<Account>;
};


/** A `Account` edge in the connection, with data from `ClaimFee`. */
export type PositionAccountsByClaimFeePositionIdAndOwnerIdManyToManyEdgeClaimFeesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Claim_Fees_Distinct_Enum>[]>;
  filter?: InputMaybe<ClaimFeeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimFeesOrderBy[]>;
};

export type PositionAggregates = {
  __typename?: 'PositionAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<PositionAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<PositionDistinctCountAggregates>;
  keys?: Maybe<Scalars['String']['output'][]>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<PositionMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<PositionMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<PositionStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<PositionStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<PositionSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<PositionVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<PositionVarianceSampleAggregates>;
};

/** A filter to be used against aggregates of `Position` object types. */
export type PositionAggregatesFilter = {
  /** Mean average aggregate over matching `Position` objects. */
  average?: InputMaybe<PositionAverageAggregateFilter>;
  /** Distinct count aggregate over matching `Position` objects. */
  distinctCount?: InputMaybe<PositionDistinctCountAggregateFilter>;
  /** A filter that must pass for the relevant `Position` object to be included within the aggregate. */
  filter?: InputMaybe<PositionFilter>;
  /** Maximum aggregate over matching `Position` objects. */
  max?: InputMaybe<PositionMaxAggregateFilter>;
  /** Minimum aggregate over matching `Position` objects. */
  min?: InputMaybe<PositionMinAggregateFilter>;
  /** Population standard deviation aggregate over matching `Position` objects. */
  stddevPopulation?: InputMaybe<PositionStddevPopulationAggregateFilter>;
  /** Sample standard deviation aggregate over matching `Position` objects. */
  stddevSample?: InputMaybe<PositionStddevSampleAggregateFilter>;
  /** Sum aggregate over matching `Position` objects. */
  sum?: InputMaybe<PositionSumAggregateFilter>;
  /** Population variance aggregate over matching `Position` objects. */
  variancePopulation?: InputMaybe<PositionVariancePopulationAggregateFilter>;
  /** Sample variance aggregate over matching `Position` objects. */
  varianceSample?: InputMaybe<PositionVarianceSampleAggregateFilter>;
};

export type PositionAverageAggregateFilter = {
  closedAt?: InputMaybe<BigFloatFilter>;
  createdAt?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  principalAmountX?: InputMaybe<BigFloatFilter>;
  principalAmountY?: InputMaybe<BigFloatFilter>;
  tickLower?: InputMaybe<BigFloatFilter>;
  tickUpper?: InputMaybe<BigFloatFilter>;
  tokenId?: InputMaybe<BigFloatFilter>;
};

export type PositionAverageAggregates = {
  __typename?: 'PositionAverageAggregates';
  /** Mean average of closedAt across the matching connection */
  closedAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of principalAmountX across the matching connection */
  principalAmountX?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of principalAmountY across the matching connection */
  principalAmountY?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of tickLower across the matching connection */
  tickLower?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of tickUpper across the matching connection */
  tickUpper?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of tokenId across the matching connection */
  tokenId?: Maybe<Scalars['BigFloat']['output']>;
};

export type PositionDistinctCountAggregateFilter = {
  _blockRange?: InputMaybe<BigIntFilter>;
  _id?: InputMaybe<BigIntFilter>;
  closedAt?: InputMaybe<BigIntFilter>;
  createdAt?: InputMaybe<BigIntFilter>;
  id?: InputMaybe<BigIntFilter>;
  liquidity?: InputMaybe<BigIntFilter>;
  ownerId?: InputMaybe<BigIntFilter>;
  poolId?: InputMaybe<BigIntFilter>;
  principalAmountX?: InputMaybe<BigIntFilter>;
  principalAmountY?: InputMaybe<BigIntFilter>;
  status?: InputMaybe<BigIntFilter>;
  tickLower?: InputMaybe<BigIntFilter>;
  tickUpper?: InputMaybe<BigIntFilter>;
  tokenId?: InputMaybe<BigIntFilter>;
  transactionId?: InputMaybe<BigIntFilter>;
};

export type PositionDistinctCountAggregates = {
  __typename?: 'PositionDistinctCountAggregates';
  /** Distinct count of _blockRange across the matching connection */
  _blockRange?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of _id across the matching connection */
  _id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of closedAt across the matching connection */
  closedAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of ownerId across the matching connection */
  ownerId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of principalAmountX across the matching connection */
  principalAmountX?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of principalAmountY across the matching connection */
  principalAmountY?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of status across the matching connection */
  status?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of tickLower across the matching connection */
  tickLower?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of tickUpper across the matching connection */
  tickUpper?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of tokenId across the matching connection */
  tokenId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of transactionId across the matching connection */
  transactionId?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `Position` object types. All fields are combined with a logical ‘and.’ */
export type PositionFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<PositionFilter[]>;
  /** Filter by the object’s `closedAt` field. */
  closedAt?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `fees` relation. */
  fees?: InputMaybe<PositionToManyClaimFeeFilter>;
  /** Some related `fees` exist. */
  feesExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Filter by the object’s `liquidity` field. */
  liquidity?: InputMaybe<BigFloatFilter>;
  /** Negates the expression. */
  not?: InputMaybe<PositionFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<PositionFilter[]>;
  /** Filter by the object’s `owner` relation. */
  owner?: InputMaybe<AccountFilter>;
  /** Filter by the object’s `ownerId` field. */
  ownerId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `pool` relation. */
  pool?: InputMaybe<PoolFilter>;
  /** Filter by the object’s `poolId` field. */
  poolId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `principalAmountX` field. */
  principalAmountX?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `principalAmountY` field. */
  principalAmountY?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `status` field. */
  status?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `tickLower` field. */
  tickLower?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `tickUpper` field. */
  tickUpper?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `tokenId` field. */
  tokenId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `transaction` relation. */
  transaction?: InputMaybe<TransactionFilter>;
  /** A related `transaction` exists. */
  transactionExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `transactionId` field. */
  transactionId?: InputMaybe<StringFilter>;
};

export type PositionMaxAggregateFilter = {
  closedAt?: InputMaybe<BigFloatFilter>;
  createdAt?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  principalAmountX?: InputMaybe<BigFloatFilter>;
  principalAmountY?: InputMaybe<BigFloatFilter>;
  tickLower?: InputMaybe<BigFloatFilter>;
  tickUpper?: InputMaybe<BigFloatFilter>;
  tokenId?: InputMaybe<IntFilter>;
};

export type PositionMaxAggregates = {
  __typename?: 'PositionMaxAggregates';
  /** Maximum of closedAt across the matching connection */
  closedAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of principalAmountX across the matching connection */
  principalAmountX?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of principalAmountY across the matching connection */
  principalAmountY?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of tickLower across the matching connection */
  tickLower?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of tickUpper across the matching connection */
  tickUpper?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of tokenId across the matching connection */
  tokenId?: Maybe<Scalars['Int']['output']>;
};

export type PositionMinAggregateFilter = {
  closedAt?: InputMaybe<BigFloatFilter>;
  createdAt?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  principalAmountX?: InputMaybe<BigFloatFilter>;
  principalAmountY?: InputMaybe<BigFloatFilter>;
  tickLower?: InputMaybe<BigFloatFilter>;
  tickUpper?: InputMaybe<BigFloatFilter>;
  tokenId?: InputMaybe<IntFilter>;
};

export type PositionMinAggregates = {
  __typename?: 'PositionMinAggregates';
  /** Minimum of closedAt across the matching connection */
  closedAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of principalAmountX across the matching connection */
  principalAmountX?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of principalAmountY across the matching connection */
  principalAmountY?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of tickLower across the matching connection */
  tickLower?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of tickUpper across the matching connection */
  tickUpper?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of tokenId across the matching connection */
  tokenId?: Maybe<Scalars['Int']['output']>;
};

/** A connection to a list of `Pool` values, with data from `ClaimFee`. */
export type PositionPoolsByClaimFeePositionIdAndPoolIdManyToManyConnection = {
  __typename?: 'PositionPoolsByClaimFeePositionIdAndPoolIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<PoolAggregates>;
  /** A list of edges which contains the `Pool`, info from the `ClaimFee`, and the cursor to aid in pagination. */
  edges: PositionPoolsByClaimFeePositionIdAndPoolIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<PoolAggregates[]>;
  /** A list of `Pool` objects. */
  nodes: Maybe<Pool>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Pool` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Pool` values, with data from `ClaimFee`. */
export type PositionPoolsByClaimFeePositionIdAndPoolIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: PoolsGroupBy[];
  having?: InputMaybe<PoolsHavingInput>;
};

/** A `Pool` edge in the connection, with data from `ClaimFee`. */
export type PositionPoolsByClaimFeePositionIdAndPoolIdManyToManyEdge = {
  __typename?: 'PositionPoolsByClaimFeePositionIdAndPoolIdManyToManyEdge';
  /** Reads and enables pagination through a set of `ClaimFee`. */
  claimFees: ClaimFeesConnection;
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Pool` at the end of the edge. */
  node?: Maybe<Pool>;
};


/** A `Pool` edge in the connection, with data from `ClaimFee`. */
export type PositionPoolsByClaimFeePositionIdAndPoolIdManyToManyEdgeClaimFeesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Claim_Fees_Distinct_Enum>[]>;
  filter?: InputMaybe<ClaimFeeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimFeesOrderBy[]>;
};

export type PositionStddevPopulationAggregateFilter = {
  closedAt?: InputMaybe<BigFloatFilter>;
  createdAt?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  principalAmountX?: InputMaybe<BigFloatFilter>;
  principalAmountY?: InputMaybe<BigFloatFilter>;
  tickLower?: InputMaybe<BigFloatFilter>;
  tickUpper?: InputMaybe<BigFloatFilter>;
  tokenId?: InputMaybe<BigFloatFilter>;
};

export type PositionStddevPopulationAggregates = {
  __typename?: 'PositionStddevPopulationAggregates';
  /** Population standard deviation of closedAt across the matching connection */
  closedAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of principalAmountX across the matching connection */
  principalAmountX?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of principalAmountY across the matching connection */
  principalAmountY?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of tickLower across the matching connection */
  tickLower?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of tickUpper across the matching connection */
  tickUpper?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of tokenId across the matching connection */
  tokenId?: Maybe<Scalars['BigFloat']['output']>;
};

export type PositionStddevSampleAggregateFilter = {
  closedAt?: InputMaybe<BigFloatFilter>;
  createdAt?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  principalAmountX?: InputMaybe<BigFloatFilter>;
  principalAmountY?: InputMaybe<BigFloatFilter>;
  tickLower?: InputMaybe<BigFloatFilter>;
  tickUpper?: InputMaybe<BigFloatFilter>;
  tokenId?: InputMaybe<BigFloatFilter>;
};

export type PositionStddevSampleAggregates = {
  __typename?: 'PositionStddevSampleAggregates';
  /** Sample standard deviation of closedAt across the matching connection */
  closedAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of principalAmountX across the matching connection */
  principalAmountX?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of principalAmountY across the matching connection */
  principalAmountY?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of tickLower across the matching connection */
  tickLower?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of tickUpper across the matching connection */
  tickUpper?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of tokenId across the matching connection */
  tokenId?: Maybe<Scalars['BigFloat']['output']>;
};

export type PositionSumAggregateFilter = {
  closedAt?: InputMaybe<BigFloatFilter>;
  createdAt?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  principalAmountX?: InputMaybe<BigFloatFilter>;
  principalAmountY?: InputMaybe<BigFloatFilter>;
  tickLower?: InputMaybe<BigFloatFilter>;
  tickUpper?: InputMaybe<BigFloatFilter>;
  tokenId?: InputMaybe<BigIntFilter>;
};

export type PositionSumAggregates = {
  __typename?: 'PositionSumAggregates';
  /** Sum of closedAt across the matching connection */
  closedAt: Scalars['BigFloat']['output'];
  /** Sum of createdAt across the matching connection */
  createdAt: Scalars['BigFloat']['output'];
  /** Sum of liquidity across the matching connection */
  liquidity: Scalars['BigFloat']['output'];
  /** Sum of principalAmountX across the matching connection */
  principalAmountX: Scalars['BigFloat']['output'];
  /** Sum of principalAmountY across the matching connection */
  principalAmountY: Scalars['BigFloat']['output'];
  /** Sum of tickLower across the matching connection */
  tickLower: Scalars['BigFloat']['output'];
  /** Sum of tickUpper across the matching connection */
  tickUpper: Scalars['BigFloat']['output'];
  /** Sum of tokenId across the matching connection */
  tokenId: Scalars['BigInt']['output'];
};

/** A filter to be used against many `ClaimFee` object types. All fields are combined with a logical ‘and.’ */
export type PositionToManyClaimFeeFilter = {
  /** Aggregates across related `ClaimFee` match the filter criteria. */
  aggregates?: InputMaybe<ClaimFeeAggregatesFilter>;
  /** Every related `ClaimFee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ClaimFeeFilter>;
  /** No related `ClaimFee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ClaimFeeFilter>;
  /** Some related `ClaimFee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ClaimFeeFilter>;
};

/** A connection to a list of `Transaction` values, with data from `ClaimFee`. */
export type PositionTransactionsByClaimFeePositionIdAndTransactionIdManyToManyConnection = {
  __typename?: 'PositionTransactionsByClaimFeePositionIdAndTransactionIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TransactionAggregates>;
  /** A list of edges which contains the `Transaction`, info from the `ClaimFee`, and the cursor to aid in pagination. */
  edges: PositionTransactionsByClaimFeePositionIdAndTransactionIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TransactionAggregates[]>;
  /** A list of `Transaction` objects. */
  nodes: Maybe<Transaction>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Transaction` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Transaction` values, with data from `ClaimFee`. */
export type PositionTransactionsByClaimFeePositionIdAndTransactionIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TransactionsGroupBy[];
  having?: InputMaybe<TransactionsHavingInput>;
};

/** A `Transaction` edge in the connection, with data from `ClaimFee`. */
export type PositionTransactionsByClaimFeePositionIdAndTransactionIdManyToManyEdge = {
  __typename?: 'PositionTransactionsByClaimFeePositionIdAndTransactionIdManyToManyEdge';
  /** Reads and enables pagination through a set of `ClaimFee`. */
  claimFees: ClaimFeesConnection;
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Transaction` at the end of the edge. */
  node?: Maybe<Transaction>;
};


/** A `Transaction` edge in the connection, with data from `ClaimFee`. */
export type PositionTransactionsByClaimFeePositionIdAndTransactionIdManyToManyEdgeClaimFeesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Claim_Fees_Distinct_Enum>[]>;
  filter?: InputMaybe<ClaimFeeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimFeesOrderBy[]>;
};

export type PositionVariancePopulationAggregateFilter = {
  closedAt?: InputMaybe<BigFloatFilter>;
  createdAt?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  principalAmountX?: InputMaybe<BigFloatFilter>;
  principalAmountY?: InputMaybe<BigFloatFilter>;
  tickLower?: InputMaybe<BigFloatFilter>;
  tickUpper?: InputMaybe<BigFloatFilter>;
  tokenId?: InputMaybe<BigFloatFilter>;
};

export type PositionVariancePopulationAggregates = {
  __typename?: 'PositionVariancePopulationAggregates';
  /** Population variance of closedAt across the matching connection */
  closedAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of principalAmountX across the matching connection */
  principalAmountX?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of principalAmountY across the matching connection */
  principalAmountY?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of tickLower across the matching connection */
  tickLower?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of tickUpper across the matching connection */
  tickUpper?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of tokenId across the matching connection */
  tokenId?: Maybe<Scalars['BigFloat']['output']>;
};

export type PositionVarianceSampleAggregateFilter = {
  closedAt?: InputMaybe<BigFloatFilter>;
  createdAt?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  principalAmountX?: InputMaybe<BigFloatFilter>;
  principalAmountY?: InputMaybe<BigFloatFilter>;
  tickLower?: InputMaybe<BigFloatFilter>;
  tickUpper?: InputMaybe<BigFloatFilter>;
  tokenId?: InputMaybe<BigFloatFilter>;
};

export type PositionVarianceSampleAggregates = {
  __typename?: 'PositionVarianceSampleAggregates';
  /** Sample variance of closedAt across the matching connection */
  closedAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of principalAmountX across the matching connection */
  principalAmountX?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of principalAmountY across the matching connection */
  principalAmountY?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of tickLower across the matching connection */
  tickLower?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of tickUpper across the matching connection */
  tickUpper?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of tokenId across the matching connection */
  tokenId?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `Position` values. */
export type PositionsConnection = {
  __typename?: 'PositionsConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<PositionAggregates>;
  /** A list of edges which contains the `Position` and cursor to aid in pagination. */
  edges: PositionsEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<PositionAggregates[]>;
  /** A list of `Position` objects. */
  nodes: Maybe<Position>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Position` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Position` values. */
export type PositionsConnectionGroupedAggregatesArgs = {
  groupBy: PositionsGroupBy[];
  having?: InputMaybe<PositionsHavingInput>;
};

/** A `Position` edge in the connection. */
export type PositionsEdge = {
  __typename?: 'PositionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Position` at the end of the edge. */
  node?: Maybe<Position>;
};

/** Grouping methods for `Position` for usage during aggregation. */
export enum PositionsGroupBy {
  ClosedAt = 'CLOSED_AT',
  CreatedAt = 'CREATED_AT',
  Id = 'ID',
  Liquidity = 'LIQUIDITY',
  OwnerId = 'OWNER_ID',
  PoolId = 'POOL_ID',
  PrincipalAmountX = 'PRINCIPAL_AMOUNT_X',
  PrincipalAmountY = 'PRINCIPAL_AMOUNT_Y',
  Status = 'STATUS',
  TickLower = 'TICK_LOWER',
  TickUpper = 'TICK_UPPER',
  TokenId = 'TOKEN_ID',
  TransactionId = 'TRANSACTION_ID'
}

export type PositionsHavingAverageInput = {
  closedAt?: InputMaybe<HavingBigfloatFilter>;
  createdAt?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  principalAmountX?: InputMaybe<HavingBigfloatFilter>;
  principalAmountY?: InputMaybe<HavingBigfloatFilter>;
  tickLower?: InputMaybe<HavingBigfloatFilter>;
  tickUpper?: InputMaybe<HavingBigfloatFilter>;
  tokenId?: InputMaybe<HavingIntFilter>;
};

export type PositionsHavingDistinctCountInput = {
  closedAt?: InputMaybe<HavingBigfloatFilter>;
  createdAt?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  principalAmountX?: InputMaybe<HavingBigfloatFilter>;
  principalAmountY?: InputMaybe<HavingBigfloatFilter>;
  tickLower?: InputMaybe<HavingBigfloatFilter>;
  tickUpper?: InputMaybe<HavingBigfloatFilter>;
  tokenId?: InputMaybe<HavingIntFilter>;
};

/** Conditions for `Position` aggregates. */
export type PositionsHavingInput = {
  AND?: InputMaybe<PositionsHavingInput[]>;
  OR?: InputMaybe<PositionsHavingInput[]>;
  average?: InputMaybe<PositionsHavingAverageInput>;
  distinctCount?: InputMaybe<PositionsHavingDistinctCountInput>;
  max?: InputMaybe<PositionsHavingMaxInput>;
  min?: InputMaybe<PositionsHavingMinInput>;
  stddevPopulation?: InputMaybe<PositionsHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<PositionsHavingStddevSampleInput>;
  sum?: InputMaybe<PositionsHavingSumInput>;
  variancePopulation?: InputMaybe<PositionsHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<PositionsHavingVarianceSampleInput>;
};

export type PositionsHavingMaxInput = {
  closedAt?: InputMaybe<HavingBigfloatFilter>;
  createdAt?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  principalAmountX?: InputMaybe<HavingBigfloatFilter>;
  principalAmountY?: InputMaybe<HavingBigfloatFilter>;
  tickLower?: InputMaybe<HavingBigfloatFilter>;
  tickUpper?: InputMaybe<HavingBigfloatFilter>;
  tokenId?: InputMaybe<HavingIntFilter>;
};

export type PositionsHavingMinInput = {
  closedAt?: InputMaybe<HavingBigfloatFilter>;
  createdAt?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  principalAmountX?: InputMaybe<HavingBigfloatFilter>;
  principalAmountY?: InputMaybe<HavingBigfloatFilter>;
  tickLower?: InputMaybe<HavingBigfloatFilter>;
  tickUpper?: InputMaybe<HavingBigfloatFilter>;
  tokenId?: InputMaybe<HavingIntFilter>;
};

export type PositionsHavingStddevPopulationInput = {
  closedAt?: InputMaybe<HavingBigfloatFilter>;
  createdAt?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  principalAmountX?: InputMaybe<HavingBigfloatFilter>;
  principalAmountY?: InputMaybe<HavingBigfloatFilter>;
  tickLower?: InputMaybe<HavingBigfloatFilter>;
  tickUpper?: InputMaybe<HavingBigfloatFilter>;
  tokenId?: InputMaybe<HavingIntFilter>;
};

export type PositionsHavingStddevSampleInput = {
  closedAt?: InputMaybe<HavingBigfloatFilter>;
  createdAt?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  principalAmountX?: InputMaybe<HavingBigfloatFilter>;
  principalAmountY?: InputMaybe<HavingBigfloatFilter>;
  tickLower?: InputMaybe<HavingBigfloatFilter>;
  tickUpper?: InputMaybe<HavingBigfloatFilter>;
  tokenId?: InputMaybe<HavingIntFilter>;
};

export type PositionsHavingSumInput = {
  closedAt?: InputMaybe<HavingBigfloatFilter>;
  createdAt?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  principalAmountX?: InputMaybe<HavingBigfloatFilter>;
  principalAmountY?: InputMaybe<HavingBigfloatFilter>;
  tickLower?: InputMaybe<HavingBigfloatFilter>;
  tickUpper?: InputMaybe<HavingBigfloatFilter>;
  tokenId?: InputMaybe<HavingIntFilter>;
};

export type PositionsHavingVariancePopulationInput = {
  closedAt?: InputMaybe<HavingBigfloatFilter>;
  createdAt?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  principalAmountX?: InputMaybe<HavingBigfloatFilter>;
  principalAmountY?: InputMaybe<HavingBigfloatFilter>;
  tickLower?: InputMaybe<HavingBigfloatFilter>;
  tickUpper?: InputMaybe<HavingBigfloatFilter>;
  tokenId?: InputMaybe<HavingIntFilter>;
};

export type PositionsHavingVarianceSampleInput = {
  closedAt?: InputMaybe<HavingBigfloatFilter>;
  createdAt?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  principalAmountX?: InputMaybe<HavingBigfloatFilter>;
  principalAmountY?: InputMaybe<HavingBigfloatFilter>;
  tickLower?: InputMaybe<HavingBigfloatFilter>;
  tickUpper?: InputMaybe<HavingBigfloatFilter>;
  tokenId?: InputMaybe<HavingIntFilter>;
};

/** Methods to use when ordering `Position`. */
export enum PositionsOrderBy {
  ClosedAtAsc = 'CLOSED_AT_ASC',
  ClosedAtDesc = 'CLOSED_AT_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  FeesAverageAmountUSDAsc = 'FEES_AVERAGE_AMOUNT_U_S_D_ASC',
  FeesAverageAmountUSDDesc = 'FEES_AVERAGE_AMOUNT_U_S_D_DESC',
  FeesAverageAmountXAsc = 'FEES_AVERAGE_AMOUNT_X_ASC',
  FeesAverageAmountXDesc = 'FEES_AVERAGE_AMOUNT_X_DESC',
  FeesAverageAmountYAsc = 'FEES_AVERAGE_AMOUNT_Y_ASC',
  FeesAverageAmountYDesc = 'FEES_AVERAGE_AMOUNT_Y_DESC',
  FeesAverageBlockRangeAsc = 'FEES_AVERAGE_BLOCK_RANGE_ASC',
  FeesAverageBlockRangeDesc = 'FEES_AVERAGE_BLOCK_RANGE_DESC',
  FeesAverageIdAsc = 'FEES_AVERAGE_ID_ASC',
  FeesAverageIdDesc = 'FEES_AVERAGE_ID_DESC',
  FeesAverageOwnerIdAsc = 'FEES_AVERAGE_OWNER_ID_ASC',
  FeesAverageOwnerIdDesc = 'FEES_AVERAGE_OWNER_ID_DESC',
  FeesAveragePoolIdAsc = 'FEES_AVERAGE_POOL_ID_ASC',
  FeesAveragePoolIdDesc = 'FEES_AVERAGE_POOL_ID_DESC',
  FeesAveragePositionIdAsc = 'FEES_AVERAGE_POSITION_ID_ASC',
  FeesAveragePositionIdDesc = 'FEES_AVERAGE_POSITION_ID_DESC',
  FeesAverageTransactionIdAsc = 'FEES_AVERAGE_TRANSACTION_ID_ASC',
  FeesAverageTransactionIdDesc = 'FEES_AVERAGE_TRANSACTION_ID_DESC',
  FeesCountAsc = 'FEES_COUNT_ASC',
  FeesCountDesc = 'FEES_COUNT_DESC',
  FeesDistinctCountAmountUSDAsc = 'FEES_DISTINCT_COUNT_AMOUNT_U_S_D_ASC',
  FeesDistinctCountAmountUSDDesc = 'FEES_DISTINCT_COUNT_AMOUNT_U_S_D_DESC',
  FeesDistinctCountAmountXAsc = 'FEES_DISTINCT_COUNT_AMOUNT_X_ASC',
  FeesDistinctCountAmountXDesc = 'FEES_DISTINCT_COUNT_AMOUNT_X_DESC',
  FeesDistinctCountAmountYAsc = 'FEES_DISTINCT_COUNT_AMOUNT_Y_ASC',
  FeesDistinctCountAmountYDesc = 'FEES_DISTINCT_COUNT_AMOUNT_Y_DESC',
  FeesDistinctCountBlockRangeAsc = 'FEES_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  FeesDistinctCountBlockRangeDesc = 'FEES_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  FeesDistinctCountIdAsc = 'FEES_DISTINCT_COUNT_ID_ASC',
  FeesDistinctCountIdDesc = 'FEES_DISTINCT_COUNT_ID_DESC',
  FeesDistinctCountOwnerIdAsc = 'FEES_DISTINCT_COUNT_OWNER_ID_ASC',
  FeesDistinctCountOwnerIdDesc = 'FEES_DISTINCT_COUNT_OWNER_ID_DESC',
  FeesDistinctCountPoolIdAsc = 'FEES_DISTINCT_COUNT_POOL_ID_ASC',
  FeesDistinctCountPoolIdDesc = 'FEES_DISTINCT_COUNT_POOL_ID_DESC',
  FeesDistinctCountPositionIdAsc = 'FEES_DISTINCT_COUNT_POSITION_ID_ASC',
  FeesDistinctCountPositionIdDesc = 'FEES_DISTINCT_COUNT_POSITION_ID_DESC',
  FeesDistinctCountTransactionIdAsc = 'FEES_DISTINCT_COUNT_TRANSACTION_ID_ASC',
  FeesDistinctCountTransactionIdDesc = 'FEES_DISTINCT_COUNT_TRANSACTION_ID_DESC',
  FeesMaxAmountUSDAsc = 'FEES_MAX_AMOUNT_U_S_D_ASC',
  FeesMaxAmountUSDDesc = 'FEES_MAX_AMOUNT_U_S_D_DESC',
  FeesMaxAmountXAsc = 'FEES_MAX_AMOUNT_X_ASC',
  FeesMaxAmountXDesc = 'FEES_MAX_AMOUNT_X_DESC',
  FeesMaxAmountYAsc = 'FEES_MAX_AMOUNT_Y_ASC',
  FeesMaxAmountYDesc = 'FEES_MAX_AMOUNT_Y_DESC',
  FeesMaxBlockRangeAsc = 'FEES_MAX_BLOCK_RANGE_ASC',
  FeesMaxBlockRangeDesc = 'FEES_MAX_BLOCK_RANGE_DESC',
  FeesMaxIdAsc = 'FEES_MAX_ID_ASC',
  FeesMaxIdDesc = 'FEES_MAX_ID_DESC',
  FeesMaxOwnerIdAsc = 'FEES_MAX_OWNER_ID_ASC',
  FeesMaxOwnerIdDesc = 'FEES_MAX_OWNER_ID_DESC',
  FeesMaxPoolIdAsc = 'FEES_MAX_POOL_ID_ASC',
  FeesMaxPoolIdDesc = 'FEES_MAX_POOL_ID_DESC',
  FeesMaxPositionIdAsc = 'FEES_MAX_POSITION_ID_ASC',
  FeesMaxPositionIdDesc = 'FEES_MAX_POSITION_ID_DESC',
  FeesMaxTransactionIdAsc = 'FEES_MAX_TRANSACTION_ID_ASC',
  FeesMaxTransactionIdDesc = 'FEES_MAX_TRANSACTION_ID_DESC',
  FeesMinAmountUSDAsc = 'FEES_MIN_AMOUNT_U_S_D_ASC',
  FeesMinAmountUSDDesc = 'FEES_MIN_AMOUNT_U_S_D_DESC',
  FeesMinAmountXAsc = 'FEES_MIN_AMOUNT_X_ASC',
  FeesMinAmountXDesc = 'FEES_MIN_AMOUNT_X_DESC',
  FeesMinAmountYAsc = 'FEES_MIN_AMOUNT_Y_ASC',
  FeesMinAmountYDesc = 'FEES_MIN_AMOUNT_Y_DESC',
  FeesMinBlockRangeAsc = 'FEES_MIN_BLOCK_RANGE_ASC',
  FeesMinBlockRangeDesc = 'FEES_MIN_BLOCK_RANGE_DESC',
  FeesMinIdAsc = 'FEES_MIN_ID_ASC',
  FeesMinIdDesc = 'FEES_MIN_ID_DESC',
  FeesMinOwnerIdAsc = 'FEES_MIN_OWNER_ID_ASC',
  FeesMinOwnerIdDesc = 'FEES_MIN_OWNER_ID_DESC',
  FeesMinPoolIdAsc = 'FEES_MIN_POOL_ID_ASC',
  FeesMinPoolIdDesc = 'FEES_MIN_POOL_ID_DESC',
  FeesMinPositionIdAsc = 'FEES_MIN_POSITION_ID_ASC',
  FeesMinPositionIdDesc = 'FEES_MIN_POSITION_ID_DESC',
  FeesMinTransactionIdAsc = 'FEES_MIN_TRANSACTION_ID_ASC',
  FeesMinTransactionIdDesc = 'FEES_MIN_TRANSACTION_ID_DESC',
  FeesStddevPopulationAmountUSDAsc = 'FEES_STDDEV_POPULATION_AMOUNT_U_S_D_ASC',
  FeesStddevPopulationAmountUSDDesc = 'FEES_STDDEV_POPULATION_AMOUNT_U_S_D_DESC',
  FeesStddevPopulationAmountXAsc = 'FEES_STDDEV_POPULATION_AMOUNT_X_ASC',
  FeesStddevPopulationAmountXDesc = 'FEES_STDDEV_POPULATION_AMOUNT_X_DESC',
  FeesStddevPopulationAmountYAsc = 'FEES_STDDEV_POPULATION_AMOUNT_Y_ASC',
  FeesStddevPopulationAmountYDesc = 'FEES_STDDEV_POPULATION_AMOUNT_Y_DESC',
  FeesStddevPopulationBlockRangeAsc = 'FEES_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  FeesStddevPopulationBlockRangeDesc = 'FEES_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  FeesStddevPopulationIdAsc = 'FEES_STDDEV_POPULATION_ID_ASC',
  FeesStddevPopulationIdDesc = 'FEES_STDDEV_POPULATION_ID_DESC',
  FeesStddevPopulationOwnerIdAsc = 'FEES_STDDEV_POPULATION_OWNER_ID_ASC',
  FeesStddevPopulationOwnerIdDesc = 'FEES_STDDEV_POPULATION_OWNER_ID_DESC',
  FeesStddevPopulationPoolIdAsc = 'FEES_STDDEV_POPULATION_POOL_ID_ASC',
  FeesStddevPopulationPoolIdDesc = 'FEES_STDDEV_POPULATION_POOL_ID_DESC',
  FeesStddevPopulationPositionIdAsc = 'FEES_STDDEV_POPULATION_POSITION_ID_ASC',
  FeesStddevPopulationPositionIdDesc = 'FEES_STDDEV_POPULATION_POSITION_ID_DESC',
  FeesStddevPopulationTransactionIdAsc = 'FEES_STDDEV_POPULATION_TRANSACTION_ID_ASC',
  FeesStddevPopulationTransactionIdDesc = 'FEES_STDDEV_POPULATION_TRANSACTION_ID_DESC',
  FeesStddevSampleAmountUSDAsc = 'FEES_STDDEV_SAMPLE_AMOUNT_U_S_D_ASC',
  FeesStddevSampleAmountUSDDesc = 'FEES_STDDEV_SAMPLE_AMOUNT_U_S_D_DESC',
  FeesStddevSampleAmountXAsc = 'FEES_STDDEV_SAMPLE_AMOUNT_X_ASC',
  FeesStddevSampleAmountXDesc = 'FEES_STDDEV_SAMPLE_AMOUNT_X_DESC',
  FeesStddevSampleAmountYAsc = 'FEES_STDDEV_SAMPLE_AMOUNT_Y_ASC',
  FeesStddevSampleAmountYDesc = 'FEES_STDDEV_SAMPLE_AMOUNT_Y_DESC',
  FeesStddevSampleBlockRangeAsc = 'FEES_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  FeesStddevSampleBlockRangeDesc = 'FEES_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  FeesStddevSampleIdAsc = 'FEES_STDDEV_SAMPLE_ID_ASC',
  FeesStddevSampleIdDesc = 'FEES_STDDEV_SAMPLE_ID_DESC',
  FeesStddevSampleOwnerIdAsc = 'FEES_STDDEV_SAMPLE_OWNER_ID_ASC',
  FeesStddevSampleOwnerIdDesc = 'FEES_STDDEV_SAMPLE_OWNER_ID_DESC',
  FeesStddevSamplePoolIdAsc = 'FEES_STDDEV_SAMPLE_POOL_ID_ASC',
  FeesStddevSamplePoolIdDesc = 'FEES_STDDEV_SAMPLE_POOL_ID_DESC',
  FeesStddevSamplePositionIdAsc = 'FEES_STDDEV_SAMPLE_POSITION_ID_ASC',
  FeesStddevSamplePositionIdDesc = 'FEES_STDDEV_SAMPLE_POSITION_ID_DESC',
  FeesStddevSampleTransactionIdAsc = 'FEES_STDDEV_SAMPLE_TRANSACTION_ID_ASC',
  FeesStddevSampleTransactionIdDesc = 'FEES_STDDEV_SAMPLE_TRANSACTION_ID_DESC',
  FeesSumAmountUSDAsc = 'FEES_SUM_AMOUNT_U_S_D_ASC',
  FeesSumAmountUSDDesc = 'FEES_SUM_AMOUNT_U_S_D_DESC',
  FeesSumAmountXAsc = 'FEES_SUM_AMOUNT_X_ASC',
  FeesSumAmountXDesc = 'FEES_SUM_AMOUNT_X_DESC',
  FeesSumAmountYAsc = 'FEES_SUM_AMOUNT_Y_ASC',
  FeesSumAmountYDesc = 'FEES_SUM_AMOUNT_Y_DESC',
  FeesSumBlockRangeAsc = 'FEES_SUM_BLOCK_RANGE_ASC',
  FeesSumBlockRangeDesc = 'FEES_SUM_BLOCK_RANGE_DESC',
  FeesSumIdAsc = 'FEES_SUM_ID_ASC',
  FeesSumIdDesc = 'FEES_SUM_ID_DESC',
  FeesSumOwnerIdAsc = 'FEES_SUM_OWNER_ID_ASC',
  FeesSumOwnerIdDesc = 'FEES_SUM_OWNER_ID_DESC',
  FeesSumPoolIdAsc = 'FEES_SUM_POOL_ID_ASC',
  FeesSumPoolIdDesc = 'FEES_SUM_POOL_ID_DESC',
  FeesSumPositionIdAsc = 'FEES_SUM_POSITION_ID_ASC',
  FeesSumPositionIdDesc = 'FEES_SUM_POSITION_ID_DESC',
  FeesSumTransactionIdAsc = 'FEES_SUM_TRANSACTION_ID_ASC',
  FeesSumTransactionIdDesc = 'FEES_SUM_TRANSACTION_ID_DESC',
  FeesVariancePopulationAmountUSDAsc = 'FEES_VARIANCE_POPULATION_AMOUNT_U_S_D_ASC',
  FeesVariancePopulationAmountUSDDesc = 'FEES_VARIANCE_POPULATION_AMOUNT_U_S_D_DESC',
  FeesVariancePopulationAmountXAsc = 'FEES_VARIANCE_POPULATION_AMOUNT_X_ASC',
  FeesVariancePopulationAmountXDesc = 'FEES_VARIANCE_POPULATION_AMOUNT_X_DESC',
  FeesVariancePopulationAmountYAsc = 'FEES_VARIANCE_POPULATION_AMOUNT_Y_ASC',
  FeesVariancePopulationAmountYDesc = 'FEES_VARIANCE_POPULATION_AMOUNT_Y_DESC',
  FeesVariancePopulationBlockRangeAsc = 'FEES_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  FeesVariancePopulationBlockRangeDesc = 'FEES_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  FeesVariancePopulationIdAsc = 'FEES_VARIANCE_POPULATION_ID_ASC',
  FeesVariancePopulationIdDesc = 'FEES_VARIANCE_POPULATION_ID_DESC',
  FeesVariancePopulationOwnerIdAsc = 'FEES_VARIANCE_POPULATION_OWNER_ID_ASC',
  FeesVariancePopulationOwnerIdDesc = 'FEES_VARIANCE_POPULATION_OWNER_ID_DESC',
  FeesVariancePopulationPoolIdAsc = 'FEES_VARIANCE_POPULATION_POOL_ID_ASC',
  FeesVariancePopulationPoolIdDesc = 'FEES_VARIANCE_POPULATION_POOL_ID_DESC',
  FeesVariancePopulationPositionIdAsc = 'FEES_VARIANCE_POPULATION_POSITION_ID_ASC',
  FeesVariancePopulationPositionIdDesc = 'FEES_VARIANCE_POPULATION_POSITION_ID_DESC',
  FeesVariancePopulationTransactionIdAsc = 'FEES_VARIANCE_POPULATION_TRANSACTION_ID_ASC',
  FeesVariancePopulationTransactionIdDesc = 'FEES_VARIANCE_POPULATION_TRANSACTION_ID_DESC',
  FeesVarianceSampleAmountUSDAsc = 'FEES_VARIANCE_SAMPLE_AMOUNT_U_S_D_ASC',
  FeesVarianceSampleAmountUSDDesc = 'FEES_VARIANCE_SAMPLE_AMOUNT_U_S_D_DESC',
  FeesVarianceSampleAmountXAsc = 'FEES_VARIANCE_SAMPLE_AMOUNT_X_ASC',
  FeesVarianceSampleAmountXDesc = 'FEES_VARIANCE_SAMPLE_AMOUNT_X_DESC',
  FeesVarianceSampleAmountYAsc = 'FEES_VARIANCE_SAMPLE_AMOUNT_Y_ASC',
  FeesVarianceSampleAmountYDesc = 'FEES_VARIANCE_SAMPLE_AMOUNT_Y_DESC',
  FeesVarianceSampleBlockRangeAsc = 'FEES_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  FeesVarianceSampleBlockRangeDesc = 'FEES_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  FeesVarianceSampleIdAsc = 'FEES_VARIANCE_SAMPLE_ID_ASC',
  FeesVarianceSampleIdDesc = 'FEES_VARIANCE_SAMPLE_ID_DESC',
  FeesVarianceSampleOwnerIdAsc = 'FEES_VARIANCE_SAMPLE_OWNER_ID_ASC',
  FeesVarianceSampleOwnerIdDesc = 'FEES_VARIANCE_SAMPLE_OWNER_ID_DESC',
  FeesVarianceSamplePoolIdAsc = 'FEES_VARIANCE_SAMPLE_POOL_ID_ASC',
  FeesVarianceSamplePoolIdDesc = 'FEES_VARIANCE_SAMPLE_POOL_ID_DESC',
  FeesVarianceSamplePositionIdAsc = 'FEES_VARIANCE_SAMPLE_POSITION_ID_ASC',
  FeesVarianceSamplePositionIdDesc = 'FEES_VARIANCE_SAMPLE_POSITION_ID_DESC',
  FeesVarianceSampleTransactionIdAsc = 'FEES_VARIANCE_SAMPLE_TRANSACTION_ID_ASC',
  FeesVarianceSampleTransactionIdDesc = 'FEES_VARIANCE_SAMPLE_TRANSACTION_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  LiquidityAsc = 'LIQUIDITY_ASC',
  LiquidityDesc = 'LIQUIDITY_DESC',
  Natural = 'NATURAL',
  OwnerIdAsc = 'OWNER_ID_ASC',
  OwnerIdDesc = 'OWNER_ID_DESC',
  PoolIdAsc = 'POOL_ID_ASC',
  PoolIdDesc = 'POOL_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  PrincipalAmountXAsc = 'PRINCIPAL_AMOUNT_X_ASC',
  PrincipalAmountXDesc = 'PRINCIPAL_AMOUNT_X_DESC',
  PrincipalAmountYAsc = 'PRINCIPAL_AMOUNT_Y_ASC',
  PrincipalAmountYDesc = 'PRINCIPAL_AMOUNT_Y_DESC',
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC',
  TickLowerAsc = 'TICK_LOWER_ASC',
  TickLowerDesc = 'TICK_LOWER_DESC',
  TickUpperAsc = 'TICK_UPPER_ASC',
  TickUpperDesc = 'TICK_UPPER_DESC',
  TokenIdAsc = 'TOKEN_ID_ASC',
  TokenIdDesc = 'TOKEN_ID_DESC',
  TransactionIdAsc = 'TRANSACTION_ID_ASC',
  TransactionIdDesc = 'TRANSACTION_ID_DESC'
}

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query';
  _metadata?: Maybe<_Metadata>;
  _metadatas?: Maybe<_Metadatas>;
  account?: Maybe<Account>;
  /** Reads a single `Account` using its globally unique `ID`. */
  accountByNodeId?: Maybe<Account>;
  /** Reads and enables pagination through a set of `Account`. */
  accounts?: Maybe<AccountsConnection>;
  claimFee?: Maybe<ClaimFee>;
  /** Reads a single `ClaimFee` using its globally unique `ID`. */
  claimFeeByNodeId?: Maybe<ClaimFee>;
  claimFeeIncentiveToken?: Maybe<ClaimFeeIncentiveToken>;
  /** Reads a single `ClaimFeeIncentiveToken` using its globally unique `ID`. */
  claimFeeIncentiveTokenByNodeId?: Maybe<ClaimFeeIncentiveToken>;
  /** Reads and enables pagination through a set of `ClaimFeeIncentiveToken`. */
  claimFeeIncentiveTokens?: Maybe<ClaimFeeIncentiveTokensConnection>;
  /** Reads and enables pagination through a set of `ClaimFee`. */
  claimFees?: Maybe<ClaimFeesConnection>;
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID']['output'];
  pool?: Maybe<Pool>;
  /** Reads a single `Pool` using its globally unique `ID`. */
  poolByNodeId?: Maybe<Pool>;
  /** Reads and enables pagination through a set of `PoolDayDatum`. */
  poolDayData?: Maybe<PoolDayDataConnection>;
  poolDayDatum?: Maybe<PoolDayDatum>;
  /** Reads a single `PoolDayDatum` using its globally unique `ID`. */
  poolDayDatumByNodeId?: Maybe<PoolDayDatum>;
  /** Reads and enables pagination through a set of `PoolHourDatum`. */
  poolHourData?: Maybe<PoolHourDataConnection>;
  poolHourDatum?: Maybe<PoolHourDatum>;
  /** Reads a single `PoolHourDatum` using its globally unique `ID`. */
  poolHourDatumByNodeId?: Maybe<PoolHourDatum>;
  poolTokenIncentive?: Maybe<PoolTokenIncentive>;
  /** Reads a single `PoolTokenIncentive` using its globally unique `ID`. */
  poolTokenIncentiveByNodeId?: Maybe<PoolTokenIncentive>;
  /** Reads and enables pagination through a set of `PoolTokenIncentive`. */
  poolTokenIncentives?: Maybe<PoolTokenIncentivesConnection>;
  /** Reads and enables pagination through a set of `Pool`. */
  pools?: Maybe<PoolsConnection>;
  position?: Maybe<Position>;
  /** Reads a single `Position` using its globally unique `ID`. */
  positionByNodeId?: Maybe<Position>;
  /** Reads and enables pagination through a set of `Position`. */
  positions?: Maybe<PositionsConnection>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  swap?: Maybe<Swap>;
  /** Reads a single `Swap` using its globally unique `ID`. */
  swapByNodeId?: Maybe<Swap>;
  swapRoute?: Maybe<SwapRoute>;
  /** Reads a single `SwapRoute` using its globally unique `ID`. */
  swapRouteByNodeId?: Maybe<SwapRoute>;
  /** Reads and enables pagination through a set of `SwapRoute`. */
  swapRoutes?: Maybe<SwapRoutesConnection>;
  /** Reads and enables pagination through a set of `Swap`. */
  swaps?: Maybe<SwapsConnection>;
  token?: Maybe<Token>;
  /** Reads a single `Token` using its globally unique `ID`. */
  tokenByNodeId?: Maybe<Token>;
  /** Reads and enables pagination through a set of `Token`. */
  tokens?: Maybe<TokensConnection>;
  transaction?: Maybe<Transaction>;
  /** Reads a single `Transaction` using its globally unique `ID`. */
  transactionByNodeId?: Maybe<Transaction>;
  /** Reads and enables pagination through a set of `Transaction`. */
  transactions?: Maybe<TransactionsConnection>;
};


/** The root query type which gives access points into the data universe. */
export type Query_MetadataArgs = {
  chainId?: InputMaybe<Scalars['String']['input']>;
};


/** The root query type which gives access points into the data universe. */
export type Query_MetadatasArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAccountArgs = {
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAccountByNodeIdArgs = {
  distinct?: InputMaybe<InputMaybe<Accounts_Distinct_Enum>[]>;
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAccountsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Accounts_Distinct_Enum>[]>;
  filter?: InputMaybe<AccountFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountsOrderBy[]>;
};


/** The root query type which gives access points into the data universe. */
export type QueryClaimFeeArgs = {
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryClaimFeeByNodeIdArgs = {
  distinct?: InputMaybe<InputMaybe<Claim_Fees_Distinct_Enum>[]>;
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryClaimFeeIncentiveTokenArgs = {
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryClaimFeeIncentiveTokenByNodeIdArgs = {
  distinct?: InputMaybe<InputMaybe<Claim_Fee_Incentive_Tokens_Distinct_Enum>[]>;
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryClaimFeeIncentiveTokensArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Claim_Fee_Incentive_Tokens_Distinct_Enum>[]>;
  filter?: InputMaybe<ClaimFeeIncentiveTokenFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimFeeIncentiveTokensOrderBy[]>;
};


/** The root query type which gives access points into the data universe. */
export type QueryClaimFeesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Claim_Fees_Distinct_Enum>[]>;
  filter?: InputMaybe<ClaimFeeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimFeesOrderBy[]>;
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPoolArgs = {
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPoolByNodeIdArgs = {
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPoolDayDataArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pool_Day_Data_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolDayDatumFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolDayDataOrderBy[]>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPoolDayDatumArgs = {
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPoolDayDatumByNodeIdArgs = {
  distinct?: InputMaybe<InputMaybe<Pool_Day_Data_Distinct_Enum>[]>;
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPoolHourDataArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pool_Hour_Data_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolHourDatumFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolHourDataOrderBy[]>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPoolHourDatumArgs = {
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPoolHourDatumByNodeIdArgs = {
  distinct?: InputMaybe<InputMaybe<Pool_Hour_Data_Distinct_Enum>[]>;
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPoolTokenIncentiveArgs = {
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPoolTokenIncentiveByNodeIdArgs = {
  distinct?: InputMaybe<InputMaybe<Pool_Token_Incentives_Distinct_Enum>[]>;
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPoolTokenIncentivesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pool_Token_Incentives_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolTokenIncentiveFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolTokenIncentivesOrderBy[]>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPoolsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPositionArgs = {
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPositionByNodeIdArgs = {
  distinct?: InputMaybe<InputMaybe<Positions_Distinct_Enum>[]>;
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPositionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Positions_Distinct_Enum>[]>;
  filter?: InputMaybe<PositionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionsOrderBy[]>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySwapArgs = {
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySwapByNodeIdArgs = {
  distinct?: InputMaybe<InputMaybe<Swaps_Distinct_Enum>[]>;
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySwapRouteArgs = {
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySwapRouteByNodeIdArgs = {
  distinct?: InputMaybe<InputMaybe<Swap_Routes_Distinct_Enum>[]>;
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySwapRoutesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Swap_Routes_Distinct_Enum>[]>;
  filter?: InputMaybe<SwapRouteFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapRoutesOrderBy[]>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySwapsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Swaps_Distinct_Enum>[]>;
  filter?: InputMaybe<SwapFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapsOrderBy[]>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTokenArgs = {
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTokenByNodeIdArgs = {
  distinct?: InputMaybe<InputMaybe<Tokens_Distinct_Enum>[]>;
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTokensArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Tokens_Distinct_Enum>[]>;
  filter?: InputMaybe<TokenFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokensOrderBy[]>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTransactionArgs = {
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTransactionByNodeIdArgs = {
  distinct?: InputMaybe<InputMaybe<Transactions_Distinct_Enum>[]>;
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTransactionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Transactions_Distinct_Enum>[]>;
  filter?: InputMaybe<TransactionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TransactionsOrderBy[]>;
};

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value, treating null like an ordinary value (case-insensitive). */
  distinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Ends with the specified string (case-sensitive). */
  endsWith?: InputMaybe<Scalars['String']['input']>;
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value (case-insensitive). */
  equalToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['String']['input']>;
  /** Greater than the specified value (case-insensitive). */
  greaterThanInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Greater than or equal to the specified value (case-insensitive). */
  greaterThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Scalars['String']['input'][]>;
  /** Included in the specified list (case-insensitive). */
  inInsensitive?: InputMaybe<Scalars['String']['input'][]>;
  /** Contains the specified string (case-sensitive). */
  includes?: InputMaybe<Scalars['String']['input']>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['String']['input']>;
  /** Less than the specified value (case-insensitive). */
  lessThanInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Less than or equal to the specified value (case-insensitive). */
  lessThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: InputMaybe<Scalars['String']['input']>;
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value, treating null like an ordinary value (case-insensitive). */
  notDistinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: InputMaybe<Scalars['String']['input']>;
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value (case-insensitive). */
  notEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Scalars['String']['input'][]>;
  /** Not included in the specified list (case-insensitive). */
  notInInsensitive?: InputMaybe<Scalars['String']['input'][]>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: InputMaybe<Scalars['String']['input']>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: InputMaybe<Scalars['String']['input']>;
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: InputMaybe<Scalars['String']['input']>;
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Starts with the specified string (case-sensitive). */
  startsWith?: InputMaybe<Scalars['String']['input']>;
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
};

export type Swap = Node & {
  __typename?: 'Swap';
  amountIn: Scalars['BigFloat']['output'];
  amountOut: Scalars['BigFloat']['output'];
  feeUSD: Scalars['String']['output'];
  id: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  /** Reads and enables pagination through a set of `Pool`. */
  poolsBySwapRouteSwapIdAndPoolId: SwapPoolsBySwapRouteSwapIdAndPoolIdManyToManyConnection;
  /** Reads a single `Account` that is related to this `Swap`. */
  sender?: Maybe<Account>;
  senderId: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `SwapRoute`. */
  swapRoutes: SwapRoutesConnection;
  /** Reads a single `Token` that is related to this `Swap`. */
  tokenIn?: Maybe<Token>;
  tokenInId: Scalars['String']['output'];
  /** Reads a single `Token` that is related to this `Swap`. */
  tokenOut?: Maybe<Token>;
  tokenOutId: Scalars['String']['output'];
  /** Reads a single `Transaction` that is related to this `Swap`. */
  transaction?: Maybe<Transaction>;
  transactionId: Scalars['String']['output'];
};


export type SwapPoolsBySwapRouteSwapIdAndPoolIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};


export type SwapSwapRoutesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Swap_Routes_Distinct_Enum>[]>;
  filter?: InputMaybe<SwapRouteFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapRoutesOrderBy[]>;
};

export type SwapAggregates = {
  __typename?: 'SwapAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<SwapAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<SwapDistinctCountAggregates>;
  keys?: Maybe<Scalars['String']['output'][]>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<SwapMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<SwapMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<SwapStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<SwapStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<SwapSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<SwapVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<SwapVarianceSampleAggregates>;
};

/** A filter to be used against aggregates of `Swap` object types. */
export type SwapAggregatesFilter = {
  /** Mean average aggregate over matching `Swap` objects. */
  average?: InputMaybe<SwapAverageAggregateFilter>;
  /** Distinct count aggregate over matching `Swap` objects. */
  distinctCount?: InputMaybe<SwapDistinctCountAggregateFilter>;
  /** A filter that must pass for the relevant `Swap` object to be included within the aggregate. */
  filter?: InputMaybe<SwapFilter>;
  /** Maximum aggregate over matching `Swap` objects. */
  max?: InputMaybe<SwapMaxAggregateFilter>;
  /** Minimum aggregate over matching `Swap` objects. */
  min?: InputMaybe<SwapMinAggregateFilter>;
  /** Population standard deviation aggregate over matching `Swap` objects. */
  stddevPopulation?: InputMaybe<SwapStddevPopulationAggregateFilter>;
  /** Sample standard deviation aggregate over matching `Swap` objects. */
  stddevSample?: InputMaybe<SwapStddevSampleAggregateFilter>;
  /** Sum aggregate over matching `Swap` objects. */
  sum?: InputMaybe<SwapSumAggregateFilter>;
  /** Population variance aggregate over matching `Swap` objects. */
  variancePopulation?: InputMaybe<SwapVariancePopulationAggregateFilter>;
  /** Sample variance aggregate over matching `Swap` objects. */
  varianceSample?: InputMaybe<SwapVarianceSampleAggregateFilter>;
};

export type SwapAverageAggregateFilter = {
  amountIn?: InputMaybe<BigFloatFilter>;
  amountOut?: InputMaybe<BigFloatFilter>;
};

export type SwapAverageAggregates = {
  __typename?: 'SwapAverageAggregates';
  /** Mean average of amountIn across the matching connection */
  amountIn?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of amountOut across the matching connection */
  amountOut?: Maybe<Scalars['BigFloat']['output']>;
};

export type SwapDistinctCountAggregateFilter = {
  _blockRange?: InputMaybe<BigIntFilter>;
  _id?: InputMaybe<BigIntFilter>;
  amountIn?: InputMaybe<BigIntFilter>;
  amountOut?: InputMaybe<BigIntFilter>;
  feeUSD?: InputMaybe<BigIntFilter>;
  id?: InputMaybe<BigIntFilter>;
  senderId?: InputMaybe<BigIntFilter>;
  tokenInId?: InputMaybe<BigIntFilter>;
  tokenOutId?: InputMaybe<BigIntFilter>;
  transactionId?: InputMaybe<BigIntFilter>;
};

export type SwapDistinctCountAggregates = {
  __typename?: 'SwapDistinctCountAggregates';
  /** Distinct count of _blockRange across the matching connection */
  _blockRange?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of _id across the matching connection */
  _id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of amountIn across the matching connection */
  amountIn?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of amountOut across the matching connection */
  amountOut?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of feeUSD across the matching connection */
  feeUSD?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of senderId across the matching connection */
  senderId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of tokenInId across the matching connection */
  tokenInId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of tokenOutId across the matching connection */
  tokenOutId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of transactionId across the matching connection */
  transactionId?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `Swap` object types. All fields are combined with a logical ‘and.’ */
export type SwapFilter = {
  /** Filter by the object’s `amountIn` field. */
  amountIn?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `amountOut` field. */
  amountOut?: InputMaybe<BigFloatFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<SwapFilter[]>;
  /** Filter by the object’s `feeUSD` field. */
  feeUSD?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SwapFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<SwapFilter[]>;
  /** Filter by the object’s `sender` relation. */
  sender?: InputMaybe<AccountFilter>;
  /** Filter by the object’s `senderId` field. */
  senderId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `swapRoutes` relation. */
  swapRoutes?: InputMaybe<SwapToManySwapRouteFilter>;
  /** Some related `swapRoutes` exist. */
  swapRoutesExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `tokenIn` relation. */
  tokenIn?: InputMaybe<TokenFilter>;
  /** Filter by the object’s `tokenInId` field. */
  tokenInId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `tokenOut` relation. */
  tokenOut?: InputMaybe<TokenFilter>;
  /** Filter by the object’s `tokenOutId` field. */
  tokenOutId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `transaction` relation. */
  transaction?: InputMaybe<TransactionFilter>;
  /** Filter by the object’s `transactionId` field. */
  transactionId?: InputMaybe<StringFilter>;
};

export type SwapMaxAggregateFilter = {
  amountIn?: InputMaybe<BigFloatFilter>;
  amountOut?: InputMaybe<BigFloatFilter>;
};

export type SwapMaxAggregates = {
  __typename?: 'SwapMaxAggregates';
  /** Maximum of amountIn across the matching connection */
  amountIn?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of amountOut across the matching connection */
  amountOut?: Maybe<Scalars['BigFloat']['output']>;
};

export type SwapMinAggregateFilter = {
  amountIn?: InputMaybe<BigFloatFilter>;
  amountOut?: InputMaybe<BigFloatFilter>;
};

export type SwapMinAggregates = {
  __typename?: 'SwapMinAggregates';
  /** Minimum of amountIn across the matching connection */
  amountIn?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of amountOut across the matching connection */
  amountOut?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `Pool` values, with data from `SwapRoute`. */
export type SwapPoolsBySwapRouteSwapIdAndPoolIdManyToManyConnection = {
  __typename?: 'SwapPoolsBySwapRouteSwapIdAndPoolIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<PoolAggregates>;
  /** A list of edges which contains the `Pool`, info from the `SwapRoute`, and the cursor to aid in pagination. */
  edges: SwapPoolsBySwapRouteSwapIdAndPoolIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<PoolAggregates[]>;
  /** A list of `Pool` objects. */
  nodes: Maybe<Pool>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Pool` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Pool` values, with data from `SwapRoute`. */
export type SwapPoolsBySwapRouteSwapIdAndPoolIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: PoolsGroupBy[];
  having?: InputMaybe<PoolsHavingInput>;
};

/** A `Pool` edge in the connection, with data from `SwapRoute`. */
export type SwapPoolsBySwapRouteSwapIdAndPoolIdManyToManyEdge = {
  __typename?: 'SwapPoolsBySwapRouteSwapIdAndPoolIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Pool` at the end of the edge. */
  node?: Maybe<Pool>;
  /** Reads and enables pagination through a set of `SwapRoute`. */
  swaps: SwapRoutesConnection;
};


/** A `Pool` edge in the connection, with data from `SwapRoute`. */
export type SwapPoolsBySwapRouteSwapIdAndPoolIdManyToManyEdgeSwapsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Swap_Routes_Distinct_Enum>[]>;
  filter?: InputMaybe<SwapRouteFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapRoutesOrderBy[]>;
};

export type SwapRoute = Node & {
  __typename?: 'SwapRoute';
  amountIn: Scalars['BigFloat']['output'];
  amountOut: Scalars['BigFloat']['output'];
  currentTickIndex: Scalars['BigFloat']['output'];
  eventIndex: Scalars['Int']['output'];
  feeAmount: Scalars['BigFloat']['output'];
  feeUSD: Scalars['String']['output'];
  id: Scalars['String']['output'];
  liquidity: Scalars['BigFloat']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  /** Reads a single `Pool` that is related to this `SwapRoute`. */
  pool?: Maybe<Pool>;
  poolId: Scalars['String']['output'];
  sqrtPrice: Scalars['BigFloat']['output'];
  /** Reads a single `Swap` that is related to this `SwapRoute`. */
  swap?: Maybe<Swap>;
  swapId: Scalars['String']['output'];
  volumeUSD: Scalars['String']['output'];
  xToY: Scalars['Boolean']['output'];
};

export type SwapRouteAggregates = {
  __typename?: 'SwapRouteAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<SwapRouteAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<SwapRouteDistinctCountAggregates>;
  keys?: Maybe<Scalars['String']['output'][]>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<SwapRouteMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<SwapRouteMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<SwapRouteStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<SwapRouteStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<SwapRouteSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<SwapRouteVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<SwapRouteVarianceSampleAggregates>;
};

/** A filter to be used against aggregates of `SwapRoute` object types. */
export type SwapRouteAggregatesFilter = {
  /** Mean average aggregate over matching `SwapRoute` objects. */
  average?: InputMaybe<SwapRouteAverageAggregateFilter>;
  /** Distinct count aggregate over matching `SwapRoute` objects. */
  distinctCount?: InputMaybe<SwapRouteDistinctCountAggregateFilter>;
  /** A filter that must pass for the relevant `SwapRoute` object to be included within the aggregate. */
  filter?: InputMaybe<SwapRouteFilter>;
  /** Maximum aggregate over matching `SwapRoute` objects. */
  max?: InputMaybe<SwapRouteMaxAggregateFilter>;
  /** Minimum aggregate over matching `SwapRoute` objects. */
  min?: InputMaybe<SwapRouteMinAggregateFilter>;
  /** Population standard deviation aggregate over matching `SwapRoute` objects. */
  stddevPopulation?: InputMaybe<SwapRouteStddevPopulationAggregateFilter>;
  /** Sample standard deviation aggregate over matching `SwapRoute` objects. */
  stddevSample?: InputMaybe<SwapRouteStddevSampleAggregateFilter>;
  /** Sum aggregate over matching `SwapRoute` objects. */
  sum?: InputMaybe<SwapRouteSumAggregateFilter>;
  /** Population variance aggregate over matching `SwapRoute` objects. */
  variancePopulation?: InputMaybe<SwapRouteVariancePopulationAggregateFilter>;
  /** Sample variance aggregate over matching `SwapRoute` objects. */
  varianceSample?: InputMaybe<SwapRouteVarianceSampleAggregateFilter>;
};

export type SwapRouteAverageAggregateFilter = {
  amountIn?: InputMaybe<BigFloatFilter>;
  amountOut?: InputMaybe<BigFloatFilter>;
  currentTickIndex?: InputMaybe<BigFloatFilter>;
  eventIndex?: InputMaybe<BigFloatFilter>;
  feeAmount?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
};

export type SwapRouteAverageAggregates = {
  __typename?: 'SwapRouteAverageAggregates';
  /** Mean average of amountIn across the matching connection */
  amountIn?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of amountOut across the matching connection */
  amountOut?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of currentTickIndex across the matching connection */
  currentTickIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of eventIndex across the matching connection */
  eventIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of feeAmount across the matching connection */
  feeAmount?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
};

export type SwapRouteDistinctCountAggregateFilter = {
  _blockRange?: InputMaybe<BigIntFilter>;
  _id?: InputMaybe<BigIntFilter>;
  amountIn?: InputMaybe<BigIntFilter>;
  amountOut?: InputMaybe<BigIntFilter>;
  currentTickIndex?: InputMaybe<BigIntFilter>;
  eventIndex?: InputMaybe<BigIntFilter>;
  feeAmount?: InputMaybe<BigIntFilter>;
  feeUSD?: InputMaybe<BigIntFilter>;
  id?: InputMaybe<BigIntFilter>;
  liquidity?: InputMaybe<BigIntFilter>;
  poolId?: InputMaybe<BigIntFilter>;
  sqrtPrice?: InputMaybe<BigIntFilter>;
  swapId?: InputMaybe<BigIntFilter>;
  volumeUSD?: InputMaybe<BigIntFilter>;
  xToY?: InputMaybe<BigIntFilter>;
};

export type SwapRouteDistinctCountAggregates = {
  __typename?: 'SwapRouteDistinctCountAggregates';
  /** Distinct count of _blockRange across the matching connection */
  _blockRange?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of _id across the matching connection */
  _id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of amountIn across the matching connection */
  amountIn?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of amountOut across the matching connection */
  amountOut?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of currentTickIndex across the matching connection */
  currentTickIndex?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of eventIndex across the matching connection */
  eventIndex?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of feeAmount across the matching connection */
  feeAmount?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of feeUSD across the matching connection */
  feeUSD?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of swapId across the matching connection */
  swapId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of volumeUSD across the matching connection */
  volumeUSD?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of xToY across the matching connection */
  xToY?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `SwapRoute` object types. All fields are combined with a logical ‘and.’ */
export type SwapRouteFilter = {
  /** Filter by the object’s `amountIn` field. */
  amountIn?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `amountOut` field. */
  amountOut?: InputMaybe<BigFloatFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<SwapRouteFilter[]>;
  /** Filter by the object’s `currentTickIndex` field. */
  currentTickIndex?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `eventIndex` field. */
  eventIndex?: InputMaybe<IntFilter>;
  /** Filter by the object’s `feeAmount` field. */
  feeAmount?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `feeUSD` field. */
  feeUSD?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Filter by the object’s `liquidity` field. */
  liquidity?: InputMaybe<BigFloatFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SwapRouteFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<SwapRouteFilter[]>;
  /** Filter by the object’s `pool` relation. */
  pool?: InputMaybe<PoolFilter>;
  /** Filter by the object’s `poolId` field. */
  poolId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sqrtPrice` field. */
  sqrtPrice?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `swap` relation. */
  swap?: InputMaybe<SwapFilter>;
  /** Filter by the object’s `swapId` field. */
  swapId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `volumeUSD` field. */
  volumeUSD?: InputMaybe<StringFilter>;
  /** Filter by the object’s `xToY` field. */
  xToY?: InputMaybe<BooleanFilter>;
};

export type SwapRouteMaxAggregateFilter = {
  amountIn?: InputMaybe<BigFloatFilter>;
  amountOut?: InputMaybe<BigFloatFilter>;
  currentTickIndex?: InputMaybe<BigFloatFilter>;
  eventIndex?: InputMaybe<IntFilter>;
  feeAmount?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
};

export type SwapRouteMaxAggregates = {
  __typename?: 'SwapRouteMaxAggregates';
  /** Maximum of amountIn across the matching connection */
  amountIn?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of amountOut across the matching connection */
  amountOut?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of currentTickIndex across the matching connection */
  currentTickIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of eventIndex across the matching connection */
  eventIndex?: Maybe<Scalars['Int']['output']>;
  /** Maximum of feeAmount across the matching connection */
  feeAmount?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
};

export type SwapRouteMinAggregateFilter = {
  amountIn?: InputMaybe<BigFloatFilter>;
  amountOut?: InputMaybe<BigFloatFilter>;
  currentTickIndex?: InputMaybe<BigFloatFilter>;
  eventIndex?: InputMaybe<IntFilter>;
  feeAmount?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
};

export type SwapRouteMinAggregates = {
  __typename?: 'SwapRouteMinAggregates';
  /** Minimum of amountIn across the matching connection */
  amountIn?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of amountOut across the matching connection */
  amountOut?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of currentTickIndex across the matching connection */
  currentTickIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of eventIndex across the matching connection */
  eventIndex?: Maybe<Scalars['Int']['output']>;
  /** Minimum of feeAmount across the matching connection */
  feeAmount?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
};

export type SwapRouteStddevPopulationAggregateFilter = {
  amountIn?: InputMaybe<BigFloatFilter>;
  amountOut?: InputMaybe<BigFloatFilter>;
  currentTickIndex?: InputMaybe<BigFloatFilter>;
  eventIndex?: InputMaybe<BigFloatFilter>;
  feeAmount?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
};

export type SwapRouteStddevPopulationAggregates = {
  __typename?: 'SwapRouteStddevPopulationAggregates';
  /** Population standard deviation of amountIn across the matching connection */
  amountIn?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of amountOut across the matching connection */
  amountOut?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of currentTickIndex across the matching connection */
  currentTickIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of eventIndex across the matching connection */
  eventIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of feeAmount across the matching connection */
  feeAmount?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
};

export type SwapRouteStddevSampleAggregateFilter = {
  amountIn?: InputMaybe<BigFloatFilter>;
  amountOut?: InputMaybe<BigFloatFilter>;
  currentTickIndex?: InputMaybe<BigFloatFilter>;
  eventIndex?: InputMaybe<BigFloatFilter>;
  feeAmount?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
};

export type SwapRouteStddevSampleAggregates = {
  __typename?: 'SwapRouteStddevSampleAggregates';
  /** Sample standard deviation of amountIn across the matching connection */
  amountIn?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of amountOut across the matching connection */
  amountOut?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of currentTickIndex across the matching connection */
  currentTickIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of eventIndex across the matching connection */
  eventIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of feeAmount across the matching connection */
  feeAmount?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
};

export type SwapRouteSumAggregateFilter = {
  amountIn?: InputMaybe<BigFloatFilter>;
  amountOut?: InputMaybe<BigFloatFilter>;
  currentTickIndex?: InputMaybe<BigFloatFilter>;
  eventIndex?: InputMaybe<BigIntFilter>;
  feeAmount?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
};

export type SwapRouteSumAggregates = {
  __typename?: 'SwapRouteSumAggregates';
  /** Sum of amountIn across the matching connection */
  amountIn: Scalars['BigFloat']['output'];
  /** Sum of amountOut across the matching connection */
  amountOut: Scalars['BigFloat']['output'];
  /** Sum of currentTickIndex across the matching connection */
  currentTickIndex: Scalars['BigFloat']['output'];
  /** Sum of eventIndex across the matching connection */
  eventIndex: Scalars['BigInt']['output'];
  /** Sum of feeAmount across the matching connection */
  feeAmount: Scalars['BigFloat']['output'];
  /** Sum of liquidity across the matching connection */
  liquidity: Scalars['BigFloat']['output'];
  /** Sum of sqrtPrice across the matching connection */
  sqrtPrice: Scalars['BigFloat']['output'];
};

export type SwapRouteVariancePopulationAggregateFilter = {
  amountIn?: InputMaybe<BigFloatFilter>;
  amountOut?: InputMaybe<BigFloatFilter>;
  currentTickIndex?: InputMaybe<BigFloatFilter>;
  eventIndex?: InputMaybe<BigFloatFilter>;
  feeAmount?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
};

export type SwapRouteVariancePopulationAggregates = {
  __typename?: 'SwapRouteVariancePopulationAggregates';
  /** Population variance of amountIn across the matching connection */
  amountIn?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of amountOut across the matching connection */
  amountOut?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of currentTickIndex across the matching connection */
  currentTickIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of eventIndex across the matching connection */
  eventIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of feeAmount across the matching connection */
  feeAmount?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
};

export type SwapRouteVarianceSampleAggregateFilter = {
  amountIn?: InputMaybe<BigFloatFilter>;
  amountOut?: InputMaybe<BigFloatFilter>;
  currentTickIndex?: InputMaybe<BigFloatFilter>;
  eventIndex?: InputMaybe<BigFloatFilter>;
  feeAmount?: InputMaybe<BigFloatFilter>;
  liquidity?: InputMaybe<BigFloatFilter>;
  sqrtPrice?: InputMaybe<BigFloatFilter>;
};

export type SwapRouteVarianceSampleAggregates = {
  __typename?: 'SwapRouteVarianceSampleAggregates';
  /** Sample variance of amountIn across the matching connection */
  amountIn?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of amountOut across the matching connection */
  amountOut?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of currentTickIndex across the matching connection */
  currentTickIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of eventIndex across the matching connection */
  eventIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of feeAmount across the matching connection */
  feeAmount?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of liquidity across the matching connection */
  liquidity?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of sqrtPrice across the matching connection */
  sqrtPrice?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `SwapRoute` values. */
export type SwapRoutesConnection = {
  __typename?: 'SwapRoutesConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<SwapRouteAggregates>;
  /** A list of edges which contains the `SwapRoute` and cursor to aid in pagination. */
  edges: SwapRoutesEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<SwapRouteAggregates[]>;
  /** A list of `SwapRoute` objects. */
  nodes: Maybe<SwapRoute>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SwapRoute` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `SwapRoute` values. */
export type SwapRoutesConnectionGroupedAggregatesArgs = {
  groupBy: SwapRoutesGroupBy[];
  having?: InputMaybe<SwapRoutesHavingInput>;
};

/** A `SwapRoute` edge in the connection. */
export type SwapRoutesEdge = {
  __typename?: 'SwapRoutesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `SwapRoute` at the end of the edge. */
  node?: Maybe<SwapRoute>;
};

/** Grouping methods for `SwapRoute` for usage during aggregation. */
export enum SwapRoutesGroupBy {
  AmountIn = 'AMOUNT_IN',
  AmountOut = 'AMOUNT_OUT',
  CurrentTickIndex = 'CURRENT_TICK_INDEX',
  EventIndex = 'EVENT_INDEX',
  FeeAmount = 'FEE_AMOUNT',
  FeeUSD = 'FEE_U_S_D',
  Id = 'ID',
  Liquidity = 'LIQUIDITY',
  PoolId = 'POOL_ID',
  SqrtPrice = 'SQRT_PRICE',
  SwapId = 'SWAP_ID',
  VolumeUSD = 'VOLUME_U_S_D',
  XToY = 'X_TO_Y'
}

export type SwapRoutesHavingAverageInput = {
  amountIn?: InputMaybe<HavingBigfloatFilter>;
  amountOut?: InputMaybe<HavingBigfloatFilter>;
  currentTickIndex?: InputMaybe<HavingBigfloatFilter>;
  eventIndex?: InputMaybe<HavingIntFilter>;
  feeAmount?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
};

export type SwapRoutesHavingDistinctCountInput = {
  amountIn?: InputMaybe<HavingBigfloatFilter>;
  amountOut?: InputMaybe<HavingBigfloatFilter>;
  currentTickIndex?: InputMaybe<HavingBigfloatFilter>;
  eventIndex?: InputMaybe<HavingIntFilter>;
  feeAmount?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
};

/** Conditions for `SwapRoute` aggregates. */
export type SwapRoutesHavingInput = {
  AND?: InputMaybe<SwapRoutesHavingInput[]>;
  OR?: InputMaybe<SwapRoutesHavingInput[]>;
  average?: InputMaybe<SwapRoutesHavingAverageInput>;
  distinctCount?: InputMaybe<SwapRoutesHavingDistinctCountInput>;
  max?: InputMaybe<SwapRoutesHavingMaxInput>;
  min?: InputMaybe<SwapRoutesHavingMinInput>;
  stddevPopulation?: InputMaybe<SwapRoutesHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<SwapRoutesHavingStddevSampleInput>;
  sum?: InputMaybe<SwapRoutesHavingSumInput>;
  variancePopulation?: InputMaybe<SwapRoutesHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<SwapRoutesHavingVarianceSampleInput>;
};

export type SwapRoutesHavingMaxInput = {
  amountIn?: InputMaybe<HavingBigfloatFilter>;
  amountOut?: InputMaybe<HavingBigfloatFilter>;
  currentTickIndex?: InputMaybe<HavingBigfloatFilter>;
  eventIndex?: InputMaybe<HavingIntFilter>;
  feeAmount?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
};

export type SwapRoutesHavingMinInput = {
  amountIn?: InputMaybe<HavingBigfloatFilter>;
  amountOut?: InputMaybe<HavingBigfloatFilter>;
  currentTickIndex?: InputMaybe<HavingBigfloatFilter>;
  eventIndex?: InputMaybe<HavingIntFilter>;
  feeAmount?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
};

export type SwapRoutesHavingStddevPopulationInput = {
  amountIn?: InputMaybe<HavingBigfloatFilter>;
  amountOut?: InputMaybe<HavingBigfloatFilter>;
  currentTickIndex?: InputMaybe<HavingBigfloatFilter>;
  eventIndex?: InputMaybe<HavingIntFilter>;
  feeAmount?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
};

export type SwapRoutesHavingStddevSampleInput = {
  amountIn?: InputMaybe<HavingBigfloatFilter>;
  amountOut?: InputMaybe<HavingBigfloatFilter>;
  currentTickIndex?: InputMaybe<HavingBigfloatFilter>;
  eventIndex?: InputMaybe<HavingIntFilter>;
  feeAmount?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
};

export type SwapRoutesHavingSumInput = {
  amountIn?: InputMaybe<HavingBigfloatFilter>;
  amountOut?: InputMaybe<HavingBigfloatFilter>;
  currentTickIndex?: InputMaybe<HavingBigfloatFilter>;
  eventIndex?: InputMaybe<HavingIntFilter>;
  feeAmount?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
};

export type SwapRoutesHavingVariancePopulationInput = {
  amountIn?: InputMaybe<HavingBigfloatFilter>;
  amountOut?: InputMaybe<HavingBigfloatFilter>;
  currentTickIndex?: InputMaybe<HavingBigfloatFilter>;
  eventIndex?: InputMaybe<HavingIntFilter>;
  feeAmount?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
};

export type SwapRoutesHavingVarianceSampleInput = {
  amountIn?: InputMaybe<HavingBigfloatFilter>;
  amountOut?: InputMaybe<HavingBigfloatFilter>;
  currentTickIndex?: InputMaybe<HavingBigfloatFilter>;
  eventIndex?: InputMaybe<HavingIntFilter>;
  feeAmount?: InputMaybe<HavingBigfloatFilter>;
  liquidity?: InputMaybe<HavingBigfloatFilter>;
  sqrtPrice?: InputMaybe<HavingBigfloatFilter>;
};

/** Methods to use when ordering `SwapRoute`. */
export enum SwapRoutesOrderBy {
  AmountInAsc = 'AMOUNT_IN_ASC',
  AmountInDesc = 'AMOUNT_IN_DESC',
  AmountOutAsc = 'AMOUNT_OUT_ASC',
  AmountOutDesc = 'AMOUNT_OUT_DESC',
  CurrentTickIndexAsc = 'CURRENT_TICK_INDEX_ASC',
  CurrentTickIndexDesc = 'CURRENT_TICK_INDEX_DESC',
  EventIndexAsc = 'EVENT_INDEX_ASC',
  EventIndexDesc = 'EVENT_INDEX_DESC',
  FeeAmountAsc = 'FEE_AMOUNT_ASC',
  FeeAmountDesc = 'FEE_AMOUNT_DESC',
  FeeUSDAsc = 'FEE_U_S_D_ASC',
  FeeUSDDesc = 'FEE_U_S_D_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  LiquidityAsc = 'LIQUIDITY_ASC',
  LiquidityDesc = 'LIQUIDITY_DESC',
  Natural = 'NATURAL',
  PoolIdAsc = 'POOL_ID_ASC',
  PoolIdDesc = 'POOL_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SqrtPriceAsc = 'SQRT_PRICE_ASC',
  SqrtPriceDesc = 'SQRT_PRICE_DESC',
  SwapIdAsc = 'SWAP_ID_ASC',
  SwapIdDesc = 'SWAP_ID_DESC',
  VolumeUSDAsc = 'VOLUME_U_S_D_ASC',
  VolumeUSDDesc = 'VOLUME_U_S_D_DESC',
  XToYAsc = 'X_TO_Y_ASC',
  XToYDesc = 'X_TO_Y_DESC'
}

export type SwapStddevPopulationAggregateFilter = {
  amountIn?: InputMaybe<BigFloatFilter>;
  amountOut?: InputMaybe<BigFloatFilter>;
};

export type SwapStddevPopulationAggregates = {
  __typename?: 'SwapStddevPopulationAggregates';
  /** Population standard deviation of amountIn across the matching connection */
  amountIn?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of amountOut across the matching connection */
  amountOut?: Maybe<Scalars['BigFloat']['output']>;
};

export type SwapStddevSampleAggregateFilter = {
  amountIn?: InputMaybe<BigFloatFilter>;
  amountOut?: InputMaybe<BigFloatFilter>;
};

export type SwapStddevSampleAggregates = {
  __typename?: 'SwapStddevSampleAggregates';
  /** Sample standard deviation of amountIn across the matching connection */
  amountIn?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of amountOut across the matching connection */
  amountOut?: Maybe<Scalars['BigFloat']['output']>;
};

export type SwapSumAggregateFilter = {
  amountIn?: InputMaybe<BigFloatFilter>;
  amountOut?: InputMaybe<BigFloatFilter>;
};

export type SwapSumAggregates = {
  __typename?: 'SwapSumAggregates';
  /** Sum of amountIn across the matching connection */
  amountIn: Scalars['BigFloat']['output'];
  /** Sum of amountOut across the matching connection */
  amountOut: Scalars['BigFloat']['output'];
};

/** A filter to be used against many `SwapRoute` object types. All fields are combined with a logical ‘and.’ */
export type SwapToManySwapRouteFilter = {
  /** Aggregates across related `SwapRoute` match the filter criteria. */
  aggregates?: InputMaybe<SwapRouteAggregatesFilter>;
  /** Every related `SwapRoute` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SwapRouteFilter>;
  /** No related `SwapRoute` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SwapRouteFilter>;
  /** Some related `SwapRoute` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SwapRouteFilter>;
};

export type SwapVariancePopulationAggregateFilter = {
  amountIn?: InputMaybe<BigFloatFilter>;
  amountOut?: InputMaybe<BigFloatFilter>;
};

export type SwapVariancePopulationAggregates = {
  __typename?: 'SwapVariancePopulationAggregates';
  /** Population variance of amountIn across the matching connection */
  amountIn?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of amountOut across the matching connection */
  amountOut?: Maybe<Scalars['BigFloat']['output']>;
};

export type SwapVarianceSampleAggregateFilter = {
  amountIn?: InputMaybe<BigFloatFilter>;
  amountOut?: InputMaybe<BigFloatFilter>;
};

export type SwapVarianceSampleAggregates = {
  __typename?: 'SwapVarianceSampleAggregates';
  /** Sample variance of amountIn across the matching connection */
  amountIn?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of amountOut across the matching connection */
  amountOut?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `Swap` values. */
export type SwapsConnection = {
  __typename?: 'SwapsConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<SwapAggregates>;
  /** A list of edges which contains the `Swap` and cursor to aid in pagination. */
  edges: SwapsEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<SwapAggregates[]>;
  /** A list of `Swap` objects. */
  nodes: Maybe<Swap>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Swap` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Swap` values. */
export type SwapsConnectionGroupedAggregatesArgs = {
  groupBy: SwapsGroupBy[];
  having?: InputMaybe<SwapsHavingInput>;
};

/** A `Swap` edge in the connection. */
export type SwapsEdge = {
  __typename?: 'SwapsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Swap` at the end of the edge. */
  node?: Maybe<Swap>;
};

/** Grouping methods for `Swap` for usage during aggregation. */
export enum SwapsGroupBy {
  AmountIn = 'AMOUNT_IN',
  AmountOut = 'AMOUNT_OUT',
  FeeUSD = 'FEE_U_S_D',
  Id = 'ID',
  SenderId = 'SENDER_ID',
  TokenInId = 'TOKEN_IN_ID',
  TokenOutId = 'TOKEN_OUT_ID',
  TransactionId = 'TRANSACTION_ID'
}

export type SwapsHavingAverageInput = {
  amountIn?: InputMaybe<HavingBigfloatFilter>;
  amountOut?: InputMaybe<HavingBigfloatFilter>;
};

export type SwapsHavingDistinctCountInput = {
  amountIn?: InputMaybe<HavingBigfloatFilter>;
  amountOut?: InputMaybe<HavingBigfloatFilter>;
};

/** Conditions for `Swap` aggregates. */
export type SwapsHavingInput = {
  AND?: InputMaybe<SwapsHavingInput[]>;
  OR?: InputMaybe<SwapsHavingInput[]>;
  average?: InputMaybe<SwapsHavingAverageInput>;
  distinctCount?: InputMaybe<SwapsHavingDistinctCountInput>;
  max?: InputMaybe<SwapsHavingMaxInput>;
  min?: InputMaybe<SwapsHavingMinInput>;
  stddevPopulation?: InputMaybe<SwapsHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<SwapsHavingStddevSampleInput>;
  sum?: InputMaybe<SwapsHavingSumInput>;
  variancePopulation?: InputMaybe<SwapsHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<SwapsHavingVarianceSampleInput>;
};

export type SwapsHavingMaxInput = {
  amountIn?: InputMaybe<HavingBigfloatFilter>;
  amountOut?: InputMaybe<HavingBigfloatFilter>;
};

export type SwapsHavingMinInput = {
  amountIn?: InputMaybe<HavingBigfloatFilter>;
  amountOut?: InputMaybe<HavingBigfloatFilter>;
};

export type SwapsHavingStddevPopulationInput = {
  amountIn?: InputMaybe<HavingBigfloatFilter>;
  amountOut?: InputMaybe<HavingBigfloatFilter>;
};

export type SwapsHavingStddevSampleInput = {
  amountIn?: InputMaybe<HavingBigfloatFilter>;
  amountOut?: InputMaybe<HavingBigfloatFilter>;
};

export type SwapsHavingSumInput = {
  amountIn?: InputMaybe<HavingBigfloatFilter>;
  amountOut?: InputMaybe<HavingBigfloatFilter>;
};

export type SwapsHavingVariancePopulationInput = {
  amountIn?: InputMaybe<HavingBigfloatFilter>;
  amountOut?: InputMaybe<HavingBigfloatFilter>;
};

export type SwapsHavingVarianceSampleInput = {
  amountIn?: InputMaybe<HavingBigfloatFilter>;
  amountOut?: InputMaybe<HavingBigfloatFilter>;
};

/** Methods to use when ordering `Swap`. */
export enum SwapsOrderBy {
  AmountInAsc = 'AMOUNT_IN_ASC',
  AmountInDesc = 'AMOUNT_IN_DESC',
  AmountOutAsc = 'AMOUNT_OUT_ASC',
  AmountOutDesc = 'AMOUNT_OUT_DESC',
  FeeUSDAsc = 'FEE_U_S_D_ASC',
  FeeUSDDesc = 'FEE_U_S_D_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SenderIdAsc = 'SENDER_ID_ASC',
  SenderIdDesc = 'SENDER_ID_DESC',
  SwapRoutesAverageAmountInAsc = 'SWAP_ROUTES_AVERAGE_AMOUNT_IN_ASC',
  SwapRoutesAverageAmountInDesc = 'SWAP_ROUTES_AVERAGE_AMOUNT_IN_DESC',
  SwapRoutesAverageAmountOutAsc = 'SWAP_ROUTES_AVERAGE_AMOUNT_OUT_ASC',
  SwapRoutesAverageAmountOutDesc = 'SWAP_ROUTES_AVERAGE_AMOUNT_OUT_DESC',
  SwapRoutesAverageBlockRangeAsc = 'SWAP_ROUTES_AVERAGE_BLOCK_RANGE_ASC',
  SwapRoutesAverageBlockRangeDesc = 'SWAP_ROUTES_AVERAGE_BLOCK_RANGE_DESC',
  SwapRoutesAverageCurrentTickIndexAsc = 'SWAP_ROUTES_AVERAGE_CURRENT_TICK_INDEX_ASC',
  SwapRoutesAverageCurrentTickIndexDesc = 'SWAP_ROUTES_AVERAGE_CURRENT_TICK_INDEX_DESC',
  SwapRoutesAverageEventIndexAsc = 'SWAP_ROUTES_AVERAGE_EVENT_INDEX_ASC',
  SwapRoutesAverageEventIndexDesc = 'SWAP_ROUTES_AVERAGE_EVENT_INDEX_DESC',
  SwapRoutesAverageFeeAmountAsc = 'SWAP_ROUTES_AVERAGE_FEE_AMOUNT_ASC',
  SwapRoutesAverageFeeAmountDesc = 'SWAP_ROUTES_AVERAGE_FEE_AMOUNT_DESC',
  SwapRoutesAverageFeeUSDAsc = 'SWAP_ROUTES_AVERAGE_FEE_U_S_D_ASC',
  SwapRoutesAverageFeeUSDDesc = 'SWAP_ROUTES_AVERAGE_FEE_U_S_D_DESC',
  SwapRoutesAverageIdAsc = 'SWAP_ROUTES_AVERAGE_ID_ASC',
  SwapRoutesAverageIdDesc = 'SWAP_ROUTES_AVERAGE_ID_DESC',
  SwapRoutesAverageLiquidityAsc = 'SWAP_ROUTES_AVERAGE_LIQUIDITY_ASC',
  SwapRoutesAverageLiquidityDesc = 'SWAP_ROUTES_AVERAGE_LIQUIDITY_DESC',
  SwapRoutesAveragePoolIdAsc = 'SWAP_ROUTES_AVERAGE_POOL_ID_ASC',
  SwapRoutesAveragePoolIdDesc = 'SWAP_ROUTES_AVERAGE_POOL_ID_DESC',
  SwapRoutesAverageSqrtPriceAsc = 'SWAP_ROUTES_AVERAGE_SQRT_PRICE_ASC',
  SwapRoutesAverageSqrtPriceDesc = 'SWAP_ROUTES_AVERAGE_SQRT_PRICE_DESC',
  SwapRoutesAverageSwapIdAsc = 'SWAP_ROUTES_AVERAGE_SWAP_ID_ASC',
  SwapRoutesAverageSwapIdDesc = 'SWAP_ROUTES_AVERAGE_SWAP_ID_DESC',
  SwapRoutesAverageVolumeUSDAsc = 'SWAP_ROUTES_AVERAGE_VOLUME_U_S_D_ASC',
  SwapRoutesAverageVolumeUSDDesc = 'SWAP_ROUTES_AVERAGE_VOLUME_U_S_D_DESC',
  SwapRoutesAverageXToYAsc = 'SWAP_ROUTES_AVERAGE_X_TO_Y_ASC',
  SwapRoutesAverageXToYDesc = 'SWAP_ROUTES_AVERAGE_X_TO_Y_DESC',
  SwapRoutesCountAsc = 'SWAP_ROUTES_COUNT_ASC',
  SwapRoutesCountDesc = 'SWAP_ROUTES_COUNT_DESC',
  SwapRoutesDistinctCountAmountInAsc = 'SWAP_ROUTES_DISTINCT_COUNT_AMOUNT_IN_ASC',
  SwapRoutesDistinctCountAmountInDesc = 'SWAP_ROUTES_DISTINCT_COUNT_AMOUNT_IN_DESC',
  SwapRoutesDistinctCountAmountOutAsc = 'SWAP_ROUTES_DISTINCT_COUNT_AMOUNT_OUT_ASC',
  SwapRoutesDistinctCountAmountOutDesc = 'SWAP_ROUTES_DISTINCT_COUNT_AMOUNT_OUT_DESC',
  SwapRoutesDistinctCountBlockRangeAsc = 'SWAP_ROUTES_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  SwapRoutesDistinctCountBlockRangeDesc = 'SWAP_ROUTES_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  SwapRoutesDistinctCountCurrentTickIndexAsc = 'SWAP_ROUTES_DISTINCT_COUNT_CURRENT_TICK_INDEX_ASC',
  SwapRoutesDistinctCountCurrentTickIndexDesc = 'SWAP_ROUTES_DISTINCT_COUNT_CURRENT_TICK_INDEX_DESC',
  SwapRoutesDistinctCountEventIndexAsc = 'SWAP_ROUTES_DISTINCT_COUNT_EVENT_INDEX_ASC',
  SwapRoutesDistinctCountEventIndexDesc = 'SWAP_ROUTES_DISTINCT_COUNT_EVENT_INDEX_DESC',
  SwapRoutesDistinctCountFeeAmountAsc = 'SWAP_ROUTES_DISTINCT_COUNT_FEE_AMOUNT_ASC',
  SwapRoutesDistinctCountFeeAmountDesc = 'SWAP_ROUTES_DISTINCT_COUNT_FEE_AMOUNT_DESC',
  SwapRoutesDistinctCountFeeUSDAsc = 'SWAP_ROUTES_DISTINCT_COUNT_FEE_U_S_D_ASC',
  SwapRoutesDistinctCountFeeUSDDesc = 'SWAP_ROUTES_DISTINCT_COUNT_FEE_U_S_D_DESC',
  SwapRoutesDistinctCountIdAsc = 'SWAP_ROUTES_DISTINCT_COUNT_ID_ASC',
  SwapRoutesDistinctCountIdDesc = 'SWAP_ROUTES_DISTINCT_COUNT_ID_DESC',
  SwapRoutesDistinctCountLiquidityAsc = 'SWAP_ROUTES_DISTINCT_COUNT_LIQUIDITY_ASC',
  SwapRoutesDistinctCountLiquidityDesc = 'SWAP_ROUTES_DISTINCT_COUNT_LIQUIDITY_DESC',
  SwapRoutesDistinctCountPoolIdAsc = 'SWAP_ROUTES_DISTINCT_COUNT_POOL_ID_ASC',
  SwapRoutesDistinctCountPoolIdDesc = 'SWAP_ROUTES_DISTINCT_COUNT_POOL_ID_DESC',
  SwapRoutesDistinctCountSqrtPriceAsc = 'SWAP_ROUTES_DISTINCT_COUNT_SQRT_PRICE_ASC',
  SwapRoutesDistinctCountSqrtPriceDesc = 'SWAP_ROUTES_DISTINCT_COUNT_SQRT_PRICE_DESC',
  SwapRoutesDistinctCountSwapIdAsc = 'SWAP_ROUTES_DISTINCT_COUNT_SWAP_ID_ASC',
  SwapRoutesDistinctCountSwapIdDesc = 'SWAP_ROUTES_DISTINCT_COUNT_SWAP_ID_DESC',
  SwapRoutesDistinctCountVolumeUSDAsc = 'SWAP_ROUTES_DISTINCT_COUNT_VOLUME_U_S_D_ASC',
  SwapRoutesDistinctCountVolumeUSDDesc = 'SWAP_ROUTES_DISTINCT_COUNT_VOLUME_U_S_D_DESC',
  SwapRoutesDistinctCountXToYAsc = 'SWAP_ROUTES_DISTINCT_COUNT_X_TO_Y_ASC',
  SwapRoutesDistinctCountXToYDesc = 'SWAP_ROUTES_DISTINCT_COUNT_X_TO_Y_DESC',
  SwapRoutesMaxAmountInAsc = 'SWAP_ROUTES_MAX_AMOUNT_IN_ASC',
  SwapRoutesMaxAmountInDesc = 'SWAP_ROUTES_MAX_AMOUNT_IN_DESC',
  SwapRoutesMaxAmountOutAsc = 'SWAP_ROUTES_MAX_AMOUNT_OUT_ASC',
  SwapRoutesMaxAmountOutDesc = 'SWAP_ROUTES_MAX_AMOUNT_OUT_DESC',
  SwapRoutesMaxBlockRangeAsc = 'SWAP_ROUTES_MAX_BLOCK_RANGE_ASC',
  SwapRoutesMaxBlockRangeDesc = 'SWAP_ROUTES_MAX_BLOCK_RANGE_DESC',
  SwapRoutesMaxCurrentTickIndexAsc = 'SWAP_ROUTES_MAX_CURRENT_TICK_INDEX_ASC',
  SwapRoutesMaxCurrentTickIndexDesc = 'SWAP_ROUTES_MAX_CURRENT_TICK_INDEX_DESC',
  SwapRoutesMaxEventIndexAsc = 'SWAP_ROUTES_MAX_EVENT_INDEX_ASC',
  SwapRoutesMaxEventIndexDesc = 'SWAP_ROUTES_MAX_EVENT_INDEX_DESC',
  SwapRoutesMaxFeeAmountAsc = 'SWAP_ROUTES_MAX_FEE_AMOUNT_ASC',
  SwapRoutesMaxFeeAmountDesc = 'SWAP_ROUTES_MAX_FEE_AMOUNT_DESC',
  SwapRoutesMaxFeeUSDAsc = 'SWAP_ROUTES_MAX_FEE_U_S_D_ASC',
  SwapRoutesMaxFeeUSDDesc = 'SWAP_ROUTES_MAX_FEE_U_S_D_DESC',
  SwapRoutesMaxIdAsc = 'SWAP_ROUTES_MAX_ID_ASC',
  SwapRoutesMaxIdDesc = 'SWAP_ROUTES_MAX_ID_DESC',
  SwapRoutesMaxLiquidityAsc = 'SWAP_ROUTES_MAX_LIQUIDITY_ASC',
  SwapRoutesMaxLiquidityDesc = 'SWAP_ROUTES_MAX_LIQUIDITY_DESC',
  SwapRoutesMaxPoolIdAsc = 'SWAP_ROUTES_MAX_POOL_ID_ASC',
  SwapRoutesMaxPoolIdDesc = 'SWAP_ROUTES_MAX_POOL_ID_DESC',
  SwapRoutesMaxSqrtPriceAsc = 'SWAP_ROUTES_MAX_SQRT_PRICE_ASC',
  SwapRoutesMaxSqrtPriceDesc = 'SWAP_ROUTES_MAX_SQRT_PRICE_DESC',
  SwapRoutesMaxSwapIdAsc = 'SWAP_ROUTES_MAX_SWAP_ID_ASC',
  SwapRoutesMaxSwapIdDesc = 'SWAP_ROUTES_MAX_SWAP_ID_DESC',
  SwapRoutesMaxVolumeUSDAsc = 'SWAP_ROUTES_MAX_VOLUME_U_S_D_ASC',
  SwapRoutesMaxVolumeUSDDesc = 'SWAP_ROUTES_MAX_VOLUME_U_S_D_DESC',
  SwapRoutesMaxXToYAsc = 'SWAP_ROUTES_MAX_X_TO_Y_ASC',
  SwapRoutesMaxXToYDesc = 'SWAP_ROUTES_MAX_X_TO_Y_DESC',
  SwapRoutesMinAmountInAsc = 'SWAP_ROUTES_MIN_AMOUNT_IN_ASC',
  SwapRoutesMinAmountInDesc = 'SWAP_ROUTES_MIN_AMOUNT_IN_DESC',
  SwapRoutesMinAmountOutAsc = 'SWAP_ROUTES_MIN_AMOUNT_OUT_ASC',
  SwapRoutesMinAmountOutDesc = 'SWAP_ROUTES_MIN_AMOUNT_OUT_DESC',
  SwapRoutesMinBlockRangeAsc = 'SWAP_ROUTES_MIN_BLOCK_RANGE_ASC',
  SwapRoutesMinBlockRangeDesc = 'SWAP_ROUTES_MIN_BLOCK_RANGE_DESC',
  SwapRoutesMinCurrentTickIndexAsc = 'SWAP_ROUTES_MIN_CURRENT_TICK_INDEX_ASC',
  SwapRoutesMinCurrentTickIndexDesc = 'SWAP_ROUTES_MIN_CURRENT_TICK_INDEX_DESC',
  SwapRoutesMinEventIndexAsc = 'SWAP_ROUTES_MIN_EVENT_INDEX_ASC',
  SwapRoutesMinEventIndexDesc = 'SWAP_ROUTES_MIN_EVENT_INDEX_DESC',
  SwapRoutesMinFeeAmountAsc = 'SWAP_ROUTES_MIN_FEE_AMOUNT_ASC',
  SwapRoutesMinFeeAmountDesc = 'SWAP_ROUTES_MIN_FEE_AMOUNT_DESC',
  SwapRoutesMinFeeUSDAsc = 'SWAP_ROUTES_MIN_FEE_U_S_D_ASC',
  SwapRoutesMinFeeUSDDesc = 'SWAP_ROUTES_MIN_FEE_U_S_D_DESC',
  SwapRoutesMinIdAsc = 'SWAP_ROUTES_MIN_ID_ASC',
  SwapRoutesMinIdDesc = 'SWAP_ROUTES_MIN_ID_DESC',
  SwapRoutesMinLiquidityAsc = 'SWAP_ROUTES_MIN_LIQUIDITY_ASC',
  SwapRoutesMinLiquidityDesc = 'SWAP_ROUTES_MIN_LIQUIDITY_DESC',
  SwapRoutesMinPoolIdAsc = 'SWAP_ROUTES_MIN_POOL_ID_ASC',
  SwapRoutesMinPoolIdDesc = 'SWAP_ROUTES_MIN_POOL_ID_DESC',
  SwapRoutesMinSqrtPriceAsc = 'SWAP_ROUTES_MIN_SQRT_PRICE_ASC',
  SwapRoutesMinSqrtPriceDesc = 'SWAP_ROUTES_MIN_SQRT_PRICE_DESC',
  SwapRoutesMinSwapIdAsc = 'SWAP_ROUTES_MIN_SWAP_ID_ASC',
  SwapRoutesMinSwapIdDesc = 'SWAP_ROUTES_MIN_SWAP_ID_DESC',
  SwapRoutesMinVolumeUSDAsc = 'SWAP_ROUTES_MIN_VOLUME_U_S_D_ASC',
  SwapRoutesMinVolumeUSDDesc = 'SWAP_ROUTES_MIN_VOLUME_U_S_D_DESC',
  SwapRoutesMinXToYAsc = 'SWAP_ROUTES_MIN_X_TO_Y_ASC',
  SwapRoutesMinXToYDesc = 'SWAP_ROUTES_MIN_X_TO_Y_DESC',
  SwapRoutesStddevPopulationAmountInAsc = 'SWAP_ROUTES_STDDEV_POPULATION_AMOUNT_IN_ASC',
  SwapRoutesStddevPopulationAmountInDesc = 'SWAP_ROUTES_STDDEV_POPULATION_AMOUNT_IN_DESC',
  SwapRoutesStddevPopulationAmountOutAsc = 'SWAP_ROUTES_STDDEV_POPULATION_AMOUNT_OUT_ASC',
  SwapRoutesStddevPopulationAmountOutDesc = 'SWAP_ROUTES_STDDEV_POPULATION_AMOUNT_OUT_DESC',
  SwapRoutesStddevPopulationBlockRangeAsc = 'SWAP_ROUTES_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  SwapRoutesStddevPopulationBlockRangeDesc = 'SWAP_ROUTES_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  SwapRoutesStddevPopulationCurrentTickIndexAsc = 'SWAP_ROUTES_STDDEV_POPULATION_CURRENT_TICK_INDEX_ASC',
  SwapRoutesStddevPopulationCurrentTickIndexDesc = 'SWAP_ROUTES_STDDEV_POPULATION_CURRENT_TICK_INDEX_DESC',
  SwapRoutesStddevPopulationEventIndexAsc = 'SWAP_ROUTES_STDDEV_POPULATION_EVENT_INDEX_ASC',
  SwapRoutesStddevPopulationEventIndexDesc = 'SWAP_ROUTES_STDDEV_POPULATION_EVENT_INDEX_DESC',
  SwapRoutesStddevPopulationFeeAmountAsc = 'SWAP_ROUTES_STDDEV_POPULATION_FEE_AMOUNT_ASC',
  SwapRoutesStddevPopulationFeeAmountDesc = 'SWAP_ROUTES_STDDEV_POPULATION_FEE_AMOUNT_DESC',
  SwapRoutesStddevPopulationFeeUSDAsc = 'SWAP_ROUTES_STDDEV_POPULATION_FEE_U_S_D_ASC',
  SwapRoutesStddevPopulationFeeUSDDesc = 'SWAP_ROUTES_STDDEV_POPULATION_FEE_U_S_D_DESC',
  SwapRoutesStddevPopulationIdAsc = 'SWAP_ROUTES_STDDEV_POPULATION_ID_ASC',
  SwapRoutesStddevPopulationIdDesc = 'SWAP_ROUTES_STDDEV_POPULATION_ID_DESC',
  SwapRoutesStddevPopulationLiquidityAsc = 'SWAP_ROUTES_STDDEV_POPULATION_LIQUIDITY_ASC',
  SwapRoutesStddevPopulationLiquidityDesc = 'SWAP_ROUTES_STDDEV_POPULATION_LIQUIDITY_DESC',
  SwapRoutesStddevPopulationPoolIdAsc = 'SWAP_ROUTES_STDDEV_POPULATION_POOL_ID_ASC',
  SwapRoutesStddevPopulationPoolIdDesc = 'SWAP_ROUTES_STDDEV_POPULATION_POOL_ID_DESC',
  SwapRoutesStddevPopulationSqrtPriceAsc = 'SWAP_ROUTES_STDDEV_POPULATION_SQRT_PRICE_ASC',
  SwapRoutesStddevPopulationSqrtPriceDesc = 'SWAP_ROUTES_STDDEV_POPULATION_SQRT_PRICE_DESC',
  SwapRoutesStddevPopulationSwapIdAsc = 'SWAP_ROUTES_STDDEV_POPULATION_SWAP_ID_ASC',
  SwapRoutesStddevPopulationSwapIdDesc = 'SWAP_ROUTES_STDDEV_POPULATION_SWAP_ID_DESC',
  SwapRoutesStddevPopulationVolumeUSDAsc = 'SWAP_ROUTES_STDDEV_POPULATION_VOLUME_U_S_D_ASC',
  SwapRoutesStddevPopulationVolumeUSDDesc = 'SWAP_ROUTES_STDDEV_POPULATION_VOLUME_U_S_D_DESC',
  SwapRoutesStddevPopulationXToYAsc = 'SWAP_ROUTES_STDDEV_POPULATION_X_TO_Y_ASC',
  SwapRoutesStddevPopulationXToYDesc = 'SWAP_ROUTES_STDDEV_POPULATION_X_TO_Y_DESC',
  SwapRoutesStddevSampleAmountInAsc = 'SWAP_ROUTES_STDDEV_SAMPLE_AMOUNT_IN_ASC',
  SwapRoutesStddevSampleAmountInDesc = 'SWAP_ROUTES_STDDEV_SAMPLE_AMOUNT_IN_DESC',
  SwapRoutesStddevSampleAmountOutAsc = 'SWAP_ROUTES_STDDEV_SAMPLE_AMOUNT_OUT_ASC',
  SwapRoutesStddevSampleAmountOutDesc = 'SWAP_ROUTES_STDDEV_SAMPLE_AMOUNT_OUT_DESC',
  SwapRoutesStddevSampleBlockRangeAsc = 'SWAP_ROUTES_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  SwapRoutesStddevSampleBlockRangeDesc = 'SWAP_ROUTES_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  SwapRoutesStddevSampleCurrentTickIndexAsc = 'SWAP_ROUTES_STDDEV_SAMPLE_CURRENT_TICK_INDEX_ASC',
  SwapRoutesStddevSampleCurrentTickIndexDesc = 'SWAP_ROUTES_STDDEV_SAMPLE_CURRENT_TICK_INDEX_DESC',
  SwapRoutesStddevSampleEventIndexAsc = 'SWAP_ROUTES_STDDEV_SAMPLE_EVENT_INDEX_ASC',
  SwapRoutesStddevSampleEventIndexDesc = 'SWAP_ROUTES_STDDEV_SAMPLE_EVENT_INDEX_DESC',
  SwapRoutesStddevSampleFeeAmountAsc = 'SWAP_ROUTES_STDDEV_SAMPLE_FEE_AMOUNT_ASC',
  SwapRoutesStddevSampleFeeAmountDesc = 'SWAP_ROUTES_STDDEV_SAMPLE_FEE_AMOUNT_DESC',
  SwapRoutesStddevSampleFeeUSDAsc = 'SWAP_ROUTES_STDDEV_SAMPLE_FEE_U_S_D_ASC',
  SwapRoutesStddevSampleFeeUSDDesc = 'SWAP_ROUTES_STDDEV_SAMPLE_FEE_U_S_D_DESC',
  SwapRoutesStddevSampleIdAsc = 'SWAP_ROUTES_STDDEV_SAMPLE_ID_ASC',
  SwapRoutesStddevSampleIdDesc = 'SWAP_ROUTES_STDDEV_SAMPLE_ID_DESC',
  SwapRoutesStddevSampleLiquidityAsc = 'SWAP_ROUTES_STDDEV_SAMPLE_LIQUIDITY_ASC',
  SwapRoutesStddevSampleLiquidityDesc = 'SWAP_ROUTES_STDDEV_SAMPLE_LIQUIDITY_DESC',
  SwapRoutesStddevSamplePoolIdAsc = 'SWAP_ROUTES_STDDEV_SAMPLE_POOL_ID_ASC',
  SwapRoutesStddevSamplePoolIdDesc = 'SWAP_ROUTES_STDDEV_SAMPLE_POOL_ID_DESC',
  SwapRoutesStddevSampleSqrtPriceAsc = 'SWAP_ROUTES_STDDEV_SAMPLE_SQRT_PRICE_ASC',
  SwapRoutesStddevSampleSqrtPriceDesc = 'SWAP_ROUTES_STDDEV_SAMPLE_SQRT_PRICE_DESC',
  SwapRoutesStddevSampleSwapIdAsc = 'SWAP_ROUTES_STDDEV_SAMPLE_SWAP_ID_ASC',
  SwapRoutesStddevSampleSwapIdDesc = 'SWAP_ROUTES_STDDEV_SAMPLE_SWAP_ID_DESC',
  SwapRoutesStddevSampleVolumeUSDAsc = 'SWAP_ROUTES_STDDEV_SAMPLE_VOLUME_U_S_D_ASC',
  SwapRoutesStddevSampleVolumeUSDDesc = 'SWAP_ROUTES_STDDEV_SAMPLE_VOLUME_U_S_D_DESC',
  SwapRoutesStddevSampleXToYAsc = 'SWAP_ROUTES_STDDEV_SAMPLE_X_TO_Y_ASC',
  SwapRoutesStddevSampleXToYDesc = 'SWAP_ROUTES_STDDEV_SAMPLE_X_TO_Y_DESC',
  SwapRoutesSumAmountInAsc = 'SWAP_ROUTES_SUM_AMOUNT_IN_ASC',
  SwapRoutesSumAmountInDesc = 'SWAP_ROUTES_SUM_AMOUNT_IN_DESC',
  SwapRoutesSumAmountOutAsc = 'SWAP_ROUTES_SUM_AMOUNT_OUT_ASC',
  SwapRoutesSumAmountOutDesc = 'SWAP_ROUTES_SUM_AMOUNT_OUT_DESC',
  SwapRoutesSumBlockRangeAsc = 'SWAP_ROUTES_SUM_BLOCK_RANGE_ASC',
  SwapRoutesSumBlockRangeDesc = 'SWAP_ROUTES_SUM_BLOCK_RANGE_DESC',
  SwapRoutesSumCurrentTickIndexAsc = 'SWAP_ROUTES_SUM_CURRENT_TICK_INDEX_ASC',
  SwapRoutesSumCurrentTickIndexDesc = 'SWAP_ROUTES_SUM_CURRENT_TICK_INDEX_DESC',
  SwapRoutesSumEventIndexAsc = 'SWAP_ROUTES_SUM_EVENT_INDEX_ASC',
  SwapRoutesSumEventIndexDesc = 'SWAP_ROUTES_SUM_EVENT_INDEX_DESC',
  SwapRoutesSumFeeAmountAsc = 'SWAP_ROUTES_SUM_FEE_AMOUNT_ASC',
  SwapRoutesSumFeeAmountDesc = 'SWAP_ROUTES_SUM_FEE_AMOUNT_DESC',
  SwapRoutesSumFeeUSDAsc = 'SWAP_ROUTES_SUM_FEE_U_S_D_ASC',
  SwapRoutesSumFeeUSDDesc = 'SWAP_ROUTES_SUM_FEE_U_S_D_DESC',
  SwapRoutesSumIdAsc = 'SWAP_ROUTES_SUM_ID_ASC',
  SwapRoutesSumIdDesc = 'SWAP_ROUTES_SUM_ID_DESC',
  SwapRoutesSumLiquidityAsc = 'SWAP_ROUTES_SUM_LIQUIDITY_ASC',
  SwapRoutesSumLiquidityDesc = 'SWAP_ROUTES_SUM_LIQUIDITY_DESC',
  SwapRoutesSumPoolIdAsc = 'SWAP_ROUTES_SUM_POOL_ID_ASC',
  SwapRoutesSumPoolIdDesc = 'SWAP_ROUTES_SUM_POOL_ID_DESC',
  SwapRoutesSumSqrtPriceAsc = 'SWAP_ROUTES_SUM_SQRT_PRICE_ASC',
  SwapRoutesSumSqrtPriceDesc = 'SWAP_ROUTES_SUM_SQRT_PRICE_DESC',
  SwapRoutesSumSwapIdAsc = 'SWAP_ROUTES_SUM_SWAP_ID_ASC',
  SwapRoutesSumSwapIdDesc = 'SWAP_ROUTES_SUM_SWAP_ID_DESC',
  SwapRoutesSumVolumeUSDAsc = 'SWAP_ROUTES_SUM_VOLUME_U_S_D_ASC',
  SwapRoutesSumVolumeUSDDesc = 'SWAP_ROUTES_SUM_VOLUME_U_S_D_DESC',
  SwapRoutesSumXToYAsc = 'SWAP_ROUTES_SUM_X_TO_Y_ASC',
  SwapRoutesSumXToYDesc = 'SWAP_ROUTES_SUM_X_TO_Y_DESC',
  SwapRoutesVariancePopulationAmountInAsc = 'SWAP_ROUTES_VARIANCE_POPULATION_AMOUNT_IN_ASC',
  SwapRoutesVariancePopulationAmountInDesc = 'SWAP_ROUTES_VARIANCE_POPULATION_AMOUNT_IN_DESC',
  SwapRoutesVariancePopulationAmountOutAsc = 'SWAP_ROUTES_VARIANCE_POPULATION_AMOUNT_OUT_ASC',
  SwapRoutesVariancePopulationAmountOutDesc = 'SWAP_ROUTES_VARIANCE_POPULATION_AMOUNT_OUT_DESC',
  SwapRoutesVariancePopulationBlockRangeAsc = 'SWAP_ROUTES_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  SwapRoutesVariancePopulationBlockRangeDesc = 'SWAP_ROUTES_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  SwapRoutesVariancePopulationCurrentTickIndexAsc = 'SWAP_ROUTES_VARIANCE_POPULATION_CURRENT_TICK_INDEX_ASC',
  SwapRoutesVariancePopulationCurrentTickIndexDesc = 'SWAP_ROUTES_VARIANCE_POPULATION_CURRENT_TICK_INDEX_DESC',
  SwapRoutesVariancePopulationEventIndexAsc = 'SWAP_ROUTES_VARIANCE_POPULATION_EVENT_INDEX_ASC',
  SwapRoutesVariancePopulationEventIndexDesc = 'SWAP_ROUTES_VARIANCE_POPULATION_EVENT_INDEX_DESC',
  SwapRoutesVariancePopulationFeeAmountAsc = 'SWAP_ROUTES_VARIANCE_POPULATION_FEE_AMOUNT_ASC',
  SwapRoutesVariancePopulationFeeAmountDesc = 'SWAP_ROUTES_VARIANCE_POPULATION_FEE_AMOUNT_DESC',
  SwapRoutesVariancePopulationFeeUSDAsc = 'SWAP_ROUTES_VARIANCE_POPULATION_FEE_U_S_D_ASC',
  SwapRoutesVariancePopulationFeeUSDDesc = 'SWAP_ROUTES_VARIANCE_POPULATION_FEE_U_S_D_DESC',
  SwapRoutesVariancePopulationIdAsc = 'SWAP_ROUTES_VARIANCE_POPULATION_ID_ASC',
  SwapRoutesVariancePopulationIdDesc = 'SWAP_ROUTES_VARIANCE_POPULATION_ID_DESC',
  SwapRoutesVariancePopulationLiquidityAsc = 'SWAP_ROUTES_VARIANCE_POPULATION_LIQUIDITY_ASC',
  SwapRoutesVariancePopulationLiquidityDesc = 'SWAP_ROUTES_VARIANCE_POPULATION_LIQUIDITY_DESC',
  SwapRoutesVariancePopulationPoolIdAsc = 'SWAP_ROUTES_VARIANCE_POPULATION_POOL_ID_ASC',
  SwapRoutesVariancePopulationPoolIdDesc = 'SWAP_ROUTES_VARIANCE_POPULATION_POOL_ID_DESC',
  SwapRoutesVariancePopulationSqrtPriceAsc = 'SWAP_ROUTES_VARIANCE_POPULATION_SQRT_PRICE_ASC',
  SwapRoutesVariancePopulationSqrtPriceDesc = 'SWAP_ROUTES_VARIANCE_POPULATION_SQRT_PRICE_DESC',
  SwapRoutesVariancePopulationSwapIdAsc = 'SWAP_ROUTES_VARIANCE_POPULATION_SWAP_ID_ASC',
  SwapRoutesVariancePopulationSwapIdDesc = 'SWAP_ROUTES_VARIANCE_POPULATION_SWAP_ID_DESC',
  SwapRoutesVariancePopulationVolumeUSDAsc = 'SWAP_ROUTES_VARIANCE_POPULATION_VOLUME_U_S_D_ASC',
  SwapRoutesVariancePopulationVolumeUSDDesc = 'SWAP_ROUTES_VARIANCE_POPULATION_VOLUME_U_S_D_DESC',
  SwapRoutesVariancePopulationXToYAsc = 'SWAP_ROUTES_VARIANCE_POPULATION_X_TO_Y_ASC',
  SwapRoutesVariancePopulationXToYDesc = 'SWAP_ROUTES_VARIANCE_POPULATION_X_TO_Y_DESC',
  SwapRoutesVarianceSampleAmountInAsc = 'SWAP_ROUTES_VARIANCE_SAMPLE_AMOUNT_IN_ASC',
  SwapRoutesVarianceSampleAmountInDesc = 'SWAP_ROUTES_VARIANCE_SAMPLE_AMOUNT_IN_DESC',
  SwapRoutesVarianceSampleAmountOutAsc = 'SWAP_ROUTES_VARIANCE_SAMPLE_AMOUNT_OUT_ASC',
  SwapRoutesVarianceSampleAmountOutDesc = 'SWAP_ROUTES_VARIANCE_SAMPLE_AMOUNT_OUT_DESC',
  SwapRoutesVarianceSampleBlockRangeAsc = 'SWAP_ROUTES_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  SwapRoutesVarianceSampleBlockRangeDesc = 'SWAP_ROUTES_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  SwapRoutesVarianceSampleCurrentTickIndexAsc = 'SWAP_ROUTES_VARIANCE_SAMPLE_CURRENT_TICK_INDEX_ASC',
  SwapRoutesVarianceSampleCurrentTickIndexDesc = 'SWAP_ROUTES_VARIANCE_SAMPLE_CURRENT_TICK_INDEX_DESC',
  SwapRoutesVarianceSampleEventIndexAsc = 'SWAP_ROUTES_VARIANCE_SAMPLE_EVENT_INDEX_ASC',
  SwapRoutesVarianceSampleEventIndexDesc = 'SWAP_ROUTES_VARIANCE_SAMPLE_EVENT_INDEX_DESC',
  SwapRoutesVarianceSampleFeeAmountAsc = 'SWAP_ROUTES_VARIANCE_SAMPLE_FEE_AMOUNT_ASC',
  SwapRoutesVarianceSampleFeeAmountDesc = 'SWAP_ROUTES_VARIANCE_SAMPLE_FEE_AMOUNT_DESC',
  SwapRoutesVarianceSampleFeeUSDAsc = 'SWAP_ROUTES_VARIANCE_SAMPLE_FEE_U_S_D_ASC',
  SwapRoutesVarianceSampleFeeUSDDesc = 'SWAP_ROUTES_VARIANCE_SAMPLE_FEE_U_S_D_DESC',
  SwapRoutesVarianceSampleIdAsc = 'SWAP_ROUTES_VARIANCE_SAMPLE_ID_ASC',
  SwapRoutesVarianceSampleIdDesc = 'SWAP_ROUTES_VARIANCE_SAMPLE_ID_DESC',
  SwapRoutesVarianceSampleLiquidityAsc = 'SWAP_ROUTES_VARIANCE_SAMPLE_LIQUIDITY_ASC',
  SwapRoutesVarianceSampleLiquidityDesc = 'SWAP_ROUTES_VARIANCE_SAMPLE_LIQUIDITY_DESC',
  SwapRoutesVarianceSamplePoolIdAsc = 'SWAP_ROUTES_VARIANCE_SAMPLE_POOL_ID_ASC',
  SwapRoutesVarianceSamplePoolIdDesc = 'SWAP_ROUTES_VARIANCE_SAMPLE_POOL_ID_DESC',
  SwapRoutesVarianceSampleSqrtPriceAsc = 'SWAP_ROUTES_VARIANCE_SAMPLE_SQRT_PRICE_ASC',
  SwapRoutesVarianceSampleSqrtPriceDesc = 'SWAP_ROUTES_VARIANCE_SAMPLE_SQRT_PRICE_DESC',
  SwapRoutesVarianceSampleSwapIdAsc = 'SWAP_ROUTES_VARIANCE_SAMPLE_SWAP_ID_ASC',
  SwapRoutesVarianceSampleSwapIdDesc = 'SWAP_ROUTES_VARIANCE_SAMPLE_SWAP_ID_DESC',
  SwapRoutesVarianceSampleVolumeUSDAsc = 'SWAP_ROUTES_VARIANCE_SAMPLE_VOLUME_U_S_D_ASC',
  SwapRoutesVarianceSampleVolumeUSDDesc = 'SWAP_ROUTES_VARIANCE_SAMPLE_VOLUME_U_S_D_DESC',
  SwapRoutesVarianceSampleXToYAsc = 'SWAP_ROUTES_VARIANCE_SAMPLE_X_TO_Y_ASC',
  SwapRoutesVarianceSampleXToYDesc = 'SWAP_ROUTES_VARIANCE_SAMPLE_X_TO_Y_DESC',
  TokenInIdAsc = 'TOKEN_IN_ID_ASC',
  TokenInIdDesc = 'TOKEN_IN_ID_DESC',
  TokenOutIdAsc = 'TOKEN_OUT_ID_ASC',
  TokenOutIdDesc = 'TOKEN_OUT_ID_DESC',
  TransactionIdAsc = 'TRANSACTION_ID_ASC',
  TransactionIdDesc = 'TRANSACTION_ID_DESC'
}

export type TableEstimate = {
  __typename?: 'TableEstimate';
  estimate?: Maybe<Scalars['Int']['output']>;
  table?: Maybe<Scalars['String']['output']>;
};

export type Token = Node & {
  __typename?: 'Token';
  /** Reads and enables pagination through a set of `Account`. */
  accountsByPoolTokenXIdAndPoolCreatorId: TokenAccountsByPoolTokenXIdAndPoolCreatorIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Account`. */
  accountsByPoolTokenYIdAndPoolCreatorId: TokenAccountsByPoolTokenYIdAndPoolCreatorIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Account`. */
  accountsBySwapTokenInIdAndSenderId: TokenAccountsBySwapTokenInIdAndSenderIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Account`. */
  accountsBySwapTokenOutIdAndSenderId: TokenAccountsBySwapTokenOutIdAndSenderIdManyToManyConnection;
  /** Reads and enables pagination through a set of `ClaimFeeIncentiveToken`. */
  claimFeeIncentiveTokens: ClaimFeeIncentiveTokensConnection;
  /** Reads and enables pagination through a set of `ClaimFee`. */
  claimFeesByClaimFeeIncentiveTokenTokenIdAndClaimFeeId: TokenClaimFeesByClaimFeeIncentiveTokenTokenIdAndClaimFeeIdManyToManyConnection;
  coingeckoId: Scalars['String']['output'];
  decimals: Scalars['Int']['output'];
  denom: Scalars['String']['output'];
  id: Scalars['String']['output'];
  logo: Scalars['String']['output'];
  maxSupply?: Maybe<Scalars['BigFloat']['output']>;
  name: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  /** Reads and enables pagination through a set of `PoolTokenIncentive`. */
  poolTokenIncentives: PoolTokenIncentivesConnection;
  /** Reads and enables pagination through a set of `Pool`. */
  poolsByPoolTokenIncentiveTokenIdAndPoolId: TokenPoolsByPoolTokenIncentiveTokenIdAndPoolIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Pool`. */
  poolsByTokenXId: PoolsConnection;
  /** Reads and enables pagination through a set of `Pool`. */
  poolsByTokenYId: PoolsConnection;
  /** Reads and enables pagination through a set of `Swap`. */
  swapsByTokenInId: SwapsConnection;
  /** Reads and enables pagination through a set of `Swap`. */
  swapsByTokenOutId: SwapsConnection;
  symbol: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `Token`. */
  tokensByPoolTokenXIdAndTokenYId: TokenTokensByPoolTokenXIdAndTokenYIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Token`. */
  tokensByPoolTokenYIdAndTokenXId: TokenTokensByPoolTokenYIdAndTokenXIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Token`. */
  tokensBySwapTokenInIdAndTokenOutId: TokenTokensBySwapTokenInIdAndTokenOutIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Token`. */
  tokensBySwapTokenOutIdAndTokenInId: TokenTokensBySwapTokenOutIdAndTokenInIdManyToManyConnection;
  totalSupply: Scalars['BigFloat']['output'];
  /** Reads and enables pagination through a set of `Transaction`. */
  transactionsByPoolTokenIncentiveTokenIdAndTransactionId: TokenTransactionsByPoolTokenIncentiveTokenIdAndTransactionIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Transaction`. */
  transactionsByPoolTokenXIdAndTransactionId: TokenTransactionsByPoolTokenXIdAndTransactionIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Transaction`. */
  transactionsByPoolTokenYIdAndTransactionId: TokenTransactionsByPoolTokenYIdAndTransactionIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Transaction`. */
  transactionsBySwapTokenInIdAndTransactionId: TokenTransactionsBySwapTokenInIdAndTransactionIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Transaction`. */
  transactionsBySwapTokenOutIdAndTransactionId: TokenTransactionsBySwapTokenOutIdAndTransactionIdManyToManyConnection;
  type: Scalars['String']['output'];
};


export type TokenAccountsByPoolTokenXIdAndPoolCreatorIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Accounts_Distinct_Enum>[]>;
  filter?: InputMaybe<AccountFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountsOrderBy[]>;
};


export type TokenAccountsByPoolTokenYIdAndPoolCreatorIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Accounts_Distinct_Enum>[]>;
  filter?: InputMaybe<AccountFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountsOrderBy[]>;
};


export type TokenAccountsBySwapTokenInIdAndSenderIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Accounts_Distinct_Enum>[]>;
  filter?: InputMaybe<AccountFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountsOrderBy[]>;
};


export type TokenAccountsBySwapTokenOutIdAndSenderIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Accounts_Distinct_Enum>[]>;
  filter?: InputMaybe<AccountFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountsOrderBy[]>;
};


export type TokenClaimFeeIncentiveTokensArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Claim_Fee_Incentive_Tokens_Distinct_Enum>[]>;
  filter?: InputMaybe<ClaimFeeIncentiveTokenFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimFeeIncentiveTokensOrderBy[]>;
};


export type TokenClaimFeesByClaimFeeIncentiveTokenTokenIdAndClaimFeeIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Claim_Fees_Distinct_Enum>[]>;
  filter?: InputMaybe<ClaimFeeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimFeesOrderBy[]>;
};


export type TokenPoolTokenIncentivesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pool_Token_Incentives_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolTokenIncentiveFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolTokenIncentivesOrderBy[]>;
};


export type TokenPoolsByPoolTokenIncentiveTokenIdAndPoolIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};


export type TokenPoolsByTokenXIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};


export type TokenPoolsByTokenYIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};


export type TokenSwapsByTokenInIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Swaps_Distinct_Enum>[]>;
  filter?: InputMaybe<SwapFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapsOrderBy[]>;
};


export type TokenSwapsByTokenOutIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Swaps_Distinct_Enum>[]>;
  filter?: InputMaybe<SwapFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapsOrderBy[]>;
};


export type TokenTokensByPoolTokenXIdAndTokenYIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Tokens_Distinct_Enum>[]>;
  filter?: InputMaybe<TokenFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokensOrderBy[]>;
};


export type TokenTokensByPoolTokenYIdAndTokenXIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Tokens_Distinct_Enum>[]>;
  filter?: InputMaybe<TokenFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokensOrderBy[]>;
};


export type TokenTokensBySwapTokenInIdAndTokenOutIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Tokens_Distinct_Enum>[]>;
  filter?: InputMaybe<TokenFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokensOrderBy[]>;
};


export type TokenTokensBySwapTokenOutIdAndTokenInIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Tokens_Distinct_Enum>[]>;
  filter?: InputMaybe<TokenFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokensOrderBy[]>;
};


export type TokenTransactionsByPoolTokenIncentiveTokenIdAndTransactionIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Transactions_Distinct_Enum>[]>;
  filter?: InputMaybe<TransactionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TransactionsOrderBy[]>;
};


export type TokenTransactionsByPoolTokenXIdAndTransactionIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Transactions_Distinct_Enum>[]>;
  filter?: InputMaybe<TransactionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TransactionsOrderBy[]>;
};


export type TokenTransactionsByPoolTokenYIdAndTransactionIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Transactions_Distinct_Enum>[]>;
  filter?: InputMaybe<TransactionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TransactionsOrderBy[]>;
};


export type TokenTransactionsBySwapTokenInIdAndTransactionIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Transactions_Distinct_Enum>[]>;
  filter?: InputMaybe<TransactionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TransactionsOrderBy[]>;
};


export type TokenTransactionsBySwapTokenOutIdAndTransactionIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Transactions_Distinct_Enum>[]>;
  filter?: InputMaybe<TransactionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TransactionsOrderBy[]>;
};

/** A connection to a list of `Account` values, with data from `Pool`. */
export type TokenAccountsByPoolTokenXIdAndPoolCreatorIdManyToManyConnection = {
  __typename?: 'TokenAccountsByPoolTokenXIdAndPoolCreatorIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<AccountAggregates>;
  /** A list of edges which contains the `Account`, info from the `Pool`, and the cursor to aid in pagination. */
  edges: TokenAccountsByPoolTokenXIdAndPoolCreatorIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<AccountAggregates[]>;
  /** A list of `Account` objects. */
  nodes: Maybe<Account>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Account` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Account` values, with data from `Pool`. */
export type TokenAccountsByPoolTokenXIdAndPoolCreatorIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: AccountsGroupBy[];
  having?: InputMaybe<AccountsHavingInput>;
};

/** A `Account` edge in the connection, with data from `Pool`. */
export type TokenAccountsByPoolTokenXIdAndPoolCreatorIdManyToManyEdge = {
  __typename?: 'TokenAccountsByPoolTokenXIdAndPoolCreatorIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Account` at the end of the edge. */
  node?: Maybe<Account>;
  /** Reads and enables pagination through a set of `Pool`. */
  poolCreations: PoolsConnection;
};


/** A `Account` edge in the connection, with data from `Pool`. */
export type TokenAccountsByPoolTokenXIdAndPoolCreatorIdManyToManyEdgePoolCreationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};

/** A connection to a list of `Account` values, with data from `Pool`. */
export type TokenAccountsByPoolTokenYIdAndPoolCreatorIdManyToManyConnection = {
  __typename?: 'TokenAccountsByPoolTokenYIdAndPoolCreatorIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<AccountAggregates>;
  /** A list of edges which contains the `Account`, info from the `Pool`, and the cursor to aid in pagination. */
  edges: TokenAccountsByPoolTokenYIdAndPoolCreatorIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<AccountAggregates[]>;
  /** A list of `Account` objects. */
  nodes: Maybe<Account>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Account` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Account` values, with data from `Pool`. */
export type TokenAccountsByPoolTokenYIdAndPoolCreatorIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: AccountsGroupBy[];
  having?: InputMaybe<AccountsHavingInput>;
};

/** A `Account` edge in the connection, with data from `Pool`. */
export type TokenAccountsByPoolTokenYIdAndPoolCreatorIdManyToManyEdge = {
  __typename?: 'TokenAccountsByPoolTokenYIdAndPoolCreatorIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Account` at the end of the edge. */
  node?: Maybe<Account>;
  /** Reads and enables pagination through a set of `Pool`. */
  poolCreations: PoolsConnection;
};


/** A `Account` edge in the connection, with data from `Pool`. */
export type TokenAccountsByPoolTokenYIdAndPoolCreatorIdManyToManyEdgePoolCreationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};

/** A connection to a list of `Account` values, with data from `Swap`. */
export type TokenAccountsBySwapTokenInIdAndSenderIdManyToManyConnection = {
  __typename?: 'TokenAccountsBySwapTokenInIdAndSenderIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<AccountAggregates>;
  /** A list of edges which contains the `Account`, info from the `Swap`, and the cursor to aid in pagination. */
  edges: TokenAccountsBySwapTokenInIdAndSenderIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<AccountAggregates[]>;
  /** A list of `Account` objects. */
  nodes: Maybe<Account>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Account` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Account` values, with data from `Swap`. */
export type TokenAccountsBySwapTokenInIdAndSenderIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: AccountsGroupBy[];
  having?: InputMaybe<AccountsHavingInput>;
};

/** A `Account` edge in the connection, with data from `Swap`. */
export type TokenAccountsBySwapTokenInIdAndSenderIdManyToManyEdge = {
  __typename?: 'TokenAccountsBySwapTokenInIdAndSenderIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Account` at the end of the edge. */
  node?: Maybe<Account>;
  /** Reads and enables pagination through a set of `Swap`. */
  swap: SwapsConnection;
};


/** A `Account` edge in the connection, with data from `Swap`. */
export type TokenAccountsBySwapTokenInIdAndSenderIdManyToManyEdgeSwapArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Swaps_Distinct_Enum>[]>;
  filter?: InputMaybe<SwapFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapsOrderBy[]>;
};

/** A connection to a list of `Account` values, with data from `Swap`. */
export type TokenAccountsBySwapTokenOutIdAndSenderIdManyToManyConnection = {
  __typename?: 'TokenAccountsBySwapTokenOutIdAndSenderIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<AccountAggregates>;
  /** A list of edges which contains the `Account`, info from the `Swap`, and the cursor to aid in pagination. */
  edges: TokenAccountsBySwapTokenOutIdAndSenderIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<AccountAggregates[]>;
  /** A list of `Account` objects. */
  nodes: Maybe<Account>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Account` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Account` values, with data from `Swap`. */
export type TokenAccountsBySwapTokenOutIdAndSenderIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: AccountsGroupBy[];
  having?: InputMaybe<AccountsHavingInput>;
};

/** A `Account` edge in the connection, with data from `Swap`. */
export type TokenAccountsBySwapTokenOutIdAndSenderIdManyToManyEdge = {
  __typename?: 'TokenAccountsBySwapTokenOutIdAndSenderIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Account` at the end of the edge. */
  node?: Maybe<Account>;
  /** Reads and enables pagination through a set of `Swap`. */
  swap: SwapsConnection;
};


/** A `Account` edge in the connection, with data from `Swap`. */
export type TokenAccountsBySwapTokenOutIdAndSenderIdManyToManyEdgeSwapArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Swaps_Distinct_Enum>[]>;
  filter?: InputMaybe<SwapFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapsOrderBy[]>;
};

export type TokenAggregates = {
  __typename?: 'TokenAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<TokenAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<TokenDistinctCountAggregates>;
  keys?: Maybe<Scalars['String']['output'][]>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<TokenMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<TokenMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<TokenStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<TokenStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<TokenSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<TokenVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<TokenVarianceSampleAggregates>;
};

export type TokenAverageAggregates = {
  __typename?: 'TokenAverageAggregates';
  /** Mean average of decimals across the matching connection */
  decimals?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of maxSupply across the matching connection */
  maxSupply?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of totalSupply across the matching connection */
  totalSupply?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `ClaimFee` values, with data from `ClaimFeeIncentiveToken`. */
export type TokenClaimFeesByClaimFeeIncentiveTokenTokenIdAndClaimFeeIdManyToManyConnection = {
  __typename?: 'TokenClaimFeesByClaimFeeIncentiveTokenTokenIdAndClaimFeeIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<ClaimFeeAggregates>;
  /** A list of edges which contains the `ClaimFee`, info from the `ClaimFeeIncentiveToken`, and the cursor to aid in pagination. */
  edges: TokenClaimFeesByClaimFeeIncentiveTokenTokenIdAndClaimFeeIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<ClaimFeeAggregates[]>;
  /** A list of `ClaimFee` objects. */
  nodes: Maybe<ClaimFee>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ClaimFee` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `ClaimFee` values, with data from `ClaimFeeIncentiveToken`. */
export type TokenClaimFeesByClaimFeeIncentiveTokenTokenIdAndClaimFeeIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: ClaimFeesGroupBy[];
  having?: InputMaybe<ClaimFeesHavingInput>;
};

/** A `ClaimFee` edge in the connection, with data from `ClaimFeeIncentiveToken`. */
export type TokenClaimFeesByClaimFeeIncentiveTokenTokenIdAndClaimFeeIdManyToManyEdge = {
  __typename?: 'TokenClaimFeesByClaimFeeIncentiveTokenTokenIdAndClaimFeeIdManyToManyEdge';
  /** Reads and enables pagination through a set of `ClaimFeeIncentiveToken`. */
  claimFeeIncentiveTokens: ClaimFeeIncentiveTokensConnection;
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `ClaimFee` at the end of the edge. */
  node?: Maybe<ClaimFee>;
};


/** A `ClaimFee` edge in the connection, with data from `ClaimFeeIncentiveToken`. */
export type TokenClaimFeesByClaimFeeIncentiveTokenTokenIdAndClaimFeeIdManyToManyEdgeClaimFeeIncentiveTokensArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Claim_Fee_Incentive_Tokens_Distinct_Enum>[]>;
  filter?: InputMaybe<ClaimFeeIncentiveTokenFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimFeeIncentiveTokensOrderBy[]>;
};

export type TokenDistinctCountAggregates = {
  __typename?: 'TokenDistinctCountAggregates';
  /** Distinct count of _blockRange across the matching connection */
  _blockRange?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of _id across the matching connection */
  _id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of coingeckoId across the matching connection */
  coingeckoId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of decimals across the matching connection */
  decimals?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of denom across the matching connection */
  denom?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of logo across the matching connection */
  logo?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of maxSupply across the matching connection */
  maxSupply?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of name across the matching connection */
  name?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of symbol across the matching connection */
  symbol?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of totalSupply across the matching connection */
  totalSupply?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of type across the matching connection */
  type?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `Token` object types. All fields are combined with a logical ‘and.’ */
export type TokenFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<TokenFilter[]>;
  /** Filter by the object’s `claimFeeIncentiveTokens` relation. */
  claimFeeIncentiveTokens?: InputMaybe<TokenToManyClaimFeeIncentiveTokenFilter>;
  /** Some related `claimFeeIncentiveTokens` exist. */
  claimFeeIncentiveTokensExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `coingeckoId` field. */
  coingeckoId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `decimals` field. */
  decimals?: InputMaybe<IntFilter>;
  /** Filter by the object’s `denom` field. */
  denom?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Filter by the object’s `logo` field. */
  logo?: InputMaybe<StringFilter>;
  /** Filter by the object’s `maxSupply` field. */
  maxSupply?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TokenFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<TokenFilter[]>;
  /** Filter by the object’s `poolTokenIncentives` relation. */
  poolTokenIncentives?: InputMaybe<TokenToManyPoolTokenIncentiveFilter>;
  /** Some related `poolTokenIncentives` exist. */
  poolTokenIncentivesExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `poolsByTokenXId` relation. */
  poolsByTokenXId?: InputMaybe<TokenToManyPoolFilter>;
  /** Some related `poolsByTokenXId` exist. */
  poolsByTokenXIdExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `poolsByTokenYId` relation. */
  poolsByTokenYId?: InputMaybe<TokenToManyPoolFilter>;
  /** Some related `poolsByTokenYId` exist. */
  poolsByTokenYIdExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `swapsByTokenInId` relation. */
  swapsByTokenInId?: InputMaybe<TokenToManySwapFilter>;
  /** Some related `swapsByTokenInId` exist. */
  swapsByTokenInIdExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `swapsByTokenOutId` relation. */
  swapsByTokenOutId?: InputMaybe<TokenToManySwapFilter>;
  /** Some related `swapsByTokenOutId` exist. */
  swapsByTokenOutIdExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `symbol` field. */
  symbol?: InputMaybe<StringFilter>;
  /** Filter by the object’s `totalSupply` field. */
  totalSupply?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<StringFilter>;
};

export type TokenMaxAggregates = {
  __typename?: 'TokenMaxAggregates';
  /** Maximum of decimals across the matching connection */
  decimals?: Maybe<Scalars['Int']['output']>;
  /** Maximum of maxSupply across the matching connection */
  maxSupply?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of totalSupply across the matching connection */
  totalSupply?: Maybe<Scalars['BigFloat']['output']>;
};

export type TokenMinAggregates = {
  __typename?: 'TokenMinAggregates';
  /** Minimum of decimals across the matching connection */
  decimals?: Maybe<Scalars['Int']['output']>;
  /** Minimum of maxSupply across the matching connection */
  maxSupply?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of totalSupply across the matching connection */
  totalSupply?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `Pool` values, with data from `PoolTokenIncentive`. */
export type TokenPoolsByPoolTokenIncentiveTokenIdAndPoolIdManyToManyConnection = {
  __typename?: 'TokenPoolsByPoolTokenIncentiveTokenIdAndPoolIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<PoolAggregates>;
  /** A list of edges which contains the `Pool`, info from the `PoolTokenIncentive`, and the cursor to aid in pagination. */
  edges: TokenPoolsByPoolTokenIncentiveTokenIdAndPoolIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<PoolAggregates[]>;
  /** A list of `Pool` objects. */
  nodes: Maybe<Pool>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Pool` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Pool` values, with data from `PoolTokenIncentive`. */
export type TokenPoolsByPoolTokenIncentiveTokenIdAndPoolIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: PoolsGroupBy[];
  having?: InputMaybe<PoolsHavingInput>;
};

/** A `Pool` edge in the connection, with data from `PoolTokenIncentive`. */
export type TokenPoolsByPoolTokenIncentiveTokenIdAndPoolIdManyToManyEdge = {
  __typename?: 'TokenPoolsByPoolTokenIncentiveTokenIdAndPoolIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Pool` at the end of the edge. */
  node?: Maybe<Pool>;
  /** Reads and enables pagination through a set of `PoolTokenIncentive`. */
  poolTokenIncentives: PoolTokenIncentivesConnection;
};


/** A `Pool` edge in the connection, with data from `PoolTokenIncentive`. */
export type TokenPoolsByPoolTokenIncentiveTokenIdAndPoolIdManyToManyEdgePoolTokenIncentivesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pool_Token_Incentives_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolTokenIncentiveFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolTokenIncentivesOrderBy[]>;
};

export type TokenStddevPopulationAggregates = {
  __typename?: 'TokenStddevPopulationAggregates';
  /** Population standard deviation of decimals across the matching connection */
  decimals?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of maxSupply across the matching connection */
  maxSupply?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of totalSupply across the matching connection */
  totalSupply?: Maybe<Scalars['BigFloat']['output']>;
};

export type TokenStddevSampleAggregates = {
  __typename?: 'TokenStddevSampleAggregates';
  /** Sample standard deviation of decimals across the matching connection */
  decimals?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of maxSupply across the matching connection */
  maxSupply?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of totalSupply across the matching connection */
  totalSupply?: Maybe<Scalars['BigFloat']['output']>;
};

export type TokenSumAggregates = {
  __typename?: 'TokenSumAggregates';
  /** Sum of decimals across the matching connection */
  decimals: Scalars['BigInt']['output'];
  /** Sum of maxSupply across the matching connection */
  maxSupply: Scalars['BigFloat']['output'];
  /** Sum of totalSupply across the matching connection */
  totalSupply: Scalars['BigFloat']['output'];
};

/** A filter to be used against many `ClaimFeeIncentiveToken` object types. All fields are combined with a logical ‘and.’ */
export type TokenToManyClaimFeeIncentiveTokenFilter = {
  /** Aggregates across related `ClaimFeeIncentiveToken` match the filter criteria. */
  aggregates?: InputMaybe<ClaimFeeIncentiveTokenAggregatesFilter>;
  /** Every related `ClaimFeeIncentiveToken` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ClaimFeeIncentiveTokenFilter>;
  /** No related `ClaimFeeIncentiveToken` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ClaimFeeIncentiveTokenFilter>;
  /** Some related `ClaimFeeIncentiveToken` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ClaimFeeIncentiveTokenFilter>;
};

/** A filter to be used against many `Pool` object types. All fields are combined with a logical ‘and.’ */
export type TokenToManyPoolFilter = {
  /** Aggregates across related `Pool` match the filter criteria. */
  aggregates?: InputMaybe<PoolAggregatesFilter>;
  /** Every related `Pool` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<PoolFilter>;
  /** No related `Pool` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<PoolFilter>;
  /** Some related `Pool` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<PoolFilter>;
};

/** A filter to be used against many `PoolTokenIncentive` object types. All fields are combined with a logical ‘and.’ */
export type TokenToManyPoolTokenIncentiveFilter = {
  /** Aggregates across related `PoolTokenIncentive` match the filter criteria. */
  aggregates?: InputMaybe<PoolTokenIncentiveAggregatesFilter>;
  /** Every related `PoolTokenIncentive` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<PoolTokenIncentiveFilter>;
  /** No related `PoolTokenIncentive` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<PoolTokenIncentiveFilter>;
  /** Some related `PoolTokenIncentive` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<PoolTokenIncentiveFilter>;
};

/** A filter to be used against many `Swap` object types. All fields are combined with a logical ‘and.’ */
export type TokenToManySwapFilter = {
  /** Aggregates across related `Swap` match the filter criteria. */
  aggregates?: InputMaybe<SwapAggregatesFilter>;
  /** Every related `Swap` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SwapFilter>;
  /** No related `Swap` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SwapFilter>;
  /** Some related `Swap` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SwapFilter>;
};

/** A connection to a list of `Token` values, with data from `Pool`. */
export type TokenTokensByPoolTokenXIdAndTokenYIdManyToManyConnection = {
  __typename?: 'TokenTokensByPoolTokenXIdAndTokenYIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TokenAggregates>;
  /** A list of edges which contains the `Token`, info from the `Pool`, and the cursor to aid in pagination. */
  edges: TokenTokensByPoolTokenXIdAndTokenYIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TokenAggregates[]>;
  /** A list of `Token` objects. */
  nodes: Maybe<Token>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Token` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Token` values, with data from `Pool`. */
export type TokenTokensByPoolTokenXIdAndTokenYIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TokensGroupBy[];
  having?: InputMaybe<TokensHavingInput>;
};

/** A `Token` edge in the connection, with data from `Pool`. */
export type TokenTokensByPoolTokenXIdAndTokenYIdManyToManyEdge = {
  __typename?: 'TokenTokensByPoolTokenXIdAndTokenYIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Token` at the end of the edge. */
  node?: Maybe<Token>;
  /** Reads and enables pagination through a set of `Pool`. */
  poolsByTokenYId: PoolsConnection;
};


/** A `Token` edge in the connection, with data from `Pool`. */
export type TokenTokensByPoolTokenXIdAndTokenYIdManyToManyEdgePoolsByTokenYIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};

/** A connection to a list of `Token` values, with data from `Pool`. */
export type TokenTokensByPoolTokenYIdAndTokenXIdManyToManyConnection = {
  __typename?: 'TokenTokensByPoolTokenYIdAndTokenXIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TokenAggregates>;
  /** A list of edges which contains the `Token`, info from the `Pool`, and the cursor to aid in pagination. */
  edges: TokenTokensByPoolTokenYIdAndTokenXIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TokenAggregates[]>;
  /** A list of `Token` objects. */
  nodes: Maybe<Token>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Token` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Token` values, with data from `Pool`. */
export type TokenTokensByPoolTokenYIdAndTokenXIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TokensGroupBy[];
  having?: InputMaybe<TokensHavingInput>;
};

/** A `Token` edge in the connection, with data from `Pool`. */
export type TokenTokensByPoolTokenYIdAndTokenXIdManyToManyEdge = {
  __typename?: 'TokenTokensByPoolTokenYIdAndTokenXIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Token` at the end of the edge. */
  node?: Maybe<Token>;
  /** Reads and enables pagination through a set of `Pool`. */
  poolsByTokenXId: PoolsConnection;
};


/** A `Token` edge in the connection, with data from `Pool`. */
export type TokenTokensByPoolTokenYIdAndTokenXIdManyToManyEdgePoolsByTokenXIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};

/** A connection to a list of `Token` values, with data from `Swap`. */
export type TokenTokensBySwapTokenInIdAndTokenOutIdManyToManyConnection = {
  __typename?: 'TokenTokensBySwapTokenInIdAndTokenOutIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TokenAggregates>;
  /** A list of edges which contains the `Token`, info from the `Swap`, and the cursor to aid in pagination. */
  edges: TokenTokensBySwapTokenInIdAndTokenOutIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TokenAggregates[]>;
  /** A list of `Token` objects. */
  nodes: Maybe<Token>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Token` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Token` values, with data from `Swap`. */
export type TokenTokensBySwapTokenInIdAndTokenOutIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TokensGroupBy[];
  having?: InputMaybe<TokensHavingInput>;
};

/** A `Token` edge in the connection, with data from `Swap`. */
export type TokenTokensBySwapTokenInIdAndTokenOutIdManyToManyEdge = {
  __typename?: 'TokenTokensBySwapTokenInIdAndTokenOutIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Token` at the end of the edge. */
  node?: Maybe<Token>;
  /** Reads and enables pagination through a set of `Swap`. */
  swapsByTokenOutId: SwapsConnection;
};


/** A `Token` edge in the connection, with data from `Swap`. */
export type TokenTokensBySwapTokenInIdAndTokenOutIdManyToManyEdgeSwapsByTokenOutIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Swaps_Distinct_Enum>[]>;
  filter?: InputMaybe<SwapFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapsOrderBy[]>;
};

/** A connection to a list of `Token` values, with data from `Swap`. */
export type TokenTokensBySwapTokenOutIdAndTokenInIdManyToManyConnection = {
  __typename?: 'TokenTokensBySwapTokenOutIdAndTokenInIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TokenAggregates>;
  /** A list of edges which contains the `Token`, info from the `Swap`, and the cursor to aid in pagination. */
  edges: TokenTokensBySwapTokenOutIdAndTokenInIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TokenAggregates[]>;
  /** A list of `Token` objects. */
  nodes: Maybe<Token>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Token` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Token` values, with data from `Swap`. */
export type TokenTokensBySwapTokenOutIdAndTokenInIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TokensGroupBy[];
  having?: InputMaybe<TokensHavingInput>;
};

/** A `Token` edge in the connection, with data from `Swap`. */
export type TokenTokensBySwapTokenOutIdAndTokenInIdManyToManyEdge = {
  __typename?: 'TokenTokensBySwapTokenOutIdAndTokenInIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Token` at the end of the edge. */
  node?: Maybe<Token>;
  /** Reads and enables pagination through a set of `Swap`. */
  swapsByTokenInId: SwapsConnection;
};


/** A `Token` edge in the connection, with data from `Swap`. */
export type TokenTokensBySwapTokenOutIdAndTokenInIdManyToManyEdgeSwapsByTokenInIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Swaps_Distinct_Enum>[]>;
  filter?: InputMaybe<SwapFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapsOrderBy[]>;
};

/** A connection to a list of `Transaction` values, with data from `PoolTokenIncentive`. */
export type TokenTransactionsByPoolTokenIncentiveTokenIdAndTransactionIdManyToManyConnection = {
  __typename?: 'TokenTransactionsByPoolTokenIncentiveTokenIdAndTransactionIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TransactionAggregates>;
  /** A list of edges which contains the `Transaction`, info from the `PoolTokenIncentive`, and the cursor to aid in pagination. */
  edges: TokenTransactionsByPoolTokenIncentiveTokenIdAndTransactionIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TransactionAggregates[]>;
  /** A list of `Transaction` objects. */
  nodes: Maybe<Transaction>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Transaction` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Transaction` values, with data from `PoolTokenIncentive`. */
export type TokenTransactionsByPoolTokenIncentiveTokenIdAndTransactionIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TransactionsGroupBy[];
  having?: InputMaybe<TransactionsHavingInput>;
};

/** A `Transaction` edge in the connection, with data from `PoolTokenIncentive`. */
export type TokenTransactionsByPoolTokenIncentiveTokenIdAndTransactionIdManyToManyEdge = {
  __typename?: 'TokenTransactionsByPoolTokenIncentiveTokenIdAndTransactionIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Transaction` at the end of the edge. */
  node?: Maybe<Transaction>;
  /** Reads and enables pagination through a set of `PoolTokenIncentive`. */
  poolTokenIncentives: PoolTokenIncentivesConnection;
};


/** A `Transaction` edge in the connection, with data from `PoolTokenIncentive`. */
export type TokenTransactionsByPoolTokenIncentiveTokenIdAndTransactionIdManyToManyEdgePoolTokenIncentivesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pool_Token_Incentives_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolTokenIncentiveFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolTokenIncentivesOrderBy[]>;
};

/** A connection to a list of `Transaction` values, with data from `Pool`. */
export type TokenTransactionsByPoolTokenXIdAndTransactionIdManyToManyConnection = {
  __typename?: 'TokenTransactionsByPoolTokenXIdAndTransactionIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TransactionAggregates>;
  /** A list of edges which contains the `Transaction`, info from the `Pool`, and the cursor to aid in pagination. */
  edges: TokenTransactionsByPoolTokenXIdAndTransactionIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TransactionAggregates[]>;
  /** A list of `Transaction` objects. */
  nodes: Maybe<Transaction>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Transaction` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Transaction` values, with data from `Pool`. */
export type TokenTransactionsByPoolTokenXIdAndTransactionIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TransactionsGroupBy[];
  having?: InputMaybe<TransactionsHavingInput>;
};

/** A `Transaction` edge in the connection, with data from `Pool`. */
export type TokenTransactionsByPoolTokenXIdAndTransactionIdManyToManyEdge = {
  __typename?: 'TokenTransactionsByPoolTokenXIdAndTransactionIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Transaction` at the end of the edge. */
  node?: Maybe<Transaction>;
  /** Reads and enables pagination through a set of `Pool`. */
  poolCreations: PoolsConnection;
};


/** A `Transaction` edge in the connection, with data from `Pool`. */
export type TokenTransactionsByPoolTokenXIdAndTransactionIdManyToManyEdgePoolCreationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};

/** A connection to a list of `Transaction` values, with data from `Pool`. */
export type TokenTransactionsByPoolTokenYIdAndTransactionIdManyToManyConnection = {
  __typename?: 'TokenTransactionsByPoolTokenYIdAndTransactionIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TransactionAggregates>;
  /** A list of edges which contains the `Transaction`, info from the `Pool`, and the cursor to aid in pagination. */
  edges: TokenTransactionsByPoolTokenYIdAndTransactionIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TransactionAggregates[]>;
  /** A list of `Transaction` objects. */
  nodes: Maybe<Transaction>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Transaction` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Transaction` values, with data from `Pool`. */
export type TokenTransactionsByPoolTokenYIdAndTransactionIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TransactionsGroupBy[];
  having?: InputMaybe<TransactionsHavingInput>;
};

/** A `Transaction` edge in the connection, with data from `Pool`. */
export type TokenTransactionsByPoolTokenYIdAndTransactionIdManyToManyEdge = {
  __typename?: 'TokenTransactionsByPoolTokenYIdAndTransactionIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Transaction` at the end of the edge. */
  node?: Maybe<Transaction>;
  /** Reads and enables pagination through a set of `Pool`. */
  poolCreations: PoolsConnection;
};


/** A `Transaction` edge in the connection, with data from `Pool`. */
export type TokenTransactionsByPoolTokenYIdAndTransactionIdManyToManyEdgePoolCreationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};

/** A connection to a list of `Transaction` values, with data from `Swap`. */
export type TokenTransactionsBySwapTokenInIdAndTransactionIdManyToManyConnection = {
  __typename?: 'TokenTransactionsBySwapTokenInIdAndTransactionIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TransactionAggregates>;
  /** A list of edges which contains the `Transaction`, info from the `Swap`, and the cursor to aid in pagination. */
  edges: TokenTransactionsBySwapTokenInIdAndTransactionIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TransactionAggregates[]>;
  /** A list of `Transaction` objects. */
  nodes: Maybe<Transaction>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Transaction` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Transaction` values, with data from `Swap`. */
export type TokenTransactionsBySwapTokenInIdAndTransactionIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TransactionsGroupBy[];
  having?: InputMaybe<TransactionsHavingInput>;
};

/** A `Transaction` edge in the connection, with data from `Swap`. */
export type TokenTransactionsBySwapTokenInIdAndTransactionIdManyToManyEdge = {
  __typename?: 'TokenTransactionsBySwapTokenInIdAndTransactionIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Transaction` at the end of the edge. */
  node?: Maybe<Transaction>;
  /** Reads and enables pagination through a set of `Swap`. */
  swap: SwapsConnection;
};


/** A `Transaction` edge in the connection, with data from `Swap`. */
export type TokenTransactionsBySwapTokenInIdAndTransactionIdManyToManyEdgeSwapArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Swaps_Distinct_Enum>[]>;
  filter?: InputMaybe<SwapFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapsOrderBy[]>;
};

/** A connection to a list of `Transaction` values, with data from `Swap`. */
export type TokenTransactionsBySwapTokenOutIdAndTransactionIdManyToManyConnection = {
  __typename?: 'TokenTransactionsBySwapTokenOutIdAndTransactionIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TransactionAggregates>;
  /** A list of edges which contains the `Transaction`, info from the `Swap`, and the cursor to aid in pagination. */
  edges: TokenTransactionsBySwapTokenOutIdAndTransactionIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TransactionAggregates[]>;
  /** A list of `Transaction` objects. */
  nodes: Maybe<Transaction>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Transaction` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Transaction` values, with data from `Swap`. */
export type TokenTransactionsBySwapTokenOutIdAndTransactionIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TransactionsGroupBy[];
  having?: InputMaybe<TransactionsHavingInput>;
};

/** A `Transaction` edge in the connection, with data from `Swap`. */
export type TokenTransactionsBySwapTokenOutIdAndTransactionIdManyToManyEdge = {
  __typename?: 'TokenTransactionsBySwapTokenOutIdAndTransactionIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Transaction` at the end of the edge. */
  node?: Maybe<Transaction>;
  /** Reads and enables pagination through a set of `Swap`. */
  swap: SwapsConnection;
};


/** A `Transaction` edge in the connection, with data from `Swap`. */
export type TokenTransactionsBySwapTokenOutIdAndTransactionIdManyToManyEdgeSwapArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Swaps_Distinct_Enum>[]>;
  filter?: InputMaybe<SwapFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapsOrderBy[]>;
};

export type TokenVariancePopulationAggregates = {
  __typename?: 'TokenVariancePopulationAggregates';
  /** Population variance of decimals across the matching connection */
  decimals?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of maxSupply across the matching connection */
  maxSupply?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of totalSupply across the matching connection */
  totalSupply?: Maybe<Scalars['BigFloat']['output']>;
};

export type TokenVarianceSampleAggregates = {
  __typename?: 'TokenVarianceSampleAggregates';
  /** Sample variance of decimals across the matching connection */
  decimals?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of maxSupply across the matching connection */
  maxSupply?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of totalSupply across the matching connection */
  totalSupply?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `Token` values. */
export type TokensConnection = {
  __typename?: 'TokensConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TokenAggregates>;
  /** A list of edges which contains the `Token` and cursor to aid in pagination. */
  edges: TokensEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TokenAggregates[]>;
  /** A list of `Token` objects. */
  nodes: Maybe<Token>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Token` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Token` values. */
export type TokensConnectionGroupedAggregatesArgs = {
  groupBy: TokensGroupBy[];
  having?: InputMaybe<TokensHavingInput>;
};

/** A `Token` edge in the connection. */
export type TokensEdge = {
  __typename?: 'TokensEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Token` at the end of the edge. */
  node?: Maybe<Token>;
};

/** Grouping methods for `Token` for usage during aggregation. */
export enum TokensGroupBy {
  CoingeckoId = 'COINGECKO_ID',
  Decimals = 'DECIMALS',
  Denom = 'DENOM',
  Id = 'ID',
  Logo = 'LOGO',
  MaxSupply = 'MAX_SUPPLY',
  Name = 'NAME',
  Symbol = 'SYMBOL',
  TotalSupply = 'TOTAL_SUPPLY',
  Type = 'TYPE'
}

export type TokensHavingAverageInput = {
  decimals?: InputMaybe<HavingIntFilter>;
  maxSupply?: InputMaybe<HavingBigfloatFilter>;
  totalSupply?: InputMaybe<HavingBigfloatFilter>;
};

export type TokensHavingDistinctCountInput = {
  decimals?: InputMaybe<HavingIntFilter>;
  maxSupply?: InputMaybe<HavingBigfloatFilter>;
  totalSupply?: InputMaybe<HavingBigfloatFilter>;
};

/** Conditions for `Token` aggregates. */
export type TokensHavingInput = {
  AND?: InputMaybe<TokensHavingInput[]>;
  OR?: InputMaybe<TokensHavingInput[]>;
  average?: InputMaybe<TokensHavingAverageInput>;
  distinctCount?: InputMaybe<TokensHavingDistinctCountInput>;
  max?: InputMaybe<TokensHavingMaxInput>;
  min?: InputMaybe<TokensHavingMinInput>;
  stddevPopulation?: InputMaybe<TokensHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<TokensHavingStddevSampleInput>;
  sum?: InputMaybe<TokensHavingSumInput>;
  variancePopulation?: InputMaybe<TokensHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<TokensHavingVarianceSampleInput>;
};

export type TokensHavingMaxInput = {
  decimals?: InputMaybe<HavingIntFilter>;
  maxSupply?: InputMaybe<HavingBigfloatFilter>;
  totalSupply?: InputMaybe<HavingBigfloatFilter>;
};

export type TokensHavingMinInput = {
  decimals?: InputMaybe<HavingIntFilter>;
  maxSupply?: InputMaybe<HavingBigfloatFilter>;
  totalSupply?: InputMaybe<HavingBigfloatFilter>;
};

export type TokensHavingStddevPopulationInput = {
  decimals?: InputMaybe<HavingIntFilter>;
  maxSupply?: InputMaybe<HavingBigfloatFilter>;
  totalSupply?: InputMaybe<HavingBigfloatFilter>;
};

export type TokensHavingStddevSampleInput = {
  decimals?: InputMaybe<HavingIntFilter>;
  maxSupply?: InputMaybe<HavingBigfloatFilter>;
  totalSupply?: InputMaybe<HavingBigfloatFilter>;
};

export type TokensHavingSumInput = {
  decimals?: InputMaybe<HavingIntFilter>;
  maxSupply?: InputMaybe<HavingBigfloatFilter>;
  totalSupply?: InputMaybe<HavingBigfloatFilter>;
};

export type TokensHavingVariancePopulationInput = {
  decimals?: InputMaybe<HavingIntFilter>;
  maxSupply?: InputMaybe<HavingBigfloatFilter>;
  totalSupply?: InputMaybe<HavingBigfloatFilter>;
};

export type TokensHavingVarianceSampleInput = {
  decimals?: InputMaybe<HavingIntFilter>;
  maxSupply?: InputMaybe<HavingBigfloatFilter>;
  totalSupply?: InputMaybe<HavingBigfloatFilter>;
};

/** Methods to use when ordering `Token`. */
export enum TokensOrderBy {
  ClaimFeeIncentiveTokensAverageBlockRangeAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_BLOCK_RANGE_ASC',
  ClaimFeeIncentiveTokensAverageBlockRangeDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_BLOCK_RANGE_DESC',
  ClaimFeeIncentiveTokensAverageClaimFeeIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_CLAIM_FEE_ID_ASC',
  ClaimFeeIncentiveTokensAverageClaimFeeIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_CLAIM_FEE_ID_DESC',
  ClaimFeeIncentiveTokensAverageIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_ID_ASC',
  ClaimFeeIncentiveTokensAverageIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_ID_DESC',
  ClaimFeeIncentiveTokensAverageIndexAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_INDEX_ASC',
  ClaimFeeIncentiveTokensAverageIndexDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_INDEX_DESC',
  ClaimFeeIncentiveTokensAverageRewardAmountAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_REWARD_AMOUNT_ASC',
  ClaimFeeIncentiveTokensAverageRewardAmountDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_REWARD_AMOUNT_DESC',
  ClaimFeeIncentiveTokensAverageTokenIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_TOKEN_ID_ASC',
  ClaimFeeIncentiveTokensAverageTokenIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_AVERAGE_TOKEN_ID_DESC',
  ClaimFeeIncentiveTokensCountAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_COUNT_ASC',
  ClaimFeeIncentiveTokensCountDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_COUNT_DESC',
  ClaimFeeIncentiveTokensDistinctCountBlockRangeAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  ClaimFeeIncentiveTokensDistinctCountBlockRangeDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  ClaimFeeIncentiveTokensDistinctCountClaimFeeIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_CLAIM_FEE_ID_ASC',
  ClaimFeeIncentiveTokensDistinctCountClaimFeeIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_CLAIM_FEE_ID_DESC',
  ClaimFeeIncentiveTokensDistinctCountIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_ID_ASC',
  ClaimFeeIncentiveTokensDistinctCountIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_ID_DESC',
  ClaimFeeIncentiveTokensDistinctCountIndexAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_INDEX_ASC',
  ClaimFeeIncentiveTokensDistinctCountIndexDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_INDEX_DESC',
  ClaimFeeIncentiveTokensDistinctCountRewardAmountAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_REWARD_AMOUNT_ASC',
  ClaimFeeIncentiveTokensDistinctCountRewardAmountDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_REWARD_AMOUNT_DESC',
  ClaimFeeIncentiveTokensDistinctCountTokenIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_TOKEN_ID_ASC',
  ClaimFeeIncentiveTokensDistinctCountTokenIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_DISTINCT_COUNT_TOKEN_ID_DESC',
  ClaimFeeIncentiveTokensMaxBlockRangeAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_BLOCK_RANGE_ASC',
  ClaimFeeIncentiveTokensMaxBlockRangeDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_BLOCK_RANGE_DESC',
  ClaimFeeIncentiveTokensMaxClaimFeeIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_CLAIM_FEE_ID_ASC',
  ClaimFeeIncentiveTokensMaxClaimFeeIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_CLAIM_FEE_ID_DESC',
  ClaimFeeIncentiveTokensMaxIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_ID_ASC',
  ClaimFeeIncentiveTokensMaxIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_ID_DESC',
  ClaimFeeIncentiveTokensMaxIndexAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_INDEX_ASC',
  ClaimFeeIncentiveTokensMaxIndexDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_INDEX_DESC',
  ClaimFeeIncentiveTokensMaxRewardAmountAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_REWARD_AMOUNT_ASC',
  ClaimFeeIncentiveTokensMaxRewardAmountDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_REWARD_AMOUNT_DESC',
  ClaimFeeIncentiveTokensMaxTokenIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_TOKEN_ID_ASC',
  ClaimFeeIncentiveTokensMaxTokenIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MAX_TOKEN_ID_DESC',
  ClaimFeeIncentiveTokensMinBlockRangeAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_BLOCK_RANGE_ASC',
  ClaimFeeIncentiveTokensMinBlockRangeDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_BLOCK_RANGE_DESC',
  ClaimFeeIncentiveTokensMinClaimFeeIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_CLAIM_FEE_ID_ASC',
  ClaimFeeIncentiveTokensMinClaimFeeIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_CLAIM_FEE_ID_DESC',
  ClaimFeeIncentiveTokensMinIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_ID_ASC',
  ClaimFeeIncentiveTokensMinIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_ID_DESC',
  ClaimFeeIncentiveTokensMinIndexAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_INDEX_ASC',
  ClaimFeeIncentiveTokensMinIndexDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_INDEX_DESC',
  ClaimFeeIncentiveTokensMinRewardAmountAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_REWARD_AMOUNT_ASC',
  ClaimFeeIncentiveTokensMinRewardAmountDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_REWARD_AMOUNT_DESC',
  ClaimFeeIncentiveTokensMinTokenIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_TOKEN_ID_ASC',
  ClaimFeeIncentiveTokensMinTokenIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_MIN_TOKEN_ID_DESC',
  ClaimFeeIncentiveTokensStddevPopulationBlockRangeAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  ClaimFeeIncentiveTokensStddevPopulationBlockRangeDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  ClaimFeeIncentiveTokensStddevPopulationClaimFeeIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_CLAIM_FEE_ID_ASC',
  ClaimFeeIncentiveTokensStddevPopulationClaimFeeIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_CLAIM_FEE_ID_DESC',
  ClaimFeeIncentiveTokensStddevPopulationIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_ID_ASC',
  ClaimFeeIncentiveTokensStddevPopulationIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_ID_DESC',
  ClaimFeeIncentiveTokensStddevPopulationIndexAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_INDEX_ASC',
  ClaimFeeIncentiveTokensStddevPopulationIndexDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_INDEX_DESC',
  ClaimFeeIncentiveTokensStddevPopulationRewardAmountAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_REWARD_AMOUNT_ASC',
  ClaimFeeIncentiveTokensStddevPopulationRewardAmountDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_REWARD_AMOUNT_DESC',
  ClaimFeeIncentiveTokensStddevPopulationTokenIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_TOKEN_ID_ASC',
  ClaimFeeIncentiveTokensStddevPopulationTokenIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_POPULATION_TOKEN_ID_DESC',
  ClaimFeeIncentiveTokensStddevSampleBlockRangeAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  ClaimFeeIncentiveTokensStddevSampleBlockRangeDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  ClaimFeeIncentiveTokensStddevSampleClaimFeeIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_CLAIM_FEE_ID_ASC',
  ClaimFeeIncentiveTokensStddevSampleClaimFeeIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_CLAIM_FEE_ID_DESC',
  ClaimFeeIncentiveTokensStddevSampleIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_ID_ASC',
  ClaimFeeIncentiveTokensStddevSampleIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_ID_DESC',
  ClaimFeeIncentiveTokensStddevSampleIndexAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_INDEX_ASC',
  ClaimFeeIncentiveTokensStddevSampleIndexDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_INDEX_DESC',
  ClaimFeeIncentiveTokensStddevSampleRewardAmountAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_REWARD_AMOUNT_ASC',
  ClaimFeeIncentiveTokensStddevSampleRewardAmountDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_REWARD_AMOUNT_DESC',
  ClaimFeeIncentiveTokensStddevSampleTokenIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_TOKEN_ID_ASC',
  ClaimFeeIncentiveTokensStddevSampleTokenIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_STDDEV_SAMPLE_TOKEN_ID_DESC',
  ClaimFeeIncentiveTokensSumBlockRangeAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_BLOCK_RANGE_ASC',
  ClaimFeeIncentiveTokensSumBlockRangeDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_BLOCK_RANGE_DESC',
  ClaimFeeIncentiveTokensSumClaimFeeIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_CLAIM_FEE_ID_ASC',
  ClaimFeeIncentiveTokensSumClaimFeeIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_CLAIM_FEE_ID_DESC',
  ClaimFeeIncentiveTokensSumIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_ID_ASC',
  ClaimFeeIncentiveTokensSumIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_ID_DESC',
  ClaimFeeIncentiveTokensSumIndexAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_INDEX_ASC',
  ClaimFeeIncentiveTokensSumIndexDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_INDEX_DESC',
  ClaimFeeIncentiveTokensSumRewardAmountAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_REWARD_AMOUNT_ASC',
  ClaimFeeIncentiveTokensSumRewardAmountDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_REWARD_AMOUNT_DESC',
  ClaimFeeIncentiveTokensSumTokenIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_TOKEN_ID_ASC',
  ClaimFeeIncentiveTokensSumTokenIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_SUM_TOKEN_ID_DESC',
  ClaimFeeIncentiveTokensVariancePopulationBlockRangeAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  ClaimFeeIncentiveTokensVariancePopulationBlockRangeDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  ClaimFeeIncentiveTokensVariancePopulationClaimFeeIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_CLAIM_FEE_ID_ASC',
  ClaimFeeIncentiveTokensVariancePopulationClaimFeeIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_CLAIM_FEE_ID_DESC',
  ClaimFeeIncentiveTokensVariancePopulationIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_ID_ASC',
  ClaimFeeIncentiveTokensVariancePopulationIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_ID_DESC',
  ClaimFeeIncentiveTokensVariancePopulationIndexAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_INDEX_ASC',
  ClaimFeeIncentiveTokensVariancePopulationIndexDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_INDEX_DESC',
  ClaimFeeIncentiveTokensVariancePopulationRewardAmountAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_REWARD_AMOUNT_ASC',
  ClaimFeeIncentiveTokensVariancePopulationRewardAmountDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_REWARD_AMOUNT_DESC',
  ClaimFeeIncentiveTokensVariancePopulationTokenIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_TOKEN_ID_ASC',
  ClaimFeeIncentiveTokensVariancePopulationTokenIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_POPULATION_TOKEN_ID_DESC',
  ClaimFeeIncentiveTokensVarianceSampleBlockRangeAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  ClaimFeeIncentiveTokensVarianceSampleBlockRangeDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  ClaimFeeIncentiveTokensVarianceSampleClaimFeeIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_CLAIM_FEE_ID_ASC',
  ClaimFeeIncentiveTokensVarianceSampleClaimFeeIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_CLAIM_FEE_ID_DESC',
  ClaimFeeIncentiveTokensVarianceSampleIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_ID_ASC',
  ClaimFeeIncentiveTokensVarianceSampleIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_ID_DESC',
  ClaimFeeIncentiveTokensVarianceSampleIndexAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_INDEX_ASC',
  ClaimFeeIncentiveTokensVarianceSampleIndexDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_INDEX_DESC',
  ClaimFeeIncentiveTokensVarianceSampleRewardAmountAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_REWARD_AMOUNT_ASC',
  ClaimFeeIncentiveTokensVarianceSampleRewardAmountDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_REWARD_AMOUNT_DESC',
  ClaimFeeIncentiveTokensVarianceSampleTokenIdAsc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_TOKEN_ID_ASC',
  ClaimFeeIncentiveTokensVarianceSampleTokenIdDesc = 'CLAIM_FEE_INCENTIVE_TOKENS_VARIANCE_SAMPLE_TOKEN_ID_DESC',
  CoingeckoIdAsc = 'COINGECKO_ID_ASC',
  CoingeckoIdDesc = 'COINGECKO_ID_DESC',
  DecimalsAsc = 'DECIMALS_ASC',
  DecimalsDesc = 'DECIMALS_DESC',
  DenomAsc = 'DENOM_ASC',
  DenomDesc = 'DENOM_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  LogoAsc = 'LOGO_ASC',
  LogoDesc = 'LOGO_DESC',
  MaxSupplyAsc = 'MAX_SUPPLY_ASC',
  MaxSupplyDesc = 'MAX_SUPPLY_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PoolsByTokenXidAverageBlockRangeAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_BLOCK_RANGE_ASC',
  PoolsByTokenXidAverageBlockRangeDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_BLOCK_RANGE_DESC',
  PoolsByTokenXidAverageCollectedFeesTokenXAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_COLLECTED_FEES_TOKEN_X_ASC',
  PoolsByTokenXidAverageCollectedFeesTokenXDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_COLLECTED_FEES_TOKEN_X_DESC',
  PoolsByTokenXidAverageCollectedFeesTokenYAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolsByTokenXidAverageCollectedFeesTokenYDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolsByTokenXidAverageCollectedFeesUSDAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_COLLECTED_FEES_U_S_D_ASC',
  PoolsByTokenXidAverageCollectedFeesUSDDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_COLLECTED_FEES_U_S_D_DESC',
  PoolsByTokenXidAverageCreatedAtAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_CREATED_AT_ASC',
  PoolsByTokenXidAverageCreatedAtBlockNumberAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolsByTokenXidAverageCreatedAtBlockNumberDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolsByTokenXidAverageCreatedAtDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_CREATED_AT_DESC',
  PoolsByTokenXidAverageCurrentTickAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_CURRENT_TICK_ASC',
  PoolsByTokenXidAverageCurrentTickDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_CURRENT_TICK_DESC',
  PoolsByTokenXidAverageFeesUSDAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_FEES_U_S_D_ASC',
  PoolsByTokenXidAverageFeesUSDDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_FEES_U_S_D_DESC',
  PoolsByTokenXidAverageFeeAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_FEE_ASC',
  PoolsByTokenXidAverageFeeDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_FEE_DESC',
  PoolsByTokenXidAverageIdAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_ID_ASC',
  PoolsByTokenXidAverageIdDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_ID_DESC',
  PoolsByTokenXidAverageLiquidityAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_LIQUIDITY_ASC',
  PoolsByTokenXidAverageLiquidityDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_LIQUIDITY_DESC',
  PoolsByTokenXidAveragePoolCreatorIdAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_POOL_CREATOR_ID_ASC',
  PoolsByTokenXidAveragePoolCreatorIdDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_POOL_CREATOR_ID_DESC',
  PoolsByTokenXidAverageSqrtPriceAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_SQRT_PRICE_ASC',
  PoolsByTokenXidAverageSqrtPriceDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_SQRT_PRICE_DESC',
  PoolsByTokenXidAverageTickSpacingAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_TICK_SPACING_ASC',
  PoolsByTokenXidAverageTickSpacingDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_TICK_SPACING_DESC',
  PoolsByTokenXidAverageTokenXIdAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_TOKEN_X_ID_ASC',
  PoolsByTokenXidAverageTokenXIdDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_TOKEN_X_ID_DESC',
  PoolsByTokenXidAverageTokenYIdAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_TOKEN_Y_ID_ASC',
  PoolsByTokenXidAverageTokenYIdDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_TOKEN_Y_ID_DESC',
  PoolsByTokenXidAverageTotalValueLockedTokenXAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolsByTokenXidAverageTotalValueLockedTokenXDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolsByTokenXidAverageTotalValueLockedTokenYAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolsByTokenXidAverageTotalValueLockedTokenYDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolsByTokenXidAverageTotalValueLockedUSDAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolsByTokenXidAverageTotalValueLockedUSDDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolsByTokenXidAverageTransactionIdAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_TRANSACTION_ID_ASC',
  PoolsByTokenXidAverageTransactionIdDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_TRANSACTION_ID_DESC',
  PoolsByTokenXidAverageTxCountAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_TX_COUNT_ASC',
  PoolsByTokenXidAverageTxCountDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_TX_COUNT_DESC',
  PoolsByTokenXidAverageUpdatedAtAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_UPDATED_AT_ASC',
  PoolsByTokenXidAverageUpdatedAtDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_UPDATED_AT_DESC',
  PoolsByTokenXidAverageVolumeTokenXAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_VOLUME_TOKEN_X_ASC',
  PoolsByTokenXidAverageVolumeTokenXDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_VOLUME_TOKEN_X_DESC',
  PoolsByTokenXidAverageVolumeTokenYAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_VOLUME_TOKEN_Y_ASC',
  PoolsByTokenXidAverageVolumeTokenYDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_VOLUME_TOKEN_Y_DESC',
  PoolsByTokenXidAverageVolumeUSDAsc = 'POOLS_BY_TOKEN_XID_AVERAGE_VOLUME_U_S_D_ASC',
  PoolsByTokenXidAverageVolumeUSDDesc = 'POOLS_BY_TOKEN_XID_AVERAGE_VOLUME_U_S_D_DESC',
  PoolsByTokenXidCountAsc = 'POOLS_BY_TOKEN_XID_COUNT_ASC',
  PoolsByTokenXidCountDesc = 'POOLS_BY_TOKEN_XID_COUNT_DESC',
  PoolsByTokenXidDistinctCountBlockRangeAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  PoolsByTokenXidDistinctCountBlockRangeDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  PoolsByTokenXidDistinctCountCollectedFeesTokenXAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_COLLECTED_FEES_TOKEN_X_ASC',
  PoolsByTokenXidDistinctCountCollectedFeesTokenXDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_COLLECTED_FEES_TOKEN_X_DESC',
  PoolsByTokenXidDistinctCountCollectedFeesTokenYAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolsByTokenXidDistinctCountCollectedFeesTokenYDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolsByTokenXidDistinctCountCollectedFeesUSDAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_COLLECTED_FEES_U_S_D_ASC',
  PoolsByTokenXidDistinctCountCollectedFeesUSDDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_COLLECTED_FEES_U_S_D_DESC',
  PoolsByTokenXidDistinctCountCreatedAtAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_CREATED_AT_ASC',
  PoolsByTokenXidDistinctCountCreatedAtBlockNumberAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolsByTokenXidDistinctCountCreatedAtBlockNumberDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolsByTokenXidDistinctCountCreatedAtDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_CREATED_AT_DESC',
  PoolsByTokenXidDistinctCountCurrentTickAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_CURRENT_TICK_ASC',
  PoolsByTokenXidDistinctCountCurrentTickDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_CURRENT_TICK_DESC',
  PoolsByTokenXidDistinctCountFeesUSDAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_FEES_U_S_D_ASC',
  PoolsByTokenXidDistinctCountFeesUSDDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_FEES_U_S_D_DESC',
  PoolsByTokenXidDistinctCountFeeAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_FEE_ASC',
  PoolsByTokenXidDistinctCountFeeDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_FEE_DESC',
  PoolsByTokenXidDistinctCountIdAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_ID_ASC',
  PoolsByTokenXidDistinctCountIdDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_ID_DESC',
  PoolsByTokenXidDistinctCountLiquidityAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_LIQUIDITY_ASC',
  PoolsByTokenXidDistinctCountLiquidityDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_LIQUIDITY_DESC',
  PoolsByTokenXidDistinctCountPoolCreatorIdAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_POOL_CREATOR_ID_ASC',
  PoolsByTokenXidDistinctCountPoolCreatorIdDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_POOL_CREATOR_ID_DESC',
  PoolsByTokenXidDistinctCountSqrtPriceAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_SQRT_PRICE_ASC',
  PoolsByTokenXidDistinctCountSqrtPriceDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_SQRT_PRICE_DESC',
  PoolsByTokenXidDistinctCountTickSpacingAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_TICK_SPACING_ASC',
  PoolsByTokenXidDistinctCountTickSpacingDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_TICK_SPACING_DESC',
  PoolsByTokenXidDistinctCountTokenXIdAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_TOKEN_X_ID_ASC',
  PoolsByTokenXidDistinctCountTokenXIdDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_TOKEN_X_ID_DESC',
  PoolsByTokenXidDistinctCountTokenYIdAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_TOKEN_Y_ID_ASC',
  PoolsByTokenXidDistinctCountTokenYIdDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_TOKEN_Y_ID_DESC',
  PoolsByTokenXidDistinctCountTotalValueLockedTokenXAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolsByTokenXidDistinctCountTotalValueLockedTokenXDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolsByTokenXidDistinctCountTotalValueLockedTokenYAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolsByTokenXidDistinctCountTotalValueLockedTokenYDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolsByTokenXidDistinctCountTotalValueLockedUSDAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolsByTokenXidDistinctCountTotalValueLockedUSDDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolsByTokenXidDistinctCountTransactionIdAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_TRANSACTION_ID_ASC',
  PoolsByTokenXidDistinctCountTransactionIdDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_TRANSACTION_ID_DESC',
  PoolsByTokenXidDistinctCountTxCountAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_TX_COUNT_ASC',
  PoolsByTokenXidDistinctCountTxCountDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_TX_COUNT_DESC',
  PoolsByTokenXidDistinctCountUpdatedAtAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_UPDATED_AT_ASC',
  PoolsByTokenXidDistinctCountUpdatedAtDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_UPDATED_AT_DESC',
  PoolsByTokenXidDistinctCountVolumeTokenXAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_VOLUME_TOKEN_X_ASC',
  PoolsByTokenXidDistinctCountVolumeTokenXDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_VOLUME_TOKEN_X_DESC',
  PoolsByTokenXidDistinctCountVolumeTokenYAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_VOLUME_TOKEN_Y_ASC',
  PoolsByTokenXidDistinctCountVolumeTokenYDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_VOLUME_TOKEN_Y_DESC',
  PoolsByTokenXidDistinctCountVolumeUSDAsc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_VOLUME_U_S_D_ASC',
  PoolsByTokenXidDistinctCountVolumeUSDDesc = 'POOLS_BY_TOKEN_XID_DISTINCT_COUNT_VOLUME_U_S_D_DESC',
  PoolsByTokenXidMaxBlockRangeAsc = 'POOLS_BY_TOKEN_XID_MAX_BLOCK_RANGE_ASC',
  PoolsByTokenXidMaxBlockRangeDesc = 'POOLS_BY_TOKEN_XID_MAX_BLOCK_RANGE_DESC',
  PoolsByTokenXidMaxCollectedFeesTokenXAsc = 'POOLS_BY_TOKEN_XID_MAX_COLLECTED_FEES_TOKEN_X_ASC',
  PoolsByTokenXidMaxCollectedFeesTokenXDesc = 'POOLS_BY_TOKEN_XID_MAX_COLLECTED_FEES_TOKEN_X_DESC',
  PoolsByTokenXidMaxCollectedFeesTokenYAsc = 'POOLS_BY_TOKEN_XID_MAX_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolsByTokenXidMaxCollectedFeesTokenYDesc = 'POOLS_BY_TOKEN_XID_MAX_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolsByTokenXidMaxCollectedFeesUSDAsc = 'POOLS_BY_TOKEN_XID_MAX_COLLECTED_FEES_U_S_D_ASC',
  PoolsByTokenXidMaxCollectedFeesUSDDesc = 'POOLS_BY_TOKEN_XID_MAX_COLLECTED_FEES_U_S_D_DESC',
  PoolsByTokenXidMaxCreatedAtAsc = 'POOLS_BY_TOKEN_XID_MAX_CREATED_AT_ASC',
  PoolsByTokenXidMaxCreatedAtBlockNumberAsc = 'POOLS_BY_TOKEN_XID_MAX_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolsByTokenXidMaxCreatedAtBlockNumberDesc = 'POOLS_BY_TOKEN_XID_MAX_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolsByTokenXidMaxCreatedAtDesc = 'POOLS_BY_TOKEN_XID_MAX_CREATED_AT_DESC',
  PoolsByTokenXidMaxCurrentTickAsc = 'POOLS_BY_TOKEN_XID_MAX_CURRENT_TICK_ASC',
  PoolsByTokenXidMaxCurrentTickDesc = 'POOLS_BY_TOKEN_XID_MAX_CURRENT_TICK_DESC',
  PoolsByTokenXidMaxFeesUSDAsc = 'POOLS_BY_TOKEN_XID_MAX_FEES_U_S_D_ASC',
  PoolsByTokenXidMaxFeesUSDDesc = 'POOLS_BY_TOKEN_XID_MAX_FEES_U_S_D_DESC',
  PoolsByTokenXidMaxFeeAsc = 'POOLS_BY_TOKEN_XID_MAX_FEE_ASC',
  PoolsByTokenXidMaxFeeDesc = 'POOLS_BY_TOKEN_XID_MAX_FEE_DESC',
  PoolsByTokenXidMaxIdAsc = 'POOLS_BY_TOKEN_XID_MAX_ID_ASC',
  PoolsByTokenXidMaxIdDesc = 'POOLS_BY_TOKEN_XID_MAX_ID_DESC',
  PoolsByTokenXidMaxLiquidityAsc = 'POOLS_BY_TOKEN_XID_MAX_LIQUIDITY_ASC',
  PoolsByTokenXidMaxLiquidityDesc = 'POOLS_BY_TOKEN_XID_MAX_LIQUIDITY_DESC',
  PoolsByTokenXidMaxPoolCreatorIdAsc = 'POOLS_BY_TOKEN_XID_MAX_POOL_CREATOR_ID_ASC',
  PoolsByTokenXidMaxPoolCreatorIdDesc = 'POOLS_BY_TOKEN_XID_MAX_POOL_CREATOR_ID_DESC',
  PoolsByTokenXidMaxSqrtPriceAsc = 'POOLS_BY_TOKEN_XID_MAX_SQRT_PRICE_ASC',
  PoolsByTokenXidMaxSqrtPriceDesc = 'POOLS_BY_TOKEN_XID_MAX_SQRT_PRICE_DESC',
  PoolsByTokenXidMaxTickSpacingAsc = 'POOLS_BY_TOKEN_XID_MAX_TICK_SPACING_ASC',
  PoolsByTokenXidMaxTickSpacingDesc = 'POOLS_BY_TOKEN_XID_MAX_TICK_SPACING_DESC',
  PoolsByTokenXidMaxTokenXIdAsc = 'POOLS_BY_TOKEN_XID_MAX_TOKEN_X_ID_ASC',
  PoolsByTokenXidMaxTokenXIdDesc = 'POOLS_BY_TOKEN_XID_MAX_TOKEN_X_ID_DESC',
  PoolsByTokenXidMaxTokenYIdAsc = 'POOLS_BY_TOKEN_XID_MAX_TOKEN_Y_ID_ASC',
  PoolsByTokenXidMaxTokenYIdDesc = 'POOLS_BY_TOKEN_XID_MAX_TOKEN_Y_ID_DESC',
  PoolsByTokenXidMaxTotalValueLockedTokenXAsc = 'POOLS_BY_TOKEN_XID_MAX_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolsByTokenXidMaxTotalValueLockedTokenXDesc = 'POOLS_BY_TOKEN_XID_MAX_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolsByTokenXidMaxTotalValueLockedTokenYAsc = 'POOLS_BY_TOKEN_XID_MAX_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolsByTokenXidMaxTotalValueLockedTokenYDesc = 'POOLS_BY_TOKEN_XID_MAX_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolsByTokenXidMaxTotalValueLockedUSDAsc = 'POOLS_BY_TOKEN_XID_MAX_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolsByTokenXidMaxTotalValueLockedUSDDesc = 'POOLS_BY_TOKEN_XID_MAX_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolsByTokenXidMaxTransactionIdAsc = 'POOLS_BY_TOKEN_XID_MAX_TRANSACTION_ID_ASC',
  PoolsByTokenXidMaxTransactionIdDesc = 'POOLS_BY_TOKEN_XID_MAX_TRANSACTION_ID_DESC',
  PoolsByTokenXidMaxTxCountAsc = 'POOLS_BY_TOKEN_XID_MAX_TX_COUNT_ASC',
  PoolsByTokenXidMaxTxCountDesc = 'POOLS_BY_TOKEN_XID_MAX_TX_COUNT_DESC',
  PoolsByTokenXidMaxUpdatedAtAsc = 'POOLS_BY_TOKEN_XID_MAX_UPDATED_AT_ASC',
  PoolsByTokenXidMaxUpdatedAtDesc = 'POOLS_BY_TOKEN_XID_MAX_UPDATED_AT_DESC',
  PoolsByTokenXidMaxVolumeTokenXAsc = 'POOLS_BY_TOKEN_XID_MAX_VOLUME_TOKEN_X_ASC',
  PoolsByTokenXidMaxVolumeTokenXDesc = 'POOLS_BY_TOKEN_XID_MAX_VOLUME_TOKEN_X_DESC',
  PoolsByTokenXidMaxVolumeTokenYAsc = 'POOLS_BY_TOKEN_XID_MAX_VOLUME_TOKEN_Y_ASC',
  PoolsByTokenXidMaxVolumeTokenYDesc = 'POOLS_BY_TOKEN_XID_MAX_VOLUME_TOKEN_Y_DESC',
  PoolsByTokenXidMaxVolumeUSDAsc = 'POOLS_BY_TOKEN_XID_MAX_VOLUME_U_S_D_ASC',
  PoolsByTokenXidMaxVolumeUSDDesc = 'POOLS_BY_TOKEN_XID_MAX_VOLUME_U_S_D_DESC',
  PoolsByTokenXidMinBlockRangeAsc = 'POOLS_BY_TOKEN_XID_MIN_BLOCK_RANGE_ASC',
  PoolsByTokenXidMinBlockRangeDesc = 'POOLS_BY_TOKEN_XID_MIN_BLOCK_RANGE_DESC',
  PoolsByTokenXidMinCollectedFeesTokenXAsc = 'POOLS_BY_TOKEN_XID_MIN_COLLECTED_FEES_TOKEN_X_ASC',
  PoolsByTokenXidMinCollectedFeesTokenXDesc = 'POOLS_BY_TOKEN_XID_MIN_COLLECTED_FEES_TOKEN_X_DESC',
  PoolsByTokenXidMinCollectedFeesTokenYAsc = 'POOLS_BY_TOKEN_XID_MIN_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolsByTokenXidMinCollectedFeesTokenYDesc = 'POOLS_BY_TOKEN_XID_MIN_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolsByTokenXidMinCollectedFeesUSDAsc = 'POOLS_BY_TOKEN_XID_MIN_COLLECTED_FEES_U_S_D_ASC',
  PoolsByTokenXidMinCollectedFeesUSDDesc = 'POOLS_BY_TOKEN_XID_MIN_COLLECTED_FEES_U_S_D_DESC',
  PoolsByTokenXidMinCreatedAtAsc = 'POOLS_BY_TOKEN_XID_MIN_CREATED_AT_ASC',
  PoolsByTokenXidMinCreatedAtBlockNumberAsc = 'POOLS_BY_TOKEN_XID_MIN_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolsByTokenXidMinCreatedAtBlockNumberDesc = 'POOLS_BY_TOKEN_XID_MIN_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolsByTokenXidMinCreatedAtDesc = 'POOLS_BY_TOKEN_XID_MIN_CREATED_AT_DESC',
  PoolsByTokenXidMinCurrentTickAsc = 'POOLS_BY_TOKEN_XID_MIN_CURRENT_TICK_ASC',
  PoolsByTokenXidMinCurrentTickDesc = 'POOLS_BY_TOKEN_XID_MIN_CURRENT_TICK_DESC',
  PoolsByTokenXidMinFeesUSDAsc = 'POOLS_BY_TOKEN_XID_MIN_FEES_U_S_D_ASC',
  PoolsByTokenXidMinFeesUSDDesc = 'POOLS_BY_TOKEN_XID_MIN_FEES_U_S_D_DESC',
  PoolsByTokenXidMinFeeAsc = 'POOLS_BY_TOKEN_XID_MIN_FEE_ASC',
  PoolsByTokenXidMinFeeDesc = 'POOLS_BY_TOKEN_XID_MIN_FEE_DESC',
  PoolsByTokenXidMinIdAsc = 'POOLS_BY_TOKEN_XID_MIN_ID_ASC',
  PoolsByTokenXidMinIdDesc = 'POOLS_BY_TOKEN_XID_MIN_ID_DESC',
  PoolsByTokenXidMinLiquidityAsc = 'POOLS_BY_TOKEN_XID_MIN_LIQUIDITY_ASC',
  PoolsByTokenXidMinLiquidityDesc = 'POOLS_BY_TOKEN_XID_MIN_LIQUIDITY_DESC',
  PoolsByTokenXidMinPoolCreatorIdAsc = 'POOLS_BY_TOKEN_XID_MIN_POOL_CREATOR_ID_ASC',
  PoolsByTokenXidMinPoolCreatorIdDesc = 'POOLS_BY_TOKEN_XID_MIN_POOL_CREATOR_ID_DESC',
  PoolsByTokenXidMinSqrtPriceAsc = 'POOLS_BY_TOKEN_XID_MIN_SQRT_PRICE_ASC',
  PoolsByTokenXidMinSqrtPriceDesc = 'POOLS_BY_TOKEN_XID_MIN_SQRT_PRICE_DESC',
  PoolsByTokenXidMinTickSpacingAsc = 'POOLS_BY_TOKEN_XID_MIN_TICK_SPACING_ASC',
  PoolsByTokenXidMinTickSpacingDesc = 'POOLS_BY_TOKEN_XID_MIN_TICK_SPACING_DESC',
  PoolsByTokenXidMinTokenXIdAsc = 'POOLS_BY_TOKEN_XID_MIN_TOKEN_X_ID_ASC',
  PoolsByTokenXidMinTokenXIdDesc = 'POOLS_BY_TOKEN_XID_MIN_TOKEN_X_ID_DESC',
  PoolsByTokenXidMinTokenYIdAsc = 'POOLS_BY_TOKEN_XID_MIN_TOKEN_Y_ID_ASC',
  PoolsByTokenXidMinTokenYIdDesc = 'POOLS_BY_TOKEN_XID_MIN_TOKEN_Y_ID_DESC',
  PoolsByTokenXidMinTotalValueLockedTokenXAsc = 'POOLS_BY_TOKEN_XID_MIN_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolsByTokenXidMinTotalValueLockedTokenXDesc = 'POOLS_BY_TOKEN_XID_MIN_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolsByTokenXidMinTotalValueLockedTokenYAsc = 'POOLS_BY_TOKEN_XID_MIN_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolsByTokenXidMinTotalValueLockedTokenYDesc = 'POOLS_BY_TOKEN_XID_MIN_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolsByTokenXidMinTotalValueLockedUSDAsc = 'POOLS_BY_TOKEN_XID_MIN_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolsByTokenXidMinTotalValueLockedUSDDesc = 'POOLS_BY_TOKEN_XID_MIN_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolsByTokenXidMinTransactionIdAsc = 'POOLS_BY_TOKEN_XID_MIN_TRANSACTION_ID_ASC',
  PoolsByTokenXidMinTransactionIdDesc = 'POOLS_BY_TOKEN_XID_MIN_TRANSACTION_ID_DESC',
  PoolsByTokenXidMinTxCountAsc = 'POOLS_BY_TOKEN_XID_MIN_TX_COUNT_ASC',
  PoolsByTokenXidMinTxCountDesc = 'POOLS_BY_TOKEN_XID_MIN_TX_COUNT_DESC',
  PoolsByTokenXidMinUpdatedAtAsc = 'POOLS_BY_TOKEN_XID_MIN_UPDATED_AT_ASC',
  PoolsByTokenXidMinUpdatedAtDesc = 'POOLS_BY_TOKEN_XID_MIN_UPDATED_AT_DESC',
  PoolsByTokenXidMinVolumeTokenXAsc = 'POOLS_BY_TOKEN_XID_MIN_VOLUME_TOKEN_X_ASC',
  PoolsByTokenXidMinVolumeTokenXDesc = 'POOLS_BY_TOKEN_XID_MIN_VOLUME_TOKEN_X_DESC',
  PoolsByTokenXidMinVolumeTokenYAsc = 'POOLS_BY_TOKEN_XID_MIN_VOLUME_TOKEN_Y_ASC',
  PoolsByTokenXidMinVolumeTokenYDesc = 'POOLS_BY_TOKEN_XID_MIN_VOLUME_TOKEN_Y_DESC',
  PoolsByTokenXidMinVolumeUSDAsc = 'POOLS_BY_TOKEN_XID_MIN_VOLUME_U_S_D_ASC',
  PoolsByTokenXidMinVolumeUSDDesc = 'POOLS_BY_TOKEN_XID_MIN_VOLUME_U_S_D_DESC',
  PoolsByTokenXidStddevPopulationBlockRangeAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  PoolsByTokenXidStddevPopulationBlockRangeDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  PoolsByTokenXidStddevPopulationCollectedFeesTokenXAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_COLLECTED_FEES_TOKEN_X_ASC',
  PoolsByTokenXidStddevPopulationCollectedFeesTokenXDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_COLLECTED_FEES_TOKEN_X_DESC',
  PoolsByTokenXidStddevPopulationCollectedFeesTokenYAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolsByTokenXidStddevPopulationCollectedFeesTokenYDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolsByTokenXidStddevPopulationCollectedFeesUSDAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_COLLECTED_FEES_U_S_D_ASC',
  PoolsByTokenXidStddevPopulationCollectedFeesUSDDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_COLLECTED_FEES_U_S_D_DESC',
  PoolsByTokenXidStddevPopulationCreatedAtAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_CREATED_AT_ASC',
  PoolsByTokenXidStddevPopulationCreatedAtBlockNumberAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolsByTokenXidStddevPopulationCreatedAtBlockNumberDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolsByTokenXidStddevPopulationCreatedAtDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_CREATED_AT_DESC',
  PoolsByTokenXidStddevPopulationCurrentTickAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_CURRENT_TICK_ASC',
  PoolsByTokenXidStddevPopulationCurrentTickDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_CURRENT_TICK_DESC',
  PoolsByTokenXidStddevPopulationFeesUSDAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_FEES_U_S_D_ASC',
  PoolsByTokenXidStddevPopulationFeesUSDDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_FEES_U_S_D_DESC',
  PoolsByTokenXidStddevPopulationFeeAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_FEE_ASC',
  PoolsByTokenXidStddevPopulationFeeDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_FEE_DESC',
  PoolsByTokenXidStddevPopulationIdAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_ID_ASC',
  PoolsByTokenXidStddevPopulationIdDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_ID_DESC',
  PoolsByTokenXidStddevPopulationLiquidityAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_LIQUIDITY_ASC',
  PoolsByTokenXidStddevPopulationLiquidityDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_LIQUIDITY_DESC',
  PoolsByTokenXidStddevPopulationPoolCreatorIdAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_POOL_CREATOR_ID_ASC',
  PoolsByTokenXidStddevPopulationPoolCreatorIdDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_POOL_CREATOR_ID_DESC',
  PoolsByTokenXidStddevPopulationSqrtPriceAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_SQRT_PRICE_ASC',
  PoolsByTokenXidStddevPopulationSqrtPriceDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_SQRT_PRICE_DESC',
  PoolsByTokenXidStddevPopulationTickSpacingAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_TICK_SPACING_ASC',
  PoolsByTokenXidStddevPopulationTickSpacingDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_TICK_SPACING_DESC',
  PoolsByTokenXidStddevPopulationTokenXIdAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_TOKEN_X_ID_ASC',
  PoolsByTokenXidStddevPopulationTokenXIdDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_TOKEN_X_ID_DESC',
  PoolsByTokenXidStddevPopulationTokenYIdAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_TOKEN_Y_ID_ASC',
  PoolsByTokenXidStddevPopulationTokenYIdDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_TOKEN_Y_ID_DESC',
  PoolsByTokenXidStddevPopulationTotalValueLockedTokenXAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolsByTokenXidStddevPopulationTotalValueLockedTokenXDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolsByTokenXidStddevPopulationTotalValueLockedTokenYAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolsByTokenXidStddevPopulationTotalValueLockedTokenYDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolsByTokenXidStddevPopulationTotalValueLockedUSDAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolsByTokenXidStddevPopulationTotalValueLockedUSDDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolsByTokenXidStddevPopulationTransactionIdAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_TRANSACTION_ID_ASC',
  PoolsByTokenXidStddevPopulationTransactionIdDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_TRANSACTION_ID_DESC',
  PoolsByTokenXidStddevPopulationTxCountAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_TX_COUNT_ASC',
  PoolsByTokenXidStddevPopulationTxCountDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_TX_COUNT_DESC',
  PoolsByTokenXidStddevPopulationUpdatedAtAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_UPDATED_AT_ASC',
  PoolsByTokenXidStddevPopulationUpdatedAtDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_UPDATED_AT_DESC',
  PoolsByTokenXidStddevPopulationVolumeTokenXAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_VOLUME_TOKEN_X_ASC',
  PoolsByTokenXidStddevPopulationVolumeTokenXDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_VOLUME_TOKEN_X_DESC',
  PoolsByTokenXidStddevPopulationVolumeTokenYAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_VOLUME_TOKEN_Y_ASC',
  PoolsByTokenXidStddevPopulationVolumeTokenYDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_VOLUME_TOKEN_Y_DESC',
  PoolsByTokenXidStddevPopulationVolumeUSDAsc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_VOLUME_U_S_D_ASC',
  PoolsByTokenXidStddevPopulationVolumeUSDDesc = 'POOLS_BY_TOKEN_XID_STDDEV_POPULATION_VOLUME_U_S_D_DESC',
  PoolsByTokenXidStddevSampleBlockRangeAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  PoolsByTokenXidStddevSampleBlockRangeDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  PoolsByTokenXidStddevSampleCollectedFeesTokenXAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_COLLECTED_FEES_TOKEN_X_ASC',
  PoolsByTokenXidStddevSampleCollectedFeesTokenXDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_COLLECTED_FEES_TOKEN_X_DESC',
  PoolsByTokenXidStddevSampleCollectedFeesTokenYAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolsByTokenXidStddevSampleCollectedFeesTokenYDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolsByTokenXidStddevSampleCollectedFeesUSDAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_COLLECTED_FEES_U_S_D_ASC',
  PoolsByTokenXidStddevSampleCollectedFeesUSDDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_COLLECTED_FEES_U_S_D_DESC',
  PoolsByTokenXidStddevSampleCreatedAtAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_CREATED_AT_ASC',
  PoolsByTokenXidStddevSampleCreatedAtBlockNumberAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolsByTokenXidStddevSampleCreatedAtBlockNumberDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolsByTokenXidStddevSampleCreatedAtDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_CREATED_AT_DESC',
  PoolsByTokenXidStddevSampleCurrentTickAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_CURRENT_TICK_ASC',
  PoolsByTokenXidStddevSampleCurrentTickDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_CURRENT_TICK_DESC',
  PoolsByTokenXidStddevSampleFeesUSDAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_FEES_U_S_D_ASC',
  PoolsByTokenXidStddevSampleFeesUSDDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_FEES_U_S_D_DESC',
  PoolsByTokenXidStddevSampleFeeAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_FEE_ASC',
  PoolsByTokenXidStddevSampleFeeDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_FEE_DESC',
  PoolsByTokenXidStddevSampleIdAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_ID_ASC',
  PoolsByTokenXidStddevSampleIdDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_ID_DESC',
  PoolsByTokenXidStddevSampleLiquidityAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_LIQUIDITY_ASC',
  PoolsByTokenXidStddevSampleLiquidityDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_LIQUIDITY_DESC',
  PoolsByTokenXidStddevSamplePoolCreatorIdAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_POOL_CREATOR_ID_ASC',
  PoolsByTokenXidStddevSamplePoolCreatorIdDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_POOL_CREATOR_ID_DESC',
  PoolsByTokenXidStddevSampleSqrtPriceAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_SQRT_PRICE_ASC',
  PoolsByTokenXidStddevSampleSqrtPriceDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_SQRT_PRICE_DESC',
  PoolsByTokenXidStddevSampleTickSpacingAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_TICK_SPACING_ASC',
  PoolsByTokenXidStddevSampleTickSpacingDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_TICK_SPACING_DESC',
  PoolsByTokenXidStddevSampleTokenXIdAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_TOKEN_X_ID_ASC',
  PoolsByTokenXidStddevSampleTokenXIdDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_TOKEN_X_ID_DESC',
  PoolsByTokenXidStddevSampleTokenYIdAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_TOKEN_Y_ID_ASC',
  PoolsByTokenXidStddevSampleTokenYIdDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_TOKEN_Y_ID_DESC',
  PoolsByTokenXidStddevSampleTotalValueLockedTokenXAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolsByTokenXidStddevSampleTotalValueLockedTokenXDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolsByTokenXidStddevSampleTotalValueLockedTokenYAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolsByTokenXidStddevSampleTotalValueLockedTokenYDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolsByTokenXidStddevSampleTotalValueLockedUSDAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolsByTokenXidStddevSampleTotalValueLockedUSDDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolsByTokenXidStddevSampleTransactionIdAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_TRANSACTION_ID_ASC',
  PoolsByTokenXidStddevSampleTransactionIdDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_TRANSACTION_ID_DESC',
  PoolsByTokenXidStddevSampleTxCountAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_TX_COUNT_ASC',
  PoolsByTokenXidStddevSampleTxCountDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_TX_COUNT_DESC',
  PoolsByTokenXidStddevSampleUpdatedAtAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_UPDATED_AT_ASC',
  PoolsByTokenXidStddevSampleUpdatedAtDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_UPDATED_AT_DESC',
  PoolsByTokenXidStddevSampleVolumeTokenXAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_VOLUME_TOKEN_X_ASC',
  PoolsByTokenXidStddevSampleVolumeTokenXDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_VOLUME_TOKEN_X_DESC',
  PoolsByTokenXidStddevSampleVolumeTokenYAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_VOLUME_TOKEN_Y_ASC',
  PoolsByTokenXidStddevSampleVolumeTokenYDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_VOLUME_TOKEN_Y_DESC',
  PoolsByTokenXidStddevSampleVolumeUSDAsc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_VOLUME_U_S_D_ASC',
  PoolsByTokenXidStddevSampleVolumeUSDDesc = 'POOLS_BY_TOKEN_XID_STDDEV_SAMPLE_VOLUME_U_S_D_DESC',
  PoolsByTokenXidSumBlockRangeAsc = 'POOLS_BY_TOKEN_XID_SUM_BLOCK_RANGE_ASC',
  PoolsByTokenXidSumBlockRangeDesc = 'POOLS_BY_TOKEN_XID_SUM_BLOCK_RANGE_DESC',
  PoolsByTokenXidSumCollectedFeesTokenXAsc = 'POOLS_BY_TOKEN_XID_SUM_COLLECTED_FEES_TOKEN_X_ASC',
  PoolsByTokenXidSumCollectedFeesTokenXDesc = 'POOLS_BY_TOKEN_XID_SUM_COLLECTED_FEES_TOKEN_X_DESC',
  PoolsByTokenXidSumCollectedFeesTokenYAsc = 'POOLS_BY_TOKEN_XID_SUM_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolsByTokenXidSumCollectedFeesTokenYDesc = 'POOLS_BY_TOKEN_XID_SUM_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolsByTokenXidSumCollectedFeesUSDAsc = 'POOLS_BY_TOKEN_XID_SUM_COLLECTED_FEES_U_S_D_ASC',
  PoolsByTokenXidSumCollectedFeesUSDDesc = 'POOLS_BY_TOKEN_XID_SUM_COLLECTED_FEES_U_S_D_DESC',
  PoolsByTokenXidSumCreatedAtAsc = 'POOLS_BY_TOKEN_XID_SUM_CREATED_AT_ASC',
  PoolsByTokenXidSumCreatedAtBlockNumberAsc = 'POOLS_BY_TOKEN_XID_SUM_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolsByTokenXidSumCreatedAtBlockNumberDesc = 'POOLS_BY_TOKEN_XID_SUM_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolsByTokenXidSumCreatedAtDesc = 'POOLS_BY_TOKEN_XID_SUM_CREATED_AT_DESC',
  PoolsByTokenXidSumCurrentTickAsc = 'POOLS_BY_TOKEN_XID_SUM_CURRENT_TICK_ASC',
  PoolsByTokenXidSumCurrentTickDesc = 'POOLS_BY_TOKEN_XID_SUM_CURRENT_TICK_DESC',
  PoolsByTokenXidSumFeesUSDAsc = 'POOLS_BY_TOKEN_XID_SUM_FEES_U_S_D_ASC',
  PoolsByTokenXidSumFeesUSDDesc = 'POOLS_BY_TOKEN_XID_SUM_FEES_U_S_D_DESC',
  PoolsByTokenXidSumFeeAsc = 'POOLS_BY_TOKEN_XID_SUM_FEE_ASC',
  PoolsByTokenXidSumFeeDesc = 'POOLS_BY_TOKEN_XID_SUM_FEE_DESC',
  PoolsByTokenXidSumIdAsc = 'POOLS_BY_TOKEN_XID_SUM_ID_ASC',
  PoolsByTokenXidSumIdDesc = 'POOLS_BY_TOKEN_XID_SUM_ID_DESC',
  PoolsByTokenXidSumLiquidityAsc = 'POOLS_BY_TOKEN_XID_SUM_LIQUIDITY_ASC',
  PoolsByTokenXidSumLiquidityDesc = 'POOLS_BY_TOKEN_XID_SUM_LIQUIDITY_DESC',
  PoolsByTokenXidSumPoolCreatorIdAsc = 'POOLS_BY_TOKEN_XID_SUM_POOL_CREATOR_ID_ASC',
  PoolsByTokenXidSumPoolCreatorIdDesc = 'POOLS_BY_TOKEN_XID_SUM_POOL_CREATOR_ID_DESC',
  PoolsByTokenXidSumSqrtPriceAsc = 'POOLS_BY_TOKEN_XID_SUM_SQRT_PRICE_ASC',
  PoolsByTokenXidSumSqrtPriceDesc = 'POOLS_BY_TOKEN_XID_SUM_SQRT_PRICE_DESC',
  PoolsByTokenXidSumTickSpacingAsc = 'POOLS_BY_TOKEN_XID_SUM_TICK_SPACING_ASC',
  PoolsByTokenXidSumTickSpacingDesc = 'POOLS_BY_TOKEN_XID_SUM_TICK_SPACING_DESC',
  PoolsByTokenXidSumTokenXIdAsc = 'POOLS_BY_TOKEN_XID_SUM_TOKEN_X_ID_ASC',
  PoolsByTokenXidSumTokenXIdDesc = 'POOLS_BY_TOKEN_XID_SUM_TOKEN_X_ID_DESC',
  PoolsByTokenXidSumTokenYIdAsc = 'POOLS_BY_TOKEN_XID_SUM_TOKEN_Y_ID_ASC',
  PoolsByTokenXidSumTokenYIdDesc = 'POOLS_BY_TOKEN_XID_SUM_TOKEN_Y_ID_DESC',
  PoolsByTokenXidSumTotalValueLockedTokenXAsc = 'POOLS_BY_TOKEN_XID_SUM_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolsByTokenXidSumTotalValueLockedTokenXDesc = 'POOLS_BY_TOKEN_XID_SUM_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolsByTokenXidSumTotalValueLockedTokenYAsc = 'POOLS_BY_TOKEN_XID_SUM_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolsByTokenXidSumTotalValueLockedTokenYDesc = 'POOLS_BY_TOKEN_XID_SUM_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolsByTokenXidSumTotalValueLockedUSDAsc = 'POOLS_BY_TOKEN_XID_SUM_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolsByTokenXidSumTotalValueLockedUSDDesc = 'POOLS_BY_TOKEN_XID_SUM_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolsByTokenXidSumTransactionIdAsc = 'POOLS_BY_TOKEN_XID_SUM_TRANSACTION_ID_ASC',
  PoolsByTokenXidSumTransactionIdDesc = 'POOLS_BY_TOKEN_XID_SUM_TRANSACTION_ID_DESC',
  PoolsByTokenXidSumTxCountAsc = 'POOLS_BY_TOKEN_XID_SUM_TX_COUNT_ASC',
  PoolsByTokenXidSumTxCountDesc = 'POOLS_BY_TOKEN_XID_SUM_TX_COUNT_DESC',
  PoolsByTokenXidSumUpdatedAtAsc = 'POOLS_BY_TOKEN_XID_SUM_UPDATED_AT_ASC',
  PoolsByTokenXidSumUpdatedAtDesc = 'POOLS_BY_TOKEN_XID_SUM_UPDATED_AT_DESC',
  PoolsByTokenXidSumVolumeTokenXAsc = 'POOLS_BY_TOKEN_XID_SUM_VOLUME_TOKEN_X_ASC',
  PoolsByTokenXidSumVolumeTokenXDesc = 'POOLS_BY_TOKEN_XID_SUM_VOLUME_TOKEN_X_DESC',
  PoolsByTokenXidSumVolumeTokenYAsc = 'POOLS_BY_TOKEN_XID_SUM_VOLUME_TOKEN_Y_ASC',
  PoolsByTokenXidSumVolumeTokenYDesc = 'POOLS_BY_TOKEN_XID_SUM_VOLUME_TOKEN_Y_DESC',
  PoolsByTokenXidSumVolumeUSDAsc = 'POOLS_BY_TOKEN_XID_SUM_VOLUME_U_S_D_ASC',
  PoolsByTokenXidSumVolumeUSDDesc = 'POOLS_BY_TOKEN_XID_SUM_VOLUME_U_S_D_DESC',
  PoolsByTokenXidVariancePopulationBlockRangeAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  PoolsByTokenXidVariancePopulationBlockRangeDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  PoolsByTokenXidVariancePopulationCollectedFeesTokenXAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_COLLECTED_FEES_TOKEN_X_ASC',
  PoolsByTokenXidVariancePopulationCollectedFeesTokenXDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_COLLECTED_FEES_TOKEN_X_DESC',
  PoolsByTokenXidVariancePopulationCollectedFeesTokenYAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolsByTokenXidVariancePopulationCollectedFeesTokenYDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolsByTokenXidVariancePopulationCollectedFeesUSDAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_COLLECTED_FEES_U_S_D_ASC',
  PoolsByTokenXidVariancePopulationCollectedFeesUSDDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_COLLECTED_FEES_U_S_D_DESC',
  PoolsByTokenXidVariancePopulationCreatedAtAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_CREATED_AT_ASC',
  PoolsByTokenXidVariancePopulationCreatedAtBlockNumberAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolsByTokenXidVariancePopulationCreatedAtBlockNumberDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolsByTokenXidVariancePopulationCreatedAtDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_CREATED_AT_DESC',
  PoolsByTokenXidVariancePopulationCurrentTickAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_CURRENT_TICK_ASC',
  PoolsByTokenXidVariancePopulationCurrentTickDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_CURRENT_TICK_DESC',
  PoolsByTokenXidVariancePopulationFeesUSDAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_FEES_U_S_D_ASC',
  PoolsByTokenXidVariancePopulationFeesUSDDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_FEES_U_S_D_DESC',
  PoolsByTokenXidVariancePopulationFeeAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_FEE_ASC',
  PoolsByTokenXidVariancePopulationFeeDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_FEE_DESC',
  PoolsByTokenXidVariancePopulationIdAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_ID_ASC',
  PoolsByTokenXidVariancePopulationIdDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_ID_DESC',
  PoolsByTokenXidVariancePopulationLiquidityAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_LIQUIDITY_ASC',
  PoolsByTokenXidVariancePopulationLiquidityDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_LIQUIDITY_DESC',
  PoolsByTokenXidVariancePopulationPoolCreatorIdAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_POOL_CREATOR_ID_ASC',
  PoolsByTokenXidVariancePopulationPoolCreatorIdDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_POOL_CREATOR_ID_DESC',
  PoolsByTokenXidVariancePopulationSqrtPriceAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_SQRT_PRICE_ASC',
  PoolsByTokenXidVariancePopulationSqrtPriceDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_SQRT_PRICE_DESC',
  PoolsByTokenXidVariancePopulationTickSpacingAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_TICK_SPACING_ASC',
  PoolsByTokenXidVariancePopulationTickSpacingDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_TICK_SPACING_DESC',
  PoolsByTokenXidVariancePopulationTokenXIdAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_TOKEN_X_ID_ASC',
  PoolsByTokenXidVariancePopulationTokenXIdDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_TOKEN_X_ID_DESC',
  PoolsByTokenXidVariancePopulationTokenYIdAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_TOKEN_Y_ID_ASC',
  PoolsByTokenXidVariancePopulationTokenYIdDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_TOKEN_Y_ID_DESC',
  PoolsByTokenXidVariancePopulationTotalValueLockedTokenXAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolsByTokenXidVariancePopulationTotalValueLockedTokenXDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolsByTokenXidVariancePopulationTotalValueLockedTokenYAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolsByTokenXidVariancePopulationTotalValueLockedTokenYDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolsByTokenXidVariancePopulationTotalValueLockedUSDAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolsByTokenXidVariancePopulationTotalValueLockedUSDDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolsByTokenXidVariancePopulationTransactionIdAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_TRANSACTION_ID_ASC',
  PoolsByTokenXidVariancePopulationTransactionIdDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_TRANSACTION_ID_DESC',
  PoolsByTokenXidVariancePopulationTxCountAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_TX_COUNT_ASC',
  PoolsByTokenXidVariancePopulationTxCountDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_TX_COUNT_DESC',
  PoolsByTokenXidVariancePopulationUpdatedAtAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_UPDATED_AT_ASC',
  PoolsByTokenXidVariancePopulationUpdatedAtDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_UPDATED_AT_DESC',
  PoolsByTokenXidVariancePopulationVolumeTokenXAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_VOLUME_TOKEN_X_ASC',
  PoolsByTokenXidVariancePopulationVolumeTokenXDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_VOLUME_TOKEN_X_DESC',
  PoolsByTokenXidVariancePopulationVolumeTokenYAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_VOLUME_TOKEN_Y_ASC',
  PoolsByTokenXidVariancePopulationVolumeTokenYDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_VOLUME_TOKEN_Y_DESC',
  PoolsByTokenXidVariancePopulationVolumeUSDAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_VOLUME_U_S_D_ASC',
  PoolsByTokenXidVariancePopulationVolumeUSDDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_POPULATION_VOLUME_U_S_D_DESC',
  PoolsByTokenXidVarianceSampleBlockRangeAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  PoolsByTokenXidVarianceSampleBlockRangeDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  PoolsByTokenXidVarianceSampleCollectedFeesTokenXAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_COLLECTED_FEES_TOKEN_X_ASC',
  PoolsByTokenXidVarianceSampleCollectedFeesTokenXDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_COLLECTED_FEES_TOKEN_X_DESC',
  PoolsByTokenXidVarianceSampleCollectedFeesTokenYAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolsByTokenXidVarianceSampleCollectedFeesTokenYDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolsByTokenXidVarianceSampleCollectedFeesUSDAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_COLLECTED_FEES_U_S_D_ASC',
  PoolsByTokenXidVarianceSampleCollectedFeesUSDDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_COLLECTED_FEES_U_S_D_DESC',
  PoolsByTokenXidVarianceSampleCreatedAtAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_CREATED_AT_ASC',
  PoolsByTokenXidVarianceSampleCreatedAtBlockNumberAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolsByTokenXidVarianceSampleCreatedAtBlockNumberDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolsByTokenXidVarianceSampleCreatedAtDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_CREATED_AT_DESC',
  PoolsByTokenXidVarianceSampleCurrentTickAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_CURRENT_TICK_ASC',
  PoolsByTokenXidVarianceSampleCurrentTickDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_CURRENT_TICK_DESC',
  PoolsByTokenXidVarianceSampleFeesUSDAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_FEES_U_S_D_ASC',
  PoolsByTokenXidVarianceSampleFeesUSDDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_FEES_U_S_D_DESC',
  PoolsByTokenXidVarianceSampleFeeAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_FEE_ASC',
  PoolsByTokenXidVarianceSampleFeeDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_FEE_DESC',
  PoolsByTokenXidVarianceSampleIdAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_ID_ASC',
  PoolsByTokenXidVarianceSampleIdDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_ID_DESC',
  PoolsByTokenXidVarianceSampleLiquidityAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_LIQUIDITY_ASC',
  PoolsByTokenXidVarianceSampleLiquidityDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_LIQUIDITY_DESC',
  PoolsByTokenXidVarianceSamplePoolCreatorIdAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_POOL_CREATOR_ID_ASC',
  PoolsByTokenXidVarianceSamplePoolCreatorIdDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_POOL_CREATOR_ID_DESC',
  PoolsByTokenXidVarianceSampleSqrtPriceAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_SQRT_PRICE_ASC',
  PoolsByTokenXidVarianceSampleSqrtPriceDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_SQRT_PRICE_DESC',
  PoolsByTokenXidVarianceSampleTickSpacingAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_TICK_SPACING_ASC',
  PoolsByTokenXidVarianceSampleTickSpacingDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_TICK_SPACING_DESC',
  PoolsByTokenXidVarianceSampleTokenXIdAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_TOKEN_X_ID_ASC',
  PoolsByTokenXidVarianceSampleTokenXIdDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_TOKEN_X_ID_DESC',
  PoolsByTokenXidVarianceSampleTokenYIdAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_TOKEN_Y_ID_ASC',
  PoolsByTokenXidVarianceSampleTokenYIdDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_TOKEN_Y_ID_DESC',
  PoolsByTokenXidVarianceSampleTotalValueLockedTokenXAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolsByTokenXidVarianceSampleTotalValueLockedTokenXDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolsByTokenXidVarianceSampleTotalValueLockedTokenYAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolsByTokenXidVarianceSampleTotalValueLockedTokenYDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolsByTokenXidVarianceSampleTotalValueLockedUSDAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolsByTokenXidVarianceSampleTotalValueLockedUSDDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolsByTokenXidVarianceSampleTransactionIdAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_TRANSACTION_ID_ASC',
  PoolsByTokenXidVarianceSampleTransactionIdDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_TRANSACTION_ID_DESC',
  PoolsByTokenXidVarianceSampleTxCountAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_TX_COUNT_ASC',
  PoolsByTokenXidVarianceSampleTxCountDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_TX_COUNT_DESC',
  PoolsByTokenXidVarianceSampleUpdatedAtAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_UPDATED_AT_ASC',
  PoolsByTokenXidVarianceSampleUpdatedAtDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_UPDATED_AT_DESC',
  PoolsByTokenXidVarianceSampleVolumeTokenXAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_VOLUME_TOKEN_X_ASC',
  PoolsByTokenXidVarianceSampleVolumeTokenXDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_VOLUME_TOKEN_X_DESC',
  PoolsByTokenXidVarianceSampleVolumeTokenYAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_VOLUME_TOKEN_Y_ASC',
  PoolsByTokenXidVarianceSampleVolumeTokenYDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_VOLUME_TOKEN_Y_DESC',
  PoolsByTokenXidVarianceSampleVolumeUSDAsc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_VOLUME_U_S_D_ASC',
  PoolsByTokenXidVarianceSampleVolumeUSDDesc = 'POOLS_BY_TOKEN_XID_VARIANCE_SAMPLE_VOLUME_U_S_D_DESC',
  PoolsByTokenYidAverageBlockRangeAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_BLOCK_RANGE_ASC',
  PoolsByTokenYidAverageBlockRangeDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_BLOCK_RANGE_DESC',
  PoolsByTokenYidAverageCollectedFeesTokenXAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_COLLECTED_FEES_TOKEN_X_ASC',
  PoolsByTokenYidAverageCollectedFeesTokenXDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_COLLECTED_FEES_TOKEN_X_DESC',
  PoolsByTokenYidAverageCollectedFeesTokenYAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolsByTokenYidAverageCollectedFeesTokenYDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolsByTokenYidAverageCollectedFeesUSDAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_COLLECTED_FEES_U_S_D_ASC',
  PoolsByTokenYidAverageCollectedFeesUSDDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_COLLECTED_FEES_U_S_D_DESC',
  PoolsByTokenYidAverageCreatedAtAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_CREATED_AT_ASC',
  PoolsByTokenYidAverageCreatedAtBlockNumberAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolsByTokenYidAverageCreatedAtBlockNumberDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolsByTokenYidAverageCreatedAtDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_CREATED_AT_DESC',
  PoolsByTokenYidAverageCurrentTickAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_CURRENT_TICK_ASC',
  PoolsByTokenYidAverageCurrentTickDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_CURRENT_TICK_DESC',
  PoolsByTokenYidAverageFeesUSDAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_FEES_U_S_D_ASC',
  PoolsByTokenYidAverageFeesUSDDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_FEES_U_S_D_DESC',
  PoolsByTokenYidAverageFeeAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_FEE_ASC',
  PoolsByTokenYidAverageFeeDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_FEE_DESC',
  PoolsByTokenYidAverageIdAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_ID_ASC',
  PoolsByTokenYidAverageIdDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_ID_DESC',
  PoolsByTokenYidAverageLiquidityAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_LIQUIDITY_ASC',
  PoolsByTokenYidAverageLiquidityDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_LIQUIDITY_DESC',
  PoolsByTokenYidAveragePoolCreatorIdAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_POOL_CREATOR_ID_ASC',
  PoolsByTokenYidAveragePoolCreatorIdDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_POOL_CREATOR_ID_DESC',
  PoolsByTokenYidAverageSqrtPriceAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_SQRT_PRICE_ASC',
  PoolsByTokenYidAverageSqrtPriceDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_SQRT_PRICE_DESC',
  PoolsByTokenYidAverageTickSpacingAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_TICK_SPACING_ASC',
  PoolsByTokenYidAverageTickSpacingDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_TICK_SPACING_DESC',
  PoolsByTokenYidAverageTokenXIdAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_TOKEN_X_ID_ASC',
  PoolsByTokenYidAverageTokenXIdDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_TOKEN_X_ID_DESC',
  PoolsByTokenYidAverageTokenYIdAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_TOKEN_Y_ID_ASC',
  PoolsByTokenYidAverageTokenYIdDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_TOKEN_Y_ID_DESC',
  PoolsByTokenYidAverageTotalValueLockedTokenXAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolsByTokenYidAverageTotalValueLockedTokenXDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolsByTokenYidAverageTotalValueLockedTokenYAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolsByTokenYidAverageTotalValueLockedTokenYDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolsByTokenYidAverageTotalValueLockedUSDAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolsByTokenYidAverageTotalValueLockedUSDDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolsByTokenYidAverageTransactionIdAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_TRANSACTION_ID_ASC',
  PoolsByTokenYidAverageTransactionIdDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_TRANSACTION_ID_DESC',
  PoolsByTokenYidAverageTxCountAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_TX_COUNT_ASC',
  PoolsByTokenYidAverageTxCountDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_TX_COUNT_DESC',
  PoolsByTokenYidAverageUpdatedAtAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_UPDATED_AT_ASC',
  PoolsByTokenYidAverageUpdatedAtDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_UPDATED_AT_DESC',
  PoolsByTokenYidAverageVolumeTokenXAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_VOLUME_TOKEN_X_ASC',
  PoolsByTokenYidAverageVolumeTokenXDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_VOLUME_TOKEN_X_DESC',
  PoolsByTokenYidAverageVolumeTokenYAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_VOLUME_TOKEN_Y_ASC',
  PoolsByTokenYidAverageVolumeTokenYDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_VOLUME_TOKEN_Y_DESC',
  PoolsByTokenYidAverageVolumeUSDAsc = 'POOLS_BY_TOKEN_YID_AVERAGE_VOLUME_U_S_D_ASC',
  PoolsByTokenYidAverageVolumeUSDDesc = 'POOLS_BY_TOKEN_YID_AVERAGE_VOLUME_U_S_D_DESC',
  PoolsByTokenYidCountAsc = 'POOLS_BY_TOKEN_YID_COUNT_ASC',
  PoolsByTokenYidCountDesc = 'POOLS_BY_TOKEN_YID_COUNT_DESC',
  PoolsByTokenYidDistinctCountBlockRangeAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  PoolsByTokenYidDistinctCountBlockRangeDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  PoolsByTokenYidDistinctCountCollectedFeesTokenXAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_COLLECTED_FEES_TOKEN_X_ASC',
  PoolsByTokenYidDistinctCountCollectedFeesTokenXDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_COLLECTED_FEES_TOKEN_X_DESC',
  PoolsByTokenYidDistinctCountCollectedFeesTokenYAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolsByTokenYidDistinctCountCollectedFeesTokenYDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolsByTokenYidDistinctCountCollectedFeesUSDAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_COLLECTED_FEES_U_S_D_ASC',
  PoolsByTokenYidDistinctCountCollectedFeesUSDDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_COLLECTED_FEES_U_S_D_DESC',
  PoolsByTokenYidDistinctCountCreatedAtAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_CREATED_AT_ASC',
  PoolsByTokenYidDistinctCountCreatedAtBlockNumberAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolsByTokenYidDistinctCountCreatedAtBlockNumberDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolsByTokenYidDistinctCountCreatedAtDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_CREATED_AT_DESC',
  PoolsByTokenYidDistinctCountCurrentTickAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_CURRENT_TICK_ASC',
  PoolsByTokenYidDistinctCountCurrentTickDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_CURRENT_TICK_DESC',
  PoolsByTokenYidDistinctCountFeesUSDAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_FEES_U_S_D_ASC',
  PoolsByTokenYidDistinctCountFeesUSDDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_FEES_U_S_D_DESC',
  PoolsByTokenYidDistinctCountFeeAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_FEE_ASC',
  PoolsByTokenYidDistinctCountFeeDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_FEE_DESC',
  PoolsByTokenYidDistinctCountIdAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_ID_ASC',
  PoolsByTokenYidDistinctCountIdDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_ID_DESC',
  PoolsByTokenYidDistinctCountLiquidityAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_LIQUIDITY_ASC',
  PoolsByTokenYidDistinctCountLiquidityDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_LIQUIDITY_DESC',
  PoolsByTokenYidDistinctCountPoolCreatorIdAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_POOL_CREATOR_ID_ASC',
  PoolsByTokenYidDistinctCountPoolCreatorIdDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_POOL_CREATOR_ID_DESC',
  PoolsByTokenYidDistinctCountSqrtPriceAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_SQRT_PRICE_ASC',
  PoolsByTokenYidDistinctCountSqrtPriceDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_SQRT_PRICE_DESC',
  PoolsByTokenYidDistinctCountTickSpacingAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_TICK_SPACING_ASC',
  PoolsByTokenYidDistinctCountTickSpacingDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_TICK_SPACING_DESC',
  PoolsByTokenYidDistinctCountTokenXIdAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_TOKEN_X_ID_ASC',
  PoolsByTokenYidDistinctCountTokenXIdDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_TOKEN_X_ID_DESC',
  PoolsByTokenYidDistinctCountTokenYIdAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_TOKEN_Y_ID_ASC',
  PoolsByTokenYidDistinctCountTokenYIdDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_TOKEN_Y_ID_DESC',
  PoolsByTokenYidDistinctCountTotalValueLockedTokenXAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolsByTokenYidDistinctCountTotalValueLockedTokenXDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolsByTokenYidDistinctCountTotalValueLockedTokenYAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolsByTokenYidDistinctCountTotalValueLockedTokenYDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolsByTokenYidDistinctCountTotalValueLockedUSDAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolsByTokenYidDistinctCountTotalValueLockedUSDDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolsByTokenYidDistinctCountTransactionIdAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_TRANSACTION_ID_ASC',
  PoolsByTokenYidDistinctCountTransactionIdDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_TRANSACTION_ID_DESC',
  PoolsByTokenYidDistinctCountTxCountAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_TX_COUNT_ASC',
  PoolsByTokenYidDistinctCountTxCountDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_TX_COUNT_DESC',
  PoolsByTokenYidDistinctCountUpdatedAtAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_UPDATED_AT_ASC',
  PoolsByTokenYidDistinctCountUpdatedAtDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_UPDATED_AT_DESC',
  PoolsByTokenYidDistinctCountVolumeTokenXAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_VOLUME_TOKEN_X_ASC',
  PoolsByTokenYidDistinctCountVolumeTokenXDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_VOLUME_TOKEN_X_DESC',
  PoolsByTokenYidDistinctCountVolumeTokenYAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_VOLUME_TOKEN_Y_ASC',
  PoolsByTokenYidDistinctCountVolumeTokenYDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_VOLUME_TOKEN_Y_DESC',
  PoolsByTokenYidDistinctCountVolumeUSDAsc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_VOLUME_U_S_D_ASC',
  PoolsByTokenYidDistinctCountVolumeUSDDesc = 'POOLS_BY_TOKEN_YID_DISTINCT_COUNT_VOLUME_U_S_D_DESC',
  PoolsByTokenYidMaxBlockRangeAsc = 'POOLS_BY_TOKEN_YID_MAX_BLOCK_RANGE_ASC',
  PoolsByTokenYidMaxBlockRangeDesc = 'POOLS_BY_TOKEN_YID_MAX_BLOCK_RANGE_DESC',
  PoolsByTokenYidMaxCollectedFeesTokenXAsc = 'POOLS_BY_TOKEN_YID_MAX_COLLECTED_FEES_TOKEN_X_ASC',
  PoolsByTokenYidMaxCollectedFeesTokenXDesc = 'POOLS_BY_TOKEN_YID_MAX_COLLECTED_FEES_TOKEN_X_DESC',
  PoolsByTokenYidMaxCollectedFeesTokenYAsc = 'POOLS_BY_TOKEN_YID_MAX_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolsByTokenYidMaxCollectedFeesTokenYDesc = 'POOLS_BY_TOKEN_YID_MAX_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolsByTokenYidMaxCollectedFeesUSDAsc = 'POOLS_BY_TOKEN_YID_MAX_COLLECTED_FEES_U_S_D_ASC',
  PoolsByTokenYidMaxCollectedFeesUSDDesc = 'POOLS_BY_TOKEN_YID_MAX_COLLECTED_FEES_U_S_D_DESC',
  PoolsByTokenYidMaxCreatedAtAsc = 'POOLS_BY_TOKEN_YID_MAX_CREATED_AT_ASC',
  PoolsByTokenYidMaxCreatedAtBlockNumberAsc = 'POOLS_BY_TOKEN_YID_MAX_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolsByTokenYidMaxCreatedAtBlockNumberDesc = 'POOLS_BY_TOKEN_YID_MAX_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolsByTokenYidMaxCreatedAtDesc = 'POOLS_BY_TOKEN_YID_MAX_CREATED_AT_DESC',
  PoolsByTokenYidMaxCurrentTickAsc = 'POOLS_BY_TOKEN_YID_MAX_CURRENT_TICK_ASC',
  PoolsByTokenYidMaxCurrentTickDesc = 'POOLS_BY_TOKEN_YID_MAX_CURRENT_TICK_DESC',
  PoolsByTokenYidMaxFeesUSDAsc = 'POOLS_BY_TOKEN_YID_MAX_FEES_U_S_D_ASC',
  PoolsByTokenYidMaxFeesUSDDesc = 'POOLS_BY_TOKEN_YID_MAX_FEES_U_S_D_DESC',
  PoolsByTokenYidMaxFeeAsc = 'POOLS_BY_TOKEN_YID_MAX_FEE_ASC',
  PoolsByTokenYidMaxFeeDesc = 'POOLS_BY_TOKEN_YID_MAX_FEE_DESC',
  PoolsByTokenYidMaxIdAsc = 'POOLS_BY_TOKEN_YID_MAX_ID_ASC',
  PoolsByTokenYidMaxIdDesc = 'POOLS_BY_TOKEN_YID_MAX_ID_DESC',
  PoolsByTokenYidMaxLiquidityAsc = 'POOLS_BY_TOKEN_YID_MAX_LIQUIDITY_ASC',
  PoolsByTokenYidMaxLiquidityDesc = 'POOLS_BY_TOKEN_YID_MAX_LIQUIDITY_DESC',
  PoolsByTokenYidMaxPoolCreatorIdAsc = 'POOLS_BY_TOKEN_YID_MAX_POOL_CREATOR_ID_ASC',
  PoolsByTokenYidMaxPoolCreatorIdDesc = 'POOLS_BY_TOKEN_YID_MAX_POOL_CREATOR_ID_DESC',
  PoolsByTokenYidMaxSqrtPriceAsc = 'POOLS_BY_TOKEN_YID_MAX_SQRT_PRICE_ASC',
  PoolsByTokenYidMaxSqrtPriceDesc = 'POOLS_BY_TOKEN_YID_MAX_SQRT_PRICE_DESC',
  PoolsByTokenYidMaxTickSpacingAsc = 'POOLS_BY_TOKEN_YID_MAX_TICK_SPACING_ASC',
  PoolsByTokenYidMaxTickSpacingDesc = 'POOLS_BY_TOKEN_YID_MAX_TICK_SPACING_DESC',
  PoolsByTokenYidMaxTokenXIdAsc = 'POOLS_BY_TOKEN_YID_MAX_TOKEN_X_ID_ASC',
  PoolsByTokenYidMaxTokenXIdDesc = 'POOLS_BY_TOKEN_YID_MAX_TOKEN_X_ID_DESC',
  PoolsByTokenYidMaxTokenYIdAsc = 'POOLS_BY_TOKEN_YID_MAX_TOKEN_Y_ID_ASC',
  PoolsByTokenYidMaxTokenYIdDesc = 'POOLS_BY_TOKEN_YID_MAX_TOKEN_Y_ID_DESC',
  PoolsByTokenYidMaxTotalValueLockedTokenXAsc = 'POOLS_BY_TOKEN_YID_MAX_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolsByTokenYidMaxTotalValueLockedTokenXDesc = 'POOLS_BY_TOKEN_YID_MAX_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolsByTokenYidMaxTotalValueLockedTokenYAsc = 'POOLS_BY_TOKEN_YID_MAX_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolsByTokenYidMaxTotalValueLockedTokenYDesc = 'POOLS_BY_TOKEN_YID_MAX_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolsByTokenYidMaxTotalValueLockedUSDAsc = 'POOLS_BY_TOKEN_YID_MAX_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolsByTokenYidMaxTotalValueLockedUSDDesc = 'POOLS_BY_TOKEN_YID_MAX_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolsByTokenYidMaxTransactionIdAsc = 'POOLS_BY_TOKEN_YID_MAX_TRANSACTION_ID_ASC',
  PoolsByTokenYidMaxTransactionIdDesc = 'POOLS_BY_TOKEN_YID_MAX_TRANSACTION_ID_DESC',
  PoolsByTokenYidMaxTxCountAsc = 'POOLS_BY_TOKEN_YID_MAX_TX_COUNT_ASC',
  PoolsByTokenYidMaxTxCountDesc = 'POOLS_BY_TOKEN_YID_MAX_TX_COUNT_DESC',
  PoolsByTokenYidMaxUpdatedAtAsc = 'POOLS_BY_TOKEN_YID_MAX_UPDATED_AT_ASC',
  PoolsByTokenYidMaxUpdatedAtDesc = 'POOLS_BY_TOKEN_YID_MAX_UPDATED_AT_DESC',
  PoolsByTokenYidMaxVolumeTokenXAsc = 'POOLS_BY_TOKEN_YID_MAX_VOLUME_TOKEN_X_ASC',
  PoolsByTokenYidMaxVolumeTokenXDesc = 'POOLS_BY_TOKEN_YID_MAX_VOLUME_TOKEN_X_DESC',
  PoolsByTokenYidMaxVolumeTokenYAsc = 'POOLS_BY_TOKEN_YID_MAX_VOLUME_TOKEN_Y_ASC',
  PoolsByTokenYidMaxVolumeTokenYDesc = 'POOLS_BY_TOKEN_YID_MAX_VOLUME_TOKEN_Y_DESC',
  PoolsByTokenYidMaxVolumeUSDAsc = 'POOLS_BY_TOKEN_YID_MAX_VOLUME_U_S_D_ASC',
  PoolsByTokenYidMaxVolumeUSDDesc = 'POOLS_BY_TOKEN_YID_MAX_VOLUME_U_S_D_DESC',
  PoolsByTokenYidMinBlockRangeAsc = 'POOLS_BY_TOKEN_YID_MIN_BLOCK_RANGE_ASC',
  PoolsByTokenYidMinBlockRangeDesc = 'POOLS_BY_TOKEN_YID_MIN_BLOCK_RANGE_DESC',
  PoolsByTokenYidMinCollectedFeesTokenXAsc = 'POOLS_BY_TOKEN_YID_MIN_COLLECTED_FEES_TOKEN_X_ASC',
  PoolsByTokenYidMinCollectedFeesTokenXDesc = 'POOLS_BY_TOKEN_YID_MIN_COLLECTED_FEES_TOKEN_X_DESC',
  PoolsByTokenYidMinCollectedFeesTokenYAsc = 'POOLS_BY_TOKEN_YID_MIN_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolsByTokenYidMinCollectedFeesTokenYDesc = 'POOLS_BY_TOKEN_YID_MIN_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolsByTokenYidMinCollectedFeesUSDAsc = 'POOLS_BY_TOKEN_YID_MIN_COLLECTED_FEES_U_S_D_ASC',
  PoolsByTokenYidMinCollectedFeesUSDDesc = 'POOLS_BY_TOKEN_YID_MIN_COLLECTED_FEES_U_S_D_DESC',
  PoolsByTokenYidMinCreatedAtAsc = 'POOLS_BY_TOKEN_YID_MIN_CREATED_AT_ASC',
  PoolsByTokenYidMinCreatedAtBlockNumberAsc = 'POOLS_BY_TOKEN_YID_MIN_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolsByTokenYidMinCreatedAtBlockNumberDesc = 'POOLS_BY_TOKEN_YID_MIN_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolsByTokenYidMinCreatedAtDesc = 'POOLS_BY_TOKEN_YID_MIN_CREATED_AT_DESC',
  PoolsByTokenYidMinCurrentTickAsc = 'POOLS_BY_TOKEN_YID_MIN_CURRENT_TICK_ASC',
  PoolsByTokenYidMinCurrentTickDesc = 'POOLS_BY_TOKEN_YID_MIN_CURRENT_TICK_DESC',
  PoolsByTokenYidMinFeesUSDAsc = 'POOLS_BY_TOKEN_YID_MIN_FEES_U_S_D_ASC',
  PoolsByTokenYidMinFeesUSDDesc = 'POOLS_BY_TOKEN_YID_MIN_FEES_U_S_D_DESC',
  PoolsByTokenYidMinFeeAsc = 'POOLS_BY_TOKEN_YID_MIN_FEE_ASC',
  PoolsByTokenYidMinFeeDesc = 'POOLS_BY_TOKEN_YID_MIN_FEE_DESC',
  PoolsByTokenYidMinIdAsc = 'POOLS_BY_TOKEN_YID_MIN_ID_ASC',
  PoolsByTokenYidMinIdDesc = 'POOLS_BY_TOKEN_YID_MIN_ID_DESC',
  PoolsByTokenYidMinLiquidityAsc = 'POOLS_BY_TOKEN_YID_MIN_LIQUIDITY_ASC',
  PoolsByTokenYidMinLiquidityDesc = 'POOLS_BY_TOKEN_YID_MIN_LIQUIDITY_DESC',
  PoolsByTokenYidMinPoolCreatorIdAsc = 'POOLS_BY_TOKEN_YID_MIN_POOL_CREATOR_ID_ASC',
  PoolsByTokenYidMinPoolCreatorIdDesc = 'POOLS_BY_TOKEN_YID_MIN_POOL_CREATOR_ID_DESC',
  PoolsByTokenYidMinSqrtPriceAsc = 'POOLS_BY_TOKEN_YID_MIN_SQRT_PRICE_ASC',
  PoolsByTokenYidMinSqrtPriceDesc = 'POOLS_BY_TOKEN_YID_MIN_SQRT_PRICE_DESC',
  PoolsByTokenYidMinTickSpacingAsc = 'POOLS_BY_TOKEN_YID_MIN_TICK_SPACING_ASC',
  PoolsByTokenYidMinTickSpacingDesc = 'POOLS_BY_TOKEN_YID_MIN_TICK_SPACING_DESC',
  PoolsByTokenYidMinTokenXIdAsc = 'POOLS_BY_TOKEN_YID_MIN_TOKEN_X_ID_ASC',
  PoolsByTokenYidMinTokenXIdDesc = 'POOLS_BY_TOKEN_YID_MIN_TOKEN_X_ID_DESC',
  PoolsByTokenYidMinTokenYIdAsc = 'POOLS_BY_TOKEN_YID_MIN_TOKEN_Y_ID_ASC',
  PoolsByTokenYidMinTokenYIdDesc = 'POOLS_BY_TOKEN_YID_MIN_TOKEN_Y_ID_DESC',
  PoolsByTokenYidMinTotalValueLockedTokenXAsc = 'POOLS_BY_TOKEN_YID_MIN_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolsByTokenYidMinTotalValueLockedTokenXDesc = 'POOLS_BY_TOKEN_YID_MIN_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolsByTokenYidMinTotalValueLockedTokenYAsc = 'POOLS_BY_TOKEN_YID_MIN_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolsByTokenYidMinTotalValueLockedTokenYDesc = 'POOLS_BY_TOKEN_YID_MIN_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolsByTokenYidMinTotalValueLockedUSDAsc = 'POOLS_BY_TOKEN_YID_MIN_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolsByTokenYidMinTotalValueLockedUSDDesc = 'POOLS_BY_TOKEN_YID_MIN_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolsByTokenYidMinTransactionIdAsc = 'POOLS_BY_TOKEN_YID_MIN_TRANSACTION_ID_ASC',
  PoolsByTokenYidMinTransactionIdDesc = 'POOLS_BY_TOKEN_YID_MIN_TRANSACTION_ID_DESC',
  PoolsByTokenYidMinTxCountAsc = 'POOLS_BY_TOKEN_YID_MIN_TX_COUNT_ASC',
  PoolsByTokenYidMinTxCountDesc = 'POOLS_BY_TOKEN_YID_MIN_TX_COUNT_DESC',
  PoolsByTokenYidMinUpdatedAtAsc = 'POOLS_BY_TOKEN_YID_MIN_UPDATED_AT_ASC',
  PoolsByTokenYidMinUpdatedAtDesc = 'POOLS_BY_TOKEN_YID_MIN_UPDATED_AT_DESC',
  PoolsByTokenYidMinVolumeTokenXAsc = 'POOLS_BY_TOKEN_YID_MIN_VOLUME_TOKEN_X_ASC',
  PoolsByTokenYidMinVolumeTokenXDesc = 'POOLS_BY_TOKEN_YID_MIN_VOLUME_TOKEN_X_DESC',
  PoolsByTokenYidMinVolumeTokenYAsc = 'POOLS_BY_TOKEN_YID_MIN_VOLUME_TOKEN_Y_ASC',
  PoolsByTokenYidMinVolumeTokenYDesc = 'POOLS_BY_TOKEN_YID_MIN_VOLUME_TOKEN_Y_DESC',
  PoolsByTokenYidMinVolumeUSDAsc = 'POOLS_BY_TOKEN_YID_MIN_VOLUME_U_S_D_ASC',
  PoolsByTokenYidMinVolumeUSDDesc = 'POOLS_BY_TOKEN_YID_MIN_VOLUME_U_S_D_DESC',
  PoolsByTokenYidStddevPopulationBlockRangeAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  PoolsByTokenYidStddevPopulationBlockRangeDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  PoolsByTokenYidStddevPopulationCollectedFeesTokenXAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_COLLECTED_FEES_TOKEN_X_ASC',
  PoolsByTokenYidStddevPopulationCollectedFeesTokenXDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_COLLECTED_FEES_TOKEN_X_DESC',
  PoolsByTokenYidStddevPopulationCollectedFeesTokenYAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolsByTokenYidStddevPopulationCollectedFeesTokenYDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolsByTokenYidStddevPopulationCollectedFeesUSDAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_COLLECTED_FEES_U_S_D_ASC',
  PoolsByTokenYidStddevPopulationCollectedFeesUSDDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_COLLECTED_FEES_U_S_D_DESC',
  PoolsByTokenYidStddevPopulationCreatedAtAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_CREATED_AT_ASC',
  PoolsByTokenYidStddevPopulationCreatedAtBlockNumberAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolsByTokenYidStddevPopulationCreatedAtBlockNumberDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolsByTokenYidStddevPopulationCreatedAtDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_CREATED_AT_DESC',
  PoolsByTokenYidStddevPopulationCurrentTickAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_CURRENT_TICK_ASC',
  PoolsByTokenYidStddevPopulationCurrentTickDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_CURRENT_TICK_DESC',
  PoolsByTokenYidStddevPopulationFeesUSDAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_FEES_U_S_D_ASC',
  PoolsByTokenYidStddevPopulationFeesUSDDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_FEES_U_S_D_DESC',
  PoolsByTokenYidStddevPopulationFeeAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_FEE_ASC',
  PoolsByTokenYidStddevPopulationFeeDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_FEE_DESC',
  PoolsByTokenYidStddevPopulationIdAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_ID_ASC',
  PoolsByTokenYidStddevPopulationIdDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_ID_DESC',
  PoolsByTokenYidStddevPopulationLiquidityAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_LIQUIDITY_ASC',
  PoolsByTokenYidStddevPopulationLiquidityDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_LIQUIDITY_DESC',
  PoolsByTokenYidStddevPopulationPoolCreatorIdAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_POOL_CREATOR_ID_ASC',
  PoolsByTokenYidStddevPopulationPoolCreatorIdDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_POOL_CREATOR_ID_DESC',
  PoolsByTokenYidStddevPopulationSqrtPriceAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_SQRT_PRICE_ASC',
  PoolsByTokenYidStddevPopulationSqrtPriceDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_SQRT_PRICE_DESC',
  PoolsByTokenYidStddevPopulationTickSpacingAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_TICK_SPACING_ASC',
  PoolsByTokenYidStddevPopulationTickSpacingDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_TICK_SPACING_DESC',
  PoolsByTokenYidStddevPopulationTokenXIdAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_TOKEN_X_ID_ASC',
  PoolsByTokenYidStddevPopulationTokenXIdDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_TOKEN_X_ID_DESC',
  PoolsByTokenYidStddevPopulationTokenYIdAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_TOKEN_Y_ID_ASC',
  PoolsByTokenYidStddevPopulationTokenYIdDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_TOKEN_Y_ID_DESC',
  PoolsByTokenYidStddevPopulationTotalValueLockedTokenXAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolsByTokenYidStddevPopulationTotalValueLockedTokenXDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolsByTokenYidStddevPopulationTotalValueLockedTokenYAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolsByTokenYidStddevPopulationTotalValueLockedTokenYDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolsByTokenYidStddevPopulationTotalValueLockedUSDAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolsByTokenYidStddevPopulationTotalValueLockedUSDDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolsByTokenYidStddevPopulationTransactionIdAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_TRANSACTION_ID_ASC',
  PoolsByTokenYidStddevPopulationTransactionIdDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_TRANSACTION_ID_DESC',
  PoolsByTokenYidStddevPopulationTxCountAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_TX_COUNT_ASC',
  PoolsByTokenYidStddevPopulationTxCountDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_TX_COUNT_DESC',
  PoolsByTokenYidStddevPopulationUpdatedAtAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_UPDATED_AT_ASC',
  PoolsByTokenYidStddevPopulationUpdatedAtDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_UPDATED_AT_DESC',
  PoolsByTokenYidStddevPopulationVolumeTokenXAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_VOLUME_TOKEN_X_ASC',
  PoolsByTokenYidStddevPopulationVolumeTokenXDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_VOLUME_TOKEN_X_DESC',
  PoolsByTokenYidStddevPopulationVolumeTokenYAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_VOLUME_TOKEN_Y_ASC',
  PoolsByTokenYidStddevPopulationVolumeTokenYDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_VOLUME_TOKEN_Y_DESC',
  PoolsByTokenYidStddevPopulationVolumeUSDAsc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_VOLUME_U_S_D_ASC',
  PoolsByTokenYidStddevPopulationVolumeUSDDesc = 'POOLS_BY_TOKEN_YID_STDDEV_POPULATION_VOLUME_U_S_D_DESC',
  PoolsByTokenYidStddevSampleBlockRangeAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  PoolsByTokenYidStddevSampleBlockRangeDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  PoolsByTokenYidStddevSampleCollectedFeesTokenXAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_COLLECTED_FEES_TOKEN_X_ASC',
  PoolsByTokenYidStddevSampleCollectedFeesTokenXDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_COLLECTED_FEES_TOKEN_X_DESC',
  PoolsByTokenYidStddevSampleCollectedFeesTokenYAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolsByTokenYidStddevSampleCollectedFeesTokenYDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolsByTokenYidStddevSampleCollectedFeesUSDAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_COLLECTED_FEES_U_S_D_ASC',
  PoolsByTokenYidStddevSampleCollectedFeesUSDDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_COLLECTED_FEES_U_S_D_DESC',
  PoolsByTokenYidStddevSampleCreatedAtAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_CREATED_AT_ASC',
  PoolsByTokenYidStddevSampleCreatedAtBlockNumberAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolsByTokenYidStddevSampleCreatedAtBlockNumberDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolsByTokenYidStddevSampleCreatedAtDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_CREATED_AT_DESC',
  PoolsByTokenYidStddevSampleCurrentTickAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_CURRENT_TICK_ASC',
  PoolsByTokenYidStddevSampleCurrentTickDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_CURRENT_TICK_DESC',
  PoolsByTokenYidStddevSampleFeesUSDAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_FEES_U_S_D_ASC',
  PoolsByTokenYidStddevSampleFeesUSDDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_FEES_U_S_D_DESC',
  PoolsByTokenYidStddevSampleFeeAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_FEE_ASC',
  PoolsByTokenYidStddevSampleFeeDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_FEE_DESC',
  PoolsByTokenYidStddevSampleIdAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_ID_ASC',
  PoolsByTokenYidStddevSampleIdDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_ID_DESC',
  PoolsByTokenYidStddevSampleLiquidityAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_LIQUIDITY_ASC',
  PoolsByTokenYidStddevSampleLiquidityDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_LIQUIDITY_DESC',
  PoolsByTokenYidStddevSamplePoolCreatorIdAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_POOL_CREATOR_ID_ASC',
  PoolsByTokenYidStddevSamplePoolCreatorIdDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_POOL_CREATOR_ID_DESC',
  PoolsByTokenYidStddevSampleSqrtPriceAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_SQRT_PRICE_ASC',
  PoolsByTokenYidStddevSampleSqrtPriceDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_SQRT_PRICE_DESC',
  PoolsByTokenYidStddevSampleTickSpacingAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_TICK_SPACING_ASC',
  PoolsByTokenYidStddevSampleTickSpacingDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_TICK_SPACING_DESC',
  PoolsByTokenYidStddevSampleTokenXIdAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_TOKEN_X_ID_ASC',
  PoolsByTokenYidStddevSampleTokenXIdDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_TOKEN_X_ID_DESC',
  PoolsByTokenYidStddevSampleTokenYIdAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_TOKEN_Y_ID_ASC',
  PoolsByTokenYidStddevSampleTokenYIdDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_TOKEN_Y_ID_DESC',
  PoolsByTokenYidStddevSampleTotalValueLockedTokenXAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolsByTokenYidStddevSampleTotalValueLockedTokenXDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolsByTokenYidStddevSampleTotalValueLockedTokenYAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolsByTokenYidStddevSampleTotalValueLockedTokenYDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolsByTokenYidStddevSampleTotalValueLockedUSDAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolsByTokenYidStddevSampleTotalValueLockedUSDDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolsByTokenYidStddevSampleTransactionIdAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_TRANSACTION_ID_ASC',
  PoolsByTokenYidStddevSampleTransactionIdDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_TRANSACTION_ID_DESC',
  PoolsByTokenYidStddevSampleTxCountAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_TX_COUNT_ASC',
  PoolsByTokenYidStddevSampleTxCountDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_TX_COUNT_DESC',
  PoolsByTokenYidStddevSampleUpdatedAtAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_UPDATED_AT_ASC',
  PoolsByTokenYidStddevSampleUpdatedAtDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_UPDATED_AT_DESC',
  PoolsByTokenYidStddevSampleVolumeTokenXAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_VOLUME_TOKEN_X_ASC',
  PoolsByTokenYidStddevSampleVolumeTokenXDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_VOLUME_TOKEN_X_DESC',
  PoolsByTokenYidStddevSampleVolumeTokenYAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_VOLUME_TOKEN_Y_ASC',
  PoolsByTokenYidStddevSampleVolumeTokenYDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_VOLUME_TOKEN_Y_DESC',
  PoolsByTokenYidStddevSampleVolumeUSDAsc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_VOLUME_U_S_D_ASC',
  PoolsByTokenYidStddevSampleVolumeUSDDesc = 'POOLS_BY_TOKEN_YID_STDDEV_SAMPLE_VOLUME_U_S_D_DESC',
  PoolsByTokenYidSumBlockRangeAsc = 'POOLS_BY_TOKEN_YID_SUM_BLOCK_RANGE_ASC',
  PoolsByTokenYidSumBlockRangeDesc = 'POOLS_BY_TOKEN_YID_SUM_BLOCK_RANGE_DESC',
  PoolsByTokenYidSumCollectedFeesTokenXAsc = 'POOLS_BY_TOKEN_YID_SUM_COLLECTED_FEES_TOKEN_X_ASC',
  PoolsByTokenYidSumCollectedFeesTokenXDesc = 'POOLS_BY_TOKEN_YID_SUM_COLLECTED_FEES_TOKEN_X_DESC',
  PoolsByTokenYidSumCollectedFeesTokenYAsc = 'POOLS_BY_TOKEN_YID_SUM_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolsByTokenYidSumCollectedFeesTokenYDesc = 'POOLS_BY_TOKEN_YID_SUM_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolsByTokenYidSumCollectedFeesUSDAsc = 'POOLS_BY_TOKEN_YID_SUM_COLLECTED_FEES_U_S_D_ASC',
  PoolsByTokenYidSumCollectedFeesUSDDesc = 'POOLS_BY_TOKEN_YID_SUM_COLLECTED_FEES_U_S_D_DESC',
  PoolsByTokenYidSumCreatedAtAsc = 'POOLS_BY_TOKEN_YID_SUM_CREATED_AT_ASC',
  PoolsByTokenYidSumCreatedAtBlockNumberAsc = 'POOLS_BY_TOKEN_YID_SUM_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolsByTokenYidSumCreatedAtBlockNumberDesc = 'POOLS_BY_TOKEN_YID_SUM_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolsByTokenYidSumCreatedAtDesc = 'POOLS_BY_TOKEN_YID_SUM_CREATED_AT_DESC',
  PoolsByTokenYidSumCurrentTickAsc = 'POOLS_BY_TOKEN_YID_SUM_CURRENT_TICK_ASC',
  PoolsByTokenYidSumCurrentTickDesc = 'POOLS_BY_TOKEN_YID_SUM_CURRENT_TICK_DESC',
  PoolsByTokenYidSumFeesUSDAsc = 'POOLS_BY_TOKEN_YID_SUM_FEES_U_S_D_ASC',
  PoolsByTokenYidSumFeesUSDDesc = 'POOLS_BY_TOKEN_YID_SUM_FEES_U_S_D_DESC',
  PoolsByTokenYidSumFeeAsc = 'POOLS_BY_TOKEN_YID_SUM_FEE_ASC',
  PoolsByTokenYidSumFeeDesc = 'POOLS_BY_TOKEN_YID_SUM_FEE_DESC',
  PoolsByTokenYidSumIdAsc = 'POOLS_BY_TOKEN_YID_SUM_ID_ASC',
  PoolsByTokenYidSumIdDesc = 'POOLS_BY_TOKEN_YID_SUM_ID_DESC',
  PoolsByTokenYidSumLiquidityAsc = 'POOLS_BY_TOKEN_YID_SUM_LIQUIDITY_ASC',
  PoolsByTokenYidSumLiquidityDesc = 'POOLS_BY_TOKEN_YID_SUM_LIQUIDITY_DESC',
  PoolsByTokenYidSumPoolCreatorIdAsc = 'POOLS_BY_TOKEN_YID_SUM_POOL_CREATOR_ID_ASC',
  PoolsByTokenYidSumPoolCreatorIdDesc = 'POOLS_BY_TOKEN_YID_SUM_POOL_CREATOR_ID_DESC',
  PoolsByTokenYidSumSqrtPriceAsc = 'POOLS_BY_TOKEN_YID_SUM_SQRT_PRICE_ASC',
  PoolsByTokenYidSumSqrtPriceDesc = 'POOLS_BY_TOKEN_YID_SUM_SQRT_PRICE_DESC',
  PoolsByTokenYidSumTickSpacingAsc = 'POOLS_BY_TOKEN_YID_SUM_TICK_SPACING_ASC',
  PoolsByTokenYidSumTickSpacingDesc = 'POOLS_BY_TOKEN_YID_SUM_TICK_SPACING_DESC',
  PoolsByTokenYidSumTokenXIdAsc = 'POOLS_BY_TOKEN_YID_SUM_TOKEN_X_ID_ASC',
  PoolsByTokenYidSumTokenXIdDesc = 'POOLS_BY_TOKEN_YID_SUM_TOKEN_X_ID_DESC',
  PoolsByTokenYidSumTokenYIdAsc = 'POOLS_BY_TOKEN_YID_SUM_TOKEN_Y_ID_ASC',
  PoolsByTokenYidSumTokenYIdDesc = 'POOLS_BY_TOKEN_YID_SUM_TOKEN_Y_ID_DESC',
  PoolsByTokenYidSumTotalValueLockedTokenXAsc = 'POOLS_BY_TOKEN_YID_SUM_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolsByTokenYidSumTotalValueLockedTokenXDesc = 'POOLS_BY_TOKEN_YID_SUM_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolsByTokenYidSumTotalValueLockedTokenYAsc = 'POOLS_BY_TOKEN_YID_SUM_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolsByTokenYidSumTotalValueLockedTokenYDesc = 'POOLS_BY_TOKEN_YID_SUM_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolsByTokenYidSumTotalValueLockedUSDAsc = 'POOLS_BY_TOKEN_YID_SUM_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolsByTokenYidSumTotalValueLockedUSDDesc = 'POOLS_BY_TOKEN_YID_SUM_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolsByTokenYidSumTransactionIdAsc = 'POOLS_BY_TOKEN_YID_SUM_TRANSACTION_ID_ASC',
  PoolsByTokenYidSumTransactionIdDesc = 'POOLS_BY_TOKEN_YID_SUM_TRANSACTION_ID_DESC',
  PoolsByTokenYidSumTxCountAsc = 'POOLS_BY_TOKEN_YID_SUM_TX_COUNT_ASC',
  PoolsByTokenYidSumTxCountDesc = 'POOLS_BY_TOKEN_YID_SUM_TX_COUNT_DESC',
  PoolsByTokenYidSumUpdatedAtAsc = 'POOLS_BY_TOKEN_YID_SUM_UPDATED_AT_ASC',
  PoolsByTokenYidSumUpdatedAtDesc = 'POOLS_BY_TOKEN_YID_SUM_UPDATED_AT_DESC',
  PoolsByTokenYidSumVolumeTokenXAsc = 'POOLS_BY_TOKEN_YID_SUM_VOLUME_TOKEN_X_ASC',
  PoolsByTokenYidSumVolumeTokenXDesc = 'POOLS_BY_TOKEN_YID_SUM_VOLUME_TOKEN_X_DESC',
  PoolsByTokenYidSumVolumeTokenYAsc = 'POOLS_BY_TOKEN_YID_SUM_VOLUME_TOKEN_Y_ASC',
  PoolsByTokenYidSumVolumeTokenYDesc = 'POOLS_BY_TOKEN_YID_SUM_VOLUME_TOKEN_Y_DESC',
  PoolsByTokenYidSumVolumeUSDAsc = 'POOLS_BY_TOKEN_YID_SUM_VOLUME_U_S_D_ASC',
  PoolsByTokenYidSumVolumeUSDDesc = 'POOLS_BY_TOKEN_YID_SUM_VOLUME_U_S_D_DESC',
  PoolsByTokenYidVariancePopulationBlockRangeAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  PoolsByTokenYidVariancePopulationBlockRangeDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  PoolsByTokenYidVariancePopulationCollectedFeesTokenXAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_COLLECTED_FEES_TOKEN_X_ASC',
  PoolsByTokenYidVariancePopulationCollectedFeesTokenXDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_COLLECTED_FEES_TOKEN_X_DESC',
  PoolsByTokenYidVariancePopulationCollectedFeesTokenYAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolsByTokenYidVariancePopulationCollectedFeesTokenYDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolsByTokenYidVariancePopulationCollectedFeesUSDAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_COLLECTED_FEES_U_S_D_ASC',
  PoolsByTokenYidVariancePopulationCollectedFeesUSDDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_COLLECTED_FEES_U_S_D_DESC',
  PoolsByTokenYidVariancePopulationCreatedAtAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_CREATED_AT_ASC',
  PoolsByTokenYidVariancePopulationCreatedAtBlockNumberAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolsByTokenYidVariancePopulationCreatedAtBlockNumberDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolsByTokenYidVariancePopulationCreatedAtDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_CREATED_AT_DESC',
  PoolsByTokenYidVariancePopulationCurrentTickAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_CURRENT_TICK_ASC',
  PoolsByTokenYidVariancePopulationCurrentTickDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_CURRENT_TICK_DESC',
  PoolsByTokenYidVariancePopulationFeesUSDAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_FEES_U_S_D_ASC',
  PoolsByTokenYidVariancePopulationFeesUSDDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_FEES_U_S_D_DESC',
  PoolsByTokenYidVariancePopulationFeeAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_FEE_ASC',
  PoolsByTokenYidVariancePopulationFeeDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_FEE_DESC',
  PoolsByTokenYidVariancePopulationIdAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_ID_ASC',
  PoolsByTokenYidVariancePopulationIdDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_ID_DESC',
  PoolsByTokenYidVariancePopulationLiquidityAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_LIQUIDITY_ASC',
  PoolsByTokenYidVariancePopulationLiquidityDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_LIQUIDITY_DESC',
  PoolsByTokenYidVariancePopulationPoolCreatorIdAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_POOL_CREATOR_ID_ASC',
  PoolsByTokenYidVariancePopulationPoolCreatorIdDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_POOL_CREATOR_ID_DESC',
  PoolsByTokenYidVariancePopulationSqrtPriceAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_SQRT_PRICE_ASC',
  PoolsByTokenYidVariancePopulationSqrtPriceDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_SQRT_PRICE_DESC',
  PoolsByTokenYidVariancePopulationTickSpacingAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_TICK_SPACING_ASC',
  PoolsByTokenYidVariancePopulationTickSpacingDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_TICK_SPACING_DESC',
  PoolsByTokenYidVariancePopulationTokenXIdAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_TOKEN_X_ID_ASC',
  PoolsByTokenYidVariancePopulationTokenXIdDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_TOKEN_X_ID_DESC',
  PoolsByTokenYidVariancePopulationTokenYIdAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_TOKEN_Y_ID_ASC',
  PoolsByTokenYidVariancePopulationTokenYIdDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_TOKEN_Y_ID_DESC',
  PoolsByTokenYidVariancePopulationTotalValueLockedTokenXAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolsByTokenYidVariancePopulationTotalValueLockedTokenXDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolsByTokenYidVariancePopulationTotalValueLockedTokenYAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolsByTokenYidVariancePopulationTotalValueLockedTokenYDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolsByTokenYidVariancePopulationTotalValueLockedUSDAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolsByTokenYidVariancePopulationTotalValueLockedUSDDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolsByTokenYidVariancePopulationTransactionIdAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_TRANSACTION_ID_ASC',
  PoolsByTokenYidVariancePopulationTransactionIdDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_TRANSACTION_ID_DESC',
  PoolsByTokenYidVariancePopulationTxCountAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_TX_COUNT_ASC',
  PoolsByTokenYidVariancePopulationTxCountDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_TX_COUNT_DESC',
  PoolsByTokenYidVariancePopulationUpdatedAtAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_UPDATED_AT_ASC',
  PoolsByTokenYidVariancePopulationUpdatedAtDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_UPDATED_AT_DESC',
  PoolsByTokenYidVariancePopulationVolumeTokenXAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_VOLUME_TOKEN_X_ASC',
  PoolsByTokenYidVariancePopulationVolumeTokenXDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_VOLUME_TOKEN_X_DESC',
  PoolsByTokenYidVariancePopulationVolumeTokenYAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_VOLUME_TOKEN_Y_ASC',
  PoolsByTokenYidVariancePopulationVolumeTokenYDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_VOLUME_TOKEN_Y_DESC',
  PoolsByTokenYidVariancePopulationVolumeUSDAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_VOLUME_U_S_D_ASC',
  PoolsByTokenYidVariancePopulationVolumeUSDDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_POPULATION_VOLUME_U_S_D_DESC',
  PoolsByTokenYidVarianceSampleBlockRangeAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  PoolsByTokenYidVarianceSampleBlockRangeDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  PoolsByTokenYidVarianceSampleCollectedFeesTokenXAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_COLLECTED_FEES_TOKEN_X_ASC',
  PoolsByTokenYidVarianceSampleCollectedFeesTokenXDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_COLLECTED_FEES_TOKEN_X_DESC',
  PoolsByTokenYidVarianceSampleCollectedFeesTokenYAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolsByTokenYidVarianceSampleCollectedFeesTokenYDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolsByTokenYidVarianceSampleCollectedFeesUSDAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_COLLECTED_FEES_U_S_D_ASC',
  PoolsByTokenYidVarianceSampleCollectedFeesUSDDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_COLLECTED_FEES_U_S_D_DESC',
  PoolsByTokenYidVarianceSampleCreatedAtAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_CREATED_AT_ASC',
  PoolsByTokenYidVarianceSampleCreatedAtBlockNumberAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolsByTokenYidVarianceSampleCreatedAtBlockNumberDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolsByTokenYidVarianceSampleCreatedAtDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_CREATED_AT_DESC',
  PoolsByTokenYidVarianceSampleCurrentTickAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_CURRENT_TICK_ASC',
  PoolsByTokenYidVarianceSampleCurrentTickDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_CURRENT_TICK_DESC',
  PoolsByTokenYidVarianceSampleFeesUSDAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_FEES_U_S_D_ASC',
  PoolsByTokenYidVarianceSampleFeesUSDDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_FEES_U_S_D_DESC',
  PoolsByTokenYidVarianceSampleFeeAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_FEE_ASC',
  PoolsByTokenYidVarianceSampleFeeDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_FEE_DESC',
  PoolsByTokenYidVarianceSampleIdAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_ID_ASC',
  PoolsByTokenYidVarianceSampleIdDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_ID_DESC',
  PoolsByTokenYidVarianceSampleLiquidityAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_LIQUIDITY_ASC',
  PoolsByTokenYidVarianceSampleLiquidityDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_LIQUIDITY_DESC',
  PoolsByTokenYidVarianceSamplePoolCreatorIdAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_POOL_CREATOR_ID_ASC',
  PoolsByTokenYidVarianceSamplePoolCreatorIdDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_POOL_CREATOR_ID_DESC',
  PoolsByTokenYidVarianceSampleSqrtPriceAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_SQRT_PRICE_ASC',
  PoolsByTokenYidVarianceSampleSqrtPriceDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_SQRT_PRICE_DESC',
  PoolsByTokenYidVarianceSampleTickSpacingAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_TICK_SPACING_ASC',
  PoolsByTokenYidVarianceSampleTickSpacingDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_TICK_SPACING_DESC',
  PoolsByTokenYidVarianceSampleTokenXIdAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_TOKEN_X_ID_ASC',
  PoolsByTokenYidVarianceSampleTokenXIdDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_TOKEN_X_ID_DESC',
  PoolsByTokenYidVarianceSampleTokenYIdAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_TOKEN_Y_ID_ASC',
  PoolsByTokenYidVarianceSampleTokenYIdDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_TOKEN_Y_ID_DESC',
  PoolsByTokenYidVarianceSampleTotalValueLockedTokenXAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolsByTokenYidVarianceSampleTotalValueLockedTokenXDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolsByTokenYidVarianceSampleTotalValueLockedTokenYAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolsByTokenYidVarianceSampleTotalValueLockedTokenYDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolsByTokenYidVarianceSampleTotalValueLockedUSDAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolsByTokenYidVarianceSampleTotalValueLockedUSDDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolsByTokenYidVarianceSampleTransactionIdAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_TRANSACTION_ID_ASC',
  PoolsByTokenYidVarianceSampleTransactionIdDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_TRANSACTION_ID_DESC',
  PoolsByTokenYidVarianceSampleTxCountAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_TX_COUNT_ASC',
  PoolsByTokenYidVarianceSampleTxCountDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_TX_COUNT_DESC',
  PoolsByTokenYidVarianceSampleUpdatedAtAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_UPDATED_AT_ASC',
  PoolsByTokenYidVarianceSampleUpdatedAtDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_UPDATED_AT_DESC',
  PoolsByTokenYidVarianceSampleVolumeTokenXAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_VOLUME_TOKEN_X_ASC',
  PoolsByTokenYidVarianceSampleVolumeTokenXDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_VOLUME_TOKEN_X_DESC',
  PoolsByTokenYidVarianceSampleVolumeTokenYAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_VOLUME_TOKEN_Y_ASC',
  PoolsByTokenYidVarianceSampleVolumeTokenYDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_VOLUME_TOKEN_Y_DESC',
  PoolsByTokenYidVarianceSampleVolumeUSDAsc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_VOLUME_U_S_D_ASC',
  PoolsByTokenYidVarianceSampleVolumeUSDDesc = 'POOLS_BY_TOKEN_YID_VARIANCE_SAMPLE_VOLUME_U_S_D_DESC',
  PoolTokenIncentivesAverageBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_BLOCK_RANGE_ASC',
  PoolTokenIncentivesAverageBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_BLOCK_RANGE_DESC',
  PoolTokenIncentivesAverageIdAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_ID_ASC',
  PoolTokenIncentivesAverageIdDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_ID_DESC',
  PoolTokenIncentivesAverageIndexAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_INDEX_ASC',
  PoolTokenIncentivesAverageIndexDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_INDEX_DESC',
  PoolTokenIncentivesAveragePoolIdAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_POOL_ID_ASC',
  PoolTokenIncentivesAveragePoolIdDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_POOL_ID_DESC',
  PoolTokenIncentivesAverageRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesAverageRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesAverageStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_START_TIMESTAMP_ASC',
  PoolTokenIncentivesAverageStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_START_TIMESTAMP_DESC',
  PoolTokenIncentivesAverageTokenIdAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_TOKEN_ID_ASC',
  PoolTokenIncentivesAverageTokenIdDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_TOKEN_ID_DESC',
  PoolTokenIncentivesAverageTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_TOTAL_REWARD_ASC',
  PoolTokenIncentivesAverageTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_TOTAL_REWARD_DESC',
  PoolTokenIncentivesAverageTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_TRANSACTION_ID_ASC',
  PoolTokenIncentivesAverageTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_TRANSACTION_ID_DESC',
  PoolTokenIncentivesCountAsc = 'POOL_TOKEN_INCENTIVES_COUNT_ASC',
  PoolTokenIncentivesCountDesc = 'POOL_TOKEN_INCENTIVES_COUNT_DESC',
  PoolTokenIncentivesDistinctCountBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  PoolTokenIncentivesDistinctCountBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  PoolTokenIncentivesDistinctCountIdAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_ID_ASC',
  PoolTokenIncentivesDistinctCountIdDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_ID_DESC',
  PoolTokenIncentivesDistinctCountIndexAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_INDEX_ASC',
  PoolTokenIncentivesDistinctCountIndexDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_INDEX_DESC',
  PoolTokenIncentivesDistinctCountPoolIdAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_POOL_ID_ASC',
  PoolTokenIncentivesDistinctCountPoolIdDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_POOL_ID_DESC',
  PoolTokenIncentivesDistinctCountRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesDistinctCountRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesDistinctCountStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_START_TIMESTAMP_ASC',
  PoolTokenIncentivesDistinctCountStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_START_TIMESTAMP_DESC',
  PoolTokenIncentivesDistinctCountTokenIdAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_TOKEN_ID_ASC',
  PoolTokenIncentivesDistinctCountTokenIdDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_TOKEN_ID_DESC',
  PoolTokenIncentivesDistinctCountTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_TOTAL_REWARD_ASC',
  PoolTokenIncentivesDistinctCountTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_TOTAL_REWARD_DESC',
  PoolTokenIncentivesDistinctCountTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_TRANSACTION_ID_ASC',
  PoolTokenIncentivesDistinctCountTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_TRANSACTION_ID_DESC',
  PoolTokenIncentivesMaxBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_MAX_BLOCK_RANGE_ASC',
  PoolTokenIncentivesMaxBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_MAX_BLOCK_RANGE_DESC',
  PoolTokenIncentivesMaxIdAsc = 'POOL_TOKEN_INCENTIVES_MAX_ID_ASC',
  PoolTokenIncentivesMaxIdDesc = 'POOL_TOKEN_INCENTIVES_MAX_ID_DESC',
  PoolTokenIncentivesMaxIndexAsc = 'POOL_TOKEN_INCENTIVES_MAX_INDEX_ASC',
  PoolTokenIncentivesMaxIndexDesc = 'POOL_TOKEN_INCENTIVES_MAX_INDEX_DESC',
  PoolTokenIncentivesMaxPoolIdAsc = 'POOL_TOKEN_INCENTIVES_MAX_POOL_ID_ASC',
  PoolTokenIncentivesMaxPoolIdDesc = 'POOL_TOKEN_INCENTIVES_MAX_POOL_ID_DESC',
  PoolTokenIncentivesMaxRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_MAX_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesMaxRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_MAX_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesMaxStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_MAX_START_TIMESTAMP_ASC',
  PoolTokenIncentivesMaxStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_MAX_START_TIMESTAMP_DESC',
  PoolTokenIncentivesMaxTokenIdAsc = 'POOL_TOKEN_INCENTIVES_MAX_TOKEN_ID_ASC',
  PoolTokenIncentivesMaxTokenIdDesc = 'POOL_TOKEN_INCENTIVES_MAX_TOKEN_ID_DESC',
  PoolTokenIncentivesMaxTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_MAX_TOTAL_REWARD_ASC',
  PoolTokenIncentivesMaxTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_MAX_TOTAL_REWARD_DESC',
  PoolTokenIncentivesMaxTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_MAX_TRANSACTION_ID_ASC',
  PoolTokenIncentivesMaxTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_MAX_TRANSACTION_ID_DESC',
  PoolTokenIncentivesMinBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_MIN_BLOCK_RANGE_ASC',
  PoolTokenIncentivesMinBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_MIN_BLOCK_RANGE_DESC',
  PoolTokenIncentivesMinIdAsc = 'POOL_TOKEN_INCENTIVES_MIN_ID_ASC',
  PoolTokenIncentivesMinIdDesc = 'POOL_TOKEN_INCENTIVES_MIN_ID_DESC',
  PoolTokenIncentivesMinIndexAsc = 'POOL_TOKEN_INCENTIVES_MIN_INDEX_ASC',
  PoolTokenIncentivesMinIndexDesc = 'POOL_TOKEN_INCENTIVES_MIN_INDEX_DESC',
  PoolTokenIncentivesMinPoolIdAsc = 'POOL_TOKEN_INCENTIVES_MIN_POOL_ID_ASC',
  PoolTokenIncentivesMinPoolIdDesc = 'POOL_TOKEN_INCENTIVES_MIN_POOL_ID_DESC',
  PoolTokenIncentivesMinRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_MIN_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesMinRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_MIN_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesMinStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_MIN_START_TIMESTAMP_ASC',
  PoolTokenIncentivesMinStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_MIN_START_TIMESTAMP_DESC',
  PoolTokenIncentivesMinTokenIdAsc = 'POOL_TOKEN_INCENTIVES_MIN_TOKEN_ID_ASC',
  PoolTokenIncentivesMinTokenIdDesc = 'POOL_TOKEN_INCENTIVES_MIN_TOKEN_ID_DESC',
  PoolTokenIncentivesMinTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_MIN_TOTAL_REWARD_ASC',
  PoolTokenIncentivesMinTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_MIN_TOTAL_REWARD_DESC',
  PoolTokenIncentivesMinTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_MIN_TRANSACTION_ID_ASC',
  PoolTokenIncentivesMinTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_MIN_TRANSACTION_ID_DESC',
  PoolTokenIncentivesStddevPopulationBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  PoolTokenIncentivesStddevPopulationBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  PoolTokenIncentivesStddevPopulationIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_ID_ASC',
  PoolTokenIncentivesStddevPopulationIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_ID_DESC',
  PoolTokenIncentivesStddevPopulationIndexAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_INDEX_ASC',
  PoolTokenIncentivesStddevPopulationIndexDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_INDEX_DESC',
  PoolTokenIncentivesStddevPopulationPoolIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_POOL_ID_ASC',
  PoolTokenIncentivesStddevPopulationPoolIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_POOL_ID_DESC',
  PoolTokenIncentivesStddevPopulationRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesStddevPopulationRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesStddevPopulationStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_START_TIMESTAMP_ASC',
  PoolTokenIncentivesStddevPopulationStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_START_TIMESTAMP_DESC',
  PoolTokenIncentivesStddevPopulationTokenIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_TOKEN_ID_ASC',
  PoolTokenIncentivesStddevPopulationTokenIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_TOKEN_ID_DESC',
  PoolTokenIncentivesStddevPopulationTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_TOTAL_REWARD_ASC',
  PoolTokenIncentivesStddevPopulationTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_TOTAL_REWARD_DESC',
  PoolTokenIncentivesStddevPopulationTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_TRANSACTION_ID_ASC',
  PoolTokenIncentivesStddevPopulationTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_TRANSACTION_ID_DESC',
  PoolTokenIncentivesStddevSampleBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  PoolTokenIncentivesStddevSampleBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  PoolTokenIncentivesStddevSampleIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_ID_ASC',
  PoolTokenIncentivesStddevSampleIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_ID_DESC',
  PoolTokenIncentivesStddevSampleIndexAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_INDEX_ASC',
  PoolTokenIncentivesStddevSampleIndexDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_INDEX_DESC',
  PoolTokenIncentivesStddevSamplePoolIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_POOL_ID_ASC',
  PoolTokenIncentivesStddevSamplePoolIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_POOL_ID_DESC',
  PoolTokenIncentivesStddevSampleRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesStddevSampleRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesStddevSampleStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_START_TIMESTAMP_ASC',
  PoolTokenIncentivesStddevSampleStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_START_TIMESTAMP_DESC',
  PoolTokenIncentivesStddevSampleTokenIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_TOKEN_ID_ASC',
  PoolTokenIncentivesStddevSampleTokenIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_TOKEN_ID_DESC',
  PoolTokenIncentivesStddevSampleTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_TOTAL_REWARD_ASC',
  PoolTokenIncentivesStddevSampleTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_TOTAL_REWARD_DESC',
  PoolTokenIncentivesStddevSampleTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_TRANSACTION_ID_ASC',
  PoolTokenIncentivesStddevSampleTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_TRANSACTION_ID_DESC',
  PoolTokenIncentivesSumBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_SUM_BLOCK_RANGE_ASC',
  PoolTokenIncentivesSumBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_SUM_BLOCK_RANGE_DESC',
  PoolTokenIncentivesSumIdAsc = 'POOL_TOKEN_INCENTIVES_SUM_ID_ASC',
  PoolTokenIncentivesSumIdDesc = 'POOL_TOKEN_INCENTIVES_SUM_ID_DESC',
  PoolTokenIncentivesSumIndexAsc = 'POOL_TOKEN_INCENTIVES_SUM_INDEX_ASC',
  PoolTokenIncentivesSumIndexDesc = 'POOL_TOKEN_INCENTIVES_SUM_INDEX_DESC',
  PoolTokenIncentivesSumPoolIdAsc = 'POOL_TOKEN_INCENTIVES_SUM_POOL_ID_ASC',
  PoolTokenIncentivesSumPoolIdDesc = 'POOL_TOKEN_INCENTIVES_SUM_POOL_ID_DESC',
  PoolTokenIncentivesSumRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_SUM_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesSumRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_SUM_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesSumStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_SUM_START_TIMESTAMP_ASC',
  PoolTokenIncentivesSumStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_SUM_START_TIMESTAMP_DESC',
  PoolTokenIncentivesSumTokenIdAsc = 'POOL_TOKEN_INCENTIVES_SUM_TOKEN_ID_ASC',
  PoolTokenIncentivesSumTokenIdDesc = 'POOL_TOKEN_INCENTIVES_SUM_TOKEN_ID_DESC',
  PoolTokenIncentivesSumTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_SUM_TOTAL_REWARD_ASC',
  PoolTokenIncentivesSumTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_SUM_TOTAL_REWARD_DESC',
  PoolTokenIncentivesSumTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_SUM_TRANSACTION_ID_ASC',
  PoolTokenIncentivesSumTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_SUM_TRANSACTION_ID_DESC',
  PoolTokenIncentivesVariancePopulationBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  PoolTokenIncentivesVariancePopulationBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  PoolTokenIncentivesVariancePopulationIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_ID_ASC',
  PoolTokenIncentivesVariancePopulationIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_ID_DESC',
  PoolTokenIncentivesVariancePopulationIndexAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_INDEX_ASC',
  PoolTokenIncentivesVariancePopulationIndexDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_INDEX_DESC',
  PoolTokenIncentivesVariancePopulationPoolIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_POOL_ID_ASC',
  PoolTokenIncentivesVariancePopulationPoolIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_POOL_ID_DESC',
  PoolTokenIncentivesVariancePopulationRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesVariancePopulationRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesVariancePopulationStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_START_TIMESTAMP_ASC',
  PoolTokenIncentivesVariancePopulationStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_START_TIMESTAMP_DESC',
  PoolTokenIncentivesVariancePopulationTokenIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_TOKEN_ID_ASC',
  PoolTokenIncentivesVariancePopulationTokenIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_TOKEN_ID_DESC',
  PoolTokenIncentivesVariancePopulationTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_TOTAL_REWARD_ASC',
  PoolTokenIncentivesVariancePopulationTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_TOTAL_REWARD_DESC',
  PoolTokenIncentivesVariancePopulationTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_TRANSACTION_ID_ASC',
  PoolTokenIncentivesVariancePopulationTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_TRANSACTION_ID_DESC',
  PoolTokenIncentivesVarianceSampleBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  PoolTokenIncentivesVarianceSampleBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  PoolTokenIncentivesVarianceSampleIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_ID_ASC',
  PoolTokenIncentivesVarianceSampleIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_ID_DESC',
  PoolTokenIncentivesVarianceSampleIndexAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_INDEX_ASC',
  PoolTokenIncentivesVarianceSampleIndexDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_INDEX_DESC',
  PoolTokenIncentivesVarianceSamplePoolIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_POOL_ID_ASC',
  PoolTokenIncentivesVarianceSamplePoolIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_POOL_ID_DESC',
  PoolTokenIncentivesVarianceSampleRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesVarianceSampleRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesVarianceSampleStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_START_TIMESTAMP_ASC',
  PoolTokenIncentivesVarianceSampleStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_START_TIMESTAMP_DESC',
  PoolTokenIncentivesVarianceSampleTokenIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_TOKEN_ID_ASC',
  PoolTokenIncentivesVarianceSampleTokenIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_TOKEN_ID_DESC',
  PoolTokenIncentivesVarianceSampleTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_TOTAL_REWARD_ASC',
  PoolTokenIncentivesVarianceSampleTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_TOTAL_REWARD_DESC',
  PoolTokenIncentivesVarianceSampleTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_TRANSACTION_ID_ASC',
  PoolTokenIncentivesVarianceSampleTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_TRANSACTION_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SwapsByTokenInIdAverageAmountInAsc = 'SWAPS_BY_TOKEN_IN_ID_AVERAGE_AMOUNT_IN_ASC',
  SwapsByTokenInIdAverageAmountInDesc = 'SWAPS_BY_TOKEN_IN_ID_AVERAGE_AMOUNT_IN_DESC',
  SwapsByTokenInIdAverageAmountOutAsc = 'SWAPS_BY_TOKEN_IN_ID_AVERAGE_AMOUNT_OUT_ASC',
  SwapsByTokenInIdAverageAmountOutDesc = 'SWAPS_BY_TOKEN_IN_ID_AVERAGE_AMOUNT_OUT_DESC',
  SwapsByTokenInIdAverageBlockRangeAsc = 'SWAPS_BY_TOKEN_IN_ID_AVERAGE_BLOCK_RANGE_ASC',
  SwapsByTokenInIdAverageBlockRangeDesc = 'SWAPS_BY_TOKEN_IN_ID_AVERAGE_BLOCK_RANGE_DESC',
  SwapsByTokenInIdAverageFeeUSDAsc = 'SWAPS_BY_TOKEN_IN_ID_AVERAGE_FEE_U_S_D_ASC',
  SwapsByTokenInIdAverageFeeUSDDesc = 'SWAPS_BY_TOKEN_IN_ID_AVERAGE_FEE_U_S_D_DESC',
  SwapsByTokenInIdAverageIdAsc = 'SWAPS_BY_TOKEN_IN_ID_AVERAGE_ID_ASC',
  SwapsByTokenInIdAverageIdDesc = 'SWAPS_BY_TOKEN_IN_ID_AVERAGE_ID_DESC',
  SwapsByTokenInIdAverageSenderIdAsc = 'SWAPS_BY_TOKEN_IN_ID_AVERAGE_SENDER_ID_ASC',
  SwapsByTokenInIdAverageSenderIdDesc = 'SWAPS_BY_TOKEN_IN_ID_AVERAGE_SENDER_ID_DESC',
  SwapsByTokenInIdAverageTokenInIdAsc = 'SWAPS_BY_TOKEN_IN_ID_AVERAGE_TOKEN_IN_ID_ASC',
  SwapsByTokenInIdAverageTokenInIdDesc = 'SWAPS_BY_TOKEN_IN_ID_AVERAGE_TOKEN_IN_ID_DESC',
  SwapsByTokenInIdAverageTokenOutIdAsc = 'SWAPS_BY_TOKEN_IN_ID_AVERAGE_TOKEN_OUT_ID_ASC',
  SwapsByTokenInIdAverageTokenOutIdDesc = 'SWAPS_BY_TOKEN_IN_ID_AVERAGE_TOKEN_OUT_ID_DESC',
  SwapsByTokenInIdAverageTransactionIdAsc = 'SWAPS_BY_TOKEN_IN_ID_AVERAGE_TRANSACTION_ID_ASC',
  SwapsByTokenInIdAverageTransactionIdDesc = 'SWAPS_BY_TOKEN_IN_ID_AVERAGE_TRANSACTION_ID_DESC',
  SwapsByTokenInIdCountAsc = 'SWAPS_BY_TOKEN_IN_ID_COUNT_ASC',
  SwapsByTokenInIdCountDesc = 'SWAPS_BY_TOKEN_IN_ID_COUNT_DESC',
  SwapsByTokenInIdDistinctCountAmountInAsc = 'SWAPS_BY_TOKEN_IN_ID_DISTINCT_COUNT_AMOUNT_IN_ASC',
  SwapsByTokenInIdDistinctCountAmountInDesc = 'SWAPS_BY_TOKEN_IN_ID_DISTINCT_COUNT_AMOUNT_IN_DESC',
  SwapsByTokenInIdDistinctCountAmountOutAsc = 'SWAPS_BY_TOKEN_IN_ID_DISTINCT_COUNT_AMOUNT_OUT_ASC',
  SwapsByTokenInIdDistinctCountAmountOutDesc = 'SWAPS_BY_TOKEN_IN_ID_DISTINCT_COUNT_AMOUNT_OUT_DESC',
  SwapsByTokenInIdDistinctCountBlockRangeAsc = 'SWAPS_BY_TOKEN_IN_ID_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  SwapsByTokenInIdDistinctCountBlockRangeDesc = 'SWAPS_BY_TOKEN_IN_ID_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  SwapsByTokenInIdDistinctCountFeeUSDAsc = 'SWAPS_BY_TOKEN_IN_ID_DISTINCT_COUNT_FEE_U_S_D_ASC',
  SwapsByTokenInIdDistinctCountFeeUSDDesc = 'SWAPS_BY_TOKEN_IN_ID_DISTINCT_COUNT_FEE_U_S_D_DESC',
  SwapsByTokenInIdDistinctCountIdAsc = 'SWAPS_BY_TOKEN_IN_ID_DISTINCT_COUNT_ID_ASC',
  SwapsByTokenInIdDistinctCountIdDesc = 'SWAPS_BY_TOKEN_IN_ID_DISTINCT_COUNT_ID_DESC',
  SwapsByTokenInIdDistinctCountSenderIdAsc = 'SWAPS_BY_TOKEN_IN_ID_DISTINCT_COUNT_SENDER_ID_ASC',
  SwapsByTokenInIdDistinctCountSenderIdDesc = 'SWAPS_BY_TOKEN_IN_ID_DISTINCT_COUNT_SENDER_ID_DESC',
  SwapsByTokenInIdDistinctCountTokenInIdAsc = 'SWAPS_BY_TOKEN_IN_ID_DISTINCT_COUNT_TOKEN_IN_ID_ASC',
  SwapsByTokenInIdDistinctCountTokenInIdDesc = 'SWAPS_BY_TOKEN_IN_ID_DISTINCT_COUNT_TOKEN_IN_ID_DESC',
  SwapsByTokenInIdDistinctCountTokenOutIdAsc = 'SWAPS_BY_TOKEN_IN_ID_DISTINCT_COUNT_TOKEN_OUT_ID_ASC',
  SwapsByTokenInIdDistinctCountTokenOutIdDesc = 'SWAPS_BY_TOKEN_IN_ID_DISTINCT_COUNT_TOKEN_OUT_ID_DESC',
  SwapsByTokenInIdDistinctCountTransactionIdAsc = 'SWAPS_BY_TOKEN_IN_ID_DISTINCT_COUNT_TRANSACTION_ID_ASC',
  SwapsByTokenInIdDistinctCountTransactionIdDesc = 'SWAPS_BY_TOKEN_IN_ID_DISTINCT_COUNT_TRANSACTION_ID_DESC',
  SwapsByTokenInIdMaxAmountInAsc = 'SWAPS_BY_TOKEN_IN_ID_MAX_AMOUNT_IN_ASC',
  SwapsByTokenInIdMaxAmountInDesc = 'SWAPS_BY_TOKEN_IN_ID_MAX_AMOUNT_IN_DESC',
  SwapsByTokenInIdMaxAmountOutAsc = 'SWAPS_BY_TOKEN_IN_ID_MAX_AMOUNT_OUT_ASC',
  SwapsByTokenInIdMaxAmountOutDesc = 'SWAPS_BY_TOKEN_IN_ID_MAX_AMOUNT_OUT_DESC',
  SwapsByTokenInIdMaxBlockRangeAsc = 'SWAPS_BY_TOKEN_IN_ID_MAX_BLOCK_RANGE_ASC',
  SwapsByTokenInIdMaxBlockRangeDesc = 'SWAPS_BY_TOKEN_IN_ID_MAX_BLOCK_RANGE_DESC',
  SwapsByTokenInIdMaxFeeUSDAsc = 'SWAPS_BY_TOKEN_IN_ID_MAX_FEE_U_S_D_ASC',
  SwapsByTokenInIdMaxFeeUSDDesc = 'SWAPS_BY_TOKEN_IN_ID_MAX_FEE_U_S_D_DESC',
  SwapsByTokenInIdMaxIdAsc = 'SWAPS_BY_TOKEN_IN_ID_MAX_ID_ASC',
  SwapsByTokenInIdMaxIdDesc = 'SWAPS_BY_TOKEN_IN_ID_MAX_ID_DESC',
  SwapsByTokenInIdMaxSenderIdAsc = 'SWAPS_BY_TOKEN_IN_ID_MAX_SENDER_ID_ASC',
  SwapsByTokenInIdMaxSenderIdDesc = 'SWAPS_BY_TOKEN_IN_ID_MAX_SENDER_ID_DESC',
  SwapsByTokenInIdMaxTokenInIdAsc = 'SWAPS_BY_TOKEN_IN_ID_MAX_TOKEN_IN_ID_ASC',
  SwapsByTokenInIdMaxTokenInIdDesc = 'SWAPS_BY_TOKEN_IN_ID_MAX_TOKEN_IN_ID_DESC',
  SwapsByTokenInIdMaxTokenOutIdAsc = 'SWAPS_BY_TOKEN_IN_ID_MAX_TOKEN_OUT_ID_ASC',
  SwapsByTokenInIdMaxTokenOutIdDesc = 'SWAPS_BY_TOKEN_IN_ID_MAX_TOKEN_OUT_ID_DESC',
  SwapsByTokenInIdMaxTransactionIdAsc = 'SWAPS_BY_TOKEN_IN_ID_MAX_TRANSACTION_ID_ASC',
  SwapsByTokenInIdMaxTransactionIdDesc = 'SWAPS_BY_TOKEN_IN_ID_MAX_TRANSACTION_ID_DESC',
  SwapsByTokenInIdMinAmountInAsc = 'SWAPS_BY_TOKEN_IN_ID_MIN_AMOUNT_IN_ASC',
  SwapsByTokenInIdMinAmountInDesc = 'SWAPS_BY_TOKEN_IN_ID_MIN_AMOUNT_IN_DESC',
  SwapsByTokenInIdMinAmountOutAsc = 'SWAPS_BY_TOKEN_IN_ID_MIN_AMOUNT_OUT_ASC',
  SwapsByTokenInIdMinAmountOutDesc = 'SWAPS_BY_TOKEN_IN_ID_MIN_AMOUNT_OUT_DESC',
  SwapsByTokenInIdMinBlockRangeAsc = 'SWAPS_BY_TOKEN_IN_ID_MIN_BLOCK_RANGE_ASC',
  SwapsByTokenInIdMinBlockRangeDesc = 'SWAPS_BY_TOKEN_IN_ID_MIN_BLOCK_RANGE_DESC',
  SwapsByTokenInIdMinFeeUSDAsc = 'SWAPS_BY_TOKEN_IN_ID_MIN_FEE_U_S_D_ASC',
  SwapsByTokenInIdMinFeeUSDDesc = 'SWAPS_BY_TOKEN_IN_ID_MIN_FEE_U_S_D_DESC',
  SwapsByTokenInIdMinIdAsc = 'SWAPS_BY_TOKEN_IN_ID_MIN_ID_ASC',
  SwapsByTokenInIdMinIdDesc = 'SWAPS_BY_TOKEN_IN_ID_MIN_ID_DESC',
  SwapsByTokenInIdMinSenderIdAsc = 'SWAPS_BY_TOKEN_IN_ID_MIN_SENDER_ID_ASC',
  SwapsByTokenInIdMinSenderIdDesc = 'SWAPS_BY_TOKEN_IN_ID_MIN_SENDER_ID_DESC',
  SwapsByTokenInIdMinTokenInIdAsc = 'SWAPS_BY_TOKEN_IN_ID_MIN_TOKEN_IN_ID_ASC',
  SwapsByTokenInIdMinTokenInIdDesc = 'SWAPS_BY_TOKEN_IN_ID_MIN_TOKEN_IN_ID_DESC',
  SwapsByTokenInIdMinTokenOutIdAsc = 'SWAPS_BY_TOKEN_IN_ID_MIN_TOKEN_OUT_ID_ASC',
  SwapsByTokenInIdMinTokenOutIdDesc = 'SWAPS_BY_TOKEN_IN_ID_MIN_TOKEN_OUT_ID_DESC',
  SwapsByTokenInIdMinTransactionIdAsc = 'SWAPS_BY_TOKEN_IN_ID_MIN_TRANSACTION_ID_ASC',
  SwapsByTokenInIdMinTransactionIdDesc = 'SWAPS_BY_TOKEN_IN_ID_MIN_TRANSACTION_ID_DESC',
  SwapsByTokenInIdStddevPopulationAmountInAsc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_POPULATION_AMOUNT_IN_ASC',
  SwapsByTokenInIdStddevPopulationAmountInDesc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_POPULATION_AMOUNT_IN_DESC',
  SwapsByTokenInIdStddevPopulationAmountOutAsc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_POPULATION_AMOUNT_OUT_ASC',
  SwapsByTokenInIdStddevPopulationAmountOutDesc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_POPULATION_AMOUNT_OUT_DESC',
  SwapsByTokenInIdStddevPopulationBlockRangeAsc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  SwapsByTokenInIdStddevPopulationBlockRangeDesc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  SwapsByTokenInIdStddevPopulationFeeUSDAsc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_POPULATION_FEE_U_S_D_ASC',
  SwapsByTokenInIdStddevPopulationFeeUSDDesc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_POPULATION_FEE_U_S_D_DESC',
  SwapsByTokenInIdStddevPopulationIdAsc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_POPULATION_ID_ASC',
  SwapsByTokenInIdStddevPopulationIdDesc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_POPULATION_ID_DESC',
  SwapsByTokenInIdStddevPopulationSenderIdAsc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_POPULATION_SENDER_ID_ASC',
  SwapsByTokenInIdStddevPopulationSenderIdDesc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_POPULATION_SENDER_ID_DESC',
  SwapsByTokenInIdStddevPopulationTokenInIdAsc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_POPULATION_TOKEN_IN_ID_ASC',
  SwapsByTokenInIdStddevPopulationTokenInIdDesc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_POPULATION_TOKEN_IN_ID_DESC',
  SwapsByTokenInIdStddevPopulationTokenOutIdAsc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_POPULATION_TOKEN_OUT_ID_ASC',
  SwapsByTokenInIdStddevPopulationTokenOutIdDesc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_POPULATION_TOKEN_OUT_ID_DESC',
  SwapsByTokenInIdStddevPopulationTransactionIdAsc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_POPULATION_TRANSACTION_ID_ASC',
  SwapsByTokenInIdStddevPopulationTransactionIdDesc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_POPULATION_TRANSACTION_ID_DESC',
  SwapsByTokenInIdStddevSampleAmountInAsc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_SAMPLE_AMOUNT_IN_ASC',
  SwapsByTokenInIdStddevSampleAmountInDesc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_SAMPLE_AMOUNT_IN_DESC',
  SwapsByTokenInIdStddevSampleAmountOutAsc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_SAMPLE_AMOUNT_OUT_ASC',
  SwapsByTokenInIdStddevSampleAmountOutDesc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_SAMPLE_AMOUNT_OUT_DESC',
  SwapsByTokenInIdStddevSampleBlockRangeAsc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  SwapsByTokenInIdStddevSampleBlockRangeDesc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  SwapsByTokenInIdStddevSampleFeeUSDAsc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_SAMPLE_FEE_U_S_D_ASC',
  SwapsByTokenInIdStddevSampleFeeUSDDesc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_SAMPLE_FEE_U_S_D_DESC',
  SwapsByTokenInIdStddevSampleIdAsc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_SAMPLE_ID_ASC',
  SwapsByTokenInIdStddevSampleIdDesc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_SAMPLE_ID_DESC',
  SwapsByTokenInIdStddevSampleSenderIdAsc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_SAMPLE_SENDER_ID_ASC',
  SwapsByTokenInIdStddevSampleSenderIdDesc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_SAMPLE_SENDER_ID_DESC',
  SwapsByTokenInIdStddevSampleTokenInIdAsc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_SAMPLE_TOKEN_IN_ID_ASC',
  SwapsByTokenInIdStddevSampleTokenInIdDesc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_SAMPLE_TOKEN_IN_ID_DESC',
  SwapsByTokenInIdStddevSampleTokenOutIdAsc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_SAMPLE_TOKEN_OUT_ID_ASC',
  SwapsByTokenInIdStddevSampleTokenOutIdDesc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_SAMPLE_TOKEN_OUT_ID_DESC',
  SwapsByTokenInIdStddevSampleTransactionIdAsc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_SAMPLE_TRANSACTION_ID_ASC',
  SwapsByTokenInIdStddevSampleTransactionIdDesc = 'SWAPS_BY_TOKEN_IN_ID_STDDEV_SAMPLE_TRANSACTION_ID_DESC',
  SwapsByTokenInIdSumAmountInAsc = 'SWAPS_BY_TOKEN_IN_ID_SUM_AMOUNT_IN_ASC',
  SwapsByTokenInIdSumAmountInDesc = 'SWAPS_BY_TOKEN_IN_ID_SUM_AMOUNT_IN_DESC',
  SwapsByTokenInIdSumAmountOutAsc = 'SWAPS_BY_TOKEN_IN_ID_SUM_AMOUNT_OUT_ASC',
  SwapsByTokenInIdSumAmountOutDesc = 'SWAPS_BY_TOKEN_IN_ID_SUM_AMOUNT_OUT_DESC',
  SwapsByTokenInIdSumBlockRangeAsc = 'SWAPS_BY_TOKEN_IN_ID_SUM_BLOCK_RANGE_ASC',
  SwapsByTokenInIdSumBlockRangeDesc = 'SWAPS_BY_TOKEN_IN_ID_SUM_BLOCK_RANGE_DESC',
  SwapsByTokenInIdSumFeeUSDAsc = 'SWAPS_BY_TOKEN_IN_ID_SUM_FEE_U_S_D_ASC',
  SwapsByTokenInIdSumFeeUSDDesc = 'SWAPS_BY_TOKEN_IN_ID_SUM_FEE_U_S_D_DESC',
  SwapsByTokenInIdSumIdAsc = 'SWAPS_BY_TOKEN_IN_ID_SUM_ID_ASC',
  SwapsByTokenInIdSumIdDesc = 'SWAPS_BY_TOKEN_IN_ID_SUM_ID_DESC',
  SwapsByTokenInIdSumSenderIdAsc = 'SWAPS_BY_TOKEN_IN_ID_SUM_SENDER_ID_ASC',
  SwapsByTokenInIdSumSenderIdDesc = 'SWAPS_BY_TOKEN_IN_ID_SUM_SENDER_ID_DESC',
  SwapsByTokenInIdSumTokenInIdAsc = 'SWAPS_BY_TOKEN_IN_ID_SUM_TOKEN_IN_ID_ASC',
  SwapsByTokenInIdSumTokenInIdDesc = 'SWAPS_BY_TOKEN_IN_ID_SUM_TOKEN_IN_ID_DESC',
  SwapsByTokenInIdSumTokenOutIdAsc = 'SWAPS_BY_TOKEN_IN_ID_SUM_TOKEN_OUT_ID_ASC',
  SwapsByTokenInIdSumTokenOutIdDesc = 'SWAPS_BY_TOKEN_IN_ID_SUM_TOKEN_OUT_ID_DESC',
  SwapsByTokenInIdSumTransactionIdAsc = 'SWAPS_BY_TOKEN_IN_ID_SUM_TRANSACTION_ID_ASC',
  SwapsByTokenInIdSumTransactionIdDesc = 'SWAPS_BY_TOKEN_IN_ID_SUM_TRANSACTION_ID_DESC',
  SwapsByTokenInIdVariancePopulationAmountInAsc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_POPULATION_AMOUNT_IN_ASC',
  SwapsByTokenInIdVariancePopulationAmountInDesc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_POPULATION_AMOUNT_IN_DESC',
  SwapsByTokenInIdVariancePopulationAmountOutAsc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_POPULATION_AMOUNT_OUT_ASC',
  SwapsByTokenInIdVariancePopulationAmountOutDesc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_POPULATION_AMOUNT_OUT_DESC',
  SwapsByTokenInIdVariancePopulationBlockRangeAsc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  SwapsByTokenInIdVariancePopulationBlockRangeDesc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  SwapsByTokenInIdVariancePopulationFeeUSDAsc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_POPULATION_FEE_U_S_D_ASC',
  SwapsByTokenInIdVariancePopulationFeeUSDDesc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_POPULATION_FEE_U_S_D_DESC',
  SwapsByTokenInIdVariancePopulationIdAsc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_POPULATION_ID_ASC',
  SwapsByTokenInIdVariancePopulationIdDesc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_POPULATION_ID_DESC',
  SwapsByTokenInIdVariancePopulationSenderIdAsc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_POPULATION_SENDER_ID_ASC',
  SwapsByTokenInIdVariancePopulationSenderIdDesc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_POPULATION_SENDER_ID_DESC',
  SwapsByTokenInIdVariancePopulationTokenInIdAsc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_POPULATION_TOKEN_IN_ID_ASC',
  SwapsByTokenInIdVariancePopulationTokenInIdDesc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_POPULATION_TOKEN_IN_ID_DESC',
  SwapsByTokenInIdVariancePopulationTokenOutIdAsc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_POPULATION_TOKEN_OUT_ID_ASC',
  SwapsByTokenInIdVariancePopulationTokenOutIdDesc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_POPULATION_TOKEN_OUT_ID_DESC',
  SwapsByTokenInIdVariancePopulationTransactionIdAsc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_POPULATION_TRANSACTION_ID_ASC',
  SwapsByTokenInIdVariancePopulationTransactionIdDesc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_POPULATION_TRANSACTION_ID_DESC',
  SwapsByTokenInIdVarianceSampleAmountInAsc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_SAMPLE_AMOUNT_IN_ASC',
  SwapsByTokenInIdVarianceSampleAmountInDesc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_SAMPLE_AMOUNT_IN_DESC',
  SwapsByTokenInIdVarianceSampleAmountOutAsc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_SAMPLE_AMOUNT_OUT_ASC',
  SwapsByTokenInIdVarianceSampleAmountOutDesc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_SAMPLE_AMOUNT_OUT_DESC',
  SwapsByTokenInIdVarianceSampleBlockRangeAsc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  SwapsByTokenInIdVarianceSampleBlockRangeDesc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  SwapsByTokenInIdVarianceSampleFeeUSDAsc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_SAMPLE_FEE_U_S_D_ASC',
  SwapsByTokenInIdVarianceSampleFeeUSDDesc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_SAMPLE_FEE_U_S_D_DESC',
  SwapsByTokenInIdVarianceSampleIdAsc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_SAMPLE_ID_ASC',
  SwapsByTokenInIdVarianceSampleIdDesc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_SAMPLE_ID_DESC',
  SwapsByTokenInIdVarianceSampleSenderIdAsc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_SAMPLE_SENDER_ID_ASC',
  SwapsByTokenInIdVarianceSampleSenderIdDesc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_SAMPLE_SENDER_ID_DESC',
  SwapsByTokenInIdVarianceSampleTokenInIdAsc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_SAMPLE_TOKEN_IN_ID_ASC',
  SwapsByTokenInIdVarianceSampleTokenInIdDesc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_SAMPLE_TOKEN_IN_ID_DESC',
  SwapsByTokenInIdVarianceSampleTokenOutIdAsc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_SAMPLE_TOKEN_OUT_ID_ASC',
  SwapsByTokenInIdVarianceSampleTokenOutIdDesc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_SAMPLE_TOKEN_OUT_ID_DESC',
  SwapsByTokenInIdVarianceSampleTransactionIdAsc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_SAMPLE_TRANSACTION_ID_ASC',
  SwapsByTokenInIdVarianceSampleTransactionIdDesc = 'SWAPS_BY_TOKEN_IN_ID_VARIANCE_SAMPLE_TRANSACTION_ID_DESC',
  SwapsByTokenOutIdAverageAmountInAsc = 'SWAPS_BY_TOKEN_OUT_ID_AVERAGE_AMOUNT_IN_ASC',
  SwapsByTokenOutIdAverageAmountInDesc = 'SWAPS_BY_TOKEN_OUT_ID_AVERAGE_AMOUNT_IN_DESC',
  SwapsByTokenOutIdAverageAmountOutAsc = 'SWAPS_BY_TOKEN_OUT_ID_AVERAGE_AMOUNT_OUT_ASC',
  SwapsByTokenOutIdAverageAmountOutDesc = 'SWAPS_BY_TOKEN_OUT_ID_AVERAGE_AMOUNT_OUT_DESC',
  SwapsByTokenOutIdAverageBlockRangeAsc = 'SWAPS_BY_TOKEN_OUT_ID_AVERAGE_BLOCK_RANGE_ASC',
  SwapsByTokenOutIdAverageBlockRangeDesc = 'SWAPS_BY_TOKEN_OUT_ID_AVERAGE_BLOCK_RANGE_DESC',
  SwapsByTokenOutIdAverageFeeUSDAsc = 'SWAPS_BY_TOKEN_OUT_ID_AVERAGE_FEE_U_S_D_ASC',
  SwapsByTokenOutIdAverageFeeUSDDesc = 'SWAPS_BY_TOKEN_OUT_ID_AVERAGE_FEE_U_S_D_DESC',
  SwapsByTokenOutIdAverageIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_AVERAGE_ID_ASC',
  SwapsByTokenOutIdAverageIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_AVERAGE_ID_DESC',
  SwapsByTokenOutIdAverageSenderIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_AVERAGE_SENDER_ID_ASC',
  SwapsByTokenOutIdAverageSenderIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_AVERAGE_SENDER_ID_DESC',
  SwapsByTokenOutIdAverageTokenInIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_AVERAGE_TOKEN_IN_ID_ASC',
  SwapsByTokenOutIdAverageTokenInIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_AVERAGE_TOKEN_IN_ID_DESC',
  SwapsByTokenOutIdAverageTokenOutIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_AVERAGE_TOKEN_OUT_ID_ASC',
  SwapsByTokenOutIdAverageTokenOutIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_AVERAGE_TOKEN_OUT_ID_DESC',
  SwapsByTokenOutIdAverageTransactionIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_AVERAGE_TRANSACTION_ID_ASC',
  SwapsByTokenOutIdAverageTransactionIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_AVERAGE_TRANSACTION_ID_DESC',
  SwapsByTokenOutIdCountAsc = 'SWAPS_BY_TOKEN_OUT_ID_COUNT_ASC',
  SwapsByTokenOutIdCountDesc = 'SWAPS_BY_TOKEN_OUT_ID_COUNT_DESC',
  SwapsByTokenOutIdDistinctCountAmountInAsc = 'SWAPS_BY_TOKEN_OUT_ID_DISTINCT_COUNT_AMOUNT_IN_ASC',
  SwapsByTokenOutIdDistinctCountAmountInDesc = 'SWAPS_BY_TOKEN_OUT_ID_DISTINCT_COUNT_AMOUNT_IN_DESC',
  SwapsByTokenOutIdDistinctCountAmountOutAsc = 'SWAPS_BY_TOKEN_OUT_ID_DISTINCT_COUNT_AMOUNT_OUT_ASC',
  SwapsByTokenOutIdDistinctCountAmountOutDesc = 'SWAPS_BY_TOKEN_OUT_ID_DISTINCT_COUNT_AMOUNT_OUT_DESC',
  SwapsByTokenOutIdDistinctCountBlockRangeAsc = 'SWAPS_BY_TOKEN_OUT_ID_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  SwapsByTokenOutIdDistinctCountBlockRangeDesc = 'SWAPS_BY_TOKEN_OUT_ID_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  SwapsByTokenOutIdDistinctCountFeeUSDAsc = 'SWAPS_BY_TOKEN_OUT_ID_DISTINCT_COUNT_FEE_U_S_D_ASC',
  SwapsByTokenOutIdDistinctCountFeeUSDDesc = 'SWAPS_BY_TOKEN_OUT_ID_DISTINCT_COUNT_FEE_U_S_D_DESC',
  SwapsByTokenOutIdDistinctCountIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_DISTINCT_COUNT_ID_ASC',
  SwapsByTokenOutIdDistinctCountIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_DISTINCT_COUNT_ID_DESC',
  SwapsByTokenOutIdDistinctCountSenderIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_DISTINCT_COUNT_SENDER_ID_ASC',
  SwapsByTokenOutIdDistinctCountSenderIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_DISTINCT_COUNT_SENDER_ID_DESC',
  SwapsByTokenOutIdDistinctCountTokenInIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_DISTINCT_COUNT_TOKEN_IN_ID_ASC',
  SwapsByTokenOutIdDistinctCountTokenInIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_DISTINCT_COUNT_TOKEN_IN_ID_DESC',
  SwapsByTokenOutIdDistinctCountTokenOutIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_DISTINCT_COUNT_TOKEN_OUT_ID_ASC',
  SwapsByTokenOutIdDistinctCountTokenOutIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_DISTINCT_COUNT_TOKEN_OUT_ID_DESC',
  SwapsByTokenOutIdDistinctCountTransactionIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_DISTINCT_COUNT_TRANSACTION_ID_ASC',
  SwapsByTokenOutIdDistinctCountTransactionIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_DISTINCT_COUNT_TRANSACTION_ID_DESC',
  SwapsByTokenOutIdMaxAmountInAsc = 'SWAPS_BY_TOKEN_OUT_ID_MAX_AMOUNT_IN_ASC',
  SwapsByTokenOutIdMaxAmountInDesc = 'SWAPS_BY_TOKEN_OUT_ID_MAX_AMOUNT_IN_DESC',
  SwapsByTokenOutIdMaxAmountOutAsc = 'SWAPS_BY_TOKEN_OUT_ID_MAX_AMOUNT_OUT_ASC',
  SwapsByTokenOutIdMaxAmountOutDesc = 'SWAPS_BY_TOKEN_OUT_ID_MAX_AMOUNT_OUT_DESC',
  SwapsByTokenOutIdMaxBlockRangeAsc = 'SWAPS_BY_TOKEN_OUT_ID_MAX_BLOCK_RANGE_ASC',
  SwapsByTokenOutIdMaxBlockRangeDesc = 'SWAPS_BY_TOKEN_OUT_ID_MAX_BLOCK_RANGE_DESC',
  SwapsByTokenOutIdMaxFeeUSDAsc = 'SWAPS_BY_TOKEN_OUT_ID_MAX_FEE_U_S_D_ASC',
  SwapsByTokenOutIdMaxFeeUSDDesc = 'SWAPS_BY_TOKEN_OUT_ID_MAX_FEE_U_S_D_DESC',
  SwapsByTokenOutIdMaxIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_MAX_ID_ASC',
  SwapsByTokenOutIdMaxIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_MAX_ID_DESC',
  SwapsByTokenOutIdMaxSenderIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_MAX_SENDER_ID_ASC',
  SwapsByTokenOutIdMaxSenderIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_MAX_SENDER_ID_DESC',
  SwapsByTokenOutIdMaxTokenInIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_MAX_TOKEN_IN_ID_ASC',
  SwapsByTokenOutIdMaxTokenInIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_MAX_TOKEN_IN_ID_DESC',
  SwapsByTokenOutIdMaxTokenOutIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_MAX_TOKEN_OUT_ID_ASC',
  SwapsByTokenOutIdMaxTokenOutIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_MAX_TOKEN_OUT_ID_DESC',
  SwapsByTokenOutIdMaxTransactionIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_MAX_TRANSACTION_ID_ASC',
  SwapsByTokenOutIdMaxTransactionIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_MAX_TRANSACTION_ID_DESC',
  SwapsByTokenOutIdMinAmountInAsc = 'SWAPS_BY_TOKEN_OUT_ID_MIN_AMOUNT_IN_ASC',
  SwapsByTokenOutIdMinAmountInDesc = 'SWAPS_BY_TOKEN_OUT_ID_MIN_AMOUNT_IN_DESC',
  SwapsByTokenOutIdMinAmountOutAsc = 'SWAPS_BY_TOKEN_OUT_ID_MIN_AMOUNT_OUT_ASC',
  SwapsByTokenOutIdMinAmountOutDesc = 'SWAPS_BY_TOKEN_OUT_ID_MIN_AMOUNT_OUT_DESC',
  SwapsByTokenOutIdMinBlockRangeAsc = 'SWAPS_BY_TOKEN_OUT_ID_MIN_BLOCK_RANGE_ASC',
  SwapsByTokenOutIdMinBlockRangeDesc = 'SWAPS_BY_TOKEN_OUT_ID_MIN_BLOCK_RANGE_DESC',
  SwapsByTokenOutIdMinFeeUSDAsc = 'SWAPS_BY_TOKEN_OUT_ID_MIN_FEE_U_S_D_ASC',
  SwapsByTokenOutIdMinFeeUSDDesc = 'SWAPS_BY_TOKEN_OUT_ID_MIN_FEE_U_S_D_DESC',
  SwapsByTokenOutIdMinIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_MIN_ID_ASC',
  SwapsByTokenOutIdMinIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_MIN_ID_DESC',
  SwapsByTokenOutIdMinSenderIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_MIN_SENDER_ID_ASC',
  SwapsByTokenOutIdMinSenderIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_MIN_SENDER_ID_DESC',
  SwapsByTokenOutIdMinTokenInIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_MIN_TOKEN_IN_ID_ASC',
  SwapsByTokenOutIdMinTokenInIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_MIN_TOKEN_IN_ID_DESC',
  SwapsByTokenOutIdMinTokenOutIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_MIN_TOKEN_OUT_ID_ASC',
  SwapsByTokenOutIdMinTokenOutIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_MIN_TOKEN_OUT_ID_DESC',
  SwapsByTokenOutIdMinTransactionIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_MIN_TRANSACTION_ID_ASC',
  SwapsByTokenOutIdMinTransactionIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_MIN_TRANSACTION_ID_DESC',
  SwapsByTokenOutIdStddevPopulationAmountInAsc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_POPULATION_AMOUNT_IN_ASC',
  SwapsByTokenOutIdStddevPopulationAmountInDesc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_POPULATION_AMOUNT_IN_DESC',
  SwapsByTokenOutIdStddevPopulationAmountOutAsc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_POPULATION_AMOUNT_OUT_ASC',
  SwapsByTokenOutIdStddevPopulationAmountOutDesc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_POPULATION_AMOUNT_OUT_DESC',
  SwapsByTokenOutIdStddevPopulationBlockRangeAsc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  SwapsByTokenOutIdStddevPopulationBlockRangeDesc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  SwapsByTokenOutIdStddevPopulationFeeUSDAsc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_POPULATION_FEE_U_S_D_ASC',
  SwapsByTokenOutIdStddevPopulationFeeUSDDesc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_POPULATION_FEE_U_S_D_DESC',
  SwapsByTokenOutIdStddevPopulationIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_POPULATION_ID_ASC',
  SwapsByTokenOutIdStddevPopulationIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_POPULATION_ID_DESC',
  SwapsByTokenOutIdStddevPopulationSenderIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_POPULATION_SENDER_ID_ASC',
  SwapsByTokenOutIdStddevPopulationSenderIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_POPULATION_SENDER_ID_DESC',
  SwapsByTokenOutIdStddevPopulationTokenInIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_POPULATION_TOKEN_IN_ID_ASC',
  SwapsByTokenOutIdStddevPopulationTokenInIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_POPULATION_TOKEN_IN_ID_DESC',
  SwapsByTokenOutIdStddevPopulationTokenOutIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_POPULATION_TOKEN_OUT_ID_ASC',
  SwapsByTokenOutIdStddevPopulationTokenOutIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_POPULATION_TOKEN_OUT_ID_DESC',
  SwapsByTokenOutIdStddevPopulationTransactionIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_POPULATION_TRANSACTION_ID_ASC',
  SwapsByTokenOutIdStddevPopulationTransactionIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_POPULATION_TRANSACTION_ID_DESC',
  SwapsByTokenOutIdStddevSampleAmountInAsc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_SAMPLE_AMOUNT_IN_ASC',
  SwapsByTokenOutIdStddevSampleAmountInDesc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_SAMPLE_AMOUNT_IN_DESC',
  SwapsByTokenOutIdStddevSampleAmountOutAsc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_SAMPLE_AMOUNT_OUT_ASC',
  SwapsByTokenOutIdStddevSampleAmountOutDesc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_SAMPLE_AMOUNT_OUT_DESC',
  SwapsByTokenOutIdStddevSampleBlockRangeAsc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  SwapsByTokenOutIdStddevSampleBlockRangeDesc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  SwapsByTokenOutIdStddevSampleFeeUSDAsc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_SAMPLE_FEE_U_S_D_ASC',
  SwapsByTokenOutIdStddevSampleFeeUSDDesc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_SAMPLE_FEE_U_S_D_DESC',
  SwapsByTokenOutIdStddevSampleIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_SAMPLE_ID_ASC',
  SwapsByTokenOutIdStddevSampleIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_SAMPLE_ID_DESC',
  SwapsByTokenOutIdStddevSampleSenderIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_SAMPLE_SENDER_ID_ASC',
  SwapsByTokenOutIdStddevSampleSenderIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_SAMPLE_SENDER_ID_DESC',
  SwapsByTokenOutIdStddevSampleTokenInIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_SAMPLE_TOKEN_IN_ID_ASC',
  SwapsByTokenOutIdStddevSampleTokenInIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_SAMPLE_TOKEN_IN_ID_DESC',
  SwapsByTokenOutIdStddevSampleTokenOutIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_SAMPLE_TOKEN_OUT_ID_ASC',
  SwapsByTokenOutIdStddevSampleTokenOutIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_SAMPLE_TOKEN_OUT_ID_DESC',
  SwapsByTokenOutIdStddevSampleTransactionIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_SAMPLE_TRANSACTION_ID_ASC',
  SwapsByTokenOutIdStddevSampleTransactionIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_STDDEV_SAMPLE_TRANSACTION_ID_DESC',
  SwapsByTokenOutIdSumAmountInAsc = 'SWAPS_BY_TOKEN_OUT_ID_SUM_AMOUNT_IN_ASC',
  SwapsByTokenOutIdSumAmountInDesc = 'SWAPS_BY_TOKEN_OUT_ID_SUM_AMOUNT_IN_DESC',
  SwapsByTokenOutIdSumAmountOutAsc = 'SWAPS_BY_TOKEN_OUT_ID_SUM_AMOUNT_OUT_ASC',
  SwapsByTokenOutIdSumAmountOutDesc = 'SWAPS_BY_TOKEN_OUT_ID_SUM_AMOUNT_OUT_DESC',
  SwapsByTokenOutIdSumBlockRangeAsc = 'SWAPS_BY_TOKEN_OUT_ID_SUM_BLOCK_RANGE_ASC',
  SwapsByTokenOutIdSumBlockRangeDesc = 'SWAPS_BY_TOKEN_OUT_ID_SUM_BLOCK_RANGE_DESC',
  SwapsByTokenOutIdSumFeeUSDAsc = 'SWAPS_BY_TOKEN_OUT_ID_SUM_FEE_U_S_D_ASC',
  SwapsByTokenOutIdSumFeeUSDDesc = 'SWAPS_BY_TOKEN_OUT_ID_SUM_FEE_U_S_D_DESC',
  SwapsByTokenOutIdSumIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_SUM_ID_ASC',
  SwapsByTokenOutIdSumIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_SUM_ID_DESC',
  SwapsByTokenOutIdSumSenderIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_SUM_SENDER_ID_ASC',
  SwapsByTokenOutIdSumSenderIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_SUM_SENDER_ID_DESC',
  SwapsByTokenOutIdSumTokenInIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_SUM_TOKEN_IN_ID_ASC',
  SwapsByTokenOutIdSumTokenInIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_SUM_TOKEN_IN_ID_DESC',
  SwapsByTokenOutIdSumTokenOutIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_SUM_TOKEN_OUT_ID_ASC',
  SwapsByTokenOutIdSumTokenOutIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_SUM_TOKEN_OUT_ID_DESC',
  SwapsByTokenOutIdSumTransactionIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_SUM_TRANSACTION_ID_ASC',
  SwapsByTokenOutIdSumTransactionIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_SUM_TRANSACTION_ID_DESC',
  SwapsByTokenOutIdVariancePopulationAmountInAsc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_POPULATION_AMOUNT_IN_ASC',
  SwapsByTokenOutIdVariancePopulationAmountInDesc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_POPULATION_AMOUNT_IN_DESC',
  SwapsByTokenOutIdVariancePopulationAmountOutAsc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_POPULATION_AMOUNT_OUT_ASC',
  SwapsByTokenOutIdVariancePopulationAmountOutDesc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_POPULATION_AMOUNT_OUT_DESC',
  SwapsByTokenOutIdVariancePopulationBlockRangeAsc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  SwapsByTokenOutIdVariancePopulationBlockRangeDesc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  SwapsByTokenOutIdVariancePopulationFeeUSDAsc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_POPULATION_FEE_U_S_D_ASC',
  SwapsByTokenOutIdVariancePopulationFeeUSDDesc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_POPULATION_FEE_U_S_D_DESC',
  SwapsByTokenOutIdVariancePopulationIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_POPULATION_ID_ASC',
  SwapsByTokenOutIdVariancePopulationIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_POPULATION_ID_DESC',
  SwapsByTokenOutIdVariancePopulationSenderIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_POPULATION_SENDER_ID_ASC',
  SwapsByTokenOutIdVariancePopulationSenderIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_POPULATION_SENDER_ID_DESC',
  SwapsByTokenOutIdVariancePopulationTokenInIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_POPULATION_TOKEN_IN_ID_ASC',
  SwapsByTokenOutIdVariancePopulationTokenInIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_POPULATION_TOKEN_IN_ID_DESC',
  SwapsByTokenOutIdVariancePopulationTokenOutIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_POPULATION_TOKEN_OUT_ID_ASC',
  SwapsByTokenOutIdVariancePopulationTokenOutIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_POPULATION_TOKEN_OUT_ID_DESC',
  SwapsByTokenOutIdVariancePopulationTransactionIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_POPULATION_TRANSACTION_ID_ASC',
  SwapsByTokenOutIdVariancePopulationTransactionIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_POPULATION_TRANSACTION_ID_DESC',
  SwapsByTokenOutIdVarianceSampleAmountInAsc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_SAMPLE_AMOUNT_IN_ASC',
  SwapsByTokenOutIdVarianceSampleAmountInDesc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_SAMPLE_AMOUNT_IN_DESC',
  SwapsByTokenOutIdVarianceSampleAmountOutAsc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_SAMPLE_AMOUNT_OUT_ASC',
  SwapsByTokenOutIdVarianceSampleAmountOutDesc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_SAMPLE_AMOUNT_OUT_DESC',
  SwapsByTokenOutIdVarianceSampleBlockRangeAsc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  SwapsByTokenOutIdVarianceSampleBlockRangeDesc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  SwapsByTokenOutIdVarianceSampleFeeUSDAsc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_SAMPLE_FEE_U_S_D_ASC',
  SwapsByTokenOutIdVarianceSampleFeeUSDDesc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_SAMPLE_FEE_U_S_D_DESC',
  SwapsByTokenOutIdVarianceSampleIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_SAMPLE_ID_ASC',
  SwapsByTokenOutIdVarianceSampleIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_SAMPLE_ID_DESC',
  SwapsByTokenOutIdVarianceSampleSenderIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_SAMPLE_SENDER_ID_ASC',
  SwapsByTokenOutIdVarianceSampleSenderIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_SAMPLE_SENDER_ID_DESC',
  SwapsByTokenOutIdVarianceSampleTokenInIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_SAMPLE_TOKEN_IN_ID_ASC',
  SwapsByTokenOutIdVarianceSampleTokenInIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_SAMPLE_TOKEN_IN_ID_DESC',
  SwapsByTokenOutIdVarianceSampleTokenOutIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_SAMPLE_TOKEN_OUT_ID_ASC',
  SwapsByTokenOutIdVarianceSampleTokenOutIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_SAMPLE_TOKEN_OUT_ID_DESC',
  SwapsByTokenOutIdVarianceSampleTransactionIdAsc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_SAMPLE_TRANSACTION_ID_ASC',
  SwapsByTokenOutIdVarianceSampleTransactionIdDesc = 'SWAPS_BY_TOKEN_OUT_ID_VARIANCE_SAMPLE_TRANSACTION_ID_DESC',
  SymbolAsc = 'SYMBOL_ASC',
  SymbolDesc = 'SYMBOL_DESC',
  TotalSupplyAsc = 'TOTAL_SUPPLY_ASC',
  TotalSupplyDesc = 'TOTAL_SUPPLY_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC'
}

export type Transaction = Node & {
  __typename?: 'Transaction';
  /** Reads and enables pagination through a set of `Account`. */
  accountsByClaimFeeTransactionIdAndOwnerId: TransactionAccountsByClaimFeeTransactionIdAndOwnerIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Account`. */
  accountsByPoolTransactionIdAndPoolCreatorId: TransactionAccountsByPoolTransactionIdAndPoolCreatorIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Account`. */
  accountsByPositionTransactionIdAndOwnerId: TransactionAccountsByPositionTransactionIdAndOwnerIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Account`. */
  accountsBySwapTransactionIdAndSenderId: TransactionAccountsBySwapTransactionIdAndSenderIdManyToManyConnection;
  blockNumber: Scalars['BigFloat']['output'];
  /** Reads and enables pagination through a set of `ClaimFee`. */
  claimFees: ClaimFeesConnection;
  events: Scalars['JSON']['output'];
  gasUsed: Scalars['BigFloat']['output'];
  id: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  /** Reads and enables pagination through a set of `Pool`. */
  poolCreations: PoolsConnection;
  /** Reads and enables pagination through a set of `PoolTokenIncentive`. */
  poolTokenIncentives: PoolTokenIncentivesConnection;
  /** Reads and enables pagination through a set of `Pool`. */
  poolsByClaimFeeTransactionIdAndPoolId: TransactionPoolsByClaimFeeTransactionIdAndPoolIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Pool`. */
  poolsByPoolTokenIncentiveTransactionIdAndPoolId: TransactionPoolsByPoolTokenIncentiveTransactionIdAndPoolIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Pool`. */
  poolsByPositionTransactionIdAndPoolId: TransactionPoolsByPositionTransactionIdAndPoolIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Position`. */
  positions: PositionsConnection;
  /** Reads and enables pagination through a set of `Position`. */
  positionsByClaimFeeTransactionIdAndPositionId: TransactionPositionsByClaimFeeTransactionIdAndPositionIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Swap`. */
  swap: SwapsConnection;
  timestamp: Scalars['BigFloat']['output'];
  /** Reads and enables pagination through a set of `Token`. */
  tokensByPoolTokenIncentiveTransactionIdAndTokenId: TransactionTokensByPoolTokenIncentiveTransactionIdAndTokenIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Token`. */
  tokensByPoolTransactionIdAndTokenXId: TransactionTokensByPoolTransactionIdAndTokenXIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Token`. */
  tokensByPoolTransactionIdAndTokenYId: TransactionTokensByPoolTransactionIdAndTokenYIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Token`. */
  tokensBySwapTransactionIdAndTokenInId: TransactionTokensBySwapTransactionIdAndTokenInIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Token`. */
  tokensBySwapTransactionIdAndTokenOutId: TransactionTokensBySwapTransactionIdAndTokenOutIdManyToManyConnection;
};


export type TransactionAccountsByClaimFeeTransactionIdAndOwnerIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Accounts_Distinct_Enum>[]>;
  filter?: InputMaybe<AccountFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountsOrderBy[]>;
};


export type TransactionAccountsByPoolTransactionIdAndPoolCreatorIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Accounts_Distinct_Enum>[]>;
  filter?: InputMaybe<AccountFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountsOrderBy[]>;
};


export type TransactionAccountsByPositionTransactionIdAndOwnerIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Accounts_Distinct_Enum>[]>;
  filter?: InputMaybe<AccountFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountsOrderBy[]>;
};


export type TransactionAccountsBySwapTransactionIdAndSenderIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Accounts_Distinct_Enum>[]>;
  filter?: InputMaybe<AccountFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountsOrderBy[]>;
};


export type TransactionClaimFeesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Claim_Fees_Distinct_Enum>[]>;
  filter?: InputMaybe<ClaimFeeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimFeesOrderBy[]>;
};


export type TransactionPoolCreationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};


export type TransactionPoolTokenIncentivesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pool_Token_Incentives_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolTokenIncentiveFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolTokenIncentivesOrderBy[]>;
};


export type TransactionPoolsByClaimFeeTransactionIdAndPoolIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};


export type TransactionPoolsByPoolTokenIncentiveTransactionIdAndPoolIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};


export type TransactionPoolsByPositionTransactionIdAndPoolIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};


export type TransactionPositionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Positions_Distinct_Enum>[]>;
  filter?: InputMaybe<PositionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionsOrderBy[]>;
};


export type TransactionPositionsByClaimFeeTransactionIdAndPositionIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Positions_Distinct_Enum>[]>;
  filter?: InputMaybe<PositionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionsOrderBy[]>;
};


export type TransactionSwapArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Swaps_Distinct_Enum>[]>;
  filter?: InputMaybe<SwapFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapsOrderBy[]>;
};


export type TransactionTokensByPoolTokenIncentiveTransactionIdAndTokenIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Tokens_Distinct_Enum>[]>;
  filter?: InputMaybe<TokenFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokensOrderBy[]>;
};


export type TransactionTokensByPoolTransactionIdAndTokenXIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Tokens_Distinct_Enum>[]>;
  filter?: InputMaybe<TokenFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokensOrderBy[]>;
};


export type TransactionTokensByPoolTransactionIdAndTokenYIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Tokens_Distinct_Enum>[]>;
  filter?: InputMaybe<TokenFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokensOrderBy[]>;
};


export type TransactionTokensBySwapTransactionIdAndTokenInIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Tokens_Distinct_Enum>[]>;
  filter?: InputMaybe<TokenFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokensOrderBy[]>;
};


export type TransactionTokensBySwapTransactionIdAndTokenOutIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Tokens_Distinct_Enum>[]>;
  filter?: InputMaybe<TokenFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokensOrderBy[]>;
};

/** A connection to a list of `Account` values, with data from `ClaimFee`. */
export type TransactionAccountsByClaimFeeTransactionIdAndOwnerIdManyToManyConnection = {
  __typename?: 'TransactionAccountsByClaimFeeTransactionIdAndOwnerIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<AccountAggregates>;
  /** A list of edges which contains the `Account`, info from the `ClaimFee`, and the cursor to aid in pagination. */
  edges: TransactionAccountsByClaimFeeTransactionIdAndOwnerIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<AccountAggregates[]>;
  /** A list of `Account` objects. */
  nodes: Maybe<Account>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Account` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Account` values, with data from `ClaimFee`. */
export type TransactionAccountsByClaimFeeTransactionIdAndOwnerIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: AccountsGroupBy[];
  having?: InputMaybe<AccountsHavingInput>;
};

/** A `Account` edge in the connection, with data from `ClaimFee`. */
export type TransactionAccountsByClaimFeeTransactionIdAndOwnerIdManyToManyEdge = {
  __typename?: 'TransactionAccountsByClaimFeeTransactionIdAndOwnerIdManyToManyEdge';
  /** Reads and enables pagination through a set of `ClaimFee`. */
  claimFees: ClaimFeesConnection;
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Account` at the end of the edge. */
  node?: Maybe<Account>;
};


/** A `Account` edge in the connection, with data from `ClaimFee`. */
export type TransactionAccountsByClaimFeeTransactionIdAndOwnerIdManyToManyEdgeClaimFeesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Claim_Fees_Distinct_Enum>[]>;
  filter?: InputMaybe<ClaimFeeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimFeesOrderBy[]>;
};

/** A connection to a list of `Account` values, with data from `Pool`. */
export type TransactionAccountsByPoolTransactionIdAndPoolCreatorIdManyToManyConnection = {
  __typename?: 'TransactionAccountsByPoolTransactionIdAndPoolCreatorIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<AccountAggregates>;
  /** A list of edges which contains the `Account`, info from the `Pool`, and the cursor to aid in pagination. */
  edges: TransactionAccountsByPoolTransactionIdAndPoolCreatorIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<AccountAggregates[]>;
  /** A list of `Account` objects. */
  nodes: Maybe<Account>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Account` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Account` values, with data from `Pool`. */
export type TransactionAccountsByPoolTransactionIdAndPoolCreatorIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: AccountsGroupBy[];
  having?: InputMaybe<AccountsHavingInput>;
};

/** A `Account` edge in the connection, with data from `Pool`. */
export type TransactionAccountsByPoolTransactionIdAndPoolCreatorIdManyToManyEdge = {
  __typename?: 'TransactionAccountsByPoolTransactionIdAndPoolCreatorIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Account` at the end of the edge. */
  node?: Maybe<Account>;
  /** Reads and enables pagination through a set of `Pool`. */
  poolCreations: PoolsConnection;
};


/** A `Account` edge in the connection, with data from `Pool`. */
export type TransactionAccountsByPoolTransactionIdAndPoolCreatorIdManyToManyEdgePoolCreationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};

/** A connection to a list of `Account` values, with data from `Position`. */
export type TransactionAccountsByPositionTransactionIdAndOwnerIdManyToManyConnection = {
  __typename?: 'TransactionAccountsByPositionTransactionIdAndOwnerIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<AccountAggregates>;
  /** A list of edges which contains the `Account`, info from the `Position`, and the cursor to aid in pagination. */
  edges: TransactionAccountsByPositionTransactionIdAndOwnerIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<AccountAggregates[]>;
  /** A list of `Account` objects. */
  nodes: Maybe<Account>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Account` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Account` values, with data from `Position`. */
export type TransactionAccountsByPositionTransactionIdAndOwnerIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: AccountsGroupBy[];
  having?: InputMaybe<AccountsHavingInput>;
};

/** A `Account` edge in the connection, with data from `Position`. */
export type TransactionAccountsByPositionTransactionIdAndOwnerIdManyToManyEdge = {
  __typename?: 'TransactionAccountsByPositionTransactionIdAndOwnerIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Account` at the end of the edge. */
  node?: Maybe<Account>;
  /** Reads and enables pagination through a set of `Position`. */
  positions: PositionsConnection;
};


/** A `Account` edge in the connection, with data from `Position`. */
export type TransactionAccountsByPositionTransactionIdAndOwnerIdManyToManyEdgePositionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Positions_Distinct_Enum>[]>;
  filter?: InputMaybe<PositionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionsOrderBy[]>;
};

/** A connection to a list of `Account` values, with data from `Swap`. */
export type TransactionAccountsBySwapTransactionIdAndSenderIdManyToManyConnection = {
  __typename?: 'TransactionAccountsBySwapTransactionIdAndSenderIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<AccountAggregates>;
  /** A list of edges which contains the `Account`, info from the `Swap`, and the cursor to aid in pagination. */
  edges: TransactionAccountsBySwapTransactionIdAndSenderIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<AccountAggregates[]>;
  /** A list of `Account` objects. */
  nodes: Maybe<Account>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Account` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Account` values, with data from `Swap`. */
export type TransactionAccountsBySwapTransactionIdAndSenderIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: AccountsGroupBy[];
  having?: InputMaybe<AccountsHavingInput>;
};

/** A `Account` edge in the connection, with data from `Swap`. */
export type TransactionAccountsBySwapTransactionIdAndSenderIdManyToManyEdge = {
  __typename?: 'TransactionAccountsBySwapTransactionIdAndSenderIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Account` at the end of the edge. */
  node?: Maybe<Account>;
  /** Reads and enables pagination through a set of `Swap`. */
  swap: SwapsConnection;
};


/** A `Account` edge in the connection, with data from `Swap`. */
export type TransactionAccountsBySwapTransactionIdAndSenderIdManyToManyEdgeSwapArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Swaps_Distinct_Enum>[]>;
  filter?: InputMaybe<SwapFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapsOrderBy[]>;
};

export type TransactionAggregates = {
  __typename?: 'TransactionAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<TransactionAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<TransactionDistinctCountAggregates>;
  keys?: Maybe<Scalars['String']['output'][]>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<TransactionMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<TransactionMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<TransactionStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<TransactionStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<TransactionSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<TransactionVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<TransactionVarianceSampleAggregates>;
};

export type TransactionAverageAggregates = {
  __typename?: 'TransactionAverageAggregates';
  /** Mean average of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of gasUsed across the matching connection */
  gasUsed?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>;
};

export type TransactionDistinctCountAggregates = {
  __typename?: 'TransactionDistinctCountAggregates';
  /** Distinct count of _blockRange across the matching connection */
  _blockRange?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of _id across the matching connection */
  _id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of events across the matching connection */
  events?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of gasUsed across the matching connection */
  gasUsed?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `Transaction` object types. All fields are combined with a logical ‘and.’ */
export type TransactionFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<TransactionFilter[]>;
  /** Filter by the object’s `blockNumber` field. */
  blockNumber?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `claimFees` relation. */
  claimFees?: InputMaybe<TransactionToManyClaimFeeFilter>;
  /** Some related `claimFees` exist. */
  claimFeesExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `events` field. */
  events?: InputMaybe<JsonFilter>;
  /** Filter by the object’s `gasUsed` field. */
  gasUsed?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TransactionFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<TransactionFilter[]>;
  /** Filter by the object’s `poolCreations` relation. */
  poolCreations?: InputMaybe<TransactionToManyPoolFilter>;
  /** Some related `poolCreations` exist. */
  poolCreationsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `poolTokenIncentives` relation. */
  poolTokenIncentives?: InputMaybe<TransactionToManyPoolTokenIncentiveFilter>;
  /** Some related `poolTokenIncentives` exist. */
  poolTokenIncentivesExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `positions` relation. */
  positions?: InputMaybe<TransactionToManyPositionFilter>;
  /** Some related `positions` exist. */
  positionsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `swap` relation. */
  swap?: InputMaybe<TransactionToManySwapFilter>;
  /** Some related `swap` exist. */
  swapExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `timestamp` field. */
  timestamp?: InputMaybe<BigFloatFilter>;
};

export type TransactionMaxAggregates = {
  __typename?: 'TransactionMaxAggregates';
  /** Maximum of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of gasUsed across the matching connection */
  gasUsed?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>;
};

export type TransactionMinAggregates = {
  __typename?: 'TransactionMinAggregates';
  /** Minimum of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of gasUsed across the matching connection */
  gasUsed?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `Pool` values, with data from `ClaimFee`. */
export type TransactionPoolsByClaimFeeTransactionIdAndPoolIdManyToManyConnection = {
  __typename?: 'TransactionPoolsByClaimFeeTransactionIdAndPoolIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<PoolAggregates>;
  /** A list of edges which contains the `Pool`, info from the `ClaimFee`, and the cursor to aid in pagination. */
  edges: TransactionPoolsByClaimFeeTransactionIdAndPoolIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<PoolAggregates[]>;
  /** A list of `Pool` objects. */
  nodes: Maybe<Pool>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Pool` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Pool` values, with data from `ClaimFee`. */
export type TransactionPoolsByClaimFeeTransactionIdAndPoolIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: PoolsGroupBy[];
  having?: InputMaybe<PoolsHavingInput>;
};

/** A `Pool` edge in the connection, with data from `ClaimFee`. */
export type TransactionPoolsByClaimFeeTransactionIdAndPoolIdManyToManyEdge = {
  __typename?: 'TransactionPoolsByClaimFeeTransactionIdAndPoolIdManyToManyEdge';
  /** Reads and enables pagination through a set of `ClaimFee`. */
  claimFees: ClaimFeesConnection;
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Pool` at the end of the edge. */
  node?: Maybe<Pool>;
};


/** A `Pool` edge in the connection, with data from `ClaimFee`. */
export type TransactionPoolsByClaimFeeTransactionIdAndPoolIdManyToManyEdgeClaimFeesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Claim_Fees_Distinct_Enum>[]>;
  filter?: InputMaybe<ClaimFeeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimFeesOrderBy[]>;
};

/** A connection to a list of `Pool` values, with data from `PoolTokenIncentive`. */
export type TransactionPoolsByPoolTokenIncentiveTransactionIdAndPoolIdManyToManyConnection = {
  __typename?: 'TransactionPoolsByPoolTokenIncentiveTransactionIdAndPoolIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<PoolAggregates>;
  /** A list of edges which contains the `Pool`, info from the `PoolTokenIncentive`, and the cursor to aid in pagination. */
  edges: TransactionPoolsByPoolTokenIncentiveTransactionIdAndPoolIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<PoolAggregates[]>;
  /** A list of `Pool` objects. */
  nodes: Maybe<Pool>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Pool` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Pool` values, with data from `PoolTokenIncentive`. */
export type TransactionPoolsByPoolTokenIncentiveTransactionIdAndPoolIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: PoolsGroupBy[];
  having?: InputMaybe<PoolsHavingInput>;
};

/** A `Pool` edge in the connection, with data from `PoolTokenIncentive`. */
export type TransactionPoolsByPoolTokenIncentiveTransactionIdAndPoolIdManyToManyEdge = {
  __typename?: 'TransactionPoolsByPoolTokenIncentiveTransactionIdAndPoolIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Pool` at the end of the edge. */
  node?: Maybe<Pool>;
  /** Reads and enables pagination through a set of `PoolTokenIncentive`. */
  poolTokenIncentives: PoolTokenIncentivesConnection;
};


/** A `Pool` edge in the connection, with data from `PoolTokenIncentive`. */
export type TransactionPoolsByPoolTokenIncentiveTransactionIdAndPoolIdManyToManyEdgePoolTokenIncentivesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pool_Token_Incentives_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolTokenIncentiveFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolTokenIncentivesOrderBy[]>;
};

/** A connection to a list of `Pool` values, with data from `Position`. */
export type TransactionPoolsByPositionTransactionIdAndPoolIdManyToManyConnection = {
  __typename?: 'TransactionPoolsByPositionTransactionIdAndPoolIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<PoolAggregates>;
  /** A list of edges which contains the `Pool`, info from the `Position`, and the cursor to aid in pagination. */
  edges: TransactionPoolsByPositionTransactionIdAndPoolIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<PoolAggregates[]>;
  /** A list of `Pool` objects. */
  nodes: Maybe<Pool>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Pool` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Pool` values, with data from `Position`. */
export type TransactionPoolsByPositionTransactionIdAndPoolIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: PoolsGroupBy[];
  having?: InputMaybe<PoolsHavingInput>;
};

/** A `Pool` edge in the connection, with data from `Position`. */
export type TransactionPoolsByPositionTransactionIdAndPoolIdManyToManyEdge = {
  __typename?: 'TransactionPoolsByPositionTransactionIdAndPoolIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Pool` at the end of the edge. */
  node?: Maybe<Pool>;
  /** Reads and enables pagination through a set of `Position`. */
  positions: PositionsConnection;
};


/** A `Pool` edge in the connection, with data from `Position`. */
export type TransactionPoolsByPositionTransactionIdAndPoolIdManyToManyEdgePositionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Positions_Distinct_Enum>[]>;
  filter?: InputMaybe<PositionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionsOrderBy[]>;
};

/** A connection to a list of `Position` values, with data from `ClaimFee`. */
export type TransactionPositionsByClaimFeeTransactionIdAndPositionIdManyToManyConnection = {
  __typename?: 'TransactionPositionsByClaimFeeTransactionIdAndPositionIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<PositionAggregates>;
  /** A list of edges which contains the `Position`, info from the `ClaimFee`, and the cursor to aid in pagination. */
  edges: TransactionPositionsByClaimFeeTransactionIdAndPositionIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<PositionAggregates[]>;
  /** A list of `Position` objects. */
  nodes: Maybe<Position>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Position` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Position` values, with data from `ClaimFee`. */
export type TransactionPositionsByClaimFeeTransactionIdAndPositionIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: PositionsGroupBy[];
  having?: InputMaybe<PositionsHavingInput>;
};

/** A `Position` edge in the connection, with data from `ClaimFee`. */
export type TransactionPositionsByClaimFeeTransactionIdAndPositionIdManyToManyEdge = {
  __typename?: 'TransactionPositionsByClaimFeeTransactionIdAndPositionIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** Reads and enables pagination through a set of `ClaimFee`. */
  fees: ClaimFeesConnection;
  /** The `Position` at the end of the edge. */
  node?: Maybe<Position>;
};


/** A `Position` edge in the connection, with data from `ClaimFee`. */
export type TransactionPositionsByClaimFeeTransactionIdAndPositionIdManyToManyEdgeFeesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Claim_Fees_Distinct_Enum>[]>;
  filter?: InputMaybe<ClaimFeeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ClaimFeesOrderBy[]>;
};

export type TransactionStddevPopulationAggregates = {
  __typename?: 'TransactionStddevPopulationAggregates';
  /** Population standard deviation of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of gasUsed across the matching connection */
  gasUsed?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>;
};

export type TransactionStddevSampleAggregates = {
  __typename?: 'TransactionStddevSampleAggregates';
  /** Sample standard deviation of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of gasUsed across the matching connection */
  gasUsed?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>;
};

export type TransactionSumAggregates = {
  __typename?: 'TransactionSumAggregates';
  /** Sum of blockNumber across the matching connection */
  blockNumber: Scalars['BigFloat']['output'];
  /** Sum of gasUsed across the matching connection */
  gasUsed: Scalars['BigFloat']['output'];
  /** Sum of timestamp across the matching connection */
  timestamp: Scalars['BigFloat']['output'];
};

/** A filter to be used against many `ClaimFee` object types. All fields are combined with a logical ‘and.’ */
export type TransactionToManyClaimFeeFilter = {
  /** Aggregates across related `ClaimFee` match the filter criteria. */
  aggregates?: InputMaybe<ClaimFeeAggregatesFilter>;
  /** Every related `ClaimFee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ClaimFeeFilter>;
  /** No related `ClaimFee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ClaimFeeFilter>;
  /** Some related `ClaimFee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ClaimFeeFilter>;
};

/** A filter to be used against many `Pool` object types. All fields are combined with a logical ‘and.’ */
export type TransactionToManyPoolFilter = {
  /** Aggregates across related `Pool` match the filter criteria. */
  aggregates?: InputMaybe<PoolAggregatesFilter>;
  /** Every related `Pool` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<PoolFilter>;
  /** No related `Pool` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<PoolFilter>;
  /** Some related `Pool` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<PoolFilter>;
};

/** A filter to be used against many `PoolTokenIncentive` object types. All fields are combined with a logical ‘and.’ */
export type TransactionToManyPoolTokenIncentiveFilter = {
  /** Aggregates across related `PoolTokenIncentive` match the filter criteria. */
  aggregates?: InputMaybe<PoolTokenIncentiveAggregatesFilter>;
  /** Every related `PoolTokenIncentive` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<PoolTokenIncentiveFilter>;
  /** No related `PoolTokenIncentive` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<PoolTokenIncentiveFilter>;
  /** Some related `PoolTokenIncentive` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<PoolTokenIncentiveFilter>;
};

/** A filter to be used against many `Position` object types. All fields are combined with a logical ‘and.’ */
export type TransactionToManyPositionFilter = {
  /** Aggregates across related `Position` match the filter criteria. */
  aggregates?: InputMaybe<PositionAggregatesFilter>;
  /** Every related `Position` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<PositionFilter>;
  /** No related `Position` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<PositionFilter>;
  /** Some related `Position` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<PositionFilter>;
};

/** A filter to be used against many `Swap` object types. All fields are combined with a logical ‘and.’ */
export type TransactionToManySwapFilter = {
  /** Aggregates across related `Swap` match the filter criteria. */
  aggregates?: InputMaybe<SwapAggregatesFilter>;
  /** Every related `Swap` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SwapFilter>;
  /** No related `Swap` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SwapFilter>;
  /** Some related `Swap` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SwapFilter>;
};

/** A connection to a list of `Token` values, with data from `PoolTokenIncentive`. */
export type TransactionTokensByPoolTokenIncentiveTransactionIdAndTokenIdManyToManyConnection = {
  __typename?: 'TransactionTokensByPoolTokenIncentiveTransactionIdAndTokenIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TokenAggregates>;
  /** A list of edges which contains the `Token`, info from the `PoolTokenIncentive`, and the cursor to aid in pagination. */
  edges: TransactionTokensByPoolTokenIncentiveTransactionIdAndTokenIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TokenAggregates[]>;
  /** A list of `Token` objects. */
  nodes: Maybe<Token>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Token` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Token` values, with data from `PoolTokenIncentive`. */
export type TransactionTokensByPoolTokenIncentiveTransactionIdAndTokenIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TokensGroupBy[];
  having?: InputMaybe<TokensHavingInput>;
};

/** A `Token` edge in the connection, with data from `PoolTokenIncentive`. */
export type TransactionTokensByPoolTokenIncentiveTransactionIdAndTokenIdManyToManyEdge = {
  __typename?: 'TransactionTokensByPoolTokenIncentiveTransactionIdAndTokenIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Token` at the end of the edge. */
  node?: Maybe<Token>;
  /** Reads and enables pagination through a set of `PoolTokenIncentive`. */
  poolTokenIncentives: PoolTokenIncentivesConnection;
};


/** A `Token` edge in the connection, with data from `PoolTokenIncentive`. */
export type TransactionTokensByPoolTokenIncentiveTransactionIdAndTokenIdManyToManyEdgePoolTokenIncentivesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pool_Token_Incentives_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolTokenIncentiveFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolTokenIncentivesOrderBy[]>;
};

/** A connection to a list of `Token` values, with data from `Pool`. */
export type TransactionTokensByPoolTransactionIdAndTokenXIdManyToManyConnection = {
  __typename?: 'TransactionTokensByPoolTransactionIdAndTokenXIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TokenAggregates>;
  /** A list of edges which contains the `Token`, info from the `Pool`, and the cursor to aid in pagination. */
  edges: TransactionTokensByPoolTransactionIdAndTokenXIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TokenAggregates[]>;
  /** A list of `Token` objects. */
  nodes: Maybe<Token>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Token` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Token` values, with data from `Pool`. */
export type TransactionTokensByPoolTransactionIdAndTokenXIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TokensGroupBy[];
  having?: InputMaybe<TokensHavingInput>;
};

/** A `Token` edge in the connection, with data from `Pool`. */
export type TransactionTokensByPoolTransactionIdAndTokenXIdManyToManyEdge = {
  __typename?: 'TransactionTokensByPoolTransactionIdAndTokenXIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Token` at the end of the edge. */
  node?: Maybe<Token>;
  /** Reads and enables pagination through a set of `Pool`. */
  poolsByTokenXId: PoolsConnection;
};


/** A `Token` edge in the connection, with data from `Pool`. */
export type TransactionTokensByPoolTransactionIdAndTokenXIdManyToManyEdgePoolsByTokenXIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};

/** A connection to a list of `Token` values, with data from `Pool`. */
export type TransactionTokensByPoolTransactionIdAndTokenYIdManyToManyConnection = {
  __typename?: 'TransactionTokensByPoolTransactionIdAndTokenYIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TokenAggregates>;
  /** A list of edges which contains the `Token`, info from the `Pool`, and the cursor to aid in pagination. */
  edges: TransactionTokensByPoolTransactionIdAndTokenYIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TokenAggregates[]>;
  /** A list of `Token` objects. */
  nodes: Maybe<Token>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Token` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Token` values, with data from `Pool`. */
export type TransactionTokensByPoolTransactionIdAndTokenYIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TokensGroupBy[];
  having?: InputMaybe<TokensHavingInput>;
};

/** A `Token` edge in the connection, with data from `Pool`. */
export type TransactionTokensByPoolTransactionIdAndTokenYIdManyToManyEdge = {
  __typename?: 'TransactionTokensByPoolTransactionIdAndTokenYIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Token` at the end of the edge. */
  node?: Maybe<Token>;
  /** Reads and enables pagination through a set of `Pool`. */
  poolsByTokenYId: PoolsConnection;
};


/** A `Token` edge in the connection, with data from `Pool`. */
export type TransactionTokensByPoolTransactionIdAndTokenYIdManyToManyEdgePoolsByTokenYIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Pools_Distinct_Enum>[]>;
  filter?: InputMaybe<PoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolsOrderBy[]>;
};

/** A connection to a list of `Token` values, with data from `Swap`. */
export type TransactionTokensBySwapTransactionIdAndTokenInIdManyToManyConnection = {
  __typename?: 'TransactionTokensBySwapTransactionIdAndTokenInIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TokenAggregates>;
  /** A list of edges which contains the `Token`, info from the `Swap`, and the cursor to aid in pagination. */
  edges: TransactionTokensBySwapTransactionIdAndTokenInIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TokenAggregates[]>;
  /** A list of `Token` objects. */
  nodes: Maybe<Token>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Token` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Token` values, with data from `Swap`. */
export type TransactionTokensBySwapTransactionIdAndTokenInIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TokensGroupBy[];
  having?: InputMaybe<TokensHavingInput>;
};

/** A `Token` edge in the connection, with data from `Swap`. */
export type TransactionTokensBySwapTransactionIdAndTokenInIdManyToManyEdge = {
  __typename?: 'TransactionTokensBySwapTransactionIdAndTokenInIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Token` at the end of the edge. */
  node?: Maybe<Token>;
  /** Reads and enables pagination through a set of `Swap`. */
  swapsByTokenInId: SwapsConnection;
};


/** A `Token` edge in the connection, with data from `Swap`. */
export type TransactionTokensBySwapTransactionIdAndTokenInIdManyToManyEdgeSwapsByTokenInIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Swaps_Distinct_Enum>[]>;
  filter?: InputMaybe<SwapFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapsOrderBy[]>;
};

/** A connection to a list of `Token` values, with data from `Swap`. */
export type TransactionTokensBySwapTransactionIdAndTokenOutIdManyToManyConnection = {
  __typename?: 'TransactionTokensBySwapTransactionIdAndTokenOutIdManyToManyConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TokenAggregates>;
  /** A list of edges which contains the `Token`, info from the `Swap`, and the cursor to aid in pagination. */
  edges: TransactionTokensBySwapTransactionIdAndTokenOutIdManyToManyEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TokenAggregates[]>;
  /** A list of `Token` objects. */
  nodes: Maybe<Token>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Token` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Token` values, with data from `Swap`. */
export type TransactionTokensBySwapTransactionIdAndTokenOutIdManyToManyConnectionGroupedAggregatesArgs = {
  groupBy: TokensGroupBy[];
  having?: InputMaybe<TokensHavingInput>;
};

/** A `Token` edge in the connection, with data from `Swap`. */
export type TransactionTokensBySwapTransactionIdAndTokenOutIdManyToManyEdge = {
  __typename?: 'TransactionTokensBySwapTransactionIdAndTokenOutIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Token` at the end of the edge. */
  node?: Maybe<Token>;
  /** Reads and enables pagination through a set of `Swap`. */
  swapsByTokenOutId: SwapsConnection;
};


/** A `Token` edge in the connection, with data from `Swap`. */
export type TransactionTokensBySwapTransactionIdAndTokenOutIdManyToManyEdgeSwapsByTokenOutIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  blockHeight?: InputMaybe<Scalars['String']['input']>;
  distinct?: InputMaybe<InputMaybe<Swaps_Distinct_Enum>[]>;
  filter?: InputMaybe<SwapFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapsOrderBy[]>;
};

export type TransactionVariancePopulationAggregates = {
  __typename?: 'TransactionVariancePopulationAggregates';
  /** Population variance of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of gasUsed across the matching connection */
  gasUsed?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>;
};

export type TransactionVarianceSampleAggregates = {
  __typename?: 'TransactionVarianceSampleAggregates';
  /** Sample variance of blockNumber across the matching connection */
  blockNumber?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of gasUsed across the matching connection */
  gasUsed?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `Transaction` values. */
export type TransactionsConnection = {
  __typename?: 'TransactionsConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TransactionAggregates>;
  /** A list of edges which contains the `Transaction` and cursor to aid in pagination. */
  edges: TransactionsEdge[];
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<TransactionAggregates[]>;
  /** A list of `Transaction` objects. */
  nodes: Maybe<Transaction>[];
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Transaction` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Transaction` values. */
export type TransactionsConnectionGroupedAggregatesArgs = {
  groupBy: TransactionsGroupBy[];
  having?: InputMaybe<TransactionsHavingInput>;
};

/** A `Transaction` edge in the connection. */
export type TransactionsEdge = {
  __typename?: 'TransactionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Transaction` at the end of the edge. */
  node?: Maybe<Transaction>;
};

/** Grouping methods for `Transaction` for usage during aggregation. */
export enum TransactionsGroupBy {
  BlockNumber = 'BLOCK_NUMBER',
  Events = 'EVENTS',
  GasUsed = 'GAS_USED',
  Id = 'ID',
  Timestamp = 'TIMESTAMP'
}

export type TransactionsHavingAverageInput = {
  blockNumber?: InputMaybe<HavingBigfloatFilter>;
  gasUsed?: InputMaybe<HavingBigfloatFilter>;
  timestamp?: InputMaybe<HavingBigfloatFilter>;
};

export type TransactionsHavingDistinctCountInput = {
  blockNumber?: InputMaybe<HavingBigfloatFilter>;
  gasUsed?: InputMaybe<HavingBigfloatFilter>;
  timestamp?: InputMaybe<HavingBigfloatFilter>;
};

/** Conditions for `Transaction` aggregates. */
export type TransactionsHavingInput = {
  AND?: InputMaybe<TransactionsHavingInput[]>;
  OR?: InputMaybe<TransactionsHavingInput[]>;
  average?: InputMaybe<TransactionsHavingAverageInput>;
  distinctCount?: InputMaybe<TransactionsHavingDistinctCountInput>;
  max?: InputMaybe<TransactionsHavingMaxInput>;
  min?: InputMaybe<TransactionsHavingMinInput>;
  stddevPopulation?: InputMaybe<TransactionsHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<TransactionsHavingStddevSampleInput>;
  sum?: InputMaybe<TransactionsHavingSumInput>;
  variancePopulation?: InputMaybe<TransactionsHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<TransactionsHavingVarianceSampleInput>;
};

export type TransactionsHavingMaxInput = {
  blockNumber?: InputMaybe<HavingBigfloatFilter>;
  gasUsed?: InputMaybe<HavingBigfloatFilter>;
  timestamp?: InputMaybe<HavingBigfloatFilter>;
};

export type TransactionsHavingMinInput = {
  blockNumber?: InputMaybe<HavingBigfloatFilter>;
  gasUsed?: InputMaybe<HavingBigfloatFilter>;
  timestamp?: InputMaybe<HavingBigfloatFilter>;
};

export type TransactionsHavingStddevPopulationInput = {
  blockNumber?: InputMaybe<HavingBigfloatFilter>;
  gasUsed?: InputMaybe<HavingBigfloatFilter>;
  timestamp?: InputMaybe<HavingBigfloatFilter>;
};

export type TransactionsHavingStddevSampleInput = {
  blockNumber?: InputMaybe<HavingBigfloatFilter>;
  gasUsed?: InputMaybe<HavingBigfloatFilter>;
  timestamp?: InputMaybe<HavingBigfloatFilter>;
};

export type TransactionsHavingSumInput = {
  blockNumber?: InputMaybe<HavingBigfloatFilter>;
  gasUsed?: InputMaybe<HavingBigfloatFilter>;
  timestamp?: InputMaybe<HavingBigfloatFilter>;
};

export type TransactionsHavingVariancePopulationInput = {
  blockNumber?: InputMaybe<HavingBigfloatFilter>;
  gasUsed?: InputMaybe<HavingBigfloatFilter>;
  timestamp?: InputMaybe<HavingBigfloatFilter>;
};

export type TransactionsHavingVarianceSampleInput = {
  blockNumber?: InputMaybe<HavingBigfloatFilter>;
  gasUsed?: InputMaybe<HavingBigfloatFilter>;
  timestamp?: InputMaybe<HavingBigfloatFilter>;
};

/** Methods to use when ordering `Transaction`. */
export enum TransactionsOrderBy {
  BlockNumberAsc = 'BLOCK_NUMBER_ASC',
  BlockNumberDesc = 'BLOCK_NUMBER_DESC',
  ClaimFeesAverageAmountUSDAsc = 'CLAIM_FEES_AVERAGE_AMOUNT_U_S_D_ASC',
  ClaimFeesAverageAmountUSDDesc = 'CLAIM_FEES_AVERAGE_AMOUNT_U_S_D_DESC',
  ClaimFeesAverageAmountXAsc = 'CLAIM_FEES_AVERAGE_AMOUNT_X_ASC',
  ClaimFeesAverageAmountXDesc = 'CLAIM_FEES_AVERAGE_AMOUNT_X_DESC',
  ClaimFeesAverageAmountYAsc = 'CLAIM_FEES_AVERAGE_AMOUNT_Y_ASC',
  ClaimFeesAverageAmountYDesc = 'CLAIM_FEES_AVERAGE_AMOUNT_Y_DESC',
  ClaimFeesAverageBlockRangeAsc = 'CLAIM_FEES_AVERAGE_BLOCK_RANGE_ASC',
  ClaimFeesAverageBlockRangeDesc = 'CLAIM_FEES_AVERAGE_BLOCK_RANGE_DESC',
  ClaimFeesAverageIdAsc = 'CLAIM_FEES_AVERAGE_ID_ASC',
  ClaimFeesAverageIdDesc = 'CLAIM_FEES_AVERAGE_ID_DESC',
  ClaimFeesAverageOwnerIdAsc = 'CLAIM_FEES_AVERAGE_OWNER_ID_ASC',
  ClaimFeesAverageOwnerIdDesc = 'CLAIM_FEES_AVERAGE_OWNER_ID_DESC',
  ClaimFeesAveragePoolIdAsc = 'CLAIM_FEES_AVERAGE_POOL_ID_ASC',
  ClaimFeesAveragePoolIdDesc = 'CLAIM_FEES_AVERAGE_POOL_ID_DESC',
  ClaimFeesAveragePositionIdAsc = 'CLAIM_FEES_AVERAGE_POSITION_ID_ASC',
  ClaimFeesAveragePositionIdDesc = 'CLAIM_FEES_AVERAGE_POSITION_ID_DESC',
  ClaimFeesAverageTransactionIdAsc = 'CLAIM_FEES_AVERAGE_TRANSACTION_ID_ASC',
  ClaimFeesAverageTransactionIdDesc = 'CLAIM_FEES_AVERAGE_TRANSACTION_ID_DESC',
  ClaimFeesCountAsc = 'CLAIM_FEES_COUNT_ASC',
  ClaimFeesCountDesc = 'CLAIM_FEES_COUNT_DESC',
  ClaimFeesDistinctCountAmountUSDAsc = 'CLAIM_FEES_DISTINCT_COUNT_AMOUNT_U_S_D_ASC',
  ClaimFeesDistinctCountAmountUSDDesc = 'CLAIM_FEES_DISTINCT_COUNT_AMOUNT_U_S_D_DESC',
  ClaimFeesDistinctCountAmountXAsc = 'CLAIM_FEES_DISTINCT_COUNT_AMOUNT_X_ASC',
  ClaimFeesDistinctCountAmountXDesc = 'CLAIM_FEES_DISTINCT_COUNT_AMOUNT_X_DESC',
  ClaimFeesDistinctCountAmountYAsc = 'CLAIM_FEES_DISTINCT_COUNT_AMOUNT_Y_ASC',
  ClaimFeesDistinctCountAmountYDesc = 'CLAIM_FEES_DISTINCT_COUNT_AMOUNT_Y_DESC',
  ClaimFeesDistinctCountBlockRangeAsc = 'CLAIM_FEES_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  ClaimFeesDistinctCountBlockRangeDesc = 'CLAIM_FEES_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  ClaimFeesDistinctCountIdAsc = 'CLAIM_FEES_DISTINCT_COUNT_ID_ASC',
  ClaimFeesDistinctCountIdDesc = 'CLAIM_FEES_DISTINCT_COUNT_ID_DESC',
  ClaimFeesDistinctCountOwnerIdAsc = 'CLAIM_FEES_DISTINCT_COUNT_OWNER_ID_ASC',
  ClaimFeesDistinctCountOwnerIdDesc = 'CLAIM_FEES_DISTINCT_COUNT_OWNER_ID_DESC',
  ClaimFeesDistinctCountPoolIdAsc = 'CLAIM_FEES_DISTINCT_COUNT_POOL_ID_ASC',
  ClaimFeesDistinctCountPoolIdDesc = 'CLAIM_FEES_DISTINCT_COUNT_POOL_ID_DESC',
  ClaimFeesDistinctCountPositionIdAsc = 'CLAIM_FEES_DISTINCT_COUNT_POSITION_ID_ASC',
  ClaimFeesDistinctCountPositionIdDesc = 'CLAIM_FEES_DISTINCT_COUNT_POSITION_ID_DESC',
  ClaimFeesDistinctCountTransactionIdAsc = 'CLAIM_FEES_DISTINCT_COUNT_TRANSACTION_ID_ASC',
  ClaimFeesDistinctCountTransactionIdDesc = 'CLAIM_FEES_DISTINCT_COUNT_TRANSACTION_ID_DESC',
  ClaimFeesMaxAmountUSDAsc = 'CLAIM_FEES_MAX_AMOUNT_U_S_D_ASC',
  ClaimFeesMaxAmountUSDDesc = 'CLAIM_FEES_MAX_AMOUNT_U_S_D_DESC',
  ClaimFeesMaxAmountXAsc = 'CLAIM_FEES_MAX_AMOUNT_X_ASC',
  ClaimFeesMaxAmountXDesc = 'CLAIM_FEES_MAX_AMOUNT_X_DESC',
  ClaimFeesMaxAmountYAsc = 'CLAIM_FEES_MAX_AMOUNT_Y_ASC',
  ClaimFeesMaxAmountYDesc = 'CLAIM_FEES_MAX_AMOUNT_Y_DESC',
  ClaimFeesMaxBlockRangeAsc = 'CLAIM_FEES_MAX_BLOCK_RANGE_ASC',
  ClaimFeesMaxBlockRangeDesc = 'CLAIM_FEES_MAX_BLOCK_RANGE_DESC',
  ClaimFeesMaxIdAsc = 'CLAIM_FEES_MAX_ID_ASC',
  ClaimFeesMaxIdDesc = 'CLAIM_FEES_MAX_ID_DESC',
  ClaimFeesMaxOwnerIdAsc = 'CLAIM_FEES_MAX_OWNER_ID_ASC',
  ClaimFeesMaxOwnerIdDesc = 'CLAIM_FEES_MAX_OWNER_ID_DESC',
  ClaimFeesMaxPoolIdAsc = 'CLAIM_FEES_MAX_POOL_ID_ASC',
  ClaimFeesMaxPoolIdDesc = 'CLAIM_FEES_MAX_POOL_ID_DESC',
  ClaimFeesMaxPositionIdAsc = 'CLAIM_FEES_MAX_POSITION_ID_ASC',
  ClaimFeesMaxPositionIdDesc = 'CLAIM_FEES_MAX_POSITION_ID_DESC',
  ClaimFeesMaxTransactionIdAsc = 'CLAIM_FEES_MAX_TRANSACTION_ID_ASC',
  ClaimFeesMaxTransactionIdDesc = 'CLAIM_FEES_MAX_TRANSACTION_ID_DESC',
  ClaimFeesMinAmountUSDAsc = 'CLAIM_FEES_MIN_AMOUNT_U_S_D_ASC',
  ClaimFeesMinAmountUSDDesc = 'CLAIM_FEES_MIN_AMOUNT_U_S_D_DESC',
  ClaimFeesMinAmountXAsc = 'CLAIM_FEES_MIN_AMOUNT_X_ASC',
  ClaimFeesMinAmountXDesc = 'CLAIM_FEES_MIN_AMOUNT_X_DESC',
  ClaimFeesMinAmountYAsc = 'CLAIM_FEES_MIN_AMOUNT_Y_ASC',
  ClaimFeesMinAmountYDesc = 'CLAIM_FEES_MIN_AMOUNT_Y_DESC',
  ClaimFeesMinBlockRangeAsc = 'CLAIM_FEES_MIN_BLOCK_RANGE_ASC',
  ClaimFeesMinBlockRangeDesc = 'CLAIM_FEES_MIN_BLOCK_RANGE_DESC',
  ClaimFeesMinIdAsc = 'CLAIM_FEES_MIN_ID_ASC',
  ClaimFeesMinIdDesc = 'CLAIM_FEES_MIN_ID_DESC',
  ClaimFeesMinOwnerIdAsc = 'CLAIM_FEES_MIN_OWNER_ID_ASC',
  ClaimFeesMinOwnerIdDesc = 'CLAIM_FEES_MIN_OWNER_ID_DESC',
  ClaimFeesMinPoolIdAsc = 'CLAIM_FEES_MIN_POOL_ID_ASC',
  ClaimFeesMinPoolIdDesc = 'CLAIM_FEES_MIN_POOL_ID_DESC',
  ClaimFeesMinPositionIdAsc = 'CLAIM_FEES_MIN_POSITION_ID_ASC',
  ClaimFeesMinPositionIdDesc = 'CLAIM_FEES_MIN_POSITION_ID_DESC',
  ClaimFeesMinTransactionIdAsc = 'CLAIM_FEES_MIN_TRANSACTION_ID_ASC',
  ClaimFeesMinTransactionIdDesc = 'CLAIM_FEES_MIN_TRANSACTION_ID_DESC',
  ClaimFeesStddevPopulationAmountUSDAsc = 'CLAIM_FEES_STDDEV_POPULATION_AMOUNT_U_S_D_ASC',
  ClaimFeesStddevPopulationAmountUSDDesc = 'CLAIM_FEES_STDDEV_POPULATION_AMOUNT_U_S_D_DESC',
  ClaimFeesStddevPopulationAmountXAsc = 'CLAIM_FEES_STDDEV_POPULATION_AMOUNT_X_ASC',
  ClaimFeesStddevPopulationAmountXDesc = 'CLAIM_FEES_STDDEV_POPULATION_AMOUNT_X_DESC',
  ClaimFeesStddevPopulationAmountYAsc = 'CLAIM_FEES_STDDEV_POPULATION_AMOUNT_Y_ASC',
  ClaimFeesStddevPopulationAmountYDesc = 'CLAIM_FEES_STDDEV_POPULATION_AMOUNT_Y_DESC',
  ClaimFeesStddevPopulationBlockRangeAsc = 'CLAIM_FEES_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  ClaimFeesStddevPopulationBlockRangeDesc = 'CLAIM_FEES_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  ClaimFeesStddevPopulationIdAsc = 'CLAIM_FEES_STDDEV_POPULATION_ID_ASC',
  ClaimFeesStddevPopulationIdDesc = 'CLAIM_FEES_STDDEV_POPULATION_ID_DESC',
  ClaimFeesStddevPopulationOwnerIdAsc = 'CLAIM_FEES_STDDEV_POPULATION_OWNER_ID_ASC',
  ClaimFeesStddevPopulationOwnerIdDesc = 'CLAIM_FEES_STDDEV_POPULATION_OWNER_ID_DESC',
  ClaimFeesStddevPopulationPoolIdAsc = 'CLAIM_FEES_STDDEV_POPULATION_POOL_ID_ASC',
  ClaimFeesStddevPopulationPoolIdDesc = 'CLAIM_FEES_STDDEV_POPULATION_POOL_ID_DESC',
  ClaimFeesStddevPopulationPositionIdAsc = 'CLAIM_FEES_STDDEV_POPULATION_POSITION_ID_ASC',
  ClaimFeesStddevPopulationPositionIdDesc = 'CLAIM_FEES_STDDEV_POPULATION_POSITION_ID_DESC',
  ClaimFeesStddevPopulationTransactionIdAsc = 'CLAIM_FEES_STDDEV_POPULATION_TRANSACTION_ID_ASC',
  ClaimFeesStddevPopulationTransactionIdDesc = 'CLAIM_FEES_STDDEV_POPULATION_TRANSACTION_ID_DESC',
  ClaimFeesStddevSampleAmountUSDAsc = 'CLAIM_FEES_STDDEV_SAMPLE_AMOUNT_U_S_D_ASC',
  ClaimFeesStddevSampleAmountUSDDesc = 'CLAIM_FEES_STDDEV_SAMPLE_AMOUNT_U_S_D_DESC',
  ClaimFeesStddevSampleAmountXAsc = 'CLAIM_FEES_STDDEV_SAMPLE_AMOUNT_X_ASC',
  ClaimFeesStddevSampleAmountXDesc = 'CLAIM_FEES_STDDEV_SAMPLE_AMOUNT_X_DESC',
  ClaimFeesStddevSampleAmountYAsc = 'CLAIM_FEES_STDDEV_SAMPLE_AMOUNT_Y_ASC',
  ClaimFeesStddevSampleAmountYDesc = 'CLAIM_FEES_STDDEV_SAMPLE_AMOUNT_Y_DESC',
  ClaimFeesStddevSampleBlockRangeAsc = 'CLAIM_FEES_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  ClaimFeesStddevSampleBlockRangeDesc = 'CLAIM_FEES_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  ClaimFeesStddevSampleIdAsc = 'CLAIM_FEES_STDDEV_SAMPLE_ID_ASC',
  ClaimFeesStddevSampleIdDesc = 'CLAIM_FEES_STDDEV_SAMPLE_ID_DESC',
  ClaimFeesStddevSampleOwnerIdAsc = 'CLAIM_FEES_STDDEV_SAMPLE_OWNER_ID_ASC',
  ClaimFeesStddevSampleOwnerIdDesc = 'CLAIM_FEES_STDDEV_SAMPLE_OWNER_ID_DESC',
  ClaimFeesStddevSamplePoolIdAsc = 'CLAIM_FEES_STDDEV_SAMPLE_POOL_ID_ASC',
  ClaimFeesStddevSamplePoolIdDesc = 'CLAIM_FEES_STDDEV_SAMPLE_POOL_ID_DESC',
  ClaimFeesStddevSamplePositionIdAsc = 'CLAIM_FEES_STDDEV_SAMPLE_POSITION_ID_ASC',
  ClaimFeesStddevSamplePositionIdDesc = 'CLAIM_FEES_STDDEV_SAMPLE_POSITION_ID_DESC',
  ClaimFeesStddevSampleTransactionIdAsc = 'CLAIM_FEES_STDDEV_SAMPLE_TRANSACTION_ID_ASC',
  ClaimFeesStddevSampleTransactionIdDesc = 'CLAIM_FEES_STDDEV_SAMPLE_TRANSACTION_ID_DESC',
  ClaimFeesSumAmountUSDAsc = 'CLAIM_FEES_SUM_AMOUNT_U_S_D_ASC',
  ClaimFeesSumAmountUSDDesc = 'CLAIM_FEES_SUM_AMOUNT_U_S_D_DESC',
  ClaimFeesSumAmountXAsc = 'CLAIM_FEES_SUM_AMOUNT_X_ASC',
  ClaimFeesSumAmountXDesc = 'CLAIM_FEES_SUM_AMOUNT_X_DESC',
  ClaimFeesSumAmountYAsc = 'CLAIM_FEES_SUM_AMOUNT_Y_ASC',
  ClaimFeesSumAmountYDesc = 'CLAIM_FEES_SUM_AMOUNT_Y_DESC',
  ClaimFeesSumBlockRangeAsc = 'CLAIM_FEES_SUM_BLOCK_RANGE_ASC',
  ClaimFeesSumBlockRangeDesc = 'CLAIM_FEES_SUM_BLOCK_RANGE_DESC',
  ClaimFeesSumIdAsc = 'CLAIM_FEES_SUM_ID_ASC',
  ClaimFeesSumIdDesc = 'CLAIM_FEES_SUM_ID_DESC',
  ClaimFeesSumOwnerIdAsc = 'CLAIM_FEES_SUM_OWNER_ID_ASC',
  ClaimFeesSumOwnerIdDesc = 'CLAIM_FEES_SUM_OWNER_ID_DESC',
  ClaimFeesSumPoolIdAsc = 'CLAIM_FEES_SUM_POOL_ID_ASC',
  ClaimFeesSumPoolIdDesc = 'CLAIM_FEES_SUM_POOL_ID_DESC',
  ClaimFeesSumPositionIdAsc = 'CLAIM_FEES_SUM_POSITION_ID_ASC',
  ClaimFeesSumPositionIdDesc = 'CLAIM_FEES_SUM_POSITION_ID_DESC',
  ClaimFeesSumTransactionIdAsc = 'CLAIM_FEES_SUM_TRANSACTION_ID_ASC',
  ClaimFeesSumTransactionIdDesc = 'CLAIM_FEES_SUM_TRANSACTION_ID_DESC',
  ClaimFeesVariancePopulationAmountUSDAsc = 'CLAIM_FEES_VARIANCE_POPULATION_AMOUNT_U_S_D_ASC',
  ClaimFeesVariancePopulationAmountUSDDesc = 'CLAIM_FEES_VARIANCE_POPULATION_AMOUNT_U_S_D_DESC',
  ClaimFeesVariancePopulationAmountXAsc = 'CLAIM_FEES_VARIANCE_POPULATION_AMOUNT_X_ASC',
  ClaimFeesVariancePopulationAmountXDesc = 'CLAIM_FEES_VARIANCE_POPULATION_AMOUNT_X_DESC',
  ClaimFeesVariancePopulationAmountYAsc = 'CLAIM_FEES_VARIANCE_POPULATION_AMOUNT_Y_ASC',
  ClaimFeesVariancePopulationAmountYDesc = 'CLAIM_FEES_VARIANCE_POPULATION_AMOUNT_Y_DESC',
  ClaimFeesVariancePopulationBlockRangeAsc = 'CLAIM_FEES_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  ClaimFeesVariancePopulationBlockRangeDesc = 'CLAIM_FEES_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  ClaimFeesVariancePopulationIdAsc = 'CLAIM_FEES_VARIANCE_POPULATION_ID_ASC',
  ClaimFeesVariancePopulationIdDesc = 'CLAIM_FEES_VARIANCE_POPULATION_ID_DESC',
  ClaimFeesVariancePopulationOwnerIdAsc = 'CLAIM_FEES_VARIANCE_POPULATION_OWNER_ID_ASC',
  ClaimFeesVariancePopulationOwnerIdDesc = 'CLAIM_FEES_VARIANCE_POPULATION_OWNER_ID_DESC',
  ClaimFeesVariancePopulationPoolIdAsc = 'CLAIM_FEES_VARIANCE_POPULATION_POOL_ID_ASC',
  ClaimFeesVariancePopulationPoolIdDesc = 'CLAIM_FEES_VARIANCE_POPULATION_POOL_ID_DESC',
  ClaimFeesVariancePopulationPositionIdAsc = 'CLAIM_FEES_VARIANCE_POPULATION_POSITION_ID_ASC',
  ClaimFeesVariancePopulationPositionIdDesc = 'CLAIM_FEES_VARIANCE_POPULATION_POSITION_ID_DESC',
  ClaimFeesVariancePopulationTransactionIdAsc = 'CLAIM_FEES_VARIANCE_POPULATION_TRANSACTION_ID_ASC',
  ClaimFeesVariancePopulationTransactionIdDesc = 'CLAIM_FEES_VARIANCE_POPULATION_TRANSACTION_ID_DESC',
  ClaimFeesVarianceSampleAmountUSDAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_AMOUNT_U_S_D_ASC',
  ClaimFeesVarianceSampleAmountUSDDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_AMOUNT_U_S_D_DESC',
  ClaimFeesVarianceSampleAmountXAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_AMOUNT_X_ASC',
  ClaimFeesVarianceSampleAmountXDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_AMOUNT_X_DESC',
  ClaimFeesVarianceSampleAmountYAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_AMOUNT_Y_ASC',
  ClaimFeesVarianceSampleAmountYDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_AMOUNT_Y_DESC',
  ClaimFeesVarianceSampleBlockRangeAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  ClaimFeesVarianceSampleBlockRangeDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  ClaimFeesVarianceSampleIdAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_ID_ASC',
  ClaimFeesVarianceSampleIdDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_ID_DESC',
  ClaimFeesVarianceSampleOwnerIdAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_OWNER_ID_ASC',
  ClaimFeesVarianceSampleOwnerIdDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_OWNER_ID_DESC',
  ClaimFeesVarianceSamplePoolIdAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_POOL_ID_ASC',
  ClaimFeesVarianceSamplePoolIdDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_POOL_ID_DESC',
  ClaimFeesVarianceSamplePositionIdAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_POSITION_ID_ASC',
  ClaimFeesVarianceSamplePositionIdDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_POSITION_ID_DESC',
  ClaimFeesVarianceSampleTransactionIdAsc = 'CLAIM_FEES_VARIANCE_SAMPLE_TRANSACTION_ID_ASC',
  ClaimFeesVarianceSampleTransactionIdDesc = 'CLAIM_FEES_VARIANCE_SAMPLE_TRANSACTION_ID_DESC',
  EventsAsc = 'EVENTS_ASC',
  EventsDesc = 'EVENTS_DESC',
  GasUsedAsc = 'GAS_USED_ASC',
  GasUsedDesc = 'GAS_USED_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PoolCreationsAverageBlockRangeAsc = 'POOL_CREATIONS_AVERAGE_BLOCK_RANGE_ASC',
  PoolCreationsAverageBlockRangeDesc = 'POOL_CREATIONS_AVERAGE_BLOCK_RANGE_DESC',
  PoolCreationsAverageCollectedFeesTokenXAsc = 'POOL_CREATIONS_AVERAGE_COLLECTED_FEES_TOKEN_X_ASC',
  PoolCreationsAverageCollectedFeesTokenXDesc = 'POOL_CREATIONS_AVERAGE_COLLECTED_FEES_TOKEN_X_DESC',
  PoolCreationsAverageCollectedFeesTokenYAsc = 'POOL_CREATIONS_AVERAGE_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolCreationsAverageCollectedFeesTokenYDesc = 'POOL_CREATIONS_AVERAGE_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolCreationsAverageCollectedFeesUSDAsc = 'POOL_CREATIONS_AVERAGE_COLLECTED_FEES_U_S_D_ASC',
  PoolCreationsAverageCollectedFeesUSDDesc = 'POOL_CREATIONS_AVERAGE_COLLECTED_FEES_U_S_D_DESC',
  PoolCreationsAverageCreatedAtAsc = 'POOL_CREATIONS_AVERAGE_CREATED_AT_ASC',
  PoolCreationsAverageCreatedAtBlockNumberAsc = 'POOL_CREATIONS_AVERAGE_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolCreationsAverageCreatedAtBlockNumberDesc = 'POOL_CREATIONS_AVERAGE_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolCreationsAverageCreatedAtDesc = 'POOL_CREATIONS_AVERAGE_CREATED_AT_DESC',
  PoolCreationsAverageCurrentTickAsc = 'POOL_CREATIONS_AVERAGE_CURRENT_TICK_ASC',
  PoolCreationsAverageCurrentTickDesc = 'POOL_CREATIONS_AVERAGE_CURRENT_TICK_DESC',
  PoolCreationsAverageFeesUSDAsc = 'POOL_CREATIONS_AVERAGE_FEES_U_S_D_ASC',
  PoolCreationsAverageFeesUSDDesc = 'POOL_CREATIONS_AVERAGE_FEES_U_S_D_DESC',
  PoolCreationsAverageFeeAsc = 'POOL_CREATIONS_AVERAGE_FEE_ASC',
  PoolCreationsAverageFeeDesc = 'POOL_CREATIONS_AVERAGE_FEE_DESC',
  PoolCreationsAverageIdAsc = 'POOL_CREATIONS_AVERAGE_ID_ASC',
  PoolCreationsAverageIdDesc = 'POOL_CREATIONS_AVERAGE_ID_DESC',
  PoolCreationsAverageLiquidityAsc = 'POOL_CREATIONS_AVERAGE_LIQUIDITY_ASC',
  PoolCreationsAverageLiquidityDesc = 'POOL_CREATIONS_AVERAGE_LIQUIDITY_DESC',
  PoolCreationsAveragePoolCreatorIdAsc = 'POOL_CREATIONS_AVERAGE_POOL_CREATOR_ID_ASC',
  PoolCreationsAveragePoolCreatorIdDesc = 'POOL_CREATIONS_AVERAGE_POOL_CREATOR_ID_DESC',
  PoolCreationsAverageSqrtPriceAsc = 'POOL_CREATIONS_AVERAGE_SQRT_PRICE_ASC',
  PoolCreationsAverageSqrtPriceDesc = 'POOL_CREATIONS_AVERAGE_SQRT_PRICE_DESC',
  PoolCreationsAverageTickSpacingAsc = 'POOL_CREATIONS_AVERAGE_TICK_SPACING_ASC',
  PoolCreationsAverageTickSpacingDesc = 'POOL_CREATIONS_AVERAGE_TICK_SPACING_DESC',
  PoolCreationsAverageTokenXIdAsc = 'POOL_CREATIONS_AVERAGE_TOKEN_X_ID_ASC',
  PoolCreationsAverageTokenXIdDesc = 'POOL_CREATIONS_AVERAGE_TOKEN_X_ID_DESC',
  PoolCreationsAverageTokenYIdAsc = 'POOL_CREATIONS_AVERAGE_TOKEN_Y_ID_ASC',
  PoolCreationsAverageTokenYIdDesc = 'POOL_CREATIONS_AVERAGE_TOKEN_Y_ID_DESC',
  PoolCreationsAverageTotalValueLockedTokenXAsc = 'POOL_CREATIONS_AVERAGE_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolCreationsAverageTotalValueLockedTokenXDesc = 'POOL_CREATIONS_AVERAGE_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolCreationsAverageTotalValueLockedTokenYAsc = 'POOL_CREATIONS_AVERAGE_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolCreationsAverageTotalValueLockedTokenYDesc = 'POOL_CREATIONS_AVERAGE_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolCreationsAverageTotalValueLockedUSDAsc = 'POOL_CREATIONS_AVERAGE_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolCreationsAverageTotalValueLockedUSDDesc = 'POOL_CREATIONS_AVERAGE_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolCreationsAverageTransactionIdAsc = 'POOL_CREATIONS_AVERAGE_TRANSACTION_ID_ASC',
  PoolCreationsAverageTransactionIdDesc = 'POOL_CREATIONS_AVERAGE_TRANSACTION_ID_DESC',
  PoolCreationsAverageTxCountAsc = 'POOL_CREATIONS_AVERAGE_TX_COUNT_ASC',
  PoolCreationsAverageTxCountDesc = 'POOL_CREATIONS_AVERAGE_TX_COUNT_DESC',
  PoolCreationsAverageUpdatedAtAsc = 'POOL_CREATIONS_AVERAGE_UPDATED_AT_ASC',
  PoolCreationsAverageUpdatedAtDesc = 'POOL_CREATIONS_AVERAGE_UPDATED_AT_DESC',
  PoolCreationsAverageVolumeTokenXAsc = 'POOL_CREATIONS_AVERAGE_VOLUME_TOKEN_X_ASC',
  PoolCreationsAverageVolumeTokenXDesc = 'POOL_CREATIONS_AVERAGE_VOLUME_TOKEN_X_DESC',
  PoolCreationsAverageVolumeTokenYAsc = 'POOL_CREATIONS_AVERAGE_VOLUME_TOKEN_Y_ASC',
  PoolCreationsAverageVolumeTokenYDesc = 'POOL_CREATIONS_AVERAGE_VOLUME_TOKEN_Y_DESC',
  PoolCreationsAverageVolumeUSDAsc = 'POOL_CREATIONS_AVERAGE_VOLUME_U_S_D_ASC',
  PoolCreationsAverageVolumeUSDDesc = 'POOL_CREATIONS_AVERAGE_VOLUME_U_S_D_DESC',
  PoolCreationsCountAsc = 'POOL_CREATIONS_COUNT_ASC',
  PoolCreationsCountDesc = 'POOL_CREATIONS_COUNT_DESC',
  PoolCreationsDistinctCountBlockRangeAsc = 'POOL_CREATIONS_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  PoolCreationsDistinctCountBlockRangeDesc = 'POOL_CREATIONS_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  PoolCreationsDistinctCountCollectedFeesTokenXAsc = 'POOL_CREATIONS_DISTINCT_COUNT_COLLECTED_FEES_TOKEN_X_ASC',
  PoolCreationsDistinctCountCollectedFeesTokenXDesc = 'POOL_CREATIONS_DISTINCT_COUNT_COLLECTED_FEES_TOKEN_X_DESC',
  PoolCreationsDistinctCountCollectedFeesTokenYAsc = 'POOL_CREATIONS_DISTINCT_COUNT_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolCreationsDistinctCountCollectedFeesTokenYDesc = 'POOL_CREATIONS_DISTINCT_COUNT_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolCreationsDistinctCountCollectedFeesUSDAsc = 'POOL_CREATIONS_DISTINCT_COUNT_COLLECTED_FEES_U_S_D_ASC',
  PoolCreationsDistinctCountCollectedFeesUSDDesc = 'POOL_CREATIONS_DISTINCT_COUNT_COLLECTED_FEES_U_S_D_DESC',
  PoolCreationsDistinctCountCreatedAtAsc = 'POOL_CREATIONS_DISTINCT_COUNT_CREATED_AT_ASC',
  PoolCreationsDistinctCountCreatedAtBlockNumberAsc = 'POOL_CREATIONS_DISTINCT_COUNT_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolCreationsDistinctCountCreatedAtBlockNumberDesc = 'POOL_CREATIONS_DISTINCT_COUNT_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolCreationsDistinctCountCreatedAtDesc = 'POOL_CREATIONS_DISTINCT_COUNT_CREATED_AT_DESC',
  PoolCreationsDistinctCountCurrentTickAsc = 'POOL_CREATIONS_DISTINCT_COUNT_CURRENT_TICK_ASC',
  PoolCreationsDistinctCountCurrentTickDesc = 'POOL_CREATIONS_DISTINCT_COUNT_CURRENT_TICK_DESC',
  PoolCreationsDistinctCountFeesUSDAsc = 'POOL_CREATIONS_DISTINCT_COUNT_FEES_U_S_D_ASC',
  PoolCreationsDistinctCountFeesUSDDesc = 'POOL_CREATIONS_DISTINCT_COUNT_FEES_U_S_D_DESC',
  PoolCreationsDistinctCountFeeAsc = 'POOL_CREATIONS_DISTINCT_COUNT_FEE_ASC',
  PoolCreationsDistinctCountFeeDesc = 'POOL_CREATIONS_DISTINCT_COUNT_FEE_DESC',
  PoolCreationsDistinctCountIdAsc = 'POOL_CREATIONS_DISTINCT_COUNT_ID_ASC',
  PoolCreationsDistinctCountIdDesc = 'POOL_CREATIONS_DISTINCT_COUNT_ID_DESC',
  PoolCreationsDistinctCountLiquidityAsc = 'POOL_CREATIONS_DISTINCT_COUNT_LIQUIDITY_ASC',
  PoolCreationsDistinctCountLiquidityDesc = 'POOL_CREATIONS_DISTINCT_COUNT_LIQUIDITY_DESC',
  PoolCreationsDistinctCountPoolCreatorIdAsc = 'POOL_CREATIONS_DISTINCT_COUNT_POOL_CREATOR_ID_ASC',
  PoolCreationsDistinctCountPoolCreatorIdDesc = 'POOL_CREATIONS_DISTINCT_COUNT_POOL_CREATOR_ID_DESC',
  PoolCreationsDistinctCountSqrtPriceAsc = 'POOL_CREATIONS_DISTINCT_COUNT_SQRT_PRICE_ASC',
  PoolCreationsDistinctCountSqrtPriceDesc = 'POOL_CREATIONS_DISTINCT_COUNT_SQRT_PRICE_DESC',
  PoolCreationsDistinctCountTickSpacingAsc = 'POOL_CREATIONS_DISTINCT_COUNT_TICK_SPACING_ASC',
  PoolCreationsDistinctCountTickSpacingDesc = 'POOL_CREATIONS_DISTINCT_COUNT_TICK_SPACING_DESC',
  PoolCreationsDistinctCountTokenXIdAsc = 'POOL_CREATIONS_DISTINCT_COUNT_TOKEN_X_ID_ASC',
  PoolCreationsDistinctCountTokenXIdDesc = 'POOL_CREATIONS_DISTINCT_COUNT_TOKEN_X_ID_DESC',
  PoolCreationsDistinctCountTokenYIdAsc = 'POOL_CREATIONS_DISTINCT_COUNT_TOKEN_Y_ID_ASC',
  PoolCreationsDistinctCountTokenYIdDesc = 'POOL_CREATIONS_DISTINCT_COUNT_TOKEN_Y_ID_DESC',
  PoolCreationsDistinctCountTotalValueLockedTokenXAsc = 'POOL_CREATIONS_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolCreationsDistinctCountTotalValueLockedTokenXDesc = 'POOL_CREATIONS_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolCreationsDistinctCountTotalValueLockedTokenYAsc = 'POOL_CREATIONS_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolCreationsDistinctCountTotalValueLockedTokenYDesc = 'POOL_CREATIONS_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolCreationsDistinctCountTotalValueLockedUSDAsc = 'POOL_CREATIONS_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolCreationsDistinctCountTotalValueLockedUSDDesc = 'POOL_CREATIONS_DISTINCT_COUNT_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolCreationsDistinctCountTransactionIdAsc = 'POOL_CREATIONS_DISTINCT_COUNT_TRANSACTION_ID_ASC',
  PoolCreationsDistinctCountTransactionIdDesc = 'POOL_CREATIONS_DISTINCT_COUNT_TRANSACTION_ID_DESC',
  PoolCreationsDistinctCountTxCountAsc = 'POOL_CREATIONS_DISTINCT_COUNT_TX_COUNT_ASC',
  PoolCreationsDistinctCountTxCountDesc = 'POOL_CREATIONS_DISTINCT_COUNT_TX_COUNT_DESC',
  PoolCreationsDistinctCountUpdatedAtAsc = 'POOL_CREATIONS_DISTINCT_COUNT_UPDATED_AT_ASC',
  PoolCreationsDistinctCountUpdatedAtDesc = 'POOL_CREATIONS_DISTINCT_COUNT_UPDATED_AT_DESC',
  PoolCreationsDistinctCountVolumeTokenXAsc = 'POOL_CREATIONS_DISTINCT_COUNT_VOLUME_TOKEN_X_ASC',
  PoolCreationsDistinctCountVolumeTokenXDesc = 'POOL_CREATIONS_DISTINCT_COUNT_VOLUME_TOKEN_X_DESC',
  PoolCreationsDistinctCountVolumeTokenYAsc = 'POOL_CREATIONS_DISTINCT_COUNT_VOLUME_TOKEN_Y_ASC',
  PoolCreationsDistinctCountVolumeTokenYDesc = 'POOL_CREATIONS_DISTINCT_COUNT_VOLUME_TOKEN_Y_DESC',
  PoolCreationsDistinctCountVolumeUSDAsc = 'POOL_CREATIONS_DISTINCT_COUNT_VOLUME_U_S_D_ASC',
  PoolCreationsDistinctCountVolumeUSDDesc = 'POOL_CREATIONS_DISTINCT_COUNT_VOLUME_U_S_D_DESC',
  PoolCreationsMaxBlockRangeAsc = 'POOL_CREATIONS_MAX_BLOCK_RANGE_ASC',
  PoolCreationsMaxBlockRangeDesc = 'POOL_CREATIONS_MAX_BLOCK_RANGE_DESC',
  PoolCreationsMaxCollectedFeesTokenXAsc = 'POOL_CREATIONS_MAX_COLLECTED_FEES_TOKEN_X_ASC',
  PoolCreationsMaxCollectedFeesTokenXDesc = 'POOL_CREATIONS_MAX_COLLECTED_FEES_TOKEN_X_DESC',
  PoolCreationsMaxCollectedFeesTokenYAsc = 'POOL_CREATIONS_MAX_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolCreationsMaxCollectedFeesTokenYDesc = 'POOL_CREATIONS_MAX_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolCreationsMaxCollectedFeesUSDAsc = 'POOL_CREATIONS_MAX_COLLECTED_FEES_U_S_D_ASC',
  PoolCreationsMaxCollectedFeesUSDDesc = 'POOL_CREATIONS_MAX_COLLECTED_FEES_U_S_D_DESC',
  PoolCreationsMaxCreatedAtAsc = 'POOL_CREATIONS_MAX_CREATED_AT_ASC',
  PoolCreationsMaxCreatedAtBlockNumberAsc = 'POOL_CREATIONS_MAX_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolCreationsMaxCreatedAtBlockNumberDesc = 'POOL_CREATIONS_MAX_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolCreationsMaxCreatedAtDesc = 'POOL_CREATIONS_MAX_CREATED_AT_DESC',
  PoolCreationsMaxCurrentTickAsc = 'POOL_CREATIONS_MAX_CURRENT_TICK_ASC',
  PoolCreationsMaxCurrentTickDesc = 'POOL_CREATIONS_MAX_CURRENT_TICK_DESC',
  PoolCreationsMaxFeesUSDAsc = 'POOL_CREATIONS_MAX_FEES_U_S_D_ASC',
  PoolCreationsMaxFeesUSDDesc = 'POOL_CREATIONS_MAX_FEES_U_S_D_DESC',
  PoolCreationsMaxFeeAsc = 'POOL_CREATIONS_MAX_FEE_ASC',
  PoolCreationsMaxFeeDesc = 'POOL_CREATIONS_MAX_FEE_DESC',
  PoolCreationsMaxIdAsc = 'POOL_CREATIONS_MAX_ID_ASC',
  PoolCreationsMaxIdDesc = 'POOL_CREATIONS_MAX_ID_DESC',
  PoolCreationsMaxLiquidityAsc = 'POOL_CREATIONS_MAX_LIQUIDITY_ASC',
  PoolCreationsMaxLiquidityDesc = 'POOL_CREATIONS_MAX_LIQUIDITY_DESC',
  PoolCreationsMaxPoolCreatorIdAsc = 'POOL_CREATIONS_MAX_POOL_CREATOR_ID_ASC',
  PoolCreationsMaxPoolCreatorIdDesc = 'POOL_CREATIONS_MAX_POOL_CREATOR_ID_DESC',
  PoolCreationsMaxSqrtPriceAsc = 'POOL_CREATIONS_MAX_SQRT_PRICE_ASC',
  PoolCreationsMaxSqrtPriceDesc = 'POOL_CREATIONS_MAX_SQRT_PRICE_DESC',
  PoolCreationsMaxTickSpacingAsc = 'POOL_CREATIONS_MAX_TICK_SPACING_ASC',
  PoolCreationsMaxTickSpacingDesc = 'POOL_CREATIONS_MAX_TICK_SPACING_DESC',
  PoolCreationsMaxTokenXIdAsc = 'POOL_CREATIONS_MAX_TOKEN_X_ID_ASC',
  PoolCreationsMaxTokenXIdDesc = 'POOL_CREATIONS_MAX_TOKEN_X_ID_DESC',
  PoolCreationsMaxTokenYIdAsc = 'POOL_CREATIONS_MAX_TOKEN_Y_ID_ASC',
  PoolCreationsMaxTokenYIdDesc = 'POOL_CREATIONS_MAX_TOKEN_Y_ID_DESC',
  PoolCreationsMaxTotalValueLockedTokenXAsc = 'POOL_CREATIONS_MAX_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolCreationsMaxTotalValueLockedTokenXDesc = 'POOL_CREATIONS_MAX_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolCreationsMaxTotalValueLockedTokenYAsc = 'POOL_CREATIONS_MAX_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolCreationsMaxTotalValueLockedTokenYDesc = 'POOL_CREATIONS_MAX_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolCreationsMaxTotalValueLockedUSDAsc = 'POOL_CREATIONS_MAX_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolCreationsMaxTotalValueLockedUSDDesc = 'POOL_CREATIONS_MAX_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolCreationsMaxTransactionIdAsc = 'POOL_CREATIONS_MAX_TRANSACTION_ID_ASC',
  PoolCreationsMaxTransactionIdDesc = 'POOL_CREATIONS_MAX_TRANSACTION_ID_DESC',
  PoolCreationsMaxTxCountAsc = 'POOL_CREATIONS_MAX_TX_COUNT_ASC',
  PoolCreationsMaxTxCountDesc = 'POOL_CREATIONS_MAX_TX_COUNT_DESC',
  PoolCreationsMaxUpdatedAtAsc = 'POOL_CREATIONS_MAX_UPDATED_AT_ASC',
  PoolCreationsMaxUpdatedAtDesc = 'POOL_CREATIONS_MAX_UPDATED_AT_DESC',
  PoolCreationsMaxVolumeTokenXAsc = 'POOL_CREATIONS_MAX_VOLUME_TOKEN_X_ASC',
  PoolCreationsMaxVolumeTokenXDesc = 'POOL_CREATIONS_MAX_VOLUME_TOKEN_X_DESC',
  PoolCreationsMaxVolumeTokenYAsc = 'POOL_CREATIONS_MAX_VOLUME_TOKEN_Y_ASC',
  PoolCreationsMaxVolumeTokenYDesc = 'POOL_CREATIONS_MAX_VOLUME_TOKEN_Y_DESC',
  PoolCreationsMaxVolumeUSDAsc = 'POOL_CREATIONS_MAX_VOLUME_U_S_D_ASC',
  PoolCreationsMaxVolumeUSDDesc = 'POOL_CREATIONS_MAX_VOLUME_U_S_D_DESC',
  PoolCreationsMinBlockRangeAsc = 'POOL_CREATIONS_MIN_BLOCK_RANGE_ASC',
  PoolCreationsMinBlockRangeDesc = 'POOL_CREATIONS_MIN_BLOCK_RANGE_DESC',
  PoolCreationsMinCollectedFeesTokenXAsc = 'POOL_CREATIONS_MIN_COLLECTED_FEES_TOKEN_X_ASC',
  PoolCreationsMinCollectedFeesTokenXDesc = 'POOL_CREATIONS_MIN_COLLECTED_FEES_TOKEN_X_DESC',
  PoolCreationsMinCollectedFeesTokenYAsc = 'POOL_CREATIONS_MIN_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolCreationsMinCollectedFeesTokenYDesc = 'POOL_CREATIONS_MIN_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolCreationsMinCollectedFeesUSDAsc = 'POOL_CREATIONS_MIN_COLLECTED_FEES_U_S_D_ASC',
  PoolCreationsMinCollectedFeesUSDDesc = 'POOL_CREATIONS_MIN_COLLECTED_FEES_U_S_D_DESC',
  PoolCreationsMinCreatedAtAsc = 'POOL_CREATIONS_MIN_CREATED_AT_ASC',
  PoolCreationsMinCreatedAtBlockNumberAsc = 'POOL_CREATIONS_MIN_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolCreationsMinCreatedAtBlockNumberDesc = 'POOL_CREATIONS_MIN_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolCreationsMinCreatedAtDesc = 'POOL_CREATIONS_MIN_CREATED_AT_DESC',
  PoolCreationsMinCurrentTickAsc = 'POOL_CREATIONS_MIN_CURRENT_TICK_ASC',
  PoolCreationsMinCurrentTickDesc = 'POOL_CREATIONS_MIN_CURRENT_TICK_DESC',
  PoolCreationsMinFeesUSDAsc = 'POOL_CREATIONS_MIN_FEES_U_S_D_ASC',
  PoolCreationsMinFeesUSDDesc = 'POOL_CREATIONS_MIN_FEES_U_S_D_DESC',
  PoolCreationsMinFeeAsc = 'POOL_CREATIONS_MIN_FEE_ASC',
  PoolCreationsMinFeeDesc = 'POOL_CREATIONS_MIN_FEE_DESC',
  PoolCreationsMinIdAsc = 'POOL_CREATIONS_MIN_ID_ASC',
  PoolCreationsMinIdDesc = 'POOL_CREATIONS_MIN_ID_DESC',
  PoolCreationsMinLiquidityAsc = 'POOL_CREATIONS_MIN_LIQUIDITY_ASC',
  PoolCreationsMinLiquidityDesc = 'POOL_CREATIONS_MIN_LIQUIDITY_DESC',
  PoolCreationsMinPoolCreatorIdAsc = 'POOL_CREATIONS_MIN_POOL_CREATOR_ID_ASC',
  PoolCreationsMinPoolCreatorIdDesc = 'POOL_CREATIONS_MIN_POOL_CREATOR_ID_DESC',
  PoolCreationsMinSqrtPriceAsc = 'POOL_CREATIONS_MIN_SQRT_PRICE_ASC',
  PoolCreationsMinSqrtPriceDesc = 'POOL_CREATIONS_MIN_SQRT_PRICE_DESC',
  PoolCreationsMinTickSpacingAsc = 'POOL_CREATIONS_MIN_TICK_SPACING_ASC',
  PoolCreationsMinTickSpacingDesc = 'POOL_CREATIONS_MIN_TICK_SPACING_DESC',
  PoolCreationsMinTokenXIdAsc = 'POOL_CREATIONS_MIN_TOKEN_X_ID_ASC',
  PoolCreationsMinTokenXIdDesc = 'POOL_CREATIONS_MIN_TOKEN_X_ID_DESC',
  PoolCreationsMinTokenYIdAsc = 'POOL_CREATIONS_MIN_TOKEN_Y_ID_ASC',
  PoolCreationsMinTokenYIdDesc = 'POOL_CREATIONS_MIN_TOKEN_Y_ID_DESC',
  PoolCreationsMinTotalValueLockedTokenXAsc = 'POOL_CREATIONS_MIN_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolCreationsMinTotalValueLockedTokenXDesc = 'POOL_CREATIONS_MIN_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolCreationsMinTotalValueLockedTokenYAsc = 'POOL_CREATIONS_MIN_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolCreationsMinTotalValueLockedTokenYDesc = 'POOL_CREATIONS_MIN_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolCreationsMinTotalValueLockedUSDAsc = 'POOL_CREATIONS_MIN_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolCreationsMinTotalValueLockedUSDDesc = 'POOL_CREATIONS_MIN_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolCreationsMinTransactionIdAsc = 'POOL_CREATIONS_MIN_TRANSACTION_ID_ASC',
  PoolCreationsMinTransactionIdDesc = 'POOL_CREATIONS_MIN_TRANSACTION_ID_DESC',
  PoolCreationsMinTxCountAsc = 'POOL_CREATIONS_MIN_TX_COUNT_ASC',
  PoolCreationsMinTxCountDesc = 'POOL_CREATIONS_MIN_TX_COUNT_DESC',
  PoolCreationsMinUpdatedAtAsc = 'POOL_CREATIONS_MIN_UPDATED_AT_ASC',
  PoolCreationsMinUpdatedAtDesc = 'POOL_CREATIONS_MIN_UPDATED_AT_DESC',
  PoolCreationsMinVolumeTokenXAsc = 'POOL_CREATIONS_MIN_VOLUME_TOKEN_X_ASC',
  PoolCreationsMinVolumeTokenXDesc = 'POOL_CREATIONS_MIN_VOLUME_TOKEN_X_DESC',
  PoolCreationsMinVolumeTokenYAsc = 'POOL_CREATIONS_MIN_VOLUME_TOKEN_Y_ASC',
  PoolCreationsMinVolumeTokenYDesc = 'POOL_CREATIONS_MIN_VOLUME_TOKEN_Y_DESC',
  PoolCreationsMinVolumeUSDAsc = 'POOL_CREATIONS_MIN_VOLUME_U_S_D_ASC',
  PoolCreationsMinVolumeUSDDesc = 'POOL_CREATIONS_MIN_VOLUME_U_S_D_DESC',
  PoolCreationsStddevPopulationBlockRangeAsc = 'POOL_CREATIONS_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  PoolCreationsStddevPopulationBlockRangeDesc = 'POOL_CREATIONS_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  PoolCreationsStddevPopulationCollectedFeesTokenXAsc = 'POOL_CREATIONS_STDDEV_POPULATION_COLLECTED_FEES_TOKEN_X_ASC',
  PoolCreationsStddevPopulationCollectedFeesTokenXDesc = 'POOL_CREATIONS_STDDEV_POPULATION_COLLECTED_FEES_TOKEN_X_DESC',
  PoolCreationsStddevPopulationCollectedFeesTokenYAsc = 'POOL_CREATIONS_STDDEV_POPULATION_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolCreationsStddevPopulationCollectedFeesTokenYDesc = 'POOL_CREATIONS_STDDEV_POPULATION_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolCreationsStddevPopulationCollectedFeesUSDAsc = 'POOL_CREATIONS_STDDEV_POPULATION_COLLECTED_FEES_U_S_D_ASC',
  PoolCreationsStddevPopulationCollectedFeesUSDDesc = 'POOL_CREATIONS_STDDEV_POPULATION_COLLECTED_FEES_U_S_D_DESC',
  PoolCreationsStddevPopulationCreatedAtAsc = 'POOL_CREATIONS_STDDEV_POPULATION_CREATED_AT_ASC',
  PoolCreationsStddevPopulationCreatedAtBlockNumberAsc = 'POOL_CREATIONS_STDDEV_POPULATION_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolCreationsStddevPopulationCreatedAtBlockNumberDesc = 'POOL_CREATIONS_STDDEV_POPULATION_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolCreationsStddevPopulationCreatedAtDesc = 'POOL_CREATIONS_STDDEV_POPULATION_CREATED_AT_DESC',
  PoolCreationsStddevPopulationCurrentTickAsc = 'POOL_CREATIONS_STDDEV_POPULATION_CURRENT_TICK_ASC',
  PoolCreationsStddevPopulationCurrentTickDesc = 'POOL_CREATIONS_STDDEV_POPULATION_CURRENT_TICK_DESC',
  PoolCreationsStddevPopulationFeesUSDAsc = 'POOL_CREATIONS_STDDEV_POPULATION_FEES_U_S_D_ASC',
  PoolCreationsStddevPopulationFeesUSDDesc = 'POOL_CREATIONS_STDDEV_POPULATION_FEES_U_S_D_DESC',
  PoolCreationsStddevPopulationFeeAsc = 'POOL_CREATIONS_STDDEV_POPULATION_FEE_ASC',
  PoolCreationsStddevPopulationFeeDesc = 'POOL_CREATIONS_STDDEV_POPULATION_FEE_DESC',
  PoolCreationsStddevPopulationIdAsc = 'POOL_CREATIONS_STDDEV_POPULATION_ID_ASC',
  PoolCreationsStddevPopulationIdDesc = 'POOL_CREATIONS_STDDEV_POPULATION_ID_DESC',
  PoolCreationsStddevPopulationLiquidityAsc = 'POOL_CREATIONS_STDDEV_POPULATION_LIQUIDITY_ASC',
  PoolCreationsStddevPopulationLiquidityDesc = 'POOL_CREATIONS_STDDEV_POPULATION_LIQUIDITY_DESC',
  PoolCreationsStddevPopulationPoolCreatorIdAsc = 'POOL_CREATIONS_STDDEV_POPULATION_POOL_CREATOR_ID_ASC',
  PoolCreationsStddevPopulationPoolCreatorIdDesc = 'POOL_CREATIONS_STDDEV_POPULATION_POOL_CREATOR_ID_DESC',
  PoolCreationsStddevPopulationSqrtPriceAsc = 'POOL_CREATIONS_STDDEV_POPULATION_SQRT_PRICE_ASC',
  PoolCreationsStddevPopulationSqrtPriceDesc = 'POOL_CREATIONS_STDDEV_POPULATION_SQRT_PRICE_DESC',
  PoolCreationsStddevPopulationTickSpacingAsc = 'POOL_CREATIONS_STDDEV_POPULATION_TICK_SPACING_ASC',
  PoolCreationsStddevPopulationTickSpacingDesc = 'POOL_CREATIONS_STDDEV_POPULATION_TICK_SPACING_DESC',
  PoolCreationsStddevPopulationTokenXIdAsc = 'POOL_CREATIONS_STDDEV_POPULATION_TOKEN_X_ID_ASC',
  PoolCreationsStddevPopulationTokenXIdDesc = 'POOL_CREATIONS_STDDEV_POPULATION_TOKEN_X_ID_DESC',
  PoolCreationsStddevPopulationTokenYIdAsc = 'POOL_CREATIONS_STDDEV_POPULATION_TOKEN_Y_ID_ASC',
  PoolCreationsStddevPopulationTokenYIdDesc = 'POOL_CREATIONS_STDDEV_POPULATION_TOKEN_Y_ID_DESC',
  PoolCreationsStddevPopulationTotalValueLockedTokenXAsc = 'POOL_CREATIONS_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolCreationsStddevPopulationTotalValueLockedTokenXDesc = 'POOL_CREATIONS_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolCreationsStddevPopulationTotalValueLockedTokenYAsc = 'POOL_CREATIONS_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolCreationsStddevPopulationTotalValueLockedTokenYDesc = 'POOL_CREATIONS_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolCreationsStddevPopulationTotalValueLockedUSDAsc = 'POOL_CREATIONS_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolCreationsStddevPopulationTotalValueLockedUSDDesc = 'POOL_CREATIONS_STDDEV_POPULATION_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolCreationsStddevPopulationTransactionIdAsc = 'POOL_CREATIONS_STDDEV_POPULATION_TRANSACTION_ID_ASC',
  PoolCreationsStddevPopulationTransactionIdDesc = 'POOL_CREATIONS_STDDEV_POPULATION_TRANSACTION_ID_DESC',
  PoolCreationsStddevPopulationTxCountAsc = 'POOL_CREATIONS_STDDEV_POPULATION_TX_COUNT_ASC',
  PoolCreationsStddevPopulationTxCountDesc = 'POOL_CREATIONS_STDDEV_POPULATION_TX_COUNT_DESC',
  PoolCreationsStddevPopulationUpdatedAtAsc = 'POOL_CREATIONS_STDDEV_POPULATION_UPDATED_AT_ASC',
  PoolCreationsStddevPopulationUpdatedAtDesc = 'POOL_CREATIONS_STDDEV_POPULATION_UPDATED_AT_DESC',
  PoolCreationsStddevPopulationVolumeTokenXAsc = 'POOL_CREATIONS_STDDEV_POPULATION_VOLUME_TOKEN_X_ASC',
  PoolCreationsStddevPopulationVolumeTokenXDesc = 'POOL_CREATIONS_STDDEV_POPULATION_VOLUME_TOKEN_X_DESC',
  PoolCreationsStddevPopulationVolumeTokenYAsc = 'POOL_CREATIONS_STDDEV_POPULATION_VOLUME_TOKEN_Y_ASC',
  PoolCreationsStddevPopulationVolumeTokenYDesc = 'POOL_CREATIONS_STDDEV_POPULATION_VOLUME_TOKEN_Y_DESC',
  PoolCreationsStddevPopulationVolumeUSDAsc = 'POOL_CREATIONS_STDDEV_POPULATION_VOLUME_U_S_D_ASC',
  PoolCreationsStddevPopulationVolumeUSDDesc = 'POOL_CREATIONS_STDDEV_POPULATION_VOLUME_U_S_D_DESC',
  PoolCreationsStddevSampleBlockRangeAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  PoolCreationsStddevSampleBlockRangeDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  PoolCreationsStddevSampleCollectedFeesTokenXAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_COLLECTED_FEES_TOKEN_X_ASC',
  PoolCreationsStddevSampleCollectedFeesTokenXDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_COLLECTED_FEES_TOKEN_X_DESC',
  PoolCreationsStddevSampleCollectedFeesTokenYAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolCreationsStddevSampleCollectedFeesTokenYDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolCreationsStddevSampleCollectedFeesUSDAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_COLLECTED_FEES_U_S_D_ASC',
  PoolCreationsStddevSampleCollectedFeesUSDDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_COLLECTED_FEES_U_S_D_DESC',
  PoolCreationsStddevSampleCreatedAtAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_CREATED_AT_ASC',
  PoolCreationsStddevSampleCreatedAtBlockNumberAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolCreationsStddevSampleCreatedAtBlockNumberDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolCreationsStddevSampleCreatedAtDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_CREATED_AT_DESC',
  PoolCreationsStddevSampleCurrentTickAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_CURRENT_TICK_ASC',
  PoolCreationsStddevSampleCurrentTickDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_CURRENT_TICK_DESC',
  PoolCreationsStddevSampleFeesUSDAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_FEES_U_S_D_ASC',
  PoolCreationsStddevSampleFeesUSDDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_FEES_U_S_D_DESC',
  PoolCreationsStddevSampleFeeAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_FEE_ASC',
  PoolCreationsStddevSampleFeeDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_FEE_DESC',
  PoolCreationsStddevSampleIdAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_ID_ASC',
  PoolCreationsStddevSampleIdDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_ID_DESC',
  PoolCreationsStddevSampleLiquidityAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_LIQUIDITY_ASC',
  PoolCreationsStddevSampleLiquidityDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_LIQUIDITY_DESC',
  PoolCreationsStddevSamplePoolCreatorIdAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_POOL_CREATOR_ID_ASC',
  PoolCreationsStddevSamplePoolCreatorIdDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_POOL_CREATOR_ID_DESC',
  PoolCreationsStddevSampleSqrtPriceAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_SQRT_PRICE_ASC',
  PoolCreationsStddevSampleSqrtPriceDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_SQRT_PRICE_DESC',
  PoolCreationsStddevSampleTickSpacingAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_TICK_SPACING_ASC',
  PoolCreationsStddevSampleTickSpacingDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_TICK_SPACING_DESC',
  PoolCreationsStddevSampleTokenXIdAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_TOKEN_X_ID_ASC',
  PoolCreationsStddevSampleTokenXIdDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_TOKEN_X_ID_DESC',
  PoolCreationsStddevSampleTokenYIdAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_TOKEN_Y_ID_ASC',
  PoolCreationsStddevSampleTokenYIdDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_TOKEN_Y_ID_DESC',
  PoolCreationsStddevSampleTotalValueLockedTokenXAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolCreationsStddevSampleTotalValueLockedTokenXDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolCreationsStddevSampleTotalValueLockedTokenYAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolCreationsStddevSampleTotalValueLockedTokenYDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolCreationsStddevSampleTotalValueLockedUSDAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolCreationsStddevSampleTotalValueLockedUSDDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolCreationsStddevSampleTransactionIdAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_TRANSACTION_ID_ASC',
  PoolCreationsStddevSampleTransactionIdDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_TRANSACTION_ID_DESC',
  PoolCreationsStddevSampleTxCountAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_TX_COUNT_ASC',
  PoolCreationsStddevSampleTxCountDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_TX_COUNT_DESC',
  PoolCreationsStddevSampleUpdatedAtAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_UPDATED_AT_ASC',
  PoolCreationsStddevSampleUpdatedAtDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_UPDATED_AT_DESC',
  PoolCreationsStddevSampleVolumeTokenXAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_VOLUME_TOKEN_X_ASC',
  PoolCreationsStddevSampleVolumeTokenXDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_VOLUME_TOKEN_X_DESC',
  PoolCreationsStddevSampleVolumeTokenYAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_VOLUME_TOKEN_Y_ASC',
  PoolCreationsStddevSampleVolumeTokenYDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_VOLUME_TOKEN_Y_DESC',
  PoolCreationsStddevSampleVolumeUSDAsc = 'POOL_CREATIONS_STDDEV_SAMPLE_VOLUME_U_S_D_ASC',
  PoolCreationsStddevSampleVolumeUSDDesc = 'POOL_CREATIONS_STDDEV_SAMPLE_VOLUME_U_S_D_DESC',
  PoolCreationsSumBlockRangeAsc = 'POOL_CREATIONS_SUM_BLOCK_RANGE_ASC',
  PoolCreationsSumBlockRangeDesc = 'POOL_CREATIONS_SUM_BLOCK_RANGE_DESC',
  PoolCreationsSumCollectedFeesTokenXAsc = 'POOL_CREATIONS_SUM_COLLECTED_FEES_TOKEN_X_ASC',
  PoolCreationsSumCollectedFeesTokenXDesc = 'POOL_CREATIONS_SUM_COLLECTED_FEES_TOKEN_X_DESC',
  PoolCreationsSumCollectedFeesTokenYAsc = 'POOL_CREATIONS_SUM_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolCreationsSumCollectedFeesTokenYDesc = 'POOL_CREATIONS_SUM_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolCreationsSumCollectedFeesUSDAsc = 'POOL_CREATIONS_SUM_COLLECTED_FEES_U_S_D_ASC',
  PoolCreationsSumCollectedFeesUSDDesc = 'POOL_CREATIONS_SUM_COLLECTED_FEES_U_S_D_DESC',
  PoolCreationsSumCreatedAtAsc = 'POOL_CREATIONS_SUM_CREATED_AT_ASC',
  PoolCreationsSumCreatedAtBlockNumberAsc = 'POOL_CREATIONS_SUM_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolCreationsSumCreatedAtBlockNumberDesc = 'POOL_CREATIONS_SUM_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolCreationsSumCreatedAtDesc = 'POOL_CREATIONS_SUM_CREATED_AT_DESC',
  PoolCreationsSumCurrentTickAsc = 'POOL_CREATIONS_SUM_CURRENT_TICK_ASC',
  PoolCreationsSumCurrentTickDesc = 'POOL_CREATIONS_SUM_CURRENT_TICK_DESC',
  PoolCreationsSumFeesUSDAsc = 'POOL_CREATIONS_SUM_FEES_U_S_D_ASC',
  PoolCreationsSumFeesUSDDesc = 'POOL_CREATIONS_SUM_FEES_U_S_D_DESC',
  PoolCreationsSumFeeAsc = 'POOL_CREATIONS_SUM_FEE_ASC',
  PoolCreationsSumFeeDesc = 'POOL_CREATIONS_SUM_FEE_DESC',
  PoolCreationsSumIdAsc = 'POOL_CREATIONS_SUM_ID_ASC',
  PoolCreationsSumIdDesc = 'POOL_CREATIONS_SUM_ID_DESC',
  PoolCreationsSumLiquidityAsc = 'POOL_CREATIONS_SUM_LIQUIDITY_ASC',
  PoolCreationsSumLiquidityDesc = 'POOL_CREATIONS_SUM_LIQUIDITY_DESC',
  PoolCreationsSumPoolCreatorIdAsc = 'POOL_CREATIONS_SUM_POOL_CREATOR_ID_ASC',
  PoolCreationsSumPoolCreatorIdDesc = 'POOL_CREATIONS_SUM_POOL_CREATOR_ID_DESC',
  PoolCreationsSumSqrtPriceAsc = 'POOL_CREATIONS_SUM_SQRT_PRICE_ASC',
  PoolCreationsSumSqrtPriceDesc = 'POOL_CREATIONS_SUM_SQRT_PRICE_DESC',
  PoolCreationsSumTickSpacingAsc = 'POOL_CREATIONS_SUM_TICK_SPACING_ASC',
  PoolCreationsSumTickSpacingDesc = 'POOL_CREATIONS_SUM_TICK_SPACING_DESC',
  PoolCreationsSumTokenXIdAsc = 'POOL_CREATIONS_SUM_TOKEN_X_ID_ASC',
  PoolCreationsSumTokenXIdDesc = 'POOL_CREATIONS_SUM_TOKEN_X_ID_DESC',
  PoolCreationsSumTokenYIdAsc = 'POOL_CREATIONS_SUM_TOKEN_Y_ID_ASC',
  PoolCreationsSumTokenYIdDesc = 'POOL_CREATIONS_SUM_TOKEN_Y_ID_DESC',
  PoolCreationsSumTotalValueLockedTokenXAsc = 'POOL_CREATIONS_SUM_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolCreationsSumTotalValueLockedTokenXDesc = 'POOL_CREATIONS_SUM_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolCreationsSumTotalValueLockedTokenYAsc = 'POOL_CREATIONS_SUM_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolCreationsSumTotalValueLockedTokenYDesc = 'POOL_CREATIONS_SUM_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolCreationsSumTotalValueLockedUSDAsc = 'POOL_CREATIONS_SUM_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolCreationsSumTotalValueLockedUSDDesc = 'POOL_CREATIONS_SUM_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolCreationsSumTransactionIdAsc = 'POOL_CREATIONS_SUM_TRANSACTION_ID_ASC',
  PoolCreationsSumTransactionIdDesc = 'POOL_CREATIONS_SUM_TRANSACTION_ID_DESC',
  PoolCreationsSumTxCountAsc = 'POOL_CREATIONS_SUM_TX_COUNT_ASC',
  PoolCreationsSumTxCountDesc = 'POOL_CREATIONS_SUM_TX_COUNT_DESC',
  PoolCreationsSumUpdatedAtAsc = 'POOL_CREATIONS_SUM_UPDATED_AT_ASC',
  PoolCreationsSumUpdatedAtDesc = 'POOL_CREATIONS_SUM_UPDATED_AT_DESC',
  PoolCreationsSumVolumeTokenXAsc = 'POOL_CREATIONS_SUM_VOLUME_TOKEN_X_ASC',
  PoolCreationsSumVolumeTokenXDesc = 'POOL_CREATIONS_SUM_VOLUME_TOKEN_X_DESC',
  PoolCreationsSumVolumeTokenYAsc = 'POOL_CREATIONS_SUM_VOLUME_TOKEN_Y_ASC',
  PoolCreationsSumVolumeTokenYDesc = 'POOL_CREATIONS_SUM_VOLUME_TOKEN_Y_DESC',
  PoolCreationsSumVolumeUSDAsc = 'POOL_CREATIONS_SUM_VOLUME_U_S_D_ASC',
  PoolCreationsSumVolumeUSDDesc = 'POOL_CREATIONS_SUM_VOLUME_U_S_D_DESC',
  PoolCreationsVariancePopulationBlockRangeAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  PoolCreationsVariancePopulationBlockRangeDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  PoolCreationsVariancePopulationCollectedFeesTokenXAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_COLLECTED_FEES_TOKEN_X_ASC',
  PoolCreationsVariancePopulationCollectedFeesTokenXDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_COLLECTED_FEES_TOKEN_X_DESC',
  PoolCreationsVariancePopulationCollectedFeesTokenYAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolCreationsVariancePopulationCollectedFeesTokenYDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolCreationsVariancePopulationCollectedFeesUSDAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_COLLECTED_FEES_U_S_D_ASC',
  PoolCreationsVariancePopulationCollectedFeesUSDDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_COLLECTED_FEES_U_S_D_DESC',
  PoolCreationsVariancePopulationCreatedAtAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_CREATED_AT_ASC',
  PoolCreationsVariancePopulationCreatedAtBlockNumberAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolCreationsVariancePopulationCreatedAtBlockNumberDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolCreationsVariancePopulationCreatedAtDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_CREATED_AT_DESC',
  PoolCreationsVariancePopulationCurrentTickAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_CURRENT_TICK_ASC',
  PoolCreationsVariancePopulationCurrentTickDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_CURRENT_TICK_DESC',
  PoolCreationsVariancePopulationFeesUSDAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_FEES_U_S_D_ASC',
  PoolCreationsVariancePopulationFeesUSDDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_FEES_U_S_D_DESC',
  PoolCreationsVariancePopulationFeeAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_FEE_ASC',
  PoolCreationsVariancePopulationFeeDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_FEE_DESC',
  PoolCreationsVariancePopulationIdAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_ID_ASC',
  PoolCreationsVariancePopulationIdDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_ID_DESC',
  PoolCreationsVariancePopulationLiquidityAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_LIQUIDITY_ASC',
  PoolCreationsVariancePopulationLiquidityDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_LIQUIDITY_DESC',
  PoolCreationsVariancePopulationPoolCreatorIdAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_POOL_CREATOR_ID_ASC',
  PoolCreationsVariancePopulationPoolCreatorIdDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_POOL_CREATOR_ID_DESC',
  PoolCreationsVariancePopulationSqrtPriceAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_SQRT_PRICE_ASC',
  PoolCreationsVariancePopulationSqrtPriceDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_SQRT_PRICE_DESC',
  PoolCreationsVariancePopulationTickSpacingAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_TICK_SPACING_ASC',
  PoolCreationsVariancePopulationTickSpacingDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_TICK_SPACING_DESC',
  PoolCreationsVariancePopulationTokenXIdAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_TOKEN_X_ID_ASC',
  PoolCreationsVariancePopulationTokenXIdDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_TOKEN_X_ID_DESC',
  PoolCreationsVariancePopulationTokenYIdAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_TOKEN_Y_ID_ASC',
  PoolCreationsVariancePopulationTokenYIdDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_TOKEN_Y_ID_DESC',
  PoolCreationsVariancePopulationTotalValueLockedTokenXAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolCreationsVariancePopulationTotalValueLockedTokenXDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolCreationsVariancePopulationTotalValueLockedTokenYAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolCreationsVariancePopulationTotalValueLockedTokenYDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolCreationsVariancePopulationTotalValueLockedUSDAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolCreationsVariancePopulationTotalValueLockedUSDDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolCreationsVariancePopulationTransactionIdAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_TRANSACTION_ID_ASC',
  PoolCreationsVariancePopulationTransactionIdDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_TRANSACTION_ID_DESC',
  PoolCreationsVariancePopulationTxCountAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_TX_COUNT_ASC',
  PoolCreationsVariancePopulationTxCountDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_TX_COUNT_DESC',
  PoolCreationsVariancePopulationUpdatedAtAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_UPDATED_AT_ASC',
  PoolCreationsVariancePopulationUpdatedAtDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_UPDATED_AT_DESC',
  PoolCreationsVariancePopulationVolumeTokenXAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_VOLUME_TOKEN_X_ASC',
  PoolCreationsVariancePopulationVolumeTokenXDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_VOLUME_TOKEN_X_DESC',
  PoolCreationsVariancePopulationVolumeTokenYAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_VOLUME_TOKEN_Y_ASC',
  PoolCreationsVariancePopulationVolumeTokenYDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_VOLUME_TOKEN_Y_DESC',
  PoolCreationsVariancePopulationVolumeUSDAsc = 'POOL_CREATIONS_VARIANCE_POPULATION_VOLUME_U_S_D_ASC',
  PoolCreationsVariancePopulationVolumeUSDDesc = 'POOL_CREATIONS_VARIANCE_POPULATION_VOLUME_U_S_D_DESC',
  PoolCreationsVarianceSampleBlockRangeAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  PoolCreationsVarianceSampleBlockRangeDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  PoolCreationsVarianceSampleCollectedFeesTokenXAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_COLLECTED_FEES_TOKEN_X_ASC',
  PoolCreationsVarianceSampleCollectedFeesTokenXDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_COLLECTED_FEES_TOKEN_X_DESC',
  PoolCreationsVarianceSampleCollectedFeesTokenYAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_COLLECTED_FEES_TOKEN_Y_ASC',
  PoolCreationsVarianceSampleCollectedFeesTokenYDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_COLLECTED_FEES_TOKEN_Y_DESC',
  PoolCreationsVarianceSampleCollectedFeesUSDAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_COLLECTED_FEES_U_S_D_ASC',
  PoolCreationsVarianceSampleCollectedFeesUSDDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_COLLECTED_FEES_U_S_D_DESC',
  PoolCreationsVarianceSampleCreatedAtAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_CREATED_AT_ASC',
  PoolCreationsVarianceSampleCreatedAtBlockNumberAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_CREATED_AT_BLOCK_NUMBER_ASC',
  PoolCreationsVarianceSampleCreatedAtBlockNumberDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_CREATED_AT_BLOCK_NUMBER_DESC',
  PoolCreationsVarianceSampleCreatedAtDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_CREATED_AT_DESC',
  PoolCreationsVarianceSampleCurrentTickAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_CURRENT_TICK_ASC',
  PoolCreationsVarianceSampleCurrentTickDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_CURRENT_TICK_DESC',
  PoolCreationsVarianceSampleFeesUSDAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_FEES_U_S_D_ASC',
  PoolCreationsVarianceSampleFeesUSDDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_FEES_U_S_D_DESC',
  PoolCreationsVarianceSampleFeeAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_FEE_ASC',
  PoolCreationsVarianceSampleFeeDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_FEE_DESC',
  PoolCreationsVarianceSampleIdAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_ID_ASC',
  PoolCreationsVarianceSampleIdDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_ID_DESC',
  PoolCreationsVarianceSampleLiquidityAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_LIQUIDITY_ASC',
  PoolCreationsVarianceSampleLiquidityDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_LIQUIDITY_DESC',
  PoolCreationsVarianceSamplePoolCreatorIdAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_POOL_CREATOR_ID_ASC',
  PoolCreationsVarianceSamplePoolCreatorIdDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_POOL_CREATOR_ID_DESC',
  PoolCreationsVarianceSampleSqrtPriceAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_SQRT_PRICE_ASC',
  PoolCreationsVarianceSampleSqrtPriceDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_SQRT_PRICE_DESC',
  PoolCreationsVarianceSampleTickSpacingAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TICK_SPACING_ASC',
  PoolCreationsVarianceSampleTickSpacingDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TICK_SPACING_DESC',
  PoolCreationsVarianceSampleTokenXIdAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TOKEN_X_ID_ASC',
  PoolCreationsVarianceSampleTokenXIdDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TOKEN_X_ID_DESC',
  PoolCreationsVarianceSampleTokenYIdAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TOKEN_Y_ID_ASC',
  PoolCreationsVarianceSampleTokenYIdDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TOKEN_Y_ID_DESC',
  PoolCreationsVarianceSampleTotalValueLockedTokenXAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_X_ASC',
  PoolCreationsVarianceSampleTotalValueLockedTokenXDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_X_DESC',
  PoolCreationsVarianceSampleTotalValueLockedTokenYAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_Y_ASC',
  PoolCreationsVarianceSampleTotalValueLockedTokenYDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_TOKEN_Y_DESC',
  PoolCreationsVarianceSampleTotalValueLockedUSDAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_U_S_D_ASC',
  PoolCreationsVarianceSampleTotalValueLockedUSDDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TOTAL_VALUE_LOCKED_U_S_D_DESC',
  PoolCreationsVarianceSampleTransactionIdAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TRANSACTION_ID_ASC',
  PoolCreationsVarianceSampleTransactionIdDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TRANSACTION_ID_DESC',
  PoolCreationsVarianceSampleTxCountAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TX_COUNT_ASC',
  PoolCreationsVarianceSampleTxCountDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_TX_COUNT_DESC',
  PoolCreationsVarianceSampleUpdatedAtAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_UPDATED_AT_ASC',
  PoolCreationsVarianceSampleUpdatedAtDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_UPDATED_AT_DESC',
  PoolCreationsVarianceSampleVolumeTokenXAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_VOLUME_TOKEN_X_ASC',
  PoolCreationsVarianceSampleVolumeTokenXDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_VOLUME_TOKEN_X_DESC',
  PoolCreationsVarianceSampleVolumeTokenYAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_VOLUME_TOKEN_Y_ASC',
  PoolCreationsVarianceSampleVolumeTokenYDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_VOLUME_TOKEN_Y_DESC',
  PoolCreationsVarianceSampleVolumeUSDAsc = 'POOL_CREATIONS_VARIANCE_SAMPLE_VOLUME_U_S_D_ASC',
  PoolCreationsVarianceSampleVolumeUSDDesc = 'POOL_CREATIONS_VARIANCE_SAMPLE_VOLUME_U_S_D_DESC',
  PoolTokenIncentivesAverageBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_BLOCK_RANGE_ASC',
  PoolTokenIncentivesAverageBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_BLOCK_RANGE_DESC',
  PoolTokenIncentivesAverageIdAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_ID_ASC',
  PoolTokenIncentivesAverageIdDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_ID_DESC',
  PoolTokenIncentivesAverageIndexAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_INDEX_ASC',
  PoolTokenIncentivesAverageIndexDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_INDEX_DESC',
  PoolTokenIncentivesAveragePoolIdAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_POOL_ID_ASC',
  PoolTokenIncentivesAveragePoolIdDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_POOL_ID_DESC',
  PoolTokenIncentivesAverageRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesAverageRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesAverageStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_START_TIMESTAMP_ASC',
  PoolTokenIncentivesAverageStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_START_TIMESTAMP_DESC',
  PoolTokenIncentivesAverageTokenIdAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_TOKEN_ID_ASC',
  PoolTokenIncentivesAverageTokenIdDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_TOKEN_ID_DESC',
  PoolTokenIncentivesAverageTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_TOTAL_REWARD_ASC',
  PoolTokenIncentivesAverageTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_TOTAL_REWARD_DESC',
  PoolTokenIncentivesAverageTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_AVERAGE_TRANSACTION_ID_ASC',
  PoolTokenIncentivesAverageTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_AVERAGE_TRANSACTION_ID_DESC',
  PoolTokenIncentivesCountAsc = 'POOL_TOKEN_INCENTIVES_COUNT_ASC',
  PoolTokenIncentivesCountDesc = 'POOL_TOKEN_INCENTIVES_COUNT_DESC',
  PoolTokenIncentivesDistinctCountBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  PoolTokenIncentivesDistinctCountBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  PoolTokenIncentivesDistinctCountIdAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_ID_ASC',
  PoolTokenIncentivesDistinctCountIdDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_ID_DESC',
  PoolTokenIncentivesDistinctCountIndexAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_INDEX_ASC',
  PoolTokenIncentivesDistinctCountIndexDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_INDEX_DESC',
  PoolTokenIncentivesDistinctCountPoolIdAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_POOL_ID_ASC',
  PoolTokenIncentivesDistinctCountPoolIdDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_POOL_ID_DESC',
  PoolTokenIncentivesDistinctCountRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesDistinctCountRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesDistinctCountStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_START_TIMESTAMP_ASC',
  PoolTokenIncentivesDistinctCountStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_START_TIMESTAMP_DESC',
  PoolTokenIncentivesDistinctCountTokenIdAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_TOKEN_ID_ASC',
  PoolTokenIncentivesDistinctCountTokenIdDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_TOKEN_ID_DESC',
  PoolTokenIncentivesDistinctCountTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_TOTAL_REWARD_ASC',
  PoolTokenIncentivesDistinctCountTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_TOTAL_REWARD_DESC',
  PoolTokenIncentivesDistinctCountTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_TRANSACTION_ID_ASC',
  PoolTokenIncentivesDistinctCountTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_DISTINCT_COUNT_TRANSACTION_ID_DESC',
  PoolTokenIncentivesMaxBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_MAX_BLOCK_RANGE_ASC',
  PoolTokenIncentivesMaxBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_MAX_BLOCK_RANGE_DESC',
  PoolTokenIncentivesMaxIdAsc = 'POOL_TOKEN_INCENTIVES_MAX_ID_ASC',
  PoolTokenIncentivesMaxIdDesc = 'POOL_TOKEN_INCENTIVES_MAX_ID_DESC',
  PoolTokenIncentivesMaxIndexAsc = 'POOL_TOKEN_INCENTIVES_MAX_INDEX_ASC',
  PoolTokenIncentivesMaxIndexDesc = 'POOL_TOKEN_INCENTIVES_MAX_INDEX_DESC',
  PoolTokenIncentivesMaxPoolIdAsc = 'POOL_TOKEN_INCENTIVES_MAX_POOL_ID_ASC',
  PoolTokenIncentivesMaxPoolIdDesc = 'POOL_TOKEN_INCENTIVES_MAX_POOL_ID_DESC',
  PoolTokenIncentivesMaxRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_MAX_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesMaxRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_MAX_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesMaxStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_MAX_START_TIMESTAMP_ASC',
  PoolTokenIncentivesMaxStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_MAX_START_TIMESTAMP_DESC',
  PoolTokenIncentivesMaxTokenIdAsc = 'POOL_TOKEN_INCENTIVES_MAX_TOKEN_ID_ASC',
  PoolTokenIncentivesMaxTokenIdDesc = 'POOL_TOKEN_INCENTIVES_MAX_TOKEN_ID_DESC',
  PoolTokenIncentivesMaxTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_MAX_TOTAL_REWARD_ASC',
  PoolTokenIncentivesMaxTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_MAX_TOTAL_REWARD_DESC',
  PoolTokenIncentivesMaxTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_MAX_TRANSACTION_ID_ASC',
  PoolTokenIncentivesMaxTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_MAX_TRANSACTION_ID_DESC',
  PoolTokenIncentivesMinBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_MIN_BLOCK_RANGE_ASC',
  PoolTokenIncentivesMinBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_MIN_BLOCK_RANGE_DESC',
  PoolTokenIncentivesMinIdAsc = 'POOL_TOKEN_INCENTIVES_MIN_ID_ASC',
  PoolTokenIncentivesMinIdDesc = 'POOL_TOKEN_INCENTIVES_MIN_ID_DESC',
  PoolTokenIncentivesMinIndexAsc = 'POOL_TOKEN_INCENTIVES_MIN_INDEX_ASC',
  PoolTokenIncentivesMinIndexDesc = 'POOL_TOKEN_INCENTIVES_MIN_INDEX_DESC',
  PoolTokenIncentivesMinPoolIdAsc = 'POOL_TOKEN_INCENTIVES_MIN_POOL_ID_ASC',
  PoolTokenIncentivesMinPoolIdDesc = 'POOL_TOKEN_INCENTIVES_MIN_POOL_ID_DESC',
  PoolTokenIncentivesMinRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_MIN_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesMinRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_MIN_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesMinStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_MIN_START_TIMESTAMP_ASC',
  PoolTokenIncentivesMinStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_MIN_START_TIMESTAMP_DESC',
  PoolTokenIncentivesMinTokenIdAsc = 'POOL_TOKEN_INCENTIVES_MIN_TOKEN_ID_ASC',
  PoolTokenIncentivesMinTokenIdDesc = 'POOL_TOKEN_INCENTIVES_MIN_TOKEN_ID_DESC',
  PoolTokenIncentivesMinTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_MIN_TOTAL_REWARD_ASC',
  PoolTokenIncentivesMinTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_MIN_TOTAL_REWARD_DESC',
  PoolTokenIncentivesMinTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_MIN_TRANSACTION_ID_ASC',
  PoolTokenIncentivesMinTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_MIN_TRANSACTION_ID_DESC',
  PoolTokenIncentivesStddevPopulationBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  PoolTokenIncentivesStddevPopulationBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  PoolTokenIncentivesStddevPopulationIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_ID_ASC',
  PoolTokenIncentivesStddevPopulationIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_ID_DESC',
  PoolTokenIncentivesStddevPopulationIndexAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_INDEX_ASC',
  PoolTokenIncentivesStddevPopulationIndexDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_INDEX_DESC',
  PoolTokenIncentivesStddevPopulationPoolIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_POOL_ID_ASC',
  PoolTokenIncentivesStddevPopulationPoolIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_POOL_ID_DESC',
  PoolTokenIncentivesStddevPopulationRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesStddevPopulationRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesStddevPopulationStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_START_TIMESTAMP_ASC',
  PoolTokenIncentivesStddevPopulationStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_START_TIMESTAMP_DESC',
  PoolTokenIncentivesStddevPopulationTokenIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_TOKEN_ID_ASC',
  PoolTokenIncentivesStddevPopulationTokenIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_TOKEN_ID_DESC',
  PoolTokenIncentivesStddevPopulationTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_TOTAL_REWARD_ASC',
  PoolTokenIncentivesStddevPopulationTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_TOTAL_REWARD_DESC',
  PoolTokenIncentivesStddevPopulationTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_TRANSACTION_ID_ASC',
  PoolTokenIncentivesStddevPopulationTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_POPULATION_TRANSACTION_ID_DESC',
  PoolTokenIncentivesStddevSampleBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  PoolTokenIncentivesStddevSampleBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  PoolTokenIncentivesStddevSampleIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_ID_ASC',
  PoolTokenIncentivesStddevSampleIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_ID_DESC',
  PoolTokenIncentivesStddevSampleIndexAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_INDEX_ASC',
  PoolTokenIncentivesStddevSampleIndexDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_INDEX_DESC',
  PoolTokenIncentivesStddevSamplePoolIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_POOL_ID_ASC',
  PoolTokenIncentivesStddevSamplePoolIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_POOL_ID_DESC',
  PoolTokenIncentivesStddevSampleRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesStddevSampleRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesStddevSampleStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_START_TIMESTAMP_ASC',
  PoolTokenIncentivesStddevSampleStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_START_TIMESTAMP_DESC',
  PoolTokenIncentivesStddevSampleTokenIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_TOKEN_ID_ASC',
  PoolTokenIncentivesStddevSampleTokenIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_TOKEN_ID_DESC',
  PoolTokenIncentivesStddevSampleTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_TOTAL_REWARD_ASC',
  PoolTokenIncentivesStddevSampleTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_TOTAL_REWARD_DESC',
  PoolTokenIncentivesStddevSampleTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_TRANSACTION_ID_ASC',
  PoolTokenIncentivesStddevSampleTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_STDDEV_SAMPLE_TRANSACTION_ID_DESC',
  PoolTokenIncentivesSumBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_SUM_BLOCK_RANGE_ASC',
  PoolTokenIncentivesSumBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_SUM_BLOCK_RANGE_DESC',
  PoolTokenIncentivesSumIdAsc = 'POOL_TOKEN_INCENTIVES_SUM_ID_ASC',
  PoolTokenIncentivesSumIdDesc = 'POOL_TOKEN_INCENTIVES_SUM_ID_DESC',
  PoolTokenIncentivesSumIndexAsc = 'POOL_TOKEN_INCENTIVES_SUM_INDEX_ASC',
  PoolTokenIncentivesSumIndexDesc = 'POOL_TOKEN_INCENTIVES_SUM_INDEX_DESC',
  PoolTokenIncentivesSumPoolIdAsc = 'POOL_TOKEN_INCENTIVES_SUM_POOL_ID_ASC',
  PoolTokenIncentivesSumPoolIdDesc = 'POOL_TOKEN_INCENTIVES_SUM_POOL_ID_DESC',
  PoolTokenIncentivesSumRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_SUM_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesSumRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_SUM_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesSumStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_SUM_START_TIMESTAMP_ASC',
  PoolTokenIncentivesSumStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_SUM_START_TIMESTAMP_DESC',
  PoolTokenIncentivesSumTokenIdAsc = 'POOL_TOKEN_INCENTIVES_SUM_TOKEN_ID_ASC',
  PoolTokenIncentivesSumTokenIdDesc = 'POOL_TOKEN_INCENTIVES_SUM_TOKEN_ID_DESC',
  PoolTokenIncentivesSumTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_SUM_TOTAL_REWARD_ASC',
  PoolTokenIncentivesSumTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_SUM_TOTAL_REWARD_DESC',
  PoolTokenIncentivesSumTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_SUM_TRANSACTION_ID_ASC',
  PoolTokenIncentivesSumTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_SUM_TRANSACTION_ID_DESC',
  PoolTokenIncentivesVariancePopulationBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  PoolTokenIncentivesVariancePopulationBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  PoolTokenIncentivesVariancePopulationIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_ID_ASC',
  PoolTokenIncentivesVariancePopulationIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_ID_DESC',
  PoolTokenIncentivesVariancePopulationIndexAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_INDEX_ASC',
  PoolTokenIncentivesVariancePopulationIndexDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_INDEX_DESC',
  PoolTokenIncentivesVariancePopulationPoolIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_POOL_ID_ASC',
  PoolTokenIncentivesVariancePopulationPoolIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_POOL_ID_DESC',
  PoolTokenIncentivesVariancePopulationRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesVariancePopulationRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesVariancePopulationStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_START_TIMESTAMP_ASC',
  PoolTokenIncentivesVariancePopulationStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_START_TIMESTAMP_DESC',
  PoolTokenIncentivesVariancePopulationTokenIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_TOKEN_ID_ASC',
  PoolTokenIncentivesVariancePopulationTokenIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_TOKEN_ID_DESC',
  PoolTokenIncentivesVariancePopulationTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_TOTAL_REWARD_ASC',
  PoolTokenIncentivesVariancePopulationTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_TOTAL_REWARD_DESC',
  PoolTokenIncentivesVariancePopulationTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_TRANSACTION_ID_ASC',
  PoolTokenIncentivesVariancePopulationTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_POPULATION_TRANSACTION_ID_DESC',
  PoolTokenIncentivesVarianceSampleBlockRangeAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  PoolTokenIncentivesVarianceSampleBlockRangeDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  PoolTokenIncentivesVarianceSampleIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_ID_ASC',
  PoolTokenIncentivesVarianceSampleIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_ID_DESC',
  PoolTokenIncentivesVarianceSampleIndexAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_INDEX_ASC',
  PoolTokenIncentivesVarianceSampleIndexDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_INDEX_DESC',
  PoolTokenIncentivesVarianceSamplePoolIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_POOL_ID_ASC',
  PoolTokenIncentivesVarianceSamplePoolIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_POOL_ID_DESC',
  PoolTokenIncentivesVarianceSampleRewardPerSecAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_REWARD_PER_SEC_ASC',
  PoolTokenIncentivesVarianceSampleRewardPerSecDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_REWARD_PER_SEC_DESC',
  PoolTokenIncentivesVarianceSampleStartTimestampAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_START_TIMESTAMP_ASC',
  PoolTokenIncentivesVarianceSampleStartTimestampDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_START_TIMESTAMP_DESC',
  PoolTokenIncentivesVarianceSampleTokenIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_TOKEN_ID_ASC',
  PoolTokenIncentivesVarianceSampleTokenIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_TOKEN_ID_DESC',
  PoolTokenIncentivesVarianceSampleTotalRewardAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_TOTAL_REWARD_ASC',
  PoolTokenIncentivesVarianceSampleTotalRewardDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_TOTAL_REWARD_DESC',
  PoolTokenIncentivesVarianceSampleTransactionIdAsc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_TRANSACTION_ID_ASC',
  PoolTokenIncentivesVarianceSampleTransactionIdDesc = 'POOL_TOKEN_INCENTIVES_VARIANCE_SAMPLE_TRANSACTION_ID_DESC',
  PositionsAverageBlockRangeAsc = 'POSITIONS_AVERAGE_BLOCK_RANGE_ASC',
  PositionsAverageBlockRangeDesc = 'POSITIONS_AVERAGE_BLOCK_RANGE_DESC',
  PositionsAverageClosedAtAsc = 'POSITIONS_AVERAGE_CLOSED_AT_ASC',
  PositionsAverageClosedAtDesc = 'POSITIONS_AVERAGE_CLOSED_AT_DESC',
  PositionsAverageCreatedAtAsc = 'POSITIONS_AVERAGE_CREATED_AT_ASC',
  PositionsAverageCreatedAtDesc = 'POSITIONS_AVERAGE_CREATED_AT_DESC',
  PositionsAverageIdAsc = 'POSITIONS_AVERAGE_ID_ASC',
  PositionsAverageIdDesc = 'POSITIONS_AVERAGE_ID_DESC',
  PositionsAverageLiquidityAsc = 'POSITIONS_AVERAGE_LIQUIDITY_ASC',
  PositionsAverageLiquidityDesc = 'POSITIONS_AVERAGE_LIQUIDITY_DESC',
  PositionsAverageOwnerIdAsc = 'POSITIONS_AVERAGE_OWNER_ID_ASC',
  PositionsAverageOwnerIdDesc = 'POSITIONS_AVERAGE_OWNER_ID_DESC',
  PositionsAveragePoolIdAsc = 'POSITIONS_AVERAGE_POOL_ID_ASC',
  PositionsAveragePoolIdDesc = 'POSITIONS_AVERAGE_POOL_ID_DESC',
  PositionsAveragePrincipalAmountXAsc = 'POSITIONS_AVERAGE_PRINCIPAL_AMOUNT_X_ASC',
  PositionsAveragePrincipalAmountXDesc = 'POSITIONS_AVERAGE_PRINCIPAL_AMOUNT_X_DESC',
  PositionsAveragePrincipalAmountYAsc = 'POSITIONS_AVERAGE_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsAveragePrincipalAmountYDesc = 'POSITIONS_AVERAGE_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsAverageStatusAsc = 'POSITIONS_AVERAGE_STATUS_ASC',
  PositionsAverageStatusDesc = 'POSITIONS_AVERAGE_STATUS_DESC',
  PositionsAverageTickLowerAsc = 'POSITIONS_AVERAGE_TICK_LOWER_ASC',
  PositionsAverageTickLowerDesc = 'POSITIONS_AVERAGE_TICK_LOWER_DESC',
  PositionsAverageTickUpperAsc = 'POSITIONS_AVERAGE_TICK_UPPER_ASC',
  PositionsAverageTickUpperDesc = 'POSITIONS_AVERAGE_TICK_UPPER_DESC',
  PositionsAverageTokenIdAsc = 'POSITIONS_AVERAGE_TOKEN_ID_ASC',
  PositionsAverageTokenIdDesc = 'POSITIONS_AVERAGE_TOKEN_ID_DESC',
  PositionsAverageTransactionIdAsc = 'POSITIONS_AVERAGE_TRANSACTION_ID_ASC',
  PositionsAverageTransactionIdDesc = 'POSITIONS_AVERAGE_TRANSACTION_ID_DESC',
  PositionsCountAsc = 'POSITIONS_COUNT_ASC',
  PositionsCountDesc = 'POSITIONS_COUNT_DESC',
  PositionsDistinctCountBlockRangeAsc = 'POSITIONS_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  PositionsDistinctCountBlockRangeDesc = 'POSITIONS_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  PositionsDistinctCountClosedAtAsc = 'POSITIONS_DISTINCT_COUNT_CLOSED_AT_ASC',
  PositionsDistinctCountClosedAtDesc = 'POSITIONS_DISTINCT_COUNT_CLOSED_AT_DESC',
  PositionsDistinctCountCreatedAtAsc = 'POSITIONS_DISTINCT_COUNT_CREATED_AT_ASC',
  PositionsDistinctCountCreatedAtDesc = 'POSITIONS_DISTINCT_COUNT_CREATED_AT_DESC',
  PositionsDistinctCountIdAsc = 'POSITIONS_DISTINCT_COUNT_ID_ASC',
  PositionsDistinctCountIdDesc = 'POSITIONS_DISTINCT_COUNT_ID_DESC',
  PositionsDistinctCountLiquidityAsc = 'POSITIONS_DISTINCT_COUNT_LIQUIDITY_ASC',
  PositionsDistinctCountLiquidityDesc = 'POSITIONS_DISTINCT_COUNT_LIQUIDITY_DESC',
  PositionsDistinctCountOwnerIdAsc = 'POSITIONS_DISTINCT_COUNT_OWNER_ID_ASC',
  PositionsDistinctCountOwnerIdDesc = 'POSITIONS_DISTINCT_COUNT_OWNER_ID_DESC',
  PositionsDistinctCountPoolIdAsc = 'POSITIONS_DISTINCT_COUNT_POOL_ID_ASC',
  PositionsDistinctCountPoolIdDesc = 'POSITIONS_DISTINCT_COUNT_POOL_ID_DESC',
  PositionsDistinctCountPrincipalAmountXAsc = 'POSITIONS_DISTINCT_COUNT_PRINCIPAL_AMOUNT_X_ASC',
  PositionsDistinctCountPrincipalAmountXDesc = 'POSITIONS_DISTINCT_COUNT_PRINCIPAL_AMOUNT_X_DESC',
  PositionsDistinctCountPrincipalAmountYAsc = 'POSITIONS_DISTINCT_COUNT_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsDistinctCountPrincipalAmountYDesc = 'POSITIONS_DISTINCT_COUNT_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsDistinctCountStatusAsc = 'POSITIONS_DISTINCT_COUNT_STATUS_ASC',
  PositionsDistinctCountStatusDesc = 'POSITIONS_DISTINCT_COUNT_STATUS_DESC',
  PositionsDistinctCountTickLowerAsc = 'POSITIONS_DISTINCT_COUNT_TICK_LOWER_ASC',
  PositionsDistinctCountTickLowerDesc = 'POSITIONS_DISTINCT_COUNT_TICK_LOWER_DESC',
  PositionsDistinctCountTickUpperAsc = 'POSITIONS_DISTINCT_COUNT_TICK_UPPER_ASC',
  PositionsDistinctCountTickUpperDesc = 'POSITIONS_DISTINCT_COUNT_TICK_UPPER_DESC',
  PositionsDistinctCountTokenIdAsc = 'POSITIONS_DISTINCT_COUNT_TOKEN_ID_ASC',
  PositionsDistinctCountTokenIdDesc = 'POSITIONS_DISTINCT_COUNT_TOKEN_ID_DESC',
  PositionsDistinctCountTransactionIdAsc = 'POSITIONS_DISTINCT_COUNT_TRANSACTION_ID_ASC',
  PositionsDistinctCountTransactionIdDesc = 'POSITIONS_DISTINCT_COUNT_TRANSACTION_ID_DESC',
  PositionsMaxBlockRangeAsc = 'POSITIONS_MAX_BLOCK_RANGE_ASC',
  PositionsMaxBlockRangeDesc = 'POSITIONS_MAX_BLOCK_RANGE_DESC',
  PositionsMaxClosedAtAsc = 'POSITIONS_MAX_CLOSED_AT_ASC',
  PositionsMaxClosedAtDesc = 'POSITIONS_MAX_CLOSED_AT_DESC',
  PositionsMaxCreatedAtAsc = 'POSITIONS_MAX_CREATED_AT_ASC',
  PositionsMaxCreatedAtDesc = 'POSITIONS_MAX_CREATED_AT_DESC',
  PositionsMaxIdAsc = 'POSITIONS_MAX_ID_ASC',
  PositionsMaxIdDesc = 'POSITIONS_MAX_ID_DESC',
  PositionsMaxLiquidityAsc = 'POSITIONS_MAX_LIQUIDITY_ASC',
  PositionsMaxLiquidityDesc = 'POSITIONS_MAX_LIQUIDITY_DESC',
  PositionsMaxOwnerIdAsc = 'POSITIONS_MAX_OWNER_ID_ASC',
  PositionsMaxOwnerIdDesc = 'POSITIONS_MAX_OWNER_ID_DESC',
  PositionsMaxPoolIdAsc = 'POSITIONS_MAX_POOL_ID_ASC',
  PositionsMaxPoolIdDesc = 'POSITIONS_MAX_POOL_ID_DESC',
  PositionsMaxPrincipalAmountXAsc = 'POSITIONS_MAX_PRINCIPAL_AMOUNT_X_ASC',
  PositionsMaxPrincipalAmountXDesc = 'POSITIONS_MAX_PRINCIPAL_AMOUNT_X_DESC',
  PositionsMaxPrincipalAmountYAsc = 'POSITIONS_MAX_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsMaxPrincipalAmountYDesc = 'POSITIONS_MAX_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsMaxStatusAsc = 'POSITIONS_MAX_STATUS_ASC',
  PositionsMaxStatusDesc = 'POSITIONS_MAX_STATUS_DESC',
  PositionsMaxTickLowerAsc = 'POSITIONS_MAX_TICK_LOWER_ASC',
  PositionsMaxTickLowerDesc = 'POSITIONS_MAX_TICK_LOWER_DESC',
  PositionsMaxTickUpperAsc = 'POSITIONS_MAX_TICK_UPPER_ASC',
  PositionsMaxTickUpperDesc = 'POSITIONS_MAX_TICK_UPPER_DESC',
  PositionsMaxTokenIdAsc = 'POSITIONS_MAX_TOKEN_ID_ASC',
  PositionsMaxTokenIdDesc = 'POSITIONS_MAX_TOKEN_ID_DESC',
  PositionsMaxTransactionIdAsc = 'POSITIONS_MAX_TRANSACTION_ID_ASC',
  PositionsMaxTransactionIdDesc = 'POSITIONS_MAX_TRANSACTION_ID_DESC',
  PositionsMinBlockRangeAsc = 'POSITIONS_MIN_BLOCK_RANGE_ASC',
  PositionsMinBlockRangeDesc = 'POSITIONS_MIN_BLOCK_RANGE_DESC',
  PositionsMinClosedAtAsc = 'POSITIONS_MIN_CLOSED_AT_ASC',
  PositionsMinClosedAtDesc = 'POSITIONS_MIN_CLOSED_AT_DESC',
  PositionsMinCreatedAtAsc = 'POSITIONS_MIN_CREATED_AT_ASC',
  PositionsMinCreatedAtDesc = 'POSITIONS_MIN_CREATED_AT_DESC',
  PositionsMinIdAsc = 'POSITIONS_MIN_ID_ASC',
  PositionsMinIdDesc = 'POSITIONS_MIN_ID_DESC',
  PositionsMinLiquidityAsc = 'POSITIONS_MIN_LIQUIDITY_ASC',
  PositionsMinLiquidityDesc = 'POSITIONS_MIN_LIQUIDITY_DESC',
  PositionsMinOwnerIdAsc = 'POSITIONS_MIN_OWNER_ID_ASC',
  PositionsMinOwnerIdDesc = 'POSITIONS_MIN_OWNER_ID_DESC',
  PositionsMinPoolIdAsc = 'POSITIONS_MIN_POOL_ID_ASC',
  PositionsMinPoolIdDesc = 'POSITIONS_MIN_POOL_ID_DESC',
  PositionsMinPrincipalAmountXAsc = 'POSITIONS_MIN_PRINCIPAL_AMOUNT_X_ASC',
  PositionsMinPrincipalAmountXDesc = 'POSITIONS_MIN_PRINCIPAL_AMOUNT_X_DESC',
  PositionsMinPrincipalAmountYAsc = 'POSITIONS_MIN_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsMinPrincipalAmountYDesc = 'POSITIONS_MIN_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsMinStatusAsc = 'POSITIONS_MIN_STATUS_ASC',
  PositionsMinStatusDesc = 'POSITIONS_MIN_STATUS_DESC',
  PositionsMinTickLowerAsc = 'POSITIONS_MIN_TICK_LOWER_ASC',
  PositionsMinTickLowerDesc = 'POSITIONS_MIN_TICK_LOWER_DESC',
  PositionsMinTickUpperAsc = 'POSITIONS_MIN_TICK_UPPER_ASC',
  PositionsMinTickUpperDesc = 'POSITIONS_MIN_TICK_UPPER_DESC',
  PositionsMinTokenIdAsc = 'POSITIONS_MIN_TOKEN_ID_ASC',
  PositionsMinTokenIdDesc = 'POSITIONS_MIN_TOKEN_ID_DESC',
  PositionsMinTransactionIdAsc = 'POSITIONS_MIN_TRANSACTION_ID_ASC',
  PositionsMinTransactionIdDesc = 'POSITIONS_MIN_TRANSACTION_ID_DESC',
  PositionsStddevPopulationBlockRangeAsc = 'POSITIONS_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  PositionsStddevPopulationBlockRangeDesc = 'POSITIONS_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  PositionsStddevPopulationClosedAtAsc = 'POSITIONS_STDDEV_POPULATION_CLOSED_AT_ASC',
  PositionsStddevPopulationClosedAtDesc = 'POSITIONS_STDDEV_POPULATION_CLOSED_AT_DESC',
  PositionsStddevPopulationCreatedAtAsc = 'POSITIONS_STDDEV_POPULATION_CREATED_AT_ASC',
  PositionsStddevPopulationCreatedAtDesc = 'POSITIONS_STDDEV_POPULATION_CREATED_AT_DESC',
  PositionsStddevPopulationIdAsc = 'POSITIONS_STDDEV_POPULATION_ID_ASC',
  PositionsStddevPopulationIdDesc = 'POSITIONS_STDDEV_POPULATION_ID_DESC',
  PositionsStddevPopulationLiquidityAsc = 'POSITIONS_STDDEV_POPULATION_LIQUIDITY_ASC',
  PositionsStddevPopulationLiquidityDesc = 'POSITIONS_STDDEV_POPULATION_LIQUIDITY_DESC',
  PositionsStddevPopulationOwnerIdAsc = 'POSITIONS_STDDEV_POPULATION_OWNER_ID_ASC',
  PositionsStddevPopulationOwnerIdDesc = 'POSITIONS_STDDEV_POPULATION_OWNER_ID_DESC',
  PositionsStddevPopulationPoolIdAsc = 'POSITIONS_STDDEV_POPULATION_POOL_ID_ASC',
  PositionsStddevPopulationPoolIdDesc = 'POSITIONS_STDDEV_POPULATION_POOL_ID_DESC',
  PositionsStddevPopulationPrincipalAmountXAsc = 'POSITIONS_STDDEV_POPULATION_PRINCIPAL_AMOUNT_X_ASC',
  PositionsStddevPopulationPrincipalAmountXDesc = 'POSITIONS_STDDEV_POPULATION_PRINCIPAL_AMOUNT_X_DESC',
  PositionsStddevPopulationPrincipalAmountYAsc = 'POSITIONS_STDDEV_POPULATION_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsStddevPopulationPrincipalAmountYDesc = 'POSITIONS_STDDEV_POPULATION_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsStddevPopulationStatusAsc = 'POSITIONS_STDDEV_POPULATION_STATUS_ASC',
  PositionsStddevPopulationStatusDesc = 'POSITIONS_STDDEV_POPULATION_STATUS_DESC',
  PositionsStddevPopulationTickLowerAsc = 'POSITIONS_STDDEV_POPULATION_TICK_LOWER_ASC',
  PositionsStddevPopulationTickLowerDesc = 'POSITIONS_STDDEV_POPULATION_TICK_LOWER_DESC',
  PositionsStddevPopulationTickUpperAsc = 'POSITIONS_STDDEV_POPULATION_TICK_UPPER_ASC',
  PositionsStddevPopulationTickUpperDesc = 'POSITIONS_STDDEV_POPULATION_TICK_UPPER_DESC',
  PositionsStddevPopulationTokenIdAsc = 'POSITIONS_STDDEV_POPULATION_TOKEN_ID_ASC',
  PositionsStddevPopulationTokenIdDesc = 'POSITIONS_STDDEV_POPULATION_TOKEN_ID_DESC',
  PositionsStddevPopulationTransactionIdAsc = 'POSITIONS_STDDEV_POPULATION_TRANSACTION_ID_ASC',
  PositionsStddevPopulationTransactionIdDesc = 'POSITIONS_STDDEV_POPULATION_TRANSACTION_ID_DESC',
  PositionsStddevSampleBlockRangeAsc = 'POSITIONS_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  PositionsStddevSampleBlockRangeDesc = 'POSITIONS_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  PositionsStddevSampleClosedAtAsc = 'POSITIONS_STDDEV_SAMPLE_CLOSED_AT_ASC',
  PositionsStddevSampleClosedAtDesc = 'POSITIONS_STDDEV_SAMPLE_CLOSED_AT_DESC',
  PositionsStddevSampleCreatedAtAsc = 'POSITIONS_STDDEV_SAMPLE_CREATED_AT_ASC',
  PositionsStddevSampleCreatedAtDesc = 'POSITIONS_STDDEV_SAMPLE_CREATED_AT_DESC',
  PositionsStddevSampleIdAsc = 'POSITIONS_STDDEV_SAMPLE_ID_ASC',
  PositionsStddevSampleIdDesc = 'POSITIONS_STDDEV_SAMPLE_ID_DESC',
  PositionsStddevSampleLiquidityAsc = 'POSITIONS_STDDEV_SAMPLE_LIQUIDITY_ASC',
  PositionsStddevSampleLiquidityDesc = 'POSITIONS_STDDEV_SAMPLE_LIQUIDITY_DESC',
  PositionsStddevSampleOwnerIdAsc = 'POSITIONS_STDDEV_SAMPLE_OWNER_ID_ASC',
  PositionsStddevSampleOwnerIdDesc = 'POSITIONS_STDDEV_SAMPLE_OWNER_ID_DESC',
  PositionsStddevSamplePoolIdAsc = 'POSITIONS_STDDEV_SAMPLE_POOL_ID_ASC',
  PositionsStddevSamplePoolIdDesc = 'POSITIONS_STDDEV_SAMPLE_POOL_ID_DESC',
  PositionsStddevSamplePrincipalAmountXAsc = 'POSITIONS_STDDEV_SAMPLE_PRINCIPAL_AMOUNT_X_ASC',
  PositionsStddevSamplePrincipalAmountXDesc = 'POSITIONS_STDDEV_SAMPLE_PRINCIPAL_AMOUNT_X_DESC',
  PositionsStddevSamplePrincipalAmountYAsc = 'POSITIONS_STDDEV_SAMPLE_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsStddevSamplePrincipalAmountYDesc = 'POSITIONS_STDDEV_SAMPLE_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsStddevSampleStatusAsc = 'POSITIONS_STDDEV_SAMPLE_STATUS_ASC',
  PositionsStddevSampleStatusDesc = 'POSITIONS_STDDEV_SAMPLE_STATUS_DESC',
  PositionsStddevSampleTickLowerAsc = 'POSITIONS_STDDEV_SAMPLE_TICK_LOWER_ASC',
  PositionsStddevSampleTickLowerDesc = 'POSITIONS_STDDEV_SAMPLE_TICK_LOWER_DESC',
  PositionsStddevSampleTickUpperAsc = 'POSITIONS_STDDEV_SAMPLE_TICK_UPPER_ASC',
  PositionsStddevSampleTickUpperDesc = 'POSITIONS_STDDEV_SAMPLE_TICK_UPPER_DESC',
  PositionsStddevSampleTokenIdAsc = 'POSITIONS_STDDEV_SAMPLE_TOKEN_ID_ASC',
  PositionsStddevSampleTokenIdDesc = 'POSITIONS_STDDEV_SAMPLE_TOKEN_ID_DESC',
  PositionsStddevSampleTransactionIdAsc = 'POSITIONS_STDDEV_SAMPLE_TRANSACTION_ID_ASC',
  PositionsStddevSampleTransactionIdDesc = 'POSITIONS_STDDEV_SAMPLE_TRANSACTION_ID_DESC',
  PositionsSumBlockRangeAsc = 'POSITIONS_SUM_BLOCK_RANGE_ASC',
  PositionsSumBlockRangeDesc = 'POSITIONS_SUM_BLOCK_RANGE_DESC',
  PositionsSumClosedAtAsc = 'POSITIONS_SUM_CLOSED_AT_ASC',
  PositionsSumClosedAtDesc = 'POSITIONS_SUM_CLOSED_AT_DESC',
  PositionsSumCreatedAtAsc = 'POSITIONS_SUM_CREATED_AT_ASC',
  PositionsSumCreatedAtDesc = 'POSITIONS_SUM_CREATED_AT_DESC',
  PositionsSumIdAsc = 'POSITIONS_SUM_ID_ASC',
  PositionsSumIdDesc = 'POSITIONS_SUM_ID_DESC',
  PositionsSumLiquidityAsc = 'POSITIONS_SUM_LIQUIDITY_ASC',
  PositionsSumLiquidityDesc = 'POSITIONS_SUM_LIQUIDITY_DESC',
  PositionsSumOwnerIdAsc = 'POSITIONS_SUM_OWNER_ID_ASC',
  PositionsSumOwnerIdDesc = 'POSITIONS_SUM_OWNER_ID_DESC',
  PositionsSumPoolIdAsc = 'POSITIONS_SUM_POOL_ID_ASC',
  PositionsSumPoolIdDesc = 'POSITIONS_SUM_POOL_ID_DESC',
  PositionsSumPrincipalAmountXAsc = 'POSITIONS_SUM_PRINCIPAL_AMOUNT_X_ASC',
  PositionsSumPrincipalAmountXDesc = 'POSITIONS_SUM_PRINCIPAL_AMOUNT_X_DESC',
  PositionsSumPrincipalAmountYAsc = 'POSITIONS_SUM_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsSumPrincipalAmountYDesc = 'POSITIONS_SUM_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsSumStatusAsc = 'POSITIONS_SUM_STATUS_ASC',
  PositionsSumStatusDesc = 'POSITIONS_SUM_STATUS_DESC',
  PositionsSumTickLowerAsc = 'POSITIONS_SUM_TICK_LOWER_ASC',
  PositionsSumTickLowerDesc = 'POSITIONS_SUM_TICK_LOWER_DESC',
  PositionsSumTickUpperAsc = 'POSITIONS_SUM_TICK_UPPER_ASC',
  PositionsSumTickUpperDesc = 'POSITIONS_SUM_TICK_UPPER_DESC',
  PositionsSumTokenIdAsc = 'POSITIONS_SUM_TOKEN_ID_ASC',
  PositionsSumTokenIdDesc = 'POSITIONS_SUM_TOKEN_ID_DESC',
  PositionsSumTransactionIdAsc = 'POSITIONS_SUM_TRANSACTION_ID_ASC',
  PositionsSumTransactionIdDesc = 'POSITIONS_SUM_TRANSACTION_ID_DESC',
  PositionsVariancePopulationBlockRangeAsc = 'POSITIONS_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  PositionsVariancePopulationBlockRangeDesc = 'POSITIONS_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  PositionsVariancePopulationClosedAtAsc = 'POSITIONS_VARIANCE_POPULATION_CLOSED_AT_ASC',
  PositionsVariancePopulationClosedAtDesc = 'POSITIONS_VARIANCE_POPULATION_CLOSED_AT_DESC',
  PositionsVariancePopulationCreatedAtAsc = 'POSITIONS_VARIANCE_POPULATION_CREATED_AT_ASC',
  PositionsVariancePopulationCreatedAtDesc = 'POSITIONS_VARIANCE_POPULATION_CREATED_AT_DESC',
  PositionsVariancePopulationIdAsc = 'POSITIONS_VARIANCE_POPULATION_ID_ASC',
  PositionsVariancePopulationIdDesc = 'POSITIONS_VARIANCE_POPULATION_ID_DESC',
  PositionsVariancePopulationLiquidityAsc = 'POSITIONS_VARIANCE_POPULATION_LIQUIDITY_ASC',
  PositionsVariancePopulationLiquidityDesc = 'POSITIONS_VARIANCE_POPULATION_LIQUIDITY_DESC',
  PositionsVariancePopulationOwnerIdAsc = 'POSITIONS_VARIANCE_POPULATION_OWNER_ID_ASC',
  PositionsVariancePopulationOwnerIdDesc = 'POSITIONS_VARIANCE_POPULATION_OWNER_ID_DESC',
  PositionsVariancePopulationPoolIdAsc = 'POSITIONS_VARIANCE_POPULATION_POOL_ID_ASC',
  PositionsVariancePopulationPoolIdDesc = 'POSITIONS_VARIANCE_POPULATION_POOL_ID_DESC',
  PositionsVariancePopulationPrincipalAmountXAsc = 'POSITIONS_VARIANCE_POPULATION_PRINCIPAL_AMOUNT_X_ASC',
  PositionsVariancePopulationPrincipalAmountXDesc = 'POSITIONS_VARIANCE_POPULATION_PRINCIPAL_AMOUNT_X_DESC',
  PositionsVariancePopulationPrincipalAmountYAsc = 'POSITIONS_VARIANCE_POPULATION_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsVariancePopulationPrincipalAmountYDesc = 'POSITIONS_VARIANCE_POPULATION_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsVariancePopulationStatusAsc = 'POSITIONS_VARIANCE_POPULATION_STATUS_ASC',
  PositionsVariancePopulationStatusDesc = 'POSITIONS_VARIANCE_POPULATION_STATUS_DESC',
  PositionsVariancePopulationTickLowerAsc = 'POSITIONS_VARIANCE_POPULATION_TICK_LOWER_ASC',
  PositionsVariancePopulationTickLowerDesc = 'POSITIONS_VARIANCE_POPULATION_TICK_LOWER_DESC',
  PositionsVariancePopulationTickUpperAsc = 'POSITIONS_VARIANCE_POPULATION_TICK_UPPER_ASC',
  PositionsVariancePopulationTickUpperDesc = 'POSITIONS_VARIANCE_POPULATION_TICK_UPPER_DESC',
  PositionsVariancePopulationTokenIdAsc = 'POSITIONS_VARIANCE_POPULATION_TOKEN_ID_ASC',
  PositionsVariancePopulationTokenIdDesc = 'POSITIONS_VARIANCE_POPULATION_TOKEN_ID_DESC',
  PositionsVariancePopulationTransactionIdAsc = 'POSITIONS_VARIANCE_POPULATION_TRANSACTION_ID_ASC',
  PositionsVariancePopulationTransactionIdDesc = 'POSITIONS_VARIANCE_POPULATION_TRANSACTION_ID_DESC',
  PositionsVarianceSampleBlockRangeAsc = 'POSITIONS_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  PositionsVarianceSampleBlockRangeDesc = 'POSITIONS_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  PositionsVarianceSampleClosedAtAsc = 'POSITIONS_VARIANCE_SAMPLE_CLOSED_AT_ASC',
  PositionsVarianceSampleClosedAtDesc = 'POSITIONS_VARIANCE_SAMPLE_CLOSED_AT_DESC',
  PositionsVarianceSampleCreatedAtAsc = 'POSITIONS_VARIANCE_SAMPLE_CREATED_AT_ASC',
  PositionsVarianceSampleCreatedAtDesc = 'POSITIONS_VARIANCE_SAMPLE_CREATED_AT_DESC',
  PositionsVarianceSampleIdAsc = 'POSITIONS_VARIANCE_SAMPLE_ID_ASC',
  PositionsVarianceSampleIdDesc = 'POSITIONS_VARIANCE_SAMPLE_ID_DESC',
  PositionsVarianceSampleLiquidityAsc = 'POSITIONS_VARIANCE_SAMPLE_LIQUIDITY_ASC',
  PositionsVarianceSampleLiquidityDesc = 'POSITIONS_VARIANCE_SAMPLE_LIQUIDITY_DESC',
  PositionsVarianceSampleOwnerIdAsc = 'POSITIONS_VARIANCE_SAMPLE_OWNER_ID_ASC',
  PositionsVarianceSampleOwnerIdDesc = 'POSITIONS_VARIANCE_SAMPLE_OWNER_ID_DESC',
  PositionsVarianceSamplePoolIdAsc = 'POSITIONS_VARIANCE_SAMPLE_POOL_ID_ASC',
  PositionsVarianceSamplePoolIdDesc = 'POSITIONS_VARIANCE_SAMPLE_POOL_ID_DESC',
  PositionsVarianceSamplePrincipalAmountXAsc = 'POSITIONS_VARIANCE_SAMPLE_PRINCIPAL_AMOUNT_X_ASC',
  PositionsVarianceSamplePrincipalAmountXDesc = 'POSITIONS_VARIANCE_SAMPLE_PRINCIPAL_AMOUNT_X_DESC',
  PositionsVarianceSamplePrincipalAmountYAsc = 'POSITIONS_VARIANCE_SAMPLE_PRINCIPAL_AMOUNT_Y_ASC',
  PositionsVarianceSamplePrincipalAmountYDesc = 'POSITIONS_VARIANCE_SAMPLE_PRINCIPAL_AMOUNT_Y_DESC',
  PositionsVarianceSampleStatusAsc = 'POSITIONS_VARIANCE_SAMPLE_STATUS_ASC',
  PositionsVarianceSampleStatusDesc = 'POSITIONS_VARIANCE_SAMPLE_STATUS_DESC',
  PositionsVarianceSampleTickLowerAsc = 'POSITIONS_VARIANCE_SAMPLE_TICK_LOWER_ASC',
  PositionsVarianceSampleTickLowerDesc = 'POSITIONS_VARIANCE_SAMPLE_TICK_LOWER_DESC',
  PositionsVarianceSampleTickUpperAsc = 'POSITIONS_VARIANCE_SAMPLE_TICK_UPPER_ASC',
  PositionsVarianceSampleTickUpperDesc = 'POSITIONS_VARIANCE_SAMPLE_TICK_UPPER_DESC',
  PositionsVarianceSampleTokenIdAsc = 'POSITIONS_VARIANCE_SAMPLE_TOKEN_ID_ASC',
  PositionsVarianceSampleTokenIdDesc = 'POSITIONS_VARIANCE_SAMPLE_TOKEN_ID_DESC',
  PositionsVarianceSampleTransactionIdAsc = 'POSITIONS_VARIANCE_SAMPLE_TRANSACTION_ID_ASC',
  PositionsVarianceSampleTransactionIdDesc = 'POSITIONS_VARIANCE_SAMPLE_TRANSACTION_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SwapAverageAmountInAsc = 'SWAP_AVERAGE_AMOUNT_IN_ASC',
  SwapAverageAmountInDesc = 'SWAP_AVERAGE_AMOUNT_IN_DESC',
  SwapAverageAmountOutAsc = 'SWAP_AVERAGE_AMOUNT_OUT_ASC',
  SwapAverageAmountOutDesc = 'SWAP_AVERAGE_AMOUNT_OUT_DESC',
  SwapAverageBlockRangeAsc = 'SWAP_AVERAGE_BLOCK_RANGE_ASC',
  SwapAverageBlockRangeDesc = 'SWAP_AVERAGE_BLOCK_RANGE_DESC',
  SwapAverageFeeUSDAsc = 'SWAP_AVERAGE_FEE_U_S_D_ASC',
  SwapAverageFeeUSDDesc = 'SWAP_AVERAGE_FEE_U_S_D_DESC',
  SwapAverageIdAsc = 'SWAP_AVERAGE_ID_ASC',
  SwapAverageIdDesc = 'SWAP_AVERAGE_ID_DESC',
  SwapAverageSenderIdAsc = 'SWAP_AVERAGE_SENDER_ID_ASC',
  SwapAverageSenderIdDesc = 'SWAP_AVERAGE_SENDER_ID_DESC',
  SwapAverageTokenInIdAsc = 'SWAP_AVERAGE_TOKEN_IN_ID_ASC',
  SwapAverageTokenInIdDesc = 'SWAP_AVERAGE_TOKEN_IN_ID_DESC',
  SwapAverageTokenOutIdAsc = 'SWAP_AVERAGE_TOKEN_OUT_ID_ASC',
  SwapAverageTokenOutIdDesc = 'SWAP_AVERAGE_TOKEN_OUT_ID_DESC',
  SwapAverageTransactionIdAsc = 'SWAP_AVERAGE_TRANSACTION_ID_ASC',
  SwapAverageTransactionIdDesc = 'SWAP_AVERAGE_TRANSACTION_ID_DESC',
  SwapCountAsc = 'SWAP_COUNT_ASC',
  SwapCountDesc = 'SWAP_COUNT_DESC',
  SwapDistinctCountAmountInAsc = 'SWAP_DISTINCT_COUNT_AMOUNT_IN_ASC',
  SwapDistinctCountAmountInDesc = 'SWAP_DISTINCT_COUNT_AMOUNT_IN_DESC',
  SwapDistinctCountAmountOutAsc = 'SWAP_DISTINCT_COUNT_AMOUNT_OUT_ASC',
  SwapDistinctCountAmountOutDesc = 'SWAP_DISTINCT_COUNT_AMOUNT_OUT_DESC',
  SwapDistinctCountBlockRangeAsc = 'SWAP_DISTINCT_COUNT_BLOCK_RANGE_ASC',
  SwapDistinctCountBlockRangeDesc = 'SWAP_DISTINCT_COUNT_BLOCK_RANGE_DESC',
  SwapDistinctCountFeeUSDAsc = 'SWAP_DISTINCT_COUNT_FEE_U_S_D_ASC',
  SwapDistinctCountFeeUSDDesc = 'SWAP_DISTINCT_COUNT_FEE_U_S_D_DESC',
  SwapDistinctCountIdAsc = 'SWAP_DISTINCT_COUNT_ID_ASC',
  SwapDistinctCountIdDesc = 'SWAP_DISTINCT_COUNT_ID_DESC',
  SwapDistinctCountSenderIdAsc = 'SWAP_DISTINCT_COUNT_SENDER_ID_ASC',
  SwapDistinctCountSenderIdDesc = 'SWAP_DISTINCT_COUNT_SENDER_ID_DESC',
  SwapDistinctCountTokenInIdAsc = 'SWAP_DISTINCT_COUNT_TOKEN_IN_ID_ASC',
  SwapDistinctCountTokenInIdDesc = 'SWAP_DISTINCT_COUNT_TOKEN_IN_ID_DESC',
  SwapDistinctCountTokenOutIdAsc = 'SWAP_DISTINCT_COUNT_TOKEN_OUT_ID_ASC',
  SwapDistinctCountTokenOutIdDesc = 'SWAP_DISTINCT_COUNT_TOKEN_OUT_ID_DESC',
  SwapDistinctCountTransactionIdAsc = 'SWAP_DISTINCT_COUNT_TRANSACTION_ID_ASC',
  SwapDistinctCountTransactionIdDesc = 'SWAP_DISTINCT_COUNT_TRANSACTION_ID_DESC',
  SwapMaxAmountInAsc = 'SWAP_MAX_AMOUNT_IN_ASC',
  SwapMaxAmountInDesc = 'SWAP_MAX_AMOUNT_IN_DESC',
  SwapMaxAmountOutAsc = 'SWAP_MAX_AMOUNT_OUT_ASC',
  SwapMaxAmountOutDesc = 'SWAP_MAX_AMOUNT_OUT_DESC',
  SwapMaxBlockRangeAsc = 'SWAP_MAX_BLOCK_RANGE_ASC',
  SwapMaxBlockRangeDesc = 'SWAP_MAX_BLOCK_RANGE_DESC',
  SwapMaxFeeUSDAsc = 'SWAP_MAX_FEE_U_S_D_ASC',
  SwapMaxFeeUSDDesc = 'SWAP_MAX_FEE_U_S_D_DESC',
  SwapMaxIdAsc = 'SWAP_MAX_ID_ASC',
  SwapMaxIdDesc = 'SWAP_MAX_ID_DESC',
  SwapMaxSenderIdAsc = 'SWAP_MAX_SENDER_ID_ASC',
  SwapMaxSenderIdDesc = 'SWAP_MAX_SENDER_ID_DESC',
  SwapMaxTokenInIdAsc = 'SWAP_MAX_TOKEN_IN_ID_ASC',
  SwapMaxTokenInIdDesc = 'SWAP_MAX_TOKEN_IN_ID_DESC',
  SwapMaxTokenOutIdAsc = 'SWAP_MAX_TOKEN_OUT_ID_ASC',
  SwapMaxTokenOutIdDesc = 'SWAP_MAX_TOKEN_OUT_ID_DESC',
  SwapMaxTransactionIdAsc = 'SWAP_MAX_TRANSACTION_ID_ASC',
  SwapMaxTransactionIdDesc = 'SWAP_MAX_TRANSACTION_ID_DESC',
  SwapMinAmountInAsc = 'SWAP_MIN_AMOUNT_IN_ASC',
  SwapMinAmountInDesc = 'SWAP_MIN_AMOUNT_IN_DESC',
  SwapMinAmountOutAsc = 'SWAP_MIN_AMOUNT_OUT_ASC',
  SwapMinAmountOutDesc = 'SWAP_MIN_AMOUNT_OUT_DESC',
  SwapMinBlockRangeAsc = 'SWAP_MIN_BLOCK_RANGE_ASC',
  SwapMinBlockRangeDesc = 'SWAP_MIN_BLOCK_RANGE_DESC',
  SwapMinFeeUSDAsc = 'SWAP_MIN_FEE_U_S_D_ASC',
  SwapMinFeeUSDDesc = 'SWAP_MIN_FEE_U_S_D_DESC',
  SwapMinIdAsc = 'SWAP_MIN_ID_ASC',
  SwapMinIdDesc = 'SWAP_MIN_ID_DESC',
  SwapMinSenderIdAsc = 'SWAP_MIN_SENDER_ID_ASC',
  SwapMinSenderIdDesc = 'SWAP_MIN_SENDER_ID_DESC',
  SwapMinTokenInIdAsc = 'SWAP_MIN_TOKEN_IN_ID_ASC',
  SwapMinTokenInIdDesc = 'SWAP_MIN_TOKEN_IN_ID_DESC',
  SwapMinTokenOutIdAsc = 'SWAP_MIN_TOKEN_OUT_ID_ASC',
  SwapMinTokenOutIdDesc = 'SWAP_MIN_TOKEN_OUT_ID_DESC',
  SwapMinTransactionIdAsc = 'SWAP_MIN_TRANSACTION_ID_ASC',
  SwapMinTransactionIdDesc = 'SWAP_MIN_TRANSACTION_ID_DESC',
  SwapStddevPopulationAmountInAsc = 'SWAP_STDDEV_POPULATION_AMOUNT_IN_ASC',
  SwapStddevPopulationAmountInDesc = 'SWAP_STDDEV_POPULATION_AMOUNT_IN_DESC',
  SwapStddevPopulationAmountOutAsc = 'SWAP_STDDEV_POPULATION_AMOUNT_OUT_ASC',
  SwapStddevPopulationAmountOutDesc = 'SWAP_STDDEV_POPULATION_AMOUNT_OUT_DESC',
  SwapStddevPopulationBlockRangeAsc = 'SWAP_STDDEV_POPULATION_BLOCK_RANGE_ASC',
  SwapStddevPopulationBlockRangeDesc = 'SWAP_STDDEV_POPULATION_BLOCK_RANGE_DESC',
  SwapStddevPopulationFeeUSDAsc = 'SWAP_STDDEV_POPULATION_FEE_U_S_D_ASC',
  SwapStddevPopulationFeeUSDDesc = 'SWAP_STDDEV_POPULATION_FEE_U_S_D_DESC',
  SwapStddevPopulationIdAsc = 'SWAP_STDDEV_POPULATION_ID_ASC',
  SwapStddevPopulationIdDesc = 'SWAP_STDDEV_POPULATION_ID_DESC',
  SwapStddevPopulationSenderIdAsc = 'SWAP_STDDEV_POPULATION_SENDER_ID_ASC',
  SwapStddevPopulationSenderIdDesc = 'SWAP_STDDEV_POPULATION_SENDER_ID_DESC',
  SwapStddevPopulationTokenInIdAsc = 'SWAP_STDDEV_POPULATION_TOKEN_IN_ID_ASC',
  SwapStddevPopulationTokenInIdDesc = 'SWAP_STDDEV_POPULATION_TOKEN_IN_ID_DESC',
  SwapStddevPopulationTokenOutIdAsc = 'SWAP_STDDEV_POPULATION_TOKEN_OUT_ID_ASC',
  SwapStddevPopulationTokenOutIdDesc = 'SWAP_STDDEV_POPULATION_TOKEN_OUT_ID_DESC',
  SwapStddevPopulationTransactionIdAsc = 'SWAP_STDDEV_POPULATION_TRANSACTION_ID_ASC',
  SwapStddevPopulationTransactionIdDesc = 'SWAP_STDDEV_POPULATION_TRANSACTION_ID_DESC',
  SwapStddevSampleAmountInAsc = 'SWAP_STDDEV_SAMPLE_AMOUNT_IN_ASC',
  SwapStddevSampleAmountInDesc = 'SWAP_STDDEV_SAMPLE_AMOUNT_IN_DESC',
  SwapStddevSampleAmountOutAsc = 'SWAP_STDDEV_SAMPLE_AMOUNT_OUT_ASC',
  SwapStddevSampleAmountOutDesc = 'SWAP_STDDEV_SAMPLE_AMOUNT_OUT_DESC',
  SwapStddevSampleBlockRangeAsc = 'SWAP_STDDEV_SAMPLE_BLOCK_RANGE_ASC',
  SwapStddevSampleBlockRangeDesc = 'SWAP_STDDEV_SAMPLE_BLOCK_RANGE_DESC',
  SwapStddevSampleFeeUSDAsc = 'SWAP_STDDEV_SAMPLE_FEE_U_S_D_ASC',
  SwapStddevSampleFeeUSDDesc = 'SWAP_STDDEV_SAMPLE_FEE_U_S_D_DESC',
  SwapStddevSampleIdAsc = 'SWAP_STDDEV_SAMPLE_ID_ASC',
  SwapStddevSampleIdDesc = 'SWAP_STDDEV_SAMPLE_ID_DESC',
  SwapStddevSampleSenderIdAsc = 'SWAP_STDDEV_SAMPLE_SENDER_ID_ASC',
  SwapStddevSampleSenderIdDesc = 'SWAP_STDDEV_SAMPLE_SENDER_ID_DESC',
  SwapStddevSampleTokenInIdAsc = 'SWAP_STDDEV_SAMPLE_TOKEN_IN_ID_ASC',
  SwapStddevSampleTokenInIdDesc = 'SWAP_STDDEV_SAMPLE_TOKEN_IN_ID_DESC',
  SwapStddevSampleTokenOutIdAsc = 'SWAP_STDDEV_SAMPLE_TOKEN_OUT_ID_ASC',
  SwapStddevSampleTokenOutIdDesc = 'SWAP_STDDEV_SAMPLE_TOKEN_OUT_ID_DESC',
  SwapStddevSampleTransactionIdAsc = 'SWAP_STDDEV_SAMPLE_TRANSACTION_ID_ASC',
  SwapStddevSampleTransactionIdDesc = 'SWAP_STDDEV_SAMPLE_TRANSACTION_ID_DESC',
  SwapSumAmountInAsc = 'SWAP_SUM_AMOUNT_IN_ASC',
  SwapSumAmountInDesc = 'SWAP_SUM_AMOUNT_IN_DESC',
  SwapSumAmountOutAsc = 'SWAP_SUM_AMOUNT_OUT_ASC',
  SwapSumAmountOutDesc = 'SWAP_SUM_AMOUNT_OUT_DESC',
  SwapSumBlockRangeAsc = 'SWAP_SUM_BLOCK_RANGE_ASC',
  SwapSumBlockRangeDesc = 'SWAP_SUM_BLOCK_RANGE_DESC',
  SwapSumFeeUSDAsc = 'SWAP_SUM_FEE_U_S_D_ASC',
  SwapSumFeeUSDDesc = 'SWAP_SUM_FEE_U_S_D_DESC',
  SwapSumIdAsc = 'SWAP_SUM_ID_ASC',
  SwapSumIdDesc = 'SWAP_SUM_ID_DESC',
  SwapSumSenderIdAsc = 'SWAP_SUM_SENDER_ID_ASC',
  SwapSumSenderIdDesc = 'SWAP_SUM_SENDER_ID_DESC',
  SwapSumTokenInIdAsc = 'SWAP_SUM_TOKEN_IN_ID_ASC',
  SwapSumTokenInIdDesc = 'SWAP_SUM_TOKEN_IN_ID_DESC',
  SwapSumTokenOutIdAsc = 'SWAP_SUM_TOKEN_OUT_ID_ASC',
  SwapSumTokenOutIdDesc = 'SWAP_SUM_TOKEN_OUT_ID_DESC',
  SwapSumTransactionIdAsc = 'SWAP_SUM_TRANSACTION_ID_ASC',
  SwapSumTransactionIdDesc = 'SWAP_SUM_TRANSACTION_ID_DESC',
  SwapVariancePopulationAmountInAsc = 'SWAP_VARIANCE_POPULATION_AMOUNT_IN_ASC',
  SwapVariancePopulationAmountInDesc = 'SWAP_VARIANCE_POPULATION_AMOUNT_IN_DESC',
  SwapVariancePopulationAmountOutAsc = 'SWAP_VARIANCE_POPULATION_AMOUNT_OUT_ASC',
  SwapVariancePopulationAmountOutDesc = 'SWAP_VARIANCE_POPULATION_AMOUNT_OUT_DESC',
  SwapVariancePopulationBlockRangeAsc = 'SWAP_VARIANCE_POPULATION_BLOCK_RANGE_ASC',
  SwapVariancePopulationBlockRangeDesc = 'SWAP_VARIANCE_POPULATION_BLOCK_RANGE_DESC',
  SwapVariancePopulationFeeUSDAsc = 'SWAP_VARIANCE_POPULATION_FEE_U_S_D_ASC',
  SwapVariancePopulationFeeUSDDesc = 'SWAP_VARIANCE_POPULATION_FEE_U_S_D_DESC',
  SwapVariancePopulationIdAsc = 'SWAP_VARIANCE_POPULATION_ID_ASC',
  SwapVariancePopulationIdDesc = 'SWAP_VARIANCE_POPULATION_ID_DESC',
  SwapVariancePopulationSenderIdAsc = 'SWAP_VARIANCE_POPULATION_SENDER_ID_ASC',
  SwapVariancePopulationSenderIdDesc = 'SWAP_VARIANCE_POPULATION_SENDER_ID_DESC',
  SwapVariancePopulationTokenInIdAsc = 'SWAP_VARIANCE_POPULATION_TOKEN_IN_ID_ASC',
  SwapVariancePopulationTokenInIdDesc = 'SWAP_VARIANCE_POPULATION_TOKEN_IN_ID_DESC',
  SwapVariancePopulationTokenOutIdAsc = 'SWAP_VARIANCE_POPULATION_TOKEN_OUT_ID_ASC',
  SwapVariancePopulationTokenOutIdDesc = 'SWAP_VARIANCE_POPULATION_TOKEN_OUT_ID_DESC',
  SwapVariancePopulationTransactionIdAsc = 'SWAP_VARIANCE_POPULATION_TRANSACTION_ID_ASC',
  SwapVariancePopulationTransactionIdDesc = 'SWAP_VARIANCE_POPULATION_TRANSACTION_ID_DESC',
  SwapVarianceSampleAmountInAsc = 'SWAP_VARIANCE_SAMPLE_AMOUNT_IN_ASC',
  SwapVarianceSampleAmountInDesc = 'SWAP_VARIANCE_SAMPLE_AMOUNT_IN_DESC',
  SwapVarianceSampleAmountOutAsc = 'SWAP_VARIANCE_SAMPLE_AMOUNT_OUT_ASC',
  SwapVarianceSampleAmountOutDesc = 'SWAP_VARIANCE_SAMPLE_AMOUNT_OUT_DESC',
  SwapVarianceSampleBlockRangeAsc = 'SWAP_VARIANCE_SAMPLE_BLOCK_RANGE_ASC',
  SwapVarianceSampleBlockRangeDesc = 'SWAP_VARIANCE_SAMPLE_BLOCK_RANGE_DESC',
  SwapVarianceSampleFeeUSDAsc = 'SWAP_VARIANCE_SAMPLE_FEE_U_S_D_ASC',
  SwapVarianceSampleFeeUSDDesc = 'SWAP_VARIANCE_SAMPLE_FEE_U_S_D_DESC',
  SwapVarianceSampleIdAsc = 'SWAP_VARIANCE_SAMPLE_ID_ASC',
  SwapVarianceSampleIdDesc = 'SWAP_VARIANCE_SAMPLE_ID_DESC',
  SwapVarianceSampleSenderIdAsc = 'SWAP_VARIANCE_SAMPLE_SENDER_ID_ASC',
  SwapVarianceSampleSenderIdDesc = 'SWAP_VARIANCE_SAMPLE_SENDER_ID_DESC',
  SwapVarianceSampleTokenInIdAsc = 'SWAP_VARIANCE_SAMPLE_TOKEN_IN_ID_ASC',
  SwapVarianceSampleTokenInIdDesc = 'SWAP_VARIANCE_SAMPLE_TOKEN_IN_ID_DESC',
  SwapVarianceSampleTokenOutIdAsc = 'SWAP_VARIANCE_SAMPLE_TOKEN_OUT_ID_ASC',
  SwapVarianceSampleTokenOutIdDesc = 'SWAP_VARIANCE_SAMPLE_TOKEN_OUT_ID_DESC',
  SwapVarianceSampleTransactionIdAsc = 'SWAP_VARIANCE_SAMPLE_TRANSACTION_ID_ASC',
  SwapVarianceSampleTransactionIdDesc = 'SWAP_VARIANCE_SAMPLE_TRANSACTION_ID_DESC',
  TimestampAsc = 'TIMESTAMP_ASC',
  TimestampDesc = 'TIMESTAMP_DESC'
}

export type _Metadata = {
  __typename?: '_Metadata';
  chain?: Maybe<Scalars['String']['output']>;
  dbSize?: Maybe<Scalars['BigInt']['output']>;
  deployments?: Maybe<Scalars['JSON']['output']>;
  dynamicDatasources?: Maybe<Maybe<Scalars['JSON']['output']>[]>;
  evmChainId?: Maybe<Scalars['String']['output']>;
  genesisHash?: Maybe<Scalars['String']['output']>;
  indexerHealthy?: Maybe<Scalars['Boolean']['output']>;
  indexerNodeVersion?: Maybe<Scalars['String']['output']>;
  lastCreatedPoiHeight?: Maybe<Scalars['Int']['output']>;
  lastFinalizedVerifiedHeight?: Maybe<Scalars['Int']['output']>;
  lastProcessedHeight?: Maybe<Scalars['Int']['output']>;
  lastProcessedTimestamp?: Maybe<Scalars['Date']['output']>;
  latestSyncedPoiHeight?: Maybe<Scalars['Int']['output']>;
  queryNodeVersion?: Maybe<Scalars['String']['output']>;
  rowCountEstimate?: Maybe<Maybe<TableEstimate>[]>;
  specName?: Maybe<Scalars['String']['output']>;
  startHeight?: Maybe<Scalars['Int']['output']>;
  targetHeight?: Maybe<Scalars['Int']['output']>;
  unfinalizedBlocks?: Maybe<Scalars['String']['output']>;
};

export type _Metadatas = {
  __typename?: '_Metadatas';
  nodes: Maybe<_Metadata>[];
  totalCount: Scalars['Int']['output'];
};

export enum Accounts_Distinct_Enum {
  Id = 'ID'
}

export enum Claim_Fee_Incentive_Tokens_Distinct_Enum {
  ClaimFeeId = 'CLAIM_FEE_ID',
  Id = 'ID',
  Index = 'INDEX',
  RewardAmount = 'REWARD_AMOUNT',
  TokenId = 'TOKEN_ID'
}

export enum Claim_Fees_Distinct_Enum {
  AmountUSD = 'AMOUNT_U_S_D',
  AmountX = 'AMOUNT_X',
  AmountY = 'AMOUNT_Y',
  Id = 'ID',
  OwnerId = 'OWNER_ID',
  PoolId = 'POOL_ID',
  PositionId = 'POSITION_ID',
  TransactionId = 'TRANSACTION_ID'
}

export enum Pool_Day_Data_Distinct_Enum {
  CurrentTick = 'CURRENT_TICK',
  DayIndex = 'DAY_INDEX',
  FeesUSD = 'FEES_U_S_D',
  Id = 'ID',
  Liquidity = 'LIQUIDITY',
  PoolId = 'POOL_ID',
  SqrtPrice = 'SQRT_PRICE',
  TvlUSD = 'TVL_U_S_D',
  TxCount = 'TX_COUNT',
  VolumeTokenX = 'VOLUME_TOKEN_X',
  VolumeTokenY = 'VOLUME_TOKEN_Y',
  VolumeUSD = 'VOLUME_U_S_D'
}

export enum Pool_Hour_Data_Distinct_Enum {
  CurrentTick = 'CURRENT_TICK',
  FeesUSD = 'FEES_U_S_D',
  HourIndex = 'HOUR_INDEX',
  Id = 'ID',
  Liquidity = 'LIQUIDITY',
  PoolId = 'POOL_ID',
  SqrtPrice = 'SQRT_PRICE',
  TvlUSD = 'TVL_U_S_D',
  TxCount = 'TX_COUNT',
  VolumeTokenX = 'VOLUME_TOKEN_X',
  VolumeTokenY = 'VOLUME_TOKEN_Y',
  VolumeUSD = 'VOLUME_U_S_D'
}

export enum Pool_Token_Incentives_Distinct_Enum {
  Id = 'ID',
  Index = 'INDEX',
  PoolId = 'POOL_ID',
  RewardPerSec = 'REWARD_PER_SEC',
  StartTimestamp = 'START_TIMESTAMP',
  TokenId = 'TOKEN_ID',
  TotalReward = 'TOTAL_REWARD',
  TransactionId = 'TRANSACTION_ID'
}

export enum Pools_Distinct_Enum {
  CollectedFeesTokenX = 'COLLECTED_FEES_TOKEN_X',
  CollectedFeesTokenY = 'COLLECTED_FEES_TOKEN_Y',
  CollectedFeesUSD = 'COLLECTED_FEES_U_S_D',
  CreatedAt = 'CREATED_AT',
  CreatedAtBlockNumber = 'CREATED_AT_BLOCK_NUMBER',
  CurrentTick = 'CURRENT_TICK',
  Fee = 'FEE',
  FeesUSD = 'FEES_U_S_D',
  Id = 'ID',
  Liquidity = 'LIQUIDITY',
  PoolCreatorId = 'POOL_CREATOR_ID',
  SqrtPrice = 'SQRT_PRICE',
  TickSpacing = 'TICK_SPACING',
  TokenXId = 'TOKEN_X_ID',
  TokenYId = 'TOKEN_Y_ID',
  TotalValueLockedTokenX = 'TOTAL_VALUE_LOCKED_TOKEN_X',
  TotalValueLockedTokenY = 'TOTAL_VALUE_LOCKED_TOKEN_Y',
  TotalValueLockedUSD = 'TOTAL_VALUE_LOCKED_U_S_D',
  TransactionId = 'TRANSACTION_ID',
  TxCount = 'TX_COUNT',
  UpdatedAt = 'UPDATED_AT',
  VolumeTokenX = 'VOLUME_TOKEN_X',
  VolumeTokenY = 'VOLUME_TOKEN_Y',
  VolumeUSD = 'VOLUME_U_S_D'
}

export enum Positions_Distinct_Enum {
  ClosedAt = 'CLOSED_AT',
  CreatedAt = 'CREATED_AT',
  Id = 'ID',
  Liquidity = 'LIQUIDITY',
  OwnerId = 'OWNER_ID',
  PoolId = 'POOL_ID',
  PrincipalAmountX = 'PRINCIPAL_AMOUNT_X',
  PrincipalAmountY = 'PRINCIPAL_AMOUNT_Y',
  Status = 'STATUS',
  TickLower = 'TICK_LOWER',
  TickUpper = 'TICK_UPPER',
  TokenId = 'TOKEN_ID',
  TransactionId = 'TRANSACTION_ID'
}

export enum Swap_Routes_Distinct_Enum {
  AmountIn = 'AMOUNT_IN',
  AmountOut = 'AMOUNT_OUT',
  CurrentTickIndex = 'CURRENT_TICK_INDEX',
  EventIndex = 'EVENT_INDEX',
  FeeAmount = 'FEE_AMOUNT',
  FeeUSD = 'FEE_U_S_D',
  Id = 'ID',
  Liquidity = 'LIQUIDITY',
  PoolId = 'POOL_ID',
  SqrtPrice = 'SQRT_PRICE',
  SwapId = 'SWAP_ID',
  VolumeUSD = 'VOLUME_U_S_D',
  XToY = 'X_TO_Y'
}

export enum Swaps_Distinct_Enum {
  AmountIn = 'AMOUNT_IN',
  AmountOut = 'AMOUNT_OUT',
  FeeUSD = 'FEE_U_S_D',
  Id = 'ID',
  SenderId = 'SENDER_ID',
  TokenInId = 'TOKEN_IN_ID',
  TokenOutId = 'TOKEN_OUT_ID',
  TransactionId = 'TRANSACTION_ID'
}

export enum Tokens_Distinct_Enum {
  CoingeckoId = 'COINGECKO_ID',
  Decimals = 'DECIMALS',
  Denom = 'DENOM',
  Id = 'ID',
  Logo = 'LOGO',
  MaxSupply = 'MAX_SUPPLY',
  Name = 'NAME',
  Symbol = 'SYMBOL',
  TotalSupply = 'TOTAL_SUPPLY',
  Type = 'TYPE'
}

export enum Transactions_Distinct_Enum {
  BlockNumber = 'BLOCK_NUMBER',
  Events = 'EVENTS',
  GasUsed = 'GAS_USED',
  Id = 'ID',
  Timestamp = 'TIMESTAMP'
}
