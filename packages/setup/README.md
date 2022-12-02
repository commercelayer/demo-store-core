# Demo Store – seed

This package contains a complete set of seed and import files that will setup an Organization from scratch in less than a minute.

These are the same files that bootstrap our own [Demo Store](https://commercelayer.github.io/demo-store-core).


## Getting started

```sh
npm install
npm install -g @commercelayer/cli

commercelayer applications:login \
  -i Oy5F2TbPYhOZsxy1tQd9ZVZ... \
  -s 1ZHNJUgn_1lh1mel06gGDqa... \
  -o my-awesome-organization \
  -a admin

commercelayer plugins:install seeder
commercelayer plugins:install imports

npm run seeder:seed # 🚀
```
