// app namespace
var simpleSketch = simpleSketch || {};
var stroke_width = 3;


var copy;
var copyArray = new Array();


//attributes
simpleSketch.clipboard = []; 
//simpleSketch.undo_redo = new simpleSketch.UndoRedo();

/*****************MEMENTO DESIGN PATTERN******************************/
/*simpleSketch.Caretaker = function () {
  this.undoStack = [];
  this.redoStack = [];
};

simpleSketch.Caretaker.prototype.getMementoRedo = function () {
  if (this.redoStack.length != 0)
  {
    var memento = this.redoStack.pop();
    this.undoStack.push(memento);
    return memento;
  } 
  else 
  {
    return null;
  }
};


simpleSketch.Caretaker.prototype.getMementoUndo = function () {
  if (this.undoStack.length >= 2) 
  {
    this.redoStack.push(this.undoStack.pop());
    return this.undoStack[this.undoStack.length - 1];
  } 
  else 
  {
    return null;
  }
};

simpleSketch.Caretaker.prototype.addMemento = function (obj) {
  if (obj) 
  {
    var memento = new simpleSketch.Memento(obj);
    this.undoStack.push(memento);
    this.redoStack = [];
  }
};*/

//69
/****************************************FREE HANDLER*******/
simpleSketch.freeStyle = function () {
  simpleSketch.resetCanvasHandlers();
  simpleSketch.canvas.isDrawingMode = true;
  simpleSketch.canvas.renderAll();

  /*simpleSketch.canvas.on('mouse:up', function (e) {
     simpleSketch.undo_redo_manager.insert(simpleSketch.canvas);
  });*/
};

/****************************************LINE HANDLER*******/
simpleSketch.line = function () {
  simpleSketch.resetCanvasHandlers();

  var the_line;
  var drawing = false;

/*  simpleSketch.canvas.add(new fabric.Line([50, 100, 200, 200], {
        left: 170,
        top: 150,
        stroke: 'red'
    }));*/

    simpleSketch.canvas.on('mouse:down', function (location) {
       drawing = true;
      var curr_position = simpleSketch.canvas.getPointer(location.e);
      console.log(curr_position);
      
      the_line = new fabric.Line([curr_position.x, curr_position.y, curr_position.x, curr_position.y], {
        strokeWidth: stroke_width,
        fill: simpleSketch.penColor,
        stroke: simpleSketch.penColor
      });
      simpleSketch.canvas.add(the_line);
    });



	simpleSketch.canvas.on('mouse:move', function (location) {
    if (!drawing)
    {
    	return;	
    } 
    // console.log(drawing);
    var position = simpleSketch.canvas.getPointer(location.e);
    the_line.set({x2: position.x, y2: position.y});
    simpleSketch.canvas.renderAll();
    simpleSketch.canvas.calcOffset();
  });

  simpleSketch.canvas.on('mouse:up', function (location) {
    drawing = false;

    //simpleSketch.undo_redo_manager.insert(simpleSketch.canvas);
  });

 
};


/******************************RECTANGLE/SQUARE HANDLER*******/
simpleSketch.rect = function(position){
  simpleSketch.resetCanvasHandlers();
  var draw = false;
  var position, rectangle, xi, yi;
  simpleSketch.canvas.on('mouse:down', function (p) {
    position = simpleSketch.canvas.getPointer(p.e);
    xi = position.x;
    yi = position.y;
    draw = true;
    rectangle = new fabric.Rect({
      width: 0,
      height: 0,
      left: xi,
      top: yi,
      fill: '',
      stroke: simpleSketch.penColor
    });

    //if square was clicked, lock the scaling to that the painter will give a square
    if (simpleSketch.mode === 'square') 
    {
      rectangle.lockUniScaling = true;
    }
    simpleSketch.canvas.add(rectangle);
  });

 //mouse up handler for square or rectangle, end drawing
  simpleSketch.canvas.on('mouse:up', function (p) {
    draw = false;
    //simpleSketch.undo_redo_manager.insert(simpleSketch.canvas);
  });

 //when the cursor is moved
  simpleSketch.canvas.on('mouse:move', function (p) {
    if (!draw)
    {
    	return;	
    } 
    position = simpleSketch.canvas.getPointer(p.e);
    var hei;
    var wid = position.x - xi;
      
    //if rectangle was selected, se the height to the current cursor
    //position minus the inital position
    //otherwise (square) so the height is equal to the width
    if (simpleSketch.mode === 'rectangle') 
    {
      hei = position.y - yi;
    } 
    else 
    {
      hei = wid;
    }
    rectangle.set({width: wid, height: hei});
    simpleSketch.canvas.renderAll();
  });

};







/****************************************CIRCLE HANDLER*******/
simpleSketch.circle = function(){
  simpleSketch.resetCanvasHandlers();

  //assign circle variables
  var position, radius, xi, yi, circleObj;
  var draw = false;


  simpleSketch.canvas.on('mouse:down', function (pos) {
    
    //get the current mouse position and set draw to true
    draw = true;
    position = simpleSketch.canvas.getPointer(pos.e);
    xi= position.x;
    yi = position.y;

    circleObj = new fabric.Circle({
      radius: 0,
      left: xi,
      top: yi,
      fill: '',
      stroke: simpleSketch.penColor
    });
   
    simpleSketch.canvas.add(circleObj);
  });

    simpleSketch.canvas.on('mouse:move', function (pos) {
        if (!draw)
        {
          return;
        }

        //get the new position
        position = simpleSketch.canvas.getPointer(pos.e);
        
        //ge the width and height to ultimately get the radius
        var width = xi - position.x;
        var height = yi - position.y;

        var radius = Math.sqrt((height*height) + (width*width))/2;

        //set the new object
        circleObj.set({radius: radius});
        simpleSketch.canvas.renderAll();

    });

    simpleSketch.canvas.on('mouse:up', function (pos) {
      draw = false;
    //simpleSketch.undo_redo_manager.insert(simpleSketch.canvas);
    });

}



/****************************************CLEAR HANDLER*******/


simpleSketch.clearfn = function(){
  simpleSketch.canvas.clear();
}







/****************************************ELLIPSE HANDLER*******/
simpleSketch.ellipse = function () {
  simpleSketch.resetCanvasHandlers();
  
  //assign variables
  var position, xi, yi, ellipseObject; 
  var draw = false;

  simpleSketch.canvas.on('mouse:down', function (pos) {
    position = simpleSketch.canvas.getPointer(pos.e);
   
   //set y and x equal to the position at x and y
    yi = position.y;
    xi = position.x;
    
    //now in draw mode since the mouse has been pressed
    draw = true;
    
    //create the ellipse object
    ellipseObject = new fabric.Ellipse({
      rx: 0,
      ry: 0,
      left: xi,
      top: yi,
      fill: '',
      stroke: simpleSketch.penColor
    });
    simpleSketch.canvas.add(ellipseObject);
  });

  simpleSketch.canvas.on('mouse:move', function (pos) {
    if (!draw)
    {
      return;
    } 
    console.log(draw);
    
    //get the current mouse position
    position = simpleSketch.canvas.getPointer(pos.e);
    var radius1 = Math.abs(position.x - xi), radius2 = Math.abs(position.y - yi);
    
    //dynamically alter the new ellipse radius based on mouse move
    ellipseObject.set({rx: radius1, ry: radius2});
    simpleSketch.canvas.renderAll();
  });

  simpleSketch.canvas.on('mouse:up', function (pos) {
    draw = false;
    //simpleSketch.undo_redo_manager.insert(simpleSketch.canvas);
  });
}


/****************************************SELECT HANDLER*******/
simpleSketch.select = function () {
  
  //reset the handlers and pu tinto selection mode
  simpleSketch.resetCanvasHandlers();
  simpleSketch.canvas.selection = true;

  //make each object selectable
  simpleSketch.canvas.forEachObject(function (object) {
    object.selectable = true;
    object.setCoords();
  });

  //re-render
  simpleSketch.canvas.calcOffset();
  simpleSketch.canvas.renderAll();
};

/****************************************POLYGON HANDLER*************************/
simpleSketch.polygon = function(){
    simpleSketch.resetCanvasHandlers();

    //decalre variables needed for polygon
    var draw = true, curr_line, polygonObject, position;
    var finished = false;

    simpleSketch.canvas.on('mouse:move', function(pos){
      
      if (!curr_line || !draw || finished)
      {
        return;
      }

      //get the cursor position, set the nee current line and render the changes
      position = simpleSketch.canvas.getPointer(pos.e);
      curr_line.set({x2: position.x, y2: position.y});
      
      //render
      simpleSketch.canvas.renderAll();
      simpleSketch.canvas.calcOffset();
    });


    //mouse up handler
    simpleSketch.canvas.on('mouse:up', function (pos) {
      
      //set finsihed false if currently true 
      if (finished) 
      {
        finished = false;
        return;
      }

      //get the current position and add the line
      position = simpleSketch.canvas.getPointer(pos.e);
      curr_line = new fabric.Line([position.x, position.y, position.x, position.y], {
        strokeWidth: 3,
        fill: simpleSketch.penColor,
        stroke: simpleSketch.penColor
      });
      
      if (!polygonObject) 
      {
        polygonObject = [];
      }
      
      draw = true;
      polygonObject.push(curr_line);
      simpleSketch.canvas.add(curr_line);
     // simpleSketch.undo_redo_manager.insert(simpleSketch.canvas);
    });

    //end when right click!
     var endfn = function(pos) {
        draw = false;
       
        //take out the line thats dangling
        simpleSketch.canvas.remove(curr_line);
        
        finished = true;
        polygonObject = null;
        curr_line = null;
        return false;
      }


      document.getElementsByClassName('upper-canvas')[0].oncontextmenu = endfn;
}


simpleSketch.colour = function (c) {
  simpleSketch.penColor = c;
  simpleSketch.canvas.freeDrawingBrush.color = simpleSketch.penColor;
};





//set the drawing mode
simpleSketch.set = function (mode) {
  var theElement = document.getElementById(simpleSketch.mode);
  theElement.className = simpleSketch.classRemove(theElement, 'active');
  document.getElementById(mode).className += 'active';
  simpleSketch.mode = mode;
};

//remove active from the class
simpleSketch.classRemove = function (element, remove) {
  return element.className.replace(remove, '');
};

//whenever the mode is changed you need to reset the canvas handlers
simpleSketch.resetCanvasHandlers = function () {
  simpleSketch.canvas.off('mouse:down');
  simpleSketch.canvas.off('mouse:up');
  simpleSketch.canvas.off('mouse:move');

  simpleSketch.canvas.isDrawingMode = false;
  simpleSketch.canvas.selection = false;
  simpleSketch.canvas.forEachObject(function (object) {
    object.selectable = false;
  });
};


/************************************COPY HANDLER*****************************/
simpleSketch.copy = function(){
    if(simpleSketch.canvas.getActiveGroup()){
        for(var i in simpleSketch.canvas.getActiveGroup().objects){
            var object = fabric.util.object.clone(canvas.getActiveGroup().objects[i]);
            object.set("top", object.top+5);
            object.set("left", object.left+5);
            copyArray[i] = object;
        }                    
    }
    else if(simpleSketch.canvas.getActiveObject()){
        var object = fabric.util.object.clone(simpleSketch.canvas.getActiveObject());
        object.set("top", object.top+5);
        object.set("left", object.left+5);
        copy = object;
        copyArray = new Array();
    }
}


/******************************PASTE HANDLER**********************************/

simpleSketch.paste = function (){
    if(copyArray.length > 0){
        for(var i in copyArray){
            simpleSketch.canvas.add(copyArray[i]);
        }                    
    }
    else if(copy){
        simpleSketch.canvas.add(copy);
    }
    simpleSketch.canvas.renderAll();    
}

/*function test(e){
  console.log("hello world");
}*/
/****************************************KEYDOWN HANDLER**************/
  document.onkeydown = function(e){
    //simpleSketch.test;
    console.log('test')

    var key;
    if(window.e)
    {
        key = window.e.keyCode;
        console.log(key);
    }
    else
    {
        key = e.keyCode;
        console.log(key);
    }


    //copy case
    if(key == 67)
    {
        if(e.ctrlKey)
        {
            e.preventDefault();
            simpleSketch.copy();
        }
    }//paste case
    else if (key == 86)
    {
      if(e.ctrlKey)
      {
          e.preventDefault();
          simpleSketch.paste();
       }
    }
    else if (key == 88)
    {
      if(e.ctrlKey)
      {
          e.preventDefault();
          simpleSketch.cut();
       }
    }
}

/**************************CUT HANDLER ************************************************/
simpleSketch.cut = function () {
  
  //if active group
  if (simpleSketch.canvas.getActiveGroup()) {
    
    simpleSketch.clipboard = [];
    
    //get the active group of objects
    for (var i in simpleSketch.canvas.getActiveGroup().objects) 
    {
      simpleSketch.clipboard[i] = simpleSketch.canvas.getActiveGroup().objects[i];
    }
    
    //for each of the active groups, remove the object
    simpleSketch.canvas.getActiveGroup().forEachObject(function (object) {
      simpleSketch.canvas.remove(object)
    });
    
    simpleSketch.canvas.discardActiveGroup().renderAll();
  } //if only one obj
  else if (simpleSketch.canvas.getActiveObject()) 
  {
    simpleSketch.clipboard = [simpleSketch.canvas.getActiveObject()];
    simpleSketch.canvas.remove(simpleSketch.canvas.getActiveObject());
    simpleSketch.canvas.discardActiveObject().renderAll();
  }
};




//when page is loaded
window.onload = function () {

  //make a new canvas
  simpleSketch.canvas = new fabric.Canvas('canvas');

  //need to have a clena canvas for redo/undo
 // simpleSketch.undo.insert(simpleSketch.canvas); 
 // simpleSketch.canvas.on("object:modified", simpleSketch.redu_undo);

  simpleSketch.canvas.backgroundColor = '#F5F5F5';

  simpleSketch.mode = 'select';
  simpleSketch.canvas.freeDrawingBrush.width = stroke_width;
  simpleSketch.penColor = 'black';
  simpleSketch.canvas.renderAll();


//Event Listeners
  document.getElementById('freehand').addEventListener('click', simpleSketch.freeStyle);
  document.getElementById('line').addEventListener('click', simpleSketch.line);
  document.getElementById('square').addEventListener('click', simpleSketch.rect);
  document.getElementById('rectangle').addEventListener('click', simpleSketch.rect);
  document.getElementById('ellipse').addEventListener('click', simpleSketch.ellipse);
  document.getElementById('polygon').addEventListener('click', simpleSketch.polygon);
 // document.getElementById('undo').addEventListener('click', simpleSketch.undoHandler);
 // document.getElementById('redo').addEventListener('click', simpleSketch.redoHandler);
  document.getElementById('select').addEventListener('click', simpleSketch.select);
  document.getElementById('clear').addEventListener('click', simpleSketch.clearfn);
  document.getElementById('circle').addEventListener('click', simpleSketch.circle);

};