/*
================
Two jugs problem
================
Using two jugs of varying size (7 gal & 3 gal), get exactly 1 gallon of water in the smaller jug.

State:
{
  jug1_volume : Integer [0,7],
  jug2_volume : Integer [0,3]
}

Possible actions:
ID | Action
---+----------------------
 1 | Fill jug2 from jug1
---+----------------------
 2 | Fill jug1 from jug2
---+----------------------
 3 | Empty jug1
---+----------------------
 4 | Empty jug2
---+----------------------
 5 | Fill jug1 from tap
---+----------------------
 6 | Fill jug2 from tap
*/

//Check if the given state is a goal state
//Returns: true if is goal state
function is_goal_state(state) {
  ++helper_eval_state_count; //Keep track of how many states are evaluated
  return state.jug2_volume==1;
}

//Find the list of actions that can be performed from the given state and the new
//states that result from each of those actions
//Returns: Array of successor objects (where each object has a valid actionID member and corresponding resultState member)
function find_successors(state) {
  ++helper_expand_state_count; //Keep track of how many states are expanded
  
  let successors=[];

/*
  successors.push({
    actionID : 0,
    resultState : {}
  });
*/
  if(state.jug1_volume > 0 && state.jug2_volume < 3) {
    //Fill jug2 from jug1 (if there's room)
    let j2=state.jug2_volume+state.jug1_volume;
    j2=Math.min(j2,3);
    let j1=state.jug1_volume-(j2-state.jug2_volume);
    successors.push({
      actionID : 1,
      resultState : {
        jug1_volume : j1,
        jug2_volume : j2
      }
    });
  }
  if(state.jug2_volume > 0 && state.jug1_volume < 7) {
    //Fill jug1 from jug2 (if there's room)
    let j1=state.jug1_volume+state.jug2_volume;
    j1=Math.min(j1,7);
    let j2=state.jug2_volume-(j1-state.jug1_volume);
    successors.push({
      actionID : 2,
      resultState : {
        jug1_volume : j1,
        jug2_volume : j2
      }
    });
  }
  if(state.jug1_volume > 0) {
    //Empty jug1 (if it's not already empty)
    successors.push({
      actionID : 3,
      resultState : {
        jug1_volume : 0,
        jug2_volume : state.jug2_volume
      }
    });
  }
  if(state.jug2_volume > 0) {
    //Empty jug2 (if it's not already empty)
    successors.push({
      actionID : 4,
      resultState : {
        jug1_volume : state.jug1_volume,
        jug2_volume : 0
      }
    });
  }
  if(state.jug1_volume < 7) {
    //Fill jug1 (if there's room)
    successors.push({
      actionID : 5,
      resultState : {
        jug1_volume : 7,
        jug2_volume : state.jug2_volume
      }
    });
  }
  if(state.jug2_volume < 3) {
    //Fill jug2 (if there's room)
    successors.push({
      actionID : 6,
      resultState : {
        jug1_volume : state.jug1_volume,
        jug2_volume : 3
      }
    });
  }
  
  return successors;
}

function calculate_heuristic(state) {
  if(state.jug2_volume==1) return 0;
  else if(state.jug1_volume+state.jug2_volume<1) return 2; //Atleast one fill and one pour
  else if(state.jug1_volume>1) return 2; //Atleast one use of each jug
  return 1; //Otherwise, need atleast one more action
}

//////////////////////////////////////////////////////////////////////////////

//Check that state input has valid values, outputs descriptive text if not
//Returns: true if input ok
function verify_state() {
  let s=read_state();
  
  if(isNaN(s.jug1_volume)) {
    helper_log_write("Jug 1 volume not a number");
    return false;
  }
  if(isNaN(s.jug2_volume)) {
    helper_log_write("Jug 2 volume not a number");
    return false;
  }
  if(s.jug1_volume < 0 || s.jug1_volume > 7) {
    helper_log_write("Jug 1 volume out of range");
    return false;
  }
  if(s.jug2_volume < 0 || s.jug2_volume > 3) {
    helper_log_write("Jug 2 volume out of range");
    return false;
  }
  return true;
}

//Construct state object from page input
//Returns: state object
function read_state() {
  let jug1_input=document.getElementById("input_jug1");
  let jug2_input=document.getElementById("input_jug2");
  
  return {
    jug1_volume : parseInt(jug1_input.value,10),
    jug2_volume : parseInt(jug2_input.value,10)
  };
}

//Convert state to a DOM object suitable for display on web page
//Returns: DOM object
function state_to_dom(s) {
  try {
    let html="Jug 1 volume: ";
    html+=s.jug1_volume;
    html+="<br>";
    html+="Jug 2 volume: ";
    html+=s.jug2_volume;
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
        if(on_state==null) obj.innerHTML="Fill Jug 2 from Jug 1";
        else obj.innerHTML="Pour "+Math.min(on_state.jug1_volume,3-on_state.jug2_volume)+"gal from Jug 1 into Jug 2";
        break;
      case 2:
        if(on_state==null) obj.innerHTML="Fill Jug 1 from Jug 2";
        else obj.innerHTML="Pour "+Math.min(on_state.jug2_volume,7-on_state.jug1_volume)+"gal from Jug 2 into Jug 1";
        break;
      case 3:
        obj.innerHTML="Empty Jug 1";
        break;
      case 4:
        obj.innerHTML="Empty Jug 2";
        break;
      case 5:
        obj.innerHTML="Fill Jug 1";
        break;
      case 6:
        obj.innerHTML="Fill Jug 2";
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
    return state.jug1_volume*8 + state.jug2_volume;
  } catch(e) {
    helper_log_exception(e);
    throw e;
    return null;
  }
}

//Copyright 2019 Joe Barker, Computer Science and Engineering, Ohio State University
