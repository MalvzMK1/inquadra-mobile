import { CodegenConfig } from '@graphql-codegen/cli';
import { HOST_API } from '@env';

const config: CodegenConfig = {
  schema: "https://api-inquadra-uat.qodeless.com.br" + '/graphql',
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