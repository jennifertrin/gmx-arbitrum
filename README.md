# 👋 Introduction
GMX.io is a decentralized spot and perpetual exchange that supports low swap fees and zero price impact trades supported on Arbitrum and Avalanche chains. This analysis attempts to assess the impact of GMX.io on growth of the the Arbitrum chain.

# 🧠 Methodology
I reviewed the GMX.io documentation to understand how their platform worked and their rewards and governance systems. 

I utilized the Arbitrum core tables on Flipside crypto to assess transaction volume on GMX.io and Arbitrum. 

# 👩‍💻 Getting Started

Please note: There is a known issue with the `@flipsidecrypto/sdk` package on Typescript/Javascript. Please follow these steps to resolve the issue:

Run the following commands:
```
cd app
cd node_modules
cd @flipsidecrypto/sdk
yarn
yarn run dev
```

In the `package.json`, update this:

```
"main": "dist/index.js",
"types": "dist/index.d.ts",
```
  
 to this:
 
```
"main": "dist/src/index.js",
"types": "dist/src/index.d.ts",
```
Then, also:

```
cd dist
```

In the `package.json` in the `dist` folder, update this:

```
"main": "dist/index.js",
"types": "dist/index.d.ts",
```
  
 to this:
 
```
"main": "dist/src/index.js",
"types": "dist/src/index.d.ts",
```

