var graphs = []; //This is a list that contains all of the spirographs
var currentGraph; //An index to the above list
var numbPop = 10; //How many spirographs we want in our population (so the length of graphs)
var centerX = 400; //The center point
var centerY = 400; //The center point
var range = 800; //When we pick values this is the range we can pick from. Set at the width/height 

//This sets everything up
function setup() {
	createCanvas(range,range); //Make an 800x800 Canvas
	colorMode(RGB, range); //Let's use RGB colour but mapped to range (it will make out lives easier later)

  //Loop for n times where n = population
	for (var i = 0; i < numbPop; i++)
  {
		var dna = []; //Make a new DNA (which is a list)

    //Each DNA should have 9 elements that correspond with the spirograph 
		for(var j = 0; j < 9; j++)
    {
      dna.push(getNextValue()); //Because colour is mapped to 0-800 we one need for function
    } 
		dna.push(0); //Lastly we add a fitness score
		graphs.push(dna); //And add this to the list of graphs
	}
	currGraph = 0; //The current graph should be 0
}

//The meat of the program, draws the current graph to the screen
function draw() {
  //Grab the current graph
	values = graphs[currGraph];

	background(values[0],values[1],values[2]); //Set the background colour the to first 3 elements
	stroke(values[3], values[4], values[5]); //And set the line colour to the next 3

  //The last 3 are used for the drawing os the graph
  var a = values[6]; 
  var b = values[7]; 
  var h = values[8]; 

  //I am not entirely sure I can explain the below code well, it was cribbed from http://samjbrenner.com/notes/processing-spirograph/
  //Basically it does around in a circle and draws a line which forms part of the spriograph
  for (var i=1; i<361; i+=1) {
    var t = radians(i);
    var oldt = radians(i-1);
    var oxpos = (a-b)*cos(a*oldt)+h*cos(a*oldt);
    var oypos = (a-b)*sin(a*oldt)+h*sin(a*oldt);    
    var xpos = (a-b)*cos(t)+h*cos(a*t);
    var ypos = (a-b)*sin(t)+h*sin(a*t);
    line(centerX+oxpos, centerY+oypos, centerX+xpos, centerY+ypos);
  }
}

//Returns a random values between 0 and the range
function getNextValue(){ return random(0, range);}

//Increments the count for the current graph
function keyPressed() {
  if(currGraph == graphs.length-1){
    currGraph = 0;
  } else {
    currGraph++;
  }
}