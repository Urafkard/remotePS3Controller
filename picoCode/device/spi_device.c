#include <stdlib.h>
#include <stdio.h>
#include <string.h>


#include "bsp/board.h"
#include "tusb.h"
#include "pico/stdlib.h"

#include "pico/binary_info.h"
#include "hardware/spi.h"
#include "boards/pico.h"

#ifndef spi_default
#define spi_default spi0
#endif
#ifndef PICO_DEFAULT_SPI_TX_PIN
#define PICO_DEFAULT_SPI_TX_PIN 19
#endif
#ifndef PICO_DEFAULT_SPI_SCK_PIN
#define PICO_DEFAULT_SPI_SCK_PIN 17
#endif
#ifndef PICO_DEFAULT_SPI_CSN_PIN
#define PICO_DEFAULT_SPI_CSN_PIN 18
#endif
#ifndef PICO_DEFAULT_SPI_RX_PIN
#define PICO_DEFAULT_SPI_RX_PIN 16
#endif


void hid_task(void);



struct report
{
	uint8_t data[12];
} report;

#define BUF_LEN sizeof(report) // bits for controller


void printbuf(uint8_t buf[], size_t len) {
    int i;
    for (i = 0; i < len; ++i) {
        if (i % 16 == 15)
            printf("%02x\n", buf[i]);
        else
            printf("%02x ", buf[i]);
    }

    // append trailing newline if there isn't one
    if (i % 16) {
        putchar('\n');
    }
}
int count;

void interruptCallback(uint gpio, uint32_t events) {
    uint8_t in_buf[BUF_LEN];
    spi_read_blocking(spi_default, 0, in_buf, BUF_LEN);
    memcpy(&report,&in_buf,sizeof(report));
    count++;
}



int main() {
    board_init();

    tusb_init();
#if !defined(spi_default) || !defined(PICO_DEFAULT_SPI_SCK_PIN) || !defined(PICO_DEFAULT_SPI_TX_PIN) || !defined(PICO_DEFAULT_SPI_RX_PIN) || !defined(PICO_DEFAULT_SPI_CSN_PIN)
#warning spi/spi_slave example requires a board with SPI pins
    puts("Default SPI pins were not defined");
#else

    // Enable SPI 0 at 1 MHz and connect to GPIOs
    spi_init(spi_default, 1000*1000);
    spi_set_slave(spi_default, true);
    gpio_set_function(PICO_DEFAULT_SPI_RX_PIN, GPIO_FUNC_SPI);
    gpio_set_function(PICO_DEFAULT_SPI_SCK_PIN, GPIO_FUNC_SPI);
    gpio_set_function(PICO_DEFAULT_SPI_TX_PIN, GPIO_FUNC_SPI);
    gpio_set_function(PICO_DEFAULT_SPI_CSN_PIN, GPIO_FUNC_SPI);
    // Make the SPI pins available to picotool
    bi_decl(bi_4pins_with_func(PICO_DEFAULT_SPI_RX_PIN, PICO_DEFAULT_SPI_TX_PIN, PICO_DEFAULT_SPI_SCK_PIN, PICO_DEFAULT_SPI_CSN_PIN, GPIO_FUNC_SPI));

    count = 0;
    // Set interrupt
    gpio_set_irq_enabled_with_callback(15, GPIO_IRQ_EDGE_RISE, true, &interruptCallback);

    
    while (1)
    {
        hid_task();
        tud_task(); // tinyusb device task
    }
#endif
}


void con_panic(uint16_t errcode)
{
    while (1)
    {
        tud_task(); // tinyusb device task
        // Remote wakeup
        if (tud_suspended())
        {
            // Wake up host if we are in suspend mode
            // and REMOTE_WAKEUP feature is enabled by host
            tud_remote_wakeup();
        }

        if (tud_hid_ready())
        {
            tud_hid_n_report(0x00, 0x01, &report, sizeof(report));
        }
    }
}

void hid_task(void)
{
    const uint32_t interval_ms = 1;
    static uint32_t start_ms = 0;

    if (board_millis() - start_ms < interval_ms)
    {
        return; // not enough time
    }
    start_ms += interval_ms;
    //report.buttons = ((board_millis() / 1000) % 2) << ((board_millis() / 2000) % 16);
    //report->cross = ((board_millis() / 1000) % 2);

    // Remote wakeup
    if (tud_suspended())
    {
        // Wake up host if we are in suspend mode
        // and REMOTE_WAKEUP feature is enabled by host
        tud_remote_wakeup();
    }

    if (tud_hid_ready())
    {
        //tud_hid_n_gamepad_report(0x00,0x00, controller->lx,controller->ly,0,controller->rx,controller->ry,0,controller->dpad,controller->buttons);
        tud_hid_n_report(0x00, 0x01, &report, sizeof(report));
    }
}

// Invoked when device is mounted
void tud_mount_cb(void)
{
}

// Invoked when device is unmounted
void tud_umount_cb(void)
{
}

// Invoked when usb bus is suspended
// remote_wakeup_en : if host allow us  to perform remote wakeup
// Within 7ms, device must draw an average of current less than 2.5 mA from bus
void tud_suspend_cb(bool remote_wakeup_en)
{
    (void)remote_wakeup_en;
}

// Invoked when usb bus is resumed
void tud_resume_cb(void)
{
}

//--------------------------------------------------------------------+
// USB HID
//--------------------------------------------------------------------+

// Invoked when received GET_REPORT control request
// Application must fill buffer report's content and return its length.
// Return zero will cause the stack to STALL request
uint16_t tud_hid_get_report_cb(uint8_t report_id, hid_report_type_t report_type, uint8_t *buffer, uint16_t reqlen)
{
    // TODO not Implemented
    (void)report_id;
    (void)report_type;
    (void)buffer;
    (void)reqlen;

    return 0;
}

// Invoked when received SET_REPORT control request or
// received data on OUT endpoint ( Report ID = 0, Type = 0 )
void tud_hid_set_report_cb(uint8_t report_id, hid_report_type_t report_type, uint8_t const *buffer, uint16_t bufsize)
{

    // echo back anything we received from host
    tud_hid_report(0, buffer, bufsize);
}