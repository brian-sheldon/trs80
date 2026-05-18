# Various TRS-80 and Z80 stuff

Currently, just holds a copy of the https://trsjs.48k.ca/ with any future modifications I make.  I haven't been doing much on this particular project as I have been focused on my M5Cardputer CP/M Emu System ( emu-sys repo ).  I did convert the disassembler from Javascript to C to use in the CP/M project.

I have started to figure out the structure of some of the TRS-80 Disk Image formats.  I currently have a small utility that reads through the entire disk image and checks the crcs.  This is primarily meant to test my understanding of image file.  The utility is "trs-js/bin/trs.dsk.js".  It is written in nodeJS and can be used as follows.

```
node trs.dsk [imagepath]               ; just displays the number of trks, trksize and final result of crc checks
node trs.dsk [imagepath] log           ; display one line of info for each sector block
node trs.dsk [imagepath] nolog 17 3    ; shows a single sector
```

This is the live demo of the code.  This page is actually multiple projects, the yet to be added to trs-80 emulator, an xterm for a cli to a monitor and a partially made software generated Altair 8800 Panel with random active leds.

https://brian-sheldon.github.io/trs80/



## trs-80 links

- https://trsjs.48k.ca/ - online emulator of the TRS-80 Model III

- https://github.com/lkesteloot/trs80
- https://www.my-trs-80.com/ide/ - online TRS-80 asm ide
- https://www.teamten.com/lawrence/projects/forth-interpreter/
- https://www.my-trs-80.com/#!runFile=xHNZeLu3X6tLVA4FoEX3
- https://www.youtube.com/watch?v=UmPeaTayUtc&t=11s

- https://www.trs-80.com/ - lots of info

## z80 links

- https://clrhome.org/table/
- https://www.zilog.com/docs/z80/um0080.pdf

## cp/m links

- https://github.com/udo-munk/z80pack

## sbc design links

- https://www.youtube.com/watch?v=M6H_8zzM6Rc - 555 one shot pulse that actually works
- https://retrocomputing.stackexchange.com/questions/12194/how-did-the-altair-8800-front-panel-load-the-program-counter
- https://www.youtube.com/watch?v=5NEpYXoAcFw
- https://www.youtube.com/watch?v=oekucjDcNbA&list=PL3by7evD3F51Cf9QnsAEdgSQ4cz7HQZX5&index=1
- https://www.youtube.com/watch?v=7F0tFx22_Vw


