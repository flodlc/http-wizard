import { AxiosRequestConfig } from "axios";
import { SchemaTypeBox } from "./TypeboxAdapter";
import { SchemaZod } from "./ZodAdapter";

export type Simplify<T> = { [K in keyof T]: T[K] } & {};
export type DrainOuterGeneric<T> = [T] extends [unknown] ? T : never;

export type Schema = SchemaTypeBox | SchemaZod;

export type RouteDefinition = {
  method: AxiosRequestConfig["method"];
  url: string | (({ params }: { params: { [s: string]: string } }) => string);
  okCode?: number;
  schema: Schema;
};
