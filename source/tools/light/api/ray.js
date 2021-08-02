
/*

  ray.js
  Ray factory singleton
  Dave Wellsted, NyteOwl Computer Software
  2017-DEC-26

*/

const Ray = {
  // Create a ray origin pt and end at
  create: function(pt,at) {
    const n = [0,0,0]
    Vec.Sub(at,pt,n)
    const t = Vec.Normalize(n)
    return {
      'P': pt,  // Origin point
      'D': n,   // Unit direction vector
      't': t    // Distance
    }
  }
}

