<script>
    import * as d3 from "d3";
    import {snowflakes} from "./data/snowflakes.js";
    export let data;
    import Tooltip from "./Tooltip.svelte";
    let xAxisWrapper;
    let yAxisWrapper;
    let xPosition = 0;
    let yPosition = 0;
    let hoveredData = null;
    let hoverLocation = null;
    // $: chartWidth = 400;

    let selectElement;
    let selectE = true;

    $: console.log(snowflakes.flakeA)


let locations = Array.from(d3.group(data, d => d.Location))
let locationsArr = Array.from(new Set(data.map(d => d.Location)))
let seasons = Array.from(new Set(data.map(d => d.Season)))
let snowfallDays = Array.from(new Set(data.map(d => d["Snowfall Days"])))
let biggestSnowDays = Array.from(new Set(data.map(d => d["Biggest Snowfall"])))


// $: console.log(snowfallDays)

$: width = 400;
let height = 600;

let margins = {
    top: 5,
    right: 40,
    bottom: 40,
    left: 15,
}

$: innerWidth = width - margins.right - margins.left
$: innerHeight = height - margins.top - margins.bottom

$: minMax = d3.extent(data, d => +d["Total Snowfall"])
$: yScale = d3.scaleLinear()
    .domain(minMax)
    .range([innerHeight, 0])
    .nice()

$: xScale = d3.scaleBand()
    .domain(seasons)
    .range([margins.left, innerWidth - margins.right])

$: xScale2 = d3.scaleLinear()
    .domain(d3.extent(snowfallDays))
    .range([margins.left, innerWidth])
    .nice()

$: circleScale = d3.scaleSqrt()
    .domain(d3.extent(biggestSnowDays))
    .range([0.4, 1])
    .nice()


let lineGenerator = d3.line()
    .x(d => xScale(d["Season"]))
    .y(d => yScale(d["Total Snowfall"]))
    .curve(d3.curveStep)

let colors = d3.scaleOrdinal()
    .domain(locationsArr)
    .range(["var(--seymorColor)", "var(--grouseColor)", "var(--cypresColor)"])


    $: if (xAxisWrapper) {
        d3.select(xAxisWrapper).call(d3.axisBottom(xScale2))
        // d3.selectAll("#xAxis .tick text").attr("font-size", 12).attr("transform", "rotate(-45)").style("text-anchor", "start");

    }
    $: if (yAxisWrapper) {
        d3.select(yAxisWrapper).call(d3.axisLeft(yScale))
        }
    
    const mousePosition = (e) => {
        xPosition = e.offsetX;
        yPosition = e.offsetY;
    }

    const bringForward = () => {
        let slectedElement = d3.select(".hover")
        slectedElement.raise();
        // $: console.log(slectedElement);
    }
    function randomflakePosX() {
        return Math.random() * (20 - 1) + 1;
    }
    function randomflakePosY() {
        return Math.random() * (30 - 1) + 1;
    }
    function randomflake() {
        return math.floor(Math.random() * (30 - 0) + 0);
    }
</script>

<div class="chartWrapper" bind:clientWidth={width}>
    <svg {width} {height} on:mouseleave={() => {
        hoveredData = null;
        hoverLocation = null;
        }}>
    <filter id="blurMe">
        <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
      </filter>
    <g transform="translate({margins.left}, {margins.top})">

        <!-- <g id="xAxis" bind:this={xAxisWrapper} transform="translate(0, {innerHeight})"/>
        <g id="yAxis" bind:this={yAxisWrapper} transform="translate({margins.left}, 0)"/> -->
        {#each locations as location, i}
            {#each location[1] as d (d.Season) }
                <g transform="translate({xScale2(d["Snowfall Days"])},{yScale(d["Total Snowfall"])})"
                
                on:mouseover={(e) => {
                    hoveredData = d
                    hoverLocation = d.Location
                    mousePosition(e)
                    }}
                on:mousemove={(e) => {
                    mousePosition(e)
                }}
                >
                    <circle r={i+12} fill={!hoverLocation ? colors(d.Location) : hoverLocation === d.Location ? colors(d.Location) : "var(--textColorDark40)"} transform="scale({circleScale(d["Biggest Snowfall"])})" opacity={hoverLocation === d.Location ? 1 : hoverLocation ? 0.2 : 0.8}/>
                    
                    
                </g>
            {/each}
        {/each}
    </g>
    </svg>
    <!-- {#if hoveredData} 
        <Tooltip {xPosition} {yPosition} {hoveredData} {circleScale}/>
    {/if} -->
</div>

<style>
    .chartWrapper {
        position: relative;
        isolation: isolate;
        position: relative;
        z-index: 10;
    }
    .flakeA {
        mix-blend-mode: color-burn;
    }

</style>