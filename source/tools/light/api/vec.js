
/*

  vec.js -- Scalar and Vector 3 Math
  Dave Wellsted
  NyteOwl Computer Software

  Updated: 2017-DEC-25

  Constants:
  
    TINY, HUGE, R2D, D2R
    
  Scalar Functions:
  
    deg2rad, rad2deg
    rnd, srnd, crnd, arnd
    sgn, sgnz, mid
    gamma, lerp
  
  Vector Functions:
  
    Make, Zero, Copy, Clone, Negate
    Dot, Cross, Len, LenSqr, Manhatten
    Add, Sub, Mul, S, AddS, Comb
    Normal, Normalize
    Parse, Print
    Midpoint2, Midpoint3
  
*/

// Singleton vector math object
const Vec = {}

// Constants
Vec.TINY = 1e-8;
Vec.HUGE = 1e+8;
Vec.D2R = ((Math.PI)/180);
Vec.R2D = (180/(Math.PI));

// Angle conversions
Vec.deg2rad = function(n) {
  return (n*Vec.D2R);
}
Vec.rad2deg = function(n) {
  return (n*Vec.R2D);
}

// Random number [0 ... 1]
Vec.rnd = function() {
  return Math.random();
}

// Random number [0 ... n]
Vec.srnd = function(n) {
  return (n*Vec.rnd());
}

// Random number [-n/2 ... +n/2]
Vec.crnd = function(n) {
  return (Vec.srnd(n)-(n*0.5));
}

// Random number [-PI/2 ... +PI/2]
Vec.arnd = function() {
  return (Vec.crnd(Math.PI));
}

// Misc. arithmetic
Vec.sgn = function(a) {
  return ((a<0)?(-1):(1));
}
Vec.sgnz = function(a) {
  return ((a<0)?(-1):((a>0)?(1):(0)));
}
Vec.mid = function(a,b,c) {
  return ((a<=b)?
    ((b<=c)?b:Math.max(a,c)):
    ((a<=c)?a:Math.max(b,c))
  );
}

// Gamma scalar function
Vec.gamma = function(n,nMax,gamma) {
  return (nMax*Math.pow(n/nMax,1/gamma))
}

// Lerp scalar function
Vec.lerp = function(n,a,b) {
  return ((n*a)+((1-n)*b))
}

// Duplicate vector
Vec.Clone = function(v) {
  return v?[v[0],v[1],v[2]]:[0,0,0];
}

// Vector initialization
Vec.Make = function(x, y, z, v) {
  (v)[0]=(x);
  (v)[1]=(y);
  (v)[2]=(z);
}

// Elementwise negate
Vec.Negate = function(a) {
  (a)[0]=(-(a)[0]);
  (a)[1]=(-(a)[1]);
  (a)[2]=(-(a)[2]);
}

// Dot product
Vec.Dot = function(a,b) {
  return ((a)[0]*(b)[0]+(a)[1]*(b)[1]+(a)[2]*(b)[2]);
}

// Vector length squared
Vec.LenSqr = function(a) {
  return (Vec.Dot(a,a));
}

// Vector length
Vec.Len = function(a) {
  return (Math.sqrt(Vec.LenSqr(a)));
}

// Copy a -> b
Vec.Copy = function(a,b) {
  (b)[0]=(a)[0];
  (b)[1]=(a)[1];
  (b)[2]=(a)[2];
}

// Elementwise add
Vec.Add = function(a,b,c) {
  (c)[0]=(a)[0]+(b)[0];
  (c)[1]=(a)[1]+(b)[1];
  (c)[2]=(a)[2]+(b)[2];
}

// Elementwise subtract
Vec.Sub = function(a,b,c) {
  (c)[0]=(a)[0]-(b)[0];
  (c)[1]=(a)[1]-(b)[1];
  (c)[2]=(a)[2]-(b)[2];
}

// Elementwise multiply
Vec.Mul = function(a,b,c) {
  (c)[0]=(a)[0]*(b)[0];
  (c)[1]=(a)[1]*(b)[1];
  (c)[2]=(a)[2]*(b)[2];
}

// A*a + B*b -> c
Vec.Comb = function(A,a,B,b,c) {
  (c)[0]=(A)*(a)[0]+(B)*(b)[0];
  (c)[1]=(A)*(a)[1]+(B)*(b)[1];
  (c)[2]=(A)*(a)[2]+(B)*(b)[2];
}

// A*a -> b
Vec.S = function(A,a,b) {
  (b)[0]=(A)*(a)[0];
  (b)[1]=(A)*(a)[1];
  (b)[2]=(A)*(a)[2];
}

// A*a + b -> c
Vec.AddS = function(A,a,b,c) {
  (c)[0]=(A)*(a)[0]+(b)[0];
  (c)[1]=(A)*(a)[1]+(b)[1];
  (c)[2]=(A)*(a)[2]+(b)[2];
}

// Left handed cross product
Vec.Cross = function(a,b,c) {
  (c)[0]=(a)[1]*(b)[2]-(a)[2]*(b)[1];
  (c)[1]=(a)[2]*(b)[0]-(a)[0]*(b)[2];
  (c)[2]=(a)[0]*(b)[1]-(a)[1]*(b)[0];
}

// Zero vector to 0 0 0
Vec.Zero = function(v) {
  (v)[0]=0.0;
  (v)[1]=0.0;
  (v)[2]=0.0;
}

// Normalize vector
Vec.Normal = function(a,b) {
  let len = Vec.LenSqr(a);
  if (len>Vec.TINY) {
    len = Math.sqrt(len);
    const t = 1 / len;
    b[0] = t * a[0];
    b[1] = t * a[1];
    b[2] = t * a[2];
  } 
  else {
    len = b[0] = 1.0;
    b[1] = b[2] = 0.0;
  }
  return (len);
}

// Normalize vector
Vec.Normalize = function(v) {
  return (Vec.Normal(v,v))
}

// Parse vector string (optionally normalize)
Vec.Parse = function(str,vec,normalize) {
  const ar = str.split(' ');
  function parse(i) {
    if (ar.length>i) {
      vec[i] = parseFloat(ar[i]);
    }
    else {
      vec[i] = 0;
    }
  }
  parse(0);
  parse(1);
  parse(2);
  if (normalize) {
    return Vec.Normalize(vec);
  }
  return 1;
}

// Format and print vector/number/string
Vec.Print = function(keyword,v,callback) {
  var msg;
  if (Array.isArray(v)) {
    msg = `${keyword} ${v[0]} ${v[1]} ${v[2]}`;
  }
  else if ('number' === typeof v) {
    msg = `${keyword} ${v}`;
  }
  else if ('string' === typeof v) {
    msg = `${keyword} ${v}`;
  }
  else {
    throw 'Invalid argument to Vec.Print()';
  }
  if ('function' === typeof callback) {
    callback(msg);
  }
  else {
    console.log(msg);
  }
}

// 3D line segment midpoint (JavaScript)
Vec.Midpoint2 = function(a,b,c) {
    c[0] = (a[0] + b[0]) / 2
    c[1] = (a[1] + b[1]) / 2
    c[2] = (a[2] + b[2]) / 2
    return c
}

// 3D triangle midpoint (JavaScript)
Vec.Midpoint3 = function(a,b,c,d) {
    d[0] = (a[0] + b[0] + c[0]) / 3
    d[1] = (a[1] + b[1] + c[1]) / 3
    d[2] = (a[2] + b[2] + c[2]) / 3
    return d
}

// Manhatten length
Vec.Manhatten = function(a) {
  return (a[0] + a[1] + a[2])
}  


