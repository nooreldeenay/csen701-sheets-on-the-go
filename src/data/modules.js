
export const modules = [
    {
        id: 'tut1',
        title: 'Tutorial 1 - Introduction To Embedded Systems',
        submodules: []
    },
    {
        id: 'tut2',
        title: 'Tutorial 2 - Microcontroller Architecture & Embedded C',
        submodules: [
            {
                id: 't2-avr-registers',
                title: 'AVR GPIO Registers',
                type: 'text',
                content: '• DDRx (Data Direction Register): Sets pin as Input (0) or Output (1).\n• PORTx (Data Register): Sets Output state to HIGH (1) or LOW (0). If input, 1 enables internal Pull-up.\n• PINx (Input Pins Address): Read-only register used to get the actual logic level on the pin.',
                parentTitle: 'Tutorial 2'
            },
            {
                id: 't2-bit-ops',
                title: 'Common Bitwise Operations',
                type: 'text',
                content: '• Set Bit: REG |= (1 << n)\n• Clear Bit: REG &= ~(1 << n)\n• Toggle Bit: REG ^= (1 << n)\n• Check Bit: if (REG & (1 << n))',
                parentTitle: 'Tutorial 2'
            }
        ]
    },
    {
        id: 'tut3',
        title: 'Tutorial 3 - Sensors & Actuators I',
        submodules: [
            {
                id: 't3-avr-gpio',
                title: 'AVR GPIO Control (Pushbuttons)',
                type: 'code',
                content: `
#include <avr/io.h>
int main(void) {
    // Port Setup (PC5: +ve logic, PB3: -ve logic+Pullup, PD2: LED out)
    DDRC &= ~(1<<5); DDRB &= ~(1<<3);
    PORTB |= (1<<3); // Activate internal pull-up on PB3
    DDRD |= (1<<2);
    while (1) {
        if (PINC & (1<<5)) PORTD |= (1<<2);    // Pressed PC5 -> LED ON
        if (!(PINB & (1<<3))) PORTD &= ~(1<<2); // Pressed PB3 -> LED OFF
    }
}
                `.trim(),
                parentTitle: 'Tutorial 3'
            },
            {
                id: 't3-adc-calc',
                title: 'ADC Output Calculation',
                type: 'text',
                content: '• n = ADC bits (10 bits for Arduino Uno)\n• Vref = Max voltage (e.g., 5V)\n• Resolution = Vref / (2^n - 1)\n• Digital Output = Vin / Resolution\nExamples (n=10, Vref=5V):\n• 0V -> 0 | 2.5V -> 512 | 5V -> 1023',
                parentTitle: 'Tutorial 3'
            },
            {
                id: 't3-adc-formula',
                title: 'ADC Transfer Function',
                type: 'formula',
                content: 'Digital\\ Output = \\frac{V_{in} \\times (2^n - 1)}{V_{ref}}',
                parentTitle: 'Tutorial 3'
            }
        ]
    },
    {
        id: 'tut4',
        title: 'Tutorial 4 - Implementing Drivers',
        submodules: [
            {
                id: 't4-gpio-api',
                title: 'Pico SDK GPIO API',
                type: 'text',
                content: '• gpio_init(uint gpio): Init hardware block\n• gpio_set_dir(gpio, bool out): Set direction (true=OUT, false=IN)\n• gpio_put(gpio, bool val): Set output HIGH/LOW\n• gpio_get(gpio): Read input state\n• gpio_pull_up(gpio) / gpio_pull_down(gpio): Enable internal resistors\n• gpio_disable_pulls(gpio): Disable internal resistors',
                parentTitle: 'Tutorial 4'
            },
            {
                id: 't4-gpio-example',
                title: 'Example: IR Sensor & LED',
                type: 'code',
                content: `
#include "pico/stdlib.h"
#define LED 25
#define SENSOR 16
void toggle_led() { gpio_put(LED, !gpio_get(LED)); }
int main() {
    gpio_init(LED); gpio_set_dir(LED, true);
    gpio_init(SENSOR); gpio_set_dir(SENSOR, false);
    while (true) {
        if (gpio_get(SENSOR)) { toggle_led(); }
        while(gpio_get(SENSOR)); // Wait for deactivation
    }
}
                `.trim(),
                parentTitle: 'Tutorial 4'
            },
            {
                id: 't4-adc-api',
                title: 'Pico SDK ADC API',
                type: 'text',
                content: '• adc_init(): Power on the ADC hardware\n• adc_gpio_init(gpio): Prep GPIO (26-29) for ADC\n• adc_select_input(0-4): 0-3=GPIO 26-29, 4=Temp Sensor\n• adc_read(): 12-bit raw value (0–4095)',
                parentTitle: 'Tutorial 4'
            },
            {
                id: 't4-adc-example',
                title: 'Example: ADC Potentiometer',
                type: 'code',
                content: `
#include "hardware/adc.h"
void setup() {
    adc_init();
    adc_gpio_init(26); // Channel 0
    adc_select_input(0);
}
int main() {
    setup();
    while (1) {
        uint16_t val = adc_read();
        int led_count = (val * 10) / 4095;
        for(int i=0; i<10; i++) gpio_put(i, i < led_count);
        sleep_ms(100);
    }
}
                `.trim(),
                parentTitle: 'Tutorial 4'
            },
            {
                id: 't4-driver-pattern',
                title: 'Embedded Driver Pattern',
                type: 'text',
                content: 'Separating HW logic into header (.h) and source (.c) files:\n• Header: Include guards (#ifndef), stdint.h/pico.h, and function prototypes.\n• Source: Implement low-level interactions.\nBenefit: Portability and reusability across projects.',
                parentTitle: 'Tutorial 4'
            },
            {
                id: 't4-pwm-formula',
                title: 'PWM Frequency Calc',
                type: 'formula',
                content: 'f_{pwm} = \\frac{f_{sys}}{Clock\\_Divider \\times (TOP + 1)}',
                parentTitle: 'Tutorial 4'
            },
            {
                id: 't4-pwm-api',
                title: 'Pico SDK PWM API',
                type: 'text',
                content: '• gpio_set_function(gpio, GPIO_FUNC_PWM): Assign PWM to pin\n• pwm_gpio_to_slice_num(gpio): Get slice (0-7)\n• pwm_set_wrap(slice, wrap): Set TOP (max count)\n• pwm_set_clkdiv(slice, float): Set divider\n• pwm_set_enabled(slice, bool): Enable/Disable PWM\n• pwm_set_gpio_level(gpio, level): Set compare (duty cycle)',
                parentTitle: 'Tutorial 4'
            },
            {
                id: 't4-pwm-registers',
                title: 'PWM Registers & Control',
                type: 'text',
                content: '• PWM_CTL: Enable/Disable slice\n• PWM_DIV: Frequency adjust (1.0 to 256.0)\n• PWM_CC: Duty cycle (Compare A/B)\n• PWM_TOP: Period control (Wrap value)',
                parentTitle: 'Tutorial 4'
            },
            {
                id: 't4-motor-driver',
                title: 'Practice: Motor Driver Implementation',
                type: 'code',
                content: `
// motor_driver.c
void motor_init() {
    gpio_init(DIR1); gpio_set_dir(DIR1, GPIO_OUT);
    gpio_set_function(PWM_PIN, GPIO_FUNC_PWM);
    uint slice = pwm_gpio_to_slice_num(PWM_PIN);
    pwm_set_wrap(slice, 255); pwm_set_clkdiv(slice, 4.0f);
    pwm_set_enabled(slice, true);
}
void motor_ctrl(uint16_t spd, bool fwd) {
    gpio_put(DIR1, fwd); gpio_put(DIR2, !fwd);
    pwm_set_gpio_level(PWM_PIN, (spd > 255) ? 255 : spd);
}
                `.trim(),
                parentTitle: 'Tutorial 4'
            }
        ]
    },
    {
        id: 'tut5',
        title: 'Tutorial 5 - UML & FSM',
        submodules: [
            {
                id: 't5-fsm-theory',
                title: 'Moore vs Mealy FSM',
                type: 'text',
                content: '• Moore: Output = f(State). Stable output per state. Typically 2 case blocks.\n• Mealy: Output = f(State, Input). Faster response (output changes with input). Output per transition.',
                parentTitle: 'Tutorial 5'
            },
            {
                id: 't5-moore-code',
                title: 'Moore FSM in C',
                type: 'code',
                content: `
enum state {OFF, ON};
int main() {
    enum state curr = OFF; int input = 0;
    while(1) {
        // Output logic: Depends ONLY on state
        int output = (curr == ON) ? 1 : 0;
        // Next State logic: Depends on state & input
        switch(curr) {
            case OFF: if(input) curr = ON; break;
            case ON:  if(!input) curr = OFF; break;
        }
    }
}
                `.trim(),
                parentTitle: 'Tutorial 5'
            },
            {
                id: 't5-mealy-code',
                title: 'Mealy FSM in C',
                type: 'code',
                content: `
enum state {OFF, ON};
int main() {
    enum state curr = OFF; int input = 0, output = 0;
    while(1) {
        switch(curr) {
            case OFF:
                if(input) { curr = ON; output = 1; }
                else { output = 0; }
                break;
            case ON:
                if(!input) { curr = OFF; output = 0; }
                else { output = 1; }
                break;
        }
    }
}
                `.trim(),
                parentTitle: 'Tutorial 5'
            }
        ]
    },
    {
        id: 'tut6',
        title: 'Tutorial 6 - Stateflow Charts',
        submodules: []
    },
    {
        id: 'tut7',
        title: 'Tutorial 7 - Timers & Interrupts I',
        submodules: [
            {
                id: 't7-timer-api',
                title: 'Pico SDK Timer/Alarm API',
                type: 'text',
                content: '• add_alarm_in_ms(ms, callback, data, fire_if_past): Set one-shot alarm\n• add_repeating_timer_ms(ms, callback, data, timer_ptr): Set periodic timer\n• cancel_repeating_timer(timer_ptr): Stop periodic timer\n• struct repeating_timer: {delay, alarm_id, last_time, user_data}',
                parentTitle: 'Tutorial 7'
            },
            {
                id: 't7-alarm-example',
                title: 'Example: One-Shot Alarm',
                type: 'code',
                content: `
#include "pico/stdlib.h"
volatile bool fired = false;
int64_t alarm_cb(alarm_id_t id, void *user_data) {
    fired = true; return 0; // 0 = Do not reschedule
}
int main() {
    stdio_init_all();
    add_alarm_in_ms(2000, alarm_cb, NULL, false);
    while (!fired) sleep_ms(100);
}
                `.trim(),
                parentTitle: 'Tutorial 7'
            },
            {
                id: 't7-repeating-example',
                title: 'Example: Repeating Timer',
                type: 'code',
                content: `
#include "pico/stdlib.h"
bool timer_cb(struct repeating_timer *t) {
    static int count = 0;
    if (++count >= 3) return false; // Stop after 3 fires
    return true; // Continue repeating
}
int main() {
    struct repeating_timer timer;
    add_repeating_timer_ms(1000, timer_cb, NULL, &timer);
    while (1) tight_loop_contents();
}
                `.trim(),
                parentTitle: 'Tutorial 7'
            }
        ]
    },
    {
        id: 'tut8',
        title: 'Tutorial 8 - Timers & Interrupts II',
        submodules: [
            {
                id: 't8-irq-api',
                title: 'Pico SDK IRQ API',
                type: 'text',
                content: '• irq_set_priority(num, priority): Set priority (0=highest)\n• irq_get_priority(num): Get current IRQ priority\n• irq_set_enabled(num, bool): Global IRQ enable/disable\n• irq_is_enabled(num): Check if IRQ is enabled\n• gpio_set_irq_enabled_with_callback(gpio, events, bool, callback): Set GPIO IRQ + ISR handler\nEvents: GPIO_IRQ_EDGE_RISE, GPIO_IRQ_EDGE_FALL',
                parentTitle: 'Tutorial 8'
            },
            {
                id: 't8-irq-example',
                title: 'GPIO Interrupt Example',
                type: 'code',
                content: `
#include "pico/stdlib.h"
#include "hardware/irq.h"
void gpio_isr(uint gpio, uint32_t events) { gpio_put(16, !gpio_get(16)); }
int main() {
    gpio_init(25); gpio_set_dir(25, GPIO_OUT); // LED1
    gpio_init(16); gpio_set_dir(16, GPIO_OUT); // LED2
    gpio_init(15); gpio_set_dir(15, GPIO_IN); gpio_pull_down(15);
    gpio_set_irq_enabled_with_callback(15, GPIO_IRQ_EDGE_RISE, true, &gpio_isr);
    irq_set_priority(IO_IRQ_BANK0, 0); irq_set_enabled(IO_IRQ_BANK0, true);
    while (1) { gpio_put(25, 1); sleep_ms(500); gpio_put(25, 0); sleep_ms(500); }
}
                `.trim(),
                parentTitle: 'Tutorial 8'
            }
        ]
    },
    {
        id: 'tut9',
        title: 'Tutorial 9 - Communication (UART & I2C)',
        submodules: [
            {
                id: 't9-uart-packet',
                title: 'UART Packet & Syntax',
                type: 'text',
                content: 'Structure: [START] [DATA(5-8b)] [PARITY(opt)] [STOP(1-2b)]\nIdle state: Logic HIGH (1). Start bit is LOW (0). Data is LSB-first.',
                parentTitle: 'Tutorial 9'
            },
            {
                id: 't9-i2c-packet',
                title: 'I2C Packet & Protocol',
                type: 'text',
                content: 'Structure: [START] [ADDR(7b)] [R/W] [ACK] [DATA(8b)] [ACK/NACK] [STOP]\nSDA pulls LOW while SCL is HIGH for START. SDA pulls HIGH while SCL is HIGH for STOP.',
                parentTitle: 'Tutorial 9'
            },
            {
                id: 't9-uart-api',
                title: 'Pico SDK UART API',
                type: 'text',
                content: '• uart_init(uart, baud): Initialize UART\n• uart_set_baudrate(uart, baud): Update baud rate\n• uart_set_format(uart, bits, stop, parity): Data/Stop/Parity cfg\n• uart_set_fifo_enabled(uart, bool): Enable/Disable FIFO\n• uart_putc(uart, c): Send byte (blocking)\n• uart_getc(uart): Read byte (blocking)\n• uart_is_readable(uart): Data available to read?\n• uart_is_writable(uart): Buffer ready to transmit?\n• uart_set_irq_enables(uart, rx, tx): Enable RX/TX interrupts',
                parentTitle: 'Tutorial 9'
            },
            {
                id: 't9-uart-polling',
                title: 'UART Example: Polling',
                type: 'code',
                content: `
#include "hardware/uart.h"
#define UART_ID uart0
int main() {
    uart_init(UART_ID, 115200);
    gpio_set_function(0, GPIO_FUNC_UART); gpio_set_function(1, GPIO_FUNC_UART);
    while (1) {
        if (uart_is_readable(UART_ID)) {
            uint8_t ch = uart_getc(UART_ID);
            if (uart_is_writable(UART_ID)) uart_putc(UART_ID, ch + 1);
        }
    }
}
                `.trim(),
                parentTitle: 'Tutorial 9'
            },
            {
                id: 't9-uart-interrupt',
                title: 'UART Example: Interrupts',
                type: 'code',
                content: `
#include "hardware/uart.h"
void on_uart_rx() {
    while (uart_is_readable(uart0)) {
        uint8_t ch = uart_getc(uart0);
        if (uart_is_writable(uart0)) uart_putc(uart0, ch);
    }
}
int main() {
    uart_init(uart0, 115200);
    gpio_set_function(0, GPIO_FUNC_UART); gpio_set_function(1, GPIO_FUNC_UART);
    uart_set_irq_enables(uart0, true, false);
    irq_set_exclusive_handler(UART0_IRQ, on_uart_rx);
    irq_set_enabled(UART0_IRQ, true);
    while (1) tight_loop_contents();
}
                `.trim(),
                parentTitle: 'Tutorial 9'
            },
            {
                id: 't9-i2c-api',
                title: 'Pico SDK I2C API',
                type: 'text',
                content: '• uint i2c_init(i2c, baud): Init HW block, returns baud\n• int i2c_read_blocking(i2c, addr, dst, len, nostop): Read bytes\n• int i2c_write_blocking(i2c, addr, src, len, nostop): Write bytes\n• gpio_set_function(sda/scl, GPIO_FUNC_I2C): Set pins to I2C\n• gpio_pull_up(sda/scl): Enable internal pull-ups',
                parentTitle: 'Tutorial 9'
            },
            {
                id: 't9-i2c-example',
                title: 'I2C Example: MPU6050 Read',
                type: 'code',
                content: `
#include "hardware/i2c.h"
const int addr = 0x68;
void mpu6050_reset() {
    uint8_t buf[] = {0x6B, 0x00}; // Wake up MPU
    i2c_write_blocking(i2c_default, addr, buf, 2, false);
}
int main() {
    i2c_init(i2c_default, 400 * 1000);
    gpio_set_function(4, GPIO_FUNC_I2C); gpio_set_function(5, GPIO_FUNC_I2C);
    gpio_pull_up(4); gpio_pull_up(5); mpu6050_reset();
    uint8_t reg = 0x3B, data[6];
    while (1) {
        i2c_write_blocking(i2c_default, addr, &reg, 1, true);
        i2c_read_blocking(i2c_default, addr, data, 6, false);
        int16_t x = data[0]<<8|data[1]; // Repeat for y, z
        sleep_ms(100);
    }
}
                `.trim(),
                parentTitle: 'Tutorial 9'
            }
        ]
    },
    {
        id: 'tut10',
        title: 'Tutorial 10 - Scheduling (FreeRTOS)',
        submodules: [
            {
                id: 't10-hyperperiod',
                title: 'Hyperperiod Calculation',
                type: 'formula',
                content: 'L = LCM(p_1, p_2, ..., p_n)',
                parentTitle: 'Tutorial 10'
            },
            {
                id: 't10-rm-bound',
                title: 'RM Utilization Bound',
                type: 'formula',
                content: 'U = \\sum_{i=1}^{n} \\frac{e_i}{p_i} \\le n(2^{1/n} - 1)',
                parentTitle: 'Tutorial 10'
            },
            {
                id: 't10-rm-response',
                title: 'RM Response Time Test',
                type: 'formula',
                content: 'W_i(t) = e_i + \\sum_{k=1}^{i-1} \\lceil \\frac{t}{p_k} \\rceil e_k \\text{ for } 0 < t \\le p_i',
                parentTitle: 'Tutorial 10'
            },
            {
                id: 't10-task-api',
                title: 'Task Definition & Creation',
                type: 'code',
                content: `
void vTaskCode(void *pvParameters) {
    while(1) { /* Task operation loop */ }
}
// Returns pdPASS if successful
BaseType_t xTaskCreate(
    TaskFunction_t pvTaskCode, const char *pcName, uint16_t usStackDepth,
    void *pvParameters, UBaseType_t uxPriority, TaskHandle_t *pxCreatedTask
);
                `.trim(),
                parentTitle: 'Tutorial 10'
            },
            {
                id: 't10-led-example',
                title: 'Basic LED Task Example',
                type: 'code',
                content: `
#include <FreeRTOS.h>
#include <task.h>
#include <pico/stdlib.h>
void led_task(void *pvParameters) {
    const uint LED_PIN = PICO_DEFAULT_LED_PIN;
    gpio_init(LED_PIN); gpio_set_dir(LED_PIN, GPIO_OUT);
    const TickType_t xDelay = 500 / portTICK_PERIOD_MS;
    while(1) {
        gpio_put(LED_PIN, 1); vTaskDelay(xDelay);
        gpio_put(LED_PIN, 0); vTaskDelay(xDelay);
    }
}
int main() {
    stdio_init_all();
    xTaskCreate(led_task, "LED Task", 256, NULL, 1, NULL);
    vTaskStartScheduler(); while(1);
}
                `.trim(),
                parentTitle: 'Tutorial 10'
            },
            {
                id: 't10-delay-api',
                title: 'Delay API Reference',
                type: 'code',
                content: `
// Relative delay: blocks for xTicksToDelay from current time
void vTaskDelay(const TickType_t xTicksToDelay);
// Example: vTaskDelay(pdMS_TO_TICKS(30)); // Delay 30ms

// Absolute: unblock at specific time (PreviousWakeTime + xTimeIncrement)
void vTaskDelayUntil(TickType_t *pxPreviousWakeTime, const TickType_t xTimeIncrement);
// Example:
// TickType_t xLastWakeTime = xTaskGetTickCount();
// vTaskDelayUntil(&xLastWakeTime, xFrequency);
                `.trim(),
                parentTitle: 'Tutorial 10'
            },
            {
                id: 't10-config',
                title: 'FreeRTOSConfig.h Key Flags',
                type: 'text',
                content: '• configCPU_CLOCK_HZ: MCU frequency (Hz)\n• configUSE_PREEMPTION: 1 = Preemptive multitasking\n• configMINIMAL_STACK_SIZE: Smallest stack per task\n• configTOTAL_HEAP_SIZE: Total RAM for dynamic allocation\n• configCHECK_FOR_STACK_OVERFLOW: Enable overflow checks',
                parentTitle: 'Tutorial 10'
            },
            {
                id: 't10-adv-example',
                title: 'Periodic LED & ADC Example',
                type: 'code',
                content: `
#define POTENTIOMETER_PIN 26
#define LED_PIN PICO_DEFAULT_LED_PIN
void led_task(void *pvParams) {
    gpio_init(LED_PIN); gpio_set_dir(LED_PIN, GPIO_OUT);
    TickType_t xLastWakeTime = xTaskGetTickCount();
    const TickType_t xPeriod = pdMS_TO_TICKS(500);
    while(1) {
        gpio_put(LED_PIN, 1); vTaskDelayUntil(&xLastWakeTime, xPeriod);
        gpio_put(LED_PIN, 0); vTaskDelayUntil(&xLastWakeTime, xPeriod);
    }
}
void ADCTask(void* pvParams) {
    adc_init(); adc_gpio_init(POTENTIOMETER_PIN); adc_select_input(0);
    TickType_t xLastWakeTime = xTaskGetTickCount();
    const TickType_t xPeriod = pdMS_TO_TICKS(60);
    while(1) { adc_read(); vTaskDelayUntil(&xLastWakeTime, xPeriod); }
}
int main() {
    stdio_init_all();
    xTaskCreate(led_task, "LED Task", 256, NULL, 1, NULL);
    xTaskCreate(ADCTask, "ADC Task", 256, NULL, 1, NULL);
    vTaskStartScheduler(); while(1);
}
                `.trim(),
                parentTitle: 'Tutorial 10'
            }
        ]
    },
    {
        id: 'pico-pinout',
        title: 'Hardware - Pinout Reference',
        submodules: [
            {
                id: 'pico-w-pinout',
                title: 'Raspberry Pi Pico 2 W Pinout',
                type: 'image',
                src: '/pico2w-pinout.svg',
                parentTitle: 'Hardware'
            }
        ]
    }
];
