<script>
    import NavSection from "@/components/common/NavSection.svelte";

    import backgroundImage from '$lib/assets/images/background/amatuer_meet_thumbnail.png';

</script>

<svelte:head>
    <title>Contents - Fiore</title>
</svelte:head>

<div>
    <NavSection
        title="Contents"
        image={backgroundImage}
        filters = {['Interview', 'Podcast', 'Audition']}
    />

</div>

<style>
    
</style>