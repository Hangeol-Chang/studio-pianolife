<script>
    export let title = '';
</script>

<div class="section-title-container">
    <h2 class="title-text">{title}</h2>
    <div class="underline"></div>
</div>

<style lang="scss">
    .section-title-container {
        margin: 20px 5vw;
    }

    .title-text {
        font-size: 1.5rem;
        margin-bottom: 8px;
        font-weight: 600;
    }

    .underline {
        width: 50px;
        height: 3px;
        background-color: #333;
        border-radius: 2px;
    }
</style>
