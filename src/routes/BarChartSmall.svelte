<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";
    import Tooltip from "./Tooltip.svelte";
    import { createEventDispatcher } from 'svelte';
    export let data;
    export let filterBy;
    export let avgSnofall;
    export let yAxisDisplay = "yes";
    export let xAxisDisplay = "no";
    let xAxisWrapper;
    let xPosition = 0;
    let yPosition = 0;
    let hoveredData = null;
    let hoverLocation = null;
    export let hoverSeason;
    export let maxDaysSelcted = "no"
    export let displayDays = "no"
    let paddingGap;



    const dispatch = createEventDispatcher();


let locations = Array.from(d3.group(data, d => d.Location))
let locationsArr = Array.from(new Set(data.map(d => d.Location)))
let seasons = Array.from(new Set(data.map(d => d.Season)))
let locationsMax = {}
let locationsMin = {}

locations.forEach(e => {
    let maxDays = d3.max(e[1], d => +d["Snowfall Days"]);

    locationsMax[e[0]] = maxDays; // Set location as key and maxDays as value
});

locations.forEach(e => {
    let minDays = d3.min(e[1], d => +d["Snowfall Days"]);

    locationsMin[e[0]] = minDays; // Set location as key and maxDays as value
});


$: width = 400
$: height = 140
$: paddingGap = yAxisDisplay !== "yes" ? 0.45 : 0.2;

let margins = {
    top: 30,
    right: 0,
    bottom: 20,
    left: yAxisDisplay === "yes" ? 20 : 0,
}

$: innerWidth = width - margins.right - margins.left
$: innerHeight = height - margins.top - margins.bottom

$: minMax = d3.extent(data, d => +d["Snowfall Days"])
$: yScale = d3.scaleLinear()
    .domain([0, minMax[1]])
    .range([innerHeight, 0])
    .nice()

$: xScale = d3.scaleBand()
    .domain(seasons)
    .range([margins.left, innerWidth - margins.right])
    .padding(paddingGap)

$: colors = d3.scaleOrdinal()
    .domain(locationsArr)
    .range(["var(--seymorColor)", "var(--grouseColor)", "var(--cypresColor)"])

$: if (xAxisWrapper) {
    d3.select(xAxisWrapper).call(d3.axisBottom(xScale))
    d3.selectAll("#xAxis .tick text").attr("font-size", 12).attr("transform", "rotate(-45)").style("text-anchor", "start");
}

onMount( () => {
        d3.selectAll(".bringForward").raise();
    })

function convertSeason(season) {
    const input = season;
    const output = input.replace(/(\d{2})(\d{2})(\s*-\s*\d{2})?/g, "$2/");
    return output;
}
const mousePosition = (e) => {
        xPosition = e.offsetX;
        yPosition = e.offsetY;
    }

 // Dispetch finction and value
 function seasonSelected(point) {
        dispatch('seasonSelectedHoverBar', point)
    }

    
</script>

<div class="chartWrapper" bind:clientWidth={width}>
    <svg {width} {height} role="img" aria-label="Bar Chart"
    on:mouseleave={() => {
        hoveredData = null;
        hoverLocation = null;
        seasonSelected(null)
        }}
    > 
        <g transform="translate({margins.left}, {margins.top})">
            {#if yAxisDisplay !== "yes"}
            <text text-anchor="start" alignment-baseline="middle" dx="0" dy="-0.5rem" font-size="10" fill="var(--textColorDark80)">Snowfall days per season</text>
            {/if}

            {#each seasons as tickValue}
                <g transform={`translate(${xScale(tickValue) + xScale.bandwidth()/2} ${height - 30})`}>
                    <line y1={-16} y2={-10} stroke="var(--textColorDark20)" />
                    <text text-anchor="middle" alignment-baseline="bottom" font-size="10" font-weight="500" fill="var(--textColorDark80)">
                    {convertSeason(tickValue)}
                </g>
            {/each}
            

            {#if yAxisDisplay === "yes"}
            {#each yScale.ticks(2) as tickValue}
                <g transform={`translate(0, ${yScale(tickValue)})`}>
                    <line x1={10} x2={16} stroke="var(--textColorDark20)" />
                    <text text-anchor="end" alignment-baseline="middle" dx=".5rem" font-size="10" fill="var(--textColorDark80)">
                    {tickValue}
                </g>
            {/each}
            {/if}

            {#each locations as location}
            {#if location[0] === filterBy}

            {#if maxDaysSelcted === "Yes"}

                {#each location[1] as season}
                    <g class={filterBy === location[0] ? "bringForward" : ""} transform="translate({xScale(season["Season"])}, {yScale(season["Snowfall Days"])})">
                        <rect width={xScale.bandwidth()} height={innerHeight - yScale(season["Snowfall Days"])} x="0" y="0" fill={locationsMax[filterBy] === season["Snowfall Days"] ? "var(--textColorDark60)" : locationsMin[filterBy] === season["Snowfall Days"] ? "var(--textColorDark40)" : "var(--textColorDark5)"}/>
                        <text x={xScale.bandwidth()/2} dy="-0.8rem" text-anchor="middle" font-weight={locationsMax[filterBy] === season["Snowfall Days"] ? "700" : locationsMin[filterBy] === season["Snowfall Days"] ? "700" : "500"} fill={locationsMax[filterBy] === season["Snowfall Days"] ? "var(--textColorDark100)" : locationsMin[filterBy] === season["Snowfall Days"] ? "var(--textColorDark100)" : "var(--textColorDark20)"}>{locationsMax[filterBy] === season["Snowfall Days"] ? season["Snowfall Days"] + " Days" : locationsMin[filterBy] === season["Snowfall Days"] ? season["Snowfall Days"] + " Days" : season["Snowfall Days"]}</text>
                    </g>
                {/each}
            {:else}

                {#each location[1] as season}
                    <g class={filterBy === location[0] ? "bringForward" : ""} transform="translate({xScale(season["Season"])}, {yScale(season["Snowfall Days"])})">
                        <rect width={xScale.bandwidth()} height={innerHeight - yScale(season["Snowfall Days"])} x="0" y="0" fill="{colors(season.Location)}"/>
                        <text x={xScale.bandwidth()/2} dy="-1rem" text-anchor="middle" font-weight="500" fill="var(--textColorDark80)">{season["Snowfall Days"]}</text>
                    </g>
                {/each}
            {/if}

            {/if}
            {/each}

        <!-- /// Interactive Bars -->
        {#each locations as location}
        {#if location[0] === filterBy}
            {#each location[1] as season}

                <g class={filterBy === location[0] ? "bringForward" : ""} transform="translate({xScale(season["Season"])}, 0)"
                on:mouseover={(e) => {
                    hoveredData = season
                    hoverLocation = season.Location
                    mousePosition(e)
                    seasonSelected(season.Season)
                    }}
                on:mousemove={(e) => {
                    mousePosition(e)
                }}
                on:focus={(e) => {
                    mousePosition(e)
                }}
                on:mouseleave={(e) => {
                    seasonSelected(null)
                    }}
                role="graphics-symbol"
                >
                    <rect width={xScale.bandwidth() + 8} height={innerHeight + 30} x="-6" y="-30" fill={colors(season.Location)} opacity={hoverSeason === season.Season ? 0.1 : 0}/>
                </g>
            {/each}
        {/if}
        {/each}
        </g>
    </svg>
    {#if hoveredData} 
        <Tooltip {xPosition} {yPosition} {displayDays} {hoveredData} {width} barwidth={xScale.bandwidth()}/>
    {/if}
</div>


<style>
    .chartWrapper {
        isolation: isolate;
        width: 100%;
        min-width: 0; /* Ensure it can shrink */
        display: block; /* or 'flex' depending on your layout needs */
        /* overflow: hidden; */
    }

</style>