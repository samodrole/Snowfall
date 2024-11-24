<script>
// import { Map, Marker } from '@beyonk/svelte-mapbox'
import { onMount } from 'svelte';
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles.css'
  let mapComponent;
  let mapWrapper;
  let el;
  mapboxgl.accessToken = 'pk.eyJ1Ijoic2Ftb2Ryb2xlIiwiYSI6ImNqaHRrZmgyNDBlcWkzcGp4c3liaGx5dzUifQ.VUsN4GVmW1LW3gsPpiAGfA';

  
const geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-122.948148, 49.365995]
      },
      properties: {
        title: 'Mt Seymour',
        description: '1,449 m / 4,754 ft',
        image: 'http://samodrole.com/projects/snowfall/Mt_Seymour_night.avif' // Add image URL
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-123.076243, 49.386132]
      },
      properties: {
        title: 'Grouse Mountain',
        description: '1,231 m / 4,039 ft',
        image: 'http://samodrole.com/projects/snowfall/Grouse_Mountain_night.avif' // Add image URL
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-123.204253, 49.396360]
      },
      properties: {
        title: 'Cypress Mountain',
        description: '1,440 m / 4,724 ft',
        image: 'http://samodrole.com/projects/snowfall/Cypress_Mountain_night.avif' // Add image URL
      }
    }
  ]
};


onMount( () => {
    const map = new mapboxgl.Map({
      container: mapWrapper, // Specify the container ID
      style: "mapbox://styles/samodrole/clntudu5c00x701rdhlip8xdc",
      center:[-123.08292,49.37000], // Specify the starting position [lng, lat]
      zoom: 11.0,
      // pitch: 25,
    });
    map.scrollZoom.disable();

    // Create a full-screen overlay for the image
    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';
    overlay.style.display = 'none'; // Initially hidden
    document.body.appendChild(overlay);

    const overlayImage = document.createElement('img');
    overlay.appendChild(overlayImage);

    overlay.addEventListener('click', () => {
      overlay.style.display = 'none'; // Hide overlay on click
    });

    // add markers to map
    for (const feature of geojson.features) {
      // Create a custom HTML element for the marker
      const el = document.createElement('div');
      el.className = 'marker';
      el.innerHTML = `<div class="marker-title">${feature.properties.title}</div><div class="marker-description">${feature.properties.description}</div>`;

      // Create an image element for the hover effect
      const imageEl = document.createElement('img');
      imageEl.src = feature.properties.image; // Use the image property from the feature
      imageEl.className = 'marker-image'; // Add a class for styling
      imageEl.style.display = 'none'; // Initially hidden

      // Append the image to the marker element
      el.appendChild(imageEl);

      // Show image on hover
      el.addEventListener('mouseover', () => {
        imageEl.style.display = 'block';
      });

      // Hide image when not hovering
      el.addEventListener('mouseout', () => {
        imageEl.style.display = 'none';
      });

      // Open image in full screen on click
      imageEl.addEventListener('click', () => {
        overlayImage.src = feature.properties.image; // Set the overlay image source
        overlay.style.display = 'flex'; // Show the overlay
      });

      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat(feature.geometry.coordinates)
        .addTo(map);
    }

    // Add a marker for Vancouver
    const vancouverMarker = document.createElement('div');
    vancouverMarker.className = 'marker';
    vancouverMarker.innerHTML = `<div class="marker-city">Vancouver</div>`;

    new mapboxgl.Marker(vancouverMarker)
      .setLngLat([-123.1216, 49.2727]) // Vancouver coordinates
      .addTo(map);
})


</script>

<div id='map' bind:this={mapWrapper}></div>

<style>
    #map {
        height: 860px;
        grid-column: 1 / -1;
        z-index: 0;
        margin: 0 0 24px 0;
    }
    @media (max-width: 600px) {
        #map {
            height: 400px;
        }
    }
    /* :global(.marker) {
        background-image: url("../lib/images/peak-x.svg");
        background-size: cover;
        width: 16px;
        height: 16px;
        cursor: pointer;
    } */
    :global(.marker-title) {
      background-color: hsla(0, 0%, 100%, .7);
        padding: 2px 4px;
        border-radius: 3px;
        font-size: 14px; /* Slightly larger */
        font-weight: bold; /* Make title bold */
        text-align: center;
        position: absolute;
        top: -55px;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
    }
    :global(.marker-image) {
      background-color: hsla(0, 0%, 100%, 1);
      padding: 4px;
      border-radius: 3px;
      position: absolute;
      top: -162px;
      left: 50%;
      transform: translateX(-50%);
      width: 200px;
      height: 100px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Add drop shadow */
      cursor: pointer;
    }
    :global(.marker-description) {
        background-color: hsla(0, 0%, 100%, .75);
        padding: 2px 4px;
        border-radius: 3px;
        font-size: 12px;
        text-align: center;
        position: absolute;
        top: -75px; /* Adjust position to not overlap with title */
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        display: block; /* Ensure it is always visible */
    }
    :global(.marker-city) {
        font-size: 14px; /* Slightly larger */
        font-weight: regular; /* Make title bold */
        text-align: center;
        position: absolute;
        top: -55px;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
    }
    :global(.image-overlay) {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8); /* Semi-transparent background */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000; /* Ensure it is on top */
    }
    :global(.image-overlay img) {
        max-width: 90%;
        max-height: 90%;
    }
</style>

