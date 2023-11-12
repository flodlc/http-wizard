import { ZodTypeProvider, createClient } from "@http-wizard/core";
import type { Router } from "./server";
import { axiosInstance } from "./axios";

const client = createClient<Router, ZodTypeProvider>({
  instance: axiosInstance,
});

const data = await client.ref("[PUT]/user/create").query({
  body: { age: 30, name: "my-name", email: "my-email" },
});

const data2 = await client.ref("[PUT]/user/create2").query({
  body: {
    age: 30,
    name: "my-name",
    email: "my-email",
    data: { dog: { toy: { name: "ds", nickanmes: "aa" } } },
  },
});

const data3 = await client.ref("[PUT]/user/create6").query({
  body: {
    age: 30,
    name: "my-name",
    email: "my-email",
    data: { dofg: { toey: { name: "ds", nickanmes: "aa" } } },
  },
});
