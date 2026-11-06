# Rotating Arrows

A tiny GNOME Shell extension (GNOME 49–51): the `>` arrow on a Quick Settings item (Wi-Fi, Bluetooth, volume, power mode, Background Apps, …) turns smoothly into a `V` while its submenu is open, and turns back when it closes. It also works for items that other extensions add.

<img src="media/demo.webp" alt="Quick Settings arrows rotating into a V as the volume, Bluetooth and Background Apps submenus open and close" width="360">

([full-quality WebM](media/demo.webm))

Pairs well with [Glass Buttons](https://github.com/inxomnyaa/glass-buttons), but works on its own.

## Install

```sh
git clone https://github.com/inxomnyaa/rotating-arrows ~/.local/share/gnome-shell/extensions/rotating-arrows@inxomnyaa
# log out and back in, then:
gnome-extensions enable rotating-arrows@inxomnyaa
```
