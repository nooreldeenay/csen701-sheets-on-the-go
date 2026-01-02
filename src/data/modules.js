
// Helper to generate mock content
const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export const modules = [
    ...Array.from({ length: 16 }, (_, i) => ({
        id: `lec-${i + 1}`,
        title: `Lecture ${i + 1}: ${['Intro', 'Embedded Arch', 'Memory', 'GPIO', 'Interrupts', 'Timers', 'PWM', 'ADC', 'DAC', 'Serial Comm', 'UART', 'SPI', 'I2C', 'RTOS', 'Power Mgmt', 'Exam Review'][i]}`,
        type: 'lecture',
        submodules: [
            { id: `lec-${i + 1}-1`, title: 'Key Concepts', type: 'text', content: `Summary of Lecture ${i + 1}. ${lorem}` },
            { id: `lec-${i + 1}-2`, title: 'Diagram', type: 'image', src: 'https://placehold.co/300x200/png' },
            { id: `lec-${i + 1}-3`, title: 'Formulas', type: 'formula', content: 'V_{out} = V_{in} \\frac{R_2}{R_1 + R_2}' }
        ]
    })),
    ...Array.from({ length: 10 }, (_, i) => ({
        id: `tut-${i + 1}`,
        title: `Tutorial ${i + 1}`,
        type: 'tutorial',
        submodules: [
            { id: `tut-${i + 1}-1`, title: 'Problem 1', type: 'text', content: `Solution to problem 1. ${lorem}` },
            { id: `tut-${i + 1}-2`, title: 'Code Snippet', type: 'code', content: `void setup() {\n  pinMode(LED_BUILTIN, OUTPUT);\n}` }
        ]
    }))
];
