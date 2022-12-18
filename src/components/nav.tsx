import { A } from 'solid-start';

function Nav() {
  return (
    <header class="header">
      <nav class="inner">
        <A href="/">
          <strong>HN</strong>
        </A>
        <A href="/new">
          <strong>New</strong>
        </A>
        <A href="/show">
          <strong>Show</strong>
        </A>
        <A href="/ask">
          <strong>Ask</strong>
        </A>
        <A href="/job">
          <strong>Jobs</strong>
        </A>
        <a
          style={{ display: 'flex', 'align-items': 'center' }}
          class="github"
          href="https://ts-rest.com"
          target="_blank"
          rel="noreferrer"
        >
          Solid + `@ts-rest`
          <img
            height={30}
            width={30}
            style={{ 'margin-left': '20px' }}
            src="https://ts-rest.com/img/logo.svg"
          />
        </a>
      </nav>
    </header>
  );
}

export default Nav;
