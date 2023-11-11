import { AxiosRequestConfig } from "axios";
import { SchemaTypeBox } from "./TypeboxAdapter";
import { SchemaZod } from "./ZodAdapter";

export type Schema = SchemaTypeBox | SchemaZod;

export type RouteDefinition = {
  method: AxiosRequestConfig["method"];
  url: string | (({ params }: { params: { [s: string]: string } }) => string);
  okCode?: number;
  schema: Schema;
};
