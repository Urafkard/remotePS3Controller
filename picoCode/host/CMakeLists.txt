add_executable(spi_host
        spi_host.c
        )


# Pull in basic dependencies
target_link_libraries(spi_host pico_stdlib hardware_spi)

# enable usb output, disable uart output
pico_enable_stdio_usb(spi_host 1)
pico_enable_stdio_uart(spi_host 0)

# create map/bin/hex file etc.
pico_add_extra_outputs(spi_host)

# add url via pico_set_program_url
#example_auto_set_url(spi_host)