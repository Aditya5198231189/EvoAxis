const TOTAL_MACHINES = 309;

const AVAILABLE_HOURS = 24 * TOTAL_MACHINES;

let mttrChart = null;

let mtbfChart = null;

let severityChart = null;

document.addEventListener("DOMContentLoaded",()=>{

    loadAnalytics();

});

async function loadAnalytics(){

    try{

        const response = await fetch(API_URL);

        const result = await response.json();

        if(!result.success){

            alert(result.message);

            return;

        }

        const monthlyData = calculateMonthlyAnalytics(result.data);

        drawMTTRChart(monthlyData);

        drawMTBFChart(monthlyData);

        drawSeverityChart(monthlyData);

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}

function calculateMonthlyAnalytics(records){

    const grouped={};

    records.forEach(record=>{

        if(!record.startDate) return;

        const date=new Date(record.startDate);

        const key=`${date.getFullYear()}-${date.getMonth()}`;

        if(!grouped[key]){

            grouped[key]={

                label:date.toLocaleString("default",{

                    month:"short",

                    year:"numeric"

                }),

                downtime:0,

                breakdowns:0

            };

        }

        grouped[key].downtime+=

            downtimeToHours(record.downtime);

        grouped[key].breakdowns++;

    });

    const analytics=[];

    Object.values(grouped).forEach(item=>{

        const mttr=

            item.breakdowns

            ? item.downtime/item.breakdowns

            :0;

        const mtbf=

            item.breakdowns

            ? (AVAILABLE_HOURS-item.downtime)

            /item.breakdowns

            :0;

        const severity=

            (item.downtime/

            AVAILABLE_HOURS)

            *100;

        analytics.push({

            month:item.label,

            mttr:+mttr.toFixed(2),

            mtbf:+mtbf.toFixed(2),

            severity:+severity.toFixed(2)

        });

    });

    analytics.sort((a,b)=>

        new Date(a.month)-new Date(b.month)

    );

    return analytics;

}

function downtimeToHours(text){

    if(!text) return 0;

    let hours=0;

    const day=text.match(/(\d+)\s*Day/i);

    const hour=text.match(/(\d+)\s*Hour/i);

    const minute=text.match(/(\d+)\s*Minute/i);

    if(day)

        hours+=Number(day[1])*24;

    if(hour)

        hours+=Number(hour[1]);

    if(minute)

        hours+=Number(minute[1])/60;

    return hours;

}

function drawMTTRChart(data){
        if(mttrChart){

        mttrChart.destroy();

    }

    const ctx=document
        .getElementById("mttrChart")
        .getContext("2d");

    mttrChart=new Chart(ctx,{

        type:"bar",

        data:{

            labels:data.map(item=>item.month),

            datasets:[{

                label:"MTTR (Hours)",

                data:data.map(item=>item.mttr),

                backgroundColor:"#22C55E",

                borderColor:"#16A34A",

                borderWidth:1,

                borderRadius:8,

                barPercentage:.65,

                categoryPercentage:.7

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            animation:{

                duration:1500,

                easing:"easeOutQuart"

            },

            plugins:{

                legend:{

                    display:false

                }

            },

            scales:{

                y:{

                    beginAtZero:true,

                    title:{

                        display:true,

                        text:"Hours"

                    }

                }

            }

        }

    });

}

function drawMTBFChart(data){

    if(mtbfChart){

        mtbfChart.destroy();

    }

    const ctx=document
        .getElementById("mtbfChart")
        .getContext("2d");

    mtbfChart=new Chart(ctx,{

        type:"bar",

        data:{

            labels:data.map(item=>item.month),

            datasets:[{

                label:"MTBF (Hours)",

                data:data.map(item=>item.mtbf),

                backgroundColor:"#2563EB",

                borderColor:"#1D4ED8",

                borderWidth:1,

                borderRadius:8,

                barPercentage:.65,

                categoryPercentage:.7

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            animation:{

                duration:1500,

                easing:"easeOutQuart"

            },

            plugins:{

                legend:{

                    display:false

                }

            },

            scales:{

                y:{

                    beginAtZero:true,

                    title:{

                        display:true,

                        text:"Hours"

                    }

                }

            }

        }

    });

}

function drawSeverityChart(data){
        if(severityChart){

        severityChart.destroy();

    }

    const ctx=document
        .getElementById("severityChart")
        .getContext("2d");

    severityChart=new Chart(ctx,{

        type:"bar",

        data:{

            labels:data.map(item=>item.month),

            datasets:[{

                label:"Failure Severity (%)",

                data:data.map(item=>item.severity),

                backgroundColor:"#F97316",

                borderColor:"#EA580C",

                borderWidth:1,

                borderRadius:8,

                barPercentage:.65,

                categoryPercentage:.7

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            animation:{

                duration:1500,

                easing:"easeOutQuart"

            },

            plugins:{

                legend:{

                    display:false

                },

                tooltip:{

                    callbacks:{

                        label:function(context){

                            return context.raw+" %";

                        }

                    }

                }

            },

            scales:{

                y:{

                    beginAtZero:true,

                    title:{

                        display:true,

                        text:"Percentage (%)"

                    },

                    ticks:{

                        callback:function(value){

                            return value+" %";

                        }

                    }

                }

            }

        }

    });

}

window.addEventListener("focus",()=>{

    loadAnalytics();

});

document.addEventListener("visibilitychange",()=>{

    if(!document.hidden){

        loadAnalytics();

    }

});