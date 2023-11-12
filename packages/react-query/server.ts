import { createRoute } from "@http-wizard/core";
import { z } from "zod";

import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

export const fastifyInstance = fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

fastifyInstance.setValidatorCompiler(validatorCompiler);
fastifyInstance.setSerializerCompiler(serializerCompiler);

const getUser = createRoute("/user/create", {
  method: "PUT",
  schema: {
    body: z.object({
      name: z.string(),
      age: z.number(),
      email: z.string(),
    }),
    response: {
      200: z.array(
        z.object({
          name: z.string(),
          age: z.number(),
        })
      ),
    },
  },
}).handle((options) => {
  fastifyInstance.route({
    ...options,
    handler: () => {
      // implement your handler...
    },
  });
});

const getUser2 = createRoute("/user/create2", {
  method: "PUT",
  schema: {
    body: z.object({
      name: z.string(),
      age: z.number(),
      email: z.string(),
      data: z.object({
        dog: z.object({
          toy: z.object({ name: z.string(), nickanmes: z.enum(["aa", "bb"]) }),
        }),
      }),
    }),
    response: {
      200: z.array(
        z.object({
          name: z.string(),
          age: z.number(),
        })
      ),
    },
  },
}).handle((options) => {
  fastifyInstance.route({
    ...options,
    handler: () => {
      // implement your handler...
    },
  });
});

const getUser3 = createRoute("/user/create3", {
  method: "PUT",
  schema: {
    body: z.object({
      namwe: z.string(),
      age: z.number(),
      email: z.string(),
      data: z.object({
        dog: z.object({
          toy: z.object({ name: z.string(), nickanmes: z.enum(["aa", "bb"]) }),
        }),
      }),
    }),
    response: {
      200: z.array(
        z.object({
          name: z.string(),
          age: z.number(),
        })
      ),
    },
  },
}).handle((options) => {
  fastifyInstance.route({
    ...options,
    handler: () => {
      // implement your handler...
    },
  });
});

const getUser4 = createRoute("/user/create4", {
  method: "PUT",
  schema: {
    body: z.object({
      name: z.string(),
      age: z.number(),
      emweail: z.string(),
      data: z.object({
        dog: z.object({
          toy: z.object({ name: z.string(), nickanmes: z.enum(["aa", "bb"]) }),
        }),
      }),
    }),
    response: {
      200: z.array(
        z.object({
          naeme: z.string(),
          age: z.number(),
        })
      ),
    },
  },
}).handle((options) => {
  fastifyInstance.route({
    ...options,
    handler: () => {
      // implement your handler...
    },
  });
});

const getUser5 = createRoute("/user/create5", {
  method: "PUT",
  schema: {
    body: z.object({
      name: z.string(),
      age: z.number(),
      emaeil: z.string(),
      data: z.object({
        dog: z.object({
          toy: z.object({ name: z.string(), nickanmes: z.enum(["aa", "bb"]) }),
        }),
      }),
    }),
    response: {
      200: z.array(
        z.object({
          name: z.string(),
          age: z.number(),
        })
      ),
    },
  },
}).handle((options) => {
  fastifyInstance.route({
    ...options,
    handler: () => {
      // implement your handler...
    },
  });
});

const getUser6 = createRoute("/user/create6", {
  method: "PUT",
  schema: {
    body: z.object({
      name: z.string(),
      age: z.number(),
      email: z.string(),
      data: z.object({
        dofg: z.object({
          toey: z.object({ name: z.string(), nickanmes: z.enum(["aa", "bb"]) }),
        }),
      }),
    }),
    response: {
      200: z.array(
        z.object({
          name: z.string(),
          age: z.number(),
        })
      ),
    },
  },
}).handle((options) => {
  fastifyInstance.route({
    ...options,
    handler: () => {
      // implement your handler...
    },
  });
});

const getUser7 = createRoute("/user/create7", {
  method: "PUT",
  schema: {
    body: z.array(
      z.object({
        name: z.string(),
        age: z.number(),
        emaeil: z.string(),
        data: z.object({
          dog: z.object({
            toy: z.object({
              name: z.string(),
              nickanmes: z.enum(["aa", "bb"]),
            }),
          }),
        }),
      })
    ),
    response: {
      200: z.array(
        z.object({
          name: z.string(),
          age: z.number(),
        })
      ),
    },
  },
}).handle((options) => {
  fastifyInstance.route({
    ...options,
    handler: () => {
      // implement your handler...
    },
  });
});

const getUser8 = createRoute("/user/create8", {
  method: "PUT",
  schema: {
    body: z.object({
      name: z.string(),
      age: z.number(),
      email: z.string(),
      data: z.object({
        dog: z.object({
          toy: z.object({ name: z.string(), nickanmes: z.enum(["aa", "bb"]) }),
        }),
      }),
    }),
    response: {
      200: z.array(
        z.object({
          name: z.string(),
          age: z.number(),
        })
      ),
    },
  },
}).handle((options) => {
  fastifyInstance.route({
    ...options,
    handler: () => {
      // implement your handler...
    },
  });
});

const getUser9 = createRoute("/user/create9", {
  method: "PUT",
  schema: {
    body: z.object({
      name: z.string(),
      age: z.number(),
      email: z.string(),
      data: z.object({
        dog: z.object({
          toy: z.object({ name: z.string(), nickanmes: z.enum(["aa", "bb"]) }),
        }),
      }),
    }),
    response: {
      200: z.array(
        z.object({
          name: z.string(),
          age: z.number(),
        })
      ),
    },
  },
}).handle((options) => {
  fastifyInstance.route({
    ...options,
    handler: () => {
      // implement your handler...
    },
  });
});

const getUser10 = createRoute("/user/create10", {
  method: "PUT",
  schema: {
    body: z.object({
      name: z.string(),
      age: z.number(),
      email: z.string(),
      data: z.object({
        dog: z.object({
          toy: z.object({ name: z.string(), nickanmes: z.enum(["aa", "bb"]) }),
        }),
      }),
    }),
    response: {
      200: z.array(
        z.object({
          name: z.string(),
          age: z.number(),
        })
      ),
    },
  },
}).handle((options) => {
  fastifyInstance.route({
    ...options,
    handler: () => {
      // implement your handler...
    },
  });
});

const getUser11 = createRoute("/user/create11", {
  method: "PUT",
  schema: {
    body: z.object({
      name: z.string(),
      age: z.number(),
      email: z.string(),
      data: z.object({
        dog: z.object({
          toy: z.object({ name: z.string(), nickanmes: z.enum(["aa", "bb"]) }),
        }),
      }),
    }),
    response: {
      200: z.array(
        z.object({
          name: z.string(),
          age: z.number(),
        })
      ),
    },
  },
}).handle((options) => {
  fastifyInstance.route({
    ...options,
    handler: () => {
      // implement your handler...
    },
  });
});

const getUser12 = createRoute("/user/create13", {
  method: "PUT",
  schema: {
    body: z.object({
      name: z.string(),
      age: z.number(),
      email: z.string(),
      data: z.object({
        dog: z.object({
          toy: z.object({ name: z.string(), nickanmes: z.enum(["aa", "bb"]) }),
        }),
      }),
    }),
    response: {
      200: z.array(
        z.object({
          name: z.string(),
          age: z.number(),
        })
      ),
    },
  },
}).handle((options) => {
  fastifyInstance.route({
    ...options,
    handler: () => {
      // implement your handler...
    },
  });
});

const getUser13 = createRoute("/user/create13", {
  method: "PUT",
  schema: {
    body: z.object({
      name: z.string(),
      age: z.number(),
      email: z.string(),
      data: z.object({
        dog: z.object({
          toy: z.object({ name: z.string(), nickanmes: z.enum(["aa", "bb"]) }),
        }),
      }),
    }),
    response: {
      200: z.array(
        z.object({
          name: z.string(),
          age: z.number(),
        })
      ),
    },
  },
}).handle((options) => {
  fastifyInstance.route({
    ...options,
    handler: () => {
      // implement your handler...
    },
  });
});

const getUser14 = createRoute("/user/create14", {
  method: "PUT",
  schema: {
    body: z.object({
      name: z.string(),
      age: z.number(),
      email: z.string(),
      data: z.object({
        dog: z.object({
          toy: z.object({ name: z.string(), nickanmes: z.enum(["aa", "bb"]) }),
        }),
      }),
    }),
    response: {
      200: z.array(
        z.object({
          name: z.string(),
          age: z.number(),
        })
      ),
    },
  },
}).handle((options) => {
  fastifyInstance.route({
    ...options,
    handler: () => {
      // implement your handler...
    },
  });
});

const getUser15 = createRoute("/user/create15", {
  method: "PUT",
  schema: {
    body: z.object({
      name: z.string(),
      age: z.number(),
      email: z.string(),
      data: z.object({
        dog: z.object({
          toy: z.object({ name: z.string(), nickanmes: z.enum(["aa", "bb"]) }),
        }),
      }),
    }),
    response: {
      200: z.array(
        z.object({
          name: z.string(),
          age: z.number(),
        })
      ),
    },
  },
}).handle((options) => {
  fastifyInstance.route({
    ...options,
    handler: () => {
      // implement your handler...
    },
  });
});

const router = {
  ...getUser,
  ...getUser2,
  ...getUser3,
  ...getUser4,
  ...getUser5,
  ...getUser6,
  ...getUser7,
  ...getUser8,
  ...getUser9,
  ...getUser10,
  ...getUser12,
  ...getUser13,
  ...getUser14,
  ...getUser15,
};
export type Router = typeof router;
