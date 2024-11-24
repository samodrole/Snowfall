<script>
    import './styles.css'
    import * as d3 from "d3";
    import LineChart from './LineChart.svelte';
    import BarChart from './BarChart.svelte';
    export let location;
    // import {Mt1} from "$lib/images/Mt Seymour.png";
    export let data;
    let avgSnowfallDays = 0;
    let avgSnofall = 0;
    let hoverSeason = null;

    let mountainInfo =  {
        "Cypress_Mountain": "4,724 ft / 1,440 m",
        "Grouse_Mountain": "4,039 ft / 1,231 m",
        "Mt_Seymour": "4,754 ft / 1,449 m",        
    }

    let filteredData = data.filter(d => d.Location === location)

    $: avgSnofall = d3.mean(filteredData.map(el => {
        return el["Total Snowfall"]
    })).toFixed(0);

    $: avgSnowfallDays = d3.mean(filteredData.map(el => {
        return el["Snowfall Days"]
    })).toFixed(0);

    function seasonSelectedHover(e) {
        hoverSeason = e.detail  
        // console.log(e)     
	}
    function seasonSelectedHoverBar(e) {
        hoverSeason = e.detail  
        // console.log(e)     
	}

    function getImageUrl(location) {
        const normalizedLocation = location.replace(/ /g, '_');
        const imageUrl = `/src/lib/images/${normalizedLocation}.png`;
        return imageUrl;
    }

</script>



<div class="resort">
    <div class="resortinfo">
        <div class="infoHeader">
            <!-- <img src={getImageUrl(location)} on:error="{() => this.src='/src/lib/images/default.png'}" alt="{location} image" /> -->
            <h2>{location.replace(/_/g, ' ')}</h2>
            <span>{mountainInfo[location]}</span>
        </div>
        <div>
            <h3>{avgSnofall}″</h3>
            <span>Avg. total snowfall</span>
        </div>
        <div>
            <h3>{avgSnowfallDays}</h3>
            <span>Avg. snowfall days</span>
        </div>
    </div>
    <LineChart class="line-chart" {data} filterBy={location} {avgSnofall} {hoverSeason} on:seasonSelectedHover={seasonSelectedHover}/>
    <BarChart class="bar-chart" {data} filterBy={location} {avgSnofall} {hoverSeason} on:seasonSelectedHoverBar={seasonSelectedHoverBar}/>
</div>


<style>
    .resort {
        display: grid;
       grid-template-columns: 200px 1fr;
       grid-template-rows: auto;
       /* grid-row: auto; */
       grid-column-gap: 0px;
        grid-row-gap: 0px;
    }
    .resortinfo {
        display: flex;
        flex-direction: column;
        gap: 16px;
        grid-area: 1 / 1 / 3 / 2;
    }
    .line-chart {
        grid-area: 1 / 2 / 2 / 3;
    }
    .bar-chart {
        grid-area: 2 / 2 / 3 / 3;
}

    img {
        max-width: 80px;
    }
    h2 {
        font-size: 2rem;
        margin: 0;
        font-weight: 700;
    }
    h3 {
        font-size: 1.6rem;
        margin: 0;
        font-weight: 700;
    }
    span {
        font-size: 1.2rem;
        font-weight: 500;
    }
    @media screen and (min-width: 200px) and (max-width: 700px) {
        .resortinfo {
            grid-column: 1 / -1;
            grid-row: 1 / 1;
            margin-bottom: 24px;
        }
        .resort {
            grid-template-columns: 1fr;
            gap: 8px;
        }
        .resortinfo {
            display: grid;
            grid-auto-rows: auto;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            align-items: start;

        }
        .resortinfo .infoHeader {
            grid-area: 1 / 1 / 2 / 3;
            height: auto;
        }
    }

</style>