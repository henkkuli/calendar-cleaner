
const s = `

            // Top
            8, 9, 10,
            11, 10, 9,
            // Back
            8, 12, 9,
            12, 13, 9,
            // Front
            10, 11, 14,
            14, 11, 15,
            // Left
            8, 10, 14,
            8, 14, 12,
            // Right
            9, 13, 11,
            11, 13, 15,
            // Bottom
            12, 14, 13,
            15, 13, 14,`;

const r = s.replace(/(\d+)/g, s => (parseInt(s) + 32).toString());

console.log(r);