if (NOT PICO_NO_HARDWARE)
    add_subdirectory(host)
    add_subdirectory(device)
endif ()