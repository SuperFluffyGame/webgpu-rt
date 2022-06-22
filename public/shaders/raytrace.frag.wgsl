struct Sphere {
    pos: vec4<f32>,
    radius: f32,
    //3xf32 padding
}
struct FragOutput {
    @location(0) color: vec4<f32>
}

@binding(0) @group(0) var<uniform> camera_pos_mat: mat4x4<f32>;
@binding(1) @group(0) var<uniform> camera_rot_mat: mat4x4<f32>;

// Not Implemented
@binding(2) @group(0) var<uniform> camera_fov: f32;
@binding(3) @group(0) var<uniform> camera_aspect: f32;
//

@binding(4) @group(0) var<storage> spheres: array<Sphere>;
@binding(5) @group(0) var<uniform> spheres_count: f32;

fn ray_sphere_hit(ray_origin: vec4<f32>, ray_dir: vec4<f32>, sphere_origin: vec4<f32>, sphere_radius: f32) -> f32{
    var a = pow(ray_dir.x, 2) + pow(ray_dir.y, 2) + pow(ray_dir.z, 2);
    var b = 2 * (
        ray_dir.x * (ray_origin.x - sphere_origin.x) +
        ray_dir.y * (ray_origin.y - sphere_origin.y) +
        ray_dir.z * (ray_origin.z - sphere_origin.z)
    );
    var c = (
        pow(ray_origin.x - sphere_origin.x,2) +
        pow(ray_origin.y - sphere_origin.y,2) +
        pow(ray_origin.z - sphere_origin.z,2)
    ) - pow(sphere_radius, 2);
    
    var descriminant = pow(b, 2) - (4 * a * c);

    if (descriminant < 0) {
        return -1.0;
    } else {
        return (-b - sqrt(descriminant) ) / (2.0*a);
    }
}

@fragment
fn main(
    @builtin(position) pos: vec4<f32>
) -> FragOutput {
    // let PI: f32 = 3.141592636;
    var out: FragOutput;
    let new_pos = vec2<f32>(pos.xy / 200 - 1);

    let ray_origin = vec4<f32>(0,0,0,1) * camera_pos_mat;
    let ray_dir = normalize(vec4<f32>(new_pos.x - 0.5, new_pos.y - 0.5, - 1.5, 1) * camera_rot_mat);
    let light_pos = vec4<f32>(3,-10,0,1);

    let sky_color1 = vec4<f32>(138 / 255.0, 255 / 255.0, 249 / 255.0, 1);
    let sky_color2 = vec4<f32>(46  / 255.0, 168 / 255.0, 201 / 255.0,1);
    let sphere_color = vec4<f32>(0.8,1,0,1);
    let sky_color = mix(sky_color1, sky_color2, 1 -ray_dir.y);


    // var light_t = ray_sphere_hit(hit_point_offset, hit_to_light_normal, circle_origin, circle_radius);

    // var light_hit_point = hit_point_offset + hit_to_light_normal * light_t;

    // var hit_dist_from_light = distance(light_hit_point, light_pos) / 10;

    // let shadow = 1 - step(light_t, 0);


    var closest_sphere_index: f32 = -1;
    var closest_sphere_t: f32 = 100000;

    for (var i = 0; i < i32(spheres_count); i++) {
        var sphere = spheres[i];

        var t = ray_sphere_hit(ray_origin, ray_dir, sphere.pos, sphere.radius);
        if(t < closest_sphere_t && t > 0){
            closest_sphere_index = f32(i);
            closest_sphere_t = t;
        }
    }

    if(closest_sphere_index >= 0 && closest_sphere_index < spheres_count && closest_sphere_t > 0){
        let sphere = spheres[i32(closest_sphere_index)];
        let hit_point = ray_origin + ray_dir * closest_sphere_t;
        let normal = (hit_point - sphere.pos);
        let hit_to_light_normal = normalize(hit_point - light_pos);

        let light_t = ray_sphere_hit(hit_point, hit_to_light_normal, sphere.pos, sphere.radius - 0.01);


        if(light_t > 0){
            out.color = sphere_color;
        }
    } else {
        out.color = sky_color;
    }

    // out.color = vec4(ray_dir);

    return out;
}

