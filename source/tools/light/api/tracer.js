
/*

  tracer.js
  Singleton ray tracer
  Dave Wellsted, NyteOwl Computer Software
  2017-DEC-26

*/

const Tracer = {
  // Render scene to HTML canvas
  render: function(canvas) {
    const w = canvas.width
    const h = canvas.height
    const g = canvas.getContext('2d')
    const frm = new ImageData(w,h)
    const buf=frm.data
    let x,y,i,j,c_ray = [0,0,0]
    for (y=0; y<h; y++) {
      j = y*w*4
      for (x=0; x<w; x++) {
        i = j+4*x
        Tracer.shoot(x/w-0.5,y/w-0.5,c_ray)
        buf[i]   = c_ray[0]
        buf[i+1] = c_ray[1]
        buf[i+2] = c_ray[2]
        buf[i+3] = 255
      }
    }
    g.putImageData(frm,0,0)
  },
  // Shoot a ray
  shoot: function(x,y,rgb) {    
    const pt = [x,y,-0.75]
    const at = [x,y,0]
    let color = [0,0,0]
    const ray = Ray.create(pt,at)
    Tracer.shade(ray,0,1,color)
    color = Color.vecToRGB(color)
    Vec.Copy(color,rgb)
  },
  // Determine ray color
  shade: function(ray,level,weight,color) {
    // Calculate reflected ray
    function reflect(I,N,R,dot) {
      Vec.AddS(2.0*dot, N, I, R)
    }
    level++
    if (level >= 20) {return}
    const P = []
    // Project ray onto plane
    Vec.AddS(ray.t,ray.D,ray.P,P)
    // Read color texels as required
    Material.mapFix(P)
    // Start with ambient color
    Vec.Copy(Material.diff,color)
    Vec.Mul(color,Scene.ambient,color)
    Vec.Add(color,Material.amb,color)
    // Walk the light light
    const N = [0,0,-1]  // Surface normal
    const V = []        // Temp vector
    const L = []        // Light vector
    const R = []        // Reflected vector
    let light_spot      // spot shininess
    Light.list.forEach(light=>{
      light_spot = 1
      switch (light.type) {
      case L_DIRECT:
        Vec.Copy(light.direction, L)
        Vec.Negate(L)
        break
      case L_SPHERE:
        Vec.Sub(light.position, P, L);
        break
      case L_SPOT:
        Vec.Sub(light.position, P, L);
        Vec.Copy(L, V)
        Vec.Normalize(V)
        light_spot = -Vec.Dot(light.direction, V)
        // If not in light
        if (light_spot < light.max_angle) {
          light_spot = 0
        }
        // If total illumination
        else if (light_spot < light.min_angle) {
          // Determine falloff
          light_spot = 
            (light_spot - light.max_angle) /
            (light.min_angle - light.max_angle)
        }
        else {
          light_spot = 1
        }
        break
      default:
        Vec.Sub(light.position, P, L);
        break
      }
      if (light_spot>0) {
        let dot = -Vec.Dot(ray.D,N)
        const c_diff = []   // Diffuse color (scaled)
        const c_dist = []   // Light color (scaled)
        // Not backfaced?
        if (Vec.Dot(N, L)>0) {
          let t = Vec.Normalize(L);
          if (light.type == L_DIRECT) {
            t = HUGE;
          }
          let ldot = Vec.Dot(N, L);
          // Scale diffuse by angle of incidence
          Vec.S(ldot, Material.diff, c_diff);
          // Scale light color by distance
          switch (light.flags) {
            case L_INFINITE:
              Vec.Copy(light.color, c_dist);
              break;
            case L_R:
              Vec.S(1.0/t, light.color, c_dist);
              break;
            case L_RSQUARE:
              Vec.S(1.0/(t*t), light.color, c_dist);
              break;
          }
          // Multiply by scaled light color
          Vec.Mul(c_dist, c_diff, c_diff);
          // Modify if a spot light
          if (light.type == L_SPOT) {
            Vec.S(light_spot, c_diff, c_diff);
          }
          // Multiply light by shadow color
          // Vec.Mul(c_shadow, c_diff, c_diff);
          // Add to cumulative color
          Vec.Add(c_diff, color, color);
          // Add specular spot
          reflect(ray.D, N, R, dot);
          Vec.Normalize(R);
          // Reject values that are too small
          if (Material.shine > Vec.TINY) {
            let spec = Vec.Dot(R, L)
            if (spec > Vec.TINY) {
              spec = Math.pow(spec, Material.shine)
              Vec.AddS(spec, Material.cshine, color, color)
            }
          }
        }
      }
    })    
    // Finally, add in haze
    if (Scene.haze) {
      const d = 1-Math.pow(1-Scene.haze,ray.t)
      Vec.Comb(d,Scene.background,1-d,color,color)
    }
  }
}

