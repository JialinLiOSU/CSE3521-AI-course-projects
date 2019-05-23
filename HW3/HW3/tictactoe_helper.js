//Copyright 2019 Joe Barker, Computer Science and Engineering, Ohio State University

var helper_eval_state_count = 0;
var helper_expand_state_count = 0;

var game_board;
var human_player;

function helper_check_student_source() {
  if( typeof tictactoe_minimax === 'function' && typeof is_terminal === 'function' &&
      typeof utility === 'function' && typeof tictactoe_minimax_alphabeta === 'function' ) {
    return;
  }

  let obj=document.createElement("pre");
  obj.style.color='red';
  obj.appendChild(document.createTextNode("Failed to load 'tictactoe.js', possible syntax error.\n\nPlease check the "));
  obj.appendChild(document.createElement("a"));
  obj.lastChild.href="https://www.google.com/search?q=Javascript+console+"+platform.os.toString().replace(/\s+/g, '+')+"+"+platform.name.toString().replace(/\s+/g, '+');
  obj.lastChild.innerHTML="Javascript console";
  obj.appendChild(document.createTextNode(" console for more information."));
  
  helper_log_write(obj);
}

//Toggle button value for initial board state setup
function helper_initboard_click(pos) {
  let input=document.getElementById("input_initboard_pos"+pos);
  switch(input.innerHTML) {
    case "":
      input.innerHTML="X";
      break;
    case "X":
      input.innerHTML="O";
      break;
    //case "O":
    default:
      input.innerHTML="";
  }
}

//Read button values for initial board state setup, plus other setup info
function parse_setup() {
  helper_log_clear();

  //Parse initial board
  game_board=[];
  for(let i=0;i<9;++i) {
    let input=document.getElementById("input_initboard_pos"+i);
    switch(input.innerHTML) {
      case "":
        game_board[i]=-1;
        break;
      case "X":
        game_board[i]=0;
        break;
      case "O":
        game_board[i]=1;
        break;
      default:
        helper_log_write("Unregonized board value: "+input.innerHTML);
        helper_log_write("Aborting...");
        return false;
    }
  }
  //Check board state
  let cntX=0;
  let cntO=0;
  for(let i=0;i<9;++i) {
    if(game_board[i]==0) ++cntX;
    else if(game_board[i]==1) ++cntO;
  }
  if(cntX!=cntO && (cntX-1)!=cntO) {
    if(cntX>cntO) helper_log_write("X has too many turns, please fix initial board");
    else helper_log_write("O has too many turns, please fix initial board");
    helper_log_write("Aborting...");
    return false;
  }
  
  //Player setup
  let input_order=document.getElementById("input_order_X");
  human_player=input_order.checked?0:1;
  
  return true;
}

//Run game
function game_start() {
  if(!parse_setup()) return;
  
  game_nextturn();
}

//Setup next turn
function game_nextturn() {
  //Find current turn
  let turn=0;
  for(let i=0;i<9;++i) {
    if(game_board[i]!=-1) ++turn;
  }
  helper_log_write("Turn "+turn+":");
  helper_log_board(game_board);
  
  let ui_startgame=document.getElementById("ui_startgame");
  let ui_humanturn=document.getElementById("ui_humanturn");
  let ui_cputurn=document.getElementById("ui_cputurn");
  
  let game_board_is_terminal;
  try {
    game_board_is_terminal=is_terminal(game_board)
  } catch(e) {
    helper_log_exception(e);
    throw e;
    return;
  }            
  if(game_board_is_terminal) {
    //Game finished
    helper_log_write("Game complete.");
    let u;
    try {
      u=utility(game_board,human_player);
    } catch(e) {
      helper_log_exception(e);
      throw e;
      return;
    }            
    if(u>0) helper_log_write("Human won.");
    else if(u<0) helper_log_write("CPU won.");
    else helper_log_write("Draw.");

    helper_show_domobj(ui_startgame);
    helper_hide_domobj(ui_humanturn);
    helper_hide_domobj(ui_cputurn);
  } else if(turn%2 == human_player) {
    //Human turn
    for(let i=0;i<9;++i) { //Configure input
      let input_playermove=document.getElementById("input_playermove_pos"+i);
      let disp_board=document.getElementById("disp_board_pos"+i);
      if(game_board[i]===-1) { //Empty, show selection button
        input_playermove.innerHTML=(human_player===0)?"X":"O";
        helper_show_domobj(input_playermove);
        helper_hide_domobj(disp_board);
      } else { //Not empty, show value
        disp_board.innerHTML=(game_board[i]===0)?"X":"O";
        helper_hide_domobj(input_playermove);
        helper_show_domobj(disp_board);
      }
    }
    
    helper_hide_domobj(ui_startgame);
    helper_show_domobj(ui_humanturn);
    helper_hide_domobj(ui_cputurn);
    helper_log_write("Waiting on human player...");
  } else {
    //CPU turn
    helper_hide_domobj(ui_startgame);
    helper_hide_domobj(ui_humanturn);
    helper_show_domobj(ui_cputurn);
    helper_log_write("Waiting on CPU player...");

    requestAnimationFrame(function() {
      requestAnimationFrame(function() { //Do in (2nd) anim callback to let screen update before hogging cpu
        helper_eval_state_count=0;
        helper_expand_state_count=0;
        let cpu_player=1-human_player;
        
        let results;
        try {
          if(document.getElementById("input_cpumode_mm").checked)
            results=tictactoe_minimax(game_board.slice(0),cpu_player,cpu_player);
          else
            results=tictactoe_minimax_alphabeta(game_board.slice(0),cpu_player,cpu_player,-Infinity,Infinity);
          helper_log_write("Complete. (Evaluated "+helper_eval_state_count+" states, Expanded "+helper_expand_state_count+" states)");
          helper_log_write("CPU selects position "+results.move+" (Expected utility score "+results.score+")");
          game_board[results.move]=cpu_player;
        } catch(e) {
          helper_log_exception(e);
          throw e;
          return;
        }            
        game_nextturn();
      });
    });
  }
}

//Act on human player pressing button to choose move
function game_playermove(pos) {
  helper_log_write("Player selects position "+pos);
  game_board[pos]=human_player;
  game_nextturn();
}

//Run a debug function that students can use to check pieces of their code
function do_debug() {
  if(!parse_setup()) return;

  try {
    debug(game_board,human_player);
  } catch(e) {
    helper_log_exception(e);
    throw e;
    return;
  }            
}

//Helper function to hide DOM object
function helper_hide_domobj(obj) {
  obj.style.display='none';
}

//Helper function to show DOM object
function helper_show_domobj(obj) {
  obj.style.display='';
}

//Clear logging area of webpage
function helper_log_clear() {
  let log=document.getElementById("log");
  log.innerHTML="";
}

//Write a string or DOM object to logging area of webpage
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

//Write a game board to logging area of webpage
function helper_log_board(b) {
  let bd=document.getElementById("ui_boarddisplay");
  bd=bd.firstElementChild; //Grab object inside
  bd=bd.cloneNode(true);
  
  for(let i=0;i<9;++i) {
    let d=bd.getElementById("boarddisplay_pos"+i);
    switch(b[i]) {
      case -1:
        d.innerHTML="";
        break;
      case 0:
        d.innerHTML="X";
        break;
      case 1:
        d.innerHTML="O";
        break;
    }
  }
  helper_log_write(bd);
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

//Silly that this is missing just because someone
//decided duplicate id's weren't allowed. Apparently
//they never considered what would happen w/ the
//cloneNode() function
Element.prototype.getElementById=function(id) {
  if(this.getAttribute('id')==id)
    return this;
  let c=this.children;
  for(let i=0;i<c.length;++i) {
    let obj=c[i].getElementById(id);
    if(obj!==null) return obj;
  }
  return null;
}
