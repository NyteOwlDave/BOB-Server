
/*

  color.js
  
  Color manipulation functionality
  Dave Wellsted, NyteOwl Computer Software
  2017-DEC-27

*/

const Color = {
  htmlFromVec: function(vec) {
    function clamp(n) {
      return Math.min(Math.max(n,0),1)
    }
    const r = Math.floor(clamp(vec[0])*255)
    const g = Math.floor(clamp(vec[1])*255)
    const b = Math.floor(clamp(vec[2])*255)
    let s = ((r<<16)+(g<<8)+(b)).toString(16)
    while (s.length < 6) s = ('0'+s)
    return ('#'+s)
  },
  htmlFromRGB: function(r,g,b) {
    function clamp(n) {
      return Math.min(Math.max(n,0),255)
    }
    r = Math.floor(clamp(r))
    g = Math.floor(clamp(g))
    b = Math.floor(clamp(b))
    let s = ((r<<16)+(g<<8)+(b)).toString(16)
    while (s.length < 6) s = ('0'+s)
    return ('#'+s)
  },
  htmlToVec: function(htmlColor) {
    function val(index) {
      const s = '0x' + htmlColor.substr(index,2)
      return parseInt(s,16)
    }
    const scale = 1/255
    const r = val(1)*scale
    const g = val(3)*scale
    const b = val(5)*scale
    return [r,g,b]
  },
  htmlToRGB: function(htmlColor) {
    function val(index) {
      const s = '0x' + htmlColor.substr(index,2)
      return parseInt(s,16)
    }
    const r = val(1)
    const g = val(3)
    const b = val(5)
    return [r,g,b]
  },
  vecFromRGB: function(r,g,b) {
    function clamp(n) {
      return Math.min(Math.max(n,0),255)
    }
    const scale = 1/255
    r = Math.floor(clamp(r))*scale
    g = Math.floor(clamp(g))*scale
    b = Math.floor(clamp(b))*scale
    return [r,g,b]
  },
  vecToRGB: function(vec) {
    function clamp(n) {
      return Math.min(Math.max(n,0),1)
    }
    const r = Math.floor(clamp(vec[0])*255)
    const g = Math.floor(clamp(vec[1])*255)
    const b = Math.floor(clamp(vec[2])*255)
    return [r,g,b]
  }
}

