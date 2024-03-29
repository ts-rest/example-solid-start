// @refresh reload
import { Suspense } from 'solid-js';
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts,
  Title,
} from 'solid-start';
import Nav from './components/nav';
import './root.css';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { initQueryClient } from '@ts-rest/solid-query';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { IStory } from './types';

const c = initContract();

const herokuApi = c.router({
  getNews: {
    method: 'GET',
    path: '/:type',
    query: z.object({
      page: z.number().optional(),
    }),
    responses: {
      200: c.response<IStory[]>(),
    },
  },
  getItem: {
    method: 'GET',
    path: '/item/:id',
    responses: {
      200: c.response<IStory>(),
    },
  },
});

const hackerNewsApi = c.router({
  getUser: {
    method: 'GET',
    path: '/user/:id',
    responses: {
      200: z.object({
        created: z.number(),
        id: z.string(),
        karma: z.number(),
        submitted: z.array(z.number()),
      }),
    },
  },
});

export const herokuAppClient = initQueryClient(herokuApi, {
  baseUrl: 'https://node-hnapi.herokuapp.com',
  baseHeaders: {},
});

export const hackerNewsClient = initQueryClient(hackerNewsApi, {
  baseUrl: 'https://hacker-news.firebaseio.com/v0',
  baseHeaders: {},
});

const queryClient = new QueryClient();

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>SolidStart - Hacker News</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta name="description" content="Hacker News Clone built with Solid" />
        <Link rel="manifest" href="/manifest.webmanifest" />
      </Head>
      <Body>
        <Nav />
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<div class="news-list-nav">Loading...</div>}>
              <Routes>
                <FileRoutes />
              </Routes>
            </Suspense>
          </QueryClientProvider>
        </ErrorBoundary>
        <Scripts />
      </Body>
    </Html>
  );
}

// if (import.meta.env.PROD && !isServer && "serviceWorker" in navigator) {
//   // Use the window load event to keep the page load performant
//   window.addEventListener("load", () => {
//     navigator.serviceWorker.register(`/sw.js`);
//   });
// }
