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
	<link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
</svelte:head>

<Header />
<div class="content">
	{@render children()}
</div>
<Footer />

<style lang="scss">
	.content {
		min-height: calc(100vh - 160px); // Adjust based on header and footer height
		margin: 60px 0;
	}
	
	:global(body) {
		padding: 0;
		box-sizing: border-box;
	}
	.content {
		min-height: 100vh;
	}
</style>
