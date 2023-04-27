import Link from 'next/link';
import { useState, useEffect } from 'react';


export default function currentEvents() {
    const [content, setContent] = useState('');

    useEffect(() => {
      // Define handleResponse function inside component
      window.handleResponse = (response) => {
        let indexOfContent = response.parse.text['*'].indexOf('<div class="current-events-content description">')
        console.log(indexOfContent)
        setContent(response.parse.text['*'].slice(indexOfContent));
      };
  
      const url = "https://en.wikipedia.org/w/api.php?action=parse&page=Portal:Current_events&format=json&callback=handleResponse";
      const script = document.createElement("script");
      script.src = url;
      document.body.appendChild(script);
  
      return () => {
        document.body.removeChild(script);
        // Remove handleResponse function from global scope
        delete window.handleResponse;
      };
    }, []);
  
    return (
      <div dangerouslySetInnerHTML={{__html: content}}></div>
    );
}