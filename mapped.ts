// deno-fmt-ignore-file

export default [
  [/\/v43\/react@17\.0\.\d+\/index\.d\.ts\//g, "/v43/@types/react@17.0.14/index.d.ts"],
  [/\/v41\/react@17\.0\.\d+\/deno\/index\.d\.ts\.js/g, "/v43/@types/react@17.0.14/index.d.ts"],
  [/\/v43\/@types\/react@17\.0\.\d+\/index\.d\.ts/g, "/v43/@types/react@17.0.14/index.d.ts"],
  ["cdn.esm.sh", "^^HOST^^"],
  ["esm.sh", "^^HOST^^"],
] as Array<[string | RegExp, string]>;
