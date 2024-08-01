import { CodegenConfig } from '@graphql-codegen/cli';

// https://subql-staging.orai.io/
export const endpoint_gql = `http://10.10.20.72:3000/`;
const config: CodegenConfig = {
  schema: endpoint_gql,
  documents: ['src/**/*.tsx'],
  // ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: []
    }
  }
};

export default config;
