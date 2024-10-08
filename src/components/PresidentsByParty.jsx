import { getPresidents } from '../services/getRequests';
import { useEffect, useState } from 'react';
import '../styles/AccordionTitle.css';
import { AccordionTitle } from './AccordionTitle';

function PresidentsByParty() {
   const [sortedData, setSortedData] = useState([]);
   const [initialData, setInitialData] = useState([]);
   const [expanded, setExpanded] = useState(null);
   const [measuredTime, setMeasuredTime] = useState(0);

   useEffect(() => {
      getAllPresidents();
   }, []);

   const getAllPresidents = async () => {
      try {
         const start = new Date();
         console.log(start);

         const response = await getPresidents();

         const end = new Date();
         const time = (end - start) / 1000;
         console.log(time);
         setMeasuredTime(time);

         displayData(response);
         setInitialData(response);
      } catch (error) {
         console.error('Error fetching presidents:', error);
      }
   };

   const groupByParty = (data) => {
      return data.reduce((acc, president) => {
         const party = president.politicalParty.toLowerCase();
         if (!acc[party]) {
            acc[party] = [];
         }
         acc[party].push(president);
         return acc;
      }, {});
   };

   const countByParty = (data) => {
      console.log(data);
      return Object.keys(data).reduce((acc, party) => {
         acc[party] = data[party].length;
         return acc;
      }, {});
   };

   const sortByCount = (groupedData, countedData) => {
      console.log(groupedData);
      console.log(countedData);
      return Object.keys(groupedData)
         .map((party) => ({
            party,
            count: countedData[party],
            presidents: groupedData[party],
         }))
         .sort((a, b) => b.count - a.count);
   };

   const displayData = (data) => {
      const grouping = groupByParty(data);
      const counting = countByParty(grouping);
      const sorting = sortByCount(grouping, counting);
      setSortedData(sorting);
   };

   const toggleAccordion = (party) => {
      setExpanded(expanded === party ? null : party);
   };

   return (
      <>
         <div className="main-title">
            <h2>Presidents by Political Party {`(${initialData.length})`} </h2>
            <p>{measuredTime} sec</p>
         </div>
         {sortedData.length > 0 ? (
            sortedData.map((item) => (
               <div key={item.party}>
                  <AccordionTitle
                     onClick={() => toggleAccordion(item.party)}
                     style={{
                        borderRadius: expanded === item.party ? '' : '.3rem',
                     }}
                     expanded={expanded === item.party}
                  >
                     <h3 className="capitalized">
                        {item.party}
                        {` (${item.count})`}
                     </h3>
                  </AccordionTitle>
                  <ul
                     className="accordion-content"
                     style={{
                        display: expanded === item.party ? 'block' : 'none',
                     }}
                  >
                     {item.presidents.map((president) => (
                        <li key={president.id}>
                           {president.name} {president.lastName}
                        </li>
                     ))}
                  </ul>
               </div>
            ))
         ) : (
            <p>Loading...</p>
         )}
      </>
   );
}

export { PresidentsByParty };
