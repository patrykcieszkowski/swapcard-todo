
// regular object format
declare type object = {
  [string]: any
}

declare module 'app' {
  declare export type object = object
  declare module.exports: any
}
