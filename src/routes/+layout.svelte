<script>
	import '@/styles/globals.scss';
	import Header from '@/components/layout/header.svelte';
	import Footer from '@/components/layout/footer.svelte';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<title>Studio PianoLife</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<link rel="icon" type="image/x-icon" href="/common/icon.ico">
</svelte:head>

<Header />
<div class="content">
	{@render children()}
</div>
<Footer />

<style lang="scss">
	:global(body) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	.content {
		min-height: 100vh;
	}
</style>
