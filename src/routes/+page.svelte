<script>
    import data from "./data/snowLevel.json";
    import Map from "./Map.svelte";
    import BarChart from './BarChart.svelte';
    import BarChartSmall from './BarChartSmall.svelte';
    import LineChart from "./LineChart.svelte";
    import ButtonSet from './ButtonSet.svelte';
    import './styles.css'
    import * as d3 from "d3";
    import Resort from "./Resort.svelte";
    let avgSnofall = 0;
    let radioValue = "Cypress_Mountain";
    let hoverSeason = null;


    let locations = Array.from(d3.group(data, d => d.Location))

    const options = [{
		value: 'Cypress_Mountain',
		label: 'Cypress Mountain',
	}, {
		value: 'Grouse_Mountain',
		label: 'Grouse Mountain',
	}, {
		value: 'Mt_Seymour',
		label: 'Mt Seymour',
	}]

    $: filterSelector = radioValue;

    function seasonSelectedHover(e) {
        hoverSeason = e.detail  
        // console.log(e)     
	}


</script>

<div class="mainWrapper">
    <main>
        <div class="fog"></div>
        <header class="contentNarrowTitle">
            <h1>
                Where Snow Meets the Sea
            </h1>
            <h2 class="subtitle">
                A Decade of Snowfall Trends in Vancouver’s North Shore Mountains
            </h2>
        </header>
        <div class="contentNarrow">
            <div class="miniSection">
                <p>The North Shore Mountains of British Columbia, Canada, stand as a breathtaking backdrop to Vancouver, drawing ski and snowboard enthusiasts from across the globe. Just minutes from the city, these rugged, snow-capped peaks provide a stunning winter haven, where the crisp mountain air, sweeping vistas, and forested slopes create a natural playground for adventurers of all ages.</p>

                <p>Three iconic ski resorts — <a href="https://www.grousemountain.com/" target="_blank">Grouse Mountain</a>, <a href="https://www.cypressmountain.com/" target="_blank">Cypress Mountain</a>, and <a href="https://mtseymour.ca/" target="_blank">Mount Seymour</a> — await within this alpine landscape, each with its own unique appeal and character. Grouse Mountain, often called the “Peak of Vancouver,” is celebrated for its panoramic city views, family-friendly trails, and memorable winter activities like outdoor ice skating and snowshoeing. Mount Seymour, beloved by locals, offers a more intimate mountain experience, with deep snow and a laid-back charm perfect for families and beginners.</p>
                <p>Cypress Mountain, the largest of the three, gained international acclaim during the 2010 Winter Olympics, where it hosted thrilling freestyle skiing and snowboarding events, forever solidifying its place among premier winter destinations. Today, Cypress draws thrill-seekers to its diverse range of challenging runs, pristine backcountry, and Olympic-caliber terrain parks.</p>
                <p>Together, these three resorts make Vancouver’s North Shore Mountains a premier winter sports destination, offering a unique blend of accessible wilderness, awe-inspiring scenery, and some of Canada’s finest slopes — all within reach of one of the country’s most vibrant cities.</p>
            </div>
        </div>


        <div class="mapWrapper">
            <Map/>
        </div>

        <div class="contentNarrow">
            <div class="miniSection">
                <p>Over the last decade, snow levels in the North Shore Mountains have varied significantly, greatly impacting everything from the duration of the operational season to the quality of the ski slopes.</p>

            <div class="totalChart">
                <ButtonSet {options} legend='Select a resort to view total snowfall across seasons.' bind:userSelected={radioValue}/>
                <LineChart {data} xAxisDisplay={"yes"}  filterBy={filterSelector} {hoverSeason} on:seasonSelectedHover={seasonSelectedHover}/>
            </div>

                <p>Some winters have turned the resorts into snowy paradises with deep powder, extending the ski season well into spring. In contrast, other years have experienced much lighter snowfall, such as the 2014–15 season, which recorded the lowest snowfall of the past decade.</p>
            </div>

            <div class="miniSection">
                <h3>Cypress Mountain</h3>
                <p>With its sprawling terrain and breathtaking views of Vancouver and the Pacific Ocean, has hosted numerous international competitions, including the 2010 Winter Olympics. Its history dates back to the early 1960s, when a modest ski area evolved into a world-class resort celebrated for its diverse trails, terrain parks, and night skiing.</p>
                <BarChartSmall {data} filterBy={"Cypress_Mountain"} yAxisDisplay={"No"} xAxisDisplay={"yes"}  displayDays={"yes"} maxDaysSelcted={"Yes"}/>
                <p>A closer look at its snowfall history reveals fascinating contrasts: the 2022/23 season boasted an impressive<b> 83 snowfall days</b>, the highest on record, while the 2014/15 season had only <b>15 snowfall days</b>, highlighting the mountain's climatic variability.</p>
            </div>
            <div class="miniSection">
                <h3>Grouse Mountain</h3>
                <p>Named after the native raptors that inhabit the area, has a rich history dating back to the early 1920s. It stands as a symbol of resilience and innovation, offering much more than skiing—visitors can enjoy ice skating, snowshoeing, and the thrilling Skyride gondola.</p>
                <BarChartSmall {data} filterBy={"Grouse_Mountain"} yAxisDisplay={"No"} displayDays={"yes"} maxDaysSelcted={"Yes"}/>
                <p>The mountain's snowfall history underscores its dynamic nature: the 2022/23 season recorded an impressive <b>93 snowfall days</b>, the highest on record, while the 2014/15 season had only <b>30 snowfall days</b>, a stark reminder of seasonal variability.</p>
            </div>

            <div class="miniSection">
                <h3>Mount Seymour</h3>
                <p>Nestled in the heart of the North Shore Mountains, is a cherished destination for locals and tourists alike. With roots dating back to the 1930s, this family-friendly resort offers a range of winter activities, including skiing, snowboarding, and tubing. Unlike its counterparts Grouse Mountain and Cypress Mountain, Mount Seymour does not rely on artificial snow machines due to its location within a protected national park. Thanks to its proximity to the Pacific, the resort typically enjoys abundant natural snowfall, but this also makes it entirely dependent on nature.</p>
                <BarChartSmall {data} filterBy={"Mt_Seymour"} yAxisDisplay={"No"} displayDays={"yes"} maxDaysSelcted={"Yes"}/>
                <p>The variability of snowfall is evident in its history: the 2022/23 season boasted <b>85 snowfall days</b>, a stark contrast to the mere <b>10 snowfall days</b> during the 2014/15 season. Despite these fluctuations, Mount Seymour's laid-back atmosphere and accessible slopes continue to make it a favorite for both beginners and seasoned snow enthusiasts.</p>
            </div>

            <div class="miniSection">
                <p><a href="https://www.grousemountain.com/" target="_blank">Grouse Mountain</a>, <a href="https://www.cypressmountain.com/" target="_blank">Cypress Mountain</a>, and <a href="https://mtseymour.ca/" target="_blank">Mount Seymour</a>—each with its own unique charm and snowfall story. Grouse Mountain set a record with <b>93 snowfall days</b> in 2022/23, while Mount Seymour, nestled in a national park, relies entirely on natural snowfall, highlighting both its scenic allure and its challenges in low-snow seasons like 2014/15, with just <b>10 snowfall days</b>.</p>
                <p>Dive into the charts below to explore total snowfall across all three resorts from the winter seasons of 2012 to 2024 and uncover trends that define their winter landscapes.</p>
            </div>

        </div>
            
        <div class="resortsSection">
            {#each locations as location}
                <Resort location={location[0]} {data}/>
            {/each}
        </div>
        <footer>
            <div class="footerNarrow">
                <p>Created by <a href="http://samodrole.com/" target="_blank"> Samo Drole</a> in Lovelly, British Columbia, Canada 🇨🇦, while I eagerly (and with a touch of impatience) anticipate the snow's arrival to start the ski season!</p>
                <div>
                    <p>Data source: <a href="https://www.onthesnow.com/" target="_blank">On the snow</a></p>
                </div>
            </div>
           
        </footer>
    </main>

</div>


<style>
    .mainWrapper {
        position: relative;
        padding-top: 50vh;
    }
    .fog {
        position: absolute;
        height: 300px;
        top: -250px;
        left: 0;
        right: 0;
        background-image: url("$lib/images/fog.png");
        background-size:contain;                
        background-repeat: repeat-x;
        background-position: bottom center;
        z-index: 0;
        background-color: none;
    }
    .totalChart {
        padding: 16px 0;
    }
    main {
        background-color: white;
        position: relative;
        margin-top: clamp(100px, 15vh, 250px); 

    }
    .miniSection #lineChart {
        border-bottom: none;
        z-index: 100;
    }
    .miniSection .chartMainWrapper {
        margin: 16px 0 24px;
    }
    .contentNarrow {
        display: grid;
        position: relative;
        grid-template-columns: 2fr 1fr;
        max-width: var(--maxWidth);
        margin: 0 auto;
        padding: 0 24px 24px;
        grid-column-gap: var(--gridGap);
        z-index: 20;
    }
    .contentNarrow.top {
        padding-bottom: 24px;
    }

    .contentNarrow > * {
        grid-column: 1 / 2;
    }
    .resortsSection {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 42px;
        max-width: var(--maxWidthCharts);
        margin: 0 auto;
        padding: 100px 24px 120px;
    }
    .contentNarrowTitle {
        max-width: var(--maxWidth);
        margin: 0 auto;
        padding: 0 24px 60px;
        /* text-align: center; */
    }
    header {
        padding-top: clamp(5rem, 45vw, 80vh);
        margin-bottom: clamp(5rem, 8vw, 12vh);
        z-index: 10;
        position: relative;
    }
    h1 {
        margin: 0;
    }
    h2 {
        margin: 0%;
        padding: 0;
    }
    .miniSection {
        margin-bottom: 40px;
    }
    .subtitle {
        font-weight: 400;
    }
    .mapWrapper {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
        position: relative;
        margin-bottom: 24px;
    }
    .mapWrapper::before, .mapWrapper::after {
        content: "";
        position:absolute;
        z-index: 10;
        left: 0;
        right: 0;
        height: 30px;
        background-image: url("$lib/images/halfBlueTop.png");
        background-size: contain;               
        background-repeat: repeat-x;
    }
    .mapWrapper::before {
      top: -30px;
    }
    .mapWrapper::after {
        bottom: -6px;
        transform: rotate(-180deg);

    }
    .mapWrapper {
        grid-column: 1 / -1;
        z-index: 0;
        position: relative;
    }
    .chartMainWrapper {
        margin-top: -500px;
        margin-bottom: 20px;
    }
    footer {
        position: relative;
        padding: 32px 0 80px;
        background-image: url("$lib/images/bgImage.avif");
        background-size: auto;               
        background-repeat: no-repeat;
        background-position: center -100px;
    }
    footer::before, footer::after {
        content: "";
        position:absolute;
        left: 0;
        right: 0;
        z-index: 1;
    }
    footer::before {
      top: -30px;
      height: 30px;
    background-image: url("$lib/images/halfGrayTop.png");
    background-size: contain;               
    background-repeat: repeat-x;
    }
    footer::after {
        bottom: 0px;
        top: 0px;
        background-color: hsla(0, 100%, 100%, 0.4);

    }
    .footerNarrow {
        display: grid;
        grid-template-columns: 1fr 3fr 1fr;
        grid-template-rows: 2fr 1fr;
        position: relative;
        gap: 16px;
        max-width: var(--maxWidth);
        margin: 0 auto;
        padding: 0 24px;
        z-index: 20;
    }
    .footerNarrow div {
        grid-column: 2 / 3;
        display: flex;
        flex-direction: row;
        gap: 16px;
    }
    .footerNarrow p {
        font-size: 1.2rem;
        font-weight: 500;
        color: var(--textColorDark60);
        grid-column: 2 / 3;
        grid-row: 1 / -1;
        height: auto;
        margin: 0;
    }
    .footerNarrow p a {
        color: var(--textColorDark60);
        text-decoration: none;
    }
    .footerNarrow p a:hover {
        color: var(--textColorDark80);
        text-decoration: underline;
    }


    @media (max-width: 900px) {
        .resortsSection {
            padding: 0 24px 48px;
        }
        .footerNarrow p, .footerNarrow div {
            grid-column: 1 / -1;
        }
        footer {
            padding: 32px 0 32px;
        }
        .contentNarrowTitle {
            max-width: var(--maxWidth);
            margin: 0 auto;
            padding: 0 24px 60px;
            /* text-align: left; */
        }
        .contentNarrow > * {
            grid-column: 1 / -1;
        }
        .mainWrapper {
        padding-top: 32vh;
    }
    }
    @media (max-width: 600px) {

        .contentNarrow > * {
            grid-column: 1 / -1;
        }
        .mainWrapper {
            padding-top: 25vh;
        }
        .subtitle {
            font-weight: 400;
            font-size: 2.4rem;
        }
        .contentNarrowTitle {
            padding: 0 24px 20px;
        }
    }
</style>