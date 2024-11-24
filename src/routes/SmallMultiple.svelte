<script>
    import * as d3 from "d3";
    export let data;
    import Tooltip from "./Tooltip.svelte";
    $: chartWidth = 200
    let chartHeight;
    let hoveredData = null;
    let hoverLocation = null;
    let xPosition = 0;
    let yPosition = 0;

    // $: console.log(hoveredData)

let locations = Array.from(d3.group(data, d => d.Location))
let locationsArr = Array.from(new Set(data.map(d => d.Location)))
let seasons = Array.from(new Set(data.map(d => d.Season)))
let seasonsGroup = Array.from(new Set(d3.group(data, d => d.Season)))
let snowfallDays = Array.from(new Set(data.map(d => d["Snowfall Days"])))
let biggestSnowDays = Array.from(new Set(data.map(d => d["Biggest Snowfall"])))


// $: console.log(chartWidth)

$: width = chartWidth;
let height = 200

let margins = {
    top: 25,
    right: 10,
    bottom: 30,
    left: 20,
}

$: innerWidth = width - margins.right - margins.left
$: innerHeight = height - margins.top - margins.bottom

$: minMax = d3.extent(data, d => +d["Total Snowfall"])
$: yScale = d3.scaleLinear()
    .domain(minMax)
    .range([innerHeight, 0])
    .nice()

$: xScale2 = d3.scaleLinear()
    .domain(d3.extent(snowfallDays))
    .range([margins.left, innerWidth])
    .nice()

$: circleScale = d3.scaleSqrt()
    .domain(d3.extent(biggestSnowDays))
    .range([0.3, 1])
    .nice()

let colors = d3.scaleOrdinal()
    .domain(locationsArr)
    .range(["var(--seymorColor)", "var(--grouseColor)", "var(--cypresColor)"])

const mousePosition = (e) => {
    xPosition = e.pageX;
    yPosition = e.pageY;
}
</script>


<div class="multiplierWrapper">
    {#each seasonsGroup as season, i}
        <div class="chartWrapper" bind:clientWidth={chartWidth} bind:clientHeight={chartHeight}>
            <svg {width} {height} on:mouseleave={() => {
                hoveredData = null;
                hoverLocation = null;
                
                }}>
            <g transform="translate({margins.left},{margins.top})">

                <text y="-15" x={-margins.left + 3} font-size="12" font-weight="600">{i === 0 ? `Season: ${season[0]}` : season[0]}</text>

                {#if i === 0}
                <text y={innerHeight + margins.bottom - 5} dx={innerWidth/2 - margins.left} font-size="10" font-weight="400" alignment-baseline="middle" fill="var(--textColorDark100)">Snowfall Days</text>

                <text y={innerHeight/2} x="-26" font-size="10" font-weight="400" alignment-baseline="middle" text-anchor="middle" transform="rotate(90, -26, {innerHeight/2})" fill="var(--textColorDark100)">Total Snowfall</text>
                {/if}

                
                {#each xScale2.ticks() as tickValue}
                    <g transform={`translate(${xScale2(tickValue)},0)`}>
                        <line y1={innerHeight + 3} y2={innerHeight} stroke="var(--textColorDark40)" />
                        <text text-anchor="middle" dy=".5rem" y={innerHeight + 10} font-size="10" fill="var(--textColorDark60)">
                        {tickValue}
                        </text>
                    </g>
                {/each}

                {#each yScale.ticks(5) as tickValue}
                    <g transform={`translate(0, ${yScale(tickValue)})`}>
                        <line x1={margins.left - 10} x2={margins.left - 6} stroke="var(--textColorDark40)" />
                        <text text-anchor="end" alignment-baseline="middle" dx=".5rem" font-size="10" fill="var(--textColorDark80)">
                        {tickValue}
                    </g>
                {/each}

                
                <!-- All data points for reference -->
                {#each locations as location}
                <g class="ignoreBlending">
                    {#each location[1] as d }
                        <!-- <circle r={circleScale(d["Biggest Snowfall"])}  fill="var(--textColorDark20)"  cx={xScale2(d["Snowfall Days"])} cy={yScale(d["Total Snowfall"])} opacity="0.3"/>  -->
                        <g transform="translate({xScale2(d["Snowfall Days"])},{yScale(d["Total Snowfall"])})">
                            <path class="seasonCircle" d="M13.258 0.741699L26.258 23.2584H0.25801L13.258 0.741699Z" fill="var(--textColorDark40)" transform="scale({circleScale(d["Biggest Snowfall"])})" opacity="0.3" stroke-linejoin="round"/>
                        </g>
                    {/each}
                </g>
                {/each}

                <!-- Three datapoints per Season -->    
                {#each season[1] as d }
                    <!-- <circle class="seasonCircle" r={circleScale(d["Biggest Snowfall"])}  fill={colors(d.Location)}  cx={xScale2(d["Snowfall Days"])} cy={yScale(d["Total Snowfall"])} stroke-width="1" stroke="hsla(0, 0%, 20%, 0.8)" opacity={hoverLocation === d.Location ? 1 : hoverLocation ? 0.3 : 1}
                    on:mouseover={(e) => {
                        hoveredData = d
                        hoverLocation = d.Location
                        mousePosition(e)
                        }}
                    on:mousemove={(e) => {
                        mousePosition(e)
                    }}
                    /> -->

                    <g transform="translate({xScale2(d["Snowfall Days"])},{yScale(d["Total Snowfall"])})">
                        <path d="M13.258 0.741699L26.258 23.2584H0.25801L13.258 0.741699Z" fill={colors(d.Location)} transform="scale({circleScale(d["Biggest Snowfall"])})" stroke-width="1" stroke="hsla(250, 10%, 12%, 0.6)" opacity={hoverLocation === d.Location ? 1 : hoverLocation ? 0.3 : 0.8}  stroke-linejoin="round"
                        on:mouseover={(e) => {
                            hoveredData = d
                            hoverLocation = d.Location
                            mousePosition(e)
                            }}
                        on:mousemove={(e) => {
                            mousePosition(e)
                        }}
                        />
                    </g>
                {/each}
            </g>
            </svg>
        </div>
    {/each}
{#if hoveredData} 
    <Tooltip {xPosition} {yPosition} {hoveredData} {circleScale}/>
{/if}
</div>

<style>
    .multiplierWrapper {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        grid-template-rows: auto;
        gap: 24px;
    }
    .chartWrapper,
    .ignoreBlending {
        isolation: isolate;
    }
    .seasonCircle {
        mix-blend-mode: color-burn;
    }
</style>
