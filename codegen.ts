import { CodegenConfig } from '@graphql-codegen/cli';
import { HOST_API } from '@env';

const config: CodegenConfig = {
  schema: HOST_API + '/graphql',
  documents: ['src/**/*.tsx'],
  generates: {
    './src/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      }
    }
  },
  ignoreNoDocuments: true,
};

export default config;