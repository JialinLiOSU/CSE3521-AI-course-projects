//Copyright 2017 Joe Barker, Computer Science and Engineering, Ohio State University

//////////////////////////////////////////////////////////////////////////////////////////////////
// Basic UI handling/manipulation functions

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
  var log=document.getElementById("log");
  log.innerHTML="";
}

//Write a string or DOM object to logging area of webpage
function helper_log_write(str_or_domobj) {
  var obj;
  if (typeof str_or_domobj === 'string' || str_or_domobj instanceof String) {
    obj=document.createElement("p");
    obj.appendChild(document.createTextNode(str_or_domobj));
  }
  else
    obj=str_or_domobj;
    
  var log=document.getElementById("log");
  log.appendChild(obj);
}

var mode='line';
function update_func(radio) {
  mode=radio.value;
  if(mode=='line') helper_show_domobj(document.getElementById("mode_line"));
  else helper_hide_domobj(document.getElementById("mode_line"));
  if(mode=='poly') {
    helper_show_domobj(document.getElementById("mode_poly"));
    update_poly_order();
  } else helper_hide_domobj(document.getElementById("mode_poly"));
  if(mode=='nonlin') helper_show_domobj(document.getElementById("mode_nonlin"));
  else helper_hide_domobj(document.getElementById("mode_nonlin"));
  helper_log_clear();
  replot();
}

var poly_order=4;
function update_poly_order() {
  poly_order=parseInt(document.getElementById("input_poly_order").value,10);
  
  var s="";
  for(var i=poly_order;i>=0;--i) {
    if(i!=poly_order)
      s+=" + ";
    var cname=String.fromCharCode( 97 + (poly_order-i) );
    s+=cname;
    if(i>=1)
      s+="*x";
    if(i>=2)
      s+="<sup>"+i+"</sup>";
      
    helper_show_domobj(document.getElementById("ui_poly_"+cname));
  }
  document.getElementById("ui_poly_func").innerHTML=s;
  
  for(var i=poly_order+1;i<=4;++i) {
    var cname=String.fromCharCode( 97 + i );
    helper_hide_domobj(document.getElementById("ui_poly_"+cname));
  }
  
  helper_log_clear();
  replot();
}

function squeeze_to_vector(x) {
  let d=numeric.dim(x);
  if(d.length==1)
    return x;
  if(d.length!=2)
    throw "tensors of order > 2 not supported";

  if(d[0]==1)
    return x[0];
  if(d[1]!=1)
    throw "not a column or row vector";
  return x.map(e => e[0]);
}

function get_line_params() {
  var p=[];
  for(var i=0;i<=1;++i) {
    var cname=String.fromCharCode( 97 + (1-i) );
    p.push(parseFloat(document.getElementById("input_line_"+cname).value));
  }
  return p;
}
function set_line_params(p) {
  for(var i=0;i<=1;++i) {
    var cname=String.fromCharCode( 97 + (1-i) );
    document.getElementById("input_line_"+cname).value=p[i].toString();
  }
}
function eval_line_func(x,p) {
  if(numeric.dim(p).length!=1)
    p=squeeze_to_vector(p);

  return p[0]+p[1]*x;
}

function get_poly_params() {
  var p=[];
  for(var i=0;i<=poly_order;++i) {
    var cname=String.fromCharCode( 97 + (poly_order-i) );
    p.push(parseFloat(document.getElementById("input_poly_"+cname).value));
  }
  return p;
}
function set_poly_params(p) {
  for(var i=0;i<=poly_order;++i) {
    var cname=String.fromCharCode( 97 + (poly_order-i) );
    document.getElementById("input_poly_"+cname).value=p[i].toString();
  }
}
function eval_poly_func(x,p) {
  if(numeric.dim(p).length!=1)
    p=squeeze_to_vector(p);

  let y=0;
  for(let j=p.length-1;j>=0;--j)
    y=y*x+p[j];
  return y;
}

function get_nonlin_params() {
  var p=[];
  for(var i=0;i<=3;++i) {
    var cname=String.fromCharCode( 97 + (3-i) );
    p.push(parseFloat(document.getElementById("input_nonlin_"+cname).value));
  }
  return p;
}
function set_nonlin_params(p) {
  for(var i=0;i<=3;++i) {
    var cname=String.fromCharCode( 97 + (3-i) );
    document.getElementById("input_nonlin_"+cname).value=p[i].toString();
  }
}
function eval_nonlin_func(x,p) {
  if(numeric.dim(p).length!=1)
    p=squeeze_to_vector(p);
  return p[0]+p[1]*x+p[3]*Math.pow(x,p[2]);
}

var data = [ [0.5, 0.327], [1.5, 1.169], [2.5, 2.326], [3.5, 3.724], [4.5, 5.323] ];
var plot;

function replot() {
  var xrng=[Infinity, -Infinity];
  var yrng=[Infinity, -Infinity];
  for(var i=0;i<data.length;++i) {
    xrng[0]=Math.min(xrng[0], data[i][0]);
    xrng[1]=Math.max(xrng[1], data[i][0]);
    yrng[0]=Math.min(yrng[0], data[i][1]);
    yrng[1]=Math.max(yrng[1], data[i][1]);
  }
  var c=(xrng[0]+xrng[1])/2;
  xrng=[ (xrng[0]-c)*1.25+c, (xrng[1]-c)*1.25+c ];
  c=(yrng[0]+yrng[1])/2;
  yrng=[ (yrng[0]-c)*1.25+c, (yrng[1]-c)*1.25+c ];

  var fv=numeric.rep([101,2],0);
  var p;
  var func;
  if(mode=='line') {
    p=get_line_params();
    func=eval_line_func;
  } else if(mode=='poly') {
    p=get_poly_params();
    func=eval_poly_func;
  } else /*if(mode=='nonlin')*/ {
    p=get_nonlin_params();
    func=eval_nonlin_func;
  }
  for(var i=0;i<=100;++i) {
    var x=xrng[0]*(i/100) + xrng[1]*((100-i)/100);
    var y=func(x,p);
    fv[i][0]=x;
    fv[i][1]=y;
  }
  plot=$.plot("#plot-placeholder", [ {
    label : "data",
    data : data,
    color : "rgb(255,0,0)",
    lines : { show : false },
    points : { show : true }
  },{
    label : "fit",
    data : fv,
    color : "rgb(0,0,0)",
    lines : { show : true },
    points : { show : false }
  }],{
    canvas: true,
    axisLabels: {
      show: true
    },
    xaxis : {
      axisLabelUseCanvas: true,
      min : xrng[0],
      max : xrng[1]
    },
    yaxis : {
      axisLabelUseCanvas: true,
      min : yrng[0],
      max : yrng[1]
    }
  });
}

function setup() {
  update_poly_order();
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function do_lsq_line() {
  helper_log_clear();
  var p=calc_linLSQ_line(data);

  set_line_params(p);

  replot();
}

function do_lsq_poly() {
  helper_log_clear();
  var p=calc_linLSQ_poly(data,poly_order);
  
  set_poly_params(p);

  replot();
}

function do_lsq_nonlin_gn() {
  var iterLim=document.getElementById("input_gn_iterations").value;
  var p=get_nonlin_params();

  helper_log_clear();
  p=calc_nonlinLSQ_gaussnewton(data,p,iterLim);
  
  set_nonlin_params(p);

  replot();
}

function do_lsq_nonlin_gn_anim() {
  var iterLim=document.getElementById("input_gn_iterations").value;
  var init_p=get_nonlin_params();

  var step;
  step=function(ilim) {
    helper_log_clear();
    var p=calc_nonlinLSQ_gaussnewton(data,init_p,ilim);
    
    set_nonlin_params(p);

    replot();
    
    if(ilim<iterLim)
      window.setTimeout(function() { step(ilim+1); },1000);
  };
  step(0);
}

function do_lsq_nonlin_gd() {
  var iterLim=document.getElementById("input_gd_iterations").value;
  var alpha=parseFloat(document.getElementById("input_gd_alpha").value);
  var p=get_nonlin_params();

  helper_log_clear();
  p=calc_nonlinLSQ_gradientdescent(data,p,iterLim,alpha);
  
  set_nonlin_params(p);

  replot();
}
//////////////////////////////////////////////////////////////////////////////////////////////////

function savePlot() {
  var canvas = plot.getCanvas();
  canvas.toBlob(function(blob) {
      saveAs(blob, "data_curve_plot.png");
  });
}

function startEnterData() {
//NI
}

function stopEnterData() {
//NI
}

function loadData() {
//NI
}
