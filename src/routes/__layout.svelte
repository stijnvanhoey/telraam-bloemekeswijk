<script>
	import '../app.css';
	import Tooltip from '../lib/components/Tooltip.svelte';
	import { tooltip } from '../lib/tooltip';
</script>

<svelte:head>
	<title>Telraam bloemekenswijk | Home Page</title>
	<html lang="en-GB" />
</svelte:head>

<main>
	<div class="py-10">
		<nav
			class="top-0 fixed inset-x-0 z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-white shadow"
		>
			<div
				class="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start"
			>
				<a href="/"
					><span
						class="text-blueGray-700 text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
						>De Bloemekenswijk telt mee</span
					></a
				>
			</div>
			<div class="w-full block flex-grow lg:flex lg:items-right lg:w-auto text-left md:text-right">
				<div class="text-sm lg:flex-grow">
					<a href="/" class="text-blueGray-400 far fa-file-alt text-lg leading-lg mr-3"> Kaart </a>
					<a href="/blog" class="text-blueGray-400 far fa-file-alt text-lg leading-lg mr-3">
						Blog
					</a>
					<a href="/team" class="text-blueGray-400 far fa-file-alt text-lg leading-lg mr-3">
						Team
					</a>
					<a href="/over" class="text-blueGray-400 far fa-file-alt text-lg leading-lg mr-3">
						Over
					</a>
				</div>
			</div>
		</nav>
		<br />
		<div class="z-0 md:container md:mx-auto">
			<slot />
		</div>
	</div>
</main>

<footer>
	<p>
		In elkaar gebokst door de bewoners van de <button
			type="button"
			class="
    px-0.5
    py-0.5
    bg-teal-500
    text-white
    font-medium
    text-xs
    leading-tight
    uppercase
    rounded
    shadow-md
    hover:bg-teal-600 hover:shadow-lg
    focus:bg-teal-600 focus:shadow-lg focus:outline-none focus:ring-0
    active:bg-teal-700 active:shadow-lg
    transition
    duration-150
    ease-in-out
  "
			id="popcorn"
			use:tooltip={{ content: Tooltip, message: 'Vree wijze wijk!' }}
		>
			bloemekenswijk
		</button>
		met data van
		<a
			href="https://telraam.net/"
			id="popcorn"
			use:tooltip={{ content: Tooltip, message: 'CC-BY-NC License' }}>TelRaam</a
		>.
	</p>
</footer>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
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

	footer a {
		background-image: none;
	}

	footer a:hover {
		text-decoration: underline;
	}
</style>
