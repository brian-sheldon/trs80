
#include "z80.h"
//#include <stdio.h>
//#include <stdlib.h>
//#include <stdbool.h>

#include <string.h>

//#include "io.h"
#include "cli.h"

/* 64K memory for testing. */
//static uint8_t memory[65536];

/* I/O ports (256 ports). */
static uint8_t io_ports[256];

static uint8_t test_mem_read(void *ctx, uint16_t addr) {
    (void)ctx;
    return memory[addr];
}

static void test_mem_write(void *ctx, uint16_t addr, uint8_t val) {
    (void)ctx;
    memory[addr] = val;
}

static uint8_t test_io_read(void *ctx, uint16_t port) {
    (void)ctx;
    return io_ports[port & 0xFF];
}

static void test_io_write(void *ctx, uint16_t port, uint8_t val) {
    (void)ctx;
    io_ports[port & 0xFF] = val;
}

static Z80 cpu;

/* Initialize CPU and clear memory for a new test. */
static void reset(void) {
    memset(memory, 0, sizeof(memory));
    memset(io_ports, 0, sizeof(io_ports));
    z80_init(&cpu);
    cpu.mem_read = test_mem_read;
    cpu.mem_write = test_mem_write;
    cpu.io_read = test_io_read;
    cpu.io_write = test_io_write;
    cpu.ctx = NULL;
    /* Reset to known state: all registers 0, SP=0xFFFE. */
    cpu.a = 0; cpu.f = 0;
    cpu.sp = 0xFFFE; /* Use a safe stack address for tests */
}

static uint8_t ops[] = {
  0x01, 0x00, 0x00,       // 10 ld bc,0
  0x11, 0x00, 0x00,       // 10 ld de,0
  0x21, 0x00, 0x00,       // 10 ld hl,0
  // loop avgs ~ 122 ticks, which at 5.20 mhz = a count of about $1000000 every 6 min 33 sec
  // so doing cli cmd d at this time will show 00f0  xxxx 0001 0000, xxxx as this portion changes fast
  // displaying state regularly will show a slightly higher mhz as this value is based only on time
  // running the while loop surrounding the emulation code
  0xed, 0x43, 0xf0, 0x00, // 20 ld ($00f0),bc
  0xed, 0x53, 0xf2, 0x00, // 20 ld ($00f2),de
  0xed, 0x63, 0xf4, 0x00, // 20 ld ($00f4),hl
  0x03,                   //  6 inc bc
  0x78,                   //  4 ld a,b
  0xb1,                   //  4 or c
  0x20, 0x03,             // 12/7 jr nz,6
  0x13,                   //  6 inc de
  0x7a,                   //  4 ld a,d
  0xb3,                   //  4 or e
  0x20, 0x01,             // 12/7 jr nz,1
  0x23,                   //  6 inc hl
  0xdb, 0x01,             // 11 in a,(0x01)
  0xd3, 0x02,             // 11 out (0x02),a
  0xc3, 0x09, 0x00,       // 10 jp 9
  0x00, 0x00, 0x00,
  0x00, 0x00, 0x00,
  0x00, 0x00, 0x00,
  0x00, 0x00, 0x00,
  0x00, 0x00, 0x00,
  0x00, 0x00, 0x00,
  0x00, 0x00, 0x00
};

void initMemory() {
  for ( int i = 0; i < 65536; i++ ) {
    if ( i < 40 ) {
      memory[i] = ops[i];
    } else {
      memory[i] = 0;
    }
  }
}

/* Load bytes into memory starting at addr. */
static void load_bytes(uint16_t addr, const uint8_t *data, int len) {
    for (int i = 0; i < len; i++) {
        memory[addr + i] = data[i];
    }
}

/* Run the CPU for a specified number of steps. */
static int run_steps(int n) {
    int total = 0;
    for (int i = 0; i < n; i++) {
        total += z80_step(&cpu);
    }
    return total;
}

unsigned long ticks = 0;
void cpuStatus() {
  printf( "ticks: %d\n", ticks );
  printf( "pc: %04x\n", cpu.pc );
  printf( "00f0  %02x", memory[ 0x00f0 ] );
  printf( "%02x", memory[ 0x00f1 ] );
  printf( " %02x", memory[ 0x00f2 ] );
  printf( "%02x", memory[ 0x00f3 ] );
  printf( " %02x", memory[ 0x00f4 ] );
  printf( "%02x", memory[ 0x00f5 ] );
  printf( "\n" );
}

void setupIo() {
  initTermios(0);
}

void setupCpu() {
  reset();
}

void setupMemory() {
  initMemory();
}

void setup() {
  setupIo();
  setupCpu();
  setupMemory();
}

void loopIoOld() {
  char c;
  int num = read(0, &c, 1);
  if ( num > 0 ) {
    printf( "%d : %d\n", num, c );
  } else {
    //printf( "%d\n", num );
  }
}

void loopCpu() {
  ticks += run_steps( 100000 );
}

int loopCount = 0;
void loop() {
  while ( true ) {
    ioLoop();
    loopCpu();
    if ( ( loopCount++ % 1000 ) == 0 ) {
      cpuStatus();
    }
  }
}


/* ===================================================== */

int main(int argc, char **argv) {
  
  setup();
  loop();

  return 0;
  
}


