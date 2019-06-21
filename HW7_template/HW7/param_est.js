//We will be using the Numeric Javascript library for matrix,vector math
//Some functions you will need:
// numeric.add(a,b) : add two matrices or vectors together
// numeric.mul(a,b) : multiply a matrix or vector by a scalar
//                    (also, element-wise multiplication, but you won't need that)
// numeric.dot(a,b) : matrix-matrix or matrix-vector multiply
//					  (this is the one you will be using most! NOT mul() )
// numeric.transpose(a) : matrix transpose
// numeric.solve(M,b) : solve for and return vector x from M*x=b
//                      equivalently, return (M^-1)*b
// numeric.inv(M) : Find the inverse M^-1 of matrix M
//                  (Using solve() is generally more efficient than this, but you can use
//                   this if you find it less confusing.)
// console.log(numeric.prettyPrint(M)) : (Nicely) print matrix M to the console
// For a full reference, see: numericjs.com/documentation.html IN THE ZIP FILE

//Some notes on working with vectors and matrices:
//  Vectors are simple arrays. For example, use x[i] to access the i'th element of vector x.
//  Matrices are accessed in ROW-COLUMN fashion.
//    For example, use M[j][i] to access the element at COLUMN i and ROW j of matrix M.

//////////////////////////////////////////////////////////////////////////////

//Perform linear least squares for line equation: y=a*x+b
//return parameter array p, where p[0]=b and p[1]=a
function calc_linLSQ_line(data) {
  let N=numeric.dim(data)[0]; //Number of data points
  let x=squeeze_to_vector(numeric.getBlock(data,[0, 0],[N-1, 0])); //Extract x (dependent) values
  let y=squeeze_to_vector(numeric.getBlock(data,[0, 1],[N-1, 1])); //Extract y (target) values
  //Note: x and y are both vectors, use them accordingly.
  //(For this homework x is a vector, but generally speaking it may not be!)

  //Setup matrices/vectors for calculation
  let A=numeric.rep([N,2],0); //Make an empty (all zero) Nx2 matrix
  let b=numeric.rep([N],0); //Make an empty N element vector
  for(let i=0;i<N;++i) {
    /***********************
    * TASK: Fill in A and b
    *
    * Refer to slide 11 (and 10)
    *
    * Hint: BE CAREFUL of the order, what do the columns of A refer and relate to?
    ***********************/

    A[i][0]=??;
    A[i][1]=??;
    b[i]=??;
  }

  /***********************
  * TASK: Solve for parameters
  *
  * Refer to slides 18-19
  ***********************/
  let p=??;
  
  let sse=0;
  for(let i=0;i<N;++i) {
    let model_out=eval_line_func(x[i],p); //The output of the model function on data point i using
                                          //parameters p

    /***********************
    * TASK: Calculate the sum of squared error
    ***********************/
  }
  helper_log_write("SSE="+sse);
    
  return p;
}

//////////////////////////////////////////////////////////////////////////////

//Perform linear least squares for polynomial
//order: order of the polynomial
//return parameter array p, where p[0] is the constant term and p[order] holds the highest order coefficient
//(example: for quadratic a*x^2+b*x+c, order=2, p[0]=c, p[1]=b, p[2]=a)
function calc_linLSQ_poly(data,order) {
  let N=numeric.dim(data)[0];
  let x=squeeze_to_vector(numeric.getBlock(data,[0, 0],[N-1, 0])); //Extract x (dependent) values
  let y=squeeze_to_vector(numeric.getBlock(data,[0, 1],[N-1, 1])); //Extract y (target) values
  
  let A=numeric.rep([N,order+1],0);
  let b=numeric.rep([N],0);
  for(let i=0;i<N;++i) {
		/***********************
    * TASK: Fill in A and b
    *
    * Refer to your previous code, as well as slide 22
    *
    * Hint: In the case where order==1, this should give the same result
    *   as your calc_linLSQ_line() function
    ***********************/
    //A[i][0]=??;
    //A[i][1]=??;
    //...
    //A[i][order]=??;
    //b[i]=??;
  }
  
  /***********************
  * TASK: Solve for parameters and calculate SSE
  *
  * Re-use the code from your calc_linLSQ_line(), this part should be identical
  *  EXCEPT use instead the provided eval_poly_func(x,p) instead of eval_line_func
  */

  return p;
}

//////////////////////////////////////////////////////////////////////////////

//Calculate jacobian matrix for a*x^b+c*x+d
//p: parameter array where p[0]=d,...,p[3]=a
//return Jacobian matrix
function calc_jacobian(data,p) {
  let N=numeric.dim(data)[0];
  let x=squeeze_to_vector(numeric.getBlock(data,[0, 0],[N-1, 0])); //Extract x (dependent) values
  
  let J=numeric.rep([N,4],0);
  for(let i=0;i<N;++i) {
    /***********************
    * TASK: Implement the Jacobian you derived 
    *
    * Make sure columns of J follow same ordering as p
    *
    * Hint: You should use the built-in Math.pow() and Math.log() functions for this
    */
    //J[i][3]=??;
    //J[i][2]=??;
    //J[i][1]=??;
    //J[i][0]=??;
  }
  
  return J;
}

//////////////////////////////////////////////////////////////////////////////

//Peform Gauss-Newton non-linear least squares on polynomial a*x^b+c*x+d
//initial_p: contains initial guess for parameter values
//max_iterations: number of iterations to perform before stopping
//return final parameter array p, where p[0]=d,...,p[3]=a
function calc_nonlinLSQ_gaussnewton(data,initial_p,max_iterations) {
  let N=numeric.dim(data)[0];
  let x=squeeze_to_vector(numeric.getBlock(data,[0, 0],[N-1, 0])); //Extract x (dependent) values
  let y=squeeze_to_vector(numeric.getBlock(data,[0, 1],[N-1, 1])); //Extract y (target) values

  let p=initial_p.slice(0); //Make a copy, just to be safe
  let dy=numeric.rep([N],0);
  for(let iter=0;iter<=max_iterations;++iter) {
    //Step 1: Find error for current guess
    for(let i=0;i<N;++i) {
      /***********************
      * TASK: Calculate the error for each data point (actual error, NOT linearized!)
      *
      * Refer to slide 10
      *
      * Hint: You may use the provided function eval_nonlin_func(x,p) to evaluate
      *   our non-linear function
      */
      //dy[i]=??;
    }
    
    let sse=0;
    /***********************
    * TASK: Calculate SSE for each iteration
    *
    * Hint: Reuse/modify your code from previous problems.
    * Hint 2: Consider, perhaps you have already calculated part of what SSE needs?
    */
    helper_log_write("Iteration "+iter+": SSE="+sse);
    if(iter==max_iterations) break; //Only calculate SSE at end

    //Step 2: Find the Jacobian around the current guess
    let J=calc_jacobian(data,p);

    //Step 3: Calculate change in guess
    /***********************
    * TASK: Calculate change in guess
    * 
    * Again, slide 10
    *
    * Hint: Remember how similar this step was to linear least squares, perhaps you
    *   can alter/reuse some of your previous code?
    */
    //let dp=??;
    
    //Step 4: Make new guess
    /***********************
    * TASK: Apply the change in guess you calculated
    *
    * Slide 10, of course
    */
    //p=??;
  }
  return p;
}

//////////////////////////////////////////////////////////////////////////////

//Peform Gradient Descent non-linear least squares on polynomial a*x^b+c*x+d
//initial_p: contains initial guess for parameter values
//max_iterations: number of iterations to perform before stopping
//learning_rate: the learning rate (alpha) value to use
//return parameter array p, where p[0]=d,...,p[3]=a
function calc_nonlinLSQ_gradientdescent(data,initial_p,max_iterations,learning_rate) {
  let N=numeric.dim(data)[0];
  let x=squeeze_to_vector(numeric.getBlock(data,[0, 0],[N-1, 0])); //Extract x (dependent) values
  let y=squeeze_to_vector(numeric.getBlock(data,[0, 1],[N-1, 1])); //Extract y (target) values

  let p=initial_p.slice(0);
  let dy=numeric.rep([N],0);
  for(let iter=0;iter<=max_iterations;++iter) {
    //Note: You may find putting some code here, instead of with "Step 1", will make it
    //easier to calculate SSE. This is perfectly fine.
    
    let sse=0;
    /***********************
    * TASK: Calculate SSE for each iteration
    *
    * Hint: Reuse/modify your code from previous problems
    */
    helper_log_write("Iteration "+iter+": SSE="+sse);
    if(iter==max_iterations) break; //Only calculate SSE at end

    //Step 1: Compute gradient
    /***********************
    * TASK: Compute gradient
    *
    * See slide 24.
    *
    * Hint: You should be able to reuse some code here!
    */
    //let grad=??;

    //Step 2: Update parameters
    /***********************
    * TASK: Update parameters
    *
    * See slide 23.
    */
    //p=??;
  }
  return p;
}
