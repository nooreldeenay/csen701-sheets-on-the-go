
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
                content: '• DDRx: Set In(0)/Out(1)\n• PORTx: Set Out H(1)/L(0). If Input, 1=Pull-up\n• PINx: Read logic level (Read-only)',
                parentTitle: 'Tutorial 2'
            },
            {
                id: 't2-bit-ops',
                title: 'Bitwise Operations',
                type: 'text',
                content: '• Set: R|=(1<<n) | Clear: R&=~(1<<n)\n• Toggle: R^=(1<<n) | Check: if(R&(1<<n))',
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
                title: 'AVR GPIO: Buttons & LED',
                type: 'code',
                content: `
int main() {
    DDRC &= ~(1<<5); DDRB &= ~(1<<3); PORTB |= (1<<3); DDRD |= (1<<2);
    while (1) {
        if (PINC & (1<<5)) PORTD |= (1<<2); // PC5 (+ve) -> ON
        if (!(PINB & (1<<3))) PORTD &= ~(1<<2); // PB3 (-ve) -> OFF
    }
}
                `.trim(),
                parentTitle: 'Tutorial 3'
            },
            {
                id: 't3-adc-res-form',
                title: 'ADC Resolution',
                type: 'formula',
                content: 'Resolution = \\frac{V_{ref}}{2^n - 1}',
                parentTitle: 'Tutorial 3'
            },
            {
                id: 't3-adc-calc',
                title: 'ADC Output Calc',
                type: 'text',
                content: '• n=bits | Vref=Max V | Res = Vref / (2^n - 1) | Out = Vin / Res\n• Example (10bit, 5V): 0V=0 | 2.5V=512 | 5V=1023',
                parentTitle: 'Tutorial 3'
            },
            {
                id: 't3-adc-formula',
                title: 'ADC Transfer Function',
                type: 'formula',
                content: 'Out = \\frac{V_{in} \\times (2^n - 1)}{V_{ref}}',
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
                content: '• gpio_init(pin): Init PIN\n• gpio_set_dir(pin, 1=OUT/0=IN): Set direction\n• gpio_put(pin, val): Set Output\n• gpio_get(pin): Read Input\n• gpio_pull_up/down(pin): Internal resistors\n• gpio_disable_pulls(pin): Reset pulls',
                parentTitle: 'Tutorial 4'
            },
            {
                id: 't4-gpio-example',
                title: 'IR Sensor Toggle',
                type: 'code',
                content: `
void toggle() { gpio_put(25, !gpio_get(25)); }
int main() {
    gpio_init(25); gpio_set_dir(25, 1); // LED
    gpio_init(16); gpio_set_dir(16, 0); // IR Sensor
    while(1) {
        if(gpio_get(16)) { toggle(); while(gpio_get(16)); }
    }
}
                `.trim(),
                parentTitle: 'Tutorial 4'
            },
            {
                id: 't4-adc-api',
                title: 'Pico ADC API',
                type: 'text',
                content: '• adc_init() | adc_gpio_init(pin) | adc_select_input(0-4)\n• adc_read(): 12-bit val | adc_run(bool): Free-run mode\n• adc_set_temp_sensor_enabled(bool) | adc_set_clkdiv(float)\n• adc_fifo_setup(en, dreq, thresh, err, shift) | adc_fifo_is_empty()',
                parentTitle: 'Tutorial 4'
            },
            {
                id: 't4-adc-example',
                title: 'ADC LED Bar (0-9)',
                type: 'code',
                content: `
void setup() { adc_init(); adc_gpio_init(26); adc_select_input(0); }
int main() {
    setup(); for(int i=0; i<10; i++) { gpio_init(i); gpio_set_dir(i, 1); }
    while(1) {
        int n = (adc_read() * 10) / 4095;
        for(int i=0; i<10; i++) gpio_put(i, i < n);
        sleep_ms(100);
    }
}
                `.trim(),
                parentTitle: 'Tutorial 4'
            },
            {
                id: 't4-driver-pattern',
                title: 'Driver Pattern Components',
                type: 'text',
                content: '• Guards: #ifndef X_H | #define X_H | #endif (Stop re-definitions)\n• Includes: <stdint.h> (Fixed-width types) | "pico/stdlib.h" (GPIO)\n• Macros: #define PIN 15 (Easy hardware config)\n• Prototypes: Func definitions in .h | Logic in .c',
                parentTitle: 'Tutorial 4'
            },
            {
                id: 't4-driver-example',
                title: 'Driver: IR & LED',
                type: 'code',
                content: `
// infra_sensor.h & .c
void ir_init(uint p) { gpio_init(p); gpio_set_dir(p, 0); }
bool ir_hit(uint p) { return gpio_get(p); }

// led_driver.h & .c
void led_init(uint p) { gpio_init(p); gpio_set_dir(p, 1); }
void led_toggle(uint p) { gpio_put(p, !gpio_get(p)); }

// main.c
int main() {
    ir_init(15); led_init(2);
    while(1) { if(ir_hit(15)) led_toggle(2); sleep_ms(100); }
}
                `.trim(),
                parentTitle: 'Tutorial 4'
            },
            {
                id: 't4-pwm-formula',
                title: 'PWM Freq Calc',
                type: 'formula',
                content: 'f_{pwm} = \\frac{f_{sys}}{Div \\times (TOP + 1)}',
                parentTitle: 'Tutorial 4'
            },
            {
                id: 't4-pwm-api',
                title: 'Pico SDK PWM API',
                type: 'text',
                content: '• gpio_set_function(pin, GPIO_FUNC_PWM): Config pin\n• slice = pwm_gpio_to_slice_num(pin): Get slice (0-7)\n• pwm_set_wrap(slice, TOP): Set Period (Resolution)\n• pwm_set_clkdiv(slice, div): Set Freq Divider\n• pwm_set_gpio_level(pin, lvl): Set Duty Cycle',
                parentTitle: 'Tutorial 4'
            },
            {
                id: 't4-pwm-registers',
                title: 'PWM Registers',
                type: 'text',
                content: '• PWM_CTL: Control Slice (Enable, Mode)\n• PWM_DIV: Clock Divider (Frequency)\n• PWM_CC: Compare Value (Duty Cycle)\n• PWM_TOP: Wrap Value (Period)',
                parentTitle: 'Tutorial 4'
            },
            {
                id: 't4-pwm-fading',
                title: 'PWM: LED Fading',
                type: 'code',
                content: `
int main() {
    gpio_set_function(25, GPIO_FUNC_PWM);
    uint s = pwm_gpio_to_slice_num(25);
    pwm_set_wrap(s, 255); pwm_set_clkdiv(s, 4.f); pwm_set_enabled(s, 1);
    while(1) {
        for(int i=0; i<=255; i++) { pwm_set_gpio_level(25, i); sleep_ms(10); }
        for(int i=255; i>=0; i--) { pwm_set_gpio_level(25, i); sleep_ms(10); }
    }
}
                `.trim(),
                parentTitle: 'Tutorial 4'
            },
            {
                id: 't4-motor-driver',
                title: 'Driver: Motor Control',
                type: 'code',
                content: `
// Pins: PWM=8, DIR1=6, DIR2=7
void m_init() {
    gpio_init(6); gpio_set_dir(6, 1); gpio_init(7); gpio_set_dir(7, 1);
    gpio_set_function(8, GPIO_FUNC_PWM); uint s = pwm_gpio_to_slice_num(8);
    pwm_set_wrap(s, 255); pwm_set_clkdiv(s, 4.0f); pwm_set_enabled(s, 1);
}
void m_ctrl(int spd, bool fwd) {
    if(spd > 255) spd = 255;
    gpio_put(6, fwd); gpio_put(7, !fwd); pwm_set_gpio_level(8, spd);
}
int main() {
    m_init(); m_ctrl(255, 1); sleep_ms(2000); m_ctrl(0, 1); // Full speed -> Stop
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
                content: '• Moore: Output = f(State). Stable. 2 case blocks.\n• Mealy: Output = f(State, Input). Fast. Output per transition.',
                parentTitle: 'Tutorial 5'
            },
            {
                id: 't5-moore-code',
                title: 'Moore FSM (C)',
                type: 'code',
                content: `
enum state {OFF, ON} curr = OFF;
while(1) {
    int out = (curr == ON); // Output logic (State only)
    switch(curr) { // Next State logic (State + Input)
        case OFF: if(in) curr = ON; break;
        case ON:  if(!in) curr = OFF; break;
    }
}
                `.trim(),
                parentTitle: 'Tutorial 5'
            },
            {
                id: 't5-mealy-code',
                title: 'Mealy FSM (C)',
                type: 'code',
                content: `
enum state {OFF, ON} curr = OFF;
while(1) {
    switch(curr) { // Logic: f(State, Input)
        case OFF: if(in) { curr=ON; out=1; } else out=0; break;
        case ON:  if(!in) { curr=OFF; out=0; } else out=1; break;
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
                title: 'Pico SDK Alarms & Timers',
                type: 'text',
                content: '• Alarms: add_alarm_in_ms(ms, cb, data, fire_if_past). cb returns 0=end, >0=reschedule.\n• Repeating: add_repeating_timer_ms(ms, cb, data, &timer). cb returns false=stop, true=continue.\n• Rule: Logic MUST be in cb. Returning false stops timer.',
                parentTitle: 'Tutorial 7'
            },
            {
                id: 't7-repeating-struct',
                title: 'struct repeating_timer',
                type: 'text',
                content: '• delay (us) | alarm_id | last_time | user_data',
                parentTitle: 'Tutorial 7'
            },
            {
                id: 't7-alarm-example',
                title: 'One-Shot Alarm',
                type: 'code',
                content: `
volatile bool fired = false;
int64_t alarm_cb(alarm_id_t id, void *ud) { fired = true; return 0; }
int main() {
    add_alarm_in_ms(2000, alarm_cb, NULL, false); // 2s delay
    while (!fired) sleep_ms(100);
}
                `.trim(),
                parentTitle: 'Tutorial 7'
            },
            {
                id: 't7-repeating-example',
                title: 'Repeating Timer',
                type: 'code',
                content: `
struct repeating_timer t;
bool timer_cb(struct repeating_timer *rt) {
    static int c = 0; if (++c >= 3) { cancel_repeating_timer(rt); return false; }
    return true; 
}
int main() {
    add_repeating_timer_ms(1000, timer_cb, NULL, &t);
    while (1) tight_loop_contents();
}
                `.trim(),
                parentTitle: 'Tutorial 7'
            },
            {
                id: 't7-tccr0-cs',
                title: 'CS02:0 Prescaler (AVR)',
                type: 'table',
                content: "Config|Prescaler Order (clk_TOS / x)\n000-111|Stop, 1, 8, 32, 64, 128, 256, 1024",
                parentTitle: 'Tutorial 7'
            }
        ]
    },
    {
        id: 'tut8',
        title: 'Tutorial 8 - Timers & Interrupts II',
        submodules: [
            {
                id: 't8-irq-sources',
                title: 'RP2040 Interrupt Sources (NVIC)',
                type: 'table',
                content: "IRQ|Interrupt Source|Notes\n0-3|TIMER_IRQ_0 to 3|One per timer slice\n13|IO_IRQ_BANK0|GPIO Bank 0 (Pins 0-29)\n20-21|UART0_IRQ / UART1_IRQ|Universal Async. Comm.\n22|ADC_IRQ_FIFO|Converter output ready\n23-24|I2C0_IRQ / I2C1_IRQ|Inter-Integrated Circuit",
                parentTitle: 'Tutorial 8'
            },
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
                title: 'UART Frame Structure (8-N-1)',
                type: 'table',
                content: "Start Bit '0'|D0|D1|D2|D3|D4|D5|D6|D7|Parity Bit|Stop Bit '1'",
                parentTitle: 'Tutorial 9'
            },
            {
                id: 't9-i2c-packet',
                title: 'I2C Packet Structure',
                type: 'table',
                content: "START|ADDR (7b)|R=1/W=0|ACK|DATA (8b)|ACK/NACK|STOP",
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
                title: 'I2C Configuration & API',
                type: 'text',
                content: '• CMakeLists: Add hardware_i2c to target_link_libraries.\n• Setup: gpio_set_function(sda/scl, GPIO_FUNC_I2C) + gpio_pull_up(sda/scl).\n• i2c_init(inst, baud): Init i2c0 or i2c1 (e.g., 400000 for 400kHz).\n• i2c_write_blocking(inst, addr, src, len, nostop): if nostop=true, master keeps bus control for a Restart.\n• i2c_read_blocking(inst, addr, dst, len, nostop): Read bytes from address.',
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
    uint8_t buf[] = {0x6B, 0x80}; // Pulse Reset
    i2c_write_blocking(i2c_default, addr, buf, 2, false);
    sleep_ms(100);
    buf[1] = 0x00; // Clear sleep mode (0x6B = 0x00)
    i2c_write_blocking(i2c_default, addr, buf, 2, false);
}
int main() {
    i2c_init(i2c_default, 400 * 1000);
    gpio_set_function(4, GPIO_FUNC_I2C); gpio_set_function(5, GPIO_FUNC_I2C);
    gpio_pull_up(4); gpio_pull_up(5); mpu6050_reset();
    uint8_t reg = 0x3B, data[6];
    while (1) {
        // Write reg addr with nostop=true, then read
        i2c_write_blocking(i2c_default, addr, &reg, 1, true);
        i2c_read_blocking(i2c_default, addr, data, 6, false);
        int16_t x = (data[0] << 8) | data[1]; // Combine MSB, LSB (D0=LSB)
        printf("Accel X: %d\\n", x);
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
        id: 'lec3-rp2040',
        title: 'Lecture 3 - The RP2040',
        submodules: [
            {
                id: 'l3-overview',
                title: 'RP2040 Overview',
                type: 'text',
                content: 'Name: RP-2-0-4-0: 2=Dual | 0=M0+ | 4=floor(log2(RAM/16k)) | 0=No Flash\nSpecs: Dual M0+ (AHB/APB) | 30 GPIO (4 ADC) | 264kB SRAM | SWD/JTAG',
                parentTitle: 'Lecture 3'
            }
        ]
    },
    {
        id: 'lec4-sensors',
        title: 'Lecture 4 - Sensor Characteristics',
        submodules: [
            {
                id: 'l4-prec-acc',
                title: 'Precision & Accuracy',
                type: 'formula',
                content: 'Prec_n = 1 - \\frac{|Out_{n,actual} - \\overline{Out}|}{\\overline{Out}} \\quad \\overline{Out} = \\frac{1}{N} \\sum_{n=1}^{N} Out_{n,actual} \\quad Acc_n = 1 - \\frac{|Out_{n,ideal} - Out_{n,actual}|}{Out_{n,ideal}}',
                parentTitle: 'Lecture 4'
            },
            {
                id: 'l4-sens-err',
                title: 'Sensitivity & Error',
                type: 'formula',
                content: '\\varepsilon_n = Out_{ideal} - Out_{actual} \\quad Sens = \\frac{\\Delta Output}{\\Delta Input}',
                parentTitle: 'Lecture 4'
            },
            {
                id: 'l4-response',
                title: 'Response Characteristics',
                type: 'text',
                content: '• τ (Time Constant): Time to reach 63.2% of step change\n• Response Time = 5τ: Time to reach 99.3% of step change',
                parentTitle: 'Lecture 4'
            }
        ]
    },
    {
        id: 'lec6-stats',
        title: 'Lecture 6 - Sensor Stats & ADC',
        submodules: [
            {
                id: 'l6-formulas',
                title: 'Mean & Variance',
                type: 'formula',
                content: '\\mu = \\bar{X} = \\frac{1}{N} \\sum_{n=1}^{N} X_{n,meas} \\quad \\sigma_x^2 = \\frac{1}{N} \\sum_{n=1}^{N} (X_n - \\bar{X})^2 \\quad \\sigma_x = \\sqrt{\\sigma_x^2}',
                parentTitle: 'Lecture 6'
            },
            {
                id: 'l6-graph-stats',
                title: 'Graph Characteristics',
                type: 'text',
                content: '• Skewed Left/Right → Accuracy (Bias)\n• Curve Width (Std Dev) → Precision (Repeatability)\n• Large Std Dev → Noisy Sensor',
                parentTitle: 'Lecture 6'
            }
        ]
    },
    {
        id: 'lec15-rtos',
        title: 'Lecture 15 - Scheduling (EDF/Aperiodic)',
        submodules: [
            {
                id: 'l15-tda-formula',
                title: 'Response Time / TDA',
                type: 'formula',
                content: 'w_i(t) = e_i + e_s + \\lceil \\frac{t - e_s}{p_s} \\rceil e_s + \\sum_{k=1}^{i-1} \\lceil \\frac{t}{p_k} \\rceil e_k',
                parentTitle: 'Lecture 15'
            }
        ]
    },
    {
        id: 'hw-pinouts',
        title: 'Hardware - Pinout Reference',
        submodules: [
            {
                id: 'pico-w-pinout',
                title: 'Raspberry Pi Pico 2 W Pinout',
                type: 'image',
                src: 'pico2w-pinout.svg',
                parentTitle: 'Hardware'
            },
            {
                id: 'nano-rp2040-pinout',
                title: 'Arduino Nano RP2040 Connect Pinout',
                type: 'image',
                src: 'Pinout_NanoRP2040_latest.png',
                parentTitle: 'Hardware'
            }
        ]
    }
];
