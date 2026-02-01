<script>
    export let href = '/';
</script>

<div class="more-link text-right">
    <a {href}>+ more</a>
</div>

<style>
    .more-link {
        text-align: right;
        margin-right: 0.5rem;
        
        a {
            font-size: 0.85rem;
            font-weight: 300;
            color: #333;
            text-decoration: none;
            transition: opacity 0.2s;
            &:hover { opacity: 0.7; }
        }
    }
</style>