/** @format */

export function barChart(element) {
	const width = 800;
	const height = 400;

	const svg = d3
		.select("#bar-chart")
		.append("svg")
		.attr("width", width + 80)
		.attr("height", height + 80);

	// display and parse the JSON data from this https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json
	fetch(
		"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
	)
		.then((response) => response.json())
		.then((data) => {
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
				.data(scaledGDP)
				.enter()
				.append("rect")
				.attr("data-date", (d, i) => {
					return data.data[i][0];
				})
				.attr("data-gdp", (d, i) => {
					return data.data[i][1];
				})
				.attr("class", "bar")
				.attr("x", function (d, i) {
					return xScale(years[i]);
				})
				.attr("y", function (d) {
					return height - d;
				})
				.attr("width", width / GDP.length)
				.attr("height", function (d) {
					return d;
				})
				.attr("transform", "translate(60, 0)")
				.attr("fill", "#55aaaa");
			// create a functioning tooltip below
		});
}
