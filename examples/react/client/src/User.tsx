import { api } from './api';

export const User = () => {
  const { data: user } = api.ref('[GET]/user').useQuery({});

  if (!user) return <>loading</>;

  return (
    <div>
      <div>Name: {user.name}</div>
      <div>Age: {user.age}</div>
    </div>
  );
};
