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

//This kicks off the genetics stuff
function applyGenetics(){
  var newGraphs = []; //Make a new population
  var selectionThreshold = Math.floor(graphs.length/2); //Lets make the selection threshold 50%

  //SELECTION 
  //Basically we have to select half of the population based on their fitness scores (where the 'best' elements are chosen with a higher propability)
  //We are using fitness based proportion selection to acheive this
  
  //Loop for as many times as we can select something
  for (var i = 0; i < selectionThreshold; i++){
    var totalFitness = 0; //And keep a running total of this loops total fitness
    //Loop trough all the graphs
    for (var j = 0; j < graphs.length; j++)
    {
      if (graphs[j] != null)
      {
        totalFitness += graphs[j][9]; //And total up their fitness
      }  
    }  

    //Once we have the total fitness choose a random point between 0 -> fitness
    var randomPoint = random(totalFitness);
    var count = 0;
    //Go through all of the graphs
    for (var j = 0; j < graphs.length; j++){
      if (graphs[j] != null){
        count+= graphs[j][9]; //Add the current fitness to the count
        if (count >= randomPoint){ //If the current fitness has reaached the chosen fitness value above
          newGraphs.push(graphs[j]); //This is the graph to select, so select it
          graphs[j] = null; //And set the old graph to null (it cannot be selected again)
          break;
        }
      }
    }
  }

  //CROSSOVER
  //This is essentially where two elements of the population breed with each other to make an offspring which have values of either
  for (var i = 0; i < selectionThreshold; i++ ) {
    var indxA = Math.floor(random(selectionThreshold)); //Grab the first random element
    var indxB = Math.floor(random(selectionThreshold)); //Grab the second random element
    var newValues = []; //And start a new list for the child
    for (var j = 0; j < 9; j++)
    {
      //50% of the time we take the value from the A parent, and 50% of the time we take the value from the B parent
      if(random(1) < 0.5)
      {
        newValues.push(newGraphs[indxA][j]);
      } else {
        newValues.push(newGraphs[indxB][j]);
      }
    } 
    newValues.push(0); //Push a new fitness (which starts at 0)
    newGraphs.push(newValues); //And add this to the graphs
  }

  //MUTATION
  //We want some mutation so we can explore new values we have not already tried
  //Go through all graphs
  for (var i = 0; i < newGraphs.length; i++ ) {
    //And all elements in the graph dna
    for (var j = 0; j < 9; j++ )
    {
      //1% of the time we choose a new value
      if (random(1) < 0.01)
      {
        newGraphs[i].values[j] = getNextValue();
      } 
    } 
  }
  graphs = newGraphs;
}

//Returns a random values between 0 and the range
function getNextValue(){ return random(0, range);}

//If the key is between 0-9 gives the graph a fitness.
//If we have scored all of the graphs we apply the genetics to get a new population
function keyPressed() {
  //If it is a number key
  if (key >= 1 && key <= 9) { 
    print("Graph "+currGraph+" given fitness of "+(key));//output the score
    graphs[currGraph][9] = parseInt(key); //and set the fitness

    //Increment the count
    if(currGraph == graphs.length-1)
    {
      currGraph = 0;
    } else {
      currGraph++;
    }
    //And is the count is now 0 we can apply genetics 
    if (currGraph==0) {
      print("Population evaluated, applying genetics.");
      applyGenetics(); 
    }
  }
}