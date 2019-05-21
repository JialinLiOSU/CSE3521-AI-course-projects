//Perform iterative deepening search from initial state, using defined "is_goal_state"
//and "find_successors" functions
//Returns: null if no goal state found
//Returns: object with two members, "actions" and "states", where:
//  actions: Sequence(Array) of action ids required to reach the goal state from the initial state
//  states: Sequence(Array) of states that are moved through, ending with the reached goal state (and EXCLUDING the initial state)
//  The actions and states arrays should both have the same length.
function iterative_deepening_search(initial_state,depth_limit) {

  /***Your code for iterative deepening search here!***/

  let open = []; //See push()/pop() and unshift()/shift() to operate like stack or queue
                 //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
  let closed = new Set(); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set

  var state_temp,action_temp;
  let augmented_state_list=[];
  var augmented_state;
  var state_arr=[];
  var action_arr=[];
  /***Your code for breadth-first search here***/
  // The difference of bfs and dfs is the way to add and extract elements in open and closed
  aug_state_temp={
    state:initial_state,
    predecessor:null, 
    action:null,
    depth:0
  };
  open.push(aug_state_temp);
  while(open.length!=0 ){
    aug_state_temp=open.pop(); // pop up the last element in open
    if (aug_state_temp.depth>depth_limit){
      continue;
    }
    // if (closed.has(aug_state_temp)){
    //   continue;
    //   }
    if (!is_goal_state(aug_state_temp.state)){
      successors=find_successors(aug_state_temp.state);
      for (var i=0;i<successors.length;i++){
        suc=successors[i];
        augmented_state={
          state:suc.resultState,
          predecessor:aug_state_temp, //need a function to get the predecessor
          action:suc.actionID,
          depth:aug_state_temp.depth+1};
          
        open.push(augmented_state);
        // augmented_state_list.push(augmented_state);
      }
      closed.add(aug_state_temp);// all of the passed states are in closed set
    }else{
      state_arr.unshift(aug_state_temp.state);
      augmented_state_temp=aug_state_temp.predecessor;
      while (augmented_state_temp!=null){
        state_arr.unshift(augmented_state_temp.state);
        action_temp=augmented_state_temp.action;
        action_arr.unshift(action_temp);
        augmented_state_temp=augmented_state_temp.predecessor;
      }
      state_arr.shift();
      action_arr.shift();
      return {
        actions : action_arr/*array of action ids*/,
        states : state_arr/*array of states*/
      };
    }
  
  }

  console.log("No solution found!")
  return null;

  /*
    Hint: Re-use/call your depth-limited search function here to avoid extra work.
  */
}
