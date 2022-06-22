// get shader files
export const raytraceVertShaderCode = await (
    await fetch("./shaders/basic.vert.wgsl")
).text();
export const basicFragShaderCode = await (
    await fetch("./shaders/raytrace.frag.wgsl")
).text();

// check if webgpu is enabled
if (!navigator.gpu) {
    throw "WebGPU is not enabled!";
}

// get essentail parts
export const adapter = (await navigator.gpu.requestAdapter()) as GPUAdapter;
export const device = await adapter.requestDevice();
export const colorTarget: GPUTextureFormat = "rgba8unorm";

export const canvas = document.getElementById("c") as HTMLCanvasElement;
export const context = canvas.getContext("webgpu") as GPUCanvasContext;
context.configure({
    device,
    format: colorTarget,
    alphaMode: "opaque",
});
