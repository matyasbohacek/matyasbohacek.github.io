async function init() {
    const [schedule, summary] = await Promise.all([
        fetch("https://docs.google.com/spreadsheets/d/12pkR8C3OD23VjDgllPq2bnGvFIMszh5OWYffoJMYTZs/gviz/tq?tqx=out:csv&sheet=Mistnosti"),
        fetch("https://docs.google.com/spreadsheets/d/12pkR8C3OD23VjDgllPq2bnGvFIMszh5OWYffoJMYTZs/gviz/tq?tqx=out:csv&sheet=Anotace"),
    ]);

    const data = CSVToArray(await schedule.text());
    const summary_data = CSVToArray(await summary.text());

    let table = document.getElementById("harmonogram");
    let lookup = {};
    let lookup_ids = {};

    for (let i = 0; i < data.length; i++) {
        if (data[i][0]) {
            let tr = document.createElement("tr");

            for (let j = 0; j < data[i].length; j++) {

                if (i > 1 && data[i][j] == data[i-1][j]) {
                    lookup[i + "," + j] = lookup[(i-1) + "," + j]
                    lookup[i + "," + j].rowSpan += 1;
                } else {
                    let elem = document.createElement((i == 0 || j == 0) ? "th" : "td");

                    if (data[i][j] == undefined) {
                        elem.innerHTML = "–";
                        elem.style.textAlign = "center";
                        lookup[i + "," + j] = elem;
                        tr.appendChild(elem);
                        continue;
                    }

                    lookup_ids[data[i][j]] = data[i][j].toLowerCase().replaceAll(",", "").replaceAll(" ", "_");

                    if (data[i][j] == "") {
                        elem.innerHTML = "–";
                        elem.style.textAlign = "center";
                    } else if (i != 0 && j != 0) {
                        elem.innerHTML = '<a href="#' + lookup_ids[data[i][j]] + '">' + data[i][j] + "</a>";
                    } else {
                        elem.innerHTML = data[i][j];
                        if (i != 0 || (j == 0)) {
                            elem.classList.add("sticky-left")
                        }

                    }
                    lookup[i + "," + j] = elem;

                    tr.appendChild(elem);
                }
            }
            table.appendChild(tr);
        }
    }

    let summaries = document.getElementById("anotace");
    for (let i = 0; i < summary_data.length; i++) {
        if (i != 0 && summary_data[i][0] && lookup_ids[summary_data[i][0]]) {
            let h = "<h3 id=\"" + lookup_ids[summary_data[i][0]] + "\">" + summary_data[i][0] + "</h3>";

            let article = document.createElement("article");
            article.innerHTML = h + "<b>" + summary_data[i][1] + "</b>" ;

            if (summary_data[i][2].includes("\n")) {
                article.innerHTML += "  <i>" + summary_data[i][2].replace("\n", "</i><hr />");
            } else {
                article.innerHTML += "<hr />" + summary_data[i][2] + "";
            }

            // summaries.appendChild(h);
            summaries.appendChild(article);
        }
    }
}


window.addEventListener("load", init);

// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray(strData,strDelimiter){strDelimiter=(strDelimiter||",");var objPattern=new RegExp(("(\\"+strDelimiter+"|\\r?\\n|\\r|^)"+"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|"+"([^\"\\"+strDelimiter+"\\r\\n]*))"),"gi");var arrData=[[]];var arrMatches=null;while(arrMatches=objPattern.exec(strData)){var strMatchedDelimiter=arrMatches[1];if(strMatchedDelimiter.length&&strMatchedDelimiter!==strDelimiter){arrData.push([])}var strMatchedValue;if(arrMatches[2]){strMatchedValue=arrMatches[2].replace(new RegExp("\"\"","g"),"\"")}else{strMatchedValue=arrMatches[3]}arrData[arrData.length-1].push(strMatchedValue)}return(arrData)}
