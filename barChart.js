/** @format */

export function barChart() {
	const width = 800;
	const height = 400;

	const tooltip = d3
		.select("#bar-chart")
		.append("div")
		.attr("id", "tooltip")
		.style("opacity", 0);

	const svg = d3
		.select("#bar-chart")
		.append("svg")
		.attr("width", width + 80)
		.attr("height", height + 80);

	let dataArray = [];
	// display and parse the JSON data from this https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json
	fetch(
		"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
	)
		.then((response) => response.json())
		.then((data) => {
			dataArray = data.data;
			console.log(dataArray);
			// get the years and parse to Date from the JSON file
			const years = data.data.map((item) => {
				return new Date(item[0]);
			});

			// get the max year
			const xMax = new Date(d3.max(years));

			// get the min year
			const xMin = new Date(d3.min(years));

			const xScale = d3
				.scaleTime()
				.domain([xMin, xMax])
				.range([0, width]);

			// x-axis
			const xAxis = d3.axisBottom().scale(xScale);

			// append the x-axis to the svg
			svg.append("g")
				.call(xAxis)
				.attr("id", "x-axis")
				.attr("transform", "translate(60, 400)");

			// get the GDP data from the JSON file
			const GDP = data.data.map((item) => {
				return item[1];
			});

			// get the max GDP
			const gdpMax = d3.max(GDP);

			// scale the y-axis
			const yAxisScale = d3
				.scaleLinear()
				.domain([0, gdpMax])
				.range([height, 0]);

			// y-axis
			const yAxis = d3.axisLeft(yAxisScale);

			// append the y-axis to the svg
			svg.append("g")
				.call(yAxis)
				.attr("id", "y-axis")
				.attr("transform", "translate(60, 0)");

			// linear scale of the GDP data
			const linearScale = d3
				.scaleLinear()
				.domain([0, gdpMax])
				.range([0, height]);

			// scale the GDP data
			const scaledGDP = GDP.map((item) => {
				return linearScale(item);
			});

			// append the bars to the svg
			svg.selectAll("rect")
				.data(dataArray)
				.enter()
				.append("rect")
				.attr("data-date", (d, i) => {
					return dataArray[i][0];
				})
				.attr("data-gdp", (d, i) => {
					return dataArray[i][1];
				})
				.attr("class", "bar")
				.attr("x", function (d, i) {
					return xScale(years[i]);
				})
				.attr("y", function (d) {
					return height - linearScale(d[1]);
				})
				.attr("width", width / GDP.length)
				.attr("height", function (d) {
					return linearScale(d[1]);
				})
				.attr("transform", "translate(60, 0)")
				.attr("fill", "#55aaaa")

				// TODO create a functioning tooltip below
				.on("mouseover", function (event, d) {
					console.log(event);
					console.log(d);
					tooltip.transition().duration(200).style("opacity", 0.9);
					tooltip
						.html(
							`<p>${d[0]}</p><p>$${d[1].toLocaleString("en")}</p>`
						)
						.attr("data-date", d[0])
						.style("top", height + "px")
						.style("left", event.pageX + "px");
				})
				.on("mouseout", function (d) {
					tooltip.transition().duration(200).style("opacity", 0);
				});
		});
}

// https://forum.freecodecamp.org/t/how-to-get-data-and-index-in-d3-v6-5-0/445201/2
// https://stackoverflow.com/questions/15011256/d3-bar-chart-is-upside-down/15012361
