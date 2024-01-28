import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

const gqlFiles = readdirSync(
  resolve(__dirname, '../../../', 'src', 'graphql', './typedefs')
);

let typeDefs = '';
gqlFiles.forEach((file) => {
  console.log('file', file);
  if (file.includes('.graphql')) {
    typeDefs += readFileSync(
      resolve(__dirname, '../../../', 'src', 'graphql', './typedefs', file),
      {
        encoding: 'utf8',
      }
    );
  }
});

export default typeDefs;
