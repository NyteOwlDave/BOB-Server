
/*

  material.js
  Surface material functionality
  Dave Wellsted, NyteOwl Computer Software
  2017-DEC-26

*/

const Material = {
  // Ambient
  amb: [0,0,0],
  tm_amb: null,
  // Diffuse
  diff: [0,0,0],
  tm_diff: null,
  // Specular
  spec: [0,0,0],
  tm_spec: null,
  // Transmissive
  trans: [0,0,0],
  tm_trans: null,
  // Specular dot
  cshine: [.2,.2,.8],
  shine: 0.0,
  // Create texture map object
  texCreate: function(imgData,across,down) {
    const normal = [0,0,0]
    Vec.Normalize(across)
    Vec.Normalize(down)
    Vec.Cross(down,across,normal)
    Vec.Cross(across,normal,down)
    return {
      'position': [0,0,0],
      'across': across,
      'down': down,
      'normal': normal,
      'scale': 1,
      'image': imgData
    }
  },
  // Project point P onto texmap plane
  // o/p = texPt
  texProject: function(tm, P, texPt) {
    const PP = [0,0,0]
    const V = [0,0,0]
    // project intersection point onto image plane
    Vec.Sub(P, tm.position, V)
    let dot = Vec.Dot(tm.normal, V)
    Vec.AddS(-dot, tm.normal, P, PP)
    // calc offsets in across and down directions
    Vec.Sub(PP, tm.position, V)
    dot = Vec.Dot(tm.across, V)
    texPt.x = dot / tm.scale
    dot = Vec.Dot(tm.down, V)
    texPt.y = dot / tm.scale
  },
  // Tile texture coordinates
  texTile: function(tm, texPt) {
    const w = tm.image.width
    const h = tm.image.height
    const aspect = h/w
    texPt.x = (texPt.x%1)
    if (texPt.x < 0) {
      texPt.x += 1
    }
    texPt.y = (texPt.y%aspect)
    if (texPt.y < 0) {
      texPt.y += aspect
    }
  },
  // Read texel color
  readTexel: function(tm, texPt, color) {
    const w = tm.image.width
    const h = tm.image.height
    const buf = tm.image.data
    // Get integer indices (modulo map dimensions)
    let i = Math.floor((texPt.x * w) % w)
    let j = Math.floor((texPt.y * h) % h)
    // Wrap negative coords
    i = (i < 0) ? (i + w) : i
    j = (j < 0) ? (j + h) : j
    i = 4*(j*w+i)
    // Read and normalize map color
    const scale = 1/255
    color[0] = buf[i  ]*scale
    color[1] = buf[i+1]*scale
    color[2] = buf[i+2]*scale
  },
  // Read texel colors for all present texmaps
  mapFix: function(at) {
    const pt = {}
    let tm = Material.tm_amb
    if (tm) {
      Material.texProject(tm,at,pt)
      Material.texTile(tm,pt)
      Material.readTexel(tm,pt,Material.amb)
    }
    tm = Material.tm_diff
    if (tm) {
      Material.texProject(tm,at,pt)
      Material.texTile(tm,pt)
      Material.readTexel(tm,pt,Material.diff)
    }
    tm = Material.tm_spec
    if (tm) {
      Material.texProject(tm,at,pt)
      Material.texTile(tm,pt)
      Material.readTexel(tm,pt,Material.spec)
    }
    tm = Material.tm_trans
    if (tm) {
      Material.texProject(tm,at,pt)
      Material.texTile(tm,pt)
      Material.readTexel(tm,pt,Material.trans)
    }
  }
}

