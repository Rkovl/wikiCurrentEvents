//TODO
//MapBox Pins TextBox
//Pactials
//more info

import { useRef, useState, useEffect } from 'react';
import mapboxgl from '!mapbox-gl';
import countryList from '../../data/countries'


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
        console.log(data, "data")
        const ttsText = data.replaceAll(/<(.*?)>/g, '')
        console.log(ttsText)

        const possiblePins = data.match(/(?<=>)\w+(?=<)/g) || []
        console.log(possiblePins, "possiblePins")
        console.log(countryList)
        let dataHold = []
        for(let A = 0; A < possiblePins.length; A++){
          console.log(possiblePins[A])
          if(countryList[possiblePins[A]]){
            console.log(countryList[possiblePins[A]].latitude)
            dataHold.push(
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [countryList[possiblePins[A]].longitude, countryList[possiblePins[A]].latitude]
                },
                properties: {
                  title: 'Event',
                  description: `Event at ${possiblePins[A]}`
                }
              },
            )

          }
        }
        console.log(dataHold)
        const mapFun = async () => {
          mapboxgl.accessToken = await process.env.NEXT_PUBLIC_MAPBOX_TOKEN
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

        setInnerText(possiblePins)

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
              <div class="px-4 py-2 invisible">.</div>
              <div className='mx-auto text-base font-bold tracking-wider uppercase border-2 p-1 border-slate-400'>Current Events</div> 
              <button class="px-4 py-2 font-semibold text-lg bg-cyan-500 text-white rounded-full shadow-sm z-10">{`>`}</button>
            </div>
          </div>

          <div className='mx-auto max-w-7xl'>
            
            <div ref={mapContainer}  className="map-container h-[40vh] " />

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
    </> );
}