export class Renderer {
    gpu;
    adapter;
    device;
    canvas;
    vertexShader;
    fragmentShader;
    context;
    config = {};
    bindGroups = [[]];
    constructor(gpu, adapter, device, canvas, vertexShader, fragmentShader, context) {
        this.gpu = gpu;
        this.adapter = adapter;
        this.device = device;
        this.canvas = canvas;
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
        this.context = context;
    }
    static async init(gpu, canvas, vertexShader, fragmentShader) {
        const adapter = await gpu.requestAdapter();
        if (adapter === null)
            throw "Unable to create Adapter.";
        const device = await adapter.requestDevice();
        const context = canvas.getContext("webgpu");
        if (context === null)
            throw "Unable to get Context.";
        const wg = new Renderer(gpu, adapter, device, canvas, vertexShader, fragmentShader, context);
        return wg;
    }
    addBufferBinding(group, slot, size, visibility, usage = GPUBufferUsage.UNIFORM |
        GPUBufferUsage.COPY_DST) {
        if (!this.bindGroups[group]) {
            this.bindGroups[group] = [];
        }
        const binding = new BufferBinding(this.device, slot, size, visibility, usage);
        this.bindGroups[group][slot] = binding;
    }
    setBufferBinding(group, slot, data, bufferOffset = 0) {
        if (!this.bindGroups[group]?.[slot]) {
            throw `Binding at group ${group}, slot ${slot} doesn't exist.`;
        }
        this.bindGroups[group][slot].writeData(data, bufferOffset);
    }
    genetateBindLayouts() {
        const out = [];
        for (const group of this.bindGroups) {
            const g = {};
            for (const binding of group) {
                g.entries = [
                    {
                        binding: binding.slot,
                        visibility: binding.visibility,
                    },
                ];
            }
        }
        return out;
    }
    generatePipeline() {
        return {};
    }
}
class BufferBinding {
    device;
    slot;
    size;
    visibility;
    usage;
    buffer;
    constructor(device, slot, size, visibility, usage) {
        this.device = device;
        this.slot = slot;
        this.size = size;
        this.visibility = visibility;
        this.usage = usage;
        this.buffer = device.createBuffer({
            size,
            usage,
        });
    }
    writeData(data, bufferOffset = 0, dataOffset = 0, size = data.byteLength) {
        this.device.queue.writeBuffer(this.buffer, bufferOffset, data, dataOffset, size);
    }
}
