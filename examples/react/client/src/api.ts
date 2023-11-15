import { ZodTypeProvider } from '@http-wizard/core';
import { createQueryClient } from '@http-wizard/react-query';
import axios from 'axios';
import { Router } from 'server';

export const api: A = createQueryClient<Router, ZodTypeProvider>({
  instance: axios.create(),
}).ref;

type A = ReturnType<typeof createQueryClient<Router, ZodTypeProvider>>['ref'];
