import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { User } from './User';

export function App() {
  const [queryClient] = useState(new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <User />
    </QueryClientProvider>
  );
}

export default App;
