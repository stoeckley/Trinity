
var _presets_table = {

    'Basic plume': `
{"RENDERER_STATE":{"Nraymarch":119.5137429438185,"skyColor":[0,0,0],"sunColor":[0.8988728250287983,0.9019407302316925,0.8488745406032042],"sunPower":0.17590196167083239,"sunLatitude":76.73485298771871,"sunLongitude":138.94571082309892,"exposure":0.36579112489785715,"gamma":2.3232924840295137,"anisotropy":0.5438412313677659,"extinctionScale":0.08714542653576274,"emissionScale":1.0274373669126131,"blackbodyEmission":-11.619147601146414,"TtoKelvin":0.9924693630221351},"SOLVER_STATE":{"timestep":1,"NprojSteps":16,"vorticity_scale":0.5349409866689309,"Nx":128,"Ny":512,"Nz":128,"max_timesteps":150,"expansion":0,"maxTimeSteps":150},"SIMULATION_STATE":{"gravity":0.03969877452088541,"buoyancy":0.1654115605036892,"Tambient":1,"radiationLoss":1,"blast_height":0.12130181103603875,"blast_radius":0.06616462420147567,"blast_velocity":22.054874733825226,"blast_heat_flux":93.73321761875721,"dust_inflow_rate":1,"dust_absorption":[0.1399972110681601,0.2172309278521225,0.7940755334865542],"dust_scattering":[0.33591742074178677,0.3360847965413506,0.7450458986024004],"TtoKelvin":47.41798067772424},"CAMERA_STATE":{"pos":[300.9740960117997,264.17698911658914,-723.9803567848326],"tar":[62.78035903604152,255.97322422507503,56.37142757888532],"near":1,"far":20000},"GUI_STATE":{"visible":true},"EDITOR_STATE":{"common_glsl":"//////////////////////////////////////////////////////////////////////////////////////////////////////\\n// Bind UI parameters to uniforms used in the various programs\\n//////////////////////////////////////////////////////////////////////////////////////////////////////\\n\\n// \\"Physics\\"\\nuniform float gravity;                    // {\\"label\\":\\"gravity\\",                    \\"min\\":0.0, \\"max\\":0.1,    \\"step\\":0.001, \\"default\\":0.05}\\nuniform float buoyancy;                   // {\\"label\\":\\"buoyancy\\",                   \\"min\\":0.0, \\"max\\":1.0,    \\"step\\":0.001, \\"default\\":0.5}\\nuniform float Tambient;                   // {\\"label\\":\\"Tambient\\",                   \\"min\\":0.0, \\"max\\":1000.0, \\"step\\":1.0,   \\"default\\":300.0}\\nuniform float radiationLoss;              // {\\"label\\":\\"radiationLoss\\",              \\"min\\":0.9, \\"max\\":1.0,    \\"step\\":0.01,  \\"default\\":0.999}\\n\\n// Blast geometry\\nuniform float blast_height;               // {\\"label\\":\\"blast_height\\",               \\"min\\":0.0, \\"max\\":1.0,    \\"step\\":0.001, \\"default\\":0.25}\\nuniform float blast_radius;               // {\\"label\\":\\"blast_radius\\",               \\"min\\":0.0, \\"max\\":1.0,    \\"step\\":0.001, \\"default\\":0.1}\\nuniform float blast_velocity;             // {\\"label\\":\\"blast_velocity\\",             \\"min\\":0.0, \\"max\\":100.0,  \\"step\\":0.1,   \\"default\\":50.0}\\nuniform float blast_heat_flux;            // {\\"label\\":\\"blast_heat_flux\\",            \\"min\\":0.0, \\"max\\":100.0, \\"step\\":1.0,   \\"default\\":100.0}\\n\\n// Dust\\nuniform float dust_inflow_rate;           // {\\"label\\":\\"dust_inflow_rate\\",           \\"min\\":0.0, \\"max\\":10.0,   \\"step\\":0.01,  \\"default\\":1.0}\\nuniform vec3  dust_absorption;            // {\\"label\\":\\"dust_absorption\\",            \\"default\\":[0.5,0.5,0.5], \\"scale\\":1.0}\\nuniform vec3  dust_scattering;            // {\\"label\\":\\"dust_scattering\\",            \\"default\\":[0.5,0.5,0.5], \\"scale\\":1.0}\\n\\n// Rendering\\nuniform float TtoKelvin;                  // {\\"label\\":\\"TtoKelvin\\",                  \\"min\\":0.0, \\"max\\":100.0,  \\"step\\":0.01,  \\"default\\":10.0}\\n\\n/******************************************************/\\n/*                 mandatory function                 */\\n/******************************************************/\\nvoid init()\\n{\\n    // Any global constants defined here are available in all functions\\n}","initial_glsl":"//////////////////////////////////////////////////////////////////////////////////////////////////////\\n// In this program, we specify the initial conditions for the simulation, \\n// i.e. populate all the relevant fields (velocity, temperature, debris density/albedo) at time 0.0\\n//////////////////////////////////////////////////////////////////////////////////////////////////////\\n\\n/******************************************************/\\n/*                 mandatory function                 */\\n/******************************************************/\\nvoid initial_conditions(in vec3 wsP,            // world space center of current voxel\\n                        in vec3 L,              // world-space extents of grid\\n                        inout vec3 v,           // initial velocity\\n                        inout float T,          // initial temperature\\n                        inout vec3 absorption,  // initial per-channel absorption\\n                        inout vec3 scattering)  // initial per-channel scattering\\n{\\n    v = vec3(0.0);\\n    T = Tambient;\\n    absorption = vec3(0.0);\\n    scattering = vec3(0.0);      \\n}\\n\\n","inject_glsl":"//////////////////////////////////////////////////////////////////////////////////////////////////////\\n// In this program, the velocity temperature and debris fields are updated via:\\n//\\n//  - specification of boundary   inflow/outflow      due to Dirichlet BC (i.e. v, T modified in-place)\\n//  - specification of volumetric inflow/outflow rate due to sources/sinks (vInflow, Tinflow)\\n//////////////////////////////////////////////////////////////////////////////////////////////////////\\n\\n/******************************************************/\\n/*                 mandatory function                 */\\n/******************************************************/\\nvoid inject(in vec3 wsP,                 // world space center of current voxel\\n            in float time,               // time in units of frames\\n            in vec3 L,                   // world-space extents of grid\\n            inout vec3 v,                // modify velocity in-place (defaults to no change)\\n            inout vec3 vInflow,          // velocity inflow rate (defaults to zero)\\n            inout float T,               // modify temperature in-place (defaults to no change)\\n            inout float Tinflow,         // temperature inflow rate (defaults to zero)\\n            inout vec3 absorption,       // modify dust absorption coeff.in-place (defaults to no change)\\n            inout vec3 absorptionInflow, // dust absorption coeff. inflow rate (defaults to 0)\\n            inout vec3 scattering,       // modify dust scattering coeff. in-place (defaults to no change)\\n            inout vec3 scatteringInflow  // dust scattering coeff. inflow rate (defaults to 0)\\n            )\\n{\\n    vec3 blast_center = vec3(0.5*L.x, blast_height*L.y, 0.5*L.z);\\n    vec3 dir = wsP - blast_center;\\n    float r = length(dir);\\n    dir /= r;\\n    float rt = r/(blast_radius*L.y);\\n    if (rt <= 1.0 && time==0.0)\\n    {\\n        // Within blast radius: inject velocity and temperature\\n        float radial_falloff = max(0.0, 1.0 - rt*rt*(3.0 - 2.0*rt));\\n        vInflow = dir * blast_velocity * radial_falloff;\\n        Tinflow = blast_heat_flux * radial_falloff;\\n        // Also inject absorbing/scattering \\"dust\\"\\n        absorptionInflow = dust_absorption * dust_inflow_rate * radial_falloff;\\n      \\tscatteringInflow = dust_scattering * dust_inflow_rate * radial_falloff;\\n    }\\n  \\telse\\n  \\t{\\n        // Apply thermal relaxation due to \\"radiation loss\\"\\n        T *= radiationLoss;\\n    }\\n}\\n","influence_glsl":"//////////////////////////////////////////////////////////////////////////////////////////////////////\\n// In this program, external forces on the fluid are specified\\n//////////////////////////////////////////////////////////////////////////////////////////////////////\\n\\n/******************************************************/\\n/*                 mandatory function                 */\\n/******************************************************/\\nvec3 externalForces(in vec3 wsP,                       // world space center of current voxel\\n                    in float time,                     // time in units of frames\\n                    in vec3 v, in float P, in float T, // velocity, pressure, temperature of current voxel\\n                    in vec3 L)                         // world-space extents of grid\\n{\\n    // Tbuoyancy is the reference temperature for buoyancy\\n    float buoyancy_force = gravity*buoyancy*(T - Tambient);\\n    return vec3(0.0, buoyancy_force, 0.0);\\n}","collide_glsl":"//////////////////////////////////////////////////////////////////////////////////////////////////////\\n// @todo\\n//////////////////////////////////////////////////////////////////////////////////////////////////////\\n\\n/******************************************************/\\n/*                 mandatory function                 */\\n/******************************************************/\\nbool isSolid(in vec3 wsP, // world space center of current voxel\\n             in vec3 L)   // world-space extents of grid\\n{\\n    // define regions which are solid (static) obstacles\\n    return false;\\n}\\n","render_glsl":"//////////////////////////////////////////////////////////////////////////////////////////////////////\\n// Specify how the fluid emission fluid is computed\\n//////////////////////////////////////////////////////////////////////////////////////////////////////\\n\\n// Valid from 1000 to 40000 K (and additionally 0 for pure full white)\\nvec3 colorTemperatureToRGB(const in float temperature)\\n{\\n  // Values from: http://blenderartists.org/forum/showthread.php?270332-OSL-Goodness&p=2268693&viewfull=1#post2268693   \\n  mat3 m = (temperature <= 6500.0) ? mat3(vec3(0.0, -2902.1955373783176, -8257.7997278925690),\\n\\t                                      vec3(0.0, 1669.5803561666639, 2575.2827530017594),\\n\\t                                      vec3(1.0, 1.3302673723350029, 1.8993753891711275)) : \\n\\t \\t\\t\\t\\t\\t\\t\\t\\t mat3(vec3(1745.0425298314172, 1216.6168361476490, -8257.7997278925690),\\n   \\t                                      vec3(-2666.3474220535695, -2173.1012343082230, 2575.2827530017594),\\n\\t                                      vec3(0.55995389139931482, 0.70381203140554553, 1.8993753891711275)); \\n  return mix(clamp(vec3(m[0] / (vec3(clamp(temperature, 1000.0, 40000.0)) + m[1]) + m[2]), vec3(0.0), vec3(1.0)), \\n             vec3(1.0), \\n             smoothstep(1000.0, 0.0, temperature));\\n}\\n\\n\\n/******************************************************/\\n/*                 mandatory function                 */\\n/******************************************************/\\nvec3 temperatureToEmission(in float T)\\n{\\n    vec3 emission = colorTemperatureToRGB(T * TtoKelvin) * pow(T/100.0, 4.0);\\n  \\treturn emission;\\n}"}}
    `


};


var Presets = function()
{
    this.preset_names = [];
    for (var preset_name in _presets_table) {
        if (_presets_table.hasOwnProperty(preset_name)) {
            this.preset_names.push(preset_name);
        }
    }
}

Presets.prototype.get_preset_names = function()
{
    return this.preset_names;
}

Presets.prototype.get_preset = function(preset_name)
{
    return this.preset_names[preset_name];
}

Presets.prototype.load_preset = function(preset_name)
{
    if (preset_name in _presets_table)
    {
        let preset = _presets_table[preset_name];
        let state = JSON.parse(preset);
        trinity.preset_selection = preset_name;
        trinity.load_state(state);
    }
}

