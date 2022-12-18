import { Component, For, Show } from 'solid-js';
import { A, RouteDataArgs, useRouteData } from 'solid-start';
import Story from '~/components/story';
import { herokuAppClient } from '~/root';

const mapStories = {
  top: 'news',
  new: 'newest',
  show: 'show',
  ask: 'ask',
  job: 'jobs',
} as const;

export const routeData = ({ location, params }: RouteDataArgs) => {
  const page = () => +location.query.page || 1;
  const type = () => (params.stories || 'top') as keyof typeof mapStories;

  const query = herokuAppClient.getNews.createQuery(() => [type(), page()], {
    params: {
      get type() {
        return mapStories[type()];
      },
    },
    query: {
      get page() {
        return page();
      },
    },
  });

  return { type, query, page };
};

const Stories: Component = () => {
  const { page, type, query } = useRouteData<typeof routeData>();

  return (
    <div class="news-view">
      <div class="news-list-nav">
        <Show
          when={page() > 1}
          fallback={
            <span class="page-link disabled" aria-disabled="true">
              {'<'} prev
            </span>
          }
        >
          <A
            class="page-link"
            href={`/${type()}?page=${page() - 1}`}
            aria-label="Previous Page"
          >
            {'<'} prev
          </A>
        </Show>
        <span>page {page()}</span>
        <Show
          when={query.data}
          fallback={
            <span class="page-link disabled" aria-disabled="true">
              more {'>'}
            </span>
          }
        >
          <A
            class="page-link"
            href={`/${type()}?page=${page() + 1}`}
            aria-label="Next Page"
          >
            more {'>'}
          </A>
        </Show>
      </div>
      <main class="news-list">
        <Show when={query.data}>
          <ul>
            <For each={query.data?.body}>
              {(story) => <Story story={story as any} />}
            </For>
          </ul>
        </Show>
      </main>
    </div>
  );
};

export default Stories;
