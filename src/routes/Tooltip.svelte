<script>
    export let xPosition;
    export let yPosition;
    export let hoveredData;
    export let seasonData = true;
    export let width;
    export let barwidth;
    export let xAxisDisplay = "no";
    export let displayDays = "no";
</script>


<div class="tooltip" style="left:{xPosition < width/2 ? xPosition + barwidth : xPosition - barwidth - 140}px; top:{yPosition}px; z-index:200;">
    <header>
        <h3>{hoveredData.Location.replace(/_/g, ' ')}</h3>
        {#if seasonData}
        <p>Season: <b>{hoveredData.Season}</b></p>
        {/if}
    </header>
    {#if xAxisDisplay === "yes"}
        <p>Total snowfall: <b>{hoveredData["Total Snowfall"]}"</b></p>
    {:else if displayDays === "yes"}
        <p>Snowfall days: <b>{hoveredData["Snowfall Days"]} days</b></p>
    {:else}
    <p>Total snowfall: <b>{hoveredData["Total Snowfall"]}"</b></p>
    <p>Biggest Snowfall: <b>{hoveredData["Biggest Snowfall"]}"</b></p>
    <p>Snowfall days: <b>{hoveredData["Snowfall Days"]} days</b></p>
    {/if}
</div>


<style>
    .tooltip {
        position: absolute;
        z-index: 200;
        width: 140px;
        pointer-events: none;
        left: 0;
        top: 0;
        padding: 8px;
        background-color: white;
        box-shadow: 0 0 16px hsla(320, 0%, 10%, .2);
        border-radius: 4px;
        transition: left, 0.1s;
    }
    header {
        margin-bottom: 6px;
        padding-bottom: 2px;
        border-bottom:1px solid hsla(320, 0%, 10%, .2);
    }
    .tooltip h3 {
        font-size: 1.2rem;
        margin: 0 0 4px;
    }
    .tooltip p {
        font-size: 1.2rem;
        margin: 0 0 4px;
    }
</style>