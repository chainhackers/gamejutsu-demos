# Problem solving
---
Problem
```
https://nextjs.org/docs/messages/module-not-found
wait  - compiling /_error (client and server)...
error - .generated/contracts/esm/index.js:2:0
Module not found: Can't resolve '../../../eth-sdk/abis/polygon/arbiter.json'
  1 | import { Contract } from 'ethers';
> 2 | import polygon_arbiter_abi from '../../../eth-sdk/abis/polygon/arbiter.json';
  3 | import polygon_checkersRules_abi from '../../../eth-sdk/abis/polygon/checkersRules.json';
  4 | import polygon_ticTacToeRules_abi from '../../../eth-sdk/abis/polygon/ticTacToeRules.json';
  5 | export function getContract(address, abi, defaultSignerOrProvider) {

Import trace for requested module:
./.generated/contracts/index.mjs
./gameApi/index.ts
./contexts/WalltetContext.tsx
./pages/_app.tsx

https://nextjs.org/docs/messages/module-not-found
```
is corrected by the `yarn generate` command
---
