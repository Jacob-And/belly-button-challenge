const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Getting and console logging the JSON data
d3.json(url).then(function(data) {
  console.log(data);
});

// Initializing the dashboard at launch
function init() {

    // Creating the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    d3.json(url).then((data) => {
        
        // Setting a variable for the sample names
        let names = data.names;

        // Adding the variable to the dropdown menu
        names.forEach((id) => {

            // Logging the value of the id for each loop
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

    
        let sample_one = names[0];
        console.log(sample_one);

        // Building the necessary plots
        buildMetadata(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);
        buildGaugeChart(sample_one);

    });
};

// Creating the function that gives the metadata info
function buildMetadata(sample) {

    d3.json(url).then((data) => {
          let metadata = data.metadata;

        // Filtering the values
        let value = metadata.filter(result => result.id == sample);

        console.log(value)

        let valueData = value[0];

        // Cleaning out the metadata
        d3.select("#sample-metadata").html("");

        // Using the function to add needed the pairs to the panel
        Object.entries(valueData).forEach(([key,value]) => {

           
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Building the bar chart
function buildBarChart(sample) {

    
    d3.json(url).then((data) => {

        let sampleInfo = data.samples;

        // Filtering based on the sample data
        let value = sampleInfo.filter(result => result.id == sample);
        let valueData = value[0];

        // Getting the needed values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        console.log(otu_ids,otu_labels,sample_values);

        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Formatting the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Setting up the layout for the bar chart
        let layout = {
            title: "Top 10 OTUs Present"
        };

        Plotly.newPlot("bar", [trace], layout)
    });
};

// Building the bubble chart
function buildBubbleChart(sample) {

    d3.json(url).then((data) => {
      
        let sampleInfo = data.samples;

        // Filtering based on the sample data
        let value = sampleInfo.filter(result => result.id == sample);

        let valueData = value[0];

        // Getting the needed values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        console.log(otu_ids,otu_labels,sample_values);
        
        // Formatting the trace for the bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Setting up the layout for the bubble chart
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Creating a function that updates the dashboard when the sample is changed
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
    buildGaugeChart(value);
};

// Callling the initialize function to end
init();