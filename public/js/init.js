// get shader files
export const raytraceVertShaderCode = await (await fetch("./shaders/raytrace.vert.wgsl")).text();
export const basicFragShaderCode = await (await fetch("./shaders/basic.frag.wgsl")).text();
// check if webgpu is enabled
if (!navigator.gpu) {
    throw "WebGPU is not enabled!";
}
// get essentail parts
export const adapter = (await navigator.gpu.requestAdapter());
export const device = await adapter.requestDevice();
export const colorTarget = "rgba8unorm";
export const canvas = document.getElementById("c");
export const context = canvas.getContext("webgpu");
context.configure({
    device,
    format: colorTarget,
    alphaMode: "opaque",
});