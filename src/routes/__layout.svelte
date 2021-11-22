<script>
    import { Navbar, Badge, Popover } from 'spaper';

    import 'papercss/dist/paper.min.css'
    import '../app.css';
</script>

<svelte:head>
    <title>Telraam Bloemekeswijk | Home Page</title>
    <html lang="en-GB" />
</svelte:head>

<main>
    <Navbar border={false}>
        <h3 slot="brand">
          <a href="/">TelRaam Bloemekeswijk</a>
        </h3>
        <ul class="inline">
          <li><a href="/about">About</a></li>
          <li><a href="https://telraam.net/">Telraam</a></li>
        </ul>
    </Navbar>

    <div class="container-lg paper border border-primary">
        <slot />
    </div>
</main>

<footer>
    <p>In elkaar gebokst door de bewoners van de
        <Popover label="Vree wijze wijk!" background="warning">
            <Badge type="success">Bloemekeswijk</Badge>
       </Popover>
        met data van
        <Popover label="CC-BY-NC license" background="warning">
            <a href="https://telraam.net/">TelRaam</a>.
       </Popover>
    </p>
</footer>

<style>
    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        width: 100%;
        max-width: 1024px;
        margin: 0 auto;
        box-sizing: border-box;
    }

    footer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 40px;
    }

    @media (min-width: 480px) {
        footer {
            padding: 40px 0;
        }
    }

    a {
        background-image: none;
    }

    a:hover {
        text-decoration: underline;
    }
</style>
