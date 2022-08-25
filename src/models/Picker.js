import Pickr from "@simonwep/pickr/dist/pickr.es5.min";

export function createPicker(onChangeHandler) {
    const pickr = Pickr.create({
        el: ".color-picker",
        theme: "monolith", // or 'monolith', or 'nano'

        swatches: [
            "#ffffff",
            "#0000FF",
            "#00FF00",
            "#FF0000",
            "#F4FF00"
        ],

        components: {
            // Main components
            preview: true,
            // opacity: true,
            hue: true,

            // Input / output Options
            interaction: {
                hex: true,
                // rgba: true,
                // hsla: true,
                // hsva: true,
                // cmyk: true,
                input: true,
                // clear: true,
                // save: true,
            },
        },
    });
    window.picker = pickr
    pickr.on('change', onChangeHandler)
    return pickr
}

