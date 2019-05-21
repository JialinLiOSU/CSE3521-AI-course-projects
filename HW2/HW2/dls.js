//Perform depth-limited search from initial state, using defined "is_goal_state"
//and "find_successors" functions
//Will not examine paths longer than "depth_limit" (i.e. paths that have "depth_limit" states in them, or "depth_limit-1" actions in them)
//Returns: null if no goal state found
//Returns: object with two members, "actions" and "states", where:
//  actions: Sequence(Array) of action ids required to reach the goal state from the initial state
//  states: Sequence(Array) of states that are moved through, ending with the reached goal state (and EXCLUDING the initial state)
//  The actions and states arrays should both have the same length.
function depth_limited_search(initial_state,depth_limit) {

  /***Your code for depth-limited search here!***/
  let open = []; //See push()/pop() and unshift()/shift() to operate like stack or queue
                 //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
  let closed = new Set(); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set

  var state_temp,action_temp;
  let augmented_state_list=[];
  var augmented_state;
  var state_arr=[];
  var action_arr=[];
  var depth=0;
  /***Your code for breadth-first search here***/
  // The difference of bfs and dfs is the way to add and extract elements in open and closed
  open.push(initial_state);
  while(open.length!=0){
    state_temp=open.pop();
    if (closed.has(state_temp)){
      continue;
      }
    if (!is_goal_state(state_temp)){
      successors=find_successors(state_temp);
      depth=depth+1;//maybe not correct
      for (var i=0;i<successors.length;i++){
        suc=successors[i];
        open.push(suc.resultState);
        augmented_state={
          state:suc.resultState,
          predecessor:state_temp, 
          action:suc.actionID,
          depth:depth
        };
        augmented_state_list.push(augmented_state);
      }
      closed.add(state_temp);
    }else{
      state_arr.unshift(state_temp);
      augmented_state_temp=find_state(augmented_state_list,state_temp);
      while (augmented_state_temp!=null){
        state_temp=augmented_state_temp.predecessor;
        state_arr.unshift(state_temp);
        action_temp=augmented_state_temp.action;
        action_arr.unshift(action_temp);
        augmented_state_temp=find_state(augmented_state_list,state_temp);
      }
      action_arr.shift();
      state_arr.shift();
      return {
        actions : action_arr/*array of action ids*/,
        states : state_arr/*array of states*/
      };
    }
  
  }

  console.log("No solution found!")
  return null;
  /***DO NOT do repeated state or loop checking!***/
  
  /*
    Hint: You may implement DLS either iteratively (with open set) or recursively.
    
    In the iterative case, you will need to do similar to breadth-first search and augment
    the state. In addition to predecessor and action, you will also need to store depth.
    (You should be able to re-use your BFS code and only make a small amount of changes to
     accomplish this. Be sure to remove repeat checking!)

    In the recursive case, you don't need the above. Building the solution path is a little
    trickier, but I suggest you look into the Array.unshift() function.
  */
}
