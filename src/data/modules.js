
export const modules = [
    {
        id: 'tut6',
        title: 'Tutorial 6 - Stateflow Charts',
        submodules: [
            { id: 't6-notes', title: 'Tutorial Notes', type: 'text', content: 'Stateflow chart basics, states, transitions, events.', parentTitle: 'Tut 6' }
        ]
    },
    {
        id: 'tut7',
        title: 'Tutorial 7 - Timers & Interrupts I',
        submodules: [
            { id: 't7-intro', title: 'Intro to Timers', type: 'text', content: 'Basics of hardware timers and interrupt service routines.', parentTitle: 'Tut 7' }
        ]
    },
    {
        id: 'tut8',
        title: 'Tutorial 8 - Timers & Interrupts II',
        submodules: [
            { id: 't8-adv', title: 'Advanced Timers', type: 'text', content: 'PWM generation, Input Capture, and Output Compare.', parentTitle: 'Tut 8' }
        ]
    },
    {
        id: 'tut9',
        title: 'Tutorial 9 - Communication (UART & I2C)',
        submodules: [
            { id: 't9-uart', title: 'UART Basics', type: 'text', content: 'Universal Asynchronous Receiver-Transmitter. Asynchronous serial communication.', parentTitle: 'Tut 9' },
            { id: 't9-i2c', title: 'I2C Basics', type: 'text', content: 'Inter-Integrated Circuit. Synchronous, multi-master, multi-slave packet switched bus.', parentTitle: 'Tut 9' }
        ]
    },
    {
        id: 'tut10',
        title: 'Tutorial 10 - Scheduling (FreeRTOS)',
        submodules: [
            {
                id: 't10-limit',
                title: 'Rate Monotonic Utilization Bound',
                type: 'formula',
                content: 'U = \\sum_{i=1}^{N} \\frac{C_i}{T_i} \\le N(2^{1/N} - 1)',
                parentTitle: 'Tut 10'
            },
            {
                id: 't10-task-create-def',
                title: 'Task Creation Definition',
                type: 'code',
                content: `
Void vTaskCode(void * pvParameters) // task definition must be void and parameter of type void *
{
    // Code that define the task initialization here
    while(1)
    {
        // code that repeats forever defining the task's operation
    }
}
        `.trim(),
                parentTitle: 'Tut 10'
            },
            {
                id: 't10-xtaskcreate',
                title: 'xTaskCreate Signature',
                type: 'code',
                content: `
BaseType_t xTaskCreate(
    TaskFunction_t pvTaskCode, // pointer to task definition function
    const char * pcName, // name for debugging
    uint16_t usStackDepth, // stack size in words
    void *pvParameters, // parameters passed to task
    UBaseType_t uxPriority, // task priority
    TaskHandle_t *pxCreatedTask // handle to created task (optional, can be NULL)
)
// Returns pdPASS if successful
        `.trim(),
                parentTitle: 'Tut 10'
            },
            {
                id: 't10-led-task',
                title: 'LED Task Example',
                type: 'code',
                content: `
#include <FreeRTOS.h>
#include <task.h>
#include <stdio.h>
#include <pico/stdlib.h>

void led_task(void * pvParameters){
    const uint LED_PIN = PICO_DEFAULT_LED_PIN;
    gpio_init(LED_PIN);
    gpio_set_dir(LED_PIN, GPIO_OUT);
    
    // portTICK_PERIOD_MS is 1ms delay based on ticks
    const TickType_t xDelay = 500 / portTICK_PERIOD_MS;

    while(1){
        gpio_put(LED_PIN, 1);
        vTaskDelay(xDelay);
        gpio_put(LED_PIN, 0);
        vTaskDelay(xDelay);
    }
}
        `.trim(),
                parentTitle: 'Tut 10'
            },
            {
                id: 't10-main',
                title: 'Main Function Example',
                type: 'code',
                content: `
int main(){
    stdio_init_all();
    // xTaskCreate(Function, Name, Stack, Params, Priority, Handle);
    xTaskCreate(led_task, "LED Task", 256, NULL, 1, NULL);
    
    vTaskStartScheduler(); // Found in FreeRTOS Kernel Control
    
    while(1){}; // Should not be reached
}
        `.trim(),
                parentTitle: 'Tut 10'
            },
            {
                id: 't10-kernel-control',
                title: 'Kernel Control Functions',
                type: 'text',
                content: '- vTaskStartScheduler\n- vTaskEndScheduler\n- vTaskSuspendAll\n- vTaskResumeAll\n- vTaskStepTick',
                parentTitle: 'Tut 10'
            }
        ]
    }
];
