/*
================
8-puzzle problem
================

This file provides support function needed by the 8-puzzle framework. This
should not be modified so we separate it from the code students are supposed
to change.
*/

//Check that state input has valid values, outputs descriptive text if not
//Returns: true if input ok
function verify_state() {
  let s=read_state();

  let cnt=Array(10).fill(0);
  for(let j=0;j<3;++j)
    for(let i=0;i<3;++i) {
      let pos="Row "+j+", Col "+i;
      if(isNaN(s.grid[j][i])) {
        helper_log_write(pos+" is not a number");
        return false;
      }
      if(s.grid[j][i] < 0 || s.grid[j][i] > 8) {
        helper_log_write(pos+" is out of range");
        return false;
      }
      ++cnt[s.grid[j][i]];
    }
  
  for(let i=0;i<9;++i) {
    let val=""+i;
    if(i==0) val="blank";
    if(cnt[i]==0) {
      helper_log_write("Missing "+val);
      return false;
    }
    if(cnt[i]>1) {
      helper_log_write("Too many "+val+"s");
      return false;
    }
  }
  
  //Count inversions to see if puzzle is solveable
  let inv=0;
  let g=[];
  for(let j=0;j<3;++j)
    for(let i=0;i<3;++i)
      g.push(s.grid[j][i]);
  g=g.filter(function(x){return x>0;});
  for(let i=0;i<8;++i)
    for(let j=i+1;j<8;++j)
      if(g[i]>g[j]) ++inv;
  if(inv%2==0) {
    helper_log_write("Not solveable");
    return false;
  }
  
  return true;
}

//Construct state object from page input
//Returns: state object
function read_state() {
  let grid=Array(3).fill(0).map(x => Array(3));
  for(let k=0;k<9;++k) {
    let input=document.getElementById("input_pos"+k);
    let j=Math.floor(k/3);
    let i=k%3;
    if(input.value=="") grid[j][i]=0;
    else grid[j][i]=parseInt(input.value,10);
  }
  return {
    grid : grid
  };
}

//Convert state to a DOM object suitable for display on web page
//Returns: DOM object
function state_to_dom(s) {
  try {
    let html="";
    for(let j=0;j<3;++j) {
      for(let i=0;i<3;++i) {
        html+=" ";
        if(s.grid[j][i]==0) html+=" ";
        else html+=s.grid[j][i];
      }
      html+="\n";
    }
    let obj=document.createElement("pre");
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
	  let bi,bj;
	  if(on_state!=null) {
      for(let ij=0;ij<9;++ij) {
        bj=Math.floor(ij/3);
        bi=ij%3;
        if(on_state.grid[bj][bi]==0) break;
      }
	  }
	  switch(actionID) {
		case 1:
		  if(on_state==null) obj.innerHTML="Move tile above blank down";
		  else obj.innerHTML="Move "+on_state.grid[bj-1][bi]+" down";
		  break;
		case 2:
		  if(on_state==null) obj.innerHTML="Move tile below blank up";
		  else obj.innerHTML="Move "+on_state.grid[bj+1][bi]+" up";
		  break;
		case 3:
		  if(on_state==null) obj.innerHTML="Move tile left of blank right";
		  else obj.innerHTML="Move "+on_state.grid[bj][bi-1]+" right";
		  break;
		case 4:
		  if(on_state==null) obj.innerHTML="Move tile right of blank left";
		  else obj.innerHTML="Move "+on_state.grid[bj][bi+1]+" left";
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
    let id=0;
    for(let j=0;j<3;++j)
      for(let i=0;i<3;++i) {
        id*=9;
        id+=state.grid[j][i];
      }
    return id;
  } catch(e) {
    helper_log_exception(e);
	  throw e;
    return null;
  }
}

//Copyright 2019 Joe Barker, Computer Science and Engineering, Ohio State University
