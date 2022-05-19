
/*

    umbra.js

    Code behind for the umbra.html tool

*/

;(function () {

    const WIDTH = 300;
    const HEIGHT = 300;
    const CENTER_X = WIDTH / 2;
    const CENTER_Y = HEIGHT / 2;

    const DEFAULTS = [
        [ idGammaValue, 0, 255, 1],
        [ idMinAngleValue, 0, 90, 5],
        [ idMaxAngleValue, 0, 90, 35],
    ];

    let m_ctx = null;

    function rnd() {
        return Math.random();
    }

    function deg2rad(n) {
        return n * Math.PI / 180;
    }

    function rad2deg(n) {
        return n * 180 / Math.PI;
    }

    function hypot(a, o) {
        return Math.sqrt(o*o + a*a);
    }

    function make_rgb(r, g, b) {
        r *= 255;
        g *= 255;
        b *= 255;
        return `rgb(${r},${g},${b})`;
    }

    function init_controls() {
        DEFAULTS.forEach(row=>{
            const control = row[0];
            control.setAttribute("min", row[1])
            control.setAttribute("max", row[2])
            control.setAttribute("value", row[3])
        });
        idRenderButton.addEventListener("click", on_click_ok);
    }

    function read_controls() {
        let gamma = parseFloat(idGammaValue.value);
        let min_angle = parseFloat(idMinAngleValue.value);
        let max_angle = parseFloat(idMaxAngleValue.value);
        if (max_angle < min_angle) {
            const tmp = min_angle;
            min_angle = max_angle;
            max_angle = tmp;
        }
        let tan_theta = Math.tan(deg2rad(max_angle)); console.log("tan_theta", tan_theta);
        let tan_alpha = Math.tan(deg2rad(min_angle)); console.log("tan_alpha", tan_alpha);
        let max_radius = 1;
        let distance = max_radius / tan_theta;
        let min_radius = distance * tan_alpha;
        const result = {
            min_angle : min_angle,
            max_angle : max_angle,
            gamma : gamma,
            distance : distance,
            min_radius : min_radius,
            max_radius : max_radius
        }
        write_controls(result);
        return result;
    }

    function write_controls(args) {
        idGammaValue.value = args.gamma;
        idMinAngleValue.value = args.min_angle;
        idMaxAngleValue.value = args.max_angle;
    }

    function init_render() {
        m_ctx = idCanvas.getContext("2d");
        const info = read_controls();
        render_scene(info);
    }

    function render_scene(args) {
        console.log(args);
        const scale = 1 / HEIGHT * 2
        for(let y =0; y<HEIGHT; y++) {
            for (let x=0; x<WIDTH; x++) {
                let r = 0;
                let g = 0;
                let b = 0;
                let i = scale * (x - CENTER_X);
                let j = scale * (y - CENTER_Y);
                let k = hypot(i, j);
                if (k > args.max_radius) {
                    r = g = b = 0;
                } else if (k > args.min_radius) {
                    const range = args.max_radius - args.min_radius;
                    const value = Math.abs(k) - args.min_radius;
                    const base = 1 - (value / range);
                    r = g = b = Math.pow(base, args.gamma);
                } else {
                    r = g = b = 1;
                }
                m_ctx.fillStyle = make_rgb(r, g, b);
                m_ctx.fillRect(x, y, x+1, y+1);
            }
        }
    }

    function on_click_ok() {
        console.log("OK");
        init_render();
    }

    function main() {
        init_controls();
        idCanvas.width = WIDTH;
        idCanvas.height = HEIGHT;
    }

    window.addEventListener("load", main);

})();