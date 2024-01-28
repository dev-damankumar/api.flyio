import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:5000/graphql',
  generates: {
    'src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-resolvers',
        'typescript-mongodb',
        'typescript-document-nodes',
      ],
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;
