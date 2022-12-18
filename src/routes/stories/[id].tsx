import { Component, For, Show } from 'solid-js';
import { A, RouteDataArgs, useRouteData } from 'solid-start';
import Comment from '~/components/comment';
import { herokuAppClient } from '~/root';

export const routeData = (props: RouteDataArgs) => {
  const story = herokuAppClient.getItem.createQuery(() => [props.params.id], {
    params: {
      get id() {
        return props.params.id;
      },
    },
  });

  return story;
};

const Story: Component = () => {
  const story = useRouteData<typeof routeData>();
  return (
    <Show when={story.data?.body}>
      <div class="item-view">
        <div class="item-view-header">
          <a href={story.data?.body!.url} target="_blank">
            <h1>{story.data?.body!.title}</h1>
          </a>
          <Show when={story.data?.body!.domain}>
            <span class="host">({story.data?.body!.domain})</span>
          </Show>
          <p class="meta">
            {story.data?.body!.points} points | by{' '}
            <A href={`/users/${story.data?.body!.user}`}>
              {story.data?.body!.user}
            </A>{' '}
            {story.data?.body!.time_ago} ago
          </p>
        </div>
        <div class="item-view-comments">
          <p class="item-view-comments-header">
            {story.data?.body!.comments_count
              ? story.data?.body!.comments_count + ' comments'
              : 'No comments yet.'}
          </p>
          <ul class="comment-children">
            <For each={story.data?.body!.comments}>
              {(comment) => <Comment comment={comment} />}
            </For>
          </ul>
        </div>
      </div>
    </Show>
  );
};

export default Story;
