//TODO
// MapBox
//MapBox Pins
//BootStrap
//Pactials
//CSS
//TSS
//more info

import { useRef, useState, useEffect } from 'react';
import mapboxgl from '!mapbox-gl';
// mapboxgl.accessToken = 'pk.eyJ1Ijoid2lyZWRiYWxsIiwiYSI6ImNsaDB6dGtjajAyc2ozZHE0dXY2OGI3YW8ifQ._DCUbOU1anS9whzVryBXaQ'
import countryList from '../../data/countries'
console.log(process.env.MAP_KEY, "mapkey")


export default function currentEvents() {

    const [todayContent, setTodayContent] = useState('');
    const [yesterdayContent, setYesterdayContent] = useState('');
    const [content, setContent] = useState('');
    const [innerText, setInnerText] = useState([]);
    

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(0);
    const [lat, setLat] = useState(35);
    const [zoom, setZoom] = useState(1);
    

    // let date = new Date(8.64e15).toString();
    // console.log(date)

    useEffect(() => {
      
      window.handleResponse = (response) => {

        let data =  response.parse.text['*']

        const indexOfTodayStart = data.indexOf('<div class="current-events-content description">');
        const indexOfTodayEnd = data.indexOf('</div>', indexOfTodayStart);
        // console.log(indexOfTodayStart, indexOfTodayEnd)
        setTodayContent(data.slice(indexOfTodayStart, indexOfTodayEnd));

        const indexOfYesterdayStart = data.indexOf('<div class="current-events-content description">', indexOfTodayEnd);
        const indexOfYesterdayEnd = data.indexOf('</div>', indexOfYesterdayStart);
        // console.log(indexOfYesterdayStart, indexOfYesterdayEnd)
        setYesterdayContent(data.slice(indexOfYesterdayStart, indexOfYesterdayEnd));

        data = (`<h2 class='text-xl'>Today.</h2>`+data.slice(indexOfTodayStart, indexOfTodayEnd)+`<br></br>`+`<h2 class='text-xl'>Yesterday.</h2>`+data.slice(indexOfYesterdayStart, indexOfYesterdayEnd))
        data = data.replaceAll('<b>', '<b class="underline " >')
        data = data.replaceAll('<ul>', '<ul class="mx-8">')

        const ttsText = data.match(/(?<=>)\w+(?=<)/g) || []
        console.log(ttsText)
        console.log(countryList)
        let dataHold = []
        for(let A = 0; A < ttsText.length; A++){
          console.log(ttsText[A])
          if(countryList[ttsText[A]]){
            console.log(countryList[ttsText[A]].latitude)
            dataHold.push(
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [countryList[ttsText[A]].longitude, countryList[ttsText[A]].latitude]
                },
                properties: {
                  title: 'Event',
                  description: `Event at ${ttsText[A]}`
                }
              },
            )

          }
        }
        console.log(dataHold)
        const mapFun = async () => {
          mapboxgl.accessToken = await `pk.eyJ1Ijoid2lyZWRiYWxsIiwiYSI6ImNsaDB6dGtjajAyc2ozZHE0dXY2OGI3YW8ifQ._DCUbOU1anS9whzVryBXaQ`
          let geojson = {
            type: 'FeatureCollection',
            features: dataHold
          }
          console.log(geojson, process.env.MAP_KEY)
  
          if (map.current) return; // initialize map only once
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [lng, lat],
            zoom: zoom
          });
    
          for (const feature of geojson.features) {
            // create a HTML element for each feature
            const el = document.createElement('div');
            el.className = 'marker';
            
            // make a marker for each feature and add it to the map
            new mapboxgl.Marker({el})
            .setLngLat(feature.geometry.coordinates)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }) // add popups
              .setHTML(`<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`)
            )
            .addTo(map.current);
          };
          
        };
        mapFun()

        setInnerText(ttsText)

        setContent(data)

      };


  
      const url = "https://en.wikipedia.org/w/api.php?action=parse&page=Portal:Current_events&format=json&callback=handleResponse";
      const script = document.createElement("script");
      script.src = url;
      document.body.appendChild(script);


      return () => {


      };
    }, []);


    


    return ( <>
        <div className='antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 dark:bg-gradient-to-tr from-slate-900 from-50% via-slate-800 via-80% to-slate-900 to-90% h-[100vh]'>

          

          <div className='py-3 border-b border-slate-900/10 lg:px-8 lg:border-1 dark:border-slate-300/10 mx-4 lg:mx-0 mb-3'>
            <div className='relative flex items-center'>
              <div className='mx-auto text-base font-bold tracking-wider uppercase border-2 p-1 border-slate-400'>Current Events</div> 
            </div>
          </div>

          <div className='mx-auto max-w-7xl'>
            
            <div ref={mapContainer}  className="map-container h-[40vh] " />
            {/* <Map
            initialViewState={{
              longitude: 0,
              latitude: 35,
              zoom: 1
            }}
            style={{height: 550}}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            /> */}

            {/* <div className='bg-white shadow-xl p-8 text-slate-700 text-sm leading-6 sm:text-base sm:leading-7 dark:bg-slate-800 dark:text-slate-400 rounded-xl mt-3'>
              <h2 className='text-xl'>Today</h2>
              <div dangerouslySetInnerHTML={{__html: todayContent}}></div>
            </div>
            <br></br>
            <div className='bg-white shadow-xl p-8 text-slate-700 text-sm leading-6 sm:text-base sm:leading-7 dark:bg-slate-800 dark:text-slate-400 rounded-xl'>
              <h2 className='text-xl'>Yesterday</h2>
              <div dangerouslySetInnerHTML={{__html: yesterdayContent}}></div>
            </div> */}
            <div id='article-container' className='bg-white shadow-xl p-8 text-slate-700 text-sm leading-6 sm:text-base sm:leading-7 dark:bg-slate-800 dark:text-slate-400 rounded-xl mt-3 max-h-[50vh] overflow-auto'>
              <article>
              <div id='article' dangerouslySetInnerHTML={{__html: content}}></div>
              </article>
            </div>
          </div>

      </div>
      <div id="speechify-root"></div>
    </> );
}