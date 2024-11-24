<script>
    import * as d3 from "d3";
    import { onMount, onDestroy } from 'svelte';
    import Tooltip from "./Tooltip.svelte";
    import { createEventDispatcher } from 'svelte';
    import './styles.css'
    export let data;
    export let filterBy;
    export let avgSnofall;
    let xPosition = 0;
    let yPosition = 0;
    let hoveredData = null;
    let hoverLocation = null;
    export let hoverSeason;
    export let xAxisDisplay = "no";
    let chartContainer;
    let width = 0, height = 260; // Initialize with default or minimum values


    onMount(() => {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                width = entry.contentRect.width;
                height = height
            }
        });

        if (chartContainer) {
            resizeObserver.observe(chartContainer);
        }

        return () => {
            resizeObserver.disconnect(); // Use disconnect to clear all observations
        };
    });

    const dispatch = createEventDispatcher();

let locations = Array.from(d3.group(data, d => d.Location))
let seasons = Array.from(new Set(data.map(d => d.Season)))


$: width = chartContainer ? chartContainer.clientWidth : 0;
$: height = 300;

let margins = {
    top: 10,
    right: 0,
    bottom: xAxisDisplay === "yes" ? 50 : 5,
    left: 20,
}

$: innerWidth = width - margins.right - margins.left
$: innerHeight = height - margins.top - margins.bottom

$: minMax = d3.extent(data, d => +d["Total Snowfall"])
$: yScale = d3.scaleLinear()
    .domain([0, minMax[1]])
    .range([innerHeight, 0])
    .nice()

$: xScale = d3.scaleBand()
    .domain(seasons)
    .range([margins.left, innerWidth - margins.right])
    .padding(0.1)


$: lineGenerator = d3.line()
    .x(d => xScale(d["Season"]) + xScale.bandwidth()/2)
    .y(d => yScale(d["Total Snowfall"]))
    .curve(d3.curveMonotoneX)

$: colors = d3.scaleOrdinal()
    .domain(['Cypress_Mountain', 'Grouse_Mountain', 'Mt_Seymour'])
    .range(["var(--seymorColor)", "var(--grouseColor)", "var(--cypresColor)"])

$: maxDump = d3.extent(data, d => +d["Biggest Snowfall"])
$: circleScale = d3.scaleSqrt()
    .domain(maxDump)
    .range([3, 16])
    .nice()

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
        dispatch('seasonSelectedHover', point)
    }
    
</script>

<div class="chartWrapper" id="lineChart" bind:this={chartContainer} role="figure" tabindex="-1">
    <svg {width} {height} role="img" aria-label="Line Chart"
    on:mouseleave={() => {
        hoveredData = null;
        hoverLocation = null;
        seasonSelected(null)
        }}
    > 

            <g transform="translate({margins.left}, {margins.top})">
    <!-- /// Avg. Line -->
            {#if xAxisDisplay !== "yes"}
            <g transform={`translate(0, ${yScale(avgSnofall)})`} role="presentation" aria-hidden="true">
                <line x2={innerWidth} x1={margins.left - 5} stroke="var(--textColorDark20)" stroke-width="1" stroke-dasharray="6, 3" />
                <text x={margins.left + 4} text-anchor="start" alignment-baseline="middle" dy="-0.7rem" font-size="10" fill="var(--textColorDark80)" font-weight="700">Avg. Snowfall - {avgSnofall}″</text>
            </g>
            {/if}  
<!-- /// X Axis -->
        {#if xAxisDisplay === "yes"}
            <g transform={`translate(0 ${innerHeight + 20})`} role="presentation" aria-hidden="true">
            {#each seasons as tickValue}
                <g transform={`translate(${xScale(tickValue) + xScale.bandwidth()/2} 0)`}>
                    <line y1={-16} y2={-10} stroke="var(--textColorDark20)" />
                    <text text-anchor="middle" alignment-baseline="bottom" font-size="10" font-weight="500" fill="var(--textColorDark40)">
                    {convertSeason(tickValue)}
                </g>
            {/each}
    
            <text text-anchor="start" alignment-baseline="middle" dx={innerWidth/2 - 10} dy="1.6rem" font-size="10" fill="var(--textColorDark40)" role="presentation" aria-hidden="true">Seasons</text>
            </g>
            {/if}
<!-- /// Y Axis -->           
                <g role="presentation" aria-hidden="true">
                    {#each yScale.ticks(4) as tickValue}
                        <g transform={`translate(0, ${yScale(tickValue)})`}>
                            <line x1={10} x2={16} stroke="var(--textColorDark20)" />
                            <text text-anchor="end" alignment-baseline="middle" dx=".5rem" font-size="10" fill="var(--textColorDark40)">
                            {tickValue}
                        </g>
                    {/each}
                    <!-- /// Y legend --> 
                    <text text-anchor="start" alignment-baseline="middle" dx="-1.4rem" dy="0.5rem" font-size="10" fill="var(--textColorDark40)">Totall Snowfall (Inch)</text>
                </g>
                <!-- /// Lines -->
            {#each locations as location}
                <g class={filterBy === location[0] ? "bringForward" : ""} > 
                    <path d={lineGenerator(location[1])} fill="none" stroke={filterBy === location[0] ? colors(location[0]) : "var(--textColorDark10)"} stroke-width={filterBy === location[0] ? 2 : 1} stroke-dasharray={filterBy === location[0] ? "0 0" : "4 2"}/>
                </g>
            {/each}
<!-- /// Circles for snow dump -->
 
            {#each locations as location}

        {#if xAxisDisplay !== "yes"}
            {#if location[0] === filterBy}
            <!-- /// Legend for dump -->
                {#if location[0] === "Cypress_Mountain"}
                <g transform="translate({xScale("2015 - 2016") + xScale.bandwidth()/2}, 70)" role="presentation" aria-hidden="true">
                    <text text-anchor="End" alignment-baseline="middle" dx="-3.5rem" dy="0.5rem" font-size="10" fill="var(--textColorDark60)">Biggest Snowfall (inch)</text>
                    <path d="M-30,5 L-10,35" stroke="var(--textColorDark20)" fill="none" stroke-width="1"/>

                </g>
                {/if}
                <g class="bringForward">
                {#each location[1] as season}
                    <g class={filterBy === location[0] ? "bringForward" : ""} transform="translate({xScale(season["Season"]) + xScale.bandwidth()/2}, {yScale(season["Total Snowfall"]) - 2})">
                        <circle r={circleScale(season["Biggest Snowfall"])} cy="2" cx="2" fill={hoveredData && hoveredData.Season === season.Season ? colors(season.Location) : "var(--bgColor)"} stroke={colors(season.Location)} stroke-width="2" />
                        {#if circleScale(season["Biggest Snowfall"]) > 8}
                          <text dx="0.2rem" dy="0.2rem" font-weight="600" font-size="10" text-anchor="middle" alignment-baseline="middle" fill={hoveredData && hoveredData.Season === season.Season ? "white" : "var(--textColorDark60)"}>{season["Biggest Snowfall"]}</text>
                        {/if}
                    </g>
                {/each}
                </g>
            {/if}

        {:else}
            
            {#if location[0] === filterBy}
                <g class="bringForward" >
                {#each location[1] as season}
                    <g class={filterBy === location[0] ? "bringForward" : ""} transform="translate({xScale(season["Season"]) + xScale.bandwidth()/2}, {yScale(season["Total Snowfall"]) - 2})">
                        <circle r="3" cy="1.5" cx="0" fill={colors(season.Location)} stroke={colors(season.Location)} stroke-width="2" />
                    </g>
                {/each}
                </g>
            {/if}
        
        {/if}


            {/each}

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
                    on:focus={(e) => {
                        mousePosition(e);
                        seasonSelected(season.Season);
                    }}
                    on:mousemove={(e) => {
                        mousePosition(e)
                        seasonSelected(season.Season)
                    }}
                    on:mouseleave={(e) => {
                        seasonSelected(null)
                        }}
                    role="presentation">
                        <rect width={xScale.bandwidth()} height={innerHeight + 6} x="0" y="0" fill={colors(season.Location)} opacity={hoverSeason === season.Season ? 0.1 : 0}/>
                    </g>
                {/each}
            {/if}
            {/each}
        </g>
    </svg>
    {#if hoveredData} 
        <Tooltip {xPosition} {xAxisDisplay} {yPosition} {hoveredData} {width} barwidth={xScale.bandwidth()}/>
    {/if}
</div>


<style>
    .chartWrapper {
        position: relative;
        isolation: isolate;
        width: 100%;
        min-width: 0;
        display: block; 
        /* overflow: hidden; */
    }
    svg {
        display: block;
    }
    #lineChart {
        border-bottom: 1px dashed rgb(233, 233, 233);
        z-index: 100;
    }
    path {
        /* mix-blend-mode:color-burn; */
    }
    .snowDaysBar {
        transition: opacity, 0.2s;
    }


</style>