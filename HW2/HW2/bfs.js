//Perform breadth-first search from initial state, using defined "is_goal_state"
//and "find_successors" functions
//Returns: null if no goal state found
//Returns: object with two members, "actions" and "states", where:
//  actions: Sequence(Array) of action ids required to reach the goal state from the initial state
//  states: Sequence(Array) of states that are moved through, ending with the reached goal state (and EXCLUDING the initial state)
//  The actions and states arrays should both have the same length.
function breadth_first_search(initial_state) {
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
  augmented_init_state={
    state:initial_state,
    predecessor:null, 
    action:null
  };
  open.push(augmented_init_state);
  while(open.length!=0){
    aug_state_temp=open.shift();
    if (closed.has(aug_state_temp)){
      continue;
      }
    if (!is_goal_state(aug_state_temp.state)){
      successors=find_successors(aug_state_temp.state);
      for (var i=0;i<successors.length;i++){
        suc=successors[i];
        augmented_state={
          state:suc.resultState,
          predecessor:aug_state_temp, //need a function to get the predecessor
          action:suc.actionID};
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

  /*
    Hint: In order to generate the solution path, you will need to augment
      the states to store the predecessor/parent state they were generated from
      and the action that generates the child state from the predecessor state.
      
	  For example, make a wrapper object that stores the state, predecessor and action.
	  Javascript objects are easy to make:
		let object={
			member_name1 : value1,
			member_name2 : value2
		};
      
    Hint: Because of the way Javascript Set objects handle Javascript objects, you
      will need to insert (and check for) a representative value instead of the state
      object itself. The state_to_uniqueid function has been provided to help you with
      this. For example
        let state=...;
        closed.add(state_to_uniqueid(state)); //Add state to closed set
        if(closed.has(state_to_uniqueid(state))) { ... } //Check if state is in closed set
  */
  
  /***Your code to generate solution path here***/
  //OR
  //No solution found
  console.log("No solution found!")
  return null;
}