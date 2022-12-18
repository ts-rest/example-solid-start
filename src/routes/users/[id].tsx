import { Component, Show } from 'solid-js';
import { RouteDataArgs, useRouteData } from 'solid-start';
import { hackerNewsClient } from '~/root';

export const routeData = (props: RouteDataArgs) => {
  const user = hackerNewsClient.getUser.createQuery(() => [props.params.id], {
    params: {
      get id() {
        return `${props.params.id}.json`;
      },
    },
  });

  return user;
};

const User: Component = () => {
  const user = useRouteData<typeof routeData>();

  return (
    <div class="user-view">
      <Show when={user.data}>
        <Show
          when={user.data?.body !== null}
          fallback={<h1>User not found.</h1>}
        >
          <h1>User : {user.data!.body.id}</h1>
          <ul class="meta">
            <li>
              <span class="label">Created:</span> {user.data!.body.created}
            </li>
            <li>
              <span class="label">Karma:</span> {user.data!.body!.karma}
            </li>
          </ul>
          <p class="links">
            <a
              href={`https://news.ycombinator.com/submitted?id=${
                user.data!.body!.id
              }`}
            >
              submissions
            </a>{' '}
            |{' '}
            <a
              href={`https://news.ycombinator.com/threads?id=${
                user.data!.body!.id
              }`}
            >
              comments
            </a>
          </p>
        </Show>
      </Show>
    </div>
  );
};

export default User;
