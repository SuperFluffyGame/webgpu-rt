import { device } from "./init.js";
// bindings
export const cameraPosMatBuffer = device.createBuffer({
    size: 64,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});
export const cameraRotMatBuffer = device.createBuffer({
    size: 64,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

export const sphereBuffer = device.createBuffer({
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    size: 32 * 2,
});
export const sphereCountBuffer = device.createBuffer({
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    size: 4,
});

export const aspectBuffer = device.createBuffer({
    size: 8,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});
export const fovBuffer = device.createBuffer({
    size: 4,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

export const bindGroupLayout = device.createBindGroupLayout({
    entries: [
        {
            binding: 0,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {
                type: "uniform",
            },
        },
        {
            binding: 1,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {
                type: "uniform",
            },
        },
        {
            binding: 2,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {
                type: "uniform",
            },
        },
        {
            binding: 3,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {
                type: "uniform",
            },
        },
        {
            binding: 4,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {
                type: "read-only-storage",
            },
        },
        {
            binding: 5,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {
                type: "uniform",
            },
        },
    ],
});
export const bindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [
        {
            binding: 0,
            resource: {
                buffer: cameraPosMatBuffer,
            },
        },
        {
            binding: 1,
            resource: {
                buffer: cameraRotMatBuffer,
            },
        },
        {
            binding: 2,
            resource: {
                buffer: fovBuffer,
            },
        },
        {
            binding: 3,
            resource: {
                buffer: aspectBuffer,
            },
        },
        {
            binding: 4,
            resource: {
                buffer: sphereBuffer,
            },
        },
        {
            binding: 5,
            resource: {
                buffer: sphereCountBuffer,
            },
        },
    ],
});
