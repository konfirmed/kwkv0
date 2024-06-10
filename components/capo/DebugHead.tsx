import React, { useState, useEffect } from "react";
   import { DebugHeaderItem } from "./DebugHeaderItem";

   // Define DebugHeadProps directly in this file
   interface DebugHeadProps {
     url: string;
     isValidUrl: boolean;
     setLoading: (loading: boolean) => void;
     shouldAnalyze: boolean;
     setShouldAnalyze: (analyze: boolean) => void;
   }

   interface ElementAttribute {
     name: string;
     value: string;
   }

   interface HeadElement {
     tagName: string;
     attributes: ElementAttribute[];
   }

   const DebugHead: React.FC<DebugHeadProps> = ({
     url,
     isValidUrl,
     setLoading,
     shouldAnalyze,
     setShouldAnalyze,
   }) => {
     const [originalElements, setOriginalElements] = useState<HeadElement[]>([]);
     const [headElements, setHeadElements] = useState<HeadElement[]>([]);

     useEffect(() => {
       const analyzeHead = async () => {
         if (!isValidUrl || !url || !shouldAnalyze) return;

         setLoading(true);
         try {
           const response = await fetch("/api/analyze-head", {
             method: "POST",
             headers: {
               "Content-Type": "application/json",
             },
             body: JSON.stringify({ url }),
           });

           if (!response.ok) {
             throw new Error(`HTTP error! status: ${response.status}`);
           }

           const data = await response.json();
           setOriginalElements(data.originalElements);
           setHeadElements(data.sortedElements);
         } catch (error) {
           console.error("Error during analysis:", error);
           setOriginalElements([]);
           setHeadElements([]);
         }
         setLoading(false);
         setShouldAnalyze(false); // Important to reset shouldAnalyze to prevent re-analysis on every render.
       };

       analyzeHead();
     }, [shouldAnalyze]); // Only re-run the effect if shouldAnalyze changes.

     return (
       <div className="debug-container" style={{ display: 'flex' }}>
         <section className="debug-wrapper col-6">
           <DebugHeaderItem
             title="Original Head Elements"
             headers={originalElements}
           />
         </section>
         <section className="debug-wrapper col-6">
           <DebugHeaderItem
             title="Sorted Head Elements"
             headers={headElements}
           />
         </section>
       </div>
     );
   };

   export default DebugHead;