import { NomicClient } from 'libs/nomic/models/nomic-client/nomic-client';
import { NomicClientInterface } from 'libs/nomic/models/nomic-client/nomic-client-interface';
import { createContext } from 'react';

const client = new NomicClient();

export const NomicContext = createContext(client as NomicClientInterface);
