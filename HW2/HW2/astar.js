//Perform breadth-first search from initial state, using defined "is_goal_state"
//and "find_successors" functions
//Returns: null if no goal state found
//Returns: object with two members, "actions" and "states", where:
//  actions: Sequence(Array) of action ids required to reach the goal state from the initial state
//  states: Sequence(Array) of states that are moved through, ending with the reached goal state (and EXCLUDING the initial state)
//  The actions and states arrays should both have the same length.
function astar_search(initial_state) {
  let open = new FastPriorityQueue(function(a,b) { return a.estimated_total_cost < b.estimated_total_cost; });
  let closed = new Set();
  let fixed_step_cost = 1; //Assume action cost is constant

  /***Your code for A* search here***/

  var action_temp;
  var augmented_state;
  var state_arr=[];
  var action_arr=[];
  /***Your code for breadth-first search here***/
  // The difference of bfs and dfs is the way to add and extract elements in open and closed
  est_total_cost=calculate_heuristic(initial_state)+calculate_g(initial_state,initial_state);
  augmented_init_state={
    state:initial_state,
    predecessor:null, 
    action:null,
    estimated_total_cost:est_total_cost
  };
  open.add(augmented_init_state);
  while(open.length!=0){
    aug_state_temp=open.poll();
    // if (closed.has(aug_state_temp)){
    //   continue;
    //   }
    if (!is_goal_state(aug_state_temp.state)){
      successors=find_successors(aug_state_temp.state);
      for (var i=0;i<successors.length;i++){
        suc=successors[i];
        est_cost_temp=calculate_heuristic(suc.resultState)+calculate_g(suc.resultState,initial_state);
        augmented_state={
          state:suc.resultState,
          predecessor:aug_state_temp, //need a function to get the predecessor
          action:suc.actionID,
          estimated_total_cost:est_cost_temp};
        open.add(augmented_state);
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
    Hint: A* is very similar to BFS, you should only need to make a few small modifications to your BFS code.
	
    You will need to add values to your augmented state for path cost and estimated total cost.
    I suggest you use the member name "estimated_total_cost" so that the above priority queue code will work.
    
    Call function calculate_heuristic(state) (provided for you) to calculate the heuristic value for you.
	
    See (included) FastPriorityQueue.js for priority queue usage example.
  */

  //No solution found
  // return null;
}
