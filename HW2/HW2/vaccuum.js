/*
======================
Vaccuum World problem
======================
Clean (bring dirt to 0) the world the robot vaccuum inhabits.

State:
{
  dirt : Array(2), Integers [0,inf),
  position : Integer [0,1]
}

Possible actions:
ID | Action
---+----------------------
 1 | Move left (i.e., --position)
---+----------------------
 2 | Move right (i.e., ++position)
---+----------------------
 3 | Vaccuum (i.e., lower dirt at position by 1)
*/

//Check if the given state is a goal state
//Returns: true if is goal state
function is_goal_state(state) {
  ++helper_eval_state_count; //Keep track of how many states are evaluated
  return state.dirt[0]==0 && state.dirt[1]==0;
}

//Find the list of actions that can be performed from the given state and the new
//states that result from each of those actions
//Returns: Array of successor objects (where each object has a valid actionID member and corresponding resultState member)
function find_successors(state) {
  ++helper_expand_state_count; //Keep track of how many states are expanded
  
  let successors=[];

  if(state.position>0) {
    successors.push({
      actionID : 1,
      resultState : {
        dirt : state.dirt.slice(0) /*clone*/,
        position : state.position-1
      }
    });
  }
  if(state.position<1) {
    successors.push({
      actionID : 2,
      resultState : {
        dirt : state.dirt.slice(0) /*clone*/,
        position : state.position+1
      }
    });
  }
  if(state.dirt[state.position]>0) {
    let newdirt=state.dirt.slice(0);
    --newdirt[state.position];
    successors.push({
      actionID : 3,
      resultState : {
        dirt : newdirt,
        position : state.position
      }
    });
  }
  
  return successors;
}

function calculate_heuristic(state) {
  return state.dirt[0]+state.dirt[1]+ //Still need to clean dirt
         (state.dirt[1-state.position]>0); //Need to move to clean dirt in other position
}

//////////////////////////////////////////////////////////////////////////////

//Check that state input has valid values, outputs descriptive text if not
//Returns: true if input ok
function verify_state() {
  let s=read_state();
  
  if(isNaN(s.dirt[0])) {
    helper_log_write("Left dirt amount not a number");
    return false;
  }
  if(isNaN(s.dirt[1])) {
    helper_log_write("Right dirt amount  volume not a number");
    return false;
  }
  if(s.dirt[0] < 0) {
    helper_log_write("Left dirt amount not non-negative");
    return false;
  }
  if(s.dirt[1] < 0) {
    helper_log_write("Right dirt amount not non-negative");
    return false;
  }
  return true;
}

//Construct state object from page input
//Returns: state object
function read_state() {
  let dirtL_input=document.getElementById("input_dirt_L");
  let dirtR_input=document.getElementById("input_dirt_R");
  let posL_input=document.getElementById("input_robot_L");
  let posR_input=document.getElementById("input_robot_R");
  
  return {
    dirt : [ parseInt(dirtL_input.value,10), parseInt(dirtR_input.value,10) ],
    position : (posL_input.checked?0:1)
  };
}

//Convert state to a DOM object suitable for display on web page
//Returns: DOM object
function state_to_dom(s) {
  try {
    let html="Robot ";
    html+=(s.position==0?"Left":"Right");
    html+="<br>";
    html+="Left dirt: ";
    html+=s.dirt[0];
    html+="<br>";
    html+="Right dirt: ";
    html+=s.dirt[1];
    let obj=document.createElement("p");
    obj.innerHTML=html;
    return obj;
  } catch(e) {
    helper_log_exception(e);
    throw e;
    return null;
  }
}

//Convert action to a DOM object suitable for display on web page
//(Providing optional on_state argument may give more detailed description of what is being done to provided state.)
//Returns: DOM object
function action_to_dom(actionID,on_state) {
  try {
    let obj=document.createElement("p");
    switch(actionID) {
      case 1:
        obj.innerHTML="Move left";
        break;
      case 2:
        obj.innerHTML="Move right";
        break;
      case 3:
        if(on_state==null) obj.innerHTML="Vaccuum";
        else obj.innerHTML="Vaccuum: "+(on_state.position==0?"Left":"Right")+" dirt "+on_state.dirt[on_state.position]+" -> "+(on_state.dirt[on_state.position]-1);
        break;
      default:
        obj.innerHTML="Invalid action!";
    }
    return obj;
  } catch(e) {
    helper_log_exception(e);
    throw e;
    return null;
  }
}

//Convert state to a unique number (no 2 state objects will have the same number unless they are equivalent).
// For use with Javascript Set, since there's no way to override its equivalence check
function state_to_uniqueid(state) {
  try {
    let id=szudzik_pairing_function(state.dirt[0],state.dirt[1]);
    id*=2;
    id+=state.position;
    return id;
  } catch(e) {
    helper_log_exception(e);
    throw e;
    return null;
  }
}

function szudzik_pairing_function(a,b) {
  return (a>=b)?( a*a+a+b ):( a+b*b );
}

//Copyright 2019 Joe Barker, Computer Science and Engineering, Ohio State University
