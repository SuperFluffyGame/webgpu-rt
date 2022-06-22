import { getRotationMatrix, getTranslationMatrix, screenGeo, screenUV, sphereCount, sphereData, } from "./data.js";
import { device, basicFragShaderCode, basicVertShaderCode, colorTarget, canvas, context, } from "./init.js";
import { bindGroup, bindGroupLayout, cameraPosMatBuffer, cameraRotMatBuffer, sphereBuffer, sphereCountBuffer, } from "./buffers.js";
const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [bindGroupLayout],
});
//create pipline
const pipeline = device.createRenderPipeline({
    layout: pipelineLayout,
    vertex: {
        module: device.createShaderModule({
            code: basicVertShaderCode,
        }),
        entryPoint: "main",
        buffers: [
            // pos attribute
            {
                arrayStride: 16,
                attributes: [
                    {
                        shaderLocation: 0,
                        format: "float32x4",
                        offset: 0,
                    },
                ],
            },
            // //uv
            // {
            //     arrayStride: 8,
            //     attributes: [
            //         {
            //             shaderLocation: 1,
            //             format: "float32x2",
            //             offset: 0,
            //         },
            //     ],
            // },
        ],
    },
    fragment: {
        module: device.createShaderModule({
            code: basicFragShaderCode,
        }),
        entryPoint: "main",
        targets: [{ format: colorTarget }],
    },
    multisample: {
        count: 4,
    },
});
//creating and setting the buffers for attributes
const screenGeoBuffer = device.createBuffer({
    size: screenGeo.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
});
new Float32Array(screenGeoBuffer.getMappedRange()).set(screenGeo);
screenGeoBuffer.unmap();
const screenUVbuffer = device.createBuffer({
    size: screenUV.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
});
new Float32Array(screenUVbuffer.getMappedRange()).set(screenUV);
screenUVbuffer.unmap();
// create output texture
const renderOutputTexture = device.createTexture({
    size: [canvas.width, canvas.height],
    format: colorTarget,
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
    sampleCount: 4,
});
// render!
function render(time) {
    requestAnimationFrame(render);
    const commandEncoder = device.createCommandEncoder();
    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [
            {
                clearValue: { r: 0, g: 0, b: 0, a: 0 },
                loadOp: "clear",
                storeOp: "store",
                view: renderOutputTexture.createView(),
                resolveTarget: context.getCurrentTexture().createView(),
            },
        ],
    });
    const translationMatrix = getTranslationMatrix();
    const rotationMatrix = getRotationMatrix();
    device.queue.writeBuffer(cameraPosMatBuffer, 0, translationMatrix);
    device.queue.writeBuffer(cameraRotMatBuffer, 0, rotationMatrix);
    device.queue.writeBuffer(sphereCountBuffer, 0, sphereCount);
    device.queue.writeBuffer(sphereBuffer, 0, sphereData);
    renderPass.setPipeline(pipeline);
    renderPass.setBindGroup(0, bindGroup);
    renderPass.setVertexBuffer(0, screenGeoBuffer);
    // renderPass.setVertexBuffer(1, screenUVbuffer);
    renderPass.draw(6);
    renderPass.end();
    device.queue.submit([commandEncoder.finish()]);
}
requestAnimationFrame(render);
