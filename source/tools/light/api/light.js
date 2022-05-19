
/*

  light.js
  Singleton light factory
  Dave Wellsted, NyteOwl Computer Software
  2017-DEC-26

*/

// Light types
const L_DIRECT = 0
const L_POINT = 1
const L_SPHERE = 2
const L_SPOT = 3

// Illumination flags
const L_INFINITE = 0
const L_R = 1
const L_RSQUARE = 2

// Singleton light factory
const Light = {
  // List of lights
  list: [],
  // Create a new light
  create: function(type,color,flags) {
    const light = {
    'type': type,
    'color': color,
    'flags': flags
    }
    Light.list.push(light)
    return light
  },
  // Initialize sphere light characteristics
  initSphere: function(light,pt,radius,samples) {
    light.position = []
    Vec.Copy(pt,light.position)
    light.radius1 = radius
    light.radius2 = radius*radius
    light.samples = samples
  },
  // Initialize direct light characteristics
  initDirect: function(light,dir) {
    light.direction = []
    Vec.Copy(dir,light.direction)
    Vec.Normalize(light.direction)
  },
  // Initialize point light characteristics
  initPoint: function(light,pt) {
    light.position = []
    Vec.Copy(pt,light.position)
  },
  // Initialize spot light characteristics
  initSpot: function(light,pt,dir,min_angle,max_angle) {
    light.position = []
    Vec.Copy(pt,light.position)
    light.direction = []
    Vec.Copy(dir,light.direction)
    Vec.Normalize(light.direction)
    light.min_angle = Math.cos(Vec.deg2rad(min_angle/2))
    light.max_angle = Math.cos(Vec.deg2rad(max_angle/2))
  }
}

