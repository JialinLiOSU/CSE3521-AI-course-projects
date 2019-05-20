//Perform "random" search from initial state, using defined "is_goal_state"
//and "find_successors" functions
//Will not examine paths longer than "depth_limit"
//Returns: null if no goal state found
//Returns: object with two members, "actions" and "states", where:
//  actions: Sequence(Array) of action ids required to reach the goal state from the initial state
//  states: Sequence(Array) of states that are moved through, ending with the reached goal state (and excluding the initial state)
function random_search(initial_state,depth_limit) {
  //NOTE: This function searches by choosing random actions to explore. This is a TERRIBLE idea!!!
  //But it does serve as an example of how o work with the is_goal_state and find_successor
  //functions, as well as how to build the expected return value object
  
  if(is_goal_state(initial_state)) //Maybe we started at the goal?
    return {
      actions : [],
      states : []
    };

  // Build a path by randomly walking from state to state
  let actions=[];
  let states=[initial_state];

  for(let i=1;i<depth_limit;++i) {
    let sucs=find_successors(states[states.length-1]); //What options do we have to choose from?
    if(sucs.length==0)
      break; //stuck
        
    let idx=Math.floor(Math.random()*sucs.length); //Choose a random action
    //Add it to our path
    actions.push(sucs[idx].actionID);
    states.push(sucs[idx].resultState);
    
    if(is_goal_state(sucs[idx].resultState)) //Did we get lucky?
      break;
  }

  if(is_goal_state(states[states.length-1])) {
 	//Miraculously, we managed to find a solution!
	//http://en.wikipedia.org/wiki/Infinite_monkey_theorem
  
    //States sequence should not include initial state, so fix that first
    states.shift();
    //Build return object
    return {
      actions : actions,
      states : states
    };
  }

  return null; //No solution found
}

//Copyright 2019 Joe Barker, Computer Science and Engineering, Ohio State University
