let checkIntervalId = 0;
let table = null;
let canvas = null;
//let ctx = new CanvasRenderingContext2D();
let ctx = null;

let rectClicks = [];

class RectClick
{
    constructor(x, y, w, h, assignment)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.assignment = assignment;
    }
}

class Assignment
{
    constructor(cells)
    {
        this.subject =          cells[0].firstChild.firstChild.innerText;
        this.title =            cells[1].firstChild.firstChild.innerText;
        this.pulje =            cells[2].firstChild.firstChild.innerText;
        this.brugt =            cells[3].firstChild.firstChild.innerText;
        this.class =            cells[4].firstChild.firstChild.innerText;
        this.week =             cells[5].firstChild.innerText;
        this.detailsButton =    cells[cells.length - 1].firstChild.firstChild;
        
        
        let deliveryDateText = cells[6].firstChild.innerText;

        let deliveryDateArr = deliveryDateText.split(" ")[0].split(".");
        deliveryDateArr.push(deliveryDateText.split(" ")[1]);

        this.deliveryDate = new Date(parseInt(deliveryDateArr[2]), parseInt(deliveryDateArr[1]), parseInt(deliveryDateArr[0]));
        
        //console.log(this.deliveryDate);
    }

    OpenDetails()
    {
        this.detailsButton.click();
    }
}

function Check()
{
    table = document.querySelector("table");
    if (table)
    {
        clearInterval(checkIntervalId);
        CreateCanvas();
        setInterval(Update, 500);
        return;
    }
    console.warn("Failed to find table");
}

function Update()
{
    let values = GetTableValues(table);
    //console.log(values);
    RenderCanvas(values);
}



function RenderCanvas(values)
{
    let date = Date.now();
    let assignments = Array.from(values);
    assignments.sort((a, b)=> a.deliveryDate.getTime() - b.deliveryDate.getTime() );

    let rect = ctx.canvas.getBoundingClientRect();
    ctx.canvas.width = rect.width*2;
    ctx.canvas.height = (rect.height-1)*2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5
    ctx.beginPath();
    ctx.moveTo(0, canvas.height/2);
    ctx.lineTo(canvas.width, canvas.height/2);
    ctx.stroke();

    let x = 5;
    let margin = 10;
    rectClicks = [];

    assignments.forEach(assignment=>{
        ctx.fillStyle = "rgb(111, 179, 224)";
        if(date > assignment.deliveryDate)
        {
            ctx.fillStyle = "rgb(222, 82, 82)";
        }
        let rect = new RectClick(x, canvas.height/2 - 100, canvas.width/assignments.length - margin, 200, assignment);
        rectClicks.push(rect);
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);        
        ctx.fillStyle = "white";
        ctx.font = "30px sans-serif"
        
        textArr = []
        for (let i = 0; i < assignment.title.length; i++)
        {
            if((i+1) % 8 == 1)
            {
                textArr.push("");
            }
            textArr[textArr.length - 1] += assignment.title[i];
        }
        
        let i = 0;
        textArr.forEach(line => {
            ctx.fillText(line, rect.x + 10, rect.y + 50 + i * 30);
            i++;
        })

        
        
        x += canvas.width/assignments.length;
    })

    ctx.clearRect(0, canvas.height/2 + 100, canvas.width, canvas.height);
    
}

function CreateCanvas()
{
    canvas = document.createElement("canvas");
    //canvas.setAttribute("class", "table table-bordered table-condensed dataTable");
    canvas.setAttribute("style", "width: 100%; height: 200px;");
    table.parentElement.appendChild(canvas);
    ctx = canvas.getContext("2d");
    canvas.addEventListener("click", event => {
        const rect = canvas.getBoundingClientRect();
        let x = (event.clientX - rect.left)*2;
        let y = (event.clientY - rect.top)*2;

        rectClicks.forEach(element=>{
            if( x > element.x && x < element.x + element.w &&
                y > element.y && y < element.y + element.h
            )
            {
                element.assignment.OpenDetails();
            }
        })
    })
}

function GetTableValues(t)
{
    let tableContent = Array.from(t.rows);
    tableContent.shift();
    tableContent.shift();
    tableContent.pop();
    
    let values = [];
    let i = 0;
    tableContent.forEach(element => {
        values.push(new Assignment(element.cells));
    });
    return values;
}

checkIntervalId = setInterval(Check, 10);