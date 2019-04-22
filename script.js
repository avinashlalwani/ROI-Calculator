// Form input animation
$('.field__input').on('input', function() {
  var $field = $(this).closest('.field');
  if (this.value) {
    $field.addClass('field--not-empty');
  } else {
    $field.removeClass('field--not-empty');
  }
});

// Adds question mark to each input field and creates hover
$('<img class="questionMark" src="img/questionMark.svg"/>').insertAfter("input");
$('.questionMark').hover(function() { 
    $(this).toggleClass('show');
  }
)

// Adds arrow for select field
$('<img class="questionMark" src="img/downArrow.svg"/>').insertAfter("select");

// Adds commas to numbers and strip out any letters
$('input').keyup(function(event) {
  $(this).val(function(index, value) {
    return value
    .replace(/\D/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    ;
  });
});

// Displays second set of input fields once 'industry' is selected from dropdown, and changes dropdown color to white
$('select').change(function() {
    $('.secondForm').addClass('nextForm');
    $('#industry').css("color", "white");
});

// Rounds and abbreviates numbers
function abbreviateNumber(x) {
  if(isNaN(x)) return x;

  if(x < 9999) {
    return x.toFixed(2);
  }

  if(x < 1000000) {
    return Math.round(x/1000) + "K";
  }
  if( x < 10000000) {
    return (x/1000000).toFixed(1) + "M";
  }

  if(x < 1000000000) {
    return (x/1000000).toFixed(1) + "M";
  }

  if(x < 1000000000000) {
    return (x/1000000000).toFixed(1) + "B";
  }

  return "1T+";
}

// Updates form default values based on selection from dropdown
$('#industry').change(function() {
  if($(this).val() == 'telco') {
      $('#costPerAgent').before("<span class='beforeDollar'>$</span>").val('20000');
      $('#agentAttrition').after("<span class='afterPercent'>%</span>").val('19');
      $('#costCall').before("<span class='beforeDollar'>$</span>").val('7');
  } else if($(this).val() == 'fiserve') {
      $('#costPerAgent').before("<span class='beforeDollar'>$</span>").val('20000');
      $('#agentAttrition').after("<span class='afterPercent'>%</span>").val('21');
      $('#costCall').before("<span class='beforeDollar'>$</span>").val('7');
  } else if($(this).val() == 'travel') {
      $('#costPerAgent').before("<span class='beforeDollar'>$</span>").val('20000');
      $('#agentAttrition').after("<span class='afterPercent'>%</span>").val('25');
      $('#costCall').before("<span class='beforeDollar'>$</span>").val('7');
  } else {
      $('#costPerAgent').before("<span class='beforeDollar'>$</span>").val('20000');
      $('#agentAttrition').after("<span class='afterPercent'>%</span>").val('16');
      $('#costCall').before("<span class='beforeDollar'>$</span>").val('7');
  }

  // Adds commas to default numbers in 'cost per agent attrition' field 
  $('#costPerAgent').val(function(index, value) {
    return value
    //.replace(/\D/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    ;
  });  
});

// Limits 'Annual Agent Attrition' filed to 2 digits only
var max_chars = 2;
$('#agentAttrition').keydown( function(e){
    if ($(this).val().length >= max_chars) { 
        $(this).val($(this).val().substr(0, max_chars));
    }
});
$('#agentAttrition').keyup( function(e){
    if ($(this).val().length >= max_chars) { 
        $(this).val($(this).val().substr(0, max_chars));
    }
});

// Smooth scrolling
$("#button").click(function() {
    $('html, body').animate({
        scrollTop: $("#d3Graph").offset().top
    }, 800);
});
$("#goUp").click(function() {
    $('html, body').animate({
        scrollTop: $("#hero").offset().top
    }, 800);
});

// Takes the input values and puts them into a bar graph using D3
function outputname() {

  // Resets the graph
  d3.select("svg").remove();

  var noOfAgents = parseFloat(document.getElementById("noOfAgents").value.replace(/,/g, ''));
  var noOfCustomers = parseFloat(document.getElementById("noOfCustomers").value.replace(/,/g, ''));
  var totalInteractions = parseFloat(document.getElementById("interactions").value.replace(/,/g, ''));
  var annualRevenue = parseFloat(document.getElementById("annualRevenue").value.replace(/,/g, ''));
  var costPerAgentAttrition = parseFloat(document.getElementById("costPerAgent").value.replace(/,/g, ''));
  var annualAttrition = parseFloat(document.getElementById("agentAttrition").value.replace(/,/g, '')/100);
  var costPerCall = parseFloat(document.getElementById("costCall").value.replace(/,/g, ''));

  // Calculating Total Pre Messaging Cost
  var preMessagingInteraction = totalInteractions * noOfCustomers;
  var preMessagingTotalInteractionCost = preMessagingInteraction * costPerCall; //Baseline Total Cost pre messaging

  // Calculating Total interactions for all three scenarios
  var conservativeTotalInteractions = preMessagingInteraction * .75;
  var likelyTotalInteractions = preMessagingInteraction * .52;
  var aggressiveTotalInteractions = preMessagingInteraction * .25;

  // Split each pre messaging total cost for each scenaroio
  var convervativeSplitVoice = conservativeTotalInteractions * .75; 
  var convervativeSplitMessage = conservativeTotalInteractions * .25;

  var likelySplitVoice = likelyTotalInteractions * .50;
  var likelySplitMessage = likelyTotalInteractions * .50;

  var aggressiveSplitVoice = aggressiveTotalInteractions * .25;
  var aggressiveSplitMessage = aggressiveTotalInteractions * .75;

  // Calculate cost-per-message and cost-per-voice for all scenarios
  var conservativeCostPerVoice = convervativeSplitVoice * costPerCall;
  var conservativeCostPerMessage = convervativeSplitMessage * (costPerCall * .25); //75% of cost/call

  var likelyCostPerVoice = likelySplitVoice * costPerCall;
  var likelyCostPerMessage = likelySplitMessage * (costPerCall * .25);

  var aggressiveCostPerVoice = aggressiveSplitVoice * costPerCall;
  var aggressiveCostPerMessage = aggressiveSplitMessage * (costPerCall * .25);

  // Lower Cost Per Interaction aka savings for each scenario
  var conservativeLowerCostPerInteraction = (convervativeSplitMessage * costPerCall) - (convervativeSplitMessage * (costPerCall * .25));
  var likelyLowerCostPerInteraction = (likelySplitMessage * costPerCall) - (likelySplitMessage * (costPerCall * .25));
  var aggressiveLowerCostPerInteraction = (aggressiveSplitMessage * costPerCall) - (aggressiveSplitMessage * (costPerCall * .25));

  // Total Interaction Cost (Voice + Message) for each scenario
  var conservativeTotalInteractionCost = conservativeCostPerMessage + conservativeCostPerVoice;
  var likelyTotalInteractionCost = likelyCostPerMessage + likelyCostPerVoice;
  var aggressiveTotalInteractionCost = aggressiveCostPerMessage + aggressiveCostPerVoice;

  // Calculating Total Interaction Savings
  var conservativeTotalInteractionSavings = preMessagingTotalInteractionCost - conservativeTotalInteractionCost;
  var likelyTotalSavings = preMessagingTotalInteractionCost - likelyTotalInteractionCost;
  var aggressiveTotalSavings = preMessagingTotalInteractionCost - aggressiveTotalInteractionCost;

  // Call Volume Reduction Cost
  var conservativeCallVolReductionCost = (preMessagingTotalInteractionCost - conservativeTotalInteractionCost) - conservativeLowerCostPerInteraction;
  var likelyCallVolReductionCost = (preMessagingTotalInteractionCost - likelyTotalInteractionCost) - likelyLowerCostPerInteraction;
  var aggressiveCallVolReductionCost = (preMessagingTotalInteractionCost - aggressiveTotalInteractionCost) - aggressiveLowerCostPerInteraction;

  // Total Cost of Agents Quitting in a year pre messaging
  var totalAgentsAttruding = noOfAgents * annualAttrition;

  // Baseline cost for agents quitting in a year
  var totalCostOfQuits = totalAgentsAttruding * costPerAgentAttrition;

  //Number of Voice Agents for each scenario
  var conservativeVoiceAgents = convervativeSplitVoice / (preMessagingInteraction/noOfAgents);
  var likelyVoiceAgents = likelySplitVoice / (preMessagingInteraction/noOfAgents);
  var aggressiveVoiceAgents = aggressiveSplitVoice / (preMessagingInteraction/noOfAgents);

  //Number of Messaging Agents for each scenario
  var conservativeMessagingAgents = (convervativeSplitMessage / (preMessagingInteraction/noOfAgents)) * .25;
  var likelyMessagingAgents = (likelySplitMessage / (preMessagingInteraction/noOfAgents)) * .25;
  var aggressiveMessagingAgents = (aggressiveSplitMessage / (preMessagingInteraction/noOfAgents)) * .25;

  // Number of Voice Agents Attruding
  var conservativeVoiceAgentsAttruding = conservativeVoiceAgents * annualAttrition;
  var likelyVoiceAgentsAttruding = likelyVoiceAgents * annualAttrition;
  var aggressiveVoiceAgentsAttruding = aggressiveVoiceAgents * annualAttrition;

  // Number of Messaging Agents Attruding
  var conservativeMessagingAgentsAttruding = conservativeMessagingAgents * .10;
  var likelyMessagingAgentsAttruding = likelyMessagingAgents * .10;
  var aggresiveMessagingAgentsAttruding = aggressiveMessagingAgents * .10;

  // Total number of agents attruding after messaging
  var conservativeTotalAgentsAttruding = conservativeVoiceAgentsAttruding + conservativeMessagingAgentsAttruding;
  var likelyTotalAgentsAttruding = likelyVoiceAgentsAttruding + likelyMessagingAgentsAttruding;
  var aggressiveTotalAgentsAttruding = aggressiveVoiceAgentsAttruding + aggresiveMessagingAgentsAttruding;

  // Total cost of agents leaving after messaging
  var conservativeTotalCostAgentsAttruding = conservativeTotalAgentsAttruding * costPerAgentAttrition
  var likelyTotalCostAgentsAttruding = likelyTotalAgentsAttruding * costPerAgentAttrition
  var aggressiveTotalCostAgentsAttruding = aggressiveTotalAgentsAttruding * costPerAgentAttrition

  // Reduced Agent Attrition
  var conservativeReducedAgentAttrition = (costPerAgentAttrition * totalAgentsAttruding) - conservativeTotalCostAgentsAttruding;
  var likelyReducedAgentAttrition = (costPerAgentAttrition * totalAgentsAttruding) - likelyTotalCostAgentsAttruding;
  var aggressiveReducedAgentAttrition = (costPerAgentAttrition * totalAgentsAttruding) - aggressiveTotalCostAgentsAttruding;

  // Total Expense Saving
  var conservativeTotalExpenseSaving = conservativeReducedAgentAttrition + conservativeLowerCostPerInteraction + conservativeCallVolReductionCost;
  var likelyTotalExpenseSaving = likelyReducedAgentAttrition + likelyLowerCostPerInteraction + likelyCallVolReductionCost;
  var aggressiveTotalExpenseSaving = aggressiveReducedAgentAttrition + aggressiveLowerCostPerInteraction + aggressiveCallVolReductionCost;

  /* REVENUE GROWTH */
  var calculatedAnnualRevenue = annualRevenue * .31;

  var revenueGrowth = 0.000147 * annualRevenue;

  // Calculating Revenue Growth
  var conservativeRevenueGrowth = revenueGrowth * 2.5;
  var likelyRevenueGrowth = revenueGrowth * 5.0;
  var aggressiveRevenueGrowth = revenueGrowth * 7.5;

  // Calculating churn reduction
  var conservativeChurnReduction = 2.5 * 0.00673;
  var likelyChurnReduction = 5.00 * 0.00673;
  var aggressiveChurnReduction = 7.5 * 0.00673;

  // Averaged out churn reduction
  var conservativeAveragedChurnReduction = conservativeChurnReduction * .25;
  var likelyAveragedChurnReduction = likelyChurnReduction * .50;
  var aggressiveAveragedChurnReduction = aggressiveChurnReduction * .75;

  // Churn reduction benefit in dollars
  var conservativeChurnReductionBenefit = conservativeAveragedChurnReduction * calculatedAnnualRevenue;
  var likelyChurnReductionBenefit = likelyAveragedChurnReduction * calculatedAnnualRevenue;
  var aggressiveChurnReductionBenefit = aggressiveAveragedChurnReduction * calculatedAnnualRevenue;

  // Total Revenue Benefit
  var conservativeTotalRevenueGrowth = conservativeRevenueGrowth + conservativeChurnReductionBenefit;
  var likelyTotalRevenueGrowth = likelyRevenueGrowth + likelyChurnReductionBenefit;
  var aggressiveTotalRevenueGrowth = aggressiveRevenueGrowth + aggressiveChurnReductionBenefit;

  //
  var data = [
    conservativeReducedAgentAttrition, 
    conservativeLowerCostPerInteraction, 
    conservativeCallVolReductionCost,
    conservativeChurnReduction,
    conservativeChurnReductionBenefit,
    likelyReducedAgentAttrition, 
    likelyLowerCostPerInteraction, 
    likelyCallVolReductionCost,
    likelyChurnReduction,
    likelyChurnReductionBenefit,
    aggressiveReducedAgentAttrition, 
    aggressiveLowerCostPerInteraction, 
    aggressiveCallVolReductionCost,
    aggressiveChurnReduction,
    aggressiveChurnReductionBenefit
  ];

  function conservativeBar() {
    var myArray = new Array();
    myArray[0] = data[0] + data[1] + data[2]; // Conservative Expense Savings
    myArray[1] = data[3] + data[4]; // Conservative Revenue Growth
    return myArray;
  }

  function likelyBar() {
    var myArray = new Array();
    myArray[0] = data[5] + data[6] + data[7]; // Likely Expense Savings
    myArray[1] = data[8] + data[9]; // Likely Revenue Savings
    return myArray;
  }

  function aggressiveBar() {
    var myArray = new Array();
    myArray[0] = data[10] + data[11] + data[12]; // Aggressive Expense Savings
    myArray[1] = data[13] + data[14]; // Aggressive Revenue Savings
    return myArray;
  }

  var conservativeBar = conservativeBar();
  var likelyBar = likelyBar();
  var aggressiveBar = aggressiveBar();

  // Creating a data set of the calculated values from above for our graph
  var data2 = [
    {outcome: 'Conservative', A: conservativeBar[0], B: conservativeBar[1]},
    {outcome: 'Likely', A: likelyBar[0], B: likelyBar[1]},
    {outcome: 'Aggressive', A: aggressiveBar[0], B: aggressiveBar[1]}
  ];

  // Adds up the values of blue part + orange part
  var sum = [
    conservativeBar[0] + conservativeBar[1],
    likelyBar[0] + likelyBar[1],
    aggressiveBar[0] + aggressiveBar[1]
  ];

  document.getElementById('summary').innerHTML =  "$" + abbreviateNumber(sum[1]) + " is the most likely benefit when adhering to our digital strategy."

  // D3 Graph
  setTimeout(function() {
    function d3graph() {
      var xData = ["A", "B"];

      // Setup SVG
      var margin = {top: 20, right: 50, bottom: 30, left: 50},
          width = 475 - margin.left - margin.right,
          height = 350 - margin.top - margin.bottom;

      var svg = d3.select(".chart-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Set x, y and colors    
      var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .35);

      var y = d3.scale.linear()
        .rangeRound([height, 0]);

      var color = ["#5879DA", "#FF720B"];

      // Transpose the data into layers
      var dataIntermediate = xData.map(function (c) {
        return data2.map(function (d) {
          return {x: d.outcome, y: d[c]};
        });
      });

      var dataStackLayout = d3.layout.stack()(dataIntermediate);

      x.domain(dataStackLayout[0].map(function (d) {
        return d.x;
      }));

      y.domain([0, d3.max(dataStackLayout[dataStackLayout.length - 1],
        function (d) {
          return d.y0 + d.y;
        })
      ]).nice();

      // Define and draw axis
      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .attr("font-family", "open sans")
        .style("fill","#535353")
        .call(xAxis);

      // Create groups for each series, rects for each segment 
      var layer = svg.selectAll(".stack")
        .data(dataStackLayout)
        .enter()
        .append("g")
        .attr("class", "stack")
        .style("fill", function (d, i) {
          return(color[i]);
        });

      // Create tool tips
      var tip1 = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<span style='color:#5879DA'>$" + abbreviateNumber(conservativeTotalExpenseSaving) + "</span><br><br>" + "Call Volume Reduction: " + abbreviateNumber(conservativeCallVolReductionCost) + "<br><br>Lower Cost per Interaction: " + abbreviateNumber(conservativeLowerCostPerInteraction) + "<br><br>Reduced Agent Attrition: " + abbreviateNumber(conservativeReducedAgentAttrition);
      })
      svg.call(tip1);

      var tip2 = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<span style='color:#FF720B'>$" + abbreviateNumber(conservativeTotalRevenueGrowth) + "</span> <br><br>" + "Churn Reduction: " + abbreviateNumber(conservativeChurnReduction) + "<br><br>Increased Customer Spend: " + abbreviateNumber(conservativeChurnReductionBenefit);
      })
      svg.call(tip2);

      var tip3 = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<span style='color:#5879DA'>$" + abbreviateNumber(likelyTotalExpenseSaving) + "</span><br><br>" + "Call Volume Reduction: " + abbreviateNumber(likelyCallVolReductionCost) + "<br><br>Lower Cost per Interaction: " + abbreviateNumber(likelyLowerCostPerInteraction) + "<br><br>Reduced Agent Attrition: " + abbreviateNumber(likelyReducedAgentAttrition);
      })
      svg.call(tip3);

      var tip4 = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<span style='color:#FF720B'>$" + abbreviateNumber(likelyTotalRevenueGrowth) + "</span> <br><br>" + "Churn Reduction: " + abbreviateNumber(likelyChurnReduction) + "<br><br>Increased Customer Spend: " + abbreviateNumber(likelyChurnReductionBenefit);
      })
      svg.call(tip4);

      var tip5 = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<span style='color:#5879DA'>$" + abbreviateNumber(aggressiveTotalExpenseSaving) + "</span><br><br>" + "Call Volume Reduction: " + abbreviateNumber(aggressiveCallVolReductionCost) + "<br><br>Lower Cost per Interaction: " + abbreviateNumber(aggressiveLowerCostPerInteraction) + "<br><br>Reduced Agent Attrition: " + abbreviateNumber(aggressiveReducedAgentAttrition);
      })
      svg.call(tip5);

      var tip6 = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<span style='color:#FF720B'>$" + abbreviateNumber(aggressiveTotalRevenueGrowth) + "</span> <br><br>" + "Churn Reduction: " + abbreviateNumber(aggressiveChurnReduction) + "<br><br>Increased Customer Spend: " + abbreviateNumber(aggressiveChurnReductionBenefit);
      })
      svg.call(tip6);

      layer.selectAll("rect")
        .data(function (d) {
          return d;
        })
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return x(d.x);
        })
        .attr("y", function(d) {
          return height;
        })
        .attr("height", 0)
        .transition()
        .duration(600)
        .attr("y", function (d) {
          return y(d.y + d.y0);
        })
        .attr("height", function (d) {
          return y(d.y0) - y(d.y + d.y0);
        })
        .attr("width", x.rangeBand());

      // Tooltip
      topTip = svg.selectAll(".stack rect")
        .filter(function (d, i) { 
          return i === 0;
        })
        .on('mouseover', tip1.show)
        .on('mouseout', tip1.hide);

      topTip2 = svg.selectAll(".stack rect")
        .filter(function (d, i) { 
          return i === 1;
        })
        .on('mouseover', tip3.show)
        .on('mouseout', tip3.hide);

       toolTip3 = svg.selectAll(".stack rect")
        .filter(function (d, i) { 
          return i === 2;
        })
        .on('mouseover', tip5.show)
        .on('mouseout', tip5.hide);

        toolTip4 = svg.selectAll(".stack rect")
        .filter(function (d, i) { 
          return i === 3;
        })
        .on('mouseover', tip2.show)
        .on('mouseout', tip2.hide);

        toolTip4 = svg.selectAll(".stack rect")
        .filter(function (d, i) { 
          return i === 4;
        })
        .on('mouseover', tip4.show)
        .on('mouseout', tip4.hide);
               
        toolTip4 = svg.selectAll(".stack rect")
        .filter(function (d, i) { 
          return i === 5;
        })
        .on('mouseover', tip6.show)
        .on('mouseout', tip6.hide);

        toolTip4 = svg.selectAll(".stack rect")
        .filter(function (d, i) { 
          return i === 6;
        })
        .on('mouseover', tip2.show)
        .on('mouseout', tip2.hide);

      // 'Totals' on top of bars
      layer.selectAll("text")
        .data(function(d) { 
          return d; 
        })
        .enter()
        .append("text")
        .attr("x", function(d) { 
          return x(d.x) + 12; 
        })
        .attr("y", function(d) { 
          return y(d.y + d.y0) - 10; 
        })
        .attr("font-family", "Roboto Slab")
        .style("fill",'#535353')
        .text(function(d, i) {
          return abbreviateNumber(sum[i]);
        });
    };
    d3graph();
  },600);
};