#include <stdio.h>
#include "pico/stdlib.h"
#include "pico/binary_info.h"
#include "hardware/spi.h"
#include "boards/pico.h"


#ifndef spi_default
#define spi_default spi0
#endif
#ifndef PICO_DEFAULT_SPI_TX_PIN
#define PICO_DEFAULT_SPI_TX_PIN 16
#endif
#ifndef PICO_DEFAULT_SPI_SCK_PIN
#define PICO_DEFAULT_SPI_SCK_PIN 17
#endif
#ifndef PICO_DEFAULT_SPI_CSN_PIN
#define PICO_DEFAULT_SPI_CSN_PIN 18
#endif
#ifndef PICO_DEFAULT_SPI_RX_PIN
#define PICO_DEFAULT_SPI_RX_PIN 19
#endif

#define IRQ_PIN 15



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

void sentToDevice(uint8_t* out_buf,int len){
	//trigger interrupt
	gpio_put(IRQ_PIN, 1);
	sleep_ms(2);
	gpio_put(IRQ_PIN, 0);
	sleep_ms(1);
	spi_write_blocking(spi_default,out_buf,len);
}



int main() {
	// Enable UART so we can print
	stdio_init_all();
	sleep_ms(3 * 1000);
#if !defined(spi_default) || !defined(PICO_DEFAULT_SPI_SCK_PIN) || !defined(PICO_DEFAULT_SPI_TX_PIN) || !defined(PICO_DEFAULT_SPI_RX_PIN) || !defined(PICO_DEFAULT_SPI_CSN_PIN)
#warning spi/spi_master example requires a board with SPI pins
	puts("Default SPI pins were not defined");
#else

	// Enable SPI 0 at 1 MHz and connect to GPIOs
	spi_init(spi_default, 1000*1000);
	gpio_set_function(PICO_DEFAULT_SPI_RX_PIN, GPIO_FUNC_SPI);
	gpio_set_function(PICO_DEFAULT_SPI_SCK_PIN, GPIO_FUNC_SPI);
	gpio_set_function(PICO_DEFAULT_SPI_TX_PIN, GPIO_FUNC_SPI);
	gpio_set_function(PICO_DEFAULT_SPI_CSN_PIN, GPIO_FUNC_SPI);
	// Make the SPI pins available to picotool
	bi_decl(bi_4pins_with_func(PICO_DEFAULT_SPI_RX_PIN, PICO_DEFAULT_SPI_TX_PIN, PICO_DEFAULT_SPI_SCK_PIN, PICO_DEFAULT_SPI_CSN_PIN, GPIO_FUNC_SPI));

	gpio_init(IRQ_PIN);
	gpio_set_dir(IRQ_PIN, GPIO_OUT);

	uint8_t out_buf[BUF_LEN], in_buf[BUF_LEN];

	// Initialize output buffer
	for (size_t i = 0; i < BUF_LEN; ++i) {
		out_buf[i] = i;
	}

	printf("sizeof(PS3Controller): %d\n", sizeof(report));
	
	for (size_t i = 0; ; ++i) {
		uint8_t temp[BUF_LEN];
		for(int t = 0; t < BUF_LEN; t++){
			temp[t] = getchar();
		}

		sentToDevice(temp,sizeof(report));
	}
#endif
}