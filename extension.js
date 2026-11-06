// Rotating Arrows
// The ">" arrows on quick settings items rotate to a "V" while their submenu is open
import Clutter from 'gi://Clutter';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const ROTATION_OPEN = 90;
const DURATION_MS = 200;

export default class RotatingArrows extends Extension {
    enable() {
        this._tracked = new Map(); // item -> {menu, id}
        this._grid = Main.panel.statusArea.quickSettings?.menu?._grid ?? null;
        if (!this._grid)
            return;

        for (const child of this._grid.get_children())
            this._track(child);

        // extensions add their quick settings items later
        this._childAddedId = this._grid.connect('child-added',
            (_grid, child) => this._track(child));
        this._childRemovedId = this._grid.connect('child-removed',
            (_grid, child) => this._untrack(child));
    }

    disable() {
        if (this._grid) {
            if (this._childAddedId)
                this._grid.disconnect(this._childAddedId);
            if (this._childRemovedId)
                this._grid.disconnect(this._childRemovedId);
        }
        for (const item of [...(this._tracked?.keys() ?? [])])
            this._untrack(item);
        this._childAddedId = this._childRemovedId = null;
        this._tracked = null;
        this._grid = null;
    }

    _arrowOf(item) {
        // normal menu toggles / sliders: separate arrow button
        let icon = item?._menuButton?.child;
        // "Background Apps": no menu button, the ">" is the toggle's own icon
        if (!icon && item?.has_style_class_name?.('background-apps-quick-toggle'))
            icon = item._icon;
        return icon instanceof Clutter.Actor ? icon : null;
    }

    _track(item) {
        if (this._tracked.has(item) || !item?.menu || !this._arrowOf(item))
            return;

        const id = item.menu.connect('open-state-changed', (_menu, isOpen) => {
            const arrow = this._arrowOf(item);
            if (!arrow)
                return;
            arrow.set_pivot_point(0.5, 0.5);
            arrow.ease({
                rotation_angle_z: isOpen ? ROTATION_OPEN : 0,
                duration: DURATION_MS,
                mode: Clutter.AnimationMode.EASE_OUT_QUAD,
            });
        });
        this._tracked.set(item, {menu: item.menu, id});
    }

    _untrack(item) {
        const entry = this._tracked?.get(item);
        if (!entry)
            return;
        try {
            entry.menu.disconnect(entry.id);
        } catch (_e) {
            // menu already destroyed
        }
        const arrow = this._arrowOf(item);
        if (arrow) {
            arrow.remove_all_transitions();
            arrow.rotation_angle_z = 0;
        }
        this._tracked.delete(item);
    }
}
