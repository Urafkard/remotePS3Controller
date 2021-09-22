add_executable(spi_device
        spi_device.c
        usb_descriptors.c
        )


target_include_directories(spi_device PRIVATE ${CMAKE_CURRENT_LIST_DIR})
# Pull in basic dependencies
target_link_libraries(spi_device PRIVATE pico_stdlib hardware_spi tinyusb_device tinyusb_board)

# enable usb output, disable uart output
#pico_enable_stdio_usb(spi_device 1)
#pico_enable_stdio_uart(spi_device 0)

# create map/bin/hex file etc.
pico_add_extra_outputs(spi_device)

# add url via pico_set_program_url
#example_auto_set_url(spi_device)