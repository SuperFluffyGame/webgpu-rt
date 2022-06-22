import { device } from "../init.js";
import { canvasSizeBuffer, rayBouncesBuffer } from "../buffers.js";

// binding 1: canvasSizeBuffer
// binding 2: rayBouncesBuffer
export const otherBindGroupLayout = device.createBindGroupLayout({
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
    ],
});

export const otherBindGroup = device.createBindGroup({
    layout: otherBindGroupLayout,
    entries: [
        {
            binding: 0,
            resource: {
                buffer: canvasSizeBuffer,
            },
        },
        {
            binding: 1,
            resource: {
                buffer: rayBouncesBuffer,
            },
        },
    ],
});
