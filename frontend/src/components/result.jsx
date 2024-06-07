import React from "react";





function Output({language,sourceCode}){
    const [otpt,setOtpt]=React.useState("");
    const [load,setLoad]=React.useState(false)
    const runCode=async ()=>{
        console.log(language,sourceCode)
        try {
            setLoad(true)
            const response = await fetch('http://localhost:8000/exec', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                language: language, // Adjust language as needed
                script: sourceCode,
              }),
            });
      
            if (!response.ok) {
              throw new Error(`API request failed with status ${response.status}`);
            }
      
            const data = await response.json();
            // console.log(data);
            setOtpt(data.output); // Update output state
            setLoad(false)
          } catch (error) {
            setLoad(false)
            console.error('Error:', error);
            alert("Something went wrong! Try Again.")
            setOtpt('An error occurred. Please check the code and try again.');
          }
    }
    return(
        <div>
        <button className=" bg-blue-700 rounded-lg px-4 py-2 my-4" onClick={runCode}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play"><polygon points="6 3 20 12 6 21 6 3"/></svg></button>
        {load && <p className="px-1 font-mono text-slate-500">Working on it<svg  className="inline-block h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="#AAFF39" stroke="#AAFF39" stroke-width="8" r="15" cx="40" cy="100"><animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#AAFF39" stroke="#AAFF39" stroke-width="8" r="15" cx="100" cy="100"><animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#AAFF39" stroke="#AAFF39" stroke-width="8" r="15" cx="160" cy="100"><animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg></p>}
        <textarea className=" bg-slate-800 h-80 w-full p-2 " placeholder="Click Run To Execute Code" value={otpt}></textarea>
        </div>
    )
}

export default Output