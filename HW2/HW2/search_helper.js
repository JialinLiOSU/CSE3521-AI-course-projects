//Copyright 2019 Joe Barker, Computer Science and Engineering, Ohio State University

var helper_eval_state_count = 0;
var helper_expand_state_count = 0;

function helper_verify_state() {
    helper_log_clear();
    if(!verify_state()) return;
    let s=read_state();
    
    helper_log_write("State is OK");
    helper_log_write(state_to_dom(s));
}

function helper_is_goal_state() {
  if(typeof is_goal_state !== 'function') helper_bad_function("is_goal_state");

  try {
    helper_log_clear();
    if(!verify_state()) return;
    let s=read_state();
    
    helper_eval_state_count=0;
    if(is_goal_state(s)) {
      helper_log_write("State IS goal state");
    } else {
      helper_log_write("State IS NOT goal state");
    }
    if(helper_eval_state_count==1)
      helper_log_write("Number of evaluated states is 1 (as expected).");
    else
      helper_log_write("Number of evaluated states is "+helper_eval_state_count+", not 1! (Did you forget to increment &quot;helper_eval_state_count&quot; in your check goal state function?)");

//    helper_log_write("Heuristic: "+calculate_heuristic(s));
  } catch(e) {
    helper_log_exception(e);
    throw e;
  }
}

function helper_find_successors() {
  if(typeof find_successors !== 'function') helper_bad_function("find_successors");
  try {
    helper_log_clear();
    if(!verify_state()) return;
    let s=read_state();
    
    helper_expand_state_count=0;
    let sucs=find_successors(s);
    if(sucs.length==0)
      helper_log_write("No successors");
    for(let i=0;i<sucs.length;++i) {
      let suc=sucs[i];
      if(i!=0)
        helper_log_write("-----------");
      helper_log_write("Action:");
      helper_log_write(action_to_dom(suc.actionID,s));
      helper_log_write("Resultant state:");
      helper_log_write(state_to_dom(suc.resultState));
    }
    
    helper_log_write("-----------");
    if(helper_expand_state_count==1)
      helper_log_write("Number of expanded states is 1 (as expected).");
    else
      helper_log_write("Number of expanded states is "+helper_expand_state_count+", not 1! (Did you forget to increment &quot;helper_expand_state_count&quot; in your successor function?)");
  } catch(e) {
    helper_log_exception(e);
    throw e;
  }
}

function helper_run(search_func) {
  helper_log_clear();
  try {
    if(!verify_state()) return;
    let s=read_state();

    helper_eval_state_count=0;
    helper_expand_state_count=0;
    let path=search_func(s);

    helper_log_write("Number of states evaluated="+helper_eval_state_count);
    helper_log_write("Number of states expanded="+helper_expand_state_count);
    if(path==null) {
      helper_log_write("-----------");
      helper_log_write("No solution found!");
    } else {
      helper_log_write("Path length="+(path.actions.length+1));
      helper_log_write("-----------");
      helper_log_write(state_to_dom(s));
      let lastS=s;
      for(let i=0;i<path.actions.length;++i) {
        helper_log_write("-----------");
        helper_log_write(action_to_dom(path.actions[i],lastS));
        helper_log_write("-----------");
        lastS=path.states[i];
        helper_log_write(state_to_dom(lastS));
      }
    }
  } catch(e) {
    helper_log_exception(e);
    throw e;
  }
}

function helper_run_bfs() {
  if(typeof breadth_first_search !== 'function') helper_bad_function("breadth_first_search");
  helper_run(breadth_first_search);
}

function helper_run_dls() {
  if(typeof depth_limited_search !== 'function') helper_bad_function("depth_limited_search");
  let limit_input=document.getElementById("input_dls_limit");
  let limit=parseInt(limit_input.value,10);
  helper_run(function(s){ return depth_limited_search(s,limit); });
}

function helper_run_ids() {
  if(typeof iterative_deepening_search !== 'function') helper_bad_function("iterative_deepening_search");
  helper_run(iterative_deepening_search);
}

function helper_run_astar() {
  if(typeof astar_search !== 'function') helper_bad_function("astar_search");
  helper_run(astar_search);
}

function helper_run_rnds() {
  if(typeof random_search !== 'function') helper_bad_function("random_search");
  
  let limit_input=document.getElementById("input_dls_limit");
  let limit=parseInt(limit_input.value,10);
  helper_run(function(s){ return random_search(s,limit); });
}

function helper_bad_function(name) {
  helper_log_clear();
  
  let obj=document.createElement("pre");
  obj.style.color='red';
  obj.appendChild(document.createTextNode("Unable to find function '"+name+"'.\n\nPlease check the "));
  obj.appendChild(document.createElement("a"));
  obj.lastChild.href="https://www.google.com/search?q=Javascript+console+"+platform.os.toString().replace(/\s+/g, '+')+"+"+platform.name.toString().replace(/\s+/g, '+');
  obj.lastChild.innerHTML="Javascript console";
  obj.appendChild(document.createTextNode(" console for more information."));
  
  helper_log_write(obj);
  
  throw "Aborted due to missing function";
}

function helper_log_clear() {
  let log=document.getElementById("log");
  log.innerHTML="";
}

//Append a string or HTML domain object to the onscreen log
function helper_log_write(str_or_domobj) {
  let obj;
  if (typeof str_or_domobj === 'string' || str_or_domobj instanceof String) {
    obj=document.createElement("p");
    obj.appendChild(document.createTextNode(str_or_domobj));
  }
  else
    obj=str_or_domobj;
    
  let log=document.getElementById("log");
  log.appendChild(obj);
}

function helper_log_exception(exception) {
  var exmsg = "";
  if (exception.message) {
    exmsg += exception.message;
  } else {
    exmsg += e;
  }
  if (exception.stack) {
    exmsg += '\n\nstack:\n' + exception.stack;
  }
  
  let obj=document.createElement("pre");
  obj.style.color="red";
  obj.appendChild(document.createTextNode(exmsg));
  obj.appendChild(document.createTextNode("\n\nThe "));
  obj.appendChild(document.createElement("a"));
  obj.lastChild.href="https://www.google.com/search?q=Javascript+console+"+platform.os.toString().replace(/\s+/g, '+')+"+"+platform.name.toString().replace(/\s+/g, '+');
  obj.lastChild.innerHTML="Javascript console";
  obj.appendChild(document.createTextNode(" console may contain more information."));
    
  let log=document.getElementById("log");
  log.appendChild(obj);

  //(console.error || console.log).call(console, e.stack || e);
}
