queue()
    .defer(d3.json, "/devXX/get_deployments")
    .await(makeGraphs);

function makeGraphs(error, DeployLogs) {
	
	var deployinfos = DeployLogs;
	var dateFormat = d3.time.format("%Y-%m-%d %H:%M");
	deployinfos.forEach(function(d) {d["start_time"] = dateFormat.parse(d["start_time"]);});

	var ndx = crossfilter(deployinfos);

	var dateDim = ndx.dimension(function(d) { return d["start_time"]; });
	var envTypeDim = ndx.dimension(function(d) { return d["environment"]; });
	var statusDim = ndx.dimension(function(d) { return d["status"]; });
	var applicationDim = ndx.dimension(function(d) { return d["application"]; });
	var businessDimension = ndx.dimension(function (d) { return d.deploy_id; });

	var numProjectsByDate = dateDim.group(); 
	var numProjectsByEnv = envTypeDim.group();
	var numProjectsByStatus = statusDim.group();
	var numProjectsByApp = applicationDim.group();

	var all = ndx.groupAll();
	var totalDonations = ndx.groupAll().reduceSum(function(d) {return d["duration"];});

	var minDate = dateDim.bottom(1)[0]["start_time"];
	var maxDate = dateDim.top(1)[0]["start_time"];

	var timeChart = dc.barChart("#time-chart");
	var resourceTypeChart = dc.rowChart("#resource-type-row-chart");
	var applicationTypeChart = dc.rowChart("#application-type-row-chart");
	var StatusChart = dc.pieChart("#status-row-chart");
	var numberDeployment = dc.numberDisplay("#number-deployments");
	var dataTable = dc.dataTable("#dc-table-graph");

	numberDeployment
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);

	timeChart
		.width(900)
		.height(475)
		.margins({top: 10, right: 0, bottom: 30, left: 50})
		.dimension(dateDim)
		.renderHorizontalGridLines(true)
		.group(numProjectsByDate)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.yAxis().ticks(4);

	resourceTypeChart
        	.width(300)
        	.height(250)
		.colors(["#afa488", "#6e617b", "#5c88ad"])
        	.dimension(envTypeDim)
        	.group(numProjectsByEnv)
        	.xAxis().ticks(4);

	applicationTypeChart
        	.width(300)
        	.height(250)
        	.dimension(applicationDim)
        	.group(numProjectsByApp)
		.colors(["#5369a8", "#4cb07a", "#f8d56c"])
        	.xAxis().ticks(4);

	StatusChart
		.width(200)
		.height(150)
        	.dimension(statusDim)
		.colors(["#d00000","#72c96f"])
        	.label(function(d) { return d.data.key; })
        	.group(numProjectsByStatus);

	dataTable.width(800).height(800)
    		.dimension(businessDimension)
    		.group(function(d) { return "List of related deployment logs" })
    		.size(100)
    		.columns([
        		function(d) { return d.application; },
        		function(d) { return d.user; },
        		function(d) { return d.environment; },
        		function(d) { return d.status; },
        		function(d) { return d.duration; },
        		function(d) { return d.message; },
    			])

    dc.renderAll();

};
