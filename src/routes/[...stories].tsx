import { createQuery } from '@tanstack/solid-query';
import { Component, createEffect, createResource, For, Show } from 'solid-js';
import { A, RouteDataArgs, useRouteData } from 'solid-start';
import Story from '~/components/story';
import fetchAPI from '~/lib/api';
import { IStory } from '~/types';

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

  const query = createQuery(
    () => [type(), page()],
    () => fetchAPI(`${mapStories[type()]}?page=${page()}`)
  );

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
            <For each={query.data}>
              {(story) => <Story story={story as any} />}
            </For>
          </ul>
        </Show>
      </main>
    </div>
  );
};

export default Stories;
